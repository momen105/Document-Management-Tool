from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
)
from .manager import UserManager
from core.model import BaseModel


class User(AbstractBaseUser, BaseModel, PermissionsMixin):
    """
    Custom User Model Class
    """

    name = models.CharField(max_length=100, blank=False)
    email = models.EmailField(unique=True)
    is_staff = models.BooleanField(
        verbose_name="Staff Status",
        default=False,
        help_text="Designate if the user has " "staff status",
    )
    is_superuser = models.BooleanField(
        verbose_name="Superuser Status",
        default=False,
        help_text="Designate if the " "user has superuser " "status",
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    class Meta:
        ordering = ["-id"]
