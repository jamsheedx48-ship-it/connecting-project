from django.urls import path
from . import views
urlpatterns = [
    path("",views.UserOrdersView.as_view()),
    path('create/',views.CreateOrderView.as_view()),
    path('buy-now/',views.BuyNowView.as_view()),
    path('<int:order_id>/',views.OrderDetailView.as_view())
]
