import { Animation, DEFAULT_ANIMATION_CONFIG } from "./animation/Animation";
import { AnimationConfig } from "./animation/AnimationConfig";
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
  private animationConfig?: AnimationConfig;

  private container: Element;

  constructor(container: string | Element, animationConfig?: AnimationConfig) {
    if (typeof container === "string") {
      const containerElement = document.querySelector(container);
      if (!containerElement) {
        throw new DOMException(
          `Container ${container} must be a valid DOM element`
        );
      }
      this.container = containerElement;
    } else {
      this.container = container;
    }

    this.animationConfig = animationConfig || DEFAULT_ANIMATION_CONFIG;
  }

  public typeCharacters(characters: string): Typed {
    const events = this.decomposeCharactersIntoEvents(characters);
    this.publishEvents(...events);
    return this;
  }

  public deleteLastNthCharacters(nth: number): Typed {
    for (let i = 0; i < nth; i++) {
      this.publishEvents({ type: EventType.DELETE_LAST_VISIBLE_NODE });
    }
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
    this.animation = new Animation(this.container as HTMLElement, this.queue);
    this.animation.start();
  }

  public pause(delay: number): void {
    this.publishEvents({ type: EventType.PAUSE, delay });
  }

  public stop(): void {
    this.animation?.stop();
  }
}
