# API Documentation

## ML Prediction API

### Endpoint
```
POST https://model-inference-api-521423942017.europe-west1.run.app/predict
```

### Description
The ML Prediction API provides skin lesion analysis using a trained machine learning model. It accepts skin lesion images and returns prediction results with confidence scores.

### Request

#### Headers
```
Content-Type: multipart/form-data
```

#### Body
- **file**: Image file (JPEG, PNG, or WebP)
  - **uri**: Local file path or data URI
  - **name**: File name (e.g., "photo.jpg")
  - **type**: MIME type (e.g., "image/jpeg")

#### Example Request
```javascript
const formData = new FormData();
formData.append('file', {
  uri: imageUri,
  name: 'photo.jpg',
  type: 'image/jpeg',
});

const response = await fetch(`${API_BASE_URL}/predict`, {
  method: 'POST',
  body: formData,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
```

### Response

#### Success Response (200 OK)
```json
{
  "predicted_class": 0,
  "confidence": 0.92,
  "status": "success"
}
```

#### Error Response (4xx/5xx)
```json
{
  "status": "error",
  "error": "Error message description"
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `predicted_class` | Integer | Prediction class (0 = Low Risk, 1 = High Risk) |
| `confidence` | Float | Confidence score (0.0 - 1.0) |
| `status` | String | Response status ("success" or "error") |
| `error` | String | Error message (only present on error) |

### Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid image format or missing file |
| 413 | Payload Too Large - Image file too large |
| 500 | Internal Server Error - Model inference failed |
| 503 | Service Unavailable - Model service temporarily unavailable |

## Supabase API

### Authentication

#### Sign Up
```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
});
```

#### Sign In
```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});
```

#### Sign Out
```javascript
const { error } = await supabase.auth.signOut();
```

### Database Operations

#### Insert Scan Record
```javascript
const { data, error } = await supabase
  .from('scans')
  .insert([
    {
      spot_id: spotId,
      image_url: imageUrl,
      prediction: 'Low Risk',
      confidence: 0.92,
      low_risk_probability: 0.92,
      high_risk_probability: 0.08,
      scanned_at: new Date().toISOString(),
    }
  ]);
```

#### Get User Scan History
```javascript
const { data, error } = await supabase
  .from('scans')
  .select(`
    *,
    spot:spot_id (
      user_id
    )
  `)
  .eq('spot.user_id', userId);
```

### Storage Operations

#### Upload Image
```javascript
const { data, error } = await supabase.storage
  .from('lesion-images')
  .upload(`public/${Date.now()}.jpg`, base64Data, {
    cacheControl: '3600',
    upsert: false,
    contentType: 'image/jpeg',
  });
```

#### Get Public URL
```javascript
const { data } = supabase.storage
  .from('lesion-images')
  .getPublicUrl(fileName);
```

## Environment Variables

### Required Variables
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SCORING_API_URL=https://model-inference-api-521423942017.europe-west1.run.app
```

### Optional Variables
```env
EXPO_PUBLIC_APP_ENV=development
EXPO_PUBLIC_DEBUG_MODE=true
```

## Rate Limits

### ML Prediction API
- **Requests per minute**: 60
- **File size limit**: 10MB
- **Supported formats**: JPEG, PNG, WebP

### Supabase
- **Database requests**: 1000 per hour (free tier)
- **Storage uploads**: 1GB per month (free tier)
- **Authentication requests**: 1000 per hour (free tier)

## Error Handling

### Network Errors
```javascript
try {
  const response = await fetch(apiUrl, options);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
} catch (error) {
  console.error('API request failed:', error);
  // Handle error appropriately
}
```

### Retry Logic
```javascript
const retryRequest = async (fn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
```

## Testing

### API Testing Endpoints

#### Health Check
```
GET https://model-inference-api-521423942017.europe-west1.run.app/health
```

#### Test Prediction
```bash
curl -X POST \
  -F "file=@test-image.jpg" \
  https://model-inference-api-521423942017.europe-west1.run.app/predict
```

### Mock Data
For development and testing, the app includes mock prediction data:
```javascript
{
  prediction: 'Low Risk',
  confidence: 0.92,
  probabilities: {
    'Low Risk': 0.92,
    'High Risk': 0.08,
  }
}
```

## Security Considerations

1. **API Keys**: Never expose API keys in client-side code
2. **Image Data**: Images are uploaded to Supabase storage for security
3. **Authentication**: All database operations require valid user session
4. **HTTPS**: All API communications use HTTPS
5. **Input Validation**: All inputs are validated before processing

## Performance Optimization

1. **Image Compression**: Images are resized to 224x224 before upload
2. **Caching**: Implement caching for frequently accessed data
3. **Batch Operations**: Use batch operations for multiple database queries
4. **Lazy Loading**: Load data on-demand to reduce initial load time
