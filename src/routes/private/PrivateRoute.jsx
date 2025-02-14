import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isAuth = useSelector((state) => state.user.isAuth);

  return isAuth ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
