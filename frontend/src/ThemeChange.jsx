import React, { useContext, useState } from "react";
import { Switch } from "@heroui/switch";
import { Button } from "@heroui/react";
import { darkThemeContext } from "./contextProvider/DarkModeContext";
import { MdOutlineDarkMode } from "react-icons/md";
import { CiLight } from "react-icons/ci";

const ThemeChange = ({ setIsDark }) => {
  const { isDarkMode, setisDarkMode } = useContext(darkThemeContext);

  const handleToggle = () => {
    setisDarkMode((prev) => !prev);
    console.log("Switch is now", isDarkMode ? "Off" : "On");
  };

  if (isDarkMode)
    return (
      <>
        {/* <Button color="success" onPress={handleToggle}>
          Light
        </Button> */}
        <div onClick={handleToggle}>
          <CiLight size={30} />
        </div>
        {/* <Switch onChange={handleToggle} aria-label="Automatic updates" /> */}
      </>
    );

  return (
    <>
      {/* <Button color="warning" onPress={handleToggle}>
        Dark
      </Button> */}
      <div onClick={handleToggle}>
        <MdOutlineDarkMode size={30} />
      </div>

      {/* <Switch
        onChange={handleToggle}
        defaultSelected
        aria-label="Automatic updates"
      /> */}
    </>
  );
};

const DarkThemeCompoent = ({ children }) => {
  const { isDarkMode } = useContext(darkThemeContext);

  if (isDarkMode) {
    return (
      <>
        <main className="dark text-foreground bg-background"> {children} </main>
      </>
    );
  }
  return <>{children}</>;
};

export default ThemeChange;
export { DarkThemeCompoent };
