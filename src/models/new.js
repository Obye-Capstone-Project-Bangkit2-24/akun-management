// const dbPool = require("../config/database.js");
// const bcrypt = require('bcryptjs'); // Tambahkan library bcrypt

// //READ
// const getAllUsers = () => {
//   const SQLQuery = "SELECT idusers, name, email FROM users"; // Hindari mengembalikan password
//   return dbPool.execute(SQLQuery);
// };

// //GET USER PROFILE
// const getUserProfile = (idUsers) => {
//     const SQLQuery = `SELECT idusers, name, email FROM users 
//                     WHERE idusers = ?`; // Gunakan prepared statement
//     return dbPool.execute(SQLQuery, [idUsers]);
// };

// //CREATE USER (Dengan Hashing)
// const createNewUser = async (body) => {
//   try {
//     // 1. Validasi input dasar
//     if (!body.name || !body.email || !body.password) {
//       throw new Error('Nama, email, dan password wajib diisi');
//     }

//     // 2. Cek apakah email sudah terdaftar
//     const [existingUsers] = await dbPool.execute(
//       'SELECT * FROM users WHERE email = ?', 
//       [body.email]
//     );

//     if (existingUsers.length > 0) {
//       throw new Error('Email sudah terdaftar');
//     }

//     // 3. Hash password
//     // - saltRounds menentukan kompleksitas hashing (10-12 biasanya cukup)
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(body.password, saltRounds);

//     // 4. Simpan user dengan password ter-hash
//     const SQLQuery = `INSERT INTO users (name, email, password) 
//                       VALUES (?, ?, ?)`;

//     return dbPool.execute(SQLQuery, [
//       body.name, 
//       body.email, 
//       hashedPassword // Simpan password yang sudah di-hash
//     ]);

//   } catch (error) {
//     // Tangani error dengan baik
//     console.error('Error saat membuat user:', error);
//     throw error;
//   }
// };

// //LOGIN (Tambahan untuk proses autentikasi)
// const loginUser = async (email, password) => {
//   try {
//     // 1. Cari user berdasarkan email
//     const [users] = await dbPool.execute(
//       'SELECT * FROM users WHERE email = ?', 
//       [email]
//     );

//     // 2. Jika user tidak ditemukan
//     if (users.length === 0) {
//       throw new Error('User tidak ditemukan');
//     }

//     // 3. Ambil user pertama (asumsi email unik)
//     const user = users[0];

//     // 4. Bandingkan password yang diinput dengan hash tersimpan
//     const isPasswordValid = await bcrypt.compare(
//       password, 
//       user.password
//     );

//     // 5. Jika password valid, kembalikan data user (tanpa password)
//     if (isPasswordValid) {
//       const { password, ...userWithoutPassword } = user;
//       return userWithoutPassword;
//     } else {
//       throw new Error('Password salah');
//     }

//   } catch (error) {
//     console.error('Error saat login:', error);
//     throw error;
//   }
// };

// //UPDATE (Dengan pertimbangan keamanan)
// const updateUser = async (body, idUsers) => {
//   try {
//     // 1. Siapkan data yang bisa diupdate
//     const updateData = {
//       name: body.name,
//       email: body.email
//     };

//     // 2. Jika password diubah, hash password baru
//     if (body.password) {
//       const saltRounds = 10;
//       updateData.password = await bcrypt.hash(body.password, saltRounds);
//     }

//     // 3. Buat query dinamis
//     const setClauses = Object.keys(updateData)
//       .map(key => `${key} = ?`)
//       .join(', ');

//     const SQLQuery = `UPDATE users 
//                       SET ${setClauses}
//                       WHERE idusers = ?`;

//     // 4. Eksekusi query dengan parameter
//     const values = [...Object.values(updateData), idUsers];
//     return dbPool.execute(SQLQuery, values);

//   } catch (error) {
//     console.error('Error saat update user:', error);
//     throw error;
//   }
// };

// //DELETE
// const deleteUser = (idUsers) => {
//     const SQLQuery = `DELETE FROM users WHERE idusers = ?`;
//     return dbPool.execute(SQLQuery, [idUsers]);
// }

// module.exports = {
//   getAllUsers,
//   createNewUser,
//   updateUser,
//   deleteUser,
//   getUserProfile,
//   loginUser // Tambahkan fungsi login
// };