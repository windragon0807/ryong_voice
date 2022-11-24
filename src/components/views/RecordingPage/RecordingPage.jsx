import styled from "styled-components";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import useRecord from 'hooks/useRecord.jsx';
import { Box } from "styles/common/layout";
import { AwesomeText } from "styles/common/component";

const RecordingPage = () => {
    const { isRecording, time, audio, record, pause } = useRecord({
        sampleRate: 48000,
        time: 10,
    });

    return (
        <Box>
            <AwesomeText className="mb-4">음성 녹음 페이지입니다.</AwesomeText>
            <Button variant={!isRecording ? "danger" : "light"} className='mb-2' onClick={!isRecording ? () => record() : () => pause()}>
                {!isRecording ? "🎙️ 녹음하기" : "🛑 중단하기"}
            </Button>
            <Button variant="primary" className='mb-2' disabled>🐇 {time}</Button>
            <Audio className='mb-2' controls src={audio} />
            <Link to="/">
                <Button variant="secondary">🏠 돌아가기</Button>
            </Link>
        </Box>
    );
};

const Audio = styled.audio`
    border: 1px solid #dfe1e5;
    border-radius: 40px;

    &:hover {
        box-shadow: 0 1px 6px rgb(32 33 36 / 28%);
        border-color: rgba(223, 225, 229, 0);
    }
    
    // 패널 배경
    &::-webkit-media-controls-panel {
        background: #fff;
        box-shadow: none;
    }
    // 음소거 버튼
    &::-webkit-media-controls-mute-button {}
    // 시작/중지 버튼
    &::-webkit-media-controls-play-button {}
    // 재생 진행 시간
    &::-webkit-media-controls-current-time-display {
        font-weight: 700;
    }
    // 재생 가능 시간
    &::-webkit-media-controls-time-remaining-display {
        font-weight: 700;
    }
    // 재생 바
    &::-webkit-media-controls-timeline {}
    // 볼륨 슬라이더
    &::-webkit-media-controls-volume-slider {}
`;

export default RecordingPage;