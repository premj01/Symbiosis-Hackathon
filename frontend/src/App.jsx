import { Accordion, AccordionItem } from "@heroui/accordion";
import { Avatar } from "@heroui/react";
import NavigationBar from "./NavigationBar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

function App() {
  const defaultContent =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

  return (
    <>
      <NavigationBar></NavigationBar>

      <Outlet></Outlet>

      <Footer></Footer>
    </>
  );
}

export default App;
