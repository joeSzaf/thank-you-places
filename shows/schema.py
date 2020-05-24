import graphene
from graphene_django import DjangoObjectType

from .models import Show

class ShowType(DjangoObjectType):
    class Meta:
        model = Show

class Query(graphene.ObjectType):
    shows = graphene.List(ShowType)

    def resolve_shows(self, info):
        return Show.objects.all()