# Treollo BE — Backend quản lý công việc kiểu Trello

Backend viết bằng **Node.js + Express + MySQL (XAMPP)**, theo mô hình **Router → Controller → Model**.

Ký hiệu trạng thái: ✅ đã làm và test được · 🔧 đang làm · ⬜ chưa làm

---

## 1. Công nghệ

| Thành phần | Dùng để làm gì |
|---|---|
| Node.js | Chạy code JavaScript phía server |
| Express | Dựng server, định nghĩa API |
| MySQL (XAMPP) | Lưu dữ liệu |
| mysql2 | Kết nối Node.js với MySQL, chạy câu SQL |
| dotenv | Đọc thông tin cấu hình từ file `.env` |
| cors | Cho phép frontend (chạy port khác) gọi vào API |
| bcryptjs | Mã hóa mật khẩu trước khi lưu |
| jsonwebtoken | Tạo và kiểm tra token đăng nhập |
| nodemon | Tự restart server khi sửa code (chỉ dùng lúc code) |

> Project có cài `@prisma/client` và `prisma` nhưng **hiện không dùng** (đang viết SQL tay bằng mysql2). Có thể gỡ bằng `npm uninstall @prisma/client prisma`.

---

## 2. Cấu trúc thư mục

```
BE/
├── config/
│   └── db.js                  Kết nối MySQL (pool dùng chung)
├── Controller/                Nhận req, gọi Model, trả res
│   ├── Taskcontroller.js
│   ├── Workspacecontroller.js
│   ├── Boardcontroller.js
│   └── Usercontroller.js
├── Model/                     Nơi DUY NHẤT viết câu SQL
│   ├── Taskmodel.js
│   ├── Workspacemodel.js
│   ├── Boardmodel.js
│   └── Usermodel.js
├── Router/                    Khai báo URL nào gọi hàm nào
│   ├── Taskrouter.js
│   ├── Workspacerouter.js
│   ├── Boardrouter.js
│   └── Userrouter.js
├── Middleware/                Chặn kiểm tra giữa Router và Controller 
├── .env                       Thông tin kết nối DB (KHÔNG đẩy lên GitHub)
├── .gitignore                 Loại node_modules và .env khỏi Git
├── index.js                   Khởi động server, gắn các Router
└── package.json
```

> Tên file ghi theo quy ước `Tên` + `controller/model/router`. Nếu file thật của bạn đặt tên khác (ví dụ còn gõ nhầm `Boabr`), **tên trong các dòng `require()` phải khớp từng chữ hoa/thường với tên file thật**.

---

## 3. Luồng chạy của 1 request

```
Postman / Frontend
      │  gửi request (GET/POST/PUT/DELETE + URL)
      ▼
   index.js        app.use("/api/tasks", taskRouter)     chọn đúng Router theo URL
      ▼
   Router          router.get("/", taskController.getTask)   chọn đúng hàm theo method
      ▼
   Controller      lấy dữ liệu từ req, gọi Model, trả res
      ▼
   Model           pool.query("SELECT ...")              chạm vào MySQL
      ▼
   MySQL (XAMPP)
```

Dữ liệu đi lên từ frontend nằm ở:

| Lấy ở đâu | Dùng khi | Ví dụ |
|---|---|---|
| `req.query` | GET, dữ liệu ngắn để lọc | `/api/tasks?boardId=b1` → `req.query.boardId` |
| `req.body` | POST/PUT, dữ liệu để tạo/sửa | JSON gửi kèm → `req.body.title` |
| `req.params` | Id nằm trên đường dẫn | `/api/tasks/t1` → `req.params.id` |

---

## 4. Cài đặt và chạy lần đầu

**Bước 1. Cài Node.js** từ https://nodejs.org (bản LTS). Kiểm tra: `node -v`.

**Bước 2. Bật MySQL.** Mở XAMPP Control Panel, bấm **Start** ở dòng **MySQL** (không cần Start Apache).

**Bước 3. Tạo database.** Vào `http://localhost/phpmyadmin`, tạo database tên **`treollo`** (chú ý 2 chữ "l"), rồi vào tab **SQL** chạy file `tao_bang_va_du_lieu.sql` để tạo 7 bảng và dữ liệu mẫu.

**Bước 4. Cài thư viện.** Mở terminal tại thư mục `BE`:
```
npm install
```

**Bước 5. Tạo file `.env`** ở thư mục gốc `BE`:
```
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_NAME=treollo
DB_PORT=3306
JWT_SECRET=mot_chuoi_bi_mat_bat_ky
```
`DB_NAME` phải khớp **chính xác** tên database trong phpMyAdmin.

**Bước 6. Thêm script vào `package.json`** (nếu chưa có):
```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}
```

**Bước 7. Chạy server:**
```
npm start          # chạy thường
npm run dev        # tự restart khi sửa code
```
Terminal phải in ra:
```
Server chay tai http://localhost:3000
Ket noi MySQL thanh cong
```

> Dùng `npm start` thì **mỗi lần sửa code phải tự dừng (`Ctrl + C`) rồi chạy lại**. Quên bước này là nguyên nhân của hầu hết lỗi "sửa rồi mà vẫn như cũ".

---

## 5. Database `treollo`

| Bảng | Cột chính | Quan hệ |
|---|---|---|
| `users` | id, name, email, password, created_at | |
| `workspaces` | id, name, created_at | |
| `memberships` | id, user_id, workspace_id, role | nối users ↔ workspaces, `role`: admin / member / viewer |
| `projects` | id, name, workspace_id | thuộc 1 workspace |
| `boards` | id, name, project_id | thuộc 1 project |
| `tasks` | id, title, status, board_id, assignee_id, created_at | thuộc 1 board, giao cho 1 user |
| `comments` | id, content, task_id, user_id, created_at | thuộc 1 task, do 1 user viết |

Quy tắc: khóa ngoại nằm ở phía "nhiều" (comment giữ `task_id`, không phải task giữ `comment_id`).

---

## 6. Danh sách API

Địa chỉ gốc: `http://localhost:3000`

### Workspace — mount tại `/api/works` ✅

| Method | URL | Body (JSON) | Chức năng |
|---|---|---|---|
| GET | `/api/works` | | Xem tất cả workspace |
| POST | `/api/works` | `{"id":"w5","name":"Tên"}` | Tạo workspace |
| PUT | `/api/works` | `{"id":"w1","name":"Tên mới"}` | Đổi tên workspace |

Nếu `id` không tồn tại, PUT trả 404 `Không tìm thấy Workspaces để cập nhật`.

### Project ⬜
Chưa làm. Làm theo mẫu Board.

### Board — mount tại `/api/boards` ✅

| Method | URL | Chức năng |
|---|---|---|
| GET | `/api/boards?projectId=p1` | Xem các board thuộc 1 project |

`projectId` là id của **project** (ví dụ `p1`), không phải id của board (`b1`). Nếu không có dòng nào khớp, kết quả là `[]`.

### Task — mount tại `/api/tasks` ✅

| Method | URL | Body (JSON) | Chức năng |
|---|---|---|---|
| GET | `/api/tasks?boardId=b1` | | Xem các task thuộc 1 board |
| POST | `/api/tasks` | `{"id":"t10","title":"Tên task","boardId":"b1","assigneeId":"u1"}` | Tạo task |

Tên trường trong body viết **camelCase** (`boardId`, `assigneeId`) khớp với Controller, không viết `board_id`. Hàm `updateTask` đã có ở Model; nếu muốn dùng thì thêm `PUT /api/tasks/:id` vào Router và Controller. ⬜ Xóa task: chưa làm.

### User — mount tại `/api/users`

| Method | URL | Body (JSON) | Chức năng | Trạng thái |
|---|---|---|---|---|
| POST | `/api/users/register` | `{"name":"Nam","email":"nam@gmail.com","password":"123456"}` | Đăng ký | 🔧 |
| POST | `/api/users/login` | `{"email":"nam@gmail.com","password":"123456"}` | Đăng nhập, trả về token | ⬜ |

Kết quả đăng ký thành công: `{"message":"Đăng ký thành công"}`. Email trùng: `{"message":"Email đã được dùng"}`. Cột `password` trong DB phải là chuỗi `$2a$10$...` (đã mã hóa), không phải mật khẩu gốc.

### Còn lại ⬜
Membership (mời thành viên, phân quyền), Comment, Middleware `auth.js` (kiểm tra đăng nhập cho các API tạo/sửa/xóa).

---

## 7. Test bằng Postman

**GET:** chọn method GET, nhập URL (có `?...` nếu cần), bấm Send. Xem kết quả ở tab **Body** phía dưới.

**POST / PUT:**
1. Chọn method POST (hoặc PUT), nhập URL.
2. Tab **Body** → chọn **raw** → đổi dropdown bên phải từ Text sang **JSON**.
3. Gõ JSON, bấm Send.

Cùng một URL, đổi **method** là đổi chức năng (GET để xem, POST để tạo). Không cần đặt URL riêng kiểu `/create`.

Mã trạng thái: `200` thành công · `201` tạo mới thành công · `400` dữ liệu sai · `401` chưa đăng nhập · `404` không tìm thấy (hoặc sai URL) · `500` lỗi server (đọc nội dung `error`).

---

## 8. Thêm một bảng mới (ví dụ Project)

Mỗi bảng cần 3 file + 2 dòng trong `index.js`:

1. `Model/Projectmodel.js`: viết câu SQL, `module.exports = { ... }`
2. `Controller/Projectcontroller.js`: gọi Model, khung `try { lấy dữ liệu → gọi Model → res } catch (err) { res.status(500)... }`
3. `Router/Projectrouter.js`: `router.get("/", projectController.getProjects)`...
4. Trong `index.js`:
```js
const projectRouter = require("./Router/Projectrouter");
app.use("/api/projects", projectRouter);
```

Hai quy tắc khớp thứ tự khi viết SQL:
- Thứ tự mảng trong `pool.query(sql, [a, b])` phải khớp thứ tự các dấu `?` trong câu SQL.
- Thứ tự khi gọi hàm (Controller) phải khớp thứ tự tham số khai báo của hàm (Model).

---

## 9. Đưa code lên GitHub

Lần đầu:
```
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin <link-repo-cua-ban>
git push -u origin main
```
Các lần sau chỉ cần:
```
git add .
git commit -m "mô tả ngắn việc vừa làm"
git push
```
File `.gitignore` phải có `node_modules/` và `.env` **trước khi** chạy `git add .` lần đầu.

Khi clone project về máy khác: chạy `npm install`, tự tạo lại file `.env`, rồi làm lại từ Bước 2 phần 4.