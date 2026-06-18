import axios from "axios";
import {createContext, 
    useContext, 
    useEffect, 
    useState, 
    type ReactNode,
} from 'react'
import toast, { Toaster } from "react-hot-toast";
import type { AppContextType, User } from '../types';
import {server} from"../main";


const AppContext = createContext<AppContextType | undefined>(undefined)

interface AppProps{
    children: ReactNode
}


export const AppProvider = ({children}:AppProps)=>{
    const [user, setUser] = useState<User | null>(null)
    const [isAuth,setIsAuth] = useState(false)
    const [loading,setLoading] = useState(true)
    
    async function fetchUser(){
        try {
           const {data} = await axios.get(`${server}/api/user/me`,{
            headers:{
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
           }); 
           setUser(data);
           setIsAuth(true);

        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false);
        }
    }
    const LogoutUser = () =>{
        localStorage.setItem("token", "")
        setUser(null)
        setIsAuth(false)
        toast.success("Logged Out");
    };

   useEffect(() => {
  const init = async () => {
    await fetchUser();
  };

  init();
}, []);
  

    return (<AppContext.Provider value={{isAuth,
         loading, 
         setIsAuth, 
         setLoading,
         setUser,
         user,
         LogoutUser}}
         >
        {children}
        <Toaster/>
        </AppContext.Provider>
    );
};

export const useAppData = (): AppContextType =>{
    const context = useContext(AppContext);

    if(!context){
        throw new Error("useAppData must be used within AppProvider");
    }
    return context;
}