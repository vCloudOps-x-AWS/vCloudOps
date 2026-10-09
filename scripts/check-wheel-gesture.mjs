import assert from 'node:assert/strict'
import { wheelGestureDirection } from '../src/utils/wheelGesture.js'
import { startTouchGesture, touchGestureDelta } from '../src/utils/touchGesture.js'

const state = { lastAt: -Infinity, direction: 0, distance: 0, consumed: false }
assert.equal(wheelGestureDirection(state, 15, 0), 0)
assert.equal(wheelGestureDirection(state, 25, 20), 1)
assert.equal(wheelGestureDirection(state, 200, 100), 0, 'same burst must not skip a card')
for (let time = 150; time <= 1150; time += 50) {
  assert.equal(wheelGestureDirection(state, 20, time), 0, 'sustained momentum must remain one gesture')
}
assert.equal(wheelGestureDirection(state, 45, 1350), 1, 'new burst must advance')
assert.equal(wheelGestureDirection(state, -45, 1370), -1, 'direction change starts a new gesture')

const start = startTouchGesture([{ identifier: 7, clientX: 100, clientY: 200 }])
assert.deepEqual(touchGestureDelta(start, [{ identifier: 7, clientX: 98, clientY: 135 }]), { x: 2, y: 65 })
assert.equal(touchGestureDelta(start, [{ identifier: 8, clientX: 98, clientY: 135 }]), null, 'interrupted touch cannot navigate')
assert.equal(startTouchGesture([{ identifier: 7 }, { identifier: 8 }]), null, 'multitouch cannot navigate')
console.log('Team gesture check passed')
