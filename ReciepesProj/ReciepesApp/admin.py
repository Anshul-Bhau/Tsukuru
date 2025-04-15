from django.contrib import admin
from django.contrib.auth import get_user_model
from .models import *
from .resources import *
from import_export.admin import ImportExportModelAdmin


Users = get_user_model()

@admin.register(Users)
class UsersAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role', 'is_staff', 'is_active')
    search_fields = ('username', 'email')
    list_filter = ('is_staff', 'is_active', 'role')
    ordering = ('username',)

@admin.register(Recipes)
class RecipesAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    list_display = ('title', 'NER')
    search_fields = ('title',)
    resource_class = RecipesResource
