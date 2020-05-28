import graphene
from graphene_django import DjangoObjectType
from graphql import GraphQLError
from django.db.models import Q

from .models import Show
from users.schema import UserType

class ShowType(DjangoObjectType):
    class Meta:
        model = Show

class Query(graphene.ObjectType):
    shows = graphene.List(ShowType, search=graphene.String())

    def resolve_shows(self, info, search=None):
        if search:
            filter = (
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(url__icontains=search) |
                Q(posted_by__username__icontains=search)
            )
            return Show.objects.filter(filter)

        return  Show.objects.all()

class CreateShow(graphene.Mutation):
    show = graphene.Field(ShowType)

    class Arguments:
        title = graphene.String()
        description = graphene.String()
        url = graphene.String()
        start_time = graphene.DateTime()
        duration = graphene.String()

    def mutate(self, info, title, description, url, start_time, duration):
        user = info.context.user

        if user.is_anonymous:
            raise GraphQLError('Log in to add a show.')
        
        show = Show(title=title, description=description, url=url, start_time=start_time, duration=duration, posted_by=user)
        show.save()
        return CreateShow(show=show)

class UpdateShow(graphene.Mutation):
    show = graphene.Field(ShowType)

    class Arguments:
        show_id = graphene.Int(required=True)
        title = graphene.String()
        description = graphene.String()
        url = graphene.String()
        start_time = graphene.DateTime()
        duration = graphene.String()

    def mutate(self, info, show_id, title, url, description, start_time, duration):
        user = info.context.user
        show = Show.objects.get(id=show_id)

        if show.posted_by != user:
            raise GraphQLError('Not permitted to update this show.')

        show.title = title
        show.description = description
        show.url = url
        show.start_time = start_time
        show.duration = duration

        show.save()

        return UpdateShow(show=show)

class DeleteShow(graphene.Mutation):
    show_id = graphene.Int()

    class Arguments:
        show_id = graphene.Int(required=True)

    def mutate(self, info, show_id):
        user = info.context.user
        show = Show.objects.get(id=show_id)

        if show.posted_by != user:
            raise GraphQLError('Not permitted to delete this show.')

        show.delete()

        return DeleteShow(show_id=show_id)

class Mutation(graphene.ObjectType):
    create_show = CreateShow.Field()
    update_show = UpdateShow.Field()
    delete_show = DeleteShow.Field()