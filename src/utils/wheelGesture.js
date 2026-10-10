const WHEEL_GESTURE_GAP_MS = 180
const WHEEL_GESTURE_DISTANCE_PX = 40

export function wheelGestureDirection(state, deltaY, now, deltaX = 0) {
  const newGesture = now - state.lastAt >= WHEEL_GESTURE_GAP_MS
  if (newGesture || !state.axis) state.axis = Math.abs(deltaX) > Math.abs(deltaY) ? 'x' : 'y'
  const delta = state.axis === 'x' ? deltaX : deltaY
  const direction = Math.sign(delta)
  state.lastAt = now
  if (!direction) return 0

  if (newGesture || direction !== state.direction) {
    state.direction = direction
    state.distance = 0
    state.consumed = false
  }

  if (state.consumed) return 0
  state.distance += Math.abs(delta)
  if (state.distance < WHEEL_GESTURE_DISTANCE_PX) return 0
  state.consumed = true
  return direction
}
