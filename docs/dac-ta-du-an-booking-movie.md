# ĐẶC TẢ CHI TIẾT DỰ ÁN BOOKING MOVIE TICKET
### React JS + Redux (Thunk) + Tailwind CSS + Axios

> Tổng hợp & phân tích lại từ slide "Đặc tả dự án đặt vé xem phim" – Trương Tấn Khải / CyberLearn.

---

## 0. THÔNG TIN HỆ THỐNG API

| Thông tin | Giá trị |
|---|---|
| Swagger (danh sách API thật, luôn cập nhật) | `https://movienew.cybersoft.edu.vn/swagger/index.html` |
| Domain gốc API | `https://movienew.cybersoft.edu.vn/api` (đây là domain thay thế cho `domain.xyz` trong slide) |
| Header bắt buộc cho **mọi** request | `TokenCybersoft: <token bootcamp>` |
| Header bắt buộc cho API có **(Authorization)** | `Authorization: Bearer <accessToken lấy được sau khi đăng nhập>` |

> ⚠️ Lưu ý quan trọng: `TokenCybersoft` và `Authorization` là **2 header khác nhau**, cần gắn cả hai khi gọi các API có đánh dấu `(Authorization)`. Nên tạo 1 file `axios.config.js` set `TokenCybersoft` mặc định cho toàn app, và dùng interceptor để tự động gắn `Authorization` từ localStorage/Redux khi user đã đăng nhập.

```js
// axios.config.js
import axios from "axios";

const http = axios.create({
  baseURL: "https://movienew.cybersoft.edu.vn/api",
  headers: {
    TokenCybersoft:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // token cấp cho lớp
  },
});

http.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("USER_LOGIN"));
  if (user?.accessToken) {
    config.headers.Authorization = `Bearer ${user.accessToken}`;
  }
  return config;
});

export default http;
```

---

## 1. CẤU TRÚC THƯ MỤC THEO FEATURE (FEATURE-BASED)

> **Sửa lại so với bản trước:** `home` không phải là 1 feature — đó là tên 1 **page/route**. Trang chủ và trang chi tiết phim cùng thao tác trên 2 domain thật sự: **`movie`** (thông tin phim) và **`cinema`** (hệ thống rạp/lịch chiếu). Nếu đặt feature theo tên trang thì bản chất vẫn là `pages/` đổi tên, không giải quyết được vấn đề trùng lặp logic khi 2 trang cùng dùng chung dữ liệu rạp/lịch chiếu.
>
> Nguyên tắc tách lại: **feature = domain nghiệp vụ** (danh từ nghiệp vụ, không phải tên route), còn **`pages/` chỉ là lớp mỏng** — mỗi file trong `pages/` compose lại component/hook từ 1 hoặc nhiều feature để tạo thành 1 route cụ thể, không chứa logic gọi API hay xử lý state riêng.

```
src/
 ├─ app/
 │   ├─ store.js                     # combineReducers từ slice của từng feature + thunk middleware
 │   └─ hooks.js                     # custom hooks dùng chung (vd: useAuth() đọc từ authSlice)
 │
 ├─ routes/
 │   ├─ AppRoutes.jsx                 # khai báo toàn bộ route, map route -> page trong pages/
 │   ├─ PrivateRoute.jsx              # cần đăng nhập
 │   └─ AdminRoute.jsx                # cần đăng nhập + quyền QuanTri
 │
 ├─ services/
 │   └─ axiosConfig.js                # instance axios + interceptor Token/Authorization
 │
 ├─ layouts/
 │   ├─ ClientLayout/                 # Header + <Outlet/> + Footer
 │   └─ AdminLayout/                  # AdminSidebar + AdminHeader + <Outlet/>
 │
 ├─ components/
 │   └─ common/                       # component DÙNG CHUNG toàn app (không thuộc riêng domain nào)
 │       ├─ Toast/ToastContainer.jsx
 │       ├─ Modal/{Modal,ConfirmModal,VideoModal}.jsx
 │       ├─ Button/Button.jsx
 │       ├─ InputField/InputField.jsx
 │       ├─ SelectField/SelectField.jsx
 │       ├─ Loading/Spinner.jsx
 │       ├─ Pagination/Pagination.jsx
 │       └─ EmptyState/EmptyState.jsx
 │
 ├─ features/                         # DOMAIN NGHIỆP VỤ — KHÔNG đặt tên theo route/page
 │   │
 │   ├─ movie/                        # domain "phim": card, list, tabs, banner, info chi tiết
 │   │   ├─ components/
 │   │   │   ├─ Banner.jsx
 │   │   │   ├─ MovieCard.jsx
 │   │   │   ├─ MovieList.jsx
 │   │   │   ├─ MovieTabs.jsx
 │   │   │   └─ MovieInfo.jsx
 │   │   ├─ movieApi.js
 │   │   └─ movieSlice.js
 │   │
 │   ├─ cinema/                       # domain "rạp / lịch chiếu" — dùng CHUNG cho Home, MovieDetail, Admin Showtime
 │   │   ├─ components/
 │   │   │   ├─ CinemaSystemMenu.jsx       # menu logo hệ thống rạp (Home)
 │   │   │   ├─ CinemaSystemSchedule.jsx   # lịch chiếu theo hệ thống rạp (Home)
 │   │   │   ├─ CinemaScheduleList.jsx     # lịch chiếu theo phim (MovieDetail)
 │   │   │   ├─ DateTabs.jsx               # tab chọn ngày (MovieDetail)
 │   │   │   ├─ CinemaSystemSelect.jsx     # select hệ thống rạp (Admin Showtime)
 │   │   │   └─ CinemaClusterSelect.jsx    # select cụm rạp (Admin Showtime)
 │   │   ├─ cinemaApi.js
 │   │   └─ cinemaSlice.js
 │   │
 │   ├─ booking/                      # domain "đặt vé": sơ đồ ghế + xử lý đặt vé
 │   │   ├─ components/
 │   │   │   ├─ SeatMap.jsx
 │   │   │   ├─ Seat.jsx
 │   │   │   ├─ SeatLegend.jsx
 │   │   │   ├─ CountdownTimer.jsx
 │   │   │   └─ TicketSummaryPanel.jsx
 │   │   ├─ bookingApi.js
 │   │   └─ bookingSlice.js
 │   │
 │   ├─ auth/                         # domain "xác thực"
 │   │   ├─ components/
 │   │   │   ├─ RegisterForm.jsx
 │   │   │   └─ LoginForm.jsx
 │   │   ├─ authApi.js
 │   │   └─ authSlice.js
 │   │
 │   ├─ account/                      # domain "tài khoản cá nhân" (thông tin + lịch sử đặt vé của chính user)
 │   │   ├─ components/
 │   │   │   ├─ AccountTabs.jsx
 │   │   │   ├─ AccountInfoForm.jsx
 │   │   │   ├─ BookingHistoryList.jsx
 │   │   │   └─ BookingHistoryItem.jsx
 │   │   ├─ accountApi.js
 │   │   └─ accountSlice.js
 │   │
 │   └─ admin/                        # các domain quản trị — tách riêng khỏi domain khách hàng vì field/action khác hẳn (upload ảnh, CRUD...)
 │       ├─ movie/                    # domain "quản trị phim"
 │       │   ├─ components/
 │       │   │   ├─ FilmTable.jsx
 │       │   │   ├─ FilmTableRow.jsx
 │       │   │   ├─ FilmSearchBar.jsx
 │       │   │   ├─ FilmForm.jsx          # dùng chung cho Thêm & Sửa
 │       │   │   └─ ImageUploadInput.jsx
 │       │   ├─ adminMovieApi.js
 │       │   └─ adminMovieSlice.js
 │       │
 │       ├─ showtime/                 # domain "quản trị lịch chiếu" — tái sử dụng CinemaSystemSelect/CinemaClusterSelect từ features/cinema, KHÔNG tạo lại
 │       │   ├─ components/
 │       │   │   └─ ShowtimeForm.jsx
 │       │   ├─ adminShowtimeApi.js
 │       │   └─ adminShowtimeSlice.js
 │       │
 │       └─ user/                     # domain "quản trị người dùng"
 │           ├─ components/
 │           │   ├─ UserTable.jsx
 │           │   ├─ UserSearchBar.jsx
 │           │   ├─ UserForm.jsx          # dùng chung cho Thêm & Sửa
 │           │   └─ UserTypeSelect.jsx
 │           ├─ adminUserApi.js
 │           └─ adminUserSlice.js
 │
 ├─ pages/                             # LỚP MỎNG (route-level) — chỉ import & compose lại từ features/, KHÔNG chứa logic gọi API
 │   ├─ HomePage.jsx                   # ghép: features/movie (Banner, MovieTabs, MovieList) + features/cinema (CinemaSystemMenu, CinemaSystemSchedule)
 │   ├─ MovieDetailPage.jsx            # ghép: features/movie (MovieInfo) + features/cinema (DateTabs, CinemaScheduleList)
 │   ├─ TicketRoomPage.jsx             # ghép: features/booking
 │   ├─ RegisterPage.jsx               # ghép: features/auth (RegisterForm)
 │   ├─ LoginPage.jsx                  # ghép: features/auth (LoginForm)
 │   ├─ AccountPage.jsx                # ghép: features/account
 │   ├─ NotFoundPage.jsx
 │   └─ admin/
 │       ├─ FilmManagementPage.jsx     # ghép: features/admin/movie (FilmSearchBar, FilmTable)
 │       ├─ FilmAddNewPage.jsx         # ghép: features/admin/movie (FilmForm)
 │       ├─ FilmEditPage.jsx           # ghép: features/admin/movie (FilmForm)
 │       ├─ ShowtimeCreatePage.jsx     # ghép: features/admin/showtime (ShowtimeForm) + features/cinema (2 Select)
 │       ├─ UserManagementPage.jsx     # ghép: features/admin/user (UserSearchBar, UserTable)
 │       ├─ UserAddPage.jsx            # ghép: features/admin/user (UserForm)
 │       └─ UserEditPage.jsx           # ghép: features/admin/user (UserForm)
 │
 ├─ utils/
 │   ├─ formatCurrency.js
 │   ├─ formatDate.js
 │   ├─ validators.js
 │   └─ toastHelper.js
 │
 └─ App.js                            # bọc <Provider>, <ToastContainer/>, <AppRoutes/>
```

**Vì sao tách `pages/` ra riêng thay vì nhét `HomePage.jsx` vào trong `features/movie/`?**
- 1 page thường ghép từ **≥ 2 feature** (Home ghép cả `movie` lẫn `cinema`) → nếu nhét page vào 1 feature cụ thể sẽ gây hiểu lầm "page này thuộc feature đó", trong khi thực chất nó chỉ compose.
- Khi cần đổi bố cục trang (route) mà không đổi nghiệp vụ, chỉ sửa trong `pages/`, feature giữ nguyên — tách bạch rõ "logic nghiệp vụ" và "cách trình bày theo route".
- Feature (`movie`, `cinema`, `booking`...) có thể tái sử dụng ở nhiều page khác nhau trong tương lai (ví dụ sau này thêm trang "Tìm kiếm phim" vẫn dùng lại `MovieCard`, `MovieList` từ `features/movie` mà không cần tạo feature mới).

Route guard cần 2 loại:
- `PrivateRoute` (đã đăng nhập mới vào được: `/account`)
- `AdminRoute` (đã đăng nhập **và** có quyền Admin/QuanTri mới vào được các trang `/admin/*`)

---

## 1.1 BẢNG TÍNH TOÁN TOÀN BỘ COMPONENTS CẦN TẠO

### A. Common components (dùng chung toàn app) — `components/common`

| Component | Vai trò | Props chính | Dùng ở |
|---|---|---|---|
| `ToastContainer` | Cấu hình react-toastify 1 lần, đặt trong `App.js` | vị trí, autoClose, theme | Toàn app (mọi thông báo thành công/lỗi API) |
| `toastHelper.js` (file util, không phải component) | Wrap `toast.success/error/warn` thành hàm gọn: `showSuccess(msg)`, `showError(msg)` | — | Toàn app, gọi trong mọi thunk sau khi resolve/reject |
| `Modal` | Khung modal generic (overlay + box + nút đóng), nhận `children` | `isOpen`, `onClose`, `title`, `children` | Trailer, Confirm xoá |
| `ConfirmModal` | Modal xác nhận hành động nguy hiểm | `message`, `onConfirm`, `onCancel` | Xoá phim (`features/admin/movie`), Xoá user (`features/admin/user`) |
| `VideoModal` | Modal nhúng iframe Youtube trailer | `videoUrl`, `isOpen`, `onClose` | `MovieInfo` (`features/movie`) |
| `Button` | Button chuẩn hoá theo design system Tailwind | `variant`, `size`, `loading`, `onClick` | Toàn app |
| `InputField` | Input có label + error message + forwardRef (dùng với react-hook-form) | `label`, `name`, `error`, `register` | Toàn bộ form |
| `SelectField` | Select có label + options + error (base cho `CinemaSystemSelect`, `UserTypeSelect`...) | `label`, `options`, `error` | `features/cinema`, `features/admin/user` |
| `Spinner` / `Loading` | Loading indicator | `size` | Khi gọi API (fetch list, submit form) |
| `Pagination` | Phân trang | `currentPage`, `totalPage`, `onChange` | `features/admin/movie`, `features/admin/user` |
| `EmptyState` | Hiển thị khi danh sách rỗng / không có kết quả tìm kiếm | `message` | Danh sách phim, danh sách user, lịch sử đặt vé |
| `NotFoundPage` | Trang 404 | — | Route `*` (đặt ở `pages/`, ghi ở đây để không sót) |

### B. Layout components

| Component | Vai trò |
|---|---|
| `ClientLayout` | Header + `<Outlet/>` + Footer cho toàn bộ trang khách hàng |
| `Header` | Logo, menu, nút đăng ký/đăng nhập hoặc avatar user khi đã đăng nhập (đọc state từ `features/auth`) |
| `Footer` | Logo, chính sách, liên hệ |
| `AdminLayout` | Sidebar + AdminHeader + `<Outlet/>` |
| `AdminSidebar` | Menu: Users / Films / Showtime |
| `AdminHeader` | Tên user đăng nhập + nút Đăng xuất |

### C. Feature `movie` — domain "phim"

| Component | Vai trò | Dùng ở page |
|---|---|---|
| `Banner` | Carousel banner (dùng lib slider hoặc tự build) | HomePage |
| `MovieTabs` | Tab chuyển "Đang chiếu / Sắp chiếu / Hot" | HomePage |
| `MovieList` | Grid danh sách `MovieCard` | HomePage |
| `MovieCard` | Poster + tên phim + rating + nút "Đặt vé" (điều hướng chi tiết phim) | HomePage |
| `MovieInfo` | Poster to + tên phim + mô tả + nút Xem trailer / Mua vé ngay | MovieDetailPage |

### D. Feature `cinema` — domain "rạp / lịch chiếu" (dùng chung nhiều page)

| Component | Vai trò | Dùng ở page |
|---|---|---|
| `CinemaSystemMenu` | Danh sách logo hệ thống rạp bên trái (click đổi `maHeThongRap`) | HomePage |
| `CinemaSystemSchedule` | Danh sách cụm rạp + suất chiếu bên phải, ứng với hệ thống rạp đang chọn | HomePage |
| `DateTabs` | Tab chọn ngày (Thứ 2 → Chủ nhật) | MovieDetailPage |
| `CinemaScheduleList` | Danh sách cụm rạp kèm các nút giờ chiếu (2D/3D), click → điều hướng `TicketRoomPage` | MovieDetailPage |
| `CinemaSystemSelect` | Select hệ thống rạp (dùng `SelectField` chung + data từ `cinemaSlice`) | Admin ShowtimeCreatePage |
| `CinemaClusterSelect` | Select cụm rạp, phụ thuộc hệ thống rạp đã chọn | Admin ShowtimeCreatePage |

*(Modal xem trailer tái sử dụng `VideoModal` ở common, không tạo riêng trong feature `movie`)*

### E. Feature `booking` — domain "đặt vé"

| Component | Vai trò |
|---|---|
| `SeatMap` | Grid tổng thể sơ đồ ghế, render danh sách `Seat` |
| `Seat` | 1 ô ghế — đổi màu theo trạng thái (thường/VIP/đang chọn/đã đặt/người khác đang chọn) |
| `SeatLegend` | Chú thích màu ghế |
| `CountdownTimer` | Đồng hồ đếm ngược thời gian giữ ghế |
| `TicketSummaryPanel` | Thông tin phim/suất chiếu + danh sách ghế đã chọn + tổng tiền + nút đặt vé |

### F. Feature `auth` — domain "xác thực"

| Component | Vai trò |
|---|---|
| `RegisterForm` | Form đăng ký (đủ field theo API `DangKy`) |
| `LoginForm` | Form đăng nhập |

*(Nếu chọn hướng "popup đăng nhập/đăng ký" thay vì trang riêng, bọc 2 form này trong `Modal` chung thay vì tạo `AuthModal` riêng)*

### G. Feature `account` — domain "tài khoản cá nhân"

| Component | Vai trò |
|---|---|
| `AccountTabs` | Tab "Thông tin cá nhân" / "Lịch sử đặt vé" |
| `AccountInfoForm` | Form xem/cập nhật thông tin cá nhân |
| `BookingHistoryList` | Danh sách vé đã đặt |
| `BookingHistoryItem` | 1 item vé: poster, rạp, ngày giờ, ghế |

### H. Feature `admin/movie` — domain "quản trị phim"

| Component | Vai trò |
|---|---|
| `FilmSearchBar` | Ô tìm kiếm phim |
| `FilmTable` | Bảng danh sách phim |
| `FilmTableRow` | 1 dòng phim + nút Sửa/Xoá/Tạo lịch chiếu (Sửa/Tạo lịch chiếu là `<Link>`, Xoá mở `ConfirmModal` chung) |
| `FilmForm` | Form dùng chung cho Thêm phim & Sửa phim (nhận `defaultValues` optional) |
| `ImageUploadInput` | Input file + preview ảnh, xuất ra `File` object để append vào FormData |

### I. Feature `admin/showtime` — domain "quản trị lịch chiếu"

| Component | Vai trò |
|---|---|
| `ShowtimeForm` | Form tạo lịch chiếu (ngày giờ, giá vé) — nhúng `CinemaSystemSelect` + `CinemaClusterSelect` **import từ `features/cinema`**, không viết lại |

### J. Feature `admin/user` — domain "quản trị người dùng"

| Component | Vai trò |
|---|---|
| `UserSearchBar` | Ô tìm kiếm user theo tài khoản/họ tên |
| `UserTable` | Bảng danh sách user + phân trang (`Pagination` chung) |
| `UserForm` | Form dùng chung cho Thêm user & Sửa user |
| `UserTypeSelect` | Select loại người dùng (load từ API `LayDanhSachLoaiNguoiDung`) |

### Tổng số lượng component ước tính

| Nhóm | Số lượng |
|---|---|
| Common (dùng chung) | 11 (+ `NotFoundPage` đặt ở `pages/`) |
| Layout | 6 |
| Feature `movie` | 5 |
| Feature `cinema` | 6 |
| Feature `booking` | 5 |
| Feature `auth` | 2 |
| Feature `account` | 4 |
| Feature `admin/movie` | 5 |
| Feature `admin/showtime` | 1 (tái sử dụng 2 component từ `cinema`) |
| Feature `admin/user` | 4 |
| **Tổng cộng** | **~49 components** |

---
## 1.2 CÀI ĐẶT REACT-TOASTIFY (COMMON)

```bash
npm install react-toastify
```

```jsx
// components/common/Toast/ToastContainer.jsx
import { ToastContainer as ReactToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ToastContainer() {
  return (
    <ReactToastContainer
      position="top-right"
      autoClose={2500}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      theme="colored"
    />
  );
}
```

```jsx
// App.js
import ToastContainer from "components/common/Toast/ToastContainer";

function App() {
  return (
    <>
      <AppRoutes />
      <ToastContainer />
    </>
  );
}
```

```js
// utils/toastHelper.js — gọi trong các thunk (then/catch) thay vì import toast trực tiếp khắp nơi
import { toast } from "react-toastify";

export const showSuccess = (msg) => toast.success(msg);
export const showError = (msg) => toast.error(msg);
export const showWarn = (msg) => toast.warn(msg);
```

*Ví dụ dùng trong thunk:*
```js
export const deleteMovieThunk = (maPhim) => async (dispatch) => {
  try {
    await filmManagementApi.deleteMovie(maPhim);
    dispatch(fetchAdminMovieListThunk());
    showSuccess("Xoá phim thành công!");
  } catch (err) {
    showError(err?.response?.data?.content || "Xoá phim thất bại!");
  }
};
```

---

## 1.3 MODAL DÙNG CHUNG (COMMON) — VÍ DỤ CODE

```jsx
// components/common/Modal/Modal.jsx
export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>
        {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
        {children}
      </div>
    </div>
  );
}
```

```jsx
// components/common/Modal/ConfirmModal.jsx
import Modal from "./Modal";
import Button from "../Button/Button";

export default function ConfirmModal({ isOpen, message, onConfirm, onCancel }) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Xác nhận">
      <p className="mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>Huỷ</Button>
        <Button variant="danger" onClick={onConfirm}>Xác nhận</Button>
      </div>
    </Modal>
  );
}
```

- `ConfirmModal` dùng ở: Xoá phim (`FilmTableRow`), Xoá người dùng (`UserTable`).
- `VideoModal` dùng ở: nút "Xem trailer" trong `MovieInfo` (trang chi tiết phim).

---

## 2. PHẦN GIAO DIỆN KHÁCH HÀNG (CLIENT)

### 2.1 Trang chủ
**Path:** `/` hoặc `/trangchu`

**Bố cục (từ trên xuống):**
1. Header: Logo | Menu (Trang chủ, Liên hệ, Tin tức, Ứng dụng) | Nút "Đăng ký" / "Đăng nhập" (mở popup hoặc chuyển trang)
2. Banner carousel (ảnh tĩnh hoặc lấy từ API)
3. Danh sách phim dạng lưới card (poster, tên phim, rating), có thể chia tab "Phim đang chiếu / Phim sắp chiếu / Phim hot"
4. Block lịch chiếu theo hệ thống rạp: menu bên trái các logo hệ thống rạp (CGV, BHD, Lotte, Galaxy...) → bên phải danh sách cụm rạp + giờ chiếu theo ngày
5. Footer: logo, chính sách, liên hệ, mạng xã hội

**Field/dữ liệu cần:** không có form nhập, chỉ hiển thị dữ liệu động.

**API sử dụng:**
| Method | Endpoint | Ghi chú |
|---|---|---|
| GET | `/api/QuanLyPhim/LayDanhSachBanner` | lấy banner carousel |
| GET | `/api/QuanLyPhim/LayDanhSachPhim?MaNhom=GP01` | danh sách phim (mã nhóm dành cho học offline, online có thể không cần) |
| GET | `/api/QuanLyRap/LayThongTinHeThongRap` | danh sách logo hệ thống rạp bên trái |
| GET | `/api/QuanLyRap/LayThongTinLichChieuHeThongRap?maHeThongRap=bhdStar` | lịch chiếu toàn bộ theo hệ thống rạp đã chọn (tham số lấy khi user click vào 1 hệ thống rạp) |

**Redux state cần:** `movieList`, `bannerList`, `cinemaSystemList`, `cinemaSystemSchedule`, `selectedCinemaSystem`.

**Sự kiện chính:** click logo hệ thống rạp → dispatch action fetch lại `LayThongTinLichChieuHeThongRap` theo mã hệ thống rạp đó (không cần load lại cả trang).

---

### 2.2 Trang chi tiết phim
**Path:** `/chitietphim/:maPhim` (hoặc `/detail/:id`)

**Bố cục:**
1. Header (dùng lại layout chung)
2. Panel trái: poster phim to, tên phim, nút "Xem trailer" (mở modal video) và nút "Mua vé ngay"
3. Panel phải/dưới: thông tin phim (đạo diễn, diễn viên, thể loại, mô tả, khởi chiếu...)
4. Bộ chọn ngày (danh sách ngày trong tuần dạng tab: Thứ 2 → Chủ nhật)
5. Danh sách rạp + suất chiếu theo cụm rạp, mỗi dòng gồm: logo hệ thống rạp, tên cụm rạp + địa chỉ, các nút giờ chiếu (2D/3D)

**Ghi chú từ tài liệu gốc:** không cần làm chuẩn theo giờ thực tế thời gian thực, chỉ cần hiển thị toàn bộ lịch chiếu trả về từ API — mục tiêu chính là ôn tập kỹ thuật render/xử lý dữ liệu lồng nhau.

**API sử dụng:**
| Method | Endpoint | Ghi chú |
|---|---|---|
| GET | `/api/QuanLyRap/LayThongTinLichChieuPhim?MaPhim={maPhim}` | trả về info phim + toàn bộ lịch chiếu (theo cụm rạp, theo ngày, theo giờ) |

**Sự kiện chính:** click vào 1 suất chiếu (giờ chiếu) → điều hướng sang `/chitietphongve/:maLichChieu` với tham số `maLichChieu` lấy từ item được click.

---

### 2.3 Trang đặt vé (phòng vé / sơ đồ ghế)
**Path:** `/chitietphongve/:maLichChieu` (hoặc `/ticketroom/:id`)

**Bố cục:**
1. Header
2. Panel trái: sơ đồ ghế dạng lưới (grid các ô ghế theo hàng A, B, C...), đồng hồ đếm ngược thời gian giữ ghế, chú thích màu: Ghế thường / Ghế VIP / Ghế đang chọn / Ghế đã đặt / Ghế đang có người khác chọn
3. Panel phải: thông tin phim + suất chiếu (tên phim, ngày giờ chiếu, cụm rạp, rạp số mấy), danh sách ghế đã chọn, giá vé, tổng tiền, nút "Đặt vé"

**Field/dữ liệu:**
- Sơ đồ ghế lấy nguyên trả về từ API (mỗi ghế có: mã ghế, tên ghế, loại ghế, giá, trạng thái đã đặt hay chưa)
- Người dùng chọn nhiều ghế → tự tính tổng tiền = tổng giá các ghế đã chọn

**API sử dụng:**
| Method | Endpoint | Ghi chú |
|---|---|---|
| GET | `/api/QuanLyDatVe/LayDanhSachPhongVe?MaLichChieu={id}` | trả về thông tin phim/suất chiếu + danh sách ghế |
| POST | `/api/QuanLyDatVe/DatVe` (Authorization) | đặt vé — body gồm `maLichChieu` và `danhSachVe` (mảng mã ghế) — **bắt buộc phải đăng nhập** mới đặt được vé |

**Redux state cần:** `ticketRoomInfo`, `selectedSeats`, `totalPrice`.

---

### 2.4 Trang đăng ký
**Path:** `/dangky` hoặc `/register`

**Form fields:**
| Field | Key gửi API | Kiểu | Validate gợi ý |
|---|---|---|---|
| Tài khoản | `taiKhoan` | string | required, không dấu/cách |
| Mật khẩu | `matKhau` | string | required, tối thiểu 6 ký tự |
| Nhập lại mật khẩu | (chỉ FE, không gửi API) | string | phải trùng `matKhau` |
| Họ tên | `hoTen` | string | required |
| Email | `email` | string | required, đúng định dạng email |
| Số điện thoại | `soDt` | string | required, đúng định dạng SĐT |
| Mã nhóm (ẩn, mặc định) | `maNhom` | string | mặc định `"GP01"` |

**API:**
| Method | Endpoint | Auth |
|---|---|---|
| POST | `/api/QuanLyNguoiDung/DangKy` | không cần Authorization |

**Điều hướng:** có link/nút "Đăng nhập →" chuyển sang `/dangnhap`.

---

### 2.5 Trang đăng nhập
**Path:** `/dangnhap` hoặc `/login`

**Form fields:**
| Field | Key gửi API | Kiểu |
|---|---|---|
| Tài khoản | `taiKhoan` | string |
| Mật khẩu | `matKhau` | string |

**API:**
| Method | Endpoint |
|---|---|
| POST | `/api/QuanLyNguoiDung/DangNhap` |

**Xử lý sau đăng nhập thành công:**
- Lưu response (chứa `accessToken`, `hoTen`, `maLoaiNguoiDung`, ...) vào Redux + `localStorage` (key ví dụ `USER_LOGIN`)
- Nếu `maLoaiNguoiDung === "QuanTri"` → có thể redirect vào `/admin`, ngược lại redirect về `/`
- Header của toàn app sau khi đăng nhập cần hiện tên user + menu dropdown (Thông tin cá nhân / Đăng xuất) thay cho 2 nút Đăng ký/Đăng nhập

---

### 2.6 Trang thông tin cá nhân
**Path:** `/thongtincanhan` hoặc `/profile` (**PrivateRoute** – cần đăng nhập)

**Bố cục:** 2 tab
1. Tab "Thông tin cá nhân": form hiển thị + cho phép cập nhật `email`, `họ tên`, `số điện thoại`, `tài khoản` (readonly), `mật khẩu` (readonly/ẩn), nút "Cập nhật"
2. Tab "Lịch sử đặt vé": danh sách vé đã đặt — mỗi item gồm poster phim, tên rạp/cụm rạp + địa chỉ, ngày đặt, giờ chiếu, số ghế

**API:**
| Method | Endpoint | Auth |
|---|---|---|
| POST | `/api/QuanLyNguoiDung/ThongTinTaiKhoan` | Authorization |
| PUT | `/api/QuanLyNguoiDung/CapNhatThongTinNguoiDung` | Authorization |
| POST | `/api/QuanLyDatVe/LayDanhSachPhongVeDaDat` | Authorization (lấy lịch sử đặt vé của user hiện tại) |

**Body cập nhật thông tin:**
```json
{
  "taiKhoan": "string",
  "matKhau": "string",
  "email": "string",
  "soDt": "string",
  "maNhom": "string",
  "maLoaiNguoiDung": "string",
  "hoTen": "string"
}
```

---

## 3. PHẦN GIAO DIỆN QUẢN TRỊ (ADMIN)

> Toàn bộ trang admin cần bọc trong `AdminRoute`: chỉ user đã đăng nhập với quyền quản trị mới truy cập được. Layout admin gồm Sidebar (Users, Films, Showtime) + Header (tên user + Đăng xuất) + khu vực nội dung.

### 3.1 Danh sách phim (Quản lý phim)
**Path:** `/admin/films`

**Bố cục:** thanh search + nút "Thêm phim" + bảng gồm cột: Mã phim | Hình ảnh | Tên phim | Mô tả | Hành động (Sửa ✏️ / Xóa 🗑️ / Tạo lịch chiếu 📅)

**API:**
| Method | Endpoint | Auth |
|---|---|---|
| POST/GET | `/api/QuanLyPhim/LayDanhSachPhim` | Authorization |

### 3.2 Thêm phim
**Path:** `/admin/films/addnew`

**Form fields (body FormData vì có upload hình):**
| Field | Key | Kiểu |
|---|---|---|
| Tên phim | `tenPhim` | string |
| Trailer (link youtube) | `trailer` | string |
| Mô tả | `moTa` | string |
| Mã nhóm | `maNhom` | string (mặc định `GP01`) |
| Ngày khởi chiếu | `ngayKhoiChieu` | string (dạng `dd/MM/yyyy`) |
| Đang chiếu | `dangChieu` | boolean (switch) |
| Sắp chiếu | `sapChieu` | boolean (switch) |
| Hot | `hot` | boolean (switch) |
| Số sao / đánh giá | `danhGia` | number (1–10) |
| Hình ảnh | `File` | file (input type=file) |

**API:**
| Method | Endpoint | Auth |
|---|---|---|
| POST | `/api/QuanLyPhim/ThemPhimUploadHinh` | Authorization, `Content-Type: multipart/form-data` |

```js
let formData = new FormData();
formData.append("tenPhim", tenPhim);
formData.append("trailer", trailer);
formData.append("moTa", moTa);
formData.append("maNhom", "GP01");
formData.append("ngayKhoiChieu", ngayKhoiChieu);
formData.append("sapChieu", sapChieu);
formData.append("dangChieu", dangChieu);
formData.append("hot", hot);
formData.append("danhGia", danhGia);
formData.append("File", hinhAnhFile); // object File thực, không phải blobFile string
```

### 3.3 Sửa phim
**Path:** `/admin/films/edit/:idFilm`

- Giống hệt form Thêm phim nhưng **load sẵn dữ liệu phim hiện tại** vào input (kể cả preview ảnh cũ), có thêm field `maPhim`.
- Submit gửi `multipart/form-data` giống như thêm, nhưng append thêm `maPhim`.

**API:**
| Method | Endpoint | Auth |
|---|---|---|
| POST | `/api/QuanLyPhim/CapNhatPhimUpload` | Authorization, multipart/form-data |

> Nếu không đổi hình, một số API cho phép không cần bắt buộc `File`, cần kiểm tra thực tế trên swagger vì có thể yêu cầu field bắt buộc.

### 3.4 Xóa phim
**API:**
| Method | Endpoint | Auth |
|---|---|---|
| DELETE | `/api/QuanLyPhim/XoaPhim?MaPhim={id}` | Authorization |

- Thường có confirm (modal/window.confirm) trước khi gọi API xóa.
- Nếu phim đang có lịch chiếu, API có thể trả lỗi (400) — cần bắt lỗi và hiển thị thông báo (VD dùng toast/notification).

### 3.5 Tạo lịch chiếu
**Path:** `/admin/films/showtime/:idFilm` (điều hướng từ trang Quản lý phim bằng `<NavLink/>` khi bấm icon lịch)

**Bố cục:**
1. Poster + tên phim đang thao tác (chỉ hiển thị, lấy từ state truyền qua router hoặc gọi lại API chi tiết phim)
2. Form:
   - Select "Hệ thống rạp" → khi chọn, load API cụm rạp theo hệ thống rạp đó
   - Select "Cụm rạp" (phụ thuộc hệ thống rạp đã chọn)
   - DatePicker "Ngày chiếu giờ chiếu"
   - Input "Giá vé"
   - Nút "Tạo lịch chiếu"

**API:**
| Method | Endpoint | Ghi chú |
|---|---|---|
| GET | `/api/QuanLyRap/LayThongTinHeThongRap` | load list hệ thống rạp cho select đầu tiên |
| GET | `/api/QuanLyRap/LayThongTinCumRapTheoHeThong?maHeThongRap={ma}` | load khi user đổi select hệ thống rạp |
| POST | `/api/QuanLyDatVe/TaoLichChieu` (Authorization) | tạo lịch chiếu mới |

**Body tạo lịch chiếu:**
```json
{
  "maPhim": 0,
  "ngayChieuGioChieu": "string",
  "maRap": 0,
  "giaVe": 0
}
```
> `ngayChieuGioChieu` cần đúng format API yêu cầu (thường `dd/MM/yyyy hh:mm:ss`) — nên kiểm tra bằng swagger trước khi submit thật.

### 3.6 Quản lý người dùng *(phần bài tập tự làm)*
**Path:** `/admin/quanlynguoidung/index`

**Bố cục:** thanh tìm kiếm (theo tài khoản hoặc họ tên) + bảng: STT | Tài khoản | Mật khẩu | Họ tên | Email | Số điện thoại | Thao tác (Sửa/Xóa) + phân trang

**API:**
| Method | Endpoint | Ghi chú |
|---|---|---|
| GET | `/api/QuanLyNguoiDung/LayDanhSachNguoiDung?MaNhom=GP01` | danh sách toàn bộ |
| GET | `/api/QuanLyNguoiDung/LayDanhSachNguoiDung?MaNhom=GP01&tuKhoa={tu_khoa}` | tìm kiếm theo từ khoá |
| DELETE | `/api/QuanLyNguoiDung/XoaNguoiDung?TaiKhoan={taiKhoan}` | xóa người dùng (suy ra từ pattern chung của API, cần verify trên swagger) |

### 3.7 Thêm / Sửa người dùng *(phần bài tập tự làm)*
**Path:** `/admin/quanlynguoidung/add` và `/admin/quanlynguoidung/edit/:taiKhoan`

**Form fields:** Tài khoản, Mật khẩu, Họ tên, Email, Số điện thoại, Select "Loại người dùng" (load từ API riêng)

**API:**
| Method | Endpoint | Ghi chú |
|---|---|---|
| GET | `/api/QuanLyNguoiDung/LayDanhSachLoaiNguoiDung` (Authorization) | data cho select "Loại người dùng" |
| POST | `/api/QuanLyNguoiDung/ThemNguoiDung` (Authorization) | trang Thêm |
| POST | `/api/QuanLyNguoiDung/CapNhatThongTinNguoiDung` (Authorization) | trang Sửa (load sẵn dữ liệu user được chọn từ danh sách, KHÔNG gọi API riêng để lấy 1 user — lấy từ item đã có trong danh sách/redux) |

Body chung:
```json
{
  "taiKhoan": "string",
  "matKhau": "string",
  "email": "string",
  "soDt": "string",
  "maNhom": "string",
  "maLoaiNguoiDung": "string",
  "hoTen": "string"
}
```

---

## 4. CẤU TRÚC REDUX (THUNK) THEO FEATURE

> Slice/reducer **nằm ngay trong thư mục feature tương ứng** (`features/<feature>/<feature>Slice.js`), không gộp chung vào 1 thư mục `redux/reducers` nữa. `app/store.js` chỉ import + `combineReducers` lại. Lưu ý: `movie` và `cinema` là 2 slice riêng dù cùng phục vụ HomePage/MovieDetailPage, vì đó là 2 domain dữ liệu khác nhau (thông tin phim vs. thông tin rạp/lịch chiếu) — tách slice theo domain, không theo page.

```js
// app/store.js
import { legacy_createStore as createStore, combineReducers, applyMiddleware, compose } from "redux";
import { thunk } from "redux-thunk";

import movieReducer from "../features/movie/movieSlice";
import cinemaReducer from "../features/cinema/cinemaSlice";
import bookingReducer from "../features/booking/bookingSlice";
import authReducer from "../features/auth/authSlice";
import accountReducer from "../features/account/accountSlice";
import adminMovieReducer from "../features/admin/movie/adminMovieSlice";
import adminShowtimeReducer from "../features/admin/showtime/adminShowtimeSlice";
import adminUserReducer from "../features/admin/user/adminUserSlice";

const rootReducer = combineReducers({
  movie: movieReducer,
  cinema: cinemaReducer,
  booking: bookingReducer,
  auth: authReducer,
  account: accountReducer,
  adminMovie: adminMovieReducer,
  adminShowtime: adminShowtimeReducer,
  adminUser: adminUserReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
```

### 4.1 Feature `movie` — `features/movie/movieSlice.js`
- **State:** `movieList`, `bannerList`, `movieInfo` (dùng ở MovieDetailPage), `isLoading`
- **Thunk actions:** `fetchMovieListThunk`, `fetchBannerThunk`, `fetchMovieInfoThunk(maPhim)`
- Dùng ở cả `HomePage` (movieList, bannerList) lẫn `MovieDetailPage` (movieInfo).

### 4.2 Feature `cinema` — `features/cinema/cinemaSlice.js`
- **State:** `cinemaSystemList`, `cinemaSystemSchedule`, `selectedCinemaSystem`, `movieScheduleByCluster`, `cinemaClusterList`
- **Thunk actions:**
  - `fetchCinemaSystemThunk` — dùng ở HomePage & Admin ShowtimeCreatePage
  - `fetchCinemaSystemScheduleThunk(maHeThongRap)` — dùng ở HomePage
  - `fetchMovieScheduleThunk(maPhim)` — dùng ở MovieDetailPage
  - `fetchCinemaClusterThunk(maHeThongRap)` — dùng ở Admin ShowtimeCreatePage
- Đây là slice **dùng chung nhiều page nhất** — đúng tinh thần feature-based: gom logic lịch chiếu/rạp về 1 chỗ duy nhất thay vì lặp lại ở từng page.

### 4.3 Feature `booking` — `features/booking/bookingSlice.js`
- **State:** `ticketRoomInfo`, `selectedSeats`, `totalPrice`
- **Actions thường (không cần thunk):** `SELECT_SEAT`, `UNSELECT_SEAT`, `RESET_SEATS`
- **Thunk actions:** `fetchTicketRoomThunk(maLichChieu)`, `bookTicketThunk(payload)` → gọi `showSuccess`/`showError` (toast) trong `then/catch`

### 4.4 Feature `auth` — `features/auth/authSlice.js`
- **State:** `userInfo`, `isLogin`
- **Thunk actions:** `loginThunk`, `registerThunk`
- **Actions thường:** `LOGOUT` (clear `localStorage` + reset state)

### 4.5 Feature `account` — `features/account/accountSlice.js`
- **State:** `accountInfo`, `bookingHistory`
- **Thunk actions:** `fetchAccountInfoThunk`, `updateAccountThunk`, `fetchBookingHistoryThunk`

### 4.6 Feature `admin/movie` — `features/admin/movie/adminMovieSlice.js`
- **State:** `filmList`, `currentFilm` (dùng khi sửa), `searchKeyword`
- **Thunk actions:** `fetchAdminMovieListThunk`, `addMovieThunk`, `editMovieThunk`, `deleteMovieThunk`

### 4.7 Feature `admin/showtime` — `features/admin/showtime/adminShowtimeSlice.js`
- **State:** `selectedFilmForShowtime` (thông tin phim đang tạo lịch chiếu)
- **Thunk actions:** `createShowtimeThunk`
- Select hệ thống rạp/cụm rạp **đọc trực tiếp từ `cinemaSlice`** (dispatch `fetchCinemaSystemThunk`/`fetchCinemaClusterThunk` của feature `cinema`), không tạo state trùng lặp trong `adminShowtimeSlice`.

### 4.8 Feature `admin/user` — `features/admin/user/adminUserSlice.js`
- **State:** `userList`, `userTypeList`, `searchKeyword`, `currentPage`
- **Thunk actions:** `fetchUserListThunk`, `fetchUserTypeThunk`, `addUserThunk`, `editUserThunk`, `deleteUserThunk`

> Toast: nên gọi `showSuccess`/`showError` (từ `utils/toastHelper.js`) **bên trong mỗi thunk**, ngay sau khi API resolve/reject — không xử lý toast riêng lẻ trong từng component, để tránh lặp code.

---
## 5. BẢNG TỔNG HỢP TOÀN BỘ API (theo domain thật)

Domain gốc: `https://movienew.cybersoft.edu.vn/api`

| # | Method | Endpoint | Auth cần | Dùng ở trang |
|---|---|---|---|---|
| 1 | GET | `/QuanLyPhim/LayDanhSachBanner` | Không | Trang chủ |
| 2 | GET | `/QuanLyPhim/LayDanhSachPhim?MaNhom=GP01` | Không | Trang chủ, Admin |
| 3 | GET | `/QuanLyRap/LayThongTinHeThongRap` | Không | Trang chủ, Tạo lịch chiếu |
| 4 | GET | `/QuanLyRap/LayThongTinLichChieuHeThongRap?maHeThongRap=...` | Không | Trang chủ |
| 5 | GET | `/QuanLyRap/LayThongTinLichChieuPhim?MaPhim=...` | Không | Chi tiết phim |
| 6 | GET | `/QuanLyRap/LayThongTinCumRapTheoHeThong?maHeThongRap=...` | Không | Tạo lịch chiếu |
| 7 | GET | `/QuanLyDatVe/LayDanhSachPhongVe?MaLichChieu=...` | Không | Trang đặt vé |
| 8 | POST | `/QuanLyDatVe/DatVe` | Có | Trang đặt vé |
| 9 | POST | `/QuanLyDatVe/TaoLichChieu` | Có | Admin – Tạo lịch chiếu |
| 10 | POST | `/QuanLyDatVe/LayDanhSachPhongVeDaDat` | Có | Thông tin cá nhân (lịch sử) |
| 11 | POST | `/QuanLyNguoiDung/DangKy` | Không | Đăng ký |
| 12 | POST | `/QuanLyNguoiDung/DangNhap` | Không | Đăng nhập |
| 13 | POST | `/QuanLyNguoiDung/ThongTinTaiKhoan` | Có | Thông tin cá nhân |
| 14 | PUT | `/QuanLyNguoiDung/CapNhatThongTinNguoiDung` | Có | Thông tin cá nhân, Admin sửa user |
| 15 | POST | `/QuanLyPhim/ThemPhimUploadHinh` | Có | Admin – Thêm phim |
| 16 | POST | `/QuanLyPhim/CapNhatPhimUpload` | Có | Admin – Sửa phim |
| 17 | DELETE | `/QuanLyPhim/XoaPhim?MaPhim=...` | Có | Admin – Xóa phim |
| 18 | GET | `/QuanLyNguoiDung/LayDanhSachNguoiDung?MaNhom=GP01&tuKhoa=...` | Không | Admin – Quản lý user |
| 19 | GET | `/QuanLyNguoiDung/LayDanhSachLoaiNguoiDung` | Có | Admin – Thêm/Sửa user |
| 20 | POST | `/QuanLyNguoiDung/ThemNguoiDung` | Có | Admin – Thêm user |

> ⚠️ Danh sách trên tổng hợp lại theo mẫu trong slide gốc. Vì slide có ghi rõ "Domain: domain.xyz có thể thay đổi trong tương lai", bạn **nên mở trực tiếp Swagger** (`https://movienew.cybersoft.edu.vn/swagger/index.html`) để đối chiếu chính xác tên tham số, method, và các endpoint có thể đã bổ sung/đổi tên (ví dụ API xóa người dùng không xuất hiện rõ ràng trong slide, cần lấy đúng tên từ swagger thực tế).

---

## 6. MỘT SỐ LƯU Ý KỸ THUẬT TỪ TÀI LIỆU GỐC

1. **Quy trình làm việc chuẩn:** hiểu rõ nghiệp vụ → dựng giao diện tĩnh đầy đủ (HTML/JSX + Tailwind) → xác định "state" (giá trị thay đổi theo tương tác người dùng) và nơi lưu trữ (Redux/localStorage) → code xử lý sự kiện thay đổi state.
2. **Nguyên tắc UI:** khoảng cách/padding cố định và nhất quán; chỉ dùng 1 font (đề xuất Roboto) cho toàn site; không trộn lẫn tiếng Anh — tiếng Việt trong cùng 1 khối nội dung; bố trí input hợp lý, hạn chế sinh scroll ngang/dọc không cần thiết. Tham khảo phối màu: `https://material.io/tools/color/#!/`.
3. **Kỹ năng debug khi gặp lỗi:**
   - Nếu lỗi do thư viện: tạo project/file độc lập, copy đúng demo mẫu của thư viện, chạy OK 100% rồi mới thay dữ liệu thật vào để dễ so sánh nguyên nhân.
   - Nếu lỗi do code tự viết: debug bằng `console.log` từng bước, comment tạm code để cô lập nguyên nhân.
   - Nếu bí quá mới hỏi người khác — kèm sẵn từ khóa cụ thể để tự search trước.
4. **Upload hình ảnh:** luôn dùng `FormData`, field ảnh tên là `File`, gắn `Content-Type: multipart/form-data` (axios thường tự set nếu bạn không set cứng `application/json`).
5. **Toàn bộ API có `(Authorization)`** cần user đã đăng nhập (có `accessToken` hợp lệ) — nếu gọi mà thiếu token sẽ trả lỗi 401, cần xử lý bắt lỗi để redirect về trang đăng nhập.

---

## 7. GỢI Ý THỨ TỰ LÀM DỰ ÁN (ROADMAP)

1. Setup project (CRA/Vite) + Tailwind + Redux Toolkit (hoặc redux thuần + thunk) + React Router + Axios config
2. Layout chung: Header, Footer, Sidebar Admin
3. Trang chủ (banner + danh sách phim + lịch chiếu theo hệ thống rạp)
4. Trang chi tiết phim
5. Đăng ký / Đăng nhập (song song làm để có token test các API cần Authorization)
6. Trang đặt vé (sơ đồ ghế) + đặt vé
7. Thông tin cá nhân (cập nhật + lịch sử đặt vé)
8. Admin: danh sách phim → thêm phim → sửa phim → xóa phim → tạo lịch chiếu
9. Bài tập mở rộng: Quản lý người dùng (danh sách/tìm kiếm/thêm/sửa/xóa) ở trang admin

---

## 8. HƯỚNG DẪN CHI TIẾT: IMPLEMENT AUTH VÀ QUẢN LÝ USER

### 8.0 Trước tiên: 2 khái niệm "quản lý user" KHÁC NHAU trong dự án

| | `features/auth` | `features/admin/user` |
|---|---|---|
| Trả lời câu hỏi | "Ai đang đăng nhập? Quyền gì?" | "Danh sách toàn bộ user trong hệ thống là ai, CRUD ra sao?" |
| Dùng ở | Header, `PrivateRoute`, `AdminRoute`, mọi nơi cần biết trạng thái đăng nhập | Trang `/admin/quanlynguoidung` (chỉ Admin) |
| State lưu | `userInfo` (chính user hiện tại) + `accessToken` | `userList` (toàn bộ user), `searchKeyword`, `currentPage` |
| Vòng đời | Sống suốt phiên làm việc, persist vào `localStorage` | Chỉ tồn tại khi đang ở trang quản trị user |

Ngoài ra còn có `features/account` (đã nói ở mục trước) — nơi **chính user tự sửa thông tin của mình** (khác với admin sửa thông tin của người khác). 3 chỗ này gọi chung 1 số API (`CapNhatThongTinNguoiDung`) nhưng **tách state riêng** vì ngữ cảnh dùng khác nhau.

### 8.1 Cài thêm thư viện

```bash
npm install react-redux redux redux-thunk react-router-dom axios react-toastify
npm install react-hook-form yup @hookform/resolvers
```

- `react-hook-form` + `yup`: quản lý form + validate (đăng ký, đăng nhập, thêm/sửa user, thêm/sửa phim...) — tránh viết `useState` tay cho từng field.

---

### 8.2 `features/auth/authSlice.js` — quản lý người dùng đang đăng nhập

```js
import authApi from "./authApi";
import { showSuccess, showError } from "../../utils/toastHelper";

// ---- Action Types ----
export const AUTH_ACTION_TYPES = {
  SET_LOADING: "AUTH/SET_LOADING",
  LOGIN_SUCCESS: "AUTH/LOGIN_SUCCESS",
  UPDATE_USER_INFO: "AUTH/UPDATE_USER_INFO", // đồng bộ khi user tự cập nhật hồ sơ ở trang Account
  LOGOUT: "AUTH/LOGOUT",
};

// ---- Initial state: đọc lại từ localStorage để không bị "chớp" mất trạng thái đăng nhập khi F5 ----
const userLocal = JSON.parse(localStorage.getItem("USER_LOGIN")) || null;

const initialState = {
  userInfo: userLocal, // { taiKhoan, hoTen, email, soDt, maLoaiNguoiDung, accessToken, ... }
  isLogin: !!userLocal,
  isLoading: false,
};

// ---- Reducer ----
export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case AUTH_ACTION_TYPES.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case AUTH_ACTION_TYPES.LOGIN_SUCCESS:
      return { ...state, userInfo: action.payload, isLogin: true, isLoading: false };

    case AUTH_ACTION_TYPES.UPDATE_USER_INFO:
      return { ...state, userInfo: { ...state.userInfo, ...action.payload } };

    case AUTH_ACTION_TYPES.LOGOUT:
      return { ...state, userInfo: null, isLogin: false };

    default:
      return state;
  }
}

// ---- Actions thường ----
const setLoading = (value) => ({ type: AUTH_ACTION_TYPES.SET_LOADING, payload: value });
const loginSuccess = (user) => ({ type: AUTH_ACTION_TYPES.LOGIN_SUCCESS, payload: user });

export const updateUserInfoAction = (partialUser) => ({
  type: AUTH_ACTION_TYPES.UPDATE_USER_INFO,
  payload: partialUser,
});

export const logoutAction = () => (dispatch) => {
  localStorage.removeItem("USER_LOGIN");
  dispatch({ type: AUTH_ACTION_TYPES.LOGOUT });
};

// ---- Thunks ----
export const loginThunk = (formValues, navigate) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const { data } = await authApi.login(formValues);
    localStorage.setItem("USER_LOGIN", JSON.stringify(data.content));
    dispatch(loginSuccess(data.content));
    showSuccess("Đăng nhập thành công!");

    // Điều hướng theo quyền
    if (data.content.maLoaiNguoiDung === "QuanTri") {
      navigate("/admin/films");
    } else {
      navigate("/");
    }
  } catch (err) {
    dispatch(setLoading(false));
    showError(err?.response?.data?.content || "Sai tài khoản hoặc mật khẩu!");
  }
};

export const registerThunk = (formValues, navigate) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    await authApi.register(formValues);
    dispatch(setLoading(false));
    showSuccess("Đăng ký thành công! Vui lòng đăng nhập.");
    navigate("/dangnhap");
  } catch (err) {
    dispatch(setLoading(false));
    showError(err?.response?.data?.content || "Đăng ký thất bại, tài khoản có thể đã tồn tại!");
  }
};
```

> ⚠️ Điểm hay bị quên: sau khi đăng nhập, **`data.content` chứa cả `accessToken`** — phải lưu nguyên object này vào `localStorage` (không chỉ lưu token riêng lẻ) vì `axiosConfig.js` (mục 0) đọc `accessToken` từ đúng key `USER_LOGIN` này.

---

### 8.3 `features/auth/authApi.js`

```js
import http from "../../services/axiosConfig";

const authApi = {
  login: (data) => http.post("/QuanLyNguoiDung/DangNhap", data),
  register: (data) => http.post("/QuanLyNguoiDung/DangKy", data),
};

export default authApi;
```

---

### 8.4 Common components dùng cho form (`InputField`, `Button`)

```jsx
// components/common/InputField/InputField.jsx
export default function InputField({ label, type = "text", error, register, ...rest }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <input
        type={type}
        {...register}
        {...rest}
        className={`border rounded-md px-3 py-2 outline-none focus:ring-2 ${
          error ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"
        }`}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
```

```jsx
// components/common/Button/Button.jsx
export default function Button({ children, variant = "primary", loading, className = "", ...rest }) {
  const base = "px-4 py-2 rounded-md font-medium transition disabled:opacity-60";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} disabled={loading} {...rest}>
      {loading ? "Đang xử lý..." : children}
    </button>
  );
}
```

`InputField` được thiết kế để dùng trực tiếp với `react-hook-form`: `register={register("taiKhoan")}` trả về object `{name, onChange, onBlur, ref}`, spread thẳng vào `<input>`.

---

### 8.5 `features/auth/components/LoginForm.jsx` & `RegisterForm.jsx`

```jsx
// features/auth/components/LoginForm.jsx
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginThunk } from "../authSlice";
import InputField from "../../../components/common/InputField/InputField";
import Button from "../../../components/common/Button/Button";

const schema = yup.object({
  taiKhoan: yup.string().required("Vui lòng nhập tài khoản"),
  matKhau: yup.string().required("Vui lòng nhập mật khẩu").min(6, "Tối thiểu 6 ký tự"),
});

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = (values) => dispatch(loginThunk(values, navigate));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-sm">
      <InputField label="Tài khoản" register={register("taiKhoan")} error={errors.taiKhoan?.message} />
      <InputField label="Mật khẩu" type="password" register={register("matKhau")} error={errors.matKhau?.message} />
      <Button type="submit" loading={isSubmitting} className="w-full">Đăng nhập</Button>
      <p className="text-sm text-center">
        Chưa có tài khoản? <Link to="/dangky" className="text-blue-600">Đăng ký</Link>
      </p>
    </form>
  );
}
```

```jsx
// features/auth/components/RegisterForm.jsx
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerThunk } from "../authSlice";
import InputField from "../../../components/common/InputField/InputField";
import Button from "../../../components/common/Button/Button";

const schema = yup.object({
  taiKhoan: yup.string().required("Vui lòng nhập tài khoản"),
  matKhau: yup.string().required("Vui lòng nhập mật khẩu").min(6, "Tối thiểu 6 ký tự"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("matKhau")], "Mật khẩu nhập lại không khớp")
    .required("Vui lòng nhập lại mật khẩu"),
  hoTen: yup.string().required("Vui lòng nhập họ tên"),
  email: yup.string().email("Email không đúng định dạng").required("Vui lòng nhập email"),
  soDt: yup
    .string()
    .matches(/^[0-9]{9,11}$/, "Số điện thoại không hợp lệ")
    .required("Vui lòng nhập số điện thoại"),
});

export default function RegisterForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = (values) => {
    const { confirmPassword, ...payload } = values; // bỏ field chỉ dùng FE
    dispatch(registerThunk({ ...payload, maNhom: "GP01" }, navigate));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-sm">
      <InputField label="Tài khoản" register={register("taiKhoan")} error={errors.taiKhoan?.message} />
      <InputField label="Mật khẩu" type="password" register={register("matKhau")} error={errors.matKhau?.message} />
      <InputField label="Nhập lại mật khẩu" type="password" register={register("confirmPassword")} error={errors.confirmPassword?.message} />
      <InputField label="Họ tên" register={register("hoTen")} error={errors.hoTen?.message} />
      <InputField label="Email" register={register("email")} error={errors.email?.message} />
      <InputField label="Số điện thoại" register={register("soDt")} error={errors.soDt?.message} />
      <Button type="submit" loading={isSubmitting} className="w-full">Đăng ký</Button>
      <p className="text-sm text-center">
        Đã có tài khoản? <Link to="/dangnhap" className="text-blue-600">Đăng nhập</Link>
      </p>
    </form>
  );
}
```

### 8.6 `pages/LoginPage.jsx` / `pages/RegisterPage.jsx` (lớp mỏng)

```jsx
// pages/LoginPage.jsx
import LoginForm from "../features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <LoginForm />
    </div>
  );
}
```
`RegisterPage.jsx` viết tương tự, chỉ đổi `<RegisterForm />`.

---

### 8.7 Header — đổi giao diện theo trạng thái đăng nhập

```jsx
// layouts/ClientLayout/Header.jsx
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutAction } from "../../features/auth/authSlice";

export default function Header() {
  const { isLogin, userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutAction());
    navigate("/");
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 shadow">
      <Link to="/" className="font-bold text-xl">MovieHands</Link>

      <nav className="flex items-center gap-4">
        {isLogin ? (
          <div className="relative group">
            <button className="flex items-center gap-2">Chào, {userInfo?.hoTen}</button>
            <div className="absolute right-0 hidden group-hover:block bg-white shadow-md rounded-md mt-2 w-44 z-10">
              <Link to="/thongtincanhan" className="block px-4 py-2 hover:bg-gray-50">Thông tin cá nhân</Link>
              <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-50">
                Đăng xuất
              </button>
            </div>
          </div>
        ) : (
          <>
            <Link to="/dangky">Đăng ký</Link>
            <Link to="/dangnhap">Đăng nhập</Link>
          </>
        )}
      </nav>
    </header>
  );
}
```

---

### 8.8 Route guard: `PrivateRoute` & `AdminRoute`

```jsx
// routes/PrivateRoute.jsx
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
  const { isLogin } = useSelector((state) => state.auth);
  return isLogin ? <Outlet /> : <Navigate to="/dangnhap" replace />;
}
```

```jsx
// routes/AdminRoute.jsx
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {
  const { isLogin, userInfo } = useSelector((state) => state.auth);
  if (!isLogin) return <Navigate to="/dangnhap" replace />;
  if (userInfo?.maLoaiNguoiDung !== "QuanTri") return <Navigate to="/" replace />;
  return <Outlet />;
}
```

```jsx
// routes/AppRoutes.jsx (trích đoạn cách dùng)
<Routes>
  <Route element={<ClientLayout />}>
    <Route path="/" element={<HomePage />} />
    <Route path="/chitietphim/:maPhim" element={<MovieDetailPage />} />
    <Route path="/dangky" element={<RegisterPage />} />
    <Route path="/dangnhap" element={<LoginPage />} />

    <Route element={<PrivateRoute />}>
      <Route path="/chitietphongve/:maLichChieu" element={<TicketRoomPage />} />
      <Route path="/thongtincanhan" element={<AccountPage />} />
    </Route>
  </Route>

  <Route element={<AdminRoute />}>
    <Route path="/admin" element={<AdminLayout />}>
      <Route path="films" element={<FilmManagementPage />} />
      <Route path="films/addnew" element={<FilmAddNewPage />} />
      <Route path="films/edit/:idFilm" element={<FilmEditPage />} />
      <Route path="films/showtime/:idFilm" element={<ShowtimeCreatePage />} />
      <Route path="quanlynguoidung/index" element={<UserManagementPage />} />
    </Route>
  </Route>

  <Route path="*" element={<NotFoundPage />} />
</Routes>
```

> Lưu ý: trang đặt vé (`TicketRoomPage`) mình xếp vào `PrivateRoute` vì API `DatVe` bắt buộc `Authorization` — cho khách chưa đăng nhập vào xem sơ đồ ghế thì được, nhưng an toàn nhất là chặn từ route luôn, tránh việc bấm "Đặt vé" bị lỗi 401 khó hiểu.

---

### 8.9 Xử lý token hết hạn (401) — tự động đăng xuất

Interceptor response cần truy cập được `store` để `dispatch`, nhưng import trực tiếp `store` vào `axiosConfig.js` dễ gây **circular import** (`store` → `authSlice` → `authApi` → `axiosConfig` → `store`...). Cách an toàn: dùng "dependency injection" — `store.js` tự "tiêm" chính nó vào `axiosConfig.js` sau khi khởi tạo xong.

```js
// services/axiosConfig.js
import axios from "axios";

const http = axios.create({
  baseURL: "https://movienew.cybersoft.edu.vn/api",
  headers: { TokenCybersoft: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
});

http.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("USER_LOGIN"));
  if (user?.accessToken) config.headers.Authorization = `Bearer ${user.accessToken}`;
  return config;
});

// ---- injection để tránh circular import với store ----
let storeRef;
export const injectStore = (_store) => { storeRef = _store; };

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && storeRef) {
      localStorage.removeItem("USER_LOGIN");
      storeRef.dispatch({ type: "AUTH/LOGOUT" }); // dispatch action type thô, KHÔNG import authSlice ở đây
      window.location.href = "/dangnhap";
    }
    return Promise.reject(error);
  }
);

export default http;
```

```js
// app/store.js — sau khi tạo store xong, "tiêm" ngược lại cho axiosConfig
import { injectStore } from "../services/axiosConfig";
// ... (phần combineReducers/createStore như mục 4)
injectStore(store);
```

---

### 8.10 `features/account` — user tự cập nhật thông tin của chính mình

```js
// features/account/accountSlice.js
import accountApi from "./accountApi";
import { updateUserInfoAction } from "../auth/authSlice"; // đồng bộ ngược lại Header
import { showSuccess, showError } from "../../utils/toastHelper";

const initialState = { accountInfo: null, bookingHistory: [], isLoading: false };

export default function accountReducer(state = initialState, action) {
  switch (action.type) {
    case "ACCOUNT/SET_INFO":
      return { ...state, accountInfo: action.payload };
    case "ACCOUNT/SET_HISTORY":
      return { ...state, bookingHistory: action.payload };
    default:
      return state;
  }
}

export const fetchAccountInfoThunk = () => async (dispatch) => {
  try {
    const { data } = await accountApi.getInfo();
    dispatch({ type: "ACCOUNT/SET_INFO", payload: data.content });
  } catch (err) {
    showError("Không tải được thông tin tài khoản!");
  }
};

export const updateAccountThunk = (formValues) => async (dispatch) => {
  try {
    const { data } = await accountApi.updateInfo(formValues);
    dispatch({ type: "ACCOUNT/SET_INFO", payload: data.content });
    dispatch(updateUserInfoAction(data.content)); // để Header cập nhật tên ngay, không cần F5
    showSuccess("Cập nhật thông tin thành công!");
  } catch (err) {
    showError(err?.response?.data?.content || "Cập nhật thất bại!");
  }
};

export const fetchBookingHistoryThunk = () => async (dispatch) => {
  try {
    const { data } = await accountApi.getBookingHistory();
    dispatch({ type: "ACCOUNT/SET_HISTORY", payload: data.content });
  } catch (err) {
    showError("Không tải được lịch sử đặt vé!");
  }
};
```

```js
// features/account/accountApi.js
import http from "../../services/axiosConfig";

const accountApi = {
  getInfo: () => http.post("/QuanLyNguoiDung/ThongTinTaiKhoan"),
  updateInfo: (data) => http.put("/QuanLyNguoiDung/CapNhatThongTinNguoiDung", data),
  getBookingHistory: () => http.post("/QuanLyDatVe/LayDanhSachPhongVeDaDat", { maNhom: "GP01" }),
};

export default accountApi;
```

> Điểm quan trọng: sau khi cập nhật thành công, `accountSlice` dispatch thêm `updateUserInfoAction` (action của **`authSlice`**) để đồng bộ tên hiển thị trên Header — đây là ví dụ thực tế cho việc 2 slice khác nhau nhưng cùng phản ánh 1 user, cần chủ động đồng bộ chứ Redux không tự làm giúp.

---

### 8.11 `features/admin/user` — Admin quản lý toàn bộ danh sách user

```js
// features/admin/user/adminUserApi.js
import http from "../../../services/axiosConfig";

const adminUserApi = {
  getUserList: (tuKhoa = "") =>
    http.get(`/QuanLyNguoiDung/LayDanhSachNguoiDung?MaNhom=GP01&tuKhoa=${tuKhoa}`),
  getUserTypeList: () => http.get("/QuanLyNguoiDung/LayDanhSachLoaiNguoiDung"),
  addUser: (data) => http.post("/QuanLyNguoiDung/ThemNguoiDung", data),
  editUser: (data) => http.post("/QuanLyNguoiDung/CapNhatThongTinNguoiDung", data),
  deleteUser: (taiKhoan) => http.delete(`/QuanLyNguoiDung/XoaNguoiDung?TaiKhoan=${taiKhoan}`),
};

export default adminUserApi;
```

```js
// features/admin/user/adminUserSlice.js
import adminUserApi from "./adminUserApi";
import { showSuccess, showError } from "../../../utils/toastHelper";

const initialState = { userList: [], userTypeList: [], searchKeyword: "", isLoading: false };

export default function adminUserReducer(state = initialState, action) {
  switch (action.type) {
    case "ADMIN_USER/SET_LIST":
      return { ...state, userList: action.payload, isLoading: false };
    case "ADMIN_USER/SET_TYPE_LIST":
      return { ...state, userTypeList: action.payload };
    case "ADMIN_USER/SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

export const fetchUserListThunk = (tuKhoa = "") => async (dispatch) => {
  dispatch({ type: "ADMIN_USER/SET_LOADING", payload: true });
  try {
    const { data } = await adminUserApi.getUserList(tuKhoa);
    dispatch({ type: "ADMIN_USER/SET_LIST", payload: data.content });
  } catch (err) {
    dispatch({ type: "ADMIN_USER/SET_LOADING", payload: false });
    showError("Không tải được danh sách người dùng!");
  }
};

export const fetchUserTypeThunk = () => async (dispatch) => {
  try {
    const { data } = await adminUserApi.getUserTypeList();
    dispatch({ type: "ADMIN_USER/SET_TYPE_LIST", payload: data.content });
  } catch (err) {
    showError("Không tải được danh sách loại người dùng!");
  }
};

export const addUserThunk = (formValues, navigate) => async (dispatch) => {
  try {
    await adminUserApi.addUser(formValues);
    showSuccess("Thêm người dùng thành công!");
    navigate("/admin/quanlynguoidung/index");
  } catch (err) {
    showError(err?.response?.data?.content || "Thêm người dùng thất bại!");
  }
};

export const editUserThunk = (formValues, navigate) => async (dispatch) => {
  try {
    await adminUserApi.editUser(formValues);
    showSuccess("Cập nhật người dùng thành công!");
    navigate("/admin/quanlynguoidung/index");
  } catch (err) {
    showError(err?.response?.data?.content || "Cập nhật thất bại!");
  }
};

export const deleteUserThunk = (taiKhoan) => async (dispatch) => {
  try {
    await adminUserApi.deleteUser(taiKhoan);
    dispatch(fetchUserListThunk()); // load lại danh sách sau khi xoá
    showSuccess("Xoá người dùng thành công!");
  } catch (err) {
    showError(err?.response?.data?.content || "Xoá thất bại — user có thể đã có vé đặt trước đó!");
  }
};
```

**`UserTable.jsx`** — ví dụ tích hợp `ConfirmModal` chung khi xoá:

```jsx
// features/admin/user/components/UserTable.jsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteUserThunk } from "../adminUserSlice";
import ConfirmModal from "../../../../components/common/Modal/ConfirmModal";

export default function UserTable() {
  const { userList } = useSelector((state) => state.adminUser);
  const dispatch = useDispatch();
  const [userToDelete, setUserToDelete] = useState(null); // taiKhoan đang chờ xác nhận xoá

  const handleConfirmDelete = () => {
    dispatch(deleteUserThunk(userToDelete));
    setUserToDelete(null);
  };

  return (
    <>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">STT</th>
            <th className="p-2">Tài khoản</th>
            <th className="p-2">Họ tên</th>
            <th className="p-2">Email</th>
            <th className="p-2">SĐT</th>
            <th className="p-2">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {userList.map((user, index) => (
            <tr key={user.taiKhoan} className="border-b">
              <td className="p-2">{index + 1}</td>
              <td className="p-2">{user.taiKhoan}</td>
              <td className="p-2">{user.hoTen}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.soDt}</td>
              <td className="p-2 flex gap-2">
                <Link to={`/admin/quanlynguoidung/edit/${user.taiKhoan}`} className="text-blue-600">Sửa</Link>
                <button onClick={() => setUserToDelete(user.taiKhoan)} className="text-red-600">Xoá</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmModal
        isOpen={!!userToDelete}
        message={`Bạn chắc chắn muốn xoá người dùng "${userToDelete}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setUserToDelete(null)}
      />
    </>
  );
}
```

> Trang `UserEditPage` **không gọi API riêng** để lấy 1 user — theo đúng slide gốc, lấy sẵn item từ `userList` trong Redux (tìm theo `taiKhoan` lấy từ `useParams()`), rồi đổ vào `defaultValues` của `UserForm`. Nếu user F5 thẳng vào trang edit (Redux rỗng), cần tự thêm điều kiện fallback: nếu không tìm thấy trong `userList` thì `dispatch(fetchUserListThunk())` trước rồi mới tìm lại.

---

### 8.12 Checklist test luồng Auth end-to-end

- [ ] Đăng ký tài khoản mới → nhận toast thành công → tự chuyển sang `/dangnhap`
- [ ] Đăng ký tài khoản đã tồn tại → nhận toast lỗi, không crash trắng trang
- [ ] Đăng nhập đúng → Header đổi sang tên user, `localStorage` có `USER_LOGIN`
- [ ] Đăng nhập sai → toast lỗi, không lưu gì vào `localStorage`
- [ ] F5 lại trang sau khi đăng nhập → **không bị đăng xuất** (nhờ đọc `localStorage` ở `initialState`)
- [ ] Chưa đăng nhập mà gõ thẳng URL `/thongtincanhan` hoặc `/chitietphongve/123` → bị đá về `/dangnhap`
- [ ] Đăng nhập bằng tài khoản thường mà gõ thẳng URL `/admin/films` → bị đá về `/`
- [ ] Đăng nhập bằng tài khoản `QuanTri` → vào được toàn bộ `/admin/*`
- [ ] Sửa thông tin ở trang Account → tên trên Header cập nhật ngay không cần F5
- [ ] Token hết hạn / bị sửa sai (test bằng cách sửa tay `localStorage`) → gọi API bất kỳ trả 401 → tự động đăng xuất + redirect `/dangnhap`
- [ ] Admin xoá 1 user → danh sách tự load lại, không cần F5 tay

---

*Tài liệu này được biên soạn lại chi tiết từ slide gốc để tiện tra cứu trong quá trình code. Trước khi build thật, hãy đối chiếu lại từng endpoint với Swagger để đảm bảo đúng tên tham số/method mới nhất.*
