class RecordingProcessor extends AudioWorkletProcessor {

    constructor(options) {
        super();

        console.log("🎉 Initialize Recording Processor ...");

        this.sampleRate = 16000;
        this.numberOfChannels = 1;
        this.maxRecordingFrames = 4096;

        if (options && options.processorOptions) {
            const { sampleRate, numberOfChannels, maxFrameCount } = options.processorOptions;

            this.sampleRate = sampleRate;
            this.numberOfChannels = numberOfChannels;
            this.maxRecordingFrames = maxFrameCount;
        }

        this.recordingBuffer = new Array(this.numberOfChannels).fill(new Float32Array(this.maxRecordingFrames));
        
        this.port.onmessage = (event) => {
            console.log({
                message: event.data.message,
                sampleRate: this.sampleRate,
                numberOfChannels: this.numberOfChannels,
                maxRecordingFrames: this.maxRecordingFrames,
            });
        }

        this.bytesWritten = 0;
        this.buffer = new Float32Array(this.maxRecordingFrames);
    }

    /**
     * Reset out bytesWritten pointer to its initial position
     */
    initBuffer() {
        this.bytesWritten = 0;
    }

    /**
     * Check if our pointer is at its initial position
     * @returns {boolean}
     */
    isBufferEmpty() {
        return this.bytesWritten === 0;
    }

    /**
     * Check if our pointer is of the same size as our pre-allocated buffer
     * @returns {boolean}
     */
    isBufferFull() {
        return this.bytesWritten === this.maxRecordingFrames;
    }

    /**
     * Trim the buffer if ended prematurely
     */
    flush() {
        this.port.postMessage(
            this.bytesWritten < this.maxRecordingFrames
                ? this.buffer.slice(0, this.bytesWritten)
                : this.buffer
        );
        this.initBuffer();
    }

    /**
     * To capture the **Float32Array** of data samples produced by AudioWorkletProcessor,
     * we implements its **process** method and store the data
     * @param {Float32Array[][]} inputs processor에게서 받은 PCM 오디오 데이터
     * @param {Float32Array[][]} outputs processor 밖으로 내보내도록 설정할 오디오 데이터
     * @param {Object} params
     * @returns {boolean}
     */
    process(inputs, outputs, params) {
        for (let input = 0; input < 1; input++) {
            for (let channel = 0; channel < this.numberOfChannels; channel++) {
                for (let sample = 0; sample < inputs[input][channel].length; sample++) {
                    /**
                     * inputs[input][channel] : 한 채널에서 받은 
                     */
                    console.log(inputs[input][channel][sample]);
                }
            }
        }

        // Grabbing the first channel similar to ScriptProcessorNode
        this.append(inputs[0][0]);

        return true; // 다른 브라우저와 호환상의 이유로 항상 true 반환
    }

    /**
     * This method allows us to fill the data buffer with microphone samples.
     * @param {Float32Array} channelData 
     */
    append(channelData) {
        if (this.isBufferFull()) {
            this.flush();
        }

        if (!channelData) return;

        for (let i = 0; i < channelData.length; i++) {
            this.buffer[this.bytesWritten++] = channelData[i];
        }
    }

}

registerProcessor("recorder.worklet", RecordingProcessor); // (오디오 프로세서 이름, 프로세서를 정의하는 클래스)