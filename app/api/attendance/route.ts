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
      .select('id, email, attendance_time')
      .eq('email', email.toLowerCase().trim())

    console.log('Checking email:', email.toLowerCase().trim())
    console.log('Existing data:', existingData)
    console.log('Check error:', checkError)

    let shouldSendEmail = true
    let existingRecord = null

    // Nếu email đã tồn tại
    if (existingData && existingData.length > 0) {
      existingRecord = existingData[0]
      
      // Kiểm tra thời gian tham dự có thay đổi không
      if (existingRecord.attendance_time === attendanceTime) {
        console.log('Email exists with same time, skipping email send')
        shouldSendEmail = false
      } else {
        console.log('Email exists but time changed, will send email and update')
        shouldSendEmail = true
      }
    }

    // Nếu không cần gửi email (email tồn tại và thời gian giống nhau)
    if (!shouldSendEmail) {
      return NextResponse.json(
        { 
          success: true, 
          data: existingRecord,
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

    let resultData = null
    let resultError = null

    // Nếu email đã tồn tại, update thời gian tham dự
    if (existingRecord) {
      console.log('Updating existing record with new attendance time')
      const { data, error } = await supabase
        .from('attendance_confirmations')
        .update({
          attendance_time: attendanceTime,
          updated_at: new Date().toISOString()
        })
        .eq('email', email.toLowerCase().trim())
        .select()

      resultData = data
      resultError = error
    } else {
      // Nếu email chưa tồn tại, insert mới
      console.log('Inserting new record')
      const { data, error } = await supabase
        .from('attendance_confirmations')
        .insert([
          {
            full_name: fullName,
            nickname: nickname || null,
            phone: phone,
            email: email.toLowerCase().trim(), // Normalize email
            attendance_time: attendanceTime,
          },
        ])
        .select()

      resultData = data
      resultError = error
    }

    if (resultError) {
      console.error('Supabase error:', resultError)
      return NextResponse.json(
        { error: 'Failed to save attendance confirmation' },
        { status: 500 }
      )
    }

    const message = existingRecord 
      ? (emailSent 
          ? 'Attendance time updated and invitation email sent successfully' 
          : 'Attendance time updated but failed to send email')
      : (emailSent 
          ? 'Attendance confirmation saved and invitation email sent successfully' 
          : 'Attendance confirmation saved but failed to send email')

    return NextResponse.json(
      { 
        success: true, 
        data: resultData[0],
        message: message,
        emailSent: emailSent,
        isUpdate: !!existingRecord
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
