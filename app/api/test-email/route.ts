import { NextRequest, NextResponse } from 'next/server'
import EmailService from '@/lib/email-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required for testing' },
        { status: 400 }
      )
    }

    // Tạo dữ liệu test
    const testData = {
      fullName: 'Nguyễn Văn Test',
      nickname: 'Test User',
      email: email,
      phone: '0123456789',
      attendanceTime: 'Sáng (9:00 - 12:00)'
    }

    const emailService = new EmailService()
    
    // Kiểm tra kết nối email service
    const isConnected = await emailService.verifyConnection()
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Email service is not available. Please check your configuration.' },
        { status: 500 }
      )
    }

    // Gửi email test
    const emailSent = await emailService.sendInvitationEmail(testData)

    if (emailSent) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'Test email sent successfully',
          testData: testData
        },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { error: 'Failed to send test email' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Test email error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const emailService = new EmailService()
    const isConnected = await emailService.verifyConnection()

    return NextResponse.json(
      { 
        emailServiceAvailable: isConnected,
        message: isConnected 
          ? 'Email service is ready' 
          : 'Email service is not available. Please check your configuration.'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Email service check error:', error)
    return NextResponse.json(
      { error: 'Failed to check email service' },
      { status: 500 }
    )
  }
}
