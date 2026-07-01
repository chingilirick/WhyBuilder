from rest_framework import permissions


class IsLandlordOwner(permissions.BasePermission):
    """
    Allows access only to the landlord who owns the property,
    or an administrator.
    """

    def has_object_permission(self, request, view, obj):
        if request.user.account_type == 'administrator':
            return True
        return obj.landlord_id == request.user.id


class IsAdministrator(permissions.BasePermission):
    """
    Allows access only to users with account_type == 'administrator'.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.account_type == 'administrator'
        )
