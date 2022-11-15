class RecorderProcessor extends AudioWorkletProcessor {
    /** Determine the buffer size (this is the same as the first argument of ScriptProcessor) */
    bufferSize = 4096;
    /** Track the current buffer fill level */
    _bytesWritten = 0;
    /** Create a buffer of fixed size */
    _buffer = new Float32Array(this.bufferSize);

    constructor() {
        super();
        this.initBuffer();
    }

    /**
     * Reset out _bytesWritten pointer to its initial position
     */
    initBuffer() {
        this._bytesWritten = 0;
    }

    /**
     * Check if our pointer is at its initial position
     * @returns {boolean}
     */
    isBufferEmpty() {
        return this._bytesWritten === 0;
    }

    /**
     * Check if our pointer is of the same size as our pre-allocated buffer
     * @returns {boolean}
     */
    isBufferFull() {
        return this._bytesWritten === this.bufferSize;
    }

    /**
     * Trim the buffer if ended prematurely
     */
    flush() {
        this.port.postMessage(
            this._bytesWritten < this.bufferSize
                ? this._buffer.slice(0, this._bytesWritten)
                : this._buffer
        );
        this.initBuffer();
    }

    /**
     * To capture the **Float32Array** of data samples produced by AudioWorkletProcessor,
     * we implements its **process** method and store the data
     * @param {Float32Array[][]} inputs 
     * @returns {boolean}
     */
    process(inputs, outputs, parameters) {
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
            this._buffer[this._bytesWritten++] = channelData[i];
        }
    }

}

registerProcessor("recorder.worklet", RecorderProcessor); // (오디오 프로세서 이름, 프로세서를 정의하는 클래스)