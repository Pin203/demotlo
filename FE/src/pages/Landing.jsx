import { Link, Navigate } from "react-router-dom";
import Footer from "../components/Footer";

// Bảng mẫu minh họa cho khu vực giới thiệu (dữ liệu giả, không gọi backend)
const columns = [
  { title: "Todo", cards: ["Thiết kế logo", "Viết nội dung"] },
  { title: "Doing", cards: ["Dựng API đăng nhập"] },
  { title: "Done", cards: ["Tạo database", "Cài đặt dự án"] },
];

const features = [
  {
    title: "Workspace, Project, Board",
    text: "Chia việc theo từng lớp: nhóm làm việc, dự án, rồi bảng công việc.",
  },
  {
    title: "Phân quyền theo vai trò",
    text: "Quản lí, Member và Viewer chỉ làm được những việc đúng với vai trò của mình.",
  },
  {
    title: "Trao đổi trên từng task",
    text: "Gắn người phụ trách, đổi trạng thái và bình luận ngay trên thẻ.",
  },
];

function Landing() {
  // Giống Trello: đã đăng nhập thì vào thẳng trang làm việc
  if (localStorage.getItem("token")) {
    return <Navigate to="/workspaces" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header công khai: chỉ có logo + Đăng nhập + Đăng ký */}
      <header className="sticky top-0 z-40 border-b border-line bg-void/80 backdrop-blur-md">
        <div className="relative mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <span
            className="absolute -bottom-px left-4 h-px w-28 bg-neon sm:left-6"
            aria-hidden="true"
          />
          <Link
            to="/"
            className="flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon"
          >
            <img
              src="/image/capribr.png"
              alt=""
              className="h-10 w-10 object-cover"
            />
            <span className="text-[15px] font-semibold uppercase tracking-[0.2em] text-ink">
              Cap
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-3 py-1.5 text-sm font-medium text-dim transition-colors hover:text-neon focus-visible:text-neon focus-visible:outline-none"
            >
              Đăng nhập
            </Link>
            <Link
              to="/register"
              className="chamfer bg-neon px-4 py-1.5 text-sm font-bold text-void transition-colors hover:bg-white focus-visible:bg-white focus-visible:outline-none"
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Phần mở đầu: tiêu đề bên trái, bảng minh họa bên phải */}
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Quản lý công việc nhóm trên một bảng duy nhất.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-dim">
              Tạo workspace, chia dự án thành các bảng, kéo thẻ task từ Todo sang
              Done và trao đổi ngay trên từng thẻ.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/register"
                className="chamfer bg-neon px-6 py-3 text-sm font-bold text-void transition-colors hover:bg-white focus-visible:bg-white focus-visible:outline-none"
              >
                Bắt đầu miễn phí
              </Link>
              <Link
                to="/login"
                className="px-4 py-3 text-sm font-medium text-ink transition-colors hover:text-neon focus-visible:text-neon focus-visible:outline-none"
              >
                Đã có tài khoản? Đăng nhập
              </Link>
            </div>
          </div>

          {/* Bảng minh họa (chỉ để trang trí, không bấm được) */}
          <div
            className="border border-line bg-panel p-4"
            aria-hidden="true"
          >
            <div className="grid grid-cols-3 gap-3">
              {columns.map((col) => (
                <div key={col.title} className="space-y-2">
                  <p className="font-mono text-xs text-dim">{col.title}</p>
                  {col.cards.map((card) => (
                    <div
                      key={card}
                      className={`border bg-void px-3 py-2 text-sm ${
                        card === "Dựng API đăng nhập"
                          ? "border-neon/60 shadow-glow"
                          : "border-line"
                      }`}
                    >
                      {card}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ba điểm chính của sản phẩm */}
        <section className="border-t border-line">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-3">
            {features.map((f) => (
              <div key={f.title}>
                <h2 className="text-base font-semibold">{f.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-dim">{f.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Landing;