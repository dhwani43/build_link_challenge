from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User
from .serializer import UserListSerializer, UserDetailSerializer
from django.views.decorators.csrf import csrf_exempt
import json

# Create your views here.

def List(request):
    users = User.objects.all()
    users_serializer = UserListSerializer(users, many=True)
    return HttpResponse(json.dumps(users_serializer.data))

def Details(request):
    users = User.objects.all()
    users_serializer = UserDetailSerializer(users, many=True)
    return HttpResponse(json.dumps(users_serializer.data))

@csrf_exempt
def Create(request):
    try: 
        if request.method == "POST":
            user_data = json.loads(request.body)
            username = user_data.get('username')
            first_name = user_data.get('first_name')
            last_name = user_data.get('last_name')
            email = user_data.get('email')
            password = user_data.get('password')
            is_staff = user_data.get('is_staff')
            is_superuser = user_data.get('is_superuser')
            is_active = user_data.get('is_active')

            new_user = User.objects.create_user(username=username, first_name=first_name, last_name=last_name, email=email, password=password, is_staff=is_staff, is_superuser=is_superuser, is_active=is_active)
            new_user.set_password(new_user.password)
            new_user.save()

            return HttpResponse(json.dumps({"msg":"User Created Succesfully","status":True}))
    except Exception as e:
        print(e)
        return HttpResponse(json.dumps({"msg": "Something went wrong", "status": False}), status=400)

@csrf_exempt
def Destroy(request):
    if request.method == "POST":
        json_data = json.loads(request.body)
        if 'ids' in json_data:
            user_id = json_data['ids']
            try: 
                for id in user_id:
                    user = User.objects.filter(id=id)
                    if user:
                        user.delete()
                    else:
                        return HttpResponse(json.dumps({"msg": "User Not Found", "status": False}), status=400)
                return HttpResponse(json.dumps({"msg": "User Deleted Succesfully", "status": True}))
            except Exception as e:
                print(e)
                return HttpResponse(json.dumps({"msg": "Something went wrong", "status": False}), status=400)
        else:
            return HttpResponse(json.dumps({"msg": "Field ids missing", "status": False}), status=400)


@csrf_exempt
def Status(request,  status):
    if request.method == "POST":
        json_data = json.loads(request.body)
        if 'ids' in json_data:
            user_id = json_data['ids']
            try: 
                for id in user_id:
                    user = User.objects.filter(id=id)
                    if user:
                        if(status == 'activate'):
                            user.update(is_active=True)
                        else:
                            user.update(is_active=False)
                    else:
                        return HttpResponse(json.dumps({"msg": "User Not Found", "status": False}), status=400)
                return HttpResponse(json.dumps({"msg": "User Status Updated", "status": True}))
            except Exception as e:
                print(e)
                return HttpResponse(json.dumps({"msg": "Something went wrong", "status": False}), status=400)
        else:
            return HttpResponse(json.dumps({"msg": "Field ids missing", "status": False}), status=400)