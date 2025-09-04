import graphene
from graphql_jwt.decorators import login_required, staff_member_required
from account.models import CustomUser
from .types import UserType


class AccountQueries(graphene.ObjectType):
    me = graphene.Field(UserType)
    users = graphene.List(UserType)
    user = graphene.Field(UserType, id=graphene.ID(required=True))

    @login_required
    def resolve_me(self, info):
        """
        Giriş yapan kullanıcının kendi bilgilerini döndürür
        JWT token ile yetkilendirme gerektirir
        """
        return info.context.user

    @staff_member_required
    def resolve_users(self, info):
        """
        Tüm kullanıcıların listesini döndürür
        Sadece yöneticiler (is_staff=True) erişebilir
        """
        return CustomUser.objects.all()

    def resolve_user(self, info, id):
        """
        ID'ye göre tek kullanıcı döndürür
        Herkese açık (demo için)
        """
        try:
            return CustomUser.objects.get(pk=id)
        except CustomUser.DoesNotExist:
            return None
