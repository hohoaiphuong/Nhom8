Quick run steps for frontend-admin

1. Ensure backend you want admin to talk to is running or accessible.
   - If local backend: run
     cd "C:/Users/phuong/Desktop/CodeLaravel/nhom8-backend-laravel"
     php artisan serve --port=8000

2. Create `.env` in admin frontend if you want to point to local backend:

   VITE_API_URL=http://localhost:8000/api

3. Install and run admin frontend:

   cd "C:/Users/phuong/Downloads/NHÓM8/frontend-admin"
   npm install
   npm run dev

Notes:
- `Books.jsx` now uses `VITE_API_URL` so admin and customer frontends will use the same API when both `.env` files point to the same backend.
- If admin still creates books that don't appear on customer site, make sure both frontends point to the same `VITE_API_URL` and that the backend is the same server (not one local and one deployed to Render).