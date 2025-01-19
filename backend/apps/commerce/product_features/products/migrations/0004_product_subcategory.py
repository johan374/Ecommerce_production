# Generated by Django 4.2.17 on 2025-01-14 19:01

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('subcategories', '0002_alter_subcategory_unique_together_and_more'),
        ('products', '0003_alter_productimage_options_alter_productimage_image_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='subcategory',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='products', to='subcategories.subcategory'),
        ),
    ]
