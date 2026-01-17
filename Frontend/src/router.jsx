import { Routes, Route } from "react-router-dom";
import CreateProject from "./pages/CreateProject";
import ProjectPlayground from "./pages/ProjectPlayground";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<CreateProject />} />
      <Route path="/project/:projectId" element={<ProjectPlayground />} />
    </Routes>
  );
};

export default AppRouter;
