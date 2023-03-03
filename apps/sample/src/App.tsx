import { useEffect } from "react";
import { Typed } from "typed.ts";
import "./App.css";

function App() {
  useEffect(() => {
    const typed = new Typed("#typed");
    typed
      .typeCharacters("hello toto")
      .deleteLastNthCharacters(4)
      .typeCharacters("world !")
      .pauseFor(3000)
      .start();
  });

  return <div id="typed"></div>;
}

export default App;
