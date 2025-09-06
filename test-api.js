// Test script để kiểm tra API
// Chạy: node test-api.js

const testData = {
  fullName: "Nguyễn Văn Test",
  nickname: "Test User",
  phone: "0123456789",
  email: "test@example.com",
  attendanceTime: "9h30"
}

async function testAPI() {
  try {
    console.log('Testing API with data:', testData)
    
    const response = await fetch('http://localhost:3000/api/attendance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    })

    const result = await response.json()
    
    if (response.ok) {
      console.log('✅ API test successful!')
      console.log('Response:', result)
    } else {
      console.log('❌ API test failed!')
      console.log('Error:', result)
    }
  } catch (error) {
    console.log('❌ Network error:', error.message)
  }
}

// Test GET endpoint
async function testGetAPI() {
  try {
    console.log('Testing GET API...')
    
    const response = await fetch('http://localhost:3000/api/attendance')
    const result = await response.json()
    
    if (response.ok) {
      console.log('✅ GET API test successful!')
      console.log('Total records:', result.data?.length || 0)
    } else {
      console.log('❌ GET API test failed!')
      console.log('Error:', result)
    }
  } catch (error) {
    console.log('❌ Network error:', error.message)
  }
}

// Chạy tests
console.log('🚀 Starting API tests...')
console.log('Make sure your Next.js server is running on http://localhost:3000')
console.log('')

testAPI().then(() => {
  console.log('')
  return testGetAPI()
}).then(() => {
  console.log('')
  console.log('✨ All tests completed!')
})
