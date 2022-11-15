import { useState, useEffect } from "react";
import styled from "styled-components";
import { Box } from "styles/common/layout";
import { AwesomeText } from "styles/common/component";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import RecordIcon from "assets/images/record.png";

const RecordingPage = () => {

    const init = async () => {
        const context = new AudioContext();

        const microphone = await navigator.mediaDevices.getUserMedia({
            audio: true,
        }).then((stream) => stream);

        const source = context.createMediaStreamSource(microphone);

        // Worklet Processor Loading
        await context.audioWorklet.addModule("recorder.worklet.js");

        // Recorder Worklet 생성하기
        const recorder = new AudioWorkletNode(context, "recorder.worklet");
        console.log(recorder);

        // 오디오 그래프 연결하기
        source.connect(recorder).connect(context.destination);

        recorder.port.onmessage = (e) => {
            // console.log(e);
            // console.log("안녕하세요");
            // console.log(e.data);
        }
    }
    
    // source.disconnect();
    // scriptProcessor.disconnect();
    // audioContext.close();

    init();

    return (
        <Box>
            <AwesomeText className="mb-4">음성 녹음 페이지입니다.</AwesomeText>
            <MenuBox className="mb-4">
                <RecordButton onClick={() => console.log("Button")} />
            </MenuBox>
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
