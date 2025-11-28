from django.contrib import admin
from django.urls import path
from .views import SendNotification, CompleteApplication, UpdateApplicationNotes, GetApplications  

urlpatterns = [
    path('admin/', admin.site.urls),
    path('notify/', SendNotification.as_view(), name='send_notification'),  
    path('complete/<int:application_id>/', CompleteApplication.as_view(), name='complete_application'),  
    path('update-notes/<int:application_id>/', UpdateApplicationNotes.as_view(), name='update_application_notes'),  
    path('applications/', GetApplications.as_view(), name='get_applications'),  
]
