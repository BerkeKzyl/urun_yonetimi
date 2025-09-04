import graphene
from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
import graphql_jwt
from account.models import CustomUser
from .types import UserType, CreateUserInput, LoginInput


class RegisterUser(graphene.Mutation):
    class Arguments:
        input = CreateUserInput(required=True)

    success = graphene.Boolean()
    message = graphene.String()
    user = graphene.Field(UserType)

    def mutate(self, info, input):
        try:
            if CustomUser.objects.filter(email=input.email).exists():
                return RegisterUser(
                    success=False,
                    message="Bu email adresi zaten kullanılıyor.",
                    user=None
                )

            if CustomUser.objects.filter(username=input.username).exists():
                return RegisterUser(
                    success=False,
                    message="Bu kullanıcı adı zaten kullanılıyor.",
                    user=None
                )

            validate_password(input.password)

            user = CustomUser.objects.create_user(
                username=input.username,
                email=input.email,
                password=input.password,
                first_name=input.first_name or "",
                last_name=input.last_name or ""
            )

            return RegisterUser(
                success=True,
                message="Kullanıcı başarıyla oluşturuldu.",
                user=user
            )

        except ValidationError as e:
            return RegisterUser(
                success=False,
                message=f"Şifre hatası: {e.messages[0]}",
                user=None
            )
        except Exception as e:
            return RegisterUser(
                success=False,
                message=f"Beklenmeyen hata: {str(e)}",
                user=None
            )


class LoginUser(graphene.Mutation):
    class Arguments:
        input = LoginInput(required=True)

    success = graphene.Boolean()
    message = graphene.String()
    token = graphene.String()
    user = graphene.Field(UserType)

    def mutate(self, info, input):
        try:
            try:
                user = CustomUser.objects.get(email=input.email)
            except CustomUser.DoesNotExist:
                return LoginUser(
                    success=False,
                    message="Email adresi veya şifre hatalı.",
                    token=None,
                    user=None
                )

            # Şifre kontrolü manuel olarak
            if not user.check_password(input.password):
                return LoginUser(
                    success=False,
                    message="Email adresi veya şifre hatalı.",
                    token=None,
                    user=None
                )

            from django.conf import settings
            import jwt
            
            payload = {
                'user_id': user.id,
                'username': user.username,
                'email': user.email,
            }
            token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

            return LoginUser(
                success=True,
                message="Giriş başarılı.",
                token=token,
                user=user
            )

        except Exception as e:
            return LoginUser(
                success=False,
                message=f"Beklenmeyen hata: {str(e)}",
                token=None,
                user=None
            )


class AccountMutations(graphene.ObjectType):
    register_user = RegisterUser.Field()
    login_user = LoginUser.Field()
