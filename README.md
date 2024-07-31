# translation_DangJin
This project was created to demonstrate a robot during our visit to Dangjin. 
The main feature of this project is the 'translation and interpretation' function, where language is translated and output in the order of STT (Speech-to-Text), Translation, and TTS (Text-to-Speech).
Each function is implemented using the following packages:

WebSpeech API (JavaScript environment, performs STT function)
googletrans for Python (performs translation function)
Google Cloud TTS (Python environment, performs TTS function)


## Getting started
#### Connect this repo and clone
```
git remote add origin http://tech.hillsrobotics.com:8000/hibot/translation_dangjin.git
git clone http://tech.hillsrobotics.com:8000/hibot/translation_dangjin.git
git branch -M main
git push -uf origin main
```
#### requirements
* python 3.8 
* Google Cloud Developer ID (Payable)
* gcloud CLI (to do Application Default Credentials)
* googletrans==4.0.0-rc1 
* flask , flaks-cors
* Git (for clone the repository)  

#### steps

##### 1. Google Cloud Auth
1. make Google account, [ You need to be able to log in to Google Cloud Console](https://console.cloud.google.com/welcome?authuser=1&hl=ko&project=text-to-speech-test-429508).
2. After logging in to the Google Cloud Console, click on "New Project" from the project selection dropdown menu at the top.
3. Register your payment method.
4. Within the project, enable the [Service Usage API](https://console.cloud.google.com/apis/library/serviceusage.googleapis.com?project=text-to-speech-test-429508) and [Cloud Text-to-Speech API](https://console.cloud.google.com/apis/library/texttospeech.googleapis.com?project=text-to-speech-test-429508).
5. Install the [gcloud CLI](https://cloud.google.com/sdk/docs/install?hl=ko) on your local computer.
6. [Perform ADC (Application Default Credentials) on your local computer](https://cloud.google.com/text-to-speech/docs/libraries?hl=ko#authentication) using the gcloud CLI.

##### 2. Install googletrans ( 4.0.0-rc1 version )
```
pip3 install googletrans==4.0.0-rc1
```
##### 3. Install Other Packages.
```
pip3 install flask flask-cors
```

