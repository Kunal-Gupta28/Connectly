import {  createContext, useContext } from "react";

const userContext = createContext()

const userProvider = ({Children})=>{
    const [user,setUser] = useState();

    return(
        <userContext.Provider value={user,setUser}>
            {Children}
        </userContext.Provider>
    )
}

module.export.useContext = useContext(userContext)