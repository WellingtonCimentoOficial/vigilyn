from app.models.user_models import User


def get_all_emails(include_inactive=False):
    if include_inactive:
        users = User.query.all()
    else:
        users = User.query.filter_by(is_active=True).all()

    emails = [user.email for user in users]

    return emails
