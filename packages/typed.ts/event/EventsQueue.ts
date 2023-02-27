import { deepCopy } from "../utils/deepCopy";
import { EmptyQueueError } from "./EmptyQueueError";
import TypedEvent from "./TypedEvent";

export class EventsQueue {
  private queue: TypedEvent[] = [];

  get events(): TypedEvent[] {
    return deepCopy<TypedEvent[]>(this.queue);
  }

  constructor() {}

  public getFirstElement(): TypedEvent {
    if (this.queue.length) {
      return this.queue.slice(0, 1)[0];
    }
    throw new EmptyQueueError("Impossible to get the first event.");
  }

  public addToBeginning(...events: TypedEvent[]) {
    this.queue.unshift(...events);
  }

  public removeFirstEvent(): TypedEvent {
    if (this.queue.length) {
      return this.queue.shift() as TypedEvent;
    }

    throw new EmptyQueueError("Impossible to delete the first event.");
  }

  public getLastElement(): TypedEvent {
    if (this.queue.length) {
      return this.queue.slice(-1, 1)[0];
    }
    throw new EmptyQueueError("Impossible to get the last event.");
  }

  public addToEnd(...events: TypedEvent[]) {
    this.queue.push(...events);
  }

  public removeLastEvent(): TypedEvent {
    if (this.queue.length) {
      return this.queue.pop() as TypedEvent;
    }

    throw new EmptyQueueError("Impossible to delete the last event.");
  }
}
