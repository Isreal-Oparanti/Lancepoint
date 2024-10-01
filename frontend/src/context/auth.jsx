import { createContext, useReducer, useState } from 'react';
 

const initialState = {
    user:  JSON.parse(localStorage.getItem('user')) || null
}
export const AuthContext = createContext(initialState);
  const logout = () => {
    setAuth('')
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };
  
export const AuthProvider = ({ children })=> {
const [auth, setAuth] = useState(initialState)
   return (
    <AuthContext.Provider value={{auth, setAuth, logout}}>
      {children}
    </AuthContext.Provider>
  );
}
 