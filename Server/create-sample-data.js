// Create sample data for StackIt platform
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
    
    console.log(`🔗 ${method} ${endpoint}`);
    console.log(`📊 Status: ${response.status}`);
    
    if (response.ok) {
      console.log(`✅ Success`);
    } else {
      console.log(`❌ Error:`, result);
    }
    
    return { status: response.status, data: result };
  } catch (error) {
    console.error(`❌ Error:`, error.message);
    return { error: error.message };
  }
}

async function createSampleData() {
  console.log('🚀 Creating sample data for StackIt...');
  
  try {
    // Create sample users
    console.log('\n=== Creating Users ===');
    const users = [
      {
        username: 'johndoe',
        email: 'john@example.com',
        password: 'Password123'
      },
      {
        username: 'janedoe',
        email: 'jane@example.com',
        password: 'Password123'
      },
      {
        username: 'techguru',
        email: 'guru@example.com',
        password: 'Password123'
      }
    ];

    const userTokens = [];
    for (const user of users) {
      const result = await apiRequest('/api/auth/register', 'POST', user);
      if (result.data?.success && result.data?.data?.token) {
        userTokens.push({
          user: user.username,
          token: result.data.data.token
        });
        console.log(`✅ Created user: ${user.username}`);
      }
    }

    if (userTokens.length === 0) {
      console.log('❌ No users created, cannot create sample questions');
      return;
    }

    // Create sample questions
    console.log('\n=== Creating Questions ===');
    const questions = [
      {
        title: 'How to implement authentication in React with TypeScript?',
        description: '<p>I\'m building a React application with TypeScript and need to implement user authentication. What are the best practices for handling login, logout, and protected routes?</p><p>Should I use context API or a state management library like Redux?</p>',
        tags: ['react', 'typescript', 'authentication']
      },
      {
        title: 'Best practices for Node.js error handling',
        description: '<p>What are the recommended approaches for error handling in Node.js applications?</p><p>I\'m particularly interested in:</p><ul><li>Async/await error handling</li><li>Global error handlers</li><li>Custom error classes</li></ul>',
        tags: ['nodejs', 'error-handling', 'best-practices']
      },
      {
        title: 'How to optimize MongoDB queries for better performance?',
        description: '<p>My MongoDB queries are getting slower as my collection grows. What are some techniques to optimize query performance?</p><p>I\'ve heard about indexing but not sure how to implement it properly.</p>',
        tags: ['mongodb', 'performance', 'database']
      },
      {
        title: 'Understanding JavaScript closures with examples',
        description: '<p>Can someone explain JavaScript closures with practical examples? I\'ve read the documentation but still struggling to understand when and how to use them effectively.</p>',
        tags: ['javascript', 'closures', 'functions']
      }
    ];

    for (let i = 0; i < questions.length && i < userTokens.length; i++) {
      const question = questions[i];
      const userToken = userTokens[i % userTokens.length];
      
      const result = await apiRequest('/api/questions', 'POST', question, userToken.token);
      if (result.data?.success) {
        console.log(`✅ Created question: ${question.title}`);
      }
    }

    console.log('\n✅ Sample data creation completed!');
    console.log('\nYou can now:');
    console.log('1. Visit http://localhost:5174 to see the frontend');
    console.log('2. Login with any of these accounts:');
    users.forEach(user => {
      console.log(`   - ${user.email} / Password123`);
    });

  } catch (error) {
    console.error('❌ Failed to create sample data:', error);
  }
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.log('❌ This script requires Node.js 18+ or install node-fetch');
  process.exit(1);
}

// Run the script
createSampleData();
