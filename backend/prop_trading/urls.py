from django.urls import path
from .views import (
    ApplyPropExamView, MyPropExamsListView,
    AdminPropExamsListView, AdminApprovePropExamView, AdminUpdatePropStatusView
)

urlpatterns = [
    path('apply/', ApplyPropExamView.as_view(), name='apply_prop_exam'),
    path('my/', MyPropExamsListView.as_view(), name='my_prop_exams'),
    path('admin/exams/', AdminPropExamsListView.as_view(), name='admin_prop_exams'),
    path('admin/exams/<int:pk>/approve/', AdminApprovePropExamView.as_view(), name='admin_approve_prop_exam'),
    path('admin/exams/<int:pk>/status/', AdminUpdatePropStatusView.as_view(), name='admin_update_prop_status'),
]

