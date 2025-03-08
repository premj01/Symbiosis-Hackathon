import React, { createContext, useEffect, useState } from "react";

const AuthenticationContext = createContext();

const AuthContextWrapper = ({ children }) => {
  const [isLogin, setisLogin] = useState();

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      setisLogin(true);
    } else {
      setisLogin(false);
    }
  }, [isLogin]);

  return (
    <>
      <AuthenticationContext.Provider value={{ isLogin, setisLogin }}>
        {children}
      </AuthenticationContext.Provider>
    </>
  );
};

export { AuthenticationContext };
export default AuthContextWrapper;
