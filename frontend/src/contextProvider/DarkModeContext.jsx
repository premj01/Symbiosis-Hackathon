import React, { createContext, useState } from "react";

const darkThemeContext = createContext();

const DarkMode = ({ children }) => {
  const [isDarkMode, setisDarkMode] = useState(true);
  return (
    <>
      <darkThemeContext.Provider value={{ isDarkMode, setisDarkMode }}>
        {children}
      </darkThemeContext.Provider>
    </>
  );
};

export { darkThemeContext };
export default DarkMode;
