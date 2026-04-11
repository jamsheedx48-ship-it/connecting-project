from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import AdminLoginSerializer,AdminProductSerializer,AdminOrderListSerializer,AdminOrderDetailSerializer
from rest_framework.response import Response
from rest_framework import status
from .permissions import IsActiveAdmin
from products.models import Product
from orders.models import Order
from django.contrib.auth import get_user_model
from django.db.models import Sum
from django.db.models.functions import TruncMonth
from rest_framework.parsers import MultiPartParser,FormParser
from django.db.models import Q


User=get_user_model()
# Create your views here.

class AdminLoginView(APIView):    
    def post(self,request):
        serializer=AdminLoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.validated_data,status=status.HTTP_200_OK)

    #DASHBOARD
class AdminDashboardView(APIView):
    permission_classes=[IsActiveAdmin]

    def get(self,request):
        total_products=Product.objects.count()
        total_orders=Order.objects.count()
        total_users=User.objects.count()


        # Monthly Sales
        sales = (
            Order.objects
            .exclude(status="cancelled")  # optional (based on your model)
            .annotate(month=TruncMonth('created_at'))
            .values('month')
            .annotate(total_sales=Sum('total_price'))
            .order_by('month')
        )

        monthly_sales = [
            {
                "month": s["month"].strftime("%b %Y"),
                "sales": s["total_sales"] or 0
            }
            for s in sales
        ]

        return Response({
            "total_products": total_products,
            "total_orders": total_orders,
            "total_users": total_users,
            "monthly_sales": monthly_sales
        })
    
    #PRODUCTS

class AdminProductListView(APIView):
    parser_classes=[MultiPartParser,FormParser]
    permission_classes=[IsActiveAdmin]


    def get(self,request):
        category = request.GET.get("category")
        search = request.GET.get("search")
        
        products = Product.objects.filter(is_deleted=False).order_by("-created_at")

        if category and category!="all":
            products=products.filter(category_id=category)

        if search:
            products = products.filter(name__icontains=search)
    

        serializer=AdminProductSerializer(products,many=True)
        return Response(serializer.data) 

    def post(self,request):
        serializer=AdminProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)  
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)     
   
class AdminProductDetailView(APIView):
    def get(self,request,pk):
        try:
            product=Product.objects.get(id=pk,is_deleted=False)
        except Product.DoesNotExist:
            return Response({"error":"Product not found"}, status=status.HTTP_404_NOT_FOUND)    
        serializer = AdminProductSerializer(product)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def delete(self,request,pk):
        try:
            product=Product.objects.get(id=pk)
            product.is_deleted=True
            product.save()
            return Response({"message":"Product soft deleted"})
        except Product.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_400_BAD_REQUEST)
        
    def patch(self,request,pk):
        try:
            product=Product.objects.get(id=pk,is_deleted=False)
        except Product.DoesNotExist:
            return Response({"error":"Product not found"},status=status.HTTP_404_NOT_FOUND)  

        serializer= AdminProductSerializer(product,data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class AdminDeletedProductListView(APIView):
    permission_classes = [IsActiveAdmin]

    def get(self, request):
        products = Product.objects.filter(is_deleted=True)
        serializer = AdminProductSerializer(products, many=True)
        return Response(serializer.data)


class AdminRestoreProductView(APIView):
    permission_classes = [IsActiveAdmin]

    def post(self, request, pk):
        product = Product.objects.get(id=pk, is_deleted=True)
        product.is_deleted = False
        product.save()
        return Response({"message": "Restored"})


class AdminHardDeleteProductView(APIView):
    permission_classes = [IsActiveAdmin]

    def delete(self, request, pk):
        product = Product.objects.get(id=pk, is_deleted=True)
        product.delete()
        return Response({"message": "Deleted permanently"})

    #USERS

class AdminUserListView(APIView):
    permission_classes = [IsActiveAdmin]

    def get(self, request):
        users = User.objects.filter(is_deleted=False).values(
            "id", "username", "email", "is_active", "is_staff"
        )
        return Response(users)

class AdminUserDetailView(APIView):
    permission_classes = [IsActiveAdmin]

    def get(self, request, id):
        try:
            user = User.objects.get(id=id)

            orders = Order.objects.filter(user=user)

            total_spent = orders.aggregate(total=Sum("total_price"))["total"] or 0
            orders_count = orders.count()

            data = {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_active": user.is_active,
                "is_staff": user.is_staff,
                "date_joined": user.date_joined,
                "last_login": user.last_login,
                "orders_count": orders_count,
                "total_spent": total_spent,
            }

            return Response(data)

        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)        
    
class UpdateUserRoleView(APIView):
    permission_classes = [IsActiveAdmin]

    def patch(self, request, id):
        try:
            user = User.objects.get(id=id)

            # stop self edit
            if request.user.id == user.id:
                return Response({"error": "Cannot change your own role"}, status=400)

            if user.is_superuser:
                return Response({"error": "Not allowed"}, status=403)

            role = request.data.get("role")
            if role not in ["admin", "user"]:
                return Response({"error": "Invalid role"}, status=400)

            user.is_staff = True if role == "admin" else False
            user.save()

            return Response({"message": "Role updated"})

        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

#Block / Unblock user
class AdminToggleUserBlockView(APIView):
    permission_classes = [IsActiveAdmin]

    def patch(self, request, pk):
        user = User.objects.get(id=pk)
        user.is_active = not user.is_active
        user.save()

        return Response({
            "message": "User status updated",
            "is_active": user.is_active
        })
#soft-delete   
class AdminSoftDeleteUserView(APIView):
    permission_classes = [IsActiveAdmin]

    def patch(self, request, pk):
        try:
            user = User.objects.get(id=pk, is_deleted=False)
            user.is_deleted = True
            user.save()

            return Response({"message": "User soft deleted"})
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)   
         
#restore users           
class AdminRestoreUserView(APIView):
    permission_classes = [IsActiveAdmin]

    def patch(self, request, pk):
        user = User.objects.get(id=pk, is_deleted=True)
        user.is_deleted = False
        user.save()

        return Response({"message": "User restored"}) 
#trash  
class AdminDeletedUsersView(APIView):
    permission_classes = [IsActiveAdmin]

    def get(self, request):
        users = User.objects.filter(is_deleted=True)
        data = users.values("id", "username", "email")
        return Response(data)  
       
#hard-deleet     
class AdminHardDeleteUserView(APIView):
    permission_classes = [IsActiveAdmin]

    def delete(self, request, pk):
        try:
            user = User.objects.get(id=pk, is_deleted=True)
            user.delete()

            return Response({"message": "User permanently deleted"})
        except User.DoesNotExist:
            return Response({"error": "User not found or not deleted"}, status=404)    
    
    #ORDER

#listorders
class AdminOrderListView(APIView):
    permission_classes = [IsActiveAdmin]

    def get(self, request):
        search = request.GET.get("search")
        status = request.GET.get("status")
        date = request.GET.get("date")

        orders = Order.objects.all().order_by("-created_at")

        # search customer name
        if search:
            orders = orders.filter(
                Q(id__icontains=search) |
                Q(user__username__icontains=search)
            )

        # status filter
        if status and status != "all":
            orders = orders.filter(status=status)

        #date filter
        if date and date.strip():
            orders = orders.filter(created_at__date=date)

        serializer = AdminOrderListSerializer(orders, many=True)
        return Response(serializer.data)
    
#dropdown order status  
class AdminUpdateOrderStatusView(APIView):
    permission_classes = [IsActiveAdmin]

    def patch(self, request, pk):
        try:
            order = Order.objects.get(id=pk)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=404)
        
        if order.status == "cancelled":
                return Response(
                    {"error": "Cannot update status for cancelled orders"},
                    status=400)
        if order.status == "delivered":
            return Response(
             {"error": "Delivered orders cannot be modified"},
             status=400)
        
        new_status = request.data.get("status")
        if not new_status:
            return Response({"error":"Status is required"},status=status.HTTP_400_BAD_REQUEST)

        valid_status = [choice[0] for choice in Order.STATUS_CHOICES]

        if new_status not in valid_status:
            return Response({"error": "Invalid status"}, status=400)

        order.status = new_status
        order.save()

        return Response({
            "message": "Status updated",
            "status": order.status
        })
#orderdetials page
class AdminOrderDetailView(APIView):
    permission_classes = [IsActiveAdmin]

    def get(self, request, pk):
        try:
            order = Order.objects.get(id=pk)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=404)

        serializer = AdminOrderDetailSerializer(order)
        return Response(serializer.data)    

class AdminUpdatePaymentStatusView(APIView):
    permission_classes = [IsActiveAdmin]

    def patch(self, request, id):
        try:
            order = Order.objects.get(id=id)

            payment_status = request.data.get("payment_status")

            if payment_status not in ["pending", "paid", "failed"]:
                return Response(
                    {"error": "Invalid payment status"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            order.payment_status = payment_status
            order.save()

            return Response({"message": "Payment status updated"})

        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found"},
                status=status.HTTP_404_NOT_FOUND
            )        