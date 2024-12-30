import React, { useState, useEffect } from "react";
import { loginUser } from "../../api/index";
import { useNavigate } from "react-router-dom";
import "./index.css";

export const Login = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = {
        password,
        identifier,
      };

      const response = await loginUser(userData);
      console.log("response...", response);

      if (response && response?.data?.success) {
        // Store the token in localStorage
        localStorage.setItem("authToken", response.data.token);

        // Redirect to the dashboard
        window.location.href = "/dashboard";
        setLoading(false);
      } else {
        setError(response?.data?.error);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError(error?.message || "An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left"></div>
      <div className="login-right">
        <div className="sign-in-wrap">
          <h1 className="header-text">Sign in</h1>
          <form onSubmit={handleSubmit}>
            <div className="login-form-group">
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="login-form-group passwd">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <div className="Forget-Password-wrap"></div>
            <button
              style={{ cursor: loading ? "not-allowed" : "pointer" }}
              className="btn-login"
              disabled={loading}
              type="submit"
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
