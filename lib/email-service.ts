import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'
import InvitationGenerator from './invitation-generator'

interface EmailData {
  fullName: string
  nickname?: string
  email: string
  phone: string
  attendanceTime: string
  language?: 'vi' | 'en'
}

interface EmailTemplate {
  subject: string
  html: string
  text: string
}

class EmailService {
  private transporter: nodemailer.Transporter
  private invitationGenerator: InvitationGenerator

  constructor() {
    // Cấu hình transporter cho Gmail
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Email Gmail của bạn
        pass: process.env.EMAIL_PASS, // App Password của bạn
      },
    })
    this.invitationGenerator = new InvitationGenerator()
  }

  /**
   * Đọc template email từ file
   */
  private async loadEmailTemplate(): Promise<EmailTemplate> {
    try {
      const templatePath = path.join(process.cwd(), 'email-template.md')
      const templateContent = fs.readFileSync(templatePath, 'utf-8')
      
      // Parse template từ markdown
      const sections = templateContent.split('## ')
      const subjectSection = sections.find(s => s.startsWith('Chủ đề Email (Subject)'))
      const textSection = sections.find(s => s.startsWith('Nội dung Email (Text)'))
      
      if (!subjectSection || !textSection) {
        throw new Error('Template không đúng định dạng')
      }

      const subject = subjectSection.split('\n')[1]?.trim() || 'Thư Mời Tốt Nghiệp'
      const textCode = textSection.split('```')[1]?.split('```')[0]?.trim() || ''

      return {
        subject,
        html: '', // Không dùng HTML nữa
        text: textCode
      }
    } catch (error) {
      console.error('Lỗi khi đọc template email:', error)
      // Fallback template
      return {
        subject: '🎓 Thư Mời Tham Dự Lễ Tốt Nghiệp - Class of 2025',
        html: this.getDefaultHtmlTemplate(),
        text: this.getDefaultTextTemplate()
      }
    }
  }

  /**
   * Chuyển HTML thành text đơn giản
   */
  private htmlToText(html: string): string {
    return html
      .replace(/<[^>]*>/g, '') // Xóa tất cả HTML tags
      .replace(/&nbsp;/g, ' ') // Thay thế &nbsp;
      .replace(/&amp;/g, '&') // Thay thế &amp;
      .replace(/&lt;/g, '<') // Thay thế &lt;
      .replace(/&gt;/g, '>') // Thay thế &gt;
      .replace(/\s+/g, ' ') // Gộp nhiều khoảng trắng thành 1
      .trim() // Xóa khoảng trắng đầu cuối
  }

  /**
   * Thay thế các biến trong template
   */
  private replaceTemplateVariables(template: string, data: EmailData): string {
    let result = template
      .replace(/\{\{FULL_NAME\}\}/g, data.fullName)
      .replace(/\{\{EMAIL\}\}/g, data.email)
      .replace(/\{\{PHONE\}\}/g, data.phone)
      .replace(/\{\{ATTENDANCE_TIME\}\}/g, data.attendanceTime)

    // Xử lý nickname (có thể có hoặc không)
    if (data.nickname) {
      result = result.replace(/\{\{#NICKNAME\}\}[\s\S]*?\{\{\/NICKNAME\}\}/g, 
        data.nickname)
      result = result.replace(/\{\{NICKNAME\}\}/g, data.nickname)
    } else {
      // Xóa phần nickname nếu không có
      result = result.replace(/\{\{#NICKNAME\}\}[\s\S]*?\{\{\/NICKNAME\}\}/g, '')
      result = result.replace(/\{\{NICKNAME\}\}/g, '')
    }

    return result
  }

  /**
   * Gửi email thư mời với ảnh thiệp mời
   */
  async sendInvitationEmail(data: EmailData): Promise<boolean> {
    try {
      // Generate invitation card image
      const imagePath = await this.invitationGenerator.generateInvitationCard({
        fullName: data.fullName,
        nickname: data.nickname,
        email: data.email,
        phone: data.phone,
        attendanceTime: data.attendanceTime,
        language: data.language || 'vi'
      })

      // Load template from file
      const template = await this.loadEmailTemplate()
      
      // Replace variables in template
      const subject = this.replaceTemplateVariables(template.subject, data)
      const textContent = this.replaceTemplateVariables(template.text, data)

      // Normalize attachment path to ensure it points inside /public even if imagePath starts with '/'
      const normalizedImagePath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
      const absoluteAttachmentPath = path.join(process.cwd(), 'public', normalizedImagePath)

      const mailOptions = {
        from: `"Lễ Tốt Nghiệp Class of 2025" <${process.env.EMAIL_USER}>`,
        to: data.email,
        subject: subject,
        text: textContent, // Chỉ gửi Plain Text
        attachments: [
          {
            filename: `thiep-moi-${data.fullName.replace(/\s+/g, '-')}.jpg`,
            path: absoluteAttachmentPath,
            contentType: 'image/jpeg'
          }
        ]
      }

      const info = await this.transporter.sendMail(mailOptions)
      console.log('Email đã được gửi thành công:', info.messageId)
      
      // Clean up old files
      await this.invitationGenerator.cleanupOldFiles()
      
      return true

    } catch (error) {
      console.error('Lỗi khi gửi email:', error)
      return false
    }
  }

  /**
   * Kiểm tra kết nối email service
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify()
      console.log('Email service đã sẵn sàng')
      return true
    } catch (error) {
      console.error('Email service không khả dụng:', error)
      return false
    }
  }

  /**
   * Template email đơn giản với ảnh thiệp mời
   */
  private getSimpleEmailTemplate(data: EmailData, imagePath: string): string {
    const isVietnamese = data.language === 'vi'
    
    return `
<!DOCTYPE html>
<html lang="${data.language || 'vi'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thiệp Mời Tốt Nghiệp</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .container { background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px; }
        .invitation-image { text-align: center; margin: 20px 0; }
        .invitation-image img { max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
        .content { margin: 20px 0; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #eee; text-align: center; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎓 ${isVietnamese ? 'Thiệp Mời Tham Dự Lễ Tốt Nghiệp' : 'Graduation Invitation Card'}</h1>
        </div>
        
        <div class="content">
            <p>${isVietnamese ? 'Xin chào' : 'Hello'} <strong>${data.fullName}</strong>,</p>
            
            <p>${isVietnamese 
              ? 'Cảm ơn bạn đã đăng ký tham dự lễ tốt nghiệp! Thiệp mời cá nhân của bạn đã được tạo và đính kèm trong email này.' 
              : 'Thank you for registering to attend the graduation ceremony! Your personalized invitation card has been created and attached to this email.'}</p>
            
            <div class="invitation-image">
                <img src="cid:invitation-card" alt="${isVietnamese ? 'Thiệp mời cá nhân' : 'Personal invitation card'}" />
            </div>
            
            <p>${isVietnamese 
              ? 'Vui lòng lưu ảnh thiệp mời này và mang theo khi tham dự sự kiện.' 
              : 'Please save this invitation card image and bring it with you when attending the event.'}</p>
        </div>
        
        <div class="footer">
            <p>${isVietnamese ? 'Trân trọng,' : 'Best regards,'}<br>
            <strong>[Tên của bạn]</strong><br>
            ${isVietnamese ? 'Ban Tổ Chức Lễ Tốt Nghiệp' : 'Graduation Organizing Committee'}</p>
        </div>
    </div>
</body>
</html>`
  }

  /**
   * Template text đơn giản
   */
  private getSimpleTextTemplate(data: EmailData): string {
    const isVietnamese = data.language === 'vi'
    
    return `
${isVietnamese ? '🎓 THIỆP MỜI THAM DỰ LỄ TỐT NGHIỆP' : '🎓 GRADUATION INVITATION CARD'}

${isVietnamese ? 'Xin chào' : 'Hello'} ${data.fullName},

${isVietnamese 
  ? 'Cảm ơn bạn đã đăng ký tham dự lễ tốt nghiệp! Thiệp mời cá nhân của bạn đã được tạo và đính kèm trong email này.' 
  : 'Thank you for registering to attend the graduation ceremony! Your personalized invitation card has been created and attached to this email.'}

${isVietnamese 
  ? 'Vui lòng lưu ảnh thiệp mời này và mang theo khi tham dự sự kiện.' 
  : 'Please save this invitation card image and bring it with you when attending the event.'}

${isVietnamese ? 'Trân trọng,' : 'Best regards,'}
[Tên của bạn]
${isVietnamese ? 'Ban Tổ Chức Lễ Tốt Nghiệp' : 'Graduation Organizing Committee'}`
  }

  /**
   * Template HTML mặc định
   */
  private getDefaultHtmlTemplate(): string {
    return `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thư Mời Tốt Nghiệp</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .container { background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px; }
        .highlight { background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎓 Lễ Tốt Nghiệp Class of 2025</h1>
        </div>
        <div class="content">
            <p>Xin chào <strong>{{FULL_NAME}}</strong>,</p>
            <p>Chúng tôi rất vui mừng thông báo rằng bạn đã đăng ký tham dự thành công lễ tốt nghiệp!</p>
            <div class="highlight">
                <h3>📅 Thông tin sự kiện:</h3>
                <p><strong>Thời gian:</strong> {{ATTENDANCE_TIME}}</p>
                <p><strong>Email:</strong> {{EMAIL}}</p>
                <p><strong>Số điện thoại:</strong> {{PHONE}}</p>
            </div>
            <p>Trân trọng,<br>Ban Tổ Chức Lễ Tốt Nghiệp</p>
        </div>
    </div>
</body>
</html>`
  }

  /**
   * Template Text mặc định
   */
  private getDefaultTextTemplate(): string {
    return `
🎓 THƯ MỜI THAM DỰ LỄ TỐT NGHIỆP - CLASS OF 2025

Xin chào {{FULL_NAME}},

Chúng tôi rất vui mừng thông báo rằng bạn đã đăng ký tham dự thành công lễ tốt nghiệp!

📅 THÔNG TIN SỰ KIỆN:
- Thời gian: {{ATTENDANCE_TIME}}
- Email: {{EMAIL}}
- Số điện thoại: {{PHONE}}

Trân trọng,
Ban Tổ Chức Lễ Tốt Nghiệp
Class of 2025`
  }
}

export default EmailService
