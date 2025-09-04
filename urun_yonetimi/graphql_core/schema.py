import graphene
import graphql_jwt
from account.graphql.queries import AccountQueries
from account.graphql.mutations import AccountMutations
from product.graphql.queries import ProductQueries
from product.graphql.mutations import ProductMutations


class Query(AccountQueries, ProductQueries, graphene.ObjectType):
    ping = graphene.String()

    def resolve_ping(root, info):
        return "pong"


class Mutation(AccountMutations, ProductMutations, graphene.ObjectType):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)


