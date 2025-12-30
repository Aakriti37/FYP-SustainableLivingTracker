import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/" element={<LandingPage />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App