
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useUser } from '../context/UserProvider'

function GuestLayout() {
  const { user } = useUser();
  const location = useLocation()
  if (user && user.role == 'admin') {
    return <Navigate to="/admin/dashboard" state={{ from: location }} replace />;
  } else if (user && user.role == 'user' || user && user.role == 'shop_owner') {
    return <Navigate to="/app/dashboard" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
}

export default GuestLayout;
