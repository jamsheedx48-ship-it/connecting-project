from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Wallet(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="wallet")
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"{self.user.username} - {self.balance}"
    
class WalletTransaction(models.Model):
    TRANSACTION_TYPE = (
        ("credit", "Credit"),
        ("debit", "Debit"),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPE)
    description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)    

    class Meta:
        ordering=["-created_at"]