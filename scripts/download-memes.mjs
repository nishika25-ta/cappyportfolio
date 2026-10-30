import fs from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';

const mediaList = [
  {
    name: 'meme-1',
    title: 'Gato XD / Spinning Cat Meme',
    videoUrl: 'https://v1.pinimg.com/videos/iht/expMp4/14/17/e9/1417e95c4cde13137d9cd7eefb44bd95_720w.mp4',
    posterUrl: 'https://i.pinimg.com/originals/16/57/04/165704f8d6f742b38fd354c3dabb4b9a.jpg'
  },
  {
    name: 'meme-2',
    title: 'Pin 2 Cat Meme',
    videoUrl: 'https://v1.pinimg.com/videos/iht/expMp4/f4/e5/b0/f4e5b08d91ca23ce77fa1a368fd57196_720w.mp4',
    posterUrl: 'https://i.pinimg.com/originals/46/6d/4b/466d4b54f03b04e3307a34069faee67e.jpg'
  },
  {
    name: 'meme-3',
    title: 'Funny Cat Video Meme 3',
    videoUrl: 'https://v1.pinimg.com/videos/iht/expMp4/43/85/b7/4385b7268c8d01ef7710708c8e68f1c0_720w.mp4',
    posterUrl: 'https://i.pinimg.com/originals/90/d9/c7/90d9c74634ac87ab3ee8f3bb3714a5b3.jpg'
  },
  {
    name: 'meme-4',
    title: 'Super Cute Cat Meme 4',
    videoUrl: 'https://v1.pinimg.com/videos/iht/expMp4/56/ea/97/56ea9768b37a8983cb10aa26d3d01399_720w.mp4',
    posterUrl: 'https://i.pinimg.com/originals/97/d7/bf/97d7bf8c109f1bf77a57a40bb6f1d6df.jpg'
  },
  {
    name: 'meme-5',
    title: 'Cat LOL Meme 5',
    videoUrl: 'https://v1.pinimg.com/videos/iht/expMp4/d7/27/27/d72727c6e2f0b39ddb40010b3320acb5_720w.mp4',
    posterUrl: 'https://i.pinimg.com/originals/ba/22/d8/ba22d8d3e6abfc61dc278b63113c762e.jpg'
  }
];

const targetDir = path.resolve('public/memes');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

async function downloadFile(url, destPath) {
  console.log(`Downloading: ${url} -> ${destPath}`);
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    }
  });
  if (!res.ok) {
    throw new Error(`Failed to download ${url}: ${res.statusText}`);
  }
  const fileStream = fs.createWriteStream(destPath);
  await pipeline(res.body, fileStream);
  const stat = fs.statSync(destPath);
  console.log(`Saved ${destPath} (${stat.size} bytes)`);
}

async function run() {
  for (const item of mediaList) {
    const videoPath = path.join(targetDir, `${item.name}.mp4`);
    const posterPath = path.join(targetDir, `${item.name}.jpg`);

    try {
      await downloadFile(item.videoUrl, videoPath);
    } catch (e) {
      console.error(`Error downloading video for ${item.name}:`, e.message);
    }

    try {
      await downloadFile(item.posterUrl, posterPath);
    } catch (e) {
      console.error(`Error downloading poster for ${item.name}:`, e.message);
    }
  }
  console.log('Finished downloading all meme assets!');
}

run();
