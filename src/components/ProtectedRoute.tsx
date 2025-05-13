import React from "react";
import { Navigate } from "react-router-dom";
import useAppSelector from "../hooks/useAppSelector";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = useAppSelector((state) => state.auth);

  if (!auth.token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
