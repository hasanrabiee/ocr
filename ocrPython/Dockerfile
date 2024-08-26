FROM python:3.9

WORKDIR /app

COPY requirements.txt .
RUN apt-get update && apt-get install ffmpeg libsm6 libxext6 tesseract-ocr tesseract-ocr-all libtesseract-dev build-essential libpoppler-cpp-dev pkg-config  -y
RUN pip install -r requirements.txt
COPY . .

EXPOSE 8000

CMD ["gunicorn", "-w", "4","--preload", "-b", "0.0.0.0:8000", "app:app"]