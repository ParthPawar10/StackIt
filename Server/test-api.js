// StackIt API Test Script
// Run this with: node test-api.js

const API_BASE = 'http://localhost:5000';

// Helper function to make API requests
async function apiRequest(endpoint, method = 'GET', data = null, token = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const result = await response.json();
    
    console.log(`\n🔗 ${method} ${endpoint}`);
    console.log(`📊 Status: ${response.status}`);
    console.log(`📄 Response:`, JSON.stringify(result, null, 2));
    
    return { status: response.status, data: result };
  } catch (error) {
    console.error(`❌ Error testing ${endpoint}:`, error.message);
    return { error: error.message };
  }
}

// Test functions
async function testHealthCheck() {
  console.log('\n=== 🏥 HEALTH CHECK ===');
  await apiRequest('/');
}

async function testUserRegistration() {
  console.log('\n=== 👤 USER REGISTRATION ===');
  const userData = {
    username: 'testuser_' + Date.now(),
    email: `test${Date.now()}@example.com`,
    password: 'TestPass123'
  };
  
  const result = await apiRequest('/api/auth/register', 'POST', userData);
  return result.data?.data?.token || null;
}

async function testUserLogin() {
  console.log('\n=== 🔐 USER LOGIN ===');
  const loginData = {
    email: 'admin@stackit.com',
    password: 'admin123'
  };
  
  const result = await apiRequest('/api/auth/login', 'POST', loginData);
  return result.data?.data?.token || null;
}

async function testQuestions(token) {
  console.log('\n=== ❓ QUESTIONS ===');
  
  // Get all questions
  await apiRequest('/api/questions');
  
  if (token) {
    // Create a new question
    const questionData = {
      title: 'How to test API endpoints effectively?',
      description: '<p>I want to learn the best practices for testing REST API endpoints. Any suggestions?</p>',
      tags: ['testing', 'api', 'best-practices']
    };
    
    await apiRequest('/api/questions', 'POST', questionData, token);
  }
}

async function testTags() {
  console.log('\n=== 🏷️ TAGS ===');
  await apiRequest('/api/tags');
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting StackIt API Tests...');
  console.log('=' * 50);
  
  try {
    // Test health check
    await testHealthCheck();
    
    // Test user registration
    const token = await testUserRegistration();
    
    // Test questions
    await testQuestions(token);
    
    // Test tags
    await testTags();
    
    console.log('\n✅ All tests completed!');
    console.log('\nNext steps:');
    console.log('1. Install a REST client like Thunder Client or Postman');
    console.log('2. Test authentication endpoints');
    console.log('3. Create questions and answers');
    console.log('4. Test voting and notifications');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.log('❌ This script requires Node.js 18+ or install node-fetch');
  console.log('Alternative: Use curl commands or a REST client instead');
  process.exit(1);
}

// Run tests
runAllTests();
