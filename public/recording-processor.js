class RecordingProcessor extends AudioWorkletProcessor {
    constructor(options) {
        super();

        this.sampleRate = 0;
        this.maxRecordingFrames = 0;
        this.numberOfChannels = 0;

        if (options && options.processorOptions) {
            const { numberOfChannels, sampleRate, maxFrameCount } = options.processorOptions;

            this.sampleRate = sampleRate;
            this.maxRecordingFrames = maxFrameCount;
            this.numberOfChannels = numberOfChannels;
        }

        this._recordingBuffer = new Array(this.numberOfChannels).fill(new Float32Array(this.maxRecordingFrames));

        this.recordedFrames = 0;
        this.isRecording = false; // 녹음 진행 상태

        // We will use a timer to gate our messages; this one will publish at 60hz
        this.framesSinceLastPublish = 0;
        this.publishInterval = this.sampleRate / 60; // 800
        
        // We will keep a live sum for rendering the visualizer.
        this.sampleSum = 0;

        this.port.onmessage = (event) => {
            if (event.data.message === "UPDATE_RECORDING_STATE") {
                console.log("[App] -> [Processor]", {
                    message: event.data.message,
                    isRecording: event.data.isRecording,
                });
                this.isRecording = event.data.isRecording;

                if (!this.isRecording) {
                    // 현재까지 녹음한 버퍼를 App에 전달
                    const message = {
                        message: "SHARE_RECORDING_BUFFER",
                        buffer: this._recordingBuffer,
                    }
                    this.port.postMessage(message);
                    console.log("[Processor] -> [App]", message);
                }
            }
        };

        console.log("🆕 Processor Initialized", {
            sampleRate: this.sampleRate,
            numberOfChannels: this.numberOfChannels,
            maxRecordingTime: this.maxRecordingFrames / this.sampleRate,
         });
    }

    process(inputs, outputs, params) {
        for (let input = 0; input < 1; input++) {
            for (let channel = 0; channel < this.numberOfChannels; channel++) {
                for (let sample = 0; sample < inputs[input][channel].length; sample++) {
                    const currentSample = inputs[input][channel][sample];

                    // Copy data to recording buffer.
                    if (this.isRecording) {
                        this._recordingBuffer[channel][sample + this.recordedFrames] = currentSample;
                    }

                    // 🏷️ outuput에 Raw 데이터를 넣으면 바로 스피커로 출력된다. (실시간 출력)
                    // outputs[input][channel][sample] = currentSample;

                    // Sum values for visualizer
                    this.sampleSum += currentSample;
                }
            }
        }

        const shouldPublish = this.framesSinceLastPublish >= this.publishInterval;

        if (this.isRecording) {
            if (this.recordedFrames + 128 < this.maxRecordingFrames) {
                // Limit 녹음 시간에 도달하지 않았을 때
                this.recordedFrames += 128;

                // Post a recording recording length update on the clock's schedule
                if (shouldPublish) {
                    const message = {
                        message: "UPDATE_RECORDING_STATE",
                        recordingLength: this.recordedFrames,
                        recordingTime: Math.round((this.recordedFrames / this.sampleRate) * 100) / 100,
                        gain: this.sampleSum / this.framesSinceLastPublish,
                    };

                    this.framesSinceLastPublish = 0;
                    this.sampleSum = 0;

                    this.port.postMessage(message);
                    console.log("[Processor] -> [App]", message);
                } else {
                    this.framesSinceLastPublish += 128;
                }
            } else {
                // Limit 녹음 시간에 도달했을 때
                this.isRecording = false;
                this.port.postMessage({
                    message: "MAX_RECORDING_LENGTH_REACHED",
                });

                return false;
            }
        }

        return true;
    }
}

registerProcessor("recording-processor", RecordingProcessor);