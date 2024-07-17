from flask import Flask, request, jsonify,send_file
from flask_cors import CORS
from googletrans import Translator
from google.cloud import texttospeech
import os
import io

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

# 구글 TTS API 부분
@app.route('/synthesize', methods=['POST'])
def synthesize_text():
    data = request.json
    text = data.get('text', 'Hello, World!')

    client = texttospeech.TextToSpeechClient()

    synthesis_input = texttospeech.SynthesisInput(text=text)
    voice = texttospeech.VoiceSelectionParams(
        language_code="ja", ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
    )
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )

    response = client.synthesize_speech(
        input=synthesis_input, voice=voice, audio_config=audio_config
    )

    audio_stream = io.BytesIO(response.audio_content)
    audio_stream.seek(0)

    return send_file(audio_stream, mimetype='audio/mpeg', as_attachment=False)
# if __name__ == '__main__':
#     os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "[PATH_TO_YOUR_SERVICE_ACCOUNT_KEY]"
#     app.run(host='0.0.0.0', port=5000)

if __name__ == '__main__':
    app.run(debug=True, port=8000)