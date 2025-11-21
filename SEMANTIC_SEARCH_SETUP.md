# Semantic Search Setup Guide

This guide explains how to set up and use the semantic search functionality for the Campus Marketplace.

## Overview

The semantic search uses:
- **pgvector** extension in PostgreSQL for vector similarity search
- **SentenceTransformer** model (`all-MiniLM-L6-v2`) for generating 384-dimensional embeddings
- **Python FastAPI microservice** for generating embeddings
- **Spring Boot backend** for handling search requests

## Setup Steps

### 1. Enable pgvector in PostgreSQL

Connect to your PostgreSQL database and run:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

Verify installation:
```sql
\dx
```

You should see `vector` in the list of extensions.

### 2. Run Database Migration

Run the migration script to create the products table with embedding column:

```bash
psql -h <your-db-host> -U postgres -d campus_marketplace -f database/migrate_semantic_search.sql
```

Or manually execute the SQL in `database/migrate_semantic_search.sql`.

### 3. Start the Embeddings Service

The embeddings service is a Python FastAPI microservice. You can run it in two ways:

#### Option A: Using Docker (Recommended)

```bash
cd embeddings-service
docker build -t embeddings-service .
docker run -p 8001:8001 embeddings-service
```

#### Option B: Using Python directly

```bash
cd embeddings-service
pip install -r requirements.txt
python main.py
```

The service will be available at `http://localhost:8001`

### 4. Configure Backend

The backend is already configured to use the embeddings service. The default URL is `http://localhost:8001`, which can be overridden in `application.yml`:

```yaml
embeddings:
  service:
    url: http://localhost:8001
```

### 5. Using Docker Compose (All Services)

To start all services including the embeddings service:

```bash
docker-compose up --build
```

This will start:
- PostgreSQL database
- Redis
- Embeddings service (port 8001)
- Backend API (port 8080)
- Frontend (port 5173)

## API Endpoints

### Search Products

```
GET /api/products/search?q=<query>&limit=<limit>
```

**Parameters:**
- `q` (optional): Search query text
- `limit` (optional): Maximum number of results (default: 10)

**Example:**
```bash
curl "http://localhost:8080/api/products/search?q=used%20phone&limit=10"
```

### Get Active Products

```
GET /api/products/active
```

Returns all active products.

## How It Works

1. **When a product is created/updated:**
   - The backend calls the embeddings service with the product's name + description
   - The embeddings service generates a 384-dimensional vector
   - The vector is stored in the `embedding` column as a string representation

2. **When a user searches:**
   - The search query is sent to the backend
   - The backend generates an embedding for the query
   - PostgreSQL performs a cosine similarity search using the `<->` operator
   - Results are ordered by similarity (most similar first)

## Testing

1. **Test the embeddings service:**
```bash
curl -X POST http://localhost:8001/embed \
  -H "Content-Type: application/json" \
  -d '{"text": "used phone"}'
```

2. **Test the search endpoint:**
```bash
curl "http://localhost:8080/api/products/search?q=used%20phone"
```

3. **Test from frontend:**
   - Navigate to `http://localhost:5173/listings`
   - Type a search query in the search box
   - Results will be displayed using semantic similarity

## Troubleshooting

### Embeddings service not responding
- Check if the service is running: `curl http://localhost:8001/health`
- Check Docker logs: `docker logs campus-marketplace-embeddings`

### No search results
- Ensure products have embeddings (check `embedding` column is not NULL)
- Verify pgvector extension is installed: `\dx` in psql
- Check backend logs for errors

### Slow search performance
- Ensure the `products_embedding_idx` index is created (see migration SQL)
- Consider adjusting the `lists` parameter in the index for your data size

## Notes

- The first time the embeddings service starts, it will download the model (~80MB)
- Embeddings are generated automatically when products are created/updated
- The search is case-insensitive and handles semantic similarity (e.g., "phone" matches "smartphone", "mobile device", etc.)

