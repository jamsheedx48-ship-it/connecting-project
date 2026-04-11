from django.db import models
from cloudinary.models import CloudinaryField
# Create your models here.



class Category(models.Model):
    name=models.CharField(max_length=100)

    def __str__(self):
        return self.name 
    
class Product(models.Model):
    name=models.CharField(max_length=200)
    type=models.CharField(max_length=100)
    price=models.DecimalField(max_digits=10,decimal_places=2)
    image=CloudinaryField('image')
    stock=models.PositiveIntegerField(default=1)
    category=models.ForeignKey(Category,on_delete=models.CASCADE)
    featured=models.BooleanField(default=False)
    created_at=models.DateField(auto_now_add=True)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.name
    