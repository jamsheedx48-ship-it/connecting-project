from django.db import models
from django.contrib.auth import get_user_model
from products.models import Product
User=get_user_model()
# Create your models here.


class Cart(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    created_at=models.DateField(auto_now_add=True)
    
    def __str__(self):
        return self.user.username

class CartItem(models.Model):
    cart=models.ForeignKey(Cart,on_delete=models.CASCADE,related_name="items") 
    product=models.ForeignKey(Product,on_delete=models.CASCADE)
    quantity=models.IntegerField(default=1)
    
    def __str__(self):
        return self.product.name