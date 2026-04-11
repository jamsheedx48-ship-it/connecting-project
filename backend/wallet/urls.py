from django.urls import path
from .views import WalletView, WalletTransactionView, WalletPayView

urlpatterns = [
    path("", WalletView.as_view()),
    path("transactions/", WalletTransactionView.as_view()),
    path("pay/", WalletPayView.as_view()),
]