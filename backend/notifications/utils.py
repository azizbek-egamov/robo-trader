from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

channel_layer = get_channel_layer()

def broadcast_public_event(event_name, payload):
    """Barcha tashrif buyuruvchilar va investorlarga umumiy hodisa yuborish (masalan: NAV o'zgarishi, $70 sessiya)"""
    if not channel_layer:
        return
    try:
        async_to_sync(channel_layer.group_send)(
            'public_ticker',
            {
                'type': 'broadcast_event',
                'data': {
                    'event': event_name,
                    'payload': payload
                }
            }
        )
    except Exception as e:
        print(f"[WS ERROR] Broadcast public event failed: {e}")

def broadcast_to_user(user_id, event_name, payload):
    """Aniq bitta investorga shaxsiy bildirishnoma yuborish (masalan: Balans oshdi, Chek tasdiqlandi)"""
    if not channel_layer:
        return
    try:
        async_to_sync(channel_layer.group_send)(
            f"user_{user_id}",
            {
                'type': 'user_notification',
                'data': {
                    'event': event_name,
                    'payload': payload
                }
            }
        )
    except Exception as e:
        print(f"[WS ERROR] Broadcast user event failed: {e}")

def broadcast_to_admins(event_name, payload):
    """Barcha adminlarga tezkor ogohlantirish (masalan: Yangi depozit cheki yuklandi, Yangi imtihon)"""
    if not channel_layer:
        return
    try:
        async_to_sync(channel_layer.group_send)(
            'admin_feed',
            {
                'type': 'admin_alert',
                'data': {
                    'event': event_name,
                    'payload': payload
                }
            }
        )
    except Exception as e:
        print(f"[WS ERROR] Broadcast admin event failed: {e}")

