import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
import os

SMTP_SERVER = "localhost"
SMTP_PORT = 1025
SENDER_EMAIL = 'admin@study.iitm.ac.in'
SENDER_PASSWORD = ''

def send_email(to, subject, content, attachment_path=None):
    msg = MIMEMultipart()
    msg['To'] = to
    msg['Subject'] = subject
    msg['From'] = SENDER_EMAIL

    msg.attach(MIMEText(content, 'html'))

    if attachment_path:
        with open(attachment_path, 'rb') as attachment:
            part = MIMEBase('application', 'octet-stream')
            part.set_payload(attachment.read())
            encoders.encode_base64(part)
            part.add_header('Content-Disposition', f'attachment; filename={os.path.basename(attachment_path)}')
            msg.attach(part)

    with smtplib.SMTP(host=SMTP_SERVER, port=SMTP_PORT) as client:
        client.send_message(msg)
        client.quit()

