# Email Template - Thiệp Mời Tốt Nghiệp

## Chủ đề Email (Subject)
🎓 Thiệp Mời Tham Dự Lễ Tốt Nghiệp

## Nội dung Email (Text)

```
🎓 THIỆP MỜI THAM DỰ LỄ TỐT NGHIỆP

Xin chào {{FULL_NAME}},

Cảm ơn bạn đã đăng ký tham dự lễ tốt nghiệp của Đào Nguyên! Thiệp mời cá nhân của bạn đã được tạo và đính kèm trong email này.

Vui lòng lưu ảnh thiệp mời này và mang theo khi tham dự sự kiện.

Trân trọng,
Trần Đức Đào Nguyên
```


## Các biến có thể sử dụng:

- `{{FULL_NAME}}` - Tên đầy đủ của người đăng ký
- `{{NICKNAME}}` - Biệt danh (nếu có)
- `{{EMAIL}}` - Email đăng ký
- `{{PHONE}}` - Số điện thoại
- `{{ATTENDANCE_TIME}}` - Thời gian tham dự đã chọn

## Hướng dẫn sử dụng:

1. Chỉnh sửa nội dung trong phần HTML hoặc Text Plain
2. Thay đổi tên người gửi trong template
3. Các biến `{{VARIABLE}}` sẽ được thay thế tự động khi gửi email
4. Lưu file này và hệ thống sẽ sử dụng template này để gửi email
