# 🚀 Udemy Easy Quizz

<div align="center">
  <img src="assets/logo.png" alt="Udemy Easy Quizz" width="128"/>
  
  ### Tiện ích Chrome lấy đáp án Quiz Udemy chính xác 100%
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-orange.svg)](https://www.google.com/chrome/)
  [![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](https://github.com/username/udemy-easy-quizz)
  
  [Tính năng](#-tính-năng) • [Cài đặt](#️-cài-đặt) • [Sử dụng](#-hướng-dẫn-sử-dụng) • [Demo](#-giao-diện-demo)
</div>

---

## 📌 Giới Thiệu

**Udemy Easy Quizz** là extension Chrome giúp bạn lấy toàn bộ đáp án chính xác của bài kiểm tra Udemy chỉ với 1 click. Extension hoạt động bằng cách gọi API nội bộ của Udemy để trích xuất câu hỏi và đáp án, sau đó hiển thị ngay trong popup với giao diện hiện đại.

### 🎯 Tại sao nên dùng?

- ⚡ **Nhanh chóng**: Lấy đáp án trong vài giây
- 🎨 **Giao diện đẹp**: Thiết kế hiện đại với hiệu ứng blur
- 🔄 **Tự động hóa**: Hỗ trợ tự động chọn đáp án đúng
- 📊 **Phân trang thông minh**: Xử lý quiz có hàng trăm câu hỏi

---

## ✨ Tính Năng

| Tính năng | Mô tả |
|-----------|-------|
| 🎯 **API chính xác** | Lấy đáp án trực tiếp từ server Udemy với độ chính xác 100% |
| 📄 **Phân trang tự động** | Hỗ trợ quiz dài với pagination tự động |
| 🔍 **Tự động phát hiện** | Tự động lấy Quiz ID từ URL hiện tại |
| 💚 **Highlight đáp án** | Đáp án đúng được tô sáng màu xanh rõ ràng |
| 🎨 **Giao diện hiện đại** | Thiết kế theo phong cách Windows 11/macOS |
| ⚙️ **Chế độ tự động** | Tự động tick đáp án đúng trên trang quiz |
| 📋 **Console Script** | Export JSON, tạo cheat sheet ngay trong DevTools |

---

## 🛠️ Cài Đặt

### Cài đặt từ Source Code

1. **Clone repository**
   ```bash
   git clone https://github.com/username/udemy-easy-quizz.git
   cd udemy-easy-quizz
   ```

2. **Mở Chrome Extensions**
   - Truy cập `chrome://extensions/`
   - Bật **Developer mode** (góc trên bên phải)

3. **Load extension**
   - Click **Load unpacked**
   - Chọn thư mục project vừa clone

4. **Hoàn tất!** 🎉
   - Icon extension xuất hiện trên toolbar
   - Pin extension để truy cập nhanh

---

## 📖 Hướng Dẫn Sử Dụng

### Cách 1: Sử dụng Popup Extension

1. **Truy cập bài Quiz** trên Udemy  
   URL dạng: `https://www.udemy.com/course/[course-name]/quiz/[quiz-id]`

2. **Mở extension**  
   Click vào icon extension trên toolbar

3. **Lấy đáp án**  
   Nhấn nút FAB lớn (✨ icon) ở góc dưới bên phải

4. **Xem kết quả**  
   Tất cả câu hỏi và đáp án hiển thị ngay lập tức

### Cách 2: Sử dụng Console Script (Nâng cao)

1. Mở **DevTools** (`F12` hoặc `Ctrl+Shift+I`)
2. Chuyển sang tab **Console**
3. Copy toàn bộ nội dung file `scanAPI.js` và paste vào
4. Sử dụng các lệnh sau:

```javascript
// Lấy toàn bộ dữ liệu quiz
await QuizPaginationFetcher.fetchAllPages();

// Hiển thị chỉ câu hỏi + đáp án đúng
QuizPaginationFetcher.displayAnswersOnly();

// Tạo bảng cheat sheet và copy
QuizPaginationFetcher.createCheatSheet();

// Export JSON và copy vào clipboard
QuizPaginationFetcher.exportJSON();
```
---

## 📂 Cấu Trúc Dự Án

```
udemy-easy-quizz/
├── 📄 manifest.json          # Cấu hình extension
├── 🔧 background.js          # Service Worker - xử lý API
├── 🖼️ window.html            # Giao diện popup
├── ⚡ popup.js               # Logic popup
├── 📝 content-script.js      # Script chạy trên trang Udemy
├── 🎨 style.css              # Stylesheet chính
├── 🔍 scanAPI.js             # Console script nâng cao
├── 🖼️ icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── 📸 screenshots/           # Ảnh demo
└── 📖 README.md
```

---

## 🎓 Ví Dụ Sử Dụng

### Kịch bản 1: Học viên ôn tập nhanh

```
1. Hoàn thành xem video bài học
2. Vào bài quiz kiểm tra kiến thức
3. Sử dụng extension để xem đáp án
4. So sánh với câu trả lời của mình
5. Học từ những câu sai
```

### Kịch bản 2: Giảng viên/Người tạo nội dung

```
1. Kiểm tra độ khó của quiz
2. Xác minh đáp án đúng
3. Export JSON để phân tích
4. Tối ưu hóa câu hỏi
```

---

## 💡 Tips & Tricks

### 🔥 Tối ưu trải nghiệm

- **Pin extension** lên toolbar để truy cập nhanh
- Sử dụng **Auto Select** khi muốn tiết kiệm thời gian
- Dùng **Console Script** để export dữ liệu chi tiết
- Kết hợp với note-taking app để lưu kiến thức

### ⚡ Xử lý lỗi thường gặp

| Lỗi | Nguyên nhân | Giải pháp |
|-----|-------------|-----------|
| "Quiz ID not found" | Không phải trang quiz | Kiểm tra URL có chứa `/quiz/` |
| "Fetch failed" | Mất kết nối | Reload trang và thử lại |
| "No data returned" | API thay đổi | Cập nhật extension lên version mới |

---

## ⚠️ Lưu Ý Quan Trọng

> **⚖️ Mục đích sử dụng**
> 
> Extension này được phát triển với mục đích:
> - ✅ Học tập và nghiên cứu cá nhân
> - ✅ Kiểm tra kiến thức nhanh
> - ✅ Ôn tập và củng cố bài học
> 
> **KHÔNG** khuyến khích sử dụng để:
> - ❌ Gian lận trong khóa học chính thức
> - ❌ Lấy chứng chỉ không chính đáng
> - ❌ Vi phạm điều khoản sử dụng Udemy

### 🔒 Quyền riêng tư

- Extension chỉ truy cập trang Udemy khi bạn kích hoạt
- Không thu thập hoặc lưu trữ dữ liệu cá nhân
- Không gửi thông tin ra ngoài
- Mã nguồn mở, có thể kiểm tra bất kỳ lúc nào

---

## 🤝 Đóng Góp

Chúng tôi rất hoan nghênh mọi đóng góp! 

### Cách đóng góp:

1. **Fork** repository
2. Tạo **branch** mới (`git checkout -b feature/AmazingFeature`)
3. **Commit** thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. **Push** lên branch (`git push origin feature/AmazingFeature`)
5. Mở **Pull Request**

### 💡 Ý tưởng đóng góp:

- 🌙 Thêm Dark Mode
- 💾 Lưu trữ lịch sử đáp án
- 📊 Thống kê quiz đã làm
- 🌐 Đa ngôn ngữ (English, Spanish, etc.)
- 🎯 Filter theo độ khó
- 📤 Export PDF/Excel

---

## 🐛 Báo Lỗi

Nếu gặp lỗi, vui lòng [tạo Issue](https://github.com/username/udemy-easy-quizz/issues) với thông tin:

- Phiên bản Chrome
- Phiên bản Extension
- Mô tả lỗi chi tiết
- Screenshot (nếu có)
- Console log errors

---

## 📜 Changelog

### Version 1.0.0 (2024-12-05)
- 🎉 Release phiên bản đầu tiên
- ✨ Giao diện popup hiện đại
- 🔄 Hỗ trợ phân trang
- ⚡ Chế độ tự động chọn đáp án
- 📋 Console script nâng cao

---

## 📄 Giấy Phép

Dự án được phát hành dưới giấy phép **MIT License**. Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

```
MIT License - Tự do sử dụng, chỉnh sửa và chia sẻ
```

---

## 🌟 Ủng Hộ Dự Án

Nếu thấy extension hữu ích, hãy:

- ⭐ **Star** repository này
- 🔄 **Share** với bạn bè
- 🐛 **Report bugs** để cải thiện
- 💡 **Đề xuất** tính năng mới

---

## 📞 Liên Hệ

- 📧 Email: contact@example.com
- 💬 Issues: [GitHub Issues](https://github.com/username/udemy-easy-quizz/issues)
- 📱 Twitter: [@yourusername](https://twitter.com/yourusername)

---

<div align="center">
  
  ### Made with ❤️ for the online learning community
  
  **Happy Learning! 📚✨**
  
  <sub>Disclaimer: This tool is for educational purposes only. Please respect Udemy's Terms of Service.</sub>