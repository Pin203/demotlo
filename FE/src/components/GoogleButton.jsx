import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { googleLogin } from "../api";

// Nút "Đăng nhập với Google" dùng chung cho trang Login và Register.
// text: "signin_with" (Đăng nhập với Google) hoặc "signup_with" (Đăng ký với Google)
// onError: hàm nhận 1 chuỗi lỗi để màn hình hiện ra
function GoogleButton({ text = "signin_with", onError }) {
  const navigate = useNavigate();

  async function handleSuccess(credentialResponse) {
    try {
      // credential là "tấm vé" Google cấp, gửi lên backend để xác minh
      const data = await googleLogin(credentialResponse.credential);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/workspaces");
    } catch (err) {
      onError(err.message);
    }
  }

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => onError("Đăng nhập Google thất bại")}
        text={text}
        theme="filled_black"
      />
    </div>
  );
}

export default GoogleButton;