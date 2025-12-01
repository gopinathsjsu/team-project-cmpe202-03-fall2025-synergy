# Backend Fix Summary

## Issues Fixed

### 1. **RestTemplate Bean Missing**
   - **File:** `backend/src/main/java/com/example/app/config/SecurityConfig.java`
   - **Issue:** `RestTemplate` bean was commented out, but `EmbeddingService` requires it
   - **Fix:** Uncommented and restored the `RestTemplate` bean
   - **Impact:** Backend will now start successfully without dependency injection errors

### 2. **Enhanced Error Handling in Frontend**
   - **Files:** 
     - `frontend/src/pages/LoginPage.tsx`
     - `frontend/src/pages/RegisterPage.tsx`
     - `frontend/src/services/authApi.ts`
   - **Changes:**
     - Added comprehensive network error detection
     - Better error messages for different scenarios
     - Added request/response logging for debugging
     - Added timeout configuration (10 seconds)

## How to Start Backend

### Option 1: Using Maven (Recommended)
```bash
cd backend
mvn spring-boot:run
```

### Option 2: Using Java directly
```bash
cd backend
mvn clean package
java -jar target/app-0.0.1-SNAPSHOT.jar
```

### Option 3: Using IDE
- Open the project in IntelliJ IDEA or Eclipse
- Run `CampusMarketplaceApplication.java` as a Spring Boot application

## Expected Startup Output

When the backend starts successfully, you should see:

```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.2.0)

... (configuration logs) ...

Tomcat started on port(s): 8080 (http) with context path '/api'
Started CampusMarketplaceApplication in X.XXX seconds
```

## Common Issues and Solutions

### Issue 1: Port 8080 Already in Use
**Error:** `Port 8080 is already in use`

**Solution:**
```bash
# Find process using port 8080
lsof -i :8080

# Kill the process (replace PID with actual process ID)
kill -9 <PID>

# Or change port in application.yml
server:
  port: 8081
```

### Issue 2: Database Connection Failed
**Error:** `Connection refused` or `FATAL: password authentication failed`

**Solution:**
1. Check database is running and accessible
2. Verify credentials in `application.yml`:
   ```yaml
   spring:
     datasource:
       url: jdbc:postgresql://database-1.cs3oc0aoqhwx.us-east-1.rds.amazonaws.com:5432/campus_marketplace
       username: postgres
       password: postgres
   ```
3. Test connection:
   ```bash
   psql -h database-1.cs3oc0aoqhwx.us-east-1.rds.amazonaws.com -U postgres -d campus_marketplace
   ```

### Issue 3: Missing Dependencies
**Error:** `ClassNotFoundException` or `NoClassDefFoundError`

**Solution:**
```bash
cd backend
mvn clean install
mvn dependency:resolve
```

### Issue 4: JWT Secret Key Too Short
**Error:** `The signing key's size is X bits which is not secure enough`

**Solution:**
- The default secret in `application.yml` is already 64+ characters, so this shouldn't occur
- If you see this, ensure the secret is at least 32 characters

### Issue 5: CORS Errors
**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution:**
- Already configured in `SecurityConfig.java` and `WebConfig.java`
- Verify `http://localhost:5173` is in allowed origins
- Check browser console for specific CORS error details

## Testing Backend

### 1. Health Check
```bash
curl http://localhost:8080/api/products
```

**Expected:** JSON array of products (or empty array `[]`)

### 2. Test Login Endpoint
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"test@example.com","password":"test123"}'
```

**Expected:** 
- If user exists: `{"token":"...","id":1,"username":"...","email":"..."}`
- If user doesn't exist: `{"error":"Invalid username/email or password"}`

### 3. Test Register Endpoint
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"test123","firstName":"Test","lastName":"User"}'
```

**Expected:** `{"token":"...","id":X,"username":"testuser","email":"test@example.com",...}`

## Verification Checklist

- [ ] Backend compiles without errors: `mvn clean compile`
- [ ] Backend starts without errors: `mvn spring-boot:run`
- [ ] Server listens on port 8080
- [ ] Database connection successful
- [ ] `/api/products` endpoint returns data
- [ ] `/api/auth/login` endpoint responds
- [ ] `/api/auth/register` endpoint responds
- [ ] CORS headers are present in responses
- [ ] No dependency injection errors in logs

## Files Modified

1. `backend/src/main/java/com/example/app/config/SecurityConfig.java`
   - Uncommented `RestTemplate` bean (required by `EmbeddingService`)

2. `frontend/src/pages/LoginPage.tsx`
   - Enhanced error handling for network errors

3. `frontend/src/pages/RegisterPage.tsx`
   - Enhanced error handling for network errors

4. `frontend/src/services/authApi.ts`
   - Added timeout configuration
   - Enhanced error handling
   - Added request/response logging

## Next Steps

1. **Start Backend:**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. **Verify Backend is Running:**
   - Check logs for "Started CampusMarketplaceApplication"
   - Test endpoint: `curl http://localhost:8080/api/products`

3. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

4. **Test Login:**
   - Go to http://localhost:5173/login
   - Try logging in
   - Check browser console for detailed logs

If you still encounter issues, check:
- Backend logs for specific error messages
- Database connectivity
- Port availability
- Browser console for network errors

