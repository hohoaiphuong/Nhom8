Quick run steps for frontend-user

1. Ensure backend is running (Laravel):

   cd "C:/Users/phuong/Desktop/CodeLaravel/nhom8-backend-laravel"
   php artisan serve --port=8000

2. Install and run frontend:

   cd "C:/Users/phuong/Downloads/NHÓM8/frontend-user"
   npm install
   npm run dev

Notes:
- `.env` already set to `VITE_API_URL=http://localhost:8000/api`.
- If your backend runs on a different port, edit `.env` accordingly and restart the frontend dev server.
- If you still see no data, open browser DevTools → Network and check requests to `${VITE_API_URL}/books` for errors.
