import TypedEvent from "./TypedEvent";

export interface EventConsumer {
  consumeEvent(event: TypedEvent): void;
}
