class AppException(Exception):
    default_message = "An unexpected error occurred."
    status_code = 500

    def __init__(self, message=None, status_code=None):
        self.message = message or self.default_message
        self.status_code = status_code or self.status_code
        super().__init__(self.message)
