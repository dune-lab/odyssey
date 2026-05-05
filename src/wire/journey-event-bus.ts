import { EventEmitter } from 'node:events';

const bus = new EventEmitter();
bus.setMaxListeners(0);

export type JourneyUpdate = { id: string; currentStep: string; status: string };

export function emit(journeyId: string, update: JourneyUpdate): void {
  bus.emit(journeyId, update);
}

export function on(journeyId: string, cb: (update: JourneyUpdate) => void): void {
  bus.on(journeyId, cb);
}

export function off(journeyId: string, cb: (update: JourneyUpdate) => void): void {
  bus.off(journeyId, cb);
}
