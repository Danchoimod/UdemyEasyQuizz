Dưới đây là file **README.md** hoàn chỉnh, đã được chỉnh sửa lại cho chuyên nghiệp, rõ ràng, đẹp mắt và phù hợp để đăng công khai trên GitHub (hoặc chia sẻ với bạn bè). Tôi đã giữ nguyên toàn bộ nội dung bạn cung cấp nhưng tối ưu ngôn từ, bố cục, thêm một số phần quan trọng (Disclaimer, License, Contributing…) để trông giống một repo开源 thực thụ.

```markdown
# 🚀 Udemy Easy Quizz - Lấy Đáp Án Quiz Udemy 100% Chính Xác

<p align="center">
  <img src="icon48.png" alt="Udemy Easy Quizz Icon" width="120"/>
</p>

<p align="center">
  <strong>Tiện ích mở rộng Chrome giúp bạn lấy toàn bộ đáp án đúng của bài Quiz trên Udemy chỉ trong 1 click!</strong>
</p>

<p align="center">
  <a href="#cài-đặt">Cài đặt</a> •
  <a href="#hướng-dẫn-sử-dụng">Hướng dẫn sử dụng</a> •
  <a href="#tính-năng">Tính năng</a> •
  <a href="#cấu-trúc-dự-án">Cấu trúc dự án</a>
</p>

## Giới Thiệu

**Udemy Easy Quizz** là một extension dành cho Google Chrome, giúp bạn lấy ngay toàn bộ đáp án chính xác 100% của bất kỳ bài kiểm tra (Quiz) nào trên Udemy mà không cần làm thủ công.

Tiện ích hoạt động bằng cách gọi trực tiếp API nội bộ của Udemy (`https://fpl.udemy.com/api-2.0/quizzes/...`) để trích xuất dữ liệu câu hỏi và đáp án đúng, sau đó hiển thị đẹp mắt ngay trong popup.

## ✨ Tính Năng Nổi Bật

- ✅ **Dò API chính xác 100%** – Lấy đáp án trực tiếp từ server Udemy  
- ✅ **Hỗ trợ phân trang (pagination)** – Quiz hàng trăm câu vẫn fetch hết  
- ✅ **Tự động lấy Quiz ID** từ URL hiện tại  
- ✅ **Hiển thị đáp án rõ ràng** – Đáp án đúng được tô sáng màu xanh  
- ✅ **Giao diện hiện đại** – Phong cách Windows 11 / macOS với hiệu ứng blur  
- ✅ **Console Script mạnh mẽ** – Dùng trực tiếp trong DevTools để export JSON, tạo cheat sheet…

## 🛠️ Cài Đặt (Chưa có trên Chrome Web Store)

1. Tải hoặc clone toàn bộ source code về máy  
   ```bash
   git clone https://github.com/username/udemy-easy-quizz.git
   ```
2. Mở Chrome → `chrome://extensions/`
3. Bật **Developer mode** (góc trên bên phải)
4. Nhấn **Load unpacked** → Chọn thư mục vừa tải về
5. Xong! Biểu tượng sẽ xuất hiện trên thanh công cụ

## 📖 Hướng Dẫn Sử Dụng

1. Vào bất kỳ bài Quiz nào trên Udemy  
   (URL có dạng `https://www.udemy.com/course/.../quiz/...`)
2. Click vào biểu tượng extension trên thanh công cụ
3. Popup hiện ra → Nhấn nút **FAB** lớn (biểu tượng ✨ auto_awesome)
4. Đợi vài giây → Toàn bộ câu hỏi + đáp án đúng sẽ hiển thị ngay lập tức!

> Tip: Bạn có thể bật tính năng **Auto Select** trong popup để extension tự động tick đáp án đúng trên trang Quiz.

## 📂 Cấu Trúc Dự Án

| File/Folder          | Mô tả                                                                 |
|----------------------|-----------------------------------------------------------------------|
| `manifest.json`      | Khai báo quyền, version, host_permissions (`*.udemy.com`)            |
| `background.js`      | Service Worker chính: fetch API, xử lý phân trang, gửi lệnh auto-select |
| `window.html` + `popup.js` | Giao diện popup hiện đại + logic hiển thị kết quả                   |
| `content-script.js`  | Script chạy trên trang Udemy để tự động chọn đáp án                   |
| `style.css`          | Thiết kế giao diện (blur backdrop, highlight xanh, phong cách Win11) |
| `scanAPI.js`         | Script console mạnh mẽ (dùng trong F12) để debug/export dữ liệu       |
| `icon*.png`          | Các biểu tượng extension 16/48/128px                                  |

## 💡 Sử Dụng Nâng Cao (Console Script)

Mở DevTools (F12) trên trang Quiz → Paste toàn bộ file `scanAPI.js` vào Console → Dùng các lệnh sau:

```js
// Lấy toàn bộ dữ liệu (tự động qua các trang)
await QuizPaginationFetcher.fetchAllPages();

// Chỉ hiển thị câu hỏi + đáp án đúng
QuizPaginationFetcher.displayAnswersOnly();

// Tạo bảng cheat sheet + copy vào clipboard
QuizPaginationFetcher.createCheatSheet();

// Export JSON đầy đủ + copy vào clipboard
QuizPaginationFetcher.exportJSON();
```

## ⚠️ Lưu Ý & Disclaimer

- Extension này chỉ phục vụ mục đích **học tập, nghiên cứu và kiểm tra kiến thức nhanh**.
- Vui lòng không sử dụng để gian lận trong các khóa học chính thức hoặc chứng chỉ có giá trị pháp lý.
- Udemy có thể thay đổi API bất kỳ lúc nào → Extension có thể tạm thời không hoạt động (sẽ được cập nhật ngay khi có thay đổi).

## 🤝 Đóng Góp

Rất hoan nghênh mọi pull request:
- Sửa lỗi khi Udemy cập nhật API
- Thêm tính năng mới (dark mode, lưu trữ đáp án, v.v.)
- Cải thiện giao diện

## 📄 Giấy Phép

Dự án được phát hành dưới giấy phép **MIT License**. Bạn có thể tự do sử dụng, chỉnh sửa và chia sẻ.

---
<p align="center">
  Made with ❤️ dành cho cộng đồng học online
</p>
```