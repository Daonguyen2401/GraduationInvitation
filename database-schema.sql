-- Tạo bảng attendance_confirmations để lưu trữ thông tin xác nhận tham dự
CREATE TABLE IF NOT EXISTS attendance_confirmations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  nickname VARCHAR(255),
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  attendance_time VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo index để tối ưu hóa truy vấn
CREATE INDEX IF NOT EXISTS idx_attendance_confirmations_email ON attendance_confirmations(email);
CREATE INDEX IF NOT EXISTS idx_attendance_confirmations_created_at ON attendance_confirmations(created_at);

-- Tạo function để tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Tạo trigger để tự động cập nhật updated_at
CREATE TRIGGER update_attendance_confirmations_updated_at 
    BEFORE UPDATE ON attendance_confirmations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Tạo RLS (Row Level Security) policies nếu cần
-- ALTER TABLE attendance_confirmations ENABLE ROW LEVEL SECURITY;

-- Policy để cho phép insert (có thể điều chỉnh tùy theo nhu cầu)
-- CREATE POLICY "Allow public insert" ON attendance_confirmations
--     FOR INSERT WITH CHECK (true);

-- Policy để cho phép select (có thể điều chỉnh tùy theo nhu cầu)  
-- CREATE POLICY "Allow public select" ON attendance_confirmations
--     FOR SELECT USING (true);
