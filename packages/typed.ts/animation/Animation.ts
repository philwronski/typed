import { EmptyQueueError } from "../event/EmptyQueueError";
import { EventConsumer } from "../event/EventConsumer";
import { EventProducer } from "../event/EventProducer";
import { EventsQueue } from "../event/EventsQueue";
import TypedEvent, { EventType } from "../event/TypedEvent";
import getRandomInteger from "../utils/getRandomInteger";

const NO_ANIMATION = 0;

export class Animation implements EventProducer, EventConsumer {
  private id: number;
  private lastFrame: DOMHighResTimeStamp;
  private consumedEvents = new EventsQueue();

  constructor(private queue: EventsQueue) {
    this.id = NO_ANIMATION;
    this.lastFrame = performance.now();
  }

  public start(): number {
    this.id = requestAnimationFrame((startTime) => {
      this.run(startTime);
    });

    return this.id;
  }

  public run(startTime: DOMHighResTimeStamp): void {
    const timeElapsedSinceLastFrame = startTime - this.lastFrame;
    const eventDelay = getRandomInteger(80, 640);

    const mustWait = this.waitUntilForTheNextFrame(
      timeElapsedSinceLastFrame,
      eventDelay
    );
    if (mustWait) {
      return;
    }

    try {
      const currentEvent = this.queue.removeFirstEvent();
      this.consumeEvent(currentEvent);
    } catch (error) {
      if (error instanceof EmptyQueueError) {
        this.stop();
      }
    } finally {
      this.lastFrame = startTime;
    }
  }

  public stop(): number {
    cancelAnimationFrame(this.id);
    this.id = NO_ANIMATION;
    return this.id;
  }

  private requestNextAnimationFrame(): void {
    this.id = requestAnimationFrame((timestamp) => this.run(timestamp));
  }

  private waitUntilForTheNextFrame(
    timeElapsedSinceLastFrame: number,
    eventDelay: number
  ): boolean {
    this.requestNextAnimationFrame();
    return timeElapsedSinceLastFrame <= eventDelay;
  }

  consumeEvent(event: TypedEvent): void {
    switch (event.type) {
      case EventType.TYPE_CHARACTER:
        const { character, element } = event;
        const textNode = document.createTextNode(character);
        document.body.appendChild(textNode);
        this.publishEvents(event);
    }
  }

  publishEvents(...events: TypedEvent[]): void {
    this.consumedEvents.addToEnd(...events);
  }
}
