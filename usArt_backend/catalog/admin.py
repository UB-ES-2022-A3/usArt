from django.contrib import admin
from catalog import models

# Register your models here.

@admin.register(models.Publication)
class PublicationAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'price', 'review', 'author')

admin.site.register(models.PublicationImage)
