import Navbar from "./components/Navbar/Navbar";
import Shop from "./Pages/Shop";
import "./App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Shop />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
