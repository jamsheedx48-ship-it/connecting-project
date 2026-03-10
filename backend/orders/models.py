from django.db import models
from django.contrib.auth import get_user_model
from products.models import Product
User=get_user_model()
# Create your models here.

class Order(models.Model):
    user= models.ForeignKey(User,on_delete=models.CASCADE)
    created_at=models.DateTimeField(auto_now_add=True)
    total_price=models.DecimalField(max_digits=10,decimal_places=2)
    status= models.CharField(max_length=20,default="Pending")

    def __str__(self):
        return f"Order {self.id} - {self.user.username}"
    
class OrderItem(models.Model):
    order= models.ForeignKey(Order,on_delete=models.CASCADE,related_name='items')
    product= models.ForeignKey(Product,on_delete=models.CASCADE)
    quantity=models.IntegerField()
    price=models.DecimalField(max_digits=10,decimal_places=2)

    def __str__(self):
        return self.product.name
