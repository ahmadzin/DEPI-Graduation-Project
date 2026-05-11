import { useContext } from "react";
import AuthContext from "./AuthContext";

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth لازم يتستخدم جوّا AuthProvider");
  return context;
};

export default useAuth;
