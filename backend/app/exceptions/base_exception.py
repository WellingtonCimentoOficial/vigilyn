class AppException(Exception):
    default_error = "internal"
    default_message = "An unexpected error occurred."
    status_code = 500

    def __init__(self, error=None, message=None, status_code=None):
        self.error = error or self.default_error
        self.message = message or self.default_message
        self.status_code = status_code or self.status_code
        super().__init__(self.message)
