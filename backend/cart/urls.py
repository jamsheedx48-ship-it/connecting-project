from django.urls import path
from . import views
urlpatterns=[
    path("add/",views.AddToCartView.as_view()),
    path("",views.CartView.as_view()),
    path("remove/<int:id>/",views.RemoveCartItemView.as_view()),
    path("update/<int:id>/",views.UpdateCartItemView.as_view())
]