const dbPool = require("../config/database.js");
const bcrypt = require('bcryptjs');

//READ
const getAllUsers = () => {
  const SQLQuery = "SELECT idusers, name, email FROM users"; 
  return dbPool.execute(SQLQuery);
};

//GET USER PROFILE
const getUserProfile = (idUsers) => {
    const SQLQuery = `SELECT idusers, name, email FROM users 
                    WHERE idusers = ?`; 
    return dbPool.execute(SQLQuery, [idUsers]);
};

//CREATE USER (Dengan Hashing)
const createNewUser = async (body) => {
  try {
    const [existingUsers] = await dbPool.execute(
      'SELECT * FROM users WHERE email = ?', 
      [body.email]
    );

    if (existingUsers.length > 0) {
      // More descriptive error for duplicate email
      const error = new Error('Email sudah terdaftar');
      error.code = 'EMAIL_ALREADY_EXISTS';
      throw error;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);

    const SQLQuery = `INSERT INTO users (name, email, password) 
                      VALUES (?, ?, ?)`;

    return dbPool.execute(SQLQuery, [
      body.name, 
      body.email, 
      hashedPassword
    ]);

  } catch (error) {
    // Log full error for server-side tracking
    console.error('Detailed Error saat membuat user:', error);
    
    // Throw a more structured error object
    throw {
      message: error.message || 'Gagal membuat user',
      code: error.code || 'CREATE_USER_ERROR',
      originalError: error
    };
  }
}

//LOGIN 
// const loginUser = async (email, password) => {
//   try {
    
//     const [users] = await dbPool.execute(
//       'SELECT * FROM users WHERE email = ?', 
//       [email]
//     );

//     // Jika user tidak ditemukan
//     if (users.length === 0) {
//       throw new Error('User tidak ditemukan');
//     }

//     //  Ambil user pertama (asumsi email unik)
//     const user = users[0];

//     //  Bandingkan password yang diinput dengan hash tersimpan
//     const isPasswordValid = await bcrypt.compare(
//       password, 
//       user.password
//     );

//     // Jika password valid, kembalikan data user (tanpa password)
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

//UPDATE
const updateUser = async (body, idUsers) => {
  try {
    const updateData = {
      name: body.name,
      email: body.email
    };

    if (body.password) {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(body.password, saltRounds);
    }

    const setClauses = Object.keys(updateData)
      .map(key => `${key} = ?`)
      .join(', ');

    const SQLQuery = `UPDATE users 
                      SET ${setClauses}
                      WHERE idusers = ?`;

    const values = [...Object.values(updateData), idUsers];
    
    const [result] = await dbPool.execute(SQLQuery, values);
    
    if (result.affectedRows === 0) {
      const error = new Error('User tidak ditemukan atau tidak ada perubahan');
      error.code = 'NO_USER_UPDATED';
      throw error;
    }

    return result;

  } catch (error) {
    console.error('Detailed Error saat update user:', error);
    throw {
      message: error.message || 'Gagal mengupdate user',
      code: error.code || 'UPDATE_USER_ERROR',
      originalError: error
    };
  }
};

//DELETE
const deleteUser = (idUsers) => {
    const SQLQuery = `DELETE FROM users WHERE idusers = ?`;
    return dbPool.execute(SQLQuery, [idUsers]);
}

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
  getUserProfile,
  
};