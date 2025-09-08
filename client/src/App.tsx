import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("");

  // fetch backend API when component loads
  useEffect(() => {
    fetch("http://localhost:5000/") // backend route
      .then((res) => res.text()) // since your backend sends plain text
      .then((data) => setMessage(data))
      .catch((err) => console.error("Error fetching API:", err));
  }, []);

  return (
    <>
      <div className="border-black border-2 h-10 w-10"></div>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>Backend says: {message}</p>
      </div>

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;

