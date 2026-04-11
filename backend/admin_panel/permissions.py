from rest_framework.permissions import BasePermission
from rest_framework.exceptions import PermissionDenied


class IsActiveAdmin(BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False  # 401

        if not request.user.is_active:
            raise PermissionDenied("Account blocked")  # 403

        if not request.user.is_staff:
            raise PermissionDenied("Not an admin")

        return True