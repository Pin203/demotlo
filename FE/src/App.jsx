import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Workspaces from "./pages/Workspaces";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Giống Trello, web có 2 phần tách biệt:
//  1. Phần công khai (chưa đăng nhập): trang giới thiệu, đăng nhập, đăng ký
//  2. Phần ứng dụng (đã đăng nhập): có Header làm việc, danh sách workspace, bảng task...
function App() {
  return (
    <Routes>
      {/* Phần công khai */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Phần ứng dụng: ProtectedRoute chặn người chưa đăng nhập */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/workspaces" element={<Workspaces />} />
          {/* Sau này thêm: /boards/:id, /dashboard ... */}
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;