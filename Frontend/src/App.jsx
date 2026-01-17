import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useEffect } from "react";
import { pingApi } from "./apis/ping";
import usePing from "./hooks/apis/queries/usePing";

function App() {
  const { data, isLoading, isError, error } = usePing();
  const [isVisble, setIsVisible] = useState(false);
  if (isLoading) {
    return <h1>Loading....</h1>;
  } else if (isError) {
    return <h1>Error...</h1>;
  }
  return (
    <>
      <h1>{data.data.msg}</h1>
    </>
  );
}

export default App;
