from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import DocumentModel
from .serializers import *


# Create your views here.
class HomeView(APIView):
    queryset = DocumentModel.objects.all()
    template_name = "Home/home.html"

    def get(self, request):
        current_user = request.user.id
        print(current_user)
        my_files = self.queryset.filter(file_owner=current_user)
        context = {"my_files": my_files}
        return render(request, self.template_name, context)


class DocumentAPIView(APIView):
    serializer_class = DocumentSerializer
    queryset = DocumentModel.objects.all()
    template_name = "Home/home.html"

    def get(self, request):
        documents = self.queryset.all()
        # my_files = self.queryset.filter(file_owner=current_user)
        context = {"my_files": documents}
        serializer = self.serializer_class(documents, many=True)
        return render(request, self.template_name, context)

    def post(self, request):
        data = request.data
        data["file_owner"] = request.user.id
        serializer = self.serializer_class(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            document = DocumentModel.objects.get(pk=pk)
        except DocumentModel.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = DocumentSerializer(document, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            document = DocumentModel.objects.get(pk=pk)
        except DocumentModel.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        document.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
