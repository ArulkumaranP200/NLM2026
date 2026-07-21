from django.db import migrations


def rename_nlm_to_utm(apps, schema_editor):
    User = apps.get_model('accounts', 'User')
    for user in User.objects.filter(user_id__startswith='NLM'):
        new_id = 'UTM' + user.user_id[3:]
        if User.objects.filter(user_id=new_id).exists():
            continue
        user.user_id = new_id
        user.save(update_fields=['user_id'])


def rename_utm_to_nlm(apps, schema_editor):
    User = apps.get_model('accounts', 'User')
    for user in User.objects.filter(user_id__startswith='UTM'):
        new_id = 'NLM' + user.user_id[3:]
        if User.objects.filter(user_id=new_id).exists():
            continue
        user.user_id = new_id
        user.save(update_fields=['user_id'])


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_alter_transaction_transaction_type'),
    ]

    operations = [
        migrations.RunPython(rename_nlm_to_utm, rename_utm_to_nlm),
    ]
