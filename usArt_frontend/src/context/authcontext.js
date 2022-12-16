import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import LINK_BACKEND from "../components/LINK_BACKEND";
import LINK_FRONTEND from "../components/LINK_FRONTEND";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwt_decode(localStorage.getItem("authTokens"))
      : null
  );
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const history = useNavigate();

  const loginUser = async (user_name, password) => {
    const response = await fetch(LINK_BACKEND + "/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_name,
        password
      })
    });
    const data = await response.json();

    if (response.status === 200) {
      setAuthTokens(data);
      const incomeUser = jwt_decode(data.access)
      setUser(incomeUser);
      if (incomeUser.status == "ALO") {
        localStorage.setItem("authTokens", JSON.stringify(data));
        navigate(-1)
      } else {
        alert("You have been banned and cannot access")
      }
    } else {
      alert("Something went wrong!");
    }
  };

  const registerUser = async (user_name, password, email) => {
    const response = await fetch(LINK_BACKEND + "/api/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_name,
        password,
        email
      })
    });
    if (response.status === 201) {
      loginUser(user_name, password)
    } else {
      const data = await response.json();
      
      if (Object.keys(data).length === 1) { 
        alert(data[Object.keys(data)]) }
      else {
        
        alert(data[Object.keys(data)[0]] + "\n" + data[Object.keys(data)[1]])
      }
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    navigate(-1)
  };

  const contextData = {
    user,
    setUser,
    authTokens,
    setAuthTokens,
    registerUser,
    loginUser,
    logoutUser
  };

  useEffect(() => {
    if (authTokens) {
      setUser(jwt_decode(authTokens.access));
    }
    setLoading(false);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
