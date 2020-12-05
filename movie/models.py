from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Comment(models.Model):
    content = models.TextField()
    timeStamp = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="posts")