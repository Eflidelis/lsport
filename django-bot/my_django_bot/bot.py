import requests
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes


DJANGO_BASE_URL = "http://127.0.0.1:8000"  

async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Обработчик /start — с подсказкой о новых командах."""
    await update.message.reply_text(
        "Привет! Я бот для управления заявками.\n"
        "Команды:\n"
        "/done <ID> — завершить заявку.\n"
        "/note <ID> <текст> — обновить комментарий сотрудника (staff_notes).\n"
        "/show — список активных заявок (с notes и staff_notes)."
    )

async def done_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Обработчик /done <ID> — завершить заявку."""
    try:
        if not context.args:
            await update.message.reply_text("Использование: /done <ID>\nПример: /done 123")
            return

        application_id = int(context.args[0])
        print(f"DEBUG: done_command - ID: {application_id}")
        response = requests.put(f"{DJANGO_BASE_URL}/complete/{application_id}/", json={})
        print(f"DEBUG: Django response status: {response.status_code}, text: {response.text}")
        if response.status_code == 200:
            await update.message.reply_text("✅ Статус заявки обновлен на 'выполненная'!")
        elif response.status_code == 409:
            await update.message.reply_text("❌ Заявка уже выполнена. Обновите список /show.")
        else:
            error_msg = response.json().get('error', 'Неизвестная ошибка')
            await update.message.reply_text(f"❌ Ошибка: {error_msg}")
    except ValueError:
        await update.message.reply_text("ID заявки должен быть числом.")
    except requests.RequestException as e:
        await update.message.reply_text(f"❌ Ошибка подключения: {str(e)}")

async def note_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Обработчик /note <ID> <текст> — обновляет staff_notes."""
    try:
        if len(context.args) < 2:
            await update.message.reply_text("Использование: /note <ID> <текст>\nПример: /note 123 Мои заметки от сотрудника")
            return

        application_id = int(context.args[0])
        new_staff_notes = " ".join(context.args[1:])
        print(f"DEBUG: note_command - ID: {application_id}, staff_notes: {new_staff_notes}")
        response = requests.put(f"{DJANGO_BASE_URL}/update-notes/{application_id}/", json={"staff_notes": new_staff_notes})
        print(f"DEBUG: Django response status: {response.status_code}, text: {response.text}")
        if response.status_code == 200:
            await update.message.reply_text("📝 Комментарий сотрудника обновлен!")
        elif response.status_code == 409:
            await update.message.reply_text("❌ Заявка уже выполнена. Обновите список /show.")
        else:
            error_msg = response.json().get('error', 'Неизвестная ошибка')
            await update.message.reply_text(f"❌ Ошибка: {error_msg}")
    except ValueError:
        await update.message.reply_text("ID заявки должен быть числом.")
    except requests.RequestException as e:
        await update.message.reply_text(f"❌ Ошибка подключения: {str(e)}")

async def show_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Обработчик /show — список активных заявок с notes и staff_notes, телефоном и почтой."""
    try:
        print("DEBUG: show_command - запрос списка")
        response = requests.get(f"{DJANGO_BASE_URL}/applications/")
        print(f"DEBUG: Django response status: {response.status_code}")
        if response.status_code == 200:
            applications = response.json()

            applications = sorted(applications, key=lambda x: x.get('id', 0), reverse=True)

            if not applications:
                await update.message.reply_text("📋 Нет активных заявок.")
                return
            reply = "📋 Список активных заявок:\n"
            for app in applications:
                if not app.get('completed', False) and not app.get('archived', False):
                    client_notes = app.get('notes', '- отсутствует -')
                    staff_notes = app.get('staff_notes', '- отсутствует -')
                    phone = app.get('phone', 'Не указан')
                    email = app.get('email', 'Не указана')
                    reply += (
                        f"ID: {app['id']}\n"
                        f"Имя: {app.get('name', 'Неизвестно')}\n"
                        f"Телефон: {phone}\n"
                        f"Почта: {email}\n"
                        f"Организация: {app.get('company', 'Не указана')}\n"
                        f"Notes (клиент): {client_notes[:50]}...\n"
                        f"Staff_notes (сотрудник): {staff_notes[:50]}...\n\n"
                    )
            if reply == "📋 Список активных заявок:\n":
                reply = "📋 Все заявки выполнены или нет активных."
            await update.message.reply_text(reply)
        else:
            error_msg = response.json().get('error', 'Неизвестная ошибка')
            await update.message.reply_text(f"❌ Ошибка при получении списка: {error_msg}")
    except requests.RequestException as e:
        await update.message.reply_text(f"❌ Ошибка подключения: {str(e)}")

def main():
    """Главная функция для запуска бота."""
    application = Application.builder().token("8317433158:AAFchOamWS9fpIXEuc6wylK7EAVdzQWn5X8").build()

    
    application.add_handler(CommandHandler("start", start_command))
    application.add_handler(CommandHandler("done", done_command))
    application.add_handler(CommandHandler("note", note_command))
    application.add_handler(CommandHandler("show", show_command))

    
    application.run_polling()

if __name__ == '__main__':
    main()
