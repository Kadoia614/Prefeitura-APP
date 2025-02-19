import { createContext, useState } from "react";

//criando o context
export const AppContext = createContext();

//criando o provider para envolver os componentes

export const AppProvider = ({children}) => {
    let [scopo, setScopo] = useState();
    let [auth, setAuth] = useState(true);

    return(
        <AppContext.Provider value={{scopo, setScopo, auth, setAuth}}>
            {children}
        </AppContext.Provider>
    )
}