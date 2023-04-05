import React from 'react'
import Draggable from 'react-draggable'

export default function DragWidget() {
  return (
    <Draggable bounds={{left: 0, top: 0, right: 100, bottom: 200}}>
        <div>DragWidget</div>
    </Draggable>
  )
}
