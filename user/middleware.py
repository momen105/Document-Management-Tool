import jwt
from django.conf import settings
from django.http import JsonResponse
from .models import User


class JWTMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
                user_id = payload.get(
                    "user_id"
                )  # Assuming "user_id" is the key in the payload
                user = User.objects.get(id=user_id)
                print(user)
                request.user = user
            except jwt.ExpiredSignatureError:
                print("------------------ExpiredSignatureError-")
                return JsonResponse({"error": "Token has expired"}, status=401)
            except (jwt.InvalidTokenError, User.DoesNotExist):
                print("-----InvalidTokenError")
                return JsonResponse({"error": "Invalid token"}, status=401)
            except Exception as e:
                # Log the error for debugging purposes
                print("An unexpected error occurred:", e)
                return JsonResponse(
                    {"error": "An unexpected error occurred"}, status=500
                )
        else:
            request.user = None
            print("nono")

        response = self.get_response(request)
        return response
