# Getting Started with Vigilyn

To get started with Vigilyn, make sure you have the following installed on your machine:

•	Node.js
•	Python 3.10+
•	Git
•	Ffmpeg

## Cloning the Repository

In the project directory, you can run:

### `git clone https://github.com/WellingtonCimentoOficial/vigilyn.git`
### `cd vigilyn`

## Backend Setup (Flask)

1.	Navigate to the backend/ directory:

### `cd backend`

2.	Create a virtual environment named venv:

### `python3 -m venv venv`

3.	Replace the .env-example file with your own .env file and fill in the required environment variables.
4.	Activate the virtual environment:

•	Linux/macOS:

### `source venv/bin/activate`

•	Windows (CMD):

### `venv\Scripts\activate.bat`

5.	Install the dependencies:

### `pip install -r requirements.txt`

6.	Run the initial setup:

### `python manage.py setup all`

7.	Default admin credentials:

•	Email: admin@admin.com
•	Password: Admin@123

## Frontend Setup (React)

1.	Navigate to the frontend/ directory:

### `cd ../frontend`

2.	Install dependencies:

### `npm ci`

3.	Generate react build:

### `npm run build`

## Finally

1.	Navigate to the backend/ directory:

### `cd ../backend`

2.	Start the backend development server:

### `python run.py`