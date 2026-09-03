// import { Navigate } from "react-router-dom";

// function ProtectedRoute({ children }) {

//   const token =
//     localStorage.getItem("token");

//   if (!token) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// }

// export default ProtectedRoute;
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({
  children
}) {

  const {
    token
  } = useAuth();

  const location =
    useLocation();


  if (!token) {

    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location
        }}
      />
    );
  }


  return children;
}

export default ProtectedRoute;
