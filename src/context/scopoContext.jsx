import { createContext, useState } from "react";

//criando o context
export const AppContext = createContext();

//criando o provider para envolver os componentes

export const AppProvider = ({children}) => {
    let [scopo, setScopo] = useState();

    return(
        <AppContext.Provider value={{scopo, setScopo}}>
            {children}
        </AppContext.Provider>
    )
}