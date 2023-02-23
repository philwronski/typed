import { EmptyQueueError } from "./EmptyQueueError";
import { EventsQueue } from "./EventsQueue";
import TypedEvent, { EventType } from "./TypedEvent";

describe('EventsQueue', () => {

  test('Get the first element of empty queue must throw an error', () => {
    const queue = new EventsQueue();

    expect(() => queue.getFirstElement()).toThrow(new EmptyQueueError("Impossible to get the first event."))
  })

  test('Get the last element of empty queue must throw an error', () => {
    const queue = new EventsQueue();

    expect(() => queue.getLastElement()).toThrow(new EmptyQueueError("Impossible to get the last event."))
  })

  test('Add multiple events to the beginning of the queue must change the index of elements', () => {
    const queue = new EventsQueue();
    const event1: TypedEvent = {
      type: EventType.TYPE_CHARACTER,
      character: 'h'
    }
    const event2: TypedEvent = {
      type: EventType.TYPE_CHARACTER,
      character: 'i'
    }
    queue.addToBeginning(event1)
    queue.addToBeginning(event2)


    const firstElement = queue.getFirstElement();

    expect(firstElement).toEqual(event2);
  })

  test('Add multiple events to the beginning of the queue in same time must not change the index of elements', () => {
    const queue = new EventsQueue();
    const event1: TypedEvent = {
      type: EventType.TYPE_CHARACTER,
      character: 'h'
    }
    const event2: TypedEvent = {
      type: EventType.TYPE_CHARACTER,
      character: 'i'
    }
    queue.addToBeginning(event1, event2)


    const firstElement = queue.getFirstElement();

    expect(firstElement).toEqual(event1);
  })

  test('Add multiple events to the end of the queue must change the index of elements', () => {
    const queue = new EventsQueue();
    const event1: TypedEvent = {
      type: EventType.TYPE_CHARACTER,
      character: 'h'
    }
    const event2: TypedEvent = {
      type: EventType.TYPE_CHARACTER,
      character: 'i'
    }
    queue.addToEnd(event1)
    queue.addToEnd(event2)


    const firstElement = queue.getFirstElement();

    expect(firstElement).toEqual(event1);
  })

  test('Add multiple events to the end of the queue in same time must not change the index of elements', () => {
    const queue = new EventsQueue();
    const event1: TypedEvent = {
      type: EventType.TYPE_CHARACTER,
      character: 'h'
    }
    const event2: TypedEvent = {
      type: EventType.TYPE_CHARACTER,
      character: 'i'
    }
    queue.addToEnd(event1, event2)


    const firstElement = queue.getFirstElement();

    expect(firstElement).toEqual(event1);
  })

  test('Remove first element must return it and change the original queue', () => {
    const queue = new EventsQueue();
    const event1: TypedEvent = {
      type: EventType.TYPE_CHARACTER,
      character: 'h'
    }
    const event2: TypedEvent = {
      type: EventType.TYPE_CHARACTER,
      character: 'i'
    }
    queue.addToEnd(event1, event2)

    const firstElement = queue.removeFirstEvent();

    expect(firstElement).toEqual(event1);
    expect(queue.getFirstElement()).toEqual(event2);
  })

  test('Remove first element of an empty queue must throw an error', () => {
    const queue = new EventsQueue();
    expect(() => queue.removeFirstEvent()).toThrow(new EmptyQueueError("Impossible to delete the first event."));
  })

  test('Remove the last element must return it and change the original queue', () => {
    const queue = new EventsQueue();
    const event1: TypedEvent = {
      type: EventType.TYPE_CHARACTER,
      character: 'h'
    }
    const event2: TypedEvent = {
      type: EventType.TYPE_CHARACTER,
      character: 'i'
    }
    queue.addToEnd(event1, event2)

    const lastElement = queue.removeLastEvent();

    expect(lastElement).toEqual(event2);
    expect(queue.getLastElement()).toEqual(event1);
  })

  test('Remove the last element of an empty queue must throw an error', () => {
    const queue = new EventsQueue();
    expect(() => queue.removeLastEvent()).toThrow(new EmptyQueueError("Impossible to delete the last event."));
  })
})
