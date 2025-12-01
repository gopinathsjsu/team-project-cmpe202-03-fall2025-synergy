# Fix: Create Listing Page "Not Found" Error

## Issue
Getting "not found" error when accessing `http://localhost:5173/create-listing`

## Solution

The route is **protected** and requires authentication. If you're not logged in, you'll be redirected to login.

### Option 1: Log In First (Recommended)

1. **Go to login page:**
   ```
   http://localhost:5173/login
   ```

2. **Log in with your credentials**

3. **Then go to create listing:**
   ```
   http://localhost:5173/create-listing
   ```

### Option 2: Check if You're Logged In

**Open browser console (F12) and run:**
```javascript
console.log('Token:', localStorage.getItem('token'));
console.log('UserAuth:', localStorage.getItem('userAuth'));
```

**If both are null or userAuth is not 'true':**
- You need to log in first

### Option 3: Make Route Public (For Testing Only)

If you want to test without logging in, temporarily make it public:

**Edit `frontend/src/App.tsx`:**
```tsx
// Change from:
<Route 
  path="/create-listing" 
  element={
    <ProtectedRoute>
      <CreateListingPage />
    </ProtectedRoute>
  } 
/>

// To:
<Route path="/create-listing" element={<CreateListingPage />} />
```

**⚠️ Warning:** This removes authentication requirement. Only do this for testing!

## Verify Route is Working

1. **Check if frontend is running:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Check browser console for errors**

3. **Try accessing:**
   - `http://localhost:5173/` (should work)
   - `http://localhost:5173/login` (should work)
   - `http://localhost:5173/create-listing` (requires login)

## Common Issues

### Issue: "404 Page not found"
**Cause:** Not logged in, and redirect isn't working
**Fix:** Log in first, then access the page

### Issue: Route not matching
**Cause:** Typo in URL or route definition
**Fix:** Check URL is exactly `/create-listing` (no trailing slash)

### Issue: Frontend not running
**Cause:** Dev server stopped
**Fix:** Restart with `npm run dev`

## Quick Test

1. **Go to:** `http://localhost:5173/login`
2. **Log in**
3. **Then go to:** `http://localhost:5173/create-listing`
4. **Should work!** ✅

