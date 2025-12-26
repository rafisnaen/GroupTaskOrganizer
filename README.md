# Group Task Organizer
Final Project Submission untuk GDGoC Backend Workshop 2025/2026. <br>
<hr>

📺Demo : [Link Here](https://youtu.be/7k9d8yVUSls)

## Fitur
- **User Management**: Create, Read, Delete User.
- **Task Management**: Create, Read, Update, Delete Tasks per User.
- **Relational DB**: Setiap task terhubung dengan user tertentu.

## Tech Stack
### Backend
- **Language**: Golang (1.25.5)
- **Database**: Supabase (PostgreSQL)
- **Router:** net/http (Standard Library)
### Frontend
- **Framework:** Next.js
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React

## Implementasi API
- Base URL: `http://localhost:8080`
### User Endpoints
| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/users` | Ambil daftar semua user yang ada |
| `POST` | `/users` | Tambah user baru |
| `DELETE`| `/users/{id}` | Menghapus user berdasarkan ID (Data task terkait akan ikut terhapus karena cascade) |
### Task Endpoints
| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/users/{id}/tasks` | Ambil daftar semua user yang ada |
| `POST` | `/users/{id}/tasks` | Tambah task baru untuk user tertentu |
| `PUT` | `/tasks{id}` | Update detail task |
| `DELETE`| `/tasks/{id}` | Hapus task berdasarkan Task ID |
## Setup & Instalasi
1. **Clone Repository**
     ```bash
       git clone https://github.com/rafisnaen/GroupTaskOrganizer.git
       cd <GroupTaskOrganizer>
     ```
2. **Setup Database**  
   - Buka [Supabase](https://supabase.com/) dan login/signup dengan akun github  
   - Buat organisasi dan project serta password
   - Masuk ke SQL Editor, ketik query berikut lalu CTRL + A, CTRL + Enter:  
     ```
          CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          role VARCHAR(100) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE tasks (
          id SERIAL PRIMARY KEY,
          user_id INT REFERENCES users(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          status VARCHAR(50) CHECK (status IN ('todo', 'progress', 'done')), 
          deadline DATE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
     ```
3. Install dependencies:
     ```
     go mod tidy
     ```
4. Buat file .env dan isi dengan Connection String berikut (Transaction pooler method):
     ```
     DB_URL=postgresql://postgres:[PASSWORD]@[aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres](https://aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres)
     PORT=8080
     ```
5. Jalankan project
     ```
     go run main.go
     dengan terminal baru -> npm run dev
     ```
