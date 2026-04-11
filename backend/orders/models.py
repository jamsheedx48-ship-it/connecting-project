from django.db import models
from django.contrib.auth import get_user_model
from products.models import Product
User=get_user_model()
# Create your models here.

class Order(models.Model):
    STATUS_CHOICES=[
        ("pending","Pending"),
        ("processing","processing"),
        ("shipped","shipped"),
        ("delivered","Delivered"),
        ("cancelled","Cancelled"),
    ]

    PAYMENT_METHODS=[
        ("COD","Cash On Delivery"),
        ("UPI","UPI"),
        ("CARD","CARD"),
        ("WALLET","WALLET"),
    ]
    user= models.ForeignKey(User,on_delete=models.CASCADE)

    status= models.CharField(max_length=20,default="pending",choices=STATUS_CHOICES)
    payment_method=models.CharField(max_length=20,choices=PAYMENT_METHODS)
    payment_channel = models.CharField(max_length=20,null=True,blank=True)
    payment_status = models.CharField(
    max_length=20,
    choices=[
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("failed", "Failed"),
        ("refunded", "Refunded"),
    ],
    default="pending"
)
    #address
    name=models.CharField(max_length=100,null=True,blank=True)
    address=models.TextField(null=True,blank=True)
    state=models.CharField(max_length=100,null=True,blank=True)
    city=models.CharField(max_length=100,null=True,blank=True)
    phone=models.CharField(max_length=15,null=True,blank=True)

    total_price=models.DecimalField(max_digits=10,decimal_places=2)
    created_at=models.DateTimeField(auto_now_add=True)

    

    def __str__(self):
        return f"Order {self.id} - {self.user.username}"
    
class OrderItem(models.Model):
    order= models.ForeignKey(Order,on_delete=models.CASCADE,related_name='items')
    product= models.ForeignKey(Product,on_delete=models.CASCADE)
    quantity=models.IntegerField()
    price=models.DecimalField(max_digits=10,decimal_places=2)

    def __str__(self):
        return self.product.name
