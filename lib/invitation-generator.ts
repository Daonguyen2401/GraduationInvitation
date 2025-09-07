import { createCanvas, loadImage } from 'canvas'
import fs from 'fs'
import path from 'path'
import INVITATION_CONFIG from './invitation-config'

interface InvitationData {
  fullName: string
  nickname?: string
  email: string
  phone: string
  attendanceTime: string
  language?: 'vi' | 'en'
}

class InvitationGenerator {
  private outputDir: string

  constructor() {
    this.outputDir = path.join(process.cwd(), 'public', 'generated-invitations')
    this.ensureOutputDir()
  }

  private ensureOutputDir() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true })
    }
  }

  /**
   * Generate invitation card image
   */
  async generateInvitationCard(data: InvitationData): Promise<string> {
    const canvas = createCanvas(600, 700)
    const ctx = canvas.getContext('2d')
    const language = data.language || 'vi'

    // White background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Add simple border
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 2
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40)

    try {
      // Load and draw university logo
      const logoPath = path.join(process.cwd(), 'public', INVITATION_CONFIG.logoPath)
      const logo = await loadImage(logoPath)
      ctx.drawImage(logo, (canvas.width - 100) / 2, 30, 100, 100)
    } catch (error) {
      console.warn('Could not load logo, continuing without it:', error)
    }

    // Continue with the rest of the drawing
    ctx.fillStyle = '#6b7280'
    ctx.font = 'italic 18px serif'
    ctx.textAlign = 'center'
    ctx.fillText('class of', canvas.width / 2, 170)

    ctx.fillStyle = '#1e40af'
    ctx.font = 'bold 42px Arial'
    ctx.fillText(INVITATION_CONFIG.graduationYear, canvas.width / 2, 210)

    ctx.font = '16px Arial'
    ctx.fillStyle = '#6b7280'
    ctx.fillText(language === 'vi' ? 'THƯ MỜI THAM DỰ' : 'INVITATION', canvas.width / 2, 240)

    ctx.font = 'bold 28px Arial'
    ctx.fillStyle = '#1e40af'
    ctx.fillText(language === 'vi' ? 'LỄ TỐT NGHIỆP' : 'GRADUATION PARTY', canvas.width / 2, 280)

    ctx.font = '16px Arial'
    ctx.fillStyle = '#6b7280'
    ctx.fillText(language === 'vi' ? 'XIN MỜI' : 'INVITING', canvas.width / 2, 310)

    const displayName = data.nickname || data.fullName
    ctx.font = 'bold 24px Arial'
    ctx.fillStyle = '#3b82f6'
    ctx.fillText(displayName.toUpperCase(), canvas.width / 2, 340)

    // Format graduate name with line break and bold
    ctx.font = '14px Arial'
    ctx.fillStyle = '#6b7280'
    const graduateText = language === 'vi' ? 'Tới tham dự lễ tốt nghiệp của cử nhân' : 'To attend the graduation ceremony of graduate'
    ctx.fillText(graduateText, canvas.width / 2, 370)
    
    ctx.font = 'bold 16px Arial'
    ctx.fillStyle = '#1e40af'
    const graduateName = language === 'vi' ? INVITATION_CONFIG.graduate.vi : INVITATION_CONFIG.graduate.en
    ctx.fillText(graduateName, canvas.width / 2, 395)

    ctx.font = '18px Arial'
    ctx.fillStyle = '#1e40af'
    const dateText = language === 'vi' ? INVITATION_CONFIG.eventDate.vi : INVITATION_CONFIG.eventDate.en
    ctx.fillText(dateText, canvas.width / 2, 430)
    
    const timeText = language === 'vi' ? `${data.attendanceTime} SÁNG` : `${data.attendanceTime} AM`
    ctx.fillText(timeText, canvas.width / 2, 455)

    ctx.font = 'bold 20px Arial'
    ctx.fillStyle = '#1e40af'
    const venueText = language === 'vi' ? INVITATION_CONFIG.university.vi : INVITATION_CONFIG.university.en
    ctx.fillText(venueText, canvas.width / 2, 490)
    
    ctx.font = '14px Arial'
    ctx.fillStyle = '#6b7280'
    const address1 = language === 'vi' ? INVITATION_CONFIG.address.vi.line1 : INVITATION_CONFIG.address.en.line1
    const address2 = language === 'vi' ? INVITATION_CONFIG.address.vi.line2 : INVITATION_CONFIG.address.en.line2
    ctx.fillText(address1, canvas.width / 2, 515)
    ctx.fillText(address2, canvas.width / 2, 535)

    ctx.font = 'italic 16px Arial'
    ctx.fillStyle = '#3b82f6'
    const shareMemoryText = language === 'vi' ? INVITATION_CONFIG.shareMemory.vi : INVITATION_CONFIG.shareMemory.en
    ctx.fillText(shareMemoryText, canvas.width / 2, 570)

    // Add contact information
    ctx.font = '14px Arial'
    ctx.fillStyle = '#6b7280'
    const contactText = language === 'vi' ? `Liên hệ: ${INVITATION_CONFIG.contact.phone}` : `Contact: ${INVITATION_CONFIG.contact.phone}`
    ctx.fillText(contactText, canvas.width / 2, 600)

    // Save image to file as JPG
    const filename = `invitation-${data.email.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.jpg`
    const filepath = path.join(this.outputDir, filename)
    
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 })
    fs.writeFileSync(filepath, buffer)

    // Return the public URL
    return `/generated-invitations/${filename}`
  }

  /**
   * Clean up old invitation files (older than 24 hours)
   */
  async cleanupOldFiles() {
    try {
      const files = fs.readdirSync(this.outputDir)
      const now = Date.now()
      const oneDayInMs = 24 * 60 * 60 * 1000

      for (const file of files) {
        const filepath = path.join(this.outputDir, file)
        const stats = fs.statSync(filepath)
        
        if (now - stats.mtime.getTime() > oneDayInMs) {
          fs.unlinkSync(filepath)
          console.log(`Cleaned up old invitation file: ${file}`)
        }
      }
    } catch (error) {
      console.error('Error cleaning up old files:', error)
    }
  }
}

export default InvitationGenerator
