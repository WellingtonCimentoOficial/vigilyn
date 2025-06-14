from app.models.user_models import User


def get_all_emails():
    users = User.query.all()

    emails = [user.email for user in users]

    return emails
