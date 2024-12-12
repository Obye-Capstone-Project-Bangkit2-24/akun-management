# Akun Management

Repository ini bertujuan untuk menyediakan REST API yang dapat mengelola pengguna dan terhubung dengan database di Cloud SQL untuk aplikasi Obye.

## Fitur Proyek

### API Endpoint
- **POST /users**: Membuat user baru.
- **GET /users**: Melihat semua user.
- **GET /users/{idUser}**: Melihat user dengan ID tertentu.
- **PATCH /users/{idUser}**: Mengubah informasi user dengan ID tertentu.
- **DELETE /users/{idUser}**: Menghapus user dengan ID tertentu.

## Cara Menjalankan Proyek
1. Clone repository ini:
   ```bash
   git clone https://github.com/Obye-Capstone-Project-Bangkit2-24/akun-management.git
   ```
2. Masuk ke direktori proyek:
   ```bash
   cd akun-management
   ```
3. Install dependensi:
   ```bash
   npm install
   ```
4. Jalankan aplikasi:
   ```bash
   npm start
   ```

## Tech Stack
- **JavaScript**: Bahasa pemrograman utama.
- **Node.js**: Runtime environment.
- **Express.js**: Framework untuk membangun REST API.
- **MySQL2**: Connector untuk MySQL.
- **dotenv**: Loader file `.env`.
- **bcrypt**: Untuk hashing password.
- **nodemon**: Untuk menjalankan server selama pengembangan.
