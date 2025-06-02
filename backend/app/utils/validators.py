import re
from datetime import datetime, timedelta
from app.exceptions.url_exceptions import (
    InvalidInitialDateParamException,
    InvalidFinalDateParamException,
    InvalidDateRangeParamException,
    MissingDateParamException,
)


def validate_date_param(date_str):
    pattern = r"^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$"
    if not re.match(pattern, date_str):
        return False

    try:
        date = datetime.strptime(date_str, "%Y-%m-%d")
        return date
    except:
        return False


def validate_date_range(initial_date_param, final_date_param):
    if (initial_date_param and not final_date_param) or (
        final_date_param and not initial_date_param
    ):
        raise MissingDateParamException()

    if initial_date_param and final_date_param:
        if not validate_date_param(initial_date_param):
            raise InvalidInitialDateParamException()
        if not validate_date_param(final_date_param):
            raise InvalidFinalDateParamException()

        initial_date = datetime.strptime(initial_date_param, "%Y-%m-%d")
        final_date = (
            datetime.strptime(final_date_param, "%Y-%m-%d")
            + timedelta(days=1)
            - timedelta(microseconds=1)
        )

        if final_date < initial_date:
            raise InvalidDateRangeParamException()

        return initial_date, final_date
