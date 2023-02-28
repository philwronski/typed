import { useEffect } from "react";
import { Typed } from "typed.ts";
import "./App.css";

function App() {
  useEffect(() => {
    const typed = new Typed("#typed");
    typed.typeCharacters("hello").start();
  });

  return <div id="typed"></div>;
}

export default App;
