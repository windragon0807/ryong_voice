import { useState, useEffect } from "react";
import styled from "styled-components";
import { Box } from "styles/common/layout";
import { AwesomeText } from "styles/common/component";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import RecordIcon from "assets/images/record.png";

const RecordingPage = () => {
    const [stream, setStream] = useState();
    const [media, setMedia] = useState();
    const [onRec, setOnRec] = useState(true);
    const [source, setSource] = useState();
    const [analyser, setAnalyser] = useState();
    const [audioUrl, setAudioUrl] = useState();
    const [disabled, setDisabled] = useState(true);

    useEffect(() => {}, []);

    const onRecAudio = () => {
        setDisabled(true);

        // 음원정보를 담은 노드를 생성하거나 음원을 실행또는 디코딩 시키는 일을 한다
        // TODO: sampleRate와 같은 옵션이 또 있는가?
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });

        // 자바스크립트를 통해 음원의 진행상태에 직접접근에 사용된다.
        // TODO: Deprecated
        const analyser = audioCtx.createScriptProcessor(0, 1, 1);

        setAnalyser(analyser);

        function makeSound(stream) {
            // 내 컴퓨터의 마이크나 다른 소스를 통해 발생한 오디오 스트림의 정보를 보여준다.
            const source = audioCtx.createMediaStreamSource(stream);
            setSource(source);
            source.connect(analyser);
            analyser.connect(audioCtx.destination);
        }

        // 마이크 사용 권한 획득
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();
            setStream(stream);
            setMedia(mediaRecorder);
            makeSound(stream);

            analyser.onaudioprocess = function (e) {
                // TODO: 얘가 PCM 데이터 추출하는 문법
                console.log(e.inputBuffer.getChannelData(0));
                
                // 3분(180초) 지나면 자동으로 음성 저장 및 녹음 중지
                if (e.playbackTime > 180) {
                    stream.getAudioTracks().forEach(function (track) {
                        track.stop();
                    });
                    mediaRecorder.stop();
                    // 메서드가 호출 된 노드 연결 해제
                    analyser.disconnect();
                    audioCtx.createMediaStreamSource(stream).disconnect();

                    mediaRecorder.ondataavailable = function (e) {
                        setAudioUrl(e.data);
                        setOnRec(true);
                    };
                } else {
                    setOnRec(false);
                }
            };
        });
    };

    // 사용자가 음성 녹음을 중지 했을 때
    const offRecAudio = () => {
        // dataavailable 이벤트로 Blob 데이터에 대한 응답을 받을 수 있음
        media.ondataavailable = function (e) {
            console.log(e);
            setAudioUrl(e.data);
            setOnRec(true);
        };

        // 모든 트랙에서 stop()을 호출해 오디오 스트림을 정지
        stream.getAudioTracks().forEach(function (track) {
            track.stop();
        });

        // 미디어 캡처 중지
        media.stop();

        // 메서드가 호출 된 노드 연결 해제
        analyser.disconnect();
        source.disconnect();

        if (audioUrl) {
            URL.createObjectURL(audioUrl); // 출력된 링크에서 녹음된 오디오 확인 가능
        }

        // File 생성자를 사용해 파일로 변환
        const sound = new File([audioUrl], "soundBlob", {
            lastModified: new Date().getTime(),
            type: "audio",
        });

        setDisabled(false);
        console.log(sound); // File 정보 출력
    };

    const play = () => {
        const audio = new Audio(URL.createObjectURL(audioUrl)); // 😀😀😀
        audio.loop = false;
        audio.volume = 1;
        audio.play();
    };

    return (
        <Box>
            <AwesomeText className="mb-4">음성 녹음 페이지입니다.</AwesomeText>
            <MenuBox className="mb-4">
                <RecordButton onClick={() => console.log("Button")} />
            </MenuBox>
            <button onClick={onRec ? onRecAudio : offRecAudio}>녹음</button>
            <button onClick={play} disabled={disabled}>
                재생
            </button>
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
