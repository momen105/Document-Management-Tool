from django.shortcuts import render
from rest_framework.views import APIView


# Create your views here.
class DashboardView(APIView):
    template_name = "Home/dashboard.html"

    def get(self, request):
        print(request.user)
        return render(request, self.template_name)
