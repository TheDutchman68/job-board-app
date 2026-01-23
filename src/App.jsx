import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

import Home from "./pages/Home";

const JobDetails = lazy(() => import('./pages/JobDetails'));


function App(){
  return (
    <BrowserRouter>
      <Suspense fallback={<p>Loading page...</p>}>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/jobs/:id" element={<JobDetails/>}></Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;