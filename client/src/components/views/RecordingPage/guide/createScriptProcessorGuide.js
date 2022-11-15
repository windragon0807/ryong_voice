const main = async () => {
     const context = new AudioContext();

     // 마이크 디바이스 가져오기
     const microphone = await navigator.mediaDevices.getUserMedia({
        audio: true,
     });

     // 마이크에서 데이터를 추출하기 위해 데이터 스트림 Source 설정
     const source = context.createMediaStreamSource(microphone);

     // Recorder 생성
     // 4096 : 버퍼 사이즈
     const recorder = context.createScriptProcessor(4096, 1, 1);

     // 오디오 그래프 연결
     source.connect(recorder).connect(context.destination);

     // Recorder로부터 버퍼 데이터 가져오기
     recorder.onaudioprocess = (event) => {
        const data = event.inputBuffer.getChannelData(0);
        // data는 Float32Array 배열 포맷이다.
        console.log(data);
     }
};