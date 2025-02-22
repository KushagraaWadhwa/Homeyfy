from celery.schedules import crontab
from flask import current_app as app
from backend.celery.tasks import email_reminder, send_monthly_activity_report

celery_app = app.extensions['celery']
 
@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    
    #Daily reminder at 6pm
    sender.add_periodic_task(
        # 10,
        crontab(hour=18, minute=0),
        email_reminder.s(),
        name='daily_reminder'
    )

    #Monthly activity report on the 1st of every month at 12 PM
    sender.add_periodic_task(
        # 10,
        crontab(day_of_month=1, hour=12, minute=0),
        send_monthly_activity_report.s(),
        name='monthly_activity_report'
    )

    