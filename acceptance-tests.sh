#!/bin/sh
set -e

echo "Starting acceptance tests in 15s..."
sleep 15

# Generate unique test credentials using timestamp
TIMESTAMP=$(date +%s)
TEST_USER="TestUser_$TIMESTAMP"
TEST_EMAIL="test_$TIMESTAMP@example.com"
TEST_PASSWORD="TestPassword1234@"

# [ -f .env ] && export $(grep -v '^#' .env | xargs)
# API_URL="http://localhost:3000"
API_URL="http://${HOST}:${PORT}"
echo "Testing API at: ${API_URL}"

echo "Checking MongoDB connection..."
if ! nc -z mongo 27017; then
  echo "ERROR: MongoDB is not reachable at mongo:27017"
  exit 1
fi

# Create unique test user
echo "Creating test user..."
RESPONSE=$(curl -s -X POST "$API_URL/QatuService/v1/users" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "'"$TEST_USER"'",
    "email": "'"$TEST_EMAIL"'",
    "role": "admin",
    "password": "'"$TEST_PASSWORD"'"
  }')

echo "User creation response:"
echo "$RESPONSE" | jq .

USER_ID=$(echo "$RESPONSE" | jq -r '.data.id')
if [ -z "$USER_ID" ] || [ "$USER_ID" = "null" ]; then
  echo "Error: User creation failed"
  exit 1
fi
echo "Created user ID: $USER_ID"

# Get authentication token
echo "Getting authentication token..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/QatuService/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'"$TEST_EMAIL"'",
    "password": "'"$TEST_PASSWORD"'"
  }')

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token')
if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo "Error: Failed to get authentication token"
  echo "Login response:"
  echo "$LOGIN_RESPONSE" | jq .
  exit 1
fi
echo "Token obtained: $TOKEN"

# Define endpoints to test
public_endpoints="
/QatuService/v1/products
"

private_endpoints="
/QatuService/v1/users
"

# Test public endpoints
echo "$public_endpoints" | while IFS= read -r endpoint; do
    [ -z "$endpoint" ] && continue
    
    echo "Testing $endpoint"
    status_code=$(curl -s -o /dev/null -w "%{http_code}" \
        -H "Content-Type: application/json" \
        "$API_URL$endpoint")
    
    if [ "$status_code" -ne 200 ]; then
        echo "ERROR: $endpoint returned $status_code"
        exit 1
    fi
    echo "$endpoint (200 OK)"
done

# Test private endpoints
echo "$private_endpoints" | while IFS= read -r endpoint; do
    [ -z "$endpoint" ] && continue
    
    echo "Testing $endpoint"
    status_code=$(curl -s -o /dev/null -w "%{http_code}" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $TOKEN" \
        "$API_URL$endpoint")
    
    if [ "$status_code" -ne 200 ]; then
        echo "ERROR: $endpoint returned $status_code"
        exit 1
    fi
    echo "$endpoint (200 OK)"
done

echo "All tests passed successfully!"