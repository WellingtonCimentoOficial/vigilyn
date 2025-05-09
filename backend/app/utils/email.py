from app.extensions import mail
from flask_mail import Message
import threading
import time
from .logger import Log
from flask import current_app
from .utils import get_settings


class Email:
    def __init__(
        self,
        smtp_host=current_app.config["MAIL_SERVER"],
        smtp_port=current_app.config["MAIL_PORT"],
        smtp_interval=current_app.config["MAIL_INTERVAL"],
        smtp_email_from=current_app.config["MAIL_DEFAULT_SENDER"],
        smtp_email_to=current_app.config["MAIL_DEFAULT_RECEIVER"],
    ):
        self.smtp_host = smtp_host
        self.smtp_port = smtp_port
        self.smtp_interval = smtp_interval
        self.smtp_email_from = smtp_email_from
        self.smtp_email_to = smtp_email_to
        self.smtp_login_email = current_app.config["MAIL_USERNAME"]
        self.smtp_login_password = current_app.config["MAIL_PASSWORD"]

    def send(self, subject, body, category):
        msg = Message(
            subject=subject,
            sender=self.smtp_email_from,
            recipients=[self.smtp_email_to],
            body=body,
        )

        fail_count = 0

        log = Log()

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

    def send_async(self, subject: str, body: str, category: str):
        app = current_app._get_current_object()

        def _send():
            with app.app_context():
                allow_notifications = get_settings().allow_notifications
                if allow_notifications:
                    self.send(subject, body, category)

        threading.Thread(target=_send, daemon=True).start()
