import { EventsQueue } from "./event/EventsQueue";
import TypedEvent, { EventType } from "./event/TypedEvent";

export class Typed {

  private eventsQueue: EventsQueue = new EventsQueue();
  constructor() {
  }

  public typeCharacters(characters: string): void {
    const events = this.decomposeCharactersIntoEvents(characters);
    this.publishEvents(...events);
  }

  public decomposeCharactersIntoEvents(characters: string): TypedEvent[] {
    return Array.from(characters).map((character) => ({
      type: EventType.TYPE_CHARACTER, character
    }));
  }

  public publishEvents(...events: TypedEvent[]): void {
    this.eventsQueue.addToEnd(...events);
  }

  public start(): void {

  }

  public pause(delay: number): void {

  }

  public stop(): void {

  }

  public run(startTime: DOMHighResTimeStamp): void {

  }
}
