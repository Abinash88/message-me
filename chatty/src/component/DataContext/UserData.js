import React, { createContext, useEffect, useState } from 'react'
import axios from 'axios';


const DataContext = createContext();


const UserData = ({children}) => {
    const [userData, setUserData] = useState([]);

    const GetFacebookUser = async() => {
        try{
            const res = fetch('http://localhost:5000/Login/Success',{
                method:'GET',
            });
            const data = await res.json();
            if(!data.success) return [];
            return data
        }catch(err) {
            return [];
        }
    }

    // useEffect(() => {
    //     GetFacebookUser().then((data) => {
    //         setUserData([data]);
    //         console.log(data)
    //     })
    // },[])

  return (
    <DataContext.Provider value={{userData}}>
        {children}
    </DataContext.Provider>
  )
}
export default UserData;
export {DataContext};

