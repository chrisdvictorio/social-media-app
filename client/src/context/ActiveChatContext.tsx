import React, { createContext, useState, useContext, ReactNode } from "react";
import { User as UserType } from "@/types/user";

interface ActiveChatContextType {
  activeChat: UserType | null;
  setActiveChat: React.Dispatch<React.SetStateAction<UserType | null>>;
}

const ActiveChatContext = createContext<ActiveChatContextType | undefined>(
  undefined
);

export const useActiveChatContext = (): ActiveChatContextType => {
  const context = useContext(ActiveChatContext);
  if (context === undefined) {
    throw new Error(
      "useActiveChatContext must be used within an ActiveChatProvider"
    );
  }
  return context;
};

export const ActiveChatProvider = ({ children }: { children: ReactNode }) => {
  const [activeChat, setActiveChat] = useState<UserType | null>(null);

  return (
    <ActiveChatContext.Provider value={{ activeChat, setActiveChat }}>
      {children}
    </ActiveChatContext.Provider>
  );
};
