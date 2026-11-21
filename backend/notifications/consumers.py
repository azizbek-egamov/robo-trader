import json
from urllib.parse import parse_qs
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model

User = get_user_model()

class TradingConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        # Query string or headers token authentication
        query_string = self.scope.get('query_string', b'').decode('utf-8')
        params = parse_qs(query_string)
        token = params.get('token', [None])[0]

        self.user = AnonymousUser()
        if token:
            try:
                access_token = AccessToken(token)
                user_id = access_token['user_id']
                self.user = await self.get_user(user_id)
            except Exception:
                pass

        # Join public group
        await self.channel_layer.group_add('public_ticker', self.channel_name)

        # Join personal user group if logged in
        if self.user.is_authenticated:
            await self.channel_layer.group_add(f"user_{self.user.id}", self.channel_name)
            if self.user.role == 'ADMIN':
                await self.channel_layer.group_add("admin_feed", self.channel_name)

        await self.accept()

        # Send initial connection ack
        await self.send_json({
            'type': 'connection_established',
            'authenticated': self.user.is_authenticated,
            'user': {
                'id': self.user.id,
                'full_name': self.user.full_name,
                'role': self.user.role
            } if self.user.is_authenticated else None
        })

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard('public_ticker', self.channel_name)
        if self.user.is_authenticated:
            await self.channel_layer.group_discard(f"user_{self.user.id}", self.channel_name)
            if self.user.role == 'ADMIN':
                await self.channel_layer.group_discard("admin_feed", self.channel_name)

    async def receive_json(self, content):
        msg_type = content.get('type')
        if msg_type == 'ping':
            await self.send_json({'type': 'pong'})

    # Event handlers called by channel_layer.group_send
    async def broadcast_event(self, event):
        await self.send_json(event['data'])

    async def user_notification(self, event):
        await self.send_json(event['data'])

    async def admin_alert(self, event):
        await self.send_json(event['data'])

    @staticmethod
    async def get_user(user_id):
        from channels.db import database_sync_to_async
        @database_sync_to_async
        def _get():
            try:
                return User.objects.get(id=user_id)
            except User.DoesNotExist:
                return AnonymousUser()
        return await _get()

