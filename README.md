# Ứng dụng quản lý công việc 

Ứng dụng web quản lý công việc theo mô hình **Workspace → Project → Board → Task**, có đăng nhập (email/mật khẩu và Google), mời thành viên và phân quyền theo vai trò.

> Dự án đang trong quá trình phát triển

## Tính năng

- Đăng ký, đăng nhập bằng email/mật khẩu (mã hóa bằng bcrypt) hoặc **Google OAuth**
- Xác thực bằng **JWT**, các API quan trọng đều yêu cầu đăng nhập
- Chia công việc theo 4 lớp: Workspace, Project, Board, Task
- Mời thành viên vào workspace bằng email
  - Email đã có tài khoản: được thêm thẳng vào workspace
  - Email chưa có tài khoản: lời mời được lưu lại, tự động vào workspace khi họ đăng ký
- Phân quyền theo vai trò: `admin`, `member`, `viewer` (không cho xóa hoặc hạ quyền admin cuối cùng)
- Trang chủ hiển thị workspace của tôi cùng project, board và số lượng task

## Công nghệ

| Phần | Công nghệ |
|---|---|
| Frontend | React 19, Vite, React Router 7, Tailwind CSS 4, `@react-oauth/google` |
| Backend | Node.js, Express 5, mysql2, bcryptjs, jsonwebtoken, google-auth-library |
| Database | MySQL (chạy bằng XAMPP hoặc MySQL server bất kỳ) |

## Cấu trúc thư mục

```
demotreo/
├── BE/                          Backend (Node.js + Express)
│   ├── config/db.js             Kết nối MySQL (connection pool)
│   ├── Router/                  Khai báo URL nào gọi hàm nào
│   ├── Controller/              Nhận request, xử lý, trả response
│   ├── Model/                   Nơi duy nhất viết câu SQL
│   ├── Middleware/auth.js       Kiểm tra JWT
│   ├── utils/                   Tạo token, tự nhận lời mời khi đăng ký
│   └── index.js                 Khởi động server, gắn các Router
└── FE/                          Frontend (React + Vite)
    └── src/
        ├── pages/               Landing, Login, Register, Workspaces, Board
        ├── components/          Header, Footer, Layout, ProtectedRoute, GoogleButton
        ├── api.js               Hàm gọi API dùng chung
        └── App.jsx              Khai báo route
```

Backend theo mô hình **Router → Controller → Model**:

```
Frontend → Router (chọn hàm theo URL + method) → Controller (xử lý) → Model (SQL) → MySQL
```

## Yêu cầu

- [Node.js](https://nodejs.org) bản LTS
- MySQL (hoặc XAMPP)
- Google OAuth Client ID (nếu muốn dùng đăng nhập Google) lấy tại [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

## Cài đặt và chạy

### 1. Clone dự án

```bash
git clone https://github.com/<ten-ban>/demotreo.git
cd demotreo
```

### 2. Tạo database

Tạo database tên `treollo`, sau đó tạo các bảng theo mục [Database](#database).

### 3. Chạy Backend

```bash
cd BE
npm install
```

Tạo file `BE/.env`:

```env
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_NAME=treollo
DB_PORT=3306
JWT_SECRET=mot_chuoi_bi_mat_bat_ky
GOOGLE_CLIENT_ID=<google-client-id-cua-ban>
```

Chạy server:

```bash
npm run dev     # tự restart khi sửa code (nodemon)
npm start       # chạy thường
```

Server chạy tại `http://localhost:3000`. Terminal sẽ in `Ket noi MySQL thanh cong` khi kết nối DB thành công.

### 4. Chạy Frontend

```bash
cd FE
npm install
```

Tạo file `FE/.env`:

```env
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=<google-client-id-cua-ban>
```

```bash
npm run dev
```

Mở địa chỉ Vite in ra terminal (mặc định `http://localhost:5173`).

## Database

| Bảng | Cột chính | Ghi chú |
|---|---|---|
| `users` | id, name, email, password, created_at | Mật khẩu lưu dạng bcrypt |
| `workspaces` | id, name, created_at | |
| `memberships` | id, user_id, workspace_id, role | Nối users ↔ workspaces, `role`: admin / member / viewer |
| `invitations` | id, email, workspace_id, role, invited_by | Lời mời chờ cho email chưa có tài khoản |
| `projects` | id, name, workspace_id | Thuộc 1 workspace |
| `boards` | id, name, project_id | Thuộc 1 project |
| `tasks` | id, title, status, board_id, assignee_id, created_at | Thuộc 1 board, giao cho 1 user |
| `comments` | id, content, task_id, user_id, created_at | Thuộc 1 task |

## API

Địa chỉ gốc: `http://localhost:3000/api`. Các route có dấu 🔒 cần header `Authorization: Bearer <token>`.

| Nhóm | Method | Đường dẫn | Chức năng |
|---|---|---|---|
| Users | POST | `/users/register` | Đăng ký |
| | POST | `/users/login` | Đăng nhập, trả về token |
| | POST | `/users/google` | Đăng nhập bằng Google |
| Home | GET | `/home` 🔒 | Workspace của tôi kèm project, board |
| Workspaces | GET / POST / PUT | `/works` 🔒 | Xem, tạo, đổi tên workspace |
| | DELETE | `/works/:id` 🔒 | Xóa workspace |
| Projects | GET / POST / PUT | `/project` 🔒 | Xem, tạo, sửa project |
| | DELETE | `/project/:id` 🔒 | Xóa project |
| Boards | GET / POST / PUT | `/boards` 🔒 | Xem, tạo, sửa board |
| | DELETE | `/boards/:id` 🔒 | Xóa board |
| Tasks | GET | `/tasks?boardId=...` | Xem task của một board |
| | POST / PUT | `/tasks` 🔒 | Tạo, sửa task |
| | DELETE | `/tasks/:id` 🔒 | Xóa task |
| Membership | POST | `/membership/invite` 🔒 | Mời thành viên (chỉ admin) |
| | GET | `/membership/:workspaceId` 🔒 | Danh sách thành viên |
| | PUT | `/membership/:id` 🔒 | Đổi vai trò |
| | DELETE | `/membership/:id` 🔒 | Xóa thành viên |

Mã trạng thái thường gặp: `200` thành công, `201` tạo mới, `400` dữ liệu sai, `401` chưa đăng nhập hoặc token sai, `403` không đủ quyền, `404` không tìm thấy, `500` lỗi server.



## Đóng góp

Mọi đóng góp đều được hoan nghênh: fork dự án, tạo nhánh mới, commit và mở Pull Request.

## Giấy phép

Chưa chọn giấy phép. Thêm file `LICENSE` (ví dụ MIT) nếu muốn mở mã nguồn.