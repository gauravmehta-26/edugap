# EduGap Backend API

Simple, reliable backend for the EduGap hackathon MVP.

## Tech Stack
- Next.js API Routes
- TypeScript
- MongoDB (optional, with Mongoose)

## API Endpoints

### 1. POST /api/analyze
Analyzes quiz answers and returns learning gaps.

**Request:**
```json
{
  "answers": [
    { "questionId": 1, "selectedOption": 2 },
    { "questionId": 2, "selectedOption": 1 }
  ]
}
```

**Response:**
```json
{
  "failureRisk": 75,
  "weakConcepts": ["Electrostatics", "Kinematics"],
  "summary": "High risk due to multiple weak concepts.",
  "correctAnswers": 3,
  "totalQuestions": 5
}
```

### 2. POST /api/remediate
Returns AI-style remediation content for a concept.

**Request:**
```json
{
  "concept": "Electrostatics"
}
```

**Response:**
```json
{
  "concept": "Electrostatics",
  "explanation": "Detailed explanation...",
  "example": "Worked example...",
  "commonMistake": "Common mistake...",
  "tip": "Quick exam tip..."
}
```

### 3. POST /api/saveResult (Optional)
Saves quiz results to database.

**Request:**
```json
{
  "email": "student@example.com",
  "failureRisk": 75,
  "weakConcepts": ["Electrostatics"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Result saved successfully",
  "saved": true,
  "id": "..."
}
```

### 4. GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-29T...",
  "database": "connected",
  "message": "EduGap API is running"
}
```

## Setup

### Without Database (Recommended for Demo)
No setup needed! The API works without MongoDB.

### With Database (Optional)
1. Create a `.env.local` file:
```
MONGODB_URI=mongodb://localhost:27017/edugap
```

2. Or use MongoDB Atlas:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/edugap
```

## Testing the API

### Using curl:

```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Test analyze endpoint
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"answers":[{"questionId":1,"selectedOption":0},{"questionId":2,"selectedOption":1}]}'

# Test remediate endpoint
curl -X POST http://localhost:3000/api/remediate \
  -H "Content-Type: application/json" \
  -d '{"concept":"Electrostatics"}'

# Test saveResult endpoint
curl -X POST http://localhost:3000/api/saveResult \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","failureRisk":75,"weakConcepts":["Electrostatics"]}'
```

### Using JavaScript (Frontend):

```javascript
// Analyze quiz
const analyzeResponse = await fetch('/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    answers: [
      { questionId: 1, selectedOption: 0 },
      { questionId: 2, selectedOption: 1 }
    ]
  })
});
const result = await analyzeResponse.json();

// Get remediation
const remediateResponse = await fetch('/api/remediate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ concept: 'Electrostatics' })
});
const remediation = await remediateResponse.json();
```

## File Structure

```
/app/api/
  /analyze/route.ts       - Quiz analysis endpoint
  /remediate/route.ts     - Remediation content endpoint
  /saveResult/route.ts    - Save results endpoint
  /health/route.ts        - Health check endpoint
/lib/
  db.ts                   - Database connection
/models/
  UserResult.ts           - User result schema
```

## Features

✅ Simple rule-based quiz analysis
✅ Predefined remediation content
✅ Optional database storage
✅ Graceful degradation (works without DB)
✅ Proper error handling
✅ TypeScript types
✅ Demo-safe and predictable

## Demo Tips

1. **Without Database**: Just run `npm run dev` - everything works!
2. **With Database**: Set `MONGODB_URI` in `.env.local`
3. **Error Handling**: API returns success even if DB fails
4. **Predictable**: Same inputs always give same outputs
5. **Fast**: No external API calls, instant responses

## Troubleshooting

**Q: Database not connecting?**
A: That's fine! The app works without it. Check `/api/health` to verify.

**Q: Want to add more concepts?**
A: Edit `REMEDIATION_CONTENT` in `/app/api/remediate/route.ts`

**Q: Want to change risk calculation?**
A: Edit the logic in `/app/api/analyze/route.ts`

## Production Notes

This is a hackathon MVP. For production:
- Add authentication
- Add rate limiting
- Add input validation library (Zod)
- Add proper logging
- Add caching
- Add real AI integration
- Add comprehensive tests
