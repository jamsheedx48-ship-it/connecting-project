from django.db import models

# Create your models here.

class Product(models.Model):
    name=models.CharField(max_length=200)
    type=models.CharField(max_length=100)
    price=models.DecimalField(max_digits=10,decimal_places=2)
    image=models.TextField()
    stock=models.PositiveIntegerField(default=1)
    category=models.CharField(max_length=100)
    featured=models.BooleanField(default=False)
    created_at=models.DateField(auto_now_add=True)

    def __str__(self):
        return self.name