import graphene
from graphql_jwt.decorators import login_required, staff_member_required
from product.models import Product, FavoriteProduct
from .types import ProductType, CreateProductInput, UpdateProductInput


class CreateProduct(graphene.Mutation):
    class Arguments:
        input = CreateProductInput(required=True)

    success = graphene.Boolean()
    message = graphene.String()
    product = graphene.Field(ProductType)

    @staff_member_required
    def mutate(self, info, input):
        try:
            product = Product.objects.create(
                name=input.name,
                description=input.description,
                price=input.price,
                stock=input.stock,
                image_url=input.image_url or ""
            )

            return CreateProduct(
                success=True,
                message="Ürün başarıyla oluşturuldu.",
                product=product
            )

        except Exception as e:
            return CreateProduct(
                success=False,
                message=f"Ürün oluşturulurken hata: {str(e)}",
                product=None
            )


class UpdateProduct(graphene.Mutation):
    class Arguments:
        input = UpdateProductInput(required=True)

    success = graphene.Boolean()
    message = graphene.String()
    product = graphene.Field(ProductType)

    @staff_member_required
    def mutate(self, info, input):
        try:
            product = Product.objects.get(pk=input.id)
            
            if input.name:
                product.name = input.name
            if input.description:
                product.description = input.description
            if input.price:
                product.price = input.price
            if input.stock is not None:
                product.stock = input.stock
            if input.image_url is not None:
                product.image_url = input.image_url

            product.save()

            return UpdateProduct(
                success=True,
                message="Ürün başarıyla güncellendi.",
                product=product
            )

        except Product.DoesNotExist:
            return UpdateProduct(
                success=False,
                message="Ürün bulunamadı.",
                product=None
            )
        except Exception as e:
            return UpdateProduct(
                success=False,
                message=f"Ürün güncellenirken hata: {str(e)}",
                product=None
            )


class DeleteProduct(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()
    message = graphene.String()

    @staff_member_required
    def mutate(self, info, id):
        try:
            product = Product.objects.get(pk=id)
            product_name = product.name
            product.delete()

            return DeleteProduct(
                success=True,
                message=f"'{product_name}' ürünü başarıyla silindi."
            )

        except Product.DoesNotExist:
            return DeleteProduct(
                success=False,
                message="Ürün bulunamadı."
            )
        except Exception as e:
            return DeleteProduct(
                success=False,
                message=f"Ürün silinirken hata: {str(e)}"
            )


class AddFavorite(graphene.Mutation):
    class Arguments:
        product_id = graphene.ID(required=True)

    success = graphene.Boolean()
    message = graphene.String()

    @login_required
    def mutate(self, info, product_id):
        try:
            user = info.context.user
            product = Product.objects.get(pk=product_id)

            favorite, created = FavoriteProduct.objects.get_or_create(
                user=user,
                product=product
            )

            if created:
                return AddFavorite(
                    success=True,
                    message=f"'{product.name}' favorilere eklendi."
                )
            else:
                return AddFavorite(
                    success=False,
                    message="Bu ürün zaten favorilerinizde."
                )

        except Product.DoesNotExist:
            return AddFavorite(
                success=False,
                message="Ürün bulunamadı."
            )
        except Exception as e:
            return AddFavorite(
                success=False,
                message=f"Favori eklenirken hata: {str(e)}"
            )


class RemoveFavorite(graphene.Mutation):
    class Arguments:
        product_id = graphene.ID(required=True)

    success = graphene.Boolean()
    message = graphene.String()

    @login_required
    def mutate(self, info, product_id):
        try:
            user = info.context.user
            product = Product.objects.get(pk=product_id)

            favorite = FavoriteProduct.objects.filter(
                user=user,
                product=product
            ).first()

            if favorite:
                favorite.delete()
                return RemoveFavorite(
                    success=True,
                    message=f"'{product.name}' favorilerden çıkarıldı."
                )
            else:
                return RemoveFavorite(
                    success=False,
                    message="Bu ürün favorilerinizde değil."
                )

        except Product.DoesNotExist:
            return RemoveFavorite(
                success=False,
                message="Ürün bulunamadı."
            )
        except Exception as e:
            return RemoveFavorite(
                success=False,
                message=f"Favori çıkarılırken hata: {str(e)}"
            )


class ProductMutations(graphene.ObjectType):
    create_product = CreateProduct.Field()
    update_product = UpdateProduct.Field()
    delete_product = DeleteProduct.Field()
    add_favorite = AddFavorite.Field()
    remove_favorite = RemoveFavorite.Field()
