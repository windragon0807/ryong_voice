import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Box } from "styles/common/layout";
import { AwesomeText } from "styles/common/component";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import RecordIcon from "assets/images/record.png";

const RecordingPage = () => {

    const [isRecording, setIsRecording] = useState(false);
    const [context, setContext] = useState(null);
    const [source, setSource] = useState(null);
    const [recorder, setRecorder] = useState(null);
    
    useEffect(() => {
        return () => {
            setContext(null);
            setSource(null);
            setRecorder(null);
        }
    }, []);

    const handleRecord = async () => {
        setIsRecording(true);

        const context = new AudioContext();
        setContext(context);

        const microphone = await navigator.mediaDevices.getUserMedia({
            audio: true,
        }).then((stream) => stream);

        const source = context.createMediaStreamSource(microphone);
        setSource(source);
        // Worklet Processor Loading
        await context.audioWorklet.addModule("recorder.worklet.js");

        // Recorder Worklet 생성하기
        const recorder = new AudioWorkletNode(context, "recorder.worklet");
        setRecorder(recorder);

        // 오디오 그래프 연결하기
        source.connect(recorder).connect(context.destination);

        recorder.port.onmessage = (e) => {
            console.log(e);
            console.log(e.data);
        }
    };

    const handleStop = () => {
        setIsRecording(false);
        
        context.close();
        source.disconnect();
        recorder.disconnect();
    };

    const handlePlay = () => {
        recorder.port.postMessage({
            message: "hello",
        })
    };

    return (
        <Box>
            <AwesomeText className="mb-4">음성 녹음 페이지입니다.</AwesomeText>
            {/* <MenuBox className="mb-4">
                <RecordButton onClick={() => console.log("Button")} />
            </MenuBox> */}
            <Button variant={!isRecording ? "danger" : "light"} className='mb-2' onClick={!isRecording ? () => handleRecord() : () => handleStop()}>{!isRecording ? "🎙️ 녹음하기" : "🛑 중단하기"}</Button>
            <Button variant="primary" className='mb-2' onClick={() => handlePlay()}>🎲 재생하기</Button>
            <Link to="/">
                <Button variant="secondary">🏠 돌아가기</Button>
            </Link>
        </Box>
    );
};

const MenuBox = styled.div`
    width: 300px;
    height: 50px;
    border-radius: 30px;
    background: white;
    border: 2px solid #dfe1e5;
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        box-shadow: 0 1px 6px rgb(32 33 36 / 28%);
    }
`;

const RecordButton = styled.div`
    width: 35px;
    height: 35px;
    background: url(${RecordIcon});
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    border-radius: 50%;
    transition: all 0.2s;

    &:hover {
        opacity: 0.8;
        transform: scale(1.15);
    }
`;

export default RecordingPage;
