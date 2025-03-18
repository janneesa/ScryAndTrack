import React, { createContext, useState, useEffect } from "react";

// Create the context
export const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores the user object
  const [loading, setLoading] = useState(true); // Tracks loading state

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("scryAndTruckUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login method: sets user and saves to localStorage
  const login = (userData) => {
    localStorage.setItem("scryAndTruckUser", JSON.stringify(userData));
    setUser(userData);
  };

  // Logout method: removes user from state and localStorage
  const logout = () => {
    localStorage.removeItem("scryAndTruckUser");
    setUser(null);
  };

  const update = (newUser) => {
    const token = user.token;
    localStorage.setItem(
      "scryAndTruckUser",
      JSON.stringify({ ...newUser, token })
    );
    setUser({ ...newUser, token });
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        update,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
