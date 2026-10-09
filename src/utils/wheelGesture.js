const WHEEL_GESTURE_GAP_MS = 180
const WHEEL_GESTURE_DISTANCE_PX = 40

export function wheelGestureDirection(state, deltaY, now) {
  const direction = Math.sign(deltaY)
  if (!direction) return 0

  if (now - state.lastAt >= WHEEL_GESTURE_GAP_MS || direction !== state.direction) {
    state.direction = direction
    state.distance = 0
    state.consumed = false
  }

  state.lastAt = now
  if (state.consumed) return 0
  state.distance += Math.abs(deltaY)
  if (state.distance < WHEEL_GESTURE_DISTANCE_PX) return 0
  state.consumed = true
  return direction
}
