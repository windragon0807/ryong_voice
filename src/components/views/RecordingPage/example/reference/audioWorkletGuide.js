const main = async () => {
    const context = new AudioContext();

    const microphone = await navigator.mediaDevices.getUserMedia({
        audio: true,
    });

    const source = context.createMediaStreamSource(microphone);

    // Worklet Processor Loading
    await context.audioWorklet.addModule("/recorder.worklet.js");

    // Recorder Worklet 생성하기
    const recorder = new AudioWorkletNode(context, "recorder.worklet");

    // 오디오 그래프 연결하기
    source.connect(recorder).connect(context.destination);

    recorder.port.onmessage = (e) => {
        console.log(e.data);
    }
}