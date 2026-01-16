import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useEffect } from "react";
import { pingApi } from "./apis/ping";

function App() {
  useEffect(() => {
    pingApi();
  }, []);
  return (
    <>
      <h1>Hello</h1>
    </>
  );
}

export default App;
