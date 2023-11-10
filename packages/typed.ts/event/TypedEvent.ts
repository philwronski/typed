export enum EventType {
  TYPE_CHARACTER = "TYPE_CHARACTER",
  APPEND_EMPTY_HTML_ELEMENT = "APPEND_EMPTY_HTML_ELEMENT",
  REMOVE_ALL = "REMOVE_ALL",
  DELETE_LAST_VISIBLE_NODE = "DELETE_LAST_VISIBLE_NODE",
  PAUSE = "PAUSE",
  CALL_FUNCTION = "CALL_FUNCTION",
  CHANGE_DELETE_SPEED = "CHANGE_DELETE_SPEED",
  CHANGE_WRITE_SPEED = "CHANGE_WRITE_SPEED",
  CHANGE_CURSOR = "CHANGE_CURSOR",
}

export type TypeCharacterEvent = {
  type: EventType.TYPE_CHARACTER;
  character: string;
  container: Element;
};

export type AppendEmptyHTMLElement = {
  type: EventType.APPEND_EMPTY_HTML_ELEMENT;
  element: Element;
  parent?: Element;
};

export type CallbackEvent = {
  type: EventType.CALL_FUNCTION;
};

export type ChangeWriteSpeedEvent = {
  type: EventType.CHANGE_WRITE_SPEED;
  delay: "natural" | number;
};

export type ChangeDeleteSpeedEvent = {
  type: EventType.CHANGE_DELETE_SPEED;
  delay: "natural" | number;
};

export type PauseEvent = {
  type: EventType.PAUSE;
  delay: number; // in millisecond
};

export type DeleteLastVisibleNodeEvent = {
  type: EventType.DELETE_LAST_VISIBLE_NODE;
  fromLoop?: boolean;
};

export type RemoveAllEvent = {
  type: EventType.REMOVE_ALL;
};

type TypedEvent =
  | TypeCharacterEvent
  | AppendEmptyHTMLElement
  | CallbackEvent
  | ChangeWriteSpeedEvent
  | ChangeDeleteSpeedEvent
  | PauseEvent
  | DeleteLastVisibleNodeEvent
  | RemoveAllEvent;

export default TypedEvent;
