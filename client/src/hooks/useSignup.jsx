import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function useSignup() {
  const { login: userContextLogin } = useContext(UserContext);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const signup = async (credentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const user = await response.json();

      if (!response.ok) {
        setError(user.error || "An unknown error occurred.");
        throw new Error(user.error || "An unknown error occurred.");
      }

      userContextLogin(user);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  return { signup, isLoading, error };
}
