#!/bin/sh
set -e

echo "Starting acceptance tests in 15s..."
sleep 15  # Esperar inicialización de servicios
[ -f .env ] && export $(grep -v '^#' .env | xargs)

API_URL="${API_URL:-http://${HOST}:${PORT}}"
# API_URL="http://localhost:3005"

# Crear admin

# Crear seller

# Obtener token de autenticación
echo "Obteniendo token de autenticación..."
echo "APi url base $API_URL"
echo "DEBUG: probando conexión a $API_URL/QatuService/v1/products"
curl -v "$API_URL/QatuService/v1/products"
# TOKEN=$(curl -s -X POST "$API_URL/QatuService/v1/auth/login" \
#   -H "Content-Type: application/json" \
#   -d '{
#     "email": "Eudes123@gmail.com",
#     "password": "eudes@1234"
#   }' | jq -r '.data.token')

# if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
#   echo "Error al obtener token de autenticación"
#   exit 1
# fi

# echo "Token obtenido: $TOKEN"


# PRODUCT=$(curl -s -X POST "$API_URL/QatuService/v1/products" \
#   -H "Content-Type: application/json" \
#   -d '{
#     "name": "Paldo Handler",
#     "description": "mi descripcion",
#     "imageUrl": "https://placehold.co/600x400/000000/FFFFFF/png",
#     "price": 50,
#     "amount": 34,
#     "category":"Sodas",
#     "vendorId":"68194fdd262185e14c3506f6"
#   }' | jq -r '.data.token')

# if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
#   echo "Error al obtener token de autenticación"
#   exit 1
# fi

# echo "Token obtenido: $TOKEN"

# Endpoints públicos (no requieren autenticación)
public_endpoints="
  /QatuService/v1/products
  /QatuService/v1/users
"
#     "/QatuService/v1/users"
#   "/QatuService/v1/products/681fbfd69e960b0f52797008"
#   "/QatuService/v1/products/681fbfd69e960b0f52797008/comments"

# Endpoints privados (requieren token)
# private_endpoints=(
#   "/QatuService/v1/applications"
#   "/QatuService/v1/applications/6846177c398d6718b3f1899c"
#   "/QatuService/v1/users/68194cd758e1d6ee61fe26d4"
# )

# Probar endpoints públicos
for endpoint in $public_endpoints; do
  echo "Testing $endpoint"
  status_code=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "Content-Type: application/json" \
    "$API_URL$endpoint")

  if [ "$status_code" -ne 200 ]; then
    echo "Error en $endpoint: Código $status_code"
    exit 1
  fi
  echo "$endpoint (200 OK)"
done

# Probar endpoints privados
# for endpoint in "${private_endpoints[@]}"; do
#   echo "Testing $endpoint"
#   status_code=$(curl -s -o /dev/null -w "%{http_code}" \
#     -H "Content-Type: application/json" \
#     -H "Authorization: Bearer $TOKEN" \
#     "$API_URL$endpoint")
  
#   if [ "$status_code" -ne 200 ]; then
#     echo "Error en $endpoint: Código $status_code"
#     exit 1
#   fi
#   echo "$endpoint (200 OK)"
# done

echo "Todas las pruebas pasaron!"