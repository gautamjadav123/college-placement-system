from rest_framework.permissions import BasePermission


class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, 'profile') and request.user.profile.role == 'student'


class IsCompany(BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, 'profile') and request.user.profile.role == 'company'


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, 'profile') and request.user.profile.role == 'admin'


class IsCompanyOrAdmin(BasePermission):
    def has_permission(self, request, view):
        if not hasattr(request.user, 'profile'):
            return False
        return request.user.profile.role in ('company', 'admin')
