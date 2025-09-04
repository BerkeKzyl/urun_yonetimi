import graphene
from graphql_jwt.decorators import login_required
from product.models import Product, FavoriteProduct
from .types import ProductType, FavoriteProductType


class ProductQueries(graphene.ObjectType):
    products = graphene.List(ProductType)
    product = graphene.Field(ProductType, id=graphene.ID(required=True))
    favorite_products = graphene.List(ProductType)

    def resolve_products(self, info):
        """
        Tüm ürünlerin listesini döndürür
        Herkese açık
        """
        return Product.objects.all().order_by('-created_at')

    def resolve_product(self, info, id):
        """
        ID'ye göre tek ürün döndürür
        Herkese açık
        """
        try:
            return Product.objects.get(pk=id)
        except Product.DoesNotExist:
            return None

    @login_required
    def resolve_favorite_products(self, info):
        """
        Giriş yapan kullanıcının favori ürünlerini döndürür
        JWT token gerektirir
        """
        user = info.context.user
        favorite_products = FavoriteProduct.objects.filter(user=user).select_related('product')
        return [fav.product for fav in favorite_products]
