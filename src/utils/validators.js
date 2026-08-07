export default function validators(value, label, options = {}) {
  const trimValue = value ? value.trim() : "";

  if (options.required !== false && trimValue === "")
    return `${label} không được để trống`;

  if (options.required === false && !trimValue) return "";

  if (options.min && trimValue.length < options.min)
    return `${label} phải chứa ít nhất ${options.min} ký tự`;

  if (options.max && trimValue.length > options.max)
    return `${label} không được vượt quá ${options.max} ký tự`;

  if (options.isUsername) {
    const regex = /^[a-zA-Z0-9_.-]{3,20}$/;
    if (!regex.test(value))
      return `${label} từ 3-20 ký tự, không chứa khoảng trắng hoặc ký tự đặc biệt`;
  }

  if (options.isPassword) {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,20}$/;
    if (!regex.test(value)) {
      return `${label} từ 6-20 ký tự, phải bao gồm cả chữ và số`;
    }
  }

  if (options.isEmail) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) {
      return `${label} không đúng định dạng`;
    }
  }

  if (options.isPhoneNumber) {
    const regex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!regex.test(value)) {
      return `${label} không đúng định dạng số điện thoại Việt Nam`;
    }
  }
  return "";
}
