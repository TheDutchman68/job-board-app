import { BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import JobDetails from "./pages/JobDetails";

function App(){
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>}></Route>
      <Route path="/jobs/:id" element={<JobDetails/>}></Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;