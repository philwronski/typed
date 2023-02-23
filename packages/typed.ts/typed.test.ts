import { EventsQueue } from "./event/EventsQueue";
import { EventType } from "./event/TypedEvent";
import { Typed } from "./typed";

describe('Typed', () => {

  test('Type characters should decompose, create and publish each event in queue', () => {
    const typed = new Typed();
    const characters = "hello world !";
    const events = typed.decomposeCharactersIntoEvents(characters);
    const spyDecomposeCharactersIntoEvents = jest.spyOn(typed, 'decomposeCharactersIntoEvents');
    const spyPublishEvents = jest.spyOn(typed, 'publishEvents');

    typed.typeCharacters(characters);

    expect(spyDecomposeCharactersIntoEvents).toBeCalledWith(characters);
    expect(spyPublishEvents).toBeCalledWith(...events);
  });

  test('Should decompose characters into event array', () => {
    const typed = new Typed();
    const characters = "hello";

    const events = typed.decomposeCharactersIntoEvents(characters);

    expect(events).toStrictEqual([
      { type: EventType.TYPE_CHARACTER, character: 'h' },
      { type: EventType.TYPE_CHARACTER, character: 'e' },
      { type: EventType.TYPE_CHARACTER, character: 'l' },
      { type: EventType.TYPE_CHARACTER, character: 'l' },
      { type: EventType.TYPE_CHARACTER, character: 'o' }
    ])
  })

  test('Publish events into queue should add event to the end of queue', () => {
    const typed = new Typed();
    const characters = "hello";
    const events = typed.decomposeCharactersIntoEvents(characters);
    const spyAddToEnd = jest.spyOn(EventsQueue.prototype, 'addToEnd');

    typed.publishEvents(...events);

    expect(spyAddToEnd).toBeCalledWith(...events);
  })
})
