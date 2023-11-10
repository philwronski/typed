import { Animation, DEFAULT_ANIMATION_CONFIG } from "./animation/Animation";
import { AnimationConfig } from "./animation/AnimationConfig";
import { EventProducer } from "./event/EventProducer";
import { EventsQueue } from "./event/EventsQueue";
import TypedEvent, { EventType, TypeCharacterEvent } from "./event/TypedEvent";
import { deepCopy } from "./utils/deepCopy";
import { styled } from "./utils/styled";

export class Typed implements EventProducer {
  private eventsQueue: EventsQueue = new EventsQueue();

  private inputContainer: HTMLElement;
  private cursorContainer: HTMLElement;

  get queue(): EventsQueue {
    return deepCopy<EventsQueue>(this.eventsQueue);
  }

  private animation?: Animation;
  private animationConfig: AnimationConfig;

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

    this.inputContainer = document.createElement("span");
    this.cursorContainer = document.createElement("span");

    this.animationConfig = { ...DEFAULT_ANIMATION_CONFIG, ...animationConfig };
  }

  public typeCharacters(characters: string, element?: Element): Typed {
    const events: TypeCharacterEvent[] = Array.from(characters).map(
      (character) => ({
        type: EventType.TYPE_CHARACTER,
        character,
        container: element ? element : this.inputContainer,
      })
    );
    this.publishEvents(...events);
    return this;
  }

  public deleteLastNthCharacters(nth: number): Typed {
    for (let i = 0; i < nth; i++) {
      this.publishEvents({ type: EventType.DELETE_LAST_VISIBLE_NODE });
    }
    return this;
  }

  public publishEvents(...events: TypedEvent[]): void {
    this.eventsQueue.addToEnd(...events);
  }

  public start(): void {
    console.log(this.queue);
    this.buildUI();
    this.animation = new Animation(
      this.inputContainer as HTMLElement,
      this.queue,
      this.animationConfig
    );
    this.animation.start();
  }

  public pauseFor(delay: number): Typed {
    this.publishEvents({ type: EventType.PAUSE, delay });
    return this;
  }

  public typeHTML(html: string | Element): Typed {
    const element =
      typeof html === "string" ? this.parseHTMLString(html) : html;
    this.typeElementContent(element);
    return this;
  }

  private typeElementContent(element: Element, parent?: ParentNode): void {
    const hasChildren = !!element.children.length;
    console.log(element.textContent, element.childNodes, element.children);
    const cloneEmptyElement = document.createElement(element.tagName);
    this.publishEvents({
      type: EventType.APPEND_EMPTY_HTML_ELEMENT,
      element: cloneEmptyElement,
      ...(parent ? { parent } : null),
    });

    element.childNodes.forEach((child) => {
      switch (child.nodeType) {
        case Node.TEXT_NODE:
          this.typeCharacters(child.textContent || "", cloneEmptyElement);
          break;
        case Node.ELEMENT_NODE:
          new
          // this.typeElementContent(child as Element, child.parentNodeparentElement.);
          break;
      }
    });

    // if (hasChildren) {
    //   for (const child of element.children) {
    //     this.typeElementContent(child, parent);
    //   }
    // } else {
    //   this.typeCharacters(element.textContent || "", cloneEmptyElement);
    // }
  }

  private parseHTMLString(html: string): Element {
    const safeHTML = html.trim();
    const template = document.createElement("template");
    template.innerHTML = safeHTML;
    const element = template.content.firstElementChild;
    if (!element) {
      throw new DOMException(`Error during parsing: ${html}`);
    }
    return element;
  }

  public stop(): void {
    this.animation?.stop();
  }

  private buildUI(): void {
    this.inputContainer.className = "typed__input";
    styled(this.inputContainer, {
      verticalAlign: "middle",
    });

    this.cursorContainer.className = "typed__cursor";
    this.container.appendChild(this.inputContainer);
    const { cursor } = this.animationConfig;
    let cursorElement;
    if (typeof cursor === "string") {
      cursorElement = document.createTextNode(cursor);
      styled(this.cursorContainer, {
        animation: "Typewriter-cursor 1s infinite",
        marginLeft: "-2px",
      });
    } else {
      cursorElement = cursor;
    }

    this.cursorContainer.appendChild(cursorElement);
    this.container.appendChild(this.cursorContainer);
  }
}
