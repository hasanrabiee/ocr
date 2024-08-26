import os
import random
import pytesseract
import cv2
import requests
from flask import Flask, request, jsonify
import re
import pdftotext

app = Flask(__name__)


def detect_image_lang(img_path):
    osd = pytesseract.image_to_osd(img_path)
    script = re.search("Script: ([a-zA-Z]+)\n", osd).group(1)
    conf = re.search("Script confidence: (\d+\.?(\d+)?)", osd).group(1)
    return script, float(conf)


@app.route("/convert", methods=["POST"])
def convert():
    # Get the URL of the image
    image_url = request.form.get("url")
    # # Download the image from the URL
    response = requests.get(image_url)
    #
    # # Perform OCR on the image
    random_string = "".join(
        random.choice("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789") for i in range(10))
    file_name = random_string + ".png"

    with open(file_name, "wb") as f:
        f.write(response.content)
    lang = detect_image_lang(file_name)
    image = cv2.imread(file_name)
    detect_lang = 'fas'
    if lang[0] == 'Latin':
        detect_lang = 'eng'
    text = pytesseract.image_to_string(image, lang=detect_lang)
    if os.path.exists(file_name):
        os.remove(file_name)
    #
    # # Return the extracted text as a JSON response
    return jsonify({"text": text, "lang": lang})


@app.route("/convertPdf", methods=["POST"])
def convert_pdf():
    # input_pdf = pdftotext.PDF("cv.pdf")
    #
    # Get the number of pages in the PDF file
    file_url = request.form.get("url")
    response = requests.get(file_url)
    random_string = "".join(
        random.choice("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789") for i in range(10))
    file_name = random_string + ".pdf"
    with open(file_name, "wb") as file:
        file.write(response.content)
    with open(file_name, "rb") as f:
        pdf = pdftotext.PDF(f)
    #     output_file.write(text)  # # Return the extracted text as a JSON response
    texts = []
    for index, page in enumerate(pdf):
        print(index)
        texts.append({"text": page, 'page_num': int(index) + 1})
    if os.path.exists(file_name):
        os.remove(file_name)
    return jsonify({"text": texts})


if __name__ == "__main__":
    app.run(debug=True, port=8000)
