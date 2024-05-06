
import VideoPlayer from './VideoPlayer'
import { useRef } from 'react'
import './App.css'

function App() {
  const playerRef = useRef(null)
  const videoLink = "http://localhost:8000/uploads/courses/685cd12f-918a-4616-94d7-9ccffee8fe15/index.m3u8"

  const videoPlayerOptions = {
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: videoLink,
        type: 'application/x-mpegURL'
      }
    ]
  }

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, foreg
    player.on("waiting", () => {
      videojs.log('Playe is waiting')
    })

    player.on("dispose", () => {
      videojs.log('player will dispose')
    })
  }

  return (
    <>
      <div>Video Player</div>
      <VideoPlayer
        options={videoPlayerOptions}
        onReady={handlePlayerReady}
      />
    </>
  )
}

export default App

// {
//   "message": "Video converted to HLS format",
//   "videoUrl": "http://localhost:8000/uploads/courses/685cd12f-918a-4616-94d7-9ccffee8fe15/index.m3u8",
//   "lessionId": "685cd12f-918a-4616-94d7-9ccffee8fe15"
// }