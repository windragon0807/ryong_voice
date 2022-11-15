import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Box } from "styles/common/layout";
import { AwesomeText } from "styles/common/component";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import RecordIcon from "assets/images/record.png";
import createLinkFromAudioBuffer from "./example/exporter.mjs";

const RecordingPage = () => {
    const context = new AudioContext();
    
    const [isRecording, setIsRecording] = useState(false);
    const [recordingLength, setRecordingLength] = useState(0);
    const [url, setUrl] = useState(null);
    const [recorder, setRecorder] = useState(null);

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        console.log({
            isRecording,
            recordingLength,
            url,
            recorder
        })
    }, [isRecording, recordingLength, url, recorder]);

    const init = async () => {
        if (context.state === "suspended") {
            await context.resume();
        }

        // TODO: 왜 Alert 창이 뜨지 않는지?
        const microphone = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: false,
                autoGainControl: false,
                noiseSuppression: false,
                latency: 0,
            },
        });

        if (!microphone) return;

        const source = context.createMediaStreamSource(microphone);

        const options = {
            numberOfChannels: source.channelCount,
            sampleRate: context.sampleRate,
            maxFrameCount: context.sampleRate * 10,
        };

        const workletNode = await setWorkletNode(options);
        setRecorder(workletNode);

        const recordingCallback = handleRecording(options);

        workletNode.port.onmessage = (event) => {
            console.log("[Message]", event.data.message);
            recordingCallback(event);
        };

        source.connect(workletNode).connect(context.destination);
    };

    const setWorkletNode = async (options) => {
        await context.audioWorklet.addModule("recording-processor.js");

        const WorkletRecordingNode = new AudioWorkletNode(context, "recording-processor", {
            processorOptions: options,
        });

        return WorkletRecordingNode;
    };

    const handleRecording = (options) => {
        // If the max length is reached, we can no longer record.
        const recordingEventCallback = async (event) => {
            console.log("[Message]", event.data.message);

            if (event.data.message === "MAX_RECORDING_LENGTH_REACHED") {
                setIsRecording(false);
                // recordButton.setAttribute.disabled = true;
            }

            if (event.data.message === "UPDATE_RECORDING_LENGTH") {
                setRecordingLength(event.data.recordingLength);
            }

            if (event.data.message === "SHARE_RECORDING_BUFFER") {
                const recordingBuffer = context.createBuffer(
                    options.numberOfChannels,
                    recordingLength,
                    context.sampleRate
                );

                for (let i = 0; i < options.numberOfChannels; i++) {
                    recordingBuffer.copyToChannel(event.data.buffer[i], i, 0);
                }

                setUrl(createLinkFromAudioBuffer(recordingBuffer, true));
            }
        };

        return recordingEventCallback;
    };

    const handleClick = () => {
        // FIXME: Uncaught TypeError: Cannot read properties of undefined (reading 'port')
        recorder.port.postMessage({
            message: "UPDATE_RECORDING_STATE",
            setRecording: isRecording,
        });
        setIsRecording((prev) => !prev);
        console.log(recorder);
    }

    // source.disconnect();
    // scriptProcessor.disconnect();
    // audioContext.close();

    return (
        <Box>
            <AwesomeText className="mb-4">음성 녹음 페이지입니다.</AwesomeText>
            <MenuBox className="mb-4">
                <RecordButton onClick={() => console.log("Button")} />
            </MenuBox>
            <div className="demo-box">
                <div id="recording">
                    <h2>Recording</h2>
                    <div>
                        <p>
                            Length: <span id="data-len">{Math.round((recordingLength / context.sampleRate) * 100) / 100}</span>sec
                        </p>
                        <button id="record" onClick={() => handleClick()}>
                            <span>{isRecording ? "Stop" : "Start"}</span> Recording
                        </button>
                    </div>
                    <div>
                        <audio id="player" className="w-full" controls src={url}></audio>

                        <div className="my-2">
                            <a href="" id="download" src={url} download="recording.wav">
                                <button>download file</button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
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
