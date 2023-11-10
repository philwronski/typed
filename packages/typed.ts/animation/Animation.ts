import { EmptyQueueError } from "../event/EmptyQueueError";
import { EventConsumer } from "../event/EventConsumer";
import { EventsQueue } from "../event/EventsQueue";
import TypedEvent, {
  AppendEmptyHTMLElement,
  DeleteLastVisibleNodeEvent,
  EventType,
  PauseEvent,
  TypeCharacterEvent,
} from "../event/TypedEvent";
import { NodeType } from "../node/Node";
import { NodeManager } from "../node/NodeManager";
import getRandomInteger from "../utils/getRandomInteger";
import "./animation.css";
import { AnimationConfig } from "./AnimationConfig";

const NO_ANIMATION = 0;
const PAUSE_ANIMATION = 0;

export const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
  loop: false,
  cursor: "|",
};

export class Animation implements EventConsumer {
  private id: number;
  private lastFrame: DOMHighResTimeStamp;
  private consumedEvents = new EventsQueue();

  private nodeManager = new NodeManager();

  private pauseDelay: DOMHighResTimeStamp = PAUSE_ANIMATION;

  constructor(
    private container: HTMLElement,
    private queue: EventsQueue,
    private config: AnimationConfig
  ) {
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
    let eventDelay = getRandomInteger(80, 640);
    if (!this.isAnimationPaused()) {
      eventDelay = this.pauseDelay;
    }

    const mustWait = this.waitUntilForTheNextFrame(
      timeElapsedSinceLastFrame,
      eventDelay
    );
    if (mustWait) {
      return;
    }

    if (!this.isAnimationPaused()) {
      this.pauseDelay = PAUSE_ANIMATION;
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
      case EventType.APPEND_EMPTY_HTML_ELEMENT:
        this.appendEmptyHtmlElement(event);
        break;
      case EventType.DELETE_LAST_VISIBLE_NODE:
        this.deleteLastVisibleNode(event);
        break;
      case EventType.PAUSE:
        this.pauseFor(event);
        break;
    }
  }

  private typeCharacter(event: TypeCharacterEvent): void {
    const { character } = event;
    const textNode = document.createTextNode(character);
    const container = event.container || this.container;
    container.appendChild(textNode);
    this.consumedEvents.addToEnd({ ...event });
    this.nodeManager.addToEnd({
      type: NodeType.TEXT_NODE,
      character,
      node: textNode,
    });
  }

  private appendEmptyHtmlElement(event: AppendEmptyHTMLElement): void {
    const { element } = event;
    this.container.appendChild(element);
  }

  private deleteLastVisibleNode(event: DeleteLastVisibleNodeEvent): void {
    const { node } = this.nodeManager.removeLastNode();
    this.container.removeChild(node);
    if (!event.fromLoop) {
      this.consumedEvents.addToEnd({ ...event });
    }
  }

  private deleteAllVisibleNodes(): void {
    const deleteEvents: DeleteLastVisibleNodeEvent[] =
      this.consumedEvents.events.map(() => ({
        type: EventType.DELETE_LAST_VISIBLE_NODE,
        fromLoop: true,
      }));
    this.queue.addToEnd(...deleteEvents.reverse());
  }

  private replay(): void {
    this.deleteAllVisibleNodes();
    this.queue.addToEnd(...this.consumedEvents.events);
    this.consumedEvents = new EventsQueue();
    this.requestNextAnimationFrame();
  }

  private pauseFor(event: PauseEvent): void {
    this.pauseDelay = event.delay;
    this.consumedEvents.addToEnd({ ...event });
  }

  private isAnimationPaused(): boolean {
    return this.pauseDelay === PAUSE_ANIMATION;
  }
}
