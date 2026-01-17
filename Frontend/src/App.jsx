import CreateProject from "./pages/createProject";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<CreateProject />} />
      </Routes>
    </>
  );
}

export default App;
