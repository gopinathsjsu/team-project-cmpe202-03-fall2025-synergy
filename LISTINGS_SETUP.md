# Listings Page Setup - Complete Guide

## Overview
The `/listings` page at `http://localhost:5173/listings` fetches products from the database and displays them with pagination.

## Backend Configuration

### Endpoint
- **URL**: `GET http://localhost:8080/api/listings?page=0&size=10`
- **Controller**: `ListingsController.java`
- **Path**: `/listings` (with context-path `/api`, so full path is `/api/listings`)
- **Method**: `getListings(int page, int size)`

### Backend Files
1. **Controller**: `backend/src/main/java/com/example/app/controller/ListingsController.java`
   - `@RequestMapping("/listings")`
   - `@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})`
   - Returns `PaginatedResponse<Product>`

2. **Service**: `backend/src/main/java/com/example/app/service/ProductService.java`
   - Method: `getActiveProductsPaginated(int page, int size)`
   - Queries: `SELECT * FROM products ORDER BY created_at DESC LIMIT :limit OFFSET :offset`
   - Returns all products from the `products` table

3. **DTO**: `backend/src/main/java/com/example/app/dto/PaginatedResponse.java`
   - Contains: `content`, `page`, `size`, `totalElements`, `totalPages`, `first`, `last`

4. **Security**: `backend/src/main/java/com/example/app/config/SecurityConfig.java`
   - `/listings/**` is in `permitAll()`
   - CORS configured to allow `http://localhost:5173`

## Frontend Configuration

### API Service
- **File**: `frontend/src/services/productApi.ts`
- **Method**: `productApi.getListings(page, size)`
- **Base URL**: `/api` (proxied to `http://localhost:8080` via Vite)
- **Full URL**: `/api/listings?page=0&size=10`

### Page Component
- **File**: `frontend/src/pages/ListingsPage.tsx`
- **Route**: `/listings` (public route, no authentication required)
- **Features**:
  - Fetches listings on mount and when page/size changes
  - Displays products in responsive grid (1 col mobile, 2 cols tablet, 3 cols desktop)
  - Shows loading spinner while fetching
  - Error handling with retry button
  - Pagination component with page numbers and Previous/Next buttons
  - Page size selector (10 or 20 items per page)

### Pagination Component
- **File**: `frontend/src/components/Pagination.tsx`
- **Features**:
  - Page number buttons with ellipsis for large page counts
  - Previous/Next buttons
  - Page size dropdown (10 or 20)
  - Shows "Showing X to Y of Z listings"

## Data Flow

1. User visits `http://localhost:5173/listings`
2. `ListingsPage` component mounts
3. `useEffect` triggers `fetchListings(0, 10)`
4. Frontend calls `productApi.getListings(0, 10)`
5. Axios makes GET request to `/api/listings?page=0&size=10`
6. Vite proxy forwards to `http://localhost:8080/api/listings?page=0&size=10`
7. Backend `ListingsController.getListings()` receives request
8. `ProductService.getActiveProductsPaginated()` queries database
9. Returns `PaginatedResponse<Product>` with products array
10. Frontend receives response and updates state
11. Products are displayed in grid with pagination controls

## Testing

### Check Backend
1. Ensure Spring Boot is running on port 8080
2. Check logs for: `GET /listings - page: 0, size: 10`
3. Verify database has products: `SELECT COUNT(*) FROM products;`

### Check Frontend
1. Open `http://localhost:5173/listings`
2. Open browser console (F12)
3. Look for logs:
   - `[ListingsPage] Component mounted`
   - `[ListingsPage] Fetching listings - page: 0 size: 10`
   - `[productApi] Fetching listings from: /api/listings?page=0&size=10`
   - `[API Request] GET /listings`
   - `[API Response] 200 /listings`
   - `[ListingsPage] Received response: {...}`

### Common Issues

1. **404 Not Found**
   - Check backend is running: `curl http://localhost:8080/api/listings?page=0&size=10`
   - Verify context-path in `application.yml` is `/api`
   - Check controller has `@RequestMapping("/listings")`

2. **CORS Error**
   - Verify `@CrossOrigin` annotation on controller
   - Check `SecurityConfig` has CORS configuration
   - Ensure `http://localhost:5173` is in allowed origins

3. **No Products Displayed**
   - Check database has products with `SELECT * FROM products;`
   - Verify products have required fields (name, price, etc.)
   - Check browser console for API response data

4. **Network Error**
   - Verify backend is running on port 8080
   - Check Vite proxy configuration in `vite.config.ts`
   - Ensure no firewall blocking localhost:8080

## Files Modified

### Backend
- `backend/src/main/java/com/example/app/controller/ListingsController.java` (created)
- `backend/src/main/java/com/example/app/service/ProductService.java` (added pagination method)
- `backend/src/main/java/com/example/app/dto/PaginatedResponse.java` (created)
- `backend/src/main/java/com/example/app/config/SecurityConfig.java` (added `/listings/**`)

### Frontend
- `frontend/src/pages/ListingsPage.tsx` (updated with pagination)
- `frontend/src/components/Pagination.tsx` (created)
- `frontend/src/services/productApi.ts` (added `getListings` method)
- `frontend/src/App.tsx` (made `/listings` public route)

## Next Steps

1. Test the endpoint: Open `http://localhost:5173/listings`
2. Check console logs for any errors
3. Verify products are displayed correctly
4. Test pagination by clicking page numbers
5. Test page size change (10 vs 20)
6. Verify loading spinner appears during fetch
7. Test error handling by stopping backend and checking error message

