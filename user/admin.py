from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from user.models import *


# Register your models here.
class UserAdmin(BaseUserAdmin):

    list_display = ["id", "name", "email"]
    fieldsets = [
        (None, {"fields": ["password", "created_at", "updated_at"]}),
        (
            "Personal info",
            {"fields": ["name", "email"]},  # Removed duplicate "phone" field
        ),
        (
            "Permissions",
            {
                "fields": [
                    "is_superuser",
                    "is_active",
                    "is_staff",
                ]
            },
        ),
    ]

    search_fields = ["name"]

    ordering = ["-created_at"]

    readonly_fields = ["created_at", "updated_at"]


# Now register the new UserAdmin...
admin.site.register(User, UserAdmin)
