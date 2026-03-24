from django.db.models.signals import pre_save
from django.dispatch import receiver
from .models import Order

@receiver(pre_save,sender=Order)
def handle_stock_on_status_change(sender,instance,**kwargs):
    if not instance.pk:
        return
    
    try:
        old_order=Order.objects.get(pk=instance.pk)
    except Order.DoesNotExist:
        return

    if old_order.status !="processing" and instance.status=="processing":
        for item in instance.items.all():
            product=item.product
            if product.stock >= item.quantity:
                product.stock-=item.quantity
                product.save() 

    if old_order.status=="processing" and instance.status=="cancelled":
        for item in instance.items.all():
            product=item.product
            product.stock += item.quantity
            product.save()    