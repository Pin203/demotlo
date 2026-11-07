import { Outlet } from "react-router-dom";
import Header from "./Header";
 
// Khung chung của mọi màn hình sau đăng nhập.
// <Outlet /> là chỗ màn hình con (Workspaces, Board...) được đặt vào.
function Layout() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </>
  );
}
 
export default Layout;