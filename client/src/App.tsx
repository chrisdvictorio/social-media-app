import { Routes, Route, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast, Toaster } from "react-hot-toast";

import { ThemeProvider } from "./components/theme-provider";

import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ErrorPage from "./pages/ErrorPage";
import MessagesPage from "./pages/MessagesPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import UserFriendsListPage from "./pages/UserFriendsListPage";
import UserMediaPage from "./pages/UserMediaPage";
import FriendRequestsPage from "./pages/FriendRequestsPage";
import LikedPostsPage from "./pages/LikedPostsPage";
import SavedPostsPage from "./pages/SavedPostsPage";

import axiosInstance from "./api/axios";
import SinglePostPage from "./pages/SinglePostPage";

const App = () => {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
      } catch (error: any) {
        if (error.response) {
          if (error.response.status === 401 || error.response.status === 404) {
            return null;
          }
        }
        toast.error(error.response.data.error);
      }
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen gap-4">
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <header className="sticky top-0 z-10 border-b px-4 2xl:px-0 bg-white dark:bg-[#0A0A0A]">
          <Header />
        </header>

        <Routes>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={!authUser ? <RegisterPage /> : <Navigate to="/" />}
          />
          <Route
            path="/:username"
            element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/:username/friends"
            element={
              authUser ? <UserFriendsListPage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/:username/friends/requests"
            element={authUser ? <FriendRequestsPage /> : <Navigate to="/" />}
          />
          <Route
            path="/:username/images"
            element={authUser ? <UserMediaPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/posts/:postId"
            element={authUser ? <SinglePostPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/messages"
            element={authUser ? <MessagesPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/likes"
            element={authUser ? <LikedPostsPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/saved"
            element={authUser ? <SavedPostsPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/settings"
            element={authUser ? <SettingsPage /> : <Navigate to="/login" />}
          />
          <Route path="/*" element={<ErrorPage />} />
        </Routes>
      </ThemeProvider>
      <Toaster />
    </div>
  );
};

export default App;
