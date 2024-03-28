var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
const text_recognition = document.querySelector(".text-recognition");
const selectedLang = document.getElementById('lang-options');
const input_lang = document.getElementById('input-langs');
const subtitle = document.querySelector(".sub");
const recogBtn = document.querySelector('.recogStartBtn');

let inut_langVal = input_lang.value;
var recognition = new SpeechRecognition();
//음성인식할 언어 지정

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


//html 의 body 클릭 시 음성인식 시작
recogBtn.onclick = function (event) {
  recognition.start();
};
// 기본으로 번역할 언어 및 번역언어 업데이트
let currentLang = 'en';
selectedLang.addEventListener('change', e => currentLang = e.target.value)

recognition.onresult = function (event) {
  // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
  // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
  // It has a getter so it can be accessed like an array
  // The first [0] returns the SpeechRecognitionResult at the last position.
  // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
  // These also have getters so they can be accessed like arrays.
  // The second [0] returns the SpeechRecognitionAlternative at position 0.
  // We then return the transcript property of the SpeechRecognitionAlternative object

  let textedSpeech = event.results[event.resultIndex][0].transcript; // 최신의 음성들 출력
  subtitle.textContent = `Result received: ${textedSpeech}.`;

  // POST 요청을 보내고, 그 응답을 기반으로 GET 요청을 합니다.
  // 언어 입력 될 때마다 updateDisplay 함수 호출 (말이 정리되어 올라감)
  event.results[event.resultIndex].isFinal ? (
    postData(postDataUrl, {
      text : textedSpeech,
      lang : currentLang
    })
    .then(postResponse => {
      console.log('POST 요청의 응답:', postResponse);
      updateDisplay(textedSpeech,postResponse.translated_text)
      return postResponse;
    })
    .catch(error => {
      console.error('Error:', error);
    })
  ) : null
};
function updateDisplay(text, transleted) {
  // Select or create the element where the text will be displayed
  const displayElement =
    document.getElementById("transcriptDisplay") || document.createElement("p");
  displayElement.id = "transcriptDisplay";
  transleted !== undefined ? 
  displayElement.innerHTML += text + '<br>' + transleted + '<br>' :
  displayElement.innerHTML += text + '<br>' + 'UNKNOWN TRANSLATION' + '<br>';
  text_recognition.appendChild(displayElement);
  const text_recogScroll = document.querySelector(".text-recognition");
  scrollToBottom(text_recogScroll);
}

recognition.onerror = function (event) {
  subtitle.textContent = "Error occurred in recognition: " + event.error;
};

//preparing method when text gets loger than box, this func will execute.
function scrollToBottom(element) {
  element.scrollTop = element.scrollHeight;
}

//transAPI.py 와 연결하는 Fetch 
async function postData(url, data) {
  return fetch(url, {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json());
}

async function getData(url) {
  return fetch(url)
    .then(response => response.json());
}

const postDataUrl = 'http://127.0.0.1:8000/translate';
const getDataUrl = 'http://127.0.0.1:8000/get-endpoint';

