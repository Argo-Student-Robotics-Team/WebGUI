import { StreamCamera, Codec } from 'pi-camera-connect';
import * as fs from 'fs';

const runApp = async () => {
  const streamCamera = new StreamCamera({
    codec: Codec.H264,
  });

  const videoStream = streamCamera.createStream();

  const writeStream = fs.createWriteStream('video-stream.h264');

  videoStream.pipe(writeStream);

  await streamCamera.startCapture();

  await new Promise(resolve => setTimeout(() => resolve(), 5000));

  await streamCamera.stopCapture();
};

runApp();