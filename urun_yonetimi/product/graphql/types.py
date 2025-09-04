import graphene
from graphene_django import DjangoObjectType
from product.models import Product, FavoriteProduct


class ProductType(DjangoObjectType):
    class Meta:
        model = Product
        fields = ("id", "name", "description", "price", "stock", "image_url", "created_at", "updated_at")


class FavoriteProductType(DjangoObjectType):
    class Meta:
        model = FavoriteProduct
        fields = ("id", "user", "product", "created_at")


class CreateProductInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    description = graphene.String(required=True)
    price = graphene.Decimal(required=True)
    stock = graphene.Int(required=True)
    image_url = graphene.String()


class UpdateProductInput(graphene.InputObjectType):
    id = graphene.ID(required=True)
    name = graphene.String()
    description = graphene.String()
    price = graphene.Decimal()
    stock = graphene.Int()
    image_url = graphene.String()
