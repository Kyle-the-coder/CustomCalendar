import React, { createContext, useState, useContext } from "react";

const ExtendDateContext = createContext();

export const ExtendDateProvider = ({ children }) => {
  const [extendDate, setExtendDate] = useState(null);

  return (
    <ExtendDateContext.Provider value={{ extendDate, setExtendDate }}>
      {children}
    </ExtendDateContext.Provider>
  );
};

export const useExtendDate = () => useContext(ExtendDateContext);
export { ExtendDateContext };
