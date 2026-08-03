import { useState } from "react";
import { Edit2, Save, X } from "lucide-react";
import InputField from "@/components/common/InputField/InputField";
import Button from "@/components/common/Button/Button";
import validators from "@/utils/validators";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";

const formInfo = [
  {
    name: "taiKhoan",
    label: "Tài khoản",
    type: "text",
    placeholder: "Nhập tài khoản...",
    disabled: true,
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
    name: "hoTen",
    label: "Họ và tên",
    type: "text",
    placeholder: "Nhập họ và tên...",
    rules: {
      min: 3,
      max: 50,
    },
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "example@gmail.com",
    rules: {
      isEmail: true,
    },
  },
  {
    name: "soDt",
    label: "Số điện thoại",
    type: "text",
    placeholder: "0123456789",
    rules: {
      isPhoneNumber: true,
    },
  },
];

export default function ProfileForm({ userInfo }) {
  const { handleUpdateProfile, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const [user, setUser] = useState({
    taiKhoan: userInfo?.taiKhoan || "",
    matKhau: userInfo?.matKhau || "",
    hoTen: userInfo?.hoTen || "",
    email: userInfo?.email || "",
    soDt: userInfo?.soDT || userInfo?.soDt || "",
  });

  const [validation, setValidation] = useState({
    taiKhoan: "",
    matKhau: "",
    hoTen: "",
    email: "",
    soDt: "",
  });

  const handleChange = (e) => {
    const { value, name } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleBlur = (e) => {
    const { value, name } = e.target;
    const dataField = formInfo.find((i) => i.name === name);
    if (!dataField?.rules) return;

    const errorMess = validators(value, dataField.label, dataField.rules);
    setValidation({
      ...validation,
      [name]: errorMess,
    });
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      setUser({
        taiKhoan: userInfo?.taiKhoan || "",
        matKhau: userInfo?.matKhau || "",
        hoTen: userInfo?.hoTen || "",
        email: userInfo?.email || "",
        soDt: userInfo?.soDT || userInfo?.soDt || "",
      });
      setValidation({
        taiKhoan: "",
        matKhau: "",
        hoTen: "",
        email: "",
        soDt: "",
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValid = true;
    const newValidation = {};

    formInfo.forEach((i) => {
      if (i.disabled) return;
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

    const payload = {
      ...user,
      soDT: user.soDt,
      maNhom: userInfo?.maNhom || import.meta.env.VITE_MA_NHOM || "GP01",
      maLoaiNguoiDung: userInfo?.maLoaiNguoiDung || "KhachHang",
    };

    try {
      await handleUpdateProfile(payload);
      setIsEditing(false);
    } catch {
      // noop
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-100 shadow-sm animate-in fade-in">
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Thông tin cá nhân</h2>
          <p className="text-xs text-gray-500 mt-1">
            Quản lý thông tin tài khoản và thông tin liên hệ của bạn
          </p>
        </div>
        <Button
          type="button"
          variant={isEditing ? "outline" : "primary"}
          size="sm"
          onClick={handleToggleEdit}
          className="flex items-center gap-2"
        >
          {isEditing ? (
            <>
              <X className="w-4 h-4" /> Hủy
            </>
          ) : (
            <>
              <Edit2 className="w-4 h-4" /> Chỉnh sửa
            </>
          )}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {formInfo?.map((item) => (
            <InputField
              key={item.name}
              label={item.label}
              type={item.type}
              name={item.name}
              value={user[item.name]}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={item.placeholder}
              error={validation[item.name]}
              disabled={item.disabled || !isEditing}
              required={!item.disabled}
            />
          ))}
        </div>

        {isEditing && (
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={handleToggleEdit}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Lưu thay đổi
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
