// Test script for Railway deployment
const https = require('https');

async function testRailwayDeployment() {
  const testData = {
    fullName: 'Nguyễn Văn Test',
    nickname: 'Test User',
    email: 'test@example.com',
    phone: '+84 123 456 789',
    attendanceTime: '8:00'
  };

  // Replace with your actual Railway URL
  const railwayUrl = 'https://your-app.railway.app'; // Update this with your actual URL
  
  try {
    console.log('🧪 Testing Railway deployment...');
    console.log('📧 Test data:', testData);
    console.log('🌐 URL:', railwayUrl);

    // Test 1: Check if site is accessible
    console.log('\n1️⃣ Testing site accessibility...');
    const response = await fetch(railwayUrl);
    
    if (response.ok) {
      console.log('✅ Site is accessible!');
    } else {
      console.log('❌ Site is not accessible:', response.status);
      return;
    }

    // Test 2: Test API endpoint
    console.log('\n2️⃣ Testing API endpoint...');
    const apiResponse = await fetch(`${railwayUrl}/api/attendance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await apiResponse.json();
    
    if (apiResponse.ok) {
      console.log('✅ API test successful!');
      console.log('📋 Result:', result);
    } else {
      console.log('❌ API test failed!');
      console.log('🚨 Error:', result);
    }

    // Test 3: Test email service (if configured)
    if (result.emailSent) {
      console.log('\n3️⃣ Email service test:');
      console.log('✅ Email sent successfully!');
      console.log('📧 Check your email inbox for the invitation.');
    } else {
      console.log('\n3️⃣ Email service test:');
      console.log('⚠️ Email not sent (check environment variables)');
    }

  } catch (error) {
    console.log('❌ Network error:', error.message);
    console.log('💡 Make sure your Railway app is deployed and accessible');
  }
}

// Instructions
console.log(`
🚀 Railway Deployment Test Script
================================

📋 Instructions:
1. Deploy your app to Railway
2. Update the 'railwayUrl' variable with your actual Railway URL
3. Run this script: node test-railway-deployment.js

🔗 Railway Dashboard: https://railway.app
📖 Deployment Guide: See RAILWAY_DEPLOYMENT_GUIDE.md

`);

// Run test
testRailwayDeployment();
