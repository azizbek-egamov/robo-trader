from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .serializers import UserRegisterSerializer, UserProfileSerializer, LeaderboardUserSerializer

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        if 'phone' in attrs:
            import re
            clean = re.sub(r'[^\d+]', '', attrs['phone'])
            if not clean.startswith('+'):
                clean = '+' + clean
            attrs['phone'] = clean
        data = super().validate(attrs)
        data['user'] = UserProfileSerializer(self.user).data
        return data

class CustomLoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Tokenlarni darhol qaytarish
        refresh = RefreshToken.for_user(user)
        user_data = UserProfileSerializer(user).data

        return Response({
            'user': user_data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_201_CREATED)

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class LeaderboardView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        by_xp = User.objects.filter(is_active=True).order_by('-xp_points')[:20]
        by_capital = User.objects.filter(is_active=True, investment_position__units__gt=0).order_by('-investment_position__units')[:20]

        return Response({
            'by_xp': LeaderboardUserSerializer(by_xp, many=True).data,
            'by_capital': LeaderboardUserSerializer(by_capital, many=True).data
        })
