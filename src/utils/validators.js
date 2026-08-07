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
    const regex = /^[a-zA-Z0-9_.-]{3,30}$/;
    if (!regex.test(trimValue))
      return `${label} từ 3-30 ký tự, không chứa khoảng trắng hoặc ký tự đặc biệt`;
  }

  if (options.isPassword) {
    if (trimValue.length < 3 || trimValue.length > 30) {
      return `${label} từ 3-30 ký tự`;
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
