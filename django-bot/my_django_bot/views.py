from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests
import json


TELEGRAM_BOT_TOKEN = "8317433158:AAFchOamWS9fpIXEuc6wylK7EAVdzQWn5X8"
# CHAT_ID сотрудника
CHAT_ID = "-1003180544443"


EXPRESS_BASE_URL = "http://localhost:5000/api"


class SendNotification(APIView):
    def post(self, request):
        data = request.data
        required_fields = ['name', 'phone', 'email', 'inn']
        missing_fields = []

        for field in required_fields:
            if field not in data:
                missing_fields.append(field)

        if len(missing_fields) > 0:
            return Response({"error": f"Пропущены обязательные поля: {missing_fields}"}, status=status.HTTP_400_BAD_REQUEST)

        
        client_notes = data.get('notes', '- отсутствуют -')
        staff_notes = data.get('staff_notes', '- отсутствует -')  # даже если пустое
        message = (
            f"📌 Новая заявка!\n\n"
            f"ID заявки: {data.get('id', 'неизвестен')}\n"
            f"Имя: {data['name']}\n"
            f"Телефон: {data['phone']}\n"
            f"E-mail: {data['email']}\n"
            f"Компания: {data.get('company', '- не указана -')}\n"
            f"ИНН: {data['inn']}\n"
            f"Комментарий клиента (notes): {client_notes}\n"
            f"Комментарий сотрудника (staff_notes): {staff_notes}\n"  
        )

        
        response = send_to_telegram(message)
        if response.status_code != 200:
            return Response({"error": "Ошибка отправки заявки"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"message": "Сообщение отправлено"})


class CompleteApplication(APIView):
    def put(self, request, application_id):
        print(f"DEBUG: CompleteApplication - ID: {application_id}")
        try:
            express_response = requests.put(
                f"{EXPRESS_BASE_URL}/applications/status/{application_id}",
                json={"completed": True},
                headers={'Content-Type': 'application/json'}
            )
            print(f"DEBUG: Express response status: {express_response.status_code}, text: {express_response.text}")
            if express_response.status_code == 200:
                send_to_telegram(f"✅ Заявка #{application_id} отмечена как выполненная!")
                return Response({"message": "Статус обновлен"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": f"Ошибка Express: {express_response.text}"}, status=express_response.status_code)
        except requests.RequestException as e:
            return Response({"error": f"Ошибка подключения к Express: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UpdateApplicationNotes(APIView):
    def put(self, request, application_id):
        new_staff_notes = request.data.get('staff_notes')  
        if new_staff_notes is None:
            return Response({"error": "Не указан новый комментарий сотрудника"}, status=status.HTTP_400_BAD_REQUEST)

        print(f"DEBUG: UpdateApplicationNotes - ID: {application_id}, staff_notes: {new_staff_notes}")
        try:
            express_response = requests.put(
                f"{EXPRESS_BASE_URL}/applications/comment/{application_id}",
                json={"staff_notes": new_staff_notes},  
                headers={'Content-Type': 'application/json'}
            )
            print(f"DEBUG: Express response status: {express_response.status_code}, text: {express_response.text}")
            if express_response.status_code == 200:
                send_to_telegram(f"📝 Комментарий сотрудника к заявке #{application_id} обновлен: {new_staff_notes}")
                return Response({"message": "Комментарий обновлен"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": f"Ошибка Express: {express_response.text}"}, status=express_response.status_code)
        except requests.RequestException as e:
            return Response({"error": f"Ошибка подключения к Express: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetApplications(APIView):
    def get(self, request):
        print("DEBUG: GetApplications - запрос списка заявок")
        try:
            express_response = requests.get(f"{EXPRESS_BASE_URL}/applications")
            print(f"DEBUG: Express response status: {express_response.status_code}")
            if express_response.status_code == 200:
                return Response(express_response.json(), status=status.HTTP_200_OK)
            else:
                return Response({"error": f"Ошибка Express: {express_response.text}"}, status=express_response.status_code)
        except requests.RequestException as e:
            return Response({"error": f"Ошибка подключения к Express: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def send_to_telegram(text):
    method = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": CHAT_ID,
        "text": text,
        "parse_mode": "HTML"
    }
    headers = {'Content-type': 'application/json'}
    response = requests.post(method, data=json.dumps(payload), headers=headers)
    return response
