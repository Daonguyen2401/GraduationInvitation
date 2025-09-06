# 📸 Cách thêm ảnh slideshow

## Đơn giản thôi!

### 1. Copy ảnh vào thư mục
```bash
cp your-image.jpg /public/slideshow/
```

### 2. Cập nhật danh sách trong `lib/image-utils.ts`
```typescript
const BACKGROUND_IMAGE_FILES = [
  "graduation-ceremony-crowd.jpg",
  "university-campus-with-graduation-decorations.jpg", 
  "diploma-and-cap.jpg",
  "iStock-1436453674-1024x540.jpg",
  "your-image.jpg", // ← Thêm tên file mới ở đây
]
```

### 3. Deploy lại
```bash
npm run build
npm run deploy
```

## ✅ Xong!

- Dots indicator sẽ tự động tăng
- Carousel sẽ chuyển qua tất cả ảnh
- Không cần gì phức tạp!

## 📁 Thư mục ảnh
- **Slideshow**: `/public/slideshow/` 
- **Profile**: `/public/graduation-photo-portrait.jpg` (không đụng)
