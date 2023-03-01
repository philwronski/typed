import { EmptyQueueError } from "../event/EmptyQueueError";
import { EventConsumer } from "../event/EventConsumer";
import { EventsQueue } from "../event/EventsQueue";
import TypedEvent, {
  DeleteLastVisibleNodeEvent,
  EventType,
  TypeCharacterEvent,
} from "../event/TypedEvent";
import { NodeType } from "../node/Node";
import { NodeManager } from "../node/NodeManager";
import getRandomInteger from "../utils/getRandomInteger";
import { AnimationConfig } from "./AnimationConfig";

const NO_ANIMATION = 0;

export const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
  loop: false,
};

export class Animation implements EventConsumer {
  private id: number;
  private lastFrame: DOMHighResTimeStamp;
  private consumedEvents = new EventsQueue();
  private config: AnimationConfig;

  private nodeManager = new NodeManager();

  constructor(
    private container: Element,
    private queue: EventsQueue,
    config?: AnimationConfig
  ) {
    this.id = NO_ANIMATION;
    this.lastFrame = performance.now();
    this.config = config || DEFAULT_ANIMATION_CONFIG;
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
        const { loop } = this.config;
        if (loop) {
          this.replay();
        }
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
        this.typeCharacter(event);
        break;
      case EventType.DELETE_LAST_VISIBLE_NODE:
        this.deleteLastVisibleNode();
        break;
    }
  }

  private typeCharacter(event: TypeCharacterEvent): void {
    const { character, element } = event;
    const textNode = document.createTextNode(character);
    this.container.appendChild(textNode);
    this.consumedEvents.addToEnd({ ...event });
    this.nodeManager.addToEnd({
      type: NodeType.TEXT_NODE,
      character,
      node: textNode,
    });
  }

  private deleteLastVisibleNode(): void {
    const { node } = this.nodeManager.removeLastNode();
    this.container.removeChild(node);
  }

  private deleteAllVisibleNodes(): void {
    const deleteEvents: DeleteLastVisibleNodeEvent[] =
      this.consumedEvents.events.map((event) => ({
        type: EventType.DELETE_LAST_VISIBLE_NODE,
      }));
    this.queue.addToEnd(...deleteEvents.reverse());
  }

  private replay(): void {
    this.deleteAllVisibleNodes();
    this.queue.addToEnd(...this.consumedEvents.events);
    this.consumedEvents = new EventsQueue();
    this.requestNextAnimationFrame();
  }
}
