import { use } from "react";
import { createContext, useState } from "react";

//criando o context
export const UserContext = createContext();

//criando o provider para envolver os componentes

export const UserProvider = ({children}) => {
    let [scopo, setScopo] = useState();
    let [auth, setAuth] = useState(false);
    let [userServices, setUserServices] = useState([])

    return(
        <UserContext.Provider value={{scopo, setScopo, auth, setAuth, userServices, setUserServices}}>
            {children}
        </UserContext.Provider>
    )
}