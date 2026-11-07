import { useState } from "react";


const links = [
  { label: "Workspaces", href: "/workspaces" },
  { label: "Dashboard", href: "/dashboard" },
];

// Lấy thông tin người dùng đã lưu lúc đăng nhập.
function getSavedUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

function Header() {
  const [user] = useState(getSavedUser);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/"; // tải lại trang, quay về màn hình đăng nhập
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-void/80 backdrop-blur-md">
      <div className="relative mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Vạch neon nằm trên đường viền, ngay dưới logo */}
        <span
          className="absolute -bottom-px left-4 h-px w-28 bg-neon sm:left-6"
          aria-hidden="true"
        />

        {/* Bên trái: logo + menu */}
        <div className="flex items-center gap-8">
          <a
            href="/"
            className="flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon"
          >
            {/* Biểu tượng 3 cột kanban, phát sáng neon */}
            <span
              className="flex h-10 w-10 items-center justify-center overflow-hidden"
              aria-hidden="true"
            >
              <img
                src="/image/capribr.png"
                alt=""
                className="h-full w-full object-cover"
              />
            </span>
            <span className="text-[15px] font-semibold uppercase tracking-[0.2em] text-ink ">
              Cap
            </span>
          </a>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 font-mono text-[13px] text-dim transition-colorsS hover:text-neon focus-visible:text-neon focus-visible:outline-2 focus-visible:outline-neon"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Bên phải: avatar, tên, nút đăng xuất (chỉ hiện khi đã đăng nhập) */}
        {user && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <span className="chamfer flex h-8 w-8 items-center justify-center bg-neon/15 font-mono text-sm font-medium text-neon">
                {user.name?.charAt(0).toUpperCase()}
              </span>
              <span className="hidden font-mono text-[13px] text-ink sm:block">
                {user.name}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="chamfer bg-magenta/15 px-3.5 py-1.5 text-sm font-semibold text-magenta transition-colors hover:bg-magenta hover:text-void focus-visible:bg-magenta focus-visible:text-void focus-visible:outline-none"
            >
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;