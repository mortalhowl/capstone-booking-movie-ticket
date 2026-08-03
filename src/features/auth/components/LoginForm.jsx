import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { LogIn } from "lucide-react";
import InputField from "@/components/common/InputField/InputField";
import Button from "@/components/common/Button/Button";
import { useState } from "react";
import validators from "@/utils/validators";
import { toast } from "react-toastify";

const formInfo = [
  {
    name: "taiKhoan",
    label: "Tài khoản",
    type: "text",
    placeholder: "Nhập tên đăng nhập...",
    rules: {
      isUsername: true,
      min: 3,
      max: 30,
    },
  },
  {
    name: "matKhau",
    label: "Mật khẩu",
    type: "password",
    placeholder: "••••••••",
    rules: {
      isPassword: true,
      min: 3,
      max: 30,
    },
  },
];

export default function LoginForm() {
  const { handleLogin, loading } = useAuth();
  const [user, setUser] = useState({
    taiKhoan: "",
    matKhau: "",
  });
  const [validation, setValidation] = useState({
    taiKhoan: "",
    matKhau: "",
  });

  const handleChange = (e) => {
    const { value, name } = e.target;
    setUser({ ...user, [name]: value });
  };
  console.log(user);

  const handleBlur = (e) => {
    const { value, name } = e.target;
    const dataField = formInfo.find((i) => i.name === name);
    const errorMess = validators(value, dataField.label, dataField.rules);
    setValidation({
      ...validation,
      [name]: errorMess,
    });
  };
  console.log(validation);

  const handleSubmit = (e) => {
    e.preventDefault();

    let isValid = true;
    const newValidation = {};

    formInfo.forEach((i) => {
      const value = user[i.name];
      const errorMess = validators(value, i.label, i.rules);

      newValidation[i.name] = errorMess;

      if (errorMess) isValid = false;
    });

    setValidation(newValidation);

    if (!isValid) {
      toast.error("Vui lòng điền đầy đủ và đúng các trường thông tin");
      return;
    }

    console.log(isValid, newValidation);

    handleLogin(user);
  };
  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-blue-600 px-6 py-8 text-center">
        <h2 className="text-2xl font-bold text-white">Đăng nhập</h2>
      </div>

      <div className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {formInfo?.map((item) => {
            return (
              <InputField
                key={item.name}
                label={item.label}
                type={item.type}
                name={item.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={item.placeholder}
                error={validation[item.name]}
                required
              />
            );
          })}

          <div className="flex justify-end">
            <div
              onClick={() => toast.info("Chưa hỗ trợ chức năng này")}
              className="text-sm text-blue-600 hover:underline font-medium cursor-pointer"
            >
              Quên mật khẩu?
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-4 flex items-center justify-center gap-2"
            loading={loading}
          >
            <LogIn className="w-5 h-5" />
            ĐĂNG NHẬP
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          Chưa có tài khoản?{" "}
          <Link
            to="/auth/register"
            className="text-blue-600 font-bold hover:underline"
          >
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
