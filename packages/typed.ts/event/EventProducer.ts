import TypedEvent from "./TypedEvent";

export interface EventProducer {
  publishEvents(...events: TypedEvent[]): void;
}
