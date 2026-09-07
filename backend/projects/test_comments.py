import pytest
from rest_framework.test import APIClient

from projects.models import Membership, Project, Task, TaskComment
from users.models import User


@pytest.fixture
def client():
    return APIClient()


@pytest.fixture
def owner(db):
    return User.objects.create_user(email='comment-owner@example.com', name='Owner', password='password123')


def login(client, user):
    response = client.post('/api/auth/login', {'email': user.email, 'password': 'password123'}, format='json')
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {response.data['token']}")


@pytest.mark.django_db
class TestTaskComments:
    def test_members_can_read_oldest_first_and_post(self, client, owner):
        member = User.objects.create_user(email='comment-member@example.com', name='Member', password='password123')
        project = Project.objects.create(name='P', owner=owner)
        Membership.objects.create(user=owner, project=project, role='admin')
        Membership.objects.create(user=member, project=project, role='member')
        task = Task.objects.create(project=project, title='Task', created_by=owner)

        TaskComment.objects.create(task=task, author=owner, body='first')
        TaskComment.objects.create(task=task, author=member, body='second')
        login(client, member)

        response = client.get(f'/api/tasks/{task.id}/comments')
        assert response.status_code == 200
        assert [comment['body'] for comment in response.data['comments']] == ['first', 'second']

        response = client.post(f'/api/tasks/{task.id}/comments', {'body': 'third'}, format='json')
        assert response.status_code == 201
        assert response.data['comment']['author']['id'] == str(member.id)
        assert response.data['comment']['createdAt']
        assert TaskComment.objects.filter(task=task).count() == 3

    def test_viewers_can_read_but_cannot_post(self, client, owner):
        viewer = User.objects.create_user(email='comment-viewer@example.com', name='Viewer', password='password123')
        project = Project.objects.create(name='P', owner=owner)
        Membership.objects.create(user=owner, project=project, role='admin')
        Membership.objects.create(user=viewer, project=project, role='viewer')
        task = Task.objects.create(project=project, title='Task', created_by=owner)
        login(client, viewer)

        assert client.get(f'/api/tasks/{task.id}/comments').status_code == 200
        assert client.post(f'/api/tasks/{task.id}/comments', {'body': 'nope'}, format='json').status_code == 403

    def test_non_members_cannot_read_or_post(self, client, owner):
        outsider = User.objects.create_user(email='comment-outsider@example.com', name='Outsider', password='password123')
        project = Project.objects.create(name='P', owner=owner)
        Membership.objects.create(user=owner, project=project, role='admin')
        task = Task.objects.create(project=project, title='Task', created_by=owner)
        login(client, outsider)

        assert client.get(f'/api/tasks/{task.id}/comments').status_code == 403
        assert client.post(f'/api/tasks/{task.id}/comments', {'body': 'nope'}, format='json').status_code == 403

    def test_comments_are_append_only_and_body_must_not_be_blank(self, client, owner):
        project = Project.objects.create(name='P', owner=owner)
        Membership.objects.create(user=owner, project=project, role='admin')
        task = Task.objects.create(project=project, title='Task', created_by=owner)
        login(client, owner)

        assert client.post(f'/api/tasks/{task.id}/comments', {'body': '   '}, format='json').status_code == 400
        comment = TaskComment.objects.create(task=task, author=owner, body='fixed')
        assert client.patch(f'/api/tasks/{task.id}/comments', {'body': 'changed'}, format='json').status_code == 405
        assert client.delete(f'/api/tasks/{task.id}/comments').status_code == 405
        comment.refresh_from_db()
        assert comment.body == 'fixed'