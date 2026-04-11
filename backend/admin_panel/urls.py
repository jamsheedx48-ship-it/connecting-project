from django.urls import path
from . import views
urlpatterns = [
    #auth
    path("login/",views.AdminLoginView.as_view(),name="admin-login"),
    path("dashboard/",views.AdminDashboardView.as_view(),name="admin-dashboard"),
    #products
    path("products/",views.AdminProductListView.as_view(),name="admin-products"),
    path("products/<int:pk>/",views.AdminProductDetailView.as_view(),name="admin-products-single"),
    path("products/delete/<int:pk>/",views.AdminProductDetailView.as_view(),name="admin-products-delete"),
    path("products/update/<int:pk>/", views.AdminProductDetailView.as_view(), name="admin-product-update"),
    path("products/deleted/",views.AdminDeletedProductListView.as_view(),name="admin-products-deleted"),
    path("products/restore/<int:pk>/",views.AdminRestoreProductView.as_view(),name="admin-products-restore"),
    path("products/hard-delete/<int:pk>/",views.AdminHardDeleteProductView.as_view(),name="admin-products-hard-deleted"),
    #users
    path("users/",views.AdminUserListView.as_view()),
    path("users/<int:id>/",views.AdminUserDetailView.as_view()),
    path("users/role/<int:id>/", views.UpdateUserRoleView.as_view()),
    path("users/block/<int:pk>/",views.AdminToggleUserBlockView.as_view()),
    path("users/delete/<int:pk>/",views.AdminSoftDeleteUserView.as_view()),
    path("users/trash/",views.AdminDeletedUsersView.as_view()),
    path("users/restore/<int:pk>/",views.AdminRestoreUserView.as_view()),
    path("users/hard-delete/<int:pk>/",views.AdminHardDeleteUserView.as_view()),
    #order
    path("orders/",views.AdminOrderListView.as_view()),
    path("orders/<int:pk>/",views.AdminOrderDetailView.as_view()),
    path("orders/<int:pk>/status/",views.AdminUpdateOrderStatusView.as_view()),
    path("orders/<int:id>/payment/",views.AdminUpdatePaymentStatusView.as_view()),
    
    
]
