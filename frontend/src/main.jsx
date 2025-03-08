import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { HeroUIProvider } from "@heroui/react";

import DarkMode from "./contextProvider/DarkModeContext";
import { DarkThemeCompoent } from "./ThemeChange.jsx";
import ErrorPage from "./ErrorPage.jsx";
import "./Styles/NavbarComponet.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Home.jsx";
import LoginPage from "./LoginPage.jsx";
import SignupPage from "./SignupPage.jsx";
import OTPValidationPage from "./OTPValidationPage.jsx";
import AuthContextWrapper from "./contextProvider/AuthContext.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { path: "home", element: <Home /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
      { path: "otp_validate", element: <OTPValidationPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HeroUIProvider>
      <DarkMode>
        <DarkThemeCompoent>
          <AuthContextWrapper>
            {/* <main className="dark text-foreground bg-background"> */}
            <RouterProvider router={router}></RouterProvider>
            {/* <App /> */}
            {/* </main> */}
          </AuthContextWrapper>
        </DarkThemeCompoent>
      </DarkMode>
    </HeroUIProvider>
  </StrictMode>
);
