import { createContext, useState, useContext, ReactNode } from "react";

type ActiveComponent = "WelcomeWindow" | "ChatWindow";

interface ActiveComponentContextType {
  activeComponent: ActiveComponent;
  setActiveComponent: React.Dispatch<React.SetStateAction<ActiveComponent>>;
}

const ActiveComponentContext = createContext<
  ActiveComponentContextType | undefined
>(undefined);

export const useActiveComponentContext = (): ActiveComponentContextType => {
  const context = useContext(ActiveComponentContext);
  if (!context) {
    throw new Error(
      "useActiveComponentContext must be used within an ActiveComponentProvider"
    );
  }
  return context;
};

export const ActiveComponentProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [activeComponent, setActiveComponent] =
    useState<ActiveComponent>("WelcomeWindow");

  return (
    <ActiveComponentContext.Provider
      value={{ activeComponent, setActiveComponent }}
    >
      {children}
    </ActiveComponentContext.Provider>
  );
};
