// Script test email service
// Chạy: node test-email.js

const testEmailService = async () => {
  const testEmail = process.argv[2] || 'test@example.com'
  
  console.log('🧪 Testing Email Service...')
  console.log(`📧 Test email: ${testEmail}`)
  console.log('')

  try {
    // Test 1: Kiểm tra kết nối email service
    console.log('1️⃣ Checking email service connection...')
    const checkResponse = await fetch('http://localhost:3000/api/test-email', {
      method: 'GET'
    })
    
    const checkResult = await checkResponse.json()
    console.log('   Status:', checkResponse.status)
    console.log('   Response:', checkResult)
    console.log('')

    if (!checkResult.emailServiceAvailable) {
      console.log('❌ Email service is not available. Please check your .env.local configuration.')
      return
    }

    // Test 2: Gửi email test
    console.log('2️⃣ Sending test email...')
    const sendResponse = await fetch('http://localhost:3000/api/test-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: testEmail
      })
    })

    const sendResult = await sendResponse.json()
    console.log('   Status:', sendResponse.status)
    console.log('   Response:', sendResult)
    console.log('')

    if (sendResult.success) {
      console.log('✅ Test email sent successfully!')
      console.log('📬 Check your inbox for the invitation email.')
    } else {
      console.log('❌ Failed to send test email.')
    }

  } catch (error) {
    console.error('❌ Error during testing:', error.message)
    console.log('')
    console.log('💡 Make sure your Next.js development server is running:')
    console.log('   npm run dev')
  }
}

// Test 3: Test API attendance với email mới
const testAttendanceAPI = async () => {
  console.log('3️⃣ Testing attendance API with new email...')
  
  const testData = {
    fullName: 'Nguyễn Văn Test API',
    nickname: 'Test API',
    email: `test-${Date.now()}@example.com`,
    phone: '0123456789',
    attendanceTime: 'Chiều (14:00 - 17:00)'
  }

  try {
    const response = await fetch('http://localhost:3000/api/attendance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    })

    const result = await response.json()
    console.log('   Status:', response.status)
    console.log('   Response:', result)
    console.log('')

    if (result.success) {
      console.log('✅ Attendance registration successful!')
      console.log(`📧 Email sent: ${result.emailSent ? 'Yes' : 'No'}`)
    } else {
      console.log('❌ Attendance registration failed.')
    }

  } catch (error) {
    console.error('❌ Error testing attendance API:', error.message)
  }
}

// Chạy tests
const runTests = async () => {
  console.log('🚀 Starting Email Service Tests')
  console.log('================================')
  console.log('')

  await testEmailService()
  console.log('')
  await testAttendanceAPI()
  
  console.log('')
  console.log('🏁 Tests completed!')
}

runTests()
