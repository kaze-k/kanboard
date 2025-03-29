import { FullscreenExitOutlined, FullscreenOutlined } from "@ant-design/icons"
import { Button } from "antd"
import { useState } from "react"
import screenfull from "screenfull"

function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(screenfull.isFullscreen)
  const toggleFullScreen = () => {
    if (screenfull.isEnabled) {
      screenfull.toggle()
      setIsFullscreen(!isFullscreen)
    }
  }

  return (
    <Button
      shape="circle"
      onClick={toggleFullScreen}
      icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
    />
  )
}

export default FullscreenButton
