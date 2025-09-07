import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import EmailService from '@/lib/email-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { fullName, phone, email, attendanceTime, nickname } = body
    
    if (!fullName || !phone || !email || !attendanceTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate phone format (basic validation)
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: 'Invalid phone format' },
        { status: 400 }
      )
    }

    // Kiểm tra xem email đã tồn tại trong database chưa
    const { data: existingData, error: checkError } = await supabase
      .from('attendance_confirmations')
      .select('id, email')
      .eq('email', email)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 là lỗi "not found", không phải lỗi thực sự
      console.error('Error checking existing email:', checkError)
      return NextResponse.json(
        { error: 'Failed to check existing registration' },
        { status: 500 }
      )
    }

    // Nếu email đã tồn tại, bỏ qua hoàn toàn
    if (existingData) {
      return NextResponse.json(
        { 
          success: true, 
          data: existingData,
          message: 'Attendance confirmation saved successfully'
        },
        { status: 200 }
      )
    }

    // Gửi email thư mời trước khi lưu vào database
    const emailService = new EmailService()
    const emailSent = await emailService.sendInvitationEmail({
      fullName,
      nickname,
      email,
      phone,
      attendanceTime
    })

    if (!emailSent) {
      console.warn('Failed to send email, but continuing with database save')
    }

    // Insert data into Supabase
    const { data, error } = await supabase
      .from('attendance_confirmations')
      .insert([
        {
          full_name: fullName,
          nickname: nickname || null,
          phone: phone,
          email: email,
          attendance_time: attendanceTime,
        },
      ])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to save attendance confirmation' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        data: data[0],
        message: emailSent 
          ? 'Attendance confirmation saved and invitation email sent successfully' 
          : 'Attendance confirmation saved but failed to send email',
        emailSent: emailSent
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Get all attendance confirmations (for admin purposes)
    const { data, error } = await supabase
      .from('attendance_confirmations')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch attendance confirmations' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data }, { status: 200 })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
