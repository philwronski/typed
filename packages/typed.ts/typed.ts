import { Animation } from "./animation/Animation";
import { EventProducer } from "./event/EventProducer";
import { EventsQueue } from "./event/EventsQueue";
import TypedEvent, { EventType } from "./event/TypedEvent";
import { deepCopy } from "./utils/deepCopy";

export class Typed implements EventProducer {
  private eventsQueue: EventsQueue = new EventsQueue();

  get queue(): EventsQueue {
    return deepCopy<EventsQueue>(this.eventsQueue);
  }

  private animation?: Animation;

  constructor() {}

  public typeCharacters(characters: string): Typed {
    const events = this.decomposeCharactersIntoEvents(characters);
    this.publishEvents(...events);
    return this;
  }

  public decomposeCharactersIntoEvents(characters: string): TypedEvent[] {
    return Array.from(characters).map((character) => ({
      type: EventType.TYPE_CHARACTER,
      character,
    }));
  }

  public publishEvents(...events: TypedEvent[]): void {
    this.eventsQueue.addToEnd(...events);
  }

  public start(): void {
    this.animation = new Animation(this.queue);
    this.animation.start();
  }

  public pause(delay: number): void {
    this.publishEvents({ type: EventType.PAUSE, delay });
  }

  public stop(): void {
    this.animation?.stop();
  }
}
