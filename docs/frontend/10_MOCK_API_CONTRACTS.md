OBSOLETE — SUPERSEDED BY CURRENT FRONTEND ARCHITECTURE

# 10 Mock API Contracts

This document defines the mock API contracts required for developing the frontend without depending on the live backend, fulfilling Rule 54.

## 1. Global Setup
Base Path: `/api/v1`

All responses follow the standard Parther API envelope:
```json
{
  "success": true,
  "data": { ... },
  "message": ""
}
// OR
{
  "success": false,
  "code": "ERROR_CODE",
  "message": "Error details",
  "statusCode": 400
}
```

## 2. Authentication Contracts

### `POST /auth/login`
**Request:**
```json
{ "phone": "+919876543210" }
```
**Response:**
```json
{
  "success": true,
  "data": { "otpSent": true, "mockOtp": "123456" }
}
```

### `POST /auth/verify`
**Request:**
```json
{ "phone": "+919876543210", "otp": "123456" }
```
**Response:**
```json
{
  "success": true,
  "data": {
    "token": "mock_jwt_token",
    "user": {
      "id": "usr_123",
      "phone": "+919876543210",
      "userType": "HIRER",
      "organizationType": "OTHER",
      "profileComplete": true
    }
  }
}
```

## 3. Service Catalog Contracts

### `GET /catalog/categories`
**Response:**
```json
{
  "success": true,
  "data": [
    { "id": "electrician", "name": "Electrician", "icon": "/services-icons-images/electrician.webp" },
    { "id": "plumber", "name": "Plumber", "icon": "/services-icons-images/plumber.webp" }
  ]
}
```

### `GET /catalog/categories/:categoryId/services`
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "sectionId": "sec_1",
      "title": "Switch & socket",
      "services": [
        {
          "id": "srv_1",
          "title": "Switch/socket repair & replacement",
          "rating": "4.83",
          "reviews": "196K",
          "price": 69,
          "optionsCount": 3,
          "image": "https://picsum.photos/200?random=20"
        }
      ]
    }
  ]
}
```

## 4. Booking & Gigs Contracts

### `GET /catalog/categories/:categoryId/schema`
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "serviceType",
      "label": "Service Type",
      "type": "select",
      "options": ["Fault Finding & Repair", "Switchboard / Socket Wiring"]
    }
  ]
}
```

### `POST /gigs/draft`
**Request:**
```json
{
  "categoryId": "electrician",
  "serviceItems": [{ "id": "srv_1", "quantity": 1 }],
  "schemaResponses": {
    "serviceType": "Fault Finding & Repair"
  }
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "draftId": "drf_123",
    "estimatedPrice": 149
  }
}
```
