import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api";

const inputClass =
  "w-full border border-line bg-void px-3 py-2.5 text-sm text-ink placeholder:text-dim/60 focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await register(name, email, password);
      navigate("/login"); // đăng ký xong: chuyển sang đăng nhập
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="chamfer w-full max-w-sm bg-neon/40 p-px">
        <form onSubmit={handleSubmit} className="chamfer space-y-5 bg-panel p-8">
          <div>
            <h1 className="text-2xl font-semibold">Tạo tài khoản</h1>
            <p className="mt-1 text-sm text-dim">Miễn phí, mất chưa đầy một phút.</p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm text-dim">
              Tên hiển thị
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Nguyễn Văn A"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
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
              autoComplete="new-password"
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
            Đăng ký
          </button>

          <p className="text-center text-sm text-dim">
            Đã có tài khoản?{" "}
            <Link to="/login" className="text-neon hover:underline">
              Đăng nhập
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}

export default Register;