import { useEffect } from "react";
import { createContext, useState } from "react";
import axios from "axios";
export const AdminContext = createContext({});
export function AdminContextProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!user) {
            axios.get('/admin/profile').then(({ data }) => {
                setUser(data);
            }).catch((e) => { console.log(e); })

        }
    }, [])
    return (
        <AdminContext.Provider value={{ user }} >
            {children}
        </AdminContext.Provider>
    )
}