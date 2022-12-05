import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import useRecord from 'hooks/useRecord.jsx';
import { Box } from "styles/common/layout";
import { AwesomeText, Wave } from "styles/common/component";
import WaveSurfer from 'wavesurfer.js';

const RecordingPage = () => {
    const navigate = useNavigate();
    const [isPlaying, setIsPlaying] = useState(false);
    const waveform = useRef(null);
    const { isRecording, audio, record, pause } = useRecord({
        sampleRate: 48000,
        time: 10,
    });
    const url = "https://api.twilio.com//2010-04-01/Accounts/AC25aa00521bfac6d667f13fec086072df/Recordings/RE6d44bc34911342ce03d6ad290b66580c.mp3";

    useEffect(() => {
        if (!waveform.current) {
            waveform.current = WaveSurfer.create({
                barWidth: 3,
                barRadius: 3,
                barGap: 2,
                barMinHeight: 1,
                cursorWidth: 1,
                container: "#waveform",
                backend: "WebAudio",
                height: 80,
                progressColor: "#89a5ea",
                responsive: true,
                waveColor: "#C4C4C4",
                cursorColor: "transparent"
            });

            waveform.current.on('finish', () => {
                setIsPlaying(false);
            });
        }
        waveform.current.load(document.querySelector("#track"));
    }, [audio]);

    const handlePlayPause = () => {
        waveform.current.playPause();
        setIsPlaying(waveform.current.isPlaying());
    };

    return (
        <Box>
            <AwesomeText className="mb-4">음성 녹음 페이지입니다.</AwesomeText>
            <Button variant={!isRecording ? "outline-danger" : "outline-dark"} className='mb-2' onClick={!isRecording ? () => record() : () => pause()}>
                {!isRecording ? "🎙️ 녹음하기" : "🛑 중단하기"}
            </Button>
            <Button variant="outline-primary" className='mb-2' onClick={() => handlePlayPause()}>{isPlaying ? "⏸️ 일시정지" : "🔔 재생하기"}</Button>
            <Wave id="waveform" className='mb-2' />
            <audio id="track" src={audio ?? url} />
            <Button variant="outline-warning" onClick={() => navigate("/")}>🏠 돌아가기</Button>
        </Box>
    );
};

export default RecordingPage;

// TODO: 채널 1 입력 시 합치기