import { useRef } from "react"

function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  return (
    <div className="h-[95%] w-[95%]">
        <canvas ref={canvasRef} className="h-full w-full" id='canvas'></canvas>
    </div>
  )
}

export default GameCanvas