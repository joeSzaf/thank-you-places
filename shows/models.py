from django.db import models

from django.contrib.auth import get_user_model

# Create your models here.
class Show(models.Model):
    title = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    url = models.URLField()
    start_time = models.DateTimeField()
    duration = models.PositiveIntegerField(default=60) # minutes
    created_at = models.DateTimeField(auto_now_add=True)
    posted_by = models.ForeignKey(get_user_model(), null=True, on_delete=models.CASCADE)