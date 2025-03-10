import { useState } from "react";
import { UserContext } from "./UserContextFile";

export const UserProvider = ({ children }) => {
  let [scopo, setScopo] = useState(null);
  let [auth, setAuth] = useState(false);
  let [userServices, setUserServices] = useState([]);

  return (
    <UserContext.Provider value={{ scopo, setScopo, auth, setAuth, userServices, setUserServices }}>
      {children}
    </UserContext.Provider>
  );
};