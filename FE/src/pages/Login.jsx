import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api";
import GoogleButton from "../components/GoogleButton";
// Kiểu chung cho ô nhập (dùng lại ở Register)
const inputClass =
  "w-full border border-line bg-void px-3 py-2.5 text-sm text-ink placeholder:text-dim/60 focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/workspaces"); // đăng nhập xong: vào trang làm việc
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-4">
      {/* Khung ngoài mỏng 1px màu neon, khung trong là nền form: tạo viền cho hình góc vát */}
      <div className="chamfer w-full max-w-sm bg-neon/40 p-px">
        <form onSubmit={handleSubmit} className="chamfer space-y-5 bg-panel p-8">
          <div>
            <h1 className="text-2xl font-semibold">Đăng nhập</h1>
            <p className="mt-1 text-sm text-dim">Vào bảng công việc của bạn.</p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm text-dim">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="ten@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm text-dim">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </div>

          {error && <p className="font-mono text-sm text-magenta">{error}</p>}

          <button
            type="submit"
            className="chamfer w-full bg-neon py-2.5 text-sm font-bold text-void transition-colors hover:bg-white focus-visible:bg-white focus-visible:outline-none"
          >
            Đăng nhập
          </button>

          <p className="text-center text-sm text-dim">
            Chưa có tài khoản?{" "}
            <Link to="/register" className="text-neon hover:underline">
              Đăng ký
            </Link>
          </p>
          <div className="flex items-center gap-3 text-sm text-dim">
  <span className="h-px flex-1 bg-line" />
  hoặc
  <span className="h-px flex-1 bg-line" />
</div>

<GoogleButton onError={setError} /> 
        </form>
      </div>
    </main>
  );
}

export default Login;