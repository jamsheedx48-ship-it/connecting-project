from django.shortcuts import render
from accounts.permissions import IsActiveUser
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsActiveUser
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import WalletTransactionSerializer
from .models import Wallet,WalletTransaction
from django.shortcuts import get_object_or_404
from cart.models import Cart,CartItem
# Create your views here.



class WalletView(APIView):
    permission_classes = [IsAuthenticated,IsActiveUser]

    def get(self, request):
        wallet, _ = Wallet.objects.get_or_create(user=request.user)

        return Response({
            "balance": wallet.balance
        })

class WalletTransactionView(APIView):
    permission_classes = [IsAuthenticated,IsActiveUser]

    def get(self, request):
        transactions = WalletTransaction.objects.filter(
            user=request.user
        ).order_by("-created_at")

        serializer = WalletTransactionSerializer(transactions, many=True)

        return Response(serializer.data)    
    
from rest_framework import status
from .models import Wallet, WalletTransaction
from orders.models import Order

class WalletPayView(APIView):
    permission_classes = [IsAuthenticated, IsActiveUser]

    def post(self, request):
        order_id = request.data.get("order_id")

        order = get_object_or_404(Order, id=order_id, user=request.user)

        # ❌ Already paid check
        if order.payment_status in ["paid", "refunded"]:
            return Response({"error": "Order already processed"}, status=400)

        wallet = Wallet.objects.get(user=request.user)

        # ❌ Balance check
        if wallet.balance < order.total_price:
            return Response({"error": "Insufficient wallet balance"}, status=400)

        # ✅ Deduct wallet
        wallet.balance -= order.total_price
        wallet.save()

        # ✅ Update order
        order.payment_status = "paid"
        order.status = "processing"
        order.payment_method = "WALLET"
        order.save()

        # ✅ Transaction
        WalletTransaction.objects.create(
            user=request.user,
            amount=order.total_price,
            transaction_type="debit",
            description=f"Payment for order #{order.id}"
        )

        # ✅ Clear cart (same as Razorpay)
        cart = Cart.objects.filter(user=request.user).first()
        if cart:
            CartItem.objects.filter(cart=cart).delete()

        return Response({
            "message": "Paid successfully using wallet",
            "remaining_balance": wallet.balance
        })