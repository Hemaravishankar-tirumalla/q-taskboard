import uuid

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('projects', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='TaskComment',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('body', models.TextField(max_length=5000)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('author', models.ForeignKey(
                    on_delete=django.db.models.deletion.PROTECT,
                    related_name='task_comments',
                    to=settings.AUTH_USER_MODEL,
                )),
                ('task', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='comments',
                    to='projects.task',
                )),
            ],
            options={'db_table': 'task_comments'},
        ),
        migrations.AddIndex(
            model_name='taskcomment',
            index=models.Index(fields=['task', 'created_at'], name='task_commen_task_id_413a08_idx'),
        ),
    ]