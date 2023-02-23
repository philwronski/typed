export enum EventType {
  TYPE_CHARACTER = 'TYPE_CHARACTER',
  REMOVE_CHARACTER = 'REMOVE_CHARACTER',
  REMOVE_ALL = 'REMOVE_ALL',
  DELETE_LAST_VISIBLE_NODE = 'DELETE_LAST_VISIBLE_NODE',
  PAUSE = 'PAUSE',
  CALL_FUNCTION = 'CALL_FUNCTION',
  CHANGE_DELETE_SPEED = 'CHANGE_DELETE_SPEED',
  CHANGE_WRITE_SPEED = 'CHANGE_WRITE_SPEED',
  CHANGE_CURSOR = 'CHANGE_CURSOR',
}

export type TypeCharacterEvent = {
  type: EventType.TYPE_CHARACTER;
  character: string;
  element?: Element;
}

export type CallbackEvent = {
  type: EventType.CALL_FUNCTION;
}

export type ChangeWriteSpeedEvent = {
  type: EventType.CHANGE_WRITE_SPEED;
  delay: 'natural' | number;
}

export type ChangeDeleteSpeedEvent = {
  type: EventType.CHANGE_DELETE_SPEED;
  delay: 'natural' | number;
}

export type PauseEvent = {
  type: EventType.PAUSE;
  delay: number;
}

export type DeleteLastVisibleNodeEvent = {
  type: EventType.DELETE_LAST_VISIBLE_NODE;
  node: Element | Text;
}

export type RemoveAllEvent = {
  type: EventType.REMOVE_ALL;
}

type TypedEvent =
  TypeCharacterEvent
  | CallbackEvent
  | ChangeWriteSpeedEvent
  | ChangeDeleteSpeedEvent
  | PauseEvent
  | DeleteLastVisibleNodeEvent
  | RemoveAllEvent;

export default TypedEvent;
