import { Routes, Route } from "react-router-dom";
import { PrivateRoute } from "./components/auth/PrivateRoute";
import LoginSuccess from "./pages/LoginSuccess";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />}></Route>
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />
      <Route path="/login/success" element={<LoginSuccess />} />
    </Routes>
  );
}

export default App;

