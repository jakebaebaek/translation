from flask import Flask, request, jsonify
from google.cloud import texttospeech
from googletrans import Translator
from flask_cors import CORS
import io
import base64
import logging

app = Flask(__name__)
CORS(app)
translator = Translator()

logging.basicConfig(level=logging.DEBUG)


@app.route('/translate_and_synthesize', methods=['POST'])
def translate_and_synthesize():
    try:
        # 요청에서 데이터 추출
        data = request.get_json()
        if not data or 'text' not in data or 'lang' not in data:
            return jsonify({"error": "Invalid JSON data provided"}), 400

        text_to_translate = data['text']
        target_language = data['lang']

        # 텍스트 번역
        translated = translator.translate(text_to_translate, dest=target_language)
        translated_text = translated.text

        # TTS 처리
        client = texttospeech.TextToSpeechClient()
        synthesis_input = texttospeech.SynthesisInput(text=translated_text)
        voice = texttospeech.VoiceSelectionParams(
            language_code=target_language,  # 대상 언어에 맞게 설정
            ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
        )
        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3
        )

        response = client.synthesize_speech(
            input=synthesis_input, voice=voice, audio_config=audio_config
        )

        audio_stream = io.BytesIO(response.audio_content)
        audio_stream.seek(0)

        # 음성 데이터를 Base64로 인코딩
        audio_base64 = base64.b64encode(audio_stream.read()).decode('utf-8')

        # JSON 응답 생성
        response_data = {
            "translated_text": translated_text,
            "audio_data": audio_base64
        }

        return jsonify(response_data), 200

    except Exception as e:
        logging.error(f"Error: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=8000)
