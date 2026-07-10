import random
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


def assign_nlm_ids(apps, schema_editor):
    User = apps.get_model('accounts', 'User')
    used_ids = set()
    for user in User.objects.all():
        while True:
            uid = f"NLM{random.randint(1000, 9999)}"
            if uid not in used_ids:
                used_ids.add(uid)
                user.user_id = uid
                user.save(update_fields=['user_id'])
                break


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        # Step 1: Add user_id as non-unique with blank default
        migrations.AddField(
            model_name='user',
            name='user_id',
            field=models.CharField(default='', editable=False, max_length=10),
            preserve_default=False,
        ),
        # Step 2: Populate unique NLM IDs for existing users
        migrations.RunPython(assign_nlm_ids, migrations.RunPython.noop),
        # Step 3: Now add unique constraint
        migrations.AlterField(
            model_name='user',
            name='user_id',
            field=models.CharField(editable=False, max_length=10, unique=True),
        ),
        migrations.CreateModel(
            name='StaffCredentials',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('department', models.CharField(choices=[('management', 'Management'), ('support', 'Support'), ('technical', 'Technical'), ('operations', 'Operations')], default='management', max_length=50)),
                ('employee_id', models.CharField(blank=True, max_length=20, unique=True)),
                ('access_level', models.PositiveSmallIntegerField(default=1)),
                ('last_login_ip', models.GenericIPAddressField(blank=True, null=True)),
                ('login_count', models.PositiveIntegerField(default=0)),
                ('last_password_changed', models.DateTimeField(auto_now_add=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='staff_credentials', to=settings.AUTH_USER_MODEL)),
            ],
            options={'verbose_name': 'Staff Credential', 'verbose_name_plural': 'Staff Credentials'},
        ),
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('transaction_type', models.CharField(choices=[('registration', 'Registration'), ('login', 'Login'), ('logout', 'Logout'), ('profile_update', 'Profile Update'), ('profile_view', 'Profile View'), ('expectation_update', 'Expectation Update'), ('photo_upload', 'Photo Upload'), ('account_deactivated', 'Account Deactivated'), ('account_activated', 'Account Activated'), ('role_changed', 'Role Changed')], max_length=30)),
                ('status', models.CharField(choices=[('success', 'Success'), ('failed', 'Failed'), ('pending', 'Pending')], default='success', max_length=10)),
                ('description', models.TextField(blank=True)),
                ('ip_address', models.GenericIPAddressField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='transactions', to=settings.AUTH_USER_MODEL)),
            ],
            options={'verbose_name': 'Transaction', 'verbose_name_plural': 'Transactions', 'ordering': ['-created_at']},
        ),
        migrations.CreateModel(
            name='UserCredentials',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('last_login_ip', models.GenericIPAddressField(blank=True, null=True)),
                ('login_count', models.PositiveIntegerField(default=0)),
                ('last_password_changed', models.DateTimeField(auto_now_add=True)),
                ('is_email_verified', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='credentials', to=settings.AUTH_USER_MODEL)),
            ],
            options={'verbose_name': 'User Credential', 'verbose_name_plural': 'User Credentials'},
        ),
    ]
