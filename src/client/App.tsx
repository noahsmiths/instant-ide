import "./App.css";

import { useState } from "react";

import { Button } from "@nextui-org/react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>{ count }</div>
      <Button onClick={() => setCount(c => c + 1)}>Test</Button>
    </>
  );
}

export default App;
