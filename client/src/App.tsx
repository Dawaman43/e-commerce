import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import AuthPage from "./pages/Auth";
import NotFoundPage from "./pages/NotFound";
import ProfilePage from "./pages/ProfilePage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
