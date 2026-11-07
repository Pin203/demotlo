// Địa chỉ backend: lấy từ FE/.env (VITE_API_URL), không có thì dùng localhost:3000
const API = import.meta.env.VITE_API_URL 

// Hàm dùng chung: gửi POST kèm JSON, lỗi thì ném ra để màn hình hiện thông báo
async function post(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || data.error);
  }
  return data;
}

export function login(email, password) {
  return post("/users/login", { email, password });
}

export function register(name, email, password) {
  return post("/users/register", { name, email, password });
}
export function googleLogin(credential) {
  return post("/users/google", { credential });
}