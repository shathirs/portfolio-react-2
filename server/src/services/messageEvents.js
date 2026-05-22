import { EventEmitter } from 'events'

const bus = new EventEmitter()
bus.setMaxListeners(100)

export function emitMessageCreated(message) {
  bus.emit('created', message)
}

export function emitMessageUpdated(message) {
  bus.emit('updated', message)
}

export function emitMessageDeleted(id) {
  bus.emit('deleted', id)
}

export function onMessageCreated(listener) {
  bus.on('created', listener)
  return () => bus.off('created', listener)
}

export function onMessageUpdated(listener) {
  bus.on('updated', listener)
  return () => bus.off('updated', listener)
}

export function onMessageDeleted(listener) {
  bus.on('deleted', listener)
  return () => bus.off('deleted', listener)
}
