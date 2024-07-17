from flask import Flask, request, jsonify, send_file, render_template
from google.cloud import texttospeech
import os
import io

app = Flask(__name__)

@app.route('/synthesize', methods=['POST'])
def synthesize_text():
    data = request.json
    text = data.get('text', 'Hello, World!')

    client = texttospeech.TextToSpeechClient()

    synthesis_input = texttospeech.SynthesisInput(text=text)
    voice = texttospeech.VoiceSelectionParams(
        language_code="en-US", ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
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

if __name__ == '__main__':
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "[PATH_TO_YOUR_SERVICE_ACCOUNT_KEY]"
    app.run(host='0.0.0.0', port=5000)
