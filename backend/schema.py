import graphene
import shows.schema

class Query(shows.schema.Query, graphene.ObjectType):
    pass

schema = graphene.Schema(query=Query)