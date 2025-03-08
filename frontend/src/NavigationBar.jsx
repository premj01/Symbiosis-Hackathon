import React, { useContext } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Button,
} from "@heroui/react";
import ThemeChange from "./ThemeChange";
import { Link } from "react-router-dom";
import { AuthenticationContext } from "./contextProvider/AuthContext";
import { Avatar } from "@heroui/react";

// export const AcmeLogo = () => {
//   return (
//     <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
//       <path
//         clipRule="evenodd"
//         d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
//         fill="currentColor"
//         fillRule="evenodd"
//       />
//     </svg>
//   );
// };

export default function NavigationBar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isLogin } = useContext(AuthenticationContext);
  const { setisLogin } = useContext(AuthenticationContext);

  const menuItems = [
    "Edit My Profile",
    "Dashboard",
    "Activity",
    "Analytics",
    "Help & Feedback",
    "SignIn",
    "SignUp",
    "Log Out",
  ];

  return (
    <Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          {/* <AcmeLogo /> */}
          <div className="NavbarImageBoundingBox">
            <img
              className="NavbarImage"
              src="https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg"
              alt=""
            />
          </div>
          <p className="font-bold text-inherit">MakeMyPlan</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarBrand>
          {/* <AcmeLogo /> */}
          <div
            className="NavbarImageBoundingBox"
            style={{ maxWeight: "34px", maxWidth: "34px", marginRight: "10px" }}
          >
            <img
              className="NavbarImage"
              src="https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg"
              alt=""
            />
          </div>
          <p className="font-bold text-inherit" style={{ marginRight: "30px" }}>
            MakeMyPlan
          </p>
          <NavbarItem>
            <Link color="foreground" to="/home">
              Home
            </Link>
          </NavbarItem>
        </NavbarBrand>
        <NavbarItem>
          <Link color="foreground" to="#">
            Dashboard
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link aria-current="page" to="#">
            LeaderBoard
          </Link>
        </NavbarItem>
      </NavbarContent>

      {isLogin ? (
        <NavbarContent justify="end">
          {/* <NavbarItem className="hidden lg:flex">
             <Link to="/login">Login</Link>
          </NavbarItem> */}
          <NavbarItem>
            <Button
              color="danger"
              variant="flat"
              onPress={() => {
                localStorage.clear();
                setisLogin(false);
              }}
            >
              Sign Out
            </Button>
          </NavbarItem>
          <NavbarItem>
            <ThemeChange></ThemeChange>
          </NavbarItem>

          <NavbarItem className="hidden lg:flex">
            <Link to="/profile">
              <Avatar name={localStorage.getItem("username") | "NA"} />
            </Link>
          </NavbarItem>
        </NavbarContent>
      ) : (
        <NavbarContent justify="end">
          <NavbarItem className="hidden lg:flex">
            <Link to="/login">Login</Link>
          </NavbarItem>
          <NavbarItem>
            <Button as={Link} color="warning" to="/signup" variant="flat">
              Sign Up
            </Button>
          </NavbarItem>
          <NavbarItem>
            <ThemeChange></ThemeChange>
          </NavbarItem>
          <NavbarItem className="hidden lg:flex">
            <Link to="/profile">
              <Avatar name={localStorage.getItem("username") | "NA"} />
            </Link>
          </NavbarItem>
        </NavbarContent>
      )}

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color={
                index === 2
                  ? "warning"
                  : index === menuItems.length - 1
                  ? "danger"
                  : "foreground"
              }
              to="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
