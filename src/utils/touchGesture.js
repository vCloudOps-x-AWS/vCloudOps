export function startTouchGesture(touches) {
  if (touches.length !== 1) return null
  const touch = touches[0]
  return { id: touch.identifier, x: touch.clientX, y: touch.clientY }
}

export function touchGestureDelta(start, touches) {
  if (!start || touches.length !== 1 || touches[0].identifier !== start.id) return null
  return { x: start.x - touches[0].clientX, y: start.y - touches[0].clientY }
}
