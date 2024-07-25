var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
const text_recognition = document.querySelector(".text-recognition");
const selectedLang = document.getElementById('lang-options');
const input_lang = document.getElementById('input-langs');
const recogBtn = document.querySelector('.recogStartBtn');
const audioOutput = document.getElementById('audio-output');
const received = document.querySelector('.receivedResult');
const recevedTextbox = document.getElementById('RecevedText');
const TranslatedTextbox = document.getElementById('TranslatedText');

let inut_langVal = input_lang.value;
var recognition = new SpeechRecognition();
// 음성인식할 언어 지정

input_lang.addEventListener('change', (e) => {
  recognition.lang = e.target.value;
  console.log(recognition.lang);
  recognition.stop();
  recognition.onend = function() {
    console.log('recognition end absolutely')
    recognition.start()
  }
})

function stopRecog() {
  return new Promise((resolve) => {
    recognition.stop()
    recognition.start()
    console.log('stopped')
  })
}

recognition.continuous = true;
recognition.interimResults = true;
recognition.maxAlternatives = 1;

// html 의 body 클릭 시 음성인식 시작
recogBtn.onclick = function (event) {
  recognition.start();
};

// 기본으로 번역할 언어 및 번역언어 업데이트
let currentLang = 'en';
selectedLang.addEventListener('change', e => currentLang = e.target.value)

recognition.onresult = function (event) {
  let textedSpeech = event.results[event.resultIndex][0].transcript; // 최신의 음성들 출력
  received.textContent = `Result received: ${textedSpeech}.`;

  // POST 요청을 보내고, 그 응답을 기반으로 GET 요청을 합니다.
  event.results[event.resultIndex].isFinal ? (
    postData(postTransDataUrl, {
      text: textedSpeech,
      lang: currentLang
    })
    .then(res => {
      console.log('POST 요청의 응답:', res);
      if (res.translated_text && res.audio_data) {
        // 번역된 텍스트를 업데이트합니다.
        updateDisplay(textedSpeech, res.translated_text);
    
        // Base64 오디오 데이터를 디코딩하여 재생합니다.
        const audioData = res.audio_data;
        const audio = new Audio('data:audio/mp3;base64,' + audioData);
        audio.play();
      } else {
        console.error('응답에 필요한 데이터가 없습니다.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    })
  ) : null
};

function updateDisplay(text, translated) {
  // 이전 텍스트의 배경색 초기화
  const previousReceived = recevedTextbox.querySelector('.highlight');
  if (previousReceived) {
    previousReceived.classList.remove('highlight');
  }

  const previousTranslated = TranslatedTextbox.querySelector('.highlight');
  if (previousTranslated) {
    previousTranslated.classList.remove('highlight');
  }

  // 새로 추가된 텍스트에 형광색 배경 적용
  if (translated !== undefined) {
    recevedTextbox.innerHTML += `<div class="highlight">${text}</div><br>`;
    TranslatedTextbox.innerHTML += `<div class="highlight">${translated}</div><br>`;
  } else {
    recevedTextbox.innerHTML += `<div class="highlight">${text}</div><br>`;
    TranslatedTextbox.innerHTML += `<div class="highlight">UNKNOWN TRANSLATION</div><br>`;
  }

  const text_recogScroll = document.querySelector(".text-recognition");
  scrollToBottom(recevedTextbox);
  scrollToBottom(TranslatedTextbox);
}
// CSS 스타일 정의
const style = document.createElement('style');
style.innerHTML = `
  .highlight {
    background-color: yellow; /* 형광색 배경 */
  }
`;
document.head.appendChild(style);

recognition.onerror = function (event) {
  text_recognition.textContent = "Error occurred in recognition: " + event.error;
};

function scrollToBottom(element) {
  element.scrollTop = element.scrollHeight;
}

async function postData(url, data) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  })
  .catch(error => console.error('Error:', error));
}

const postTransDataUrl = 'http://127.0.0.1:8000//translate_and_synthesize';
const getDataUrl = 'http://127.0.0.1:8000/get-endpoint';
