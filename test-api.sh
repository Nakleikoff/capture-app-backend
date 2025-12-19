#!/bin/bash

# Capture App API Test Script
# Make sure the dev server is running: npm run dev

BASE_URL="http://localhost:8080/api"

# Generate a test JWT token (you'll need to use a real one in production)
# For testing, you can generate one using: node -e "const jwt = require('jsonwebtoken'); console.log(jwt.sign({id: 'test-user-123', email: 'test@example.com'}, 'your-secret-key-change-in-production', {expiresIn: '7d'}))"
# Or use the one below (valid for 7 days from creation)
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QtdXNlci0xMjMiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpYXQiOjE3MzQ0NTY3ODksImV4cCI6MTczNTA2MTU4OX0.Xkm1pQRx5HkKZFnQ9zRYq6P0WqV3HqN5VqX0X9K8L4s"

echo "🧪 Testing Capture App API with Authentication"
echo "=============================================="
echo ""

# 1. Create a teammate
echo "1️⃣  Creating teammate..."
TEAMMATE_RESPONSE=$(curl -s -X POST "$BASE_URL/teammates" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "teammate": {
      "name": "John Doe"
    }
  }')
echo "$TEAMMATE_RESPONSE" | jq .
TEAMMATE_ID=$(echo "$TEAMMATE_RESPONSE" | jq -r '.data.teammate.id')
echo "✅ Created teammate with ID: $TEAMMATE_ID"
echo ""

# 2. Get all teammates (with pagination)
echo "2️⃣  Getting all teammates (page 1, limit 10)..."
curl -s "$BASE_URL/teammates?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN" | jq .
echo ""

# 3. Get feedback form for teammate
echo "3️⃣  Getting feedback form for teammate..."
curl -s "$BASE_URL/feedback/$TEAMMATE_ID" \
  -H "Authorization: Bearer $TOKEN" | jq .
echo ""

# 4. Submit feedback
echo "4️⃣  Submitting feedback..."
FEEDBACK_RESPONSE=$(curl -s -X POST "$BASE_URL/feedback/$TEAMMATE_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "feedback": [
      {
        "categoryId": 1,
        "questions": [
          {
            "id": 1,
            "answer": {
              "value": 1,
              "comment": "Excellent communication skills!"
            }
          },
          {
            "id": 2,
            "answer": {
              "value": 1,
              "comment": "Very attentive listener"
            }
          }
        ]
      },
      {
        "categoryId": 2,
        "questions": [
          {
            "id": 4,
            "answer": {
              "value": 1,
              "comment": "Strong technical abilities"
            }
          }
        ]
      }
    ]
  }')
echo "$FEEDBACK_RESPONSE" | jq .
REVIEW_ID=$(echo "$FEEDBACK_RESPONSE" | jq -r '.data.reviewId')
echo "✅ Created feedback with review ID: $REVIEW_ID"
echo ""

# 5. Get feedback with existing answers
echo "5️⃣  Getting feedback with existing review..."
curl -s "$BASE_URL/feedback/$TEAMMATE_ID?reviewId=$REVIEW_ID" \
  -H "Authorization: Bearer $TOKEN" | jq .
echo ""

# 6. Update feedback
echo "6️⃣  Updating feedback..."
curl -s -X PUT "$BASE_URL/feedback/$TEAMMATE_ID/$REVIEW_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "feedback": [
      {
        "categoryId": 1,
        "questions": [
          {
            "id": 1,
            "answer": {
              "value": 1,
              "comment": "Updated: Outstanding communication!"
            }
          }
        ]
      }
    ]
  }' | jq .
echo ""

# 7. Test without authentication (should fail)
echo "7️⃣  Testing without auth (should fail with 401)..."
curl -s "$BASE_URL/teammates" | jq .
echo ""

# 8. Test with invalid token (should fail)
echo "8️⃣  Testing with invalid token (should fail with 401)..."
curl -s "$BASE_URL/teammates" \
  -H "Authorization: Bearer invalid-token" | jq .
echo ""

echo "✅ All tests completed!"
echo ""
echo "🗑️  Clean up:"
echo "   curl -X DELETE $BASE_URL/feedback/$TEAMMATE_ID/$REVIEW_ID -H \"Authorization: Bearer $TOKEN\""
echo ""
echo "💡 To generate a new token, run:"
echo "   node -e \"const jwt = require('jsonwebtoken'); console.log(jwt.sign({id: 'test-user-123', email: 'test@example.com'}, 'your-secret-key-change-in-production', {expiresIn: '7d'}))\""

