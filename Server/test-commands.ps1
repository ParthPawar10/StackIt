# StackIt API Testing Commands
# Copy and paste these commands in a terminal to test your API

echo "🚀 StackIt API Testing Commands"
echo "================================"

echo ""
echo "1. 🏥 Health Check"
curl -X GET http://localhost:5000/ | ConvertFrom-Json | ConvertTo-Json -Depth 10

echo ""
echo "2. 👤 Register User"
$registerData = @{
    username = "testuser123"
    email = "test@example.com" 
    password = "TestPass123"
} | ConvertTo-Json

curl -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -d $registerData

echo ""
echo "3. 🔐 Login User"
$loginData = @{
    email = "test@example.com"
    password = "TestPass123"
} | ConvertTo-Json

$response = curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d $loginData | ConvertFrom-Json

$token = $response.data.token
echo "🎟️ Token received: $token"

echo ""
echo "4. ❓ Get Questions"
curl -X GET http://localhost:5000/api/questions

echo ""
echo "5. ✍️ Create Question (requires authentication)"
if ($token) {
    $questionData = @{
        title = "How to build a REST API with Node.js?"
        description = "<p>I'm learning backend development and want to create a robust REST API. What are the best practices?</p>"
        tags = @("nodejs", "api", "backend")
    } | ConvertTo-Json

    curl -X POST http://localhost:5000/api/questions `
      -H "Content-Type: application/json" `
      -H "Authorization: Bearer $token" `
      -d $questionData
}

echo ""
echo "6. 🏷️ Get Tags"
curl -X GET http://localhost:5000/api/tags

echo ""
echo "✅ API Testing Complete!"
echo ""
echo "📝 Next Steps:"
echo "- Install Thunder Client VS Code extension"
echo "- Or use Postman for advanced testing"
echo "- Test file uploads at /api/upload/image"
echo "- Test real-time notifications with Socket.io"
