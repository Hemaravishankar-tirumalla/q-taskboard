import json
from unittest.mock import patch

import pytest
from rest_framework.test import APIClient

from users.models import User
from projects.models import Membership, Project, Task


@pytest.fixture
def client():
    return APIClient()


@pytest.fixture
def user(db):
    return User.objects.create_user(email='exporter@example.com', name='Exporter', password='password123')


@pytest.fixture
def auth_client(client, user):
    response = client.post('/api/auth/login', {'email': 'exporter@example.com', 'password': 'password123'}, format='json')
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {response.data['token']}")
    return client


@pytest.mark.django_db
class TestExport:
    def test_export_requires_project_membership(self, client, user):
        owner = User.objects.create_user(email='owner@example.com', name='Owner', password='password123')
        project = Project.objects.create(name='P', owner=owner)
        Membership.objects.create(user=owner, project=project, role='admin')
        task = Task.objects.create(project=project, title='Task 1', created_by=owner)

        resp = client.post('/api/auth/login', {'email': 'exporter@example.com', 'password': 'password123'}, format='json')
        client.credentials(HTTP_AUTHORIZATION=f"Bearer {resp.data['token']}")

        with patch('projects.views.urllib_request.urlopen') as mocked:
            response = client.post(f'/api/projects/{project.id}/export', format='json')

        assert response.status_code == 403
        mocked.assert_not_called()

    def test_export_calls_internal_exporter_and_returns_payload(self, auth_client, user, monkeypatch):
        project = Project.objects.create(name='P', owner=user)
        Membership.objects.create(user=user, project=project, role='member')
        task = Task.objects.create(project=project, title='Task 1', description='Ready', created_by=user)

        class FakeResponse:
            status = 200
            def read(self):
                return json.dumps({'ok': True, 'exported': 1, 'projectId': str(project.id)}).encode('utf-8')
            def __enter__(self):
                return self
            def __exit__(self, exc_type, exc, tb):
                return False

        fake_urlopen = lambda req, timeout=20: FakeResponse()
        monkeypatch.setenv('EXPORTER_SERVICE_URL', 'http://exporter.internal/export')
        monkeypatch.setenv('EXPORTER_INTERNAL_TOKEN', 'secret-token')

        with patch('projects.views.urllib_request.urlopen', side_effect=fake_urlopen):
            response = auth_client.post(f'/api/projects/{project.id}/export', format='json')

        assert response.status_code == 200
        assert response.data['ok'] is True
        assert response.data['exported'] == 1
        assert response.data['projectId'] == str(project.id)

    def test_export_rejects_viewers(self, client, user):
        owner = User.objects.create_user(email='owner@example.com', name='Owner', password='password123')
        project = Project.objects.create(name='P', owner=owner)
        Membership.objects.create(user=owner, project=project, role='admin')
        Membership.objects.create(user=user, project=project, role='viewer')

        resp = client.post('/api/auth/login', {'email': 'exporter@example.com', 'password': 'password123'}, format='json')
        client.credentials(HTTP_AUTHORIZATION=f"Bearer {resp.data['token']}")

        with patch('projects.views.urllib_request.urlopen') as mocked:
            response = client.post(f'/api/projects/{project.id}/export', format='json')

        assert response.status_code == 403
        mocked.assert_not_called()
