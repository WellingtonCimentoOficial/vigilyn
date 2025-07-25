from app.extensions import mail
from flask_mail import Message
import threading
import time
from .logger_utils import Log
from .user_utils import get_all_emails
from config import Config
from flask import current_app


class Email:
    def __init__(
        self,
        smtp_host=Config.MAIL_SERVER,
        smtp_port=Config.MAIL_PORT,
        smtp_interval=Config.MAIL_INTERVAL,
        smtp_email_from=Config.MAIL_DEFAULT_SENDER,
        smtp_email_to=None,
        notifications_enabled=True,
    ):
        self.smtp_host = smtp_host
        self.smtp_port = smtp_port
        self.smtp_interval = smtp_interval
        self.smtp_email_from = smtp_email_from
        self.smtp_email_to = smtp_email_to
        self.smtp_login_email = Config.MAIL_USERNAME
        self.smtp_login_password = Config.MAIL_PASSWORD
        self.notifications_enabled = notifications_enabled

    def send(self, subject, body, category):
        user_emails = get_all_emails()
        msg = Message(
            subject=subject,
            sender=self.smtp_email_from,
            recipients=(
                [self.smtp_email_to] if self.smtp_email_to is not None else user_emails
            ),
            body=body,
        )
        log = Log()

        fail_count = 0

        if self.notifications_enabled:
            while fail_count < 3:
                try:
                    mail.send(msg)

                    log.write(
                        category=category, message="The e-mail was send successfully!"
                    )
                    break
                except:
                    match fail_count + 1:
                        case 1:
                            log.write(
                                category=category,
                                message="The e-mail was not sent, another attempt will be made in 60 seconds...",
                                level="error",
                            )

                        case 2:
                            log.write(
                                category=category,
                                message="The e-mail was not sent, last attempt will be made in 60 seconds...",
                                level="error",
                            )

                        case 3:
                            log.write(
                                category=category,
                                message="Unable to send e-mail.",
                                level="error",
                            )

                    fail_count += 1

                time.sleep(60)
        else:
            log.write(category=category, message="email notifications are disabled")

    def send_async(self, subject: str, body: str, category: str):
        app = current_app._get_current_object()

        def _send():
            with app.app_context():
                self.send(subject, body, category)

        threading.Thread(target=_send, daemon=True).start()
