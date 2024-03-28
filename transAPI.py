from flask import Flask, request, jsonify
from flask_cors import CORS
from googletrans import Translator

app = Flask(__name__)
CORS(app)

translator = Translator()

@app.route('/translate', methods=['POST'])
def translate_text():
    # 요청에서 데이터 추출
    data = request.get_json()
    if not data or 'text' not in data or 'lang' not in data:
        return jsonify({"error": "Invalid JSON data provided"}), 400
    print(data['lang'])
    text_to_translate = data['text']
    target_language = data['lang']

    # 텍스트 번역
    try:
        translated = translator.translate(text_to_translate, dest=target_language)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    # 번역된 텍스트 반환
    return jsonify({'translated_text': translated.text}), 200

if __name__ == '__main__':
    app.run(debug=True, port=8000)