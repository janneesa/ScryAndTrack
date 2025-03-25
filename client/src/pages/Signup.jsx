import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Card from "../components/utility/Card";
import useSignup from "../hooks/useSignup";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const { signup, error } = useSignup();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      await toast.promise(
        signup({
          email,
          username,
          password,
          confirmPassword,
        }),
        {
          loading: "Signing up...",
          success: "Signup successful!",
          error: "Signup failed. Please try again.",
        }
      );

      navigate("/");
    } catch (err) {
      console.error("Error during signup:", err);
    }
  };

  return (
    <div className="primary-text max-w-md mx-auto">
      <Card>
        <h2 className="text-xl font-semibold mb-2">Sign Up</h2>
        <form className="space-y-2" onSubmit={handleFormSubmit}>
          <div className="flex flex-col gap-1">
            <label className="secondary-text">Email address:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="secondary-text">Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="secondary-text">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="secondary-text">Confirm password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button className="button">Sign up</button>
        </form>
      </Card>
    </div>
  );
};

export default Signup;
