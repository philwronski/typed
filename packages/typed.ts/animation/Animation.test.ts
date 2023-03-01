import { screen } from "@testing-library/dom";
import { EventsQueue } from "../event/EventsQueue";
import { EventType } from "../event/TypedEvent";
import { Animation } from "./Animation";

describe("Animation", () => {
  test("Running animation should create a request animation frame", () => {
    const eventQueue = new EventsQueue();
    eventQueue.addToEnd(
      { type: EventType.TYPE_CHARACTER, character: "h" },
      { type: EventType.TYPE_CHARACTER, character: "e" },
      { type: EventType.TYPE_CHARACTER, character: "l" },
      { type: EventType.TYPE_CHARACTER, character: "l" },
      { type: EventType.TYPE_CHARACTER, character: "o" }
    );
    const animation = new Animation(document.body, eventQueue);

    const spyRequestAnimationFrame = jest.spyOn(
      window,
      "requestAnimationFrame"
    );
    animation.start();
    expect(spyRequestAnimationFrame).toBeCalled();
  });

  test("Stopping animation should cancel animation frame", () => {
    const eventQueue = new EventsQueue();
    eventQueue.addToEnd(
      { type: EventType.TYPE_CHARACTER, character: "h" },
      { type: EventType.TYPE_CHARACTER, character: "e" },
      { type: EventType.TYPE_CHARACTER, character: "l" },
      { type: EventType.TYPE_CHARACTER, character: "l" },
      { type: EventType.TYPE_CHARACTER, character: "o" }
    );
    const animation = new Animation(document.body, eventQueue);
    const spyCancelAnimationFrame = jest.spyOn(window, "cancelAnimationFrame");

    const animationId = animation.stop();
    expect(spyCancelAnimationFrame).toBeCalled();
    expect(animationId).toStrictEqual(0);
  });

  test("Remove element from should add event into queue", async () => {
    const eventQueue = new EventsQueue();
    eventQueue.addToEnd(
      { type: EventType.TYPE_CHARACTER, character: "h" },
      { type: EventType.TYPE_CHARACTER, character: "e" },
      { type: EventType.TYPE_CHARACTER, character: "l" },
      { type: EventType.TYPE_CHARACTER, character: "l" },
      { type: EventType.TYPE_CHARACTER, character: "o" },
      { type: EventType.DELETE_LAST_VISIBLE_NODE }
    );
    const animation = new Animation(document.body, eventQueue);
    animation.start();

    expect(screen.queryByText("o")).toBeNull();
  });
});
