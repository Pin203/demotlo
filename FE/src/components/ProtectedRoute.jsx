import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  // Kiểm tra xem đã có token đăng nhập chưa
  const isAuthenticated = localStorage.getItem("token");

  // Nếu chưa đăng nhập, đá văng ra trang /login. Nếu đã đăng nhập, cho đi tiếp (Outlet)
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;