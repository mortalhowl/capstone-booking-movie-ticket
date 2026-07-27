import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { UserPlus } from "lucide-react";
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
      max: 20,
    },
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "example@gmail.com",
    rules: {
      isEmail: true,
      min: 3,
      max: 50,
    },
  },
  {
    name: "hoTen",
    label: "Họ và tên",
    type: "text",
    placeholder: "Nhập họ và tên...",
    rules: {
      min: 5,
      max: 50,
    },
  },
  {
    name: "soDt",
    label: "Số điện thoại",
    type: "text",
    placeholder: "0123456789",
    rules: {
      isPhoneNumber: true,
      min: 10,
      max: 10,
    },
  },
  {
    name: "matKhau",
    label: "Mật khẩu",
    type: "password",
    placeholder: "••••••••",
    rules: {
      isPassword: true,
      min: 6,
      max: 20,
    },
  },
  {
    name: "reTypeMatKhau",
    label: "Nhập lại mật khẩu",
    type: "password",
    placeholder: "••••••••",
    rules: {
      isPassword: true,
      min: 6,
      max: 20,
    },
  },
];

export default function RegisterForm() {
  const { handleRegister, loading } = useAuth();

  const [user, setUser] = useState({
    taiKhoan: "",
    email: "",
    hoTen: "",
    soDt: "",
    matKhau: "",
    reTypeMatKhau: "",
    maNhom: import.meta.env.VITE_MA_NHOM,
  });

  const [validation, setValidation] = useState({
    taiKhoan: "",
    email: "",
    hoTen: "",
    soDt: "",
    matKhau: "",
    reTypeMatKhau: "",
  });

  const handleChange = (e) => {
    const { value, name } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleBlur = (e) => {
    const { value, name } = e.target;
    const dataField = formInfo.find((i) => i.name === name);

    let errorMess = validators(value, dataField.label, dataField.rules);

    if (name === "reTypeMatKhau" && value !== user.matKhau) {
      errorMess = "Mật khẩu nhập lại không khớp!";
    }

    setValidation({
      ...validation,
      [name]: errorMess,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let isValid = true;
    const newValidation = {};

    formInfo.forEach((i) => {
      const value = user[i.name];
      let errorMess = validators(value, i.label, i.rules);

      if (i.name === "reTypeMatKhau" && value !== user.matKhau) {
        errorMess = "Mật khẩu nhập lại không khớp!";
      }

      newValidation[i.name] = errorMess;

      if (errorMess) isValid = false;
    });

    setValidation(newValidation);

    if (!isValid) {
      toast.error("Vui lòng điền đầy đủ và đúng các trường thông tin");
      return;
    }

    const { reTypeMatKhau, ...registerData } = user;

    handleRegister(registerData);
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-blue-600 px-6 py-8 text-center">
        <h2 className="text-2xl font-bold text-white">Đăng ký tài khoản</h2>
      </div>

      <div className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-4 flex items-center justify-center gap-2"
            loading={loading}
          >
            <UserPlus className="w-5 h-5" />
            ĐĂNG KÝ
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Đã có tài khoản?{" "}
          <Link
            to="/auth/login"
            className="text-blue-600 font-bold hover:underline"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
