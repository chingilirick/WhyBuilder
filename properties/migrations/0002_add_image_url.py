from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ('properties', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='property',
            name='image_url',
            field=models.CharField(max_length=500, blank=True, null=True),
        ),
    ]
