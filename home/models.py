from django.db import models
from core.model import BaseModel
import os
from user.models import User

class DocumentModel(models.Model):
    """
    Model for DocumentModel
    """

    access_type_choices = (
        ("viewer", "viewer"),
        ("editor", "editor"),
    )
  

    files = models.FileField(upload_to="files")
    file_owner = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="file_owner"
    )
    access_user = models.ManyToManyField(User, blank=True)
    access_anyone = models.BooleanField(default=False)
    access_type = models.CharField(
        max_length=25,
        choices=access_type_choices,
        null=True,
        blank=True,
    )
