import json
import re
from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        get = self.scope["query_string"]
        pattern = "id=(.+)'"
        self.room_name = (re.search(pattern,str(get)).group(1))
        self.room_group_name = (re.search(pattern,str(get)).group(1))
        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()
        

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        user = text_data_json["user"]
        time = text_data_json["time"]
        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name, {"type": "chat_message", "message": message,"user":user, "time": time}
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event["message"]
        user = event["user"]
        time = event["time"]
        # Send message to WebSocket
        await self.send(text_data=json.dumps({"message": message,"user":user, "time": time}))