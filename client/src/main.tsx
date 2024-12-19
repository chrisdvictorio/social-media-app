import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import SocketContextProvider from "./context/SocketContext.tsx";
import { ActiveChatProvider } from "./context/ActiveChatContext.tsx";
import { ActiveComponentProvider } from "./context/ActiveComponentContext.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <SocketContextProvider>
          <ActiveChatProvider>
            <ActiveComponentProvider>
              <App />
            </ActiveComponentProvider>
          </ActiveChatProvider>
        </SocketContextProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
