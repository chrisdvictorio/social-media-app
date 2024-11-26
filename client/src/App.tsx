import { Routes, Route } from "react-router-dom";

import { ThemeProvider } from "./components/theme-provider";

import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ErrorPage from "./pages/ErrorPage";
import MessagesPage from "./pages/MessagesPage";
import ProfilePage from "./pages/ProfilePage";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen space-y-4">
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <header className="sticky top-0 z-10 border-b px-4 2xl:px-0">
          <Header />
        </header>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/:username" element={<ProfilePage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/*" element={<ErrorPage />} />
        </Routes>
      </ThemeProvider>
    </div>
  );
};

export default App;
