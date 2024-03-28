import ZoomVideo from '@zoom/videosdk';

const sessionStartBtn = document.querySelector('.sessionStartBtn');
const video = document.querySelector('.video');

let stream;

sessionStartBtn.addEventListener('click', function() {
    console.log('session start button clicked')
    joinSession();
});
async function fetchToken(SessionName) {
    try {
      // 서버 엔드포인트에게 JWT 토큰을 요청합니다. - request
      const response = await fetch("http://localhost:4000", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",  
        },
        body: JSON.stringify({
          sessionName: SessionName,
          role: 1,
          sessionKey: "session123",
          userIdentity: "user123",
        }),
      });
  
      // JSON으로 파싱
      const data = await response.json();
  
      // 응답으로부터 받은 JWT 토큰을 반환합니다.
      return data.signature;
  
    } catch (error) {
      console.error("Error:", error);
      // 오류 발생 시 null 또는 적절한 오류 메시지를 반환할 수 있습니다.
      return null;
    }
  };
  
async function joinSession() {
    try { 
        
        const zoomVideo = ZoomVideo.createClient();

        // SDK 초기화
        await zoomVideo.init('en-US');

        // 새로운 세션 생성 및 시작
        const sessionName = "TestForMedicare";
        const token = await fetchToken(sessionName);// 서버에서 생성된 JWT 토큰을 사용
        console.log('session start', token)
        // 세션 참여
        await zoomVideo.join(sessionName, token, 'user123').then(() => {
            stream = zoomVideo.getMediaStream()
        }).catch((error) => {
            console.log(error)
        });

        // 비디오 및 오디오 스트림 시작
        stream.startVideo().then(() => {
            stream.renderVideo(video, zoomVideo.getCurrentUserInfo().userId, 2580, 1080, 10, 10, 10)
        }).then(() => stream.startAudio());        

    } catch (error) {
        console.error('Joining session failed', error);
    }
}
