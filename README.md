# ShopSphere — Ecommerce + DevOps learning project

A React/Vite storefront, Express API, and MongoDB-backed product catalog. Static image assets are stored separately and can be served from Amazon S3/CloudFront.

## Prerequisites
- Node.js LTS and npm
- MongoDB Community Server locally, or an accessible MongoDB instance
- Git
- For later phases: Docker, Docker Hub account, existing kubeadm cluster on EC2, and a separate Jenkins EC2 instance

## Run locally

### Backend
```bash
cd backend
cp .env.example .env   # Windows PowerShell: Copy-Item .env.example .env
npm install
npm run dev
```
Backend: http://localhost:5000; health: http://localhost:5000/api/health; products: http://localhost:5000/api/products.

### Frontend
In another terminal:
```bash
cd frontend
cp .env.example .env   # Windows PowerShell: Copy-Item .env.example .env
npm install
npm run dev
```
Open http://localhost:5173.

## S3 image hosting
The frontend defaults to `/assets` so local development uses `frontend/public/assets`. To serve assets from S3/CloudFront, set `VITE_ASSET_BASE_URL` before building the frontend, for example:
`VITE_ASSET_BASE_URL=https://YOUR_CLOUDFRONT_DOMAIN/assets`
or `https://YOUR_BUCKET.s3.ap-south-1.amazonaws.com/assets` if the bucket is configured for public read (not the preferred production setup).

Upload:
```bash
aws s3 sync frontend/public/assets s3://YOUR_BUCKET/assets --delete
```
Do not upload secrets or application `.env` files. For production, prefer a private S3 bucket with CloudFront Origin Access Control (OAC), HTTPS, and a suitable cache policy. Configure CORS only if your browser use case requires it; ordinary `<img src>` image loading usually does not require CORS unless canvas access is involved.

## Docker (Phase 2)
Build images from repository root:
```bash
docker build -t YOUR_DOCKERHUB_USER/shopsphere-backend:dev ./backend
docker build --build-arg VITE_API_URL=http://localhost:5000/api --build-arg VITE_ASSET_BASE_URL=/assets -t YOUR_DOCKERHUB_USER/shopsphere-frontend:dev ./frontend
```
The frontend build argument is baked into the static bundle. In Kubernetes, use an Ingress host or another reachable API URL; `localhost` inside a user's browser is their own computer and is not correct for a deployed site.

## Security notes
- Never commit `.env`, MongoDB credentials, or registry credentials.
- Do not expose MongoDB publicly. For Kubernetes practice, use a dedicated namespace, persistent storage, and Kubernetes Secrets or an external secret manager.
- This is a learning starter, not a production-ready payment/authentication system.
