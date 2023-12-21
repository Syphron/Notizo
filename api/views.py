
from rest_framework.serializers import Serializer
from django.http import response
from django.shortcuts import render
from rest_framework.decorators import api_view
from .models import Note
from .serializers import NoteSerializer
from api import serializers
from django.contrib.auth import logout
from rest_framework.response import Response
from django.http import JsonResponse

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Note
from .serializers import NoteSerializer
# Create your views here.


@api_view(['GET'])
def Routes(request):
    routes = [
        {'Endpoint': '/notes/', 'method': 'GET', 'body': None, 'description': 'Returns an array of notes'},
        {'Endpoint': '/notes/id', 'method': 'GET', 'body': None, 'description': 'Returns a single note object'},
        {'Endpoint': '/notes/create/', 'method': 'POST', 'body': {'body': ""}, 'description': 'Creates new note with data sent in post request'},
        {'Endpoint': '/notes/id/update/', 'method': 'PUT', 'body': {'body': ""}, 'description': 'Updates an existing note with data sent in post request'},
        {'Endpoint': '/notes/id/delete/', 'method': 'DELETE', 'body': None, 'description': 'Deletes an existing note'},
        {'Endpoint': '/logout_view/', 'method': 'GET', 'body': None, 'description': 'Logs out the current user'}
    ]
    return Response(routes)



@api_view(['POST'])
def logout_view(request):
    logout(request)

    return JsonResponse({'status': 'success'})


class GetNotes(APIView):

    def get(self, request):
        notes = Note.objects.all().order_by('-updated')
        serializer = NoteSerializer(notes, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = NoteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetNote(APIView):

    def get(self, request, pk):
        note = get_object_or_404(Note, pk=pk)
        serializer = NoteSerializer(note)
        return Response(serializer.data)

    def put(self, request, pk):
        note = get_object_or_404(Note, pk=pk)
        serializer = NoteSerializer(note, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        note = get_object_or_404(Note, pk=pk)
        note.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



