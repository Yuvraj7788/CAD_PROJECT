import "./App.css";
import { Routes, Route } from "react-router-dom";
import Drive from "./components/Drive";
import Auth from "./components/Auth";
import { database } from "./firebaseConfig";
import Folder from "./components/Folder";
function App() {
  return (
    <div className="aaa">
      <div className="app">
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/drive" element={<Drive database={database} />} />
          <Route
            path="/folder/:id"
            element={<Folder database={database} />}
          ></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
