const UsersModel = require("../models/users.js");

//GET ALL USER
const getAllUsers = async (req, res) => {
  try {
    const [data] = await UsersModel.getAllUsers();

    res.json({
      message: "get all user succes",
      data: data,
    });
  } catch (error) {
    console.error("Error saat mengambil semua user:", error);
    res.status(500).json({
      message: "Server Error",
      serverMessage: error,
    });
  }
};

//CREATE USER
const createNewUser = async (req, res) => {
  const { body } = req;

  if (!body.email || !body.name || !body.password) {
    return res.status(400).json({
      status: "error",
      message: "Data yang dikirim tidak lengkap",
      errors: {
        email: !body.email ? "Email diperlukan" : undefined,
        name: !body.name ? "Nama diperlukan" : undefined,
        password: !body.password ? "Password diperlukan" : undefined,
      },
    });
  }

  try {
    await UsersModel.createNewUser(body);
    res.status(201).json({
      status: "success",
      message: "Berhasil membuat user baru",
      data: {
        name: body.name,
        email: body.email,
      },
    });
  } catch (error) {
    console.error("Error saat membuat user:", error);

    // Detailed error response for Postman
    const statusCode = error.code === "EMAIL_ALREADY_EXISTS" ? 409 : 500;
    res.status(statusCode).json({
      status: "error",
      message: error.message || "Gagal membuat user",
      errorCode: error.code || "UNKNOWN_ERROR",
      details:
        process.env.NODE_ENV === "development"
          ? error.originalError
          : undefined,
    });
  }
};

//UPDATE USER
const updateUser = async (req, res) => {
  const { idUser } = req.params;
  const { body } = req;

  // Input validation
  const errors = {};
  if (!body.name && !body.email && !body.password) {
    errors.update = "Tidak ada data yang akan diupdate";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      status: "error",
      message: "Validasi gagal",
      errors: errors,
    });
  }

  try {
    const result = await UsersModel.updateUser(body, idUser);

    res.json({
      status: "success",
      message: "Berhasil mengupdate user",
      data: {
        id: idUser,
        updatedFields: Object.keys(body),
      },
    });
  } catch (error) {
    console.error("Error saat update user:", error);

    const statusCode = error.code === "NO_USER_UPDATED" ? 404 : 500;
    res.status(statusCode).json({
      status: "error",
      message: error.message || "Gagal mengupdate user",
      errorCode: error.code || "UPDATE_ERROR",
      details:
        process.env.NODE_ENV === "development"
          ? error.originalError
          : undefined,
    });
  }
};

//DELETE
const deleteUser = async (req, res) => {
  const { idUser } = req.params;

  try {
    // Cek apakah user dengan ID tersebut ada
    const [existingUsers] = await UsersModel.getUserProfile(idUser);

    if (existingUsers.length === 0) {
      console.error("User tidak ditemukan untuk dihapus:", { idUser });
      return res.status(404).json({
        message: "User tidak ditemukan",
        data: null,
      });
    }

    // Lakukan delete
    await UsersModel.deleteUser(idUser);
    console.log("Delete user berhasil:", { idUser });

    res.json({
      message: "Delete user success",
      data: null,
    });
  } catch (error) {
    console.error("Error saat menghapus user:", error);
    res.status(500).json({
      message: "Server Error",
      serverMessage: error,
    });
  }
};

//GET USER
const getUserProfile = async (req, res) => {
  const { idUser } = req.params;

  // Validasi input ID
  if (!idUser) {
    return res.status(400).json({
      message: "ID user diperlukan",
      data: null,
    });
  }

  try {
    const [data] = await UsersModel.getUserProfile(idUser);

    if (data.length === 0) {
      console.error("User tidak ditemukan:", { idUser });
      return res.status(404).json({
        message: "User not found",
        data: null,
      });
    }

    res.json({
      message: "Get user profile success",
      data: data[0], // Return the first (and should be only) user
    });
  } catch (error) {
    console.error("Error saat mengambil profil user:", error);
    res.status(500).json({
      message: "Server Error",
      serverMessage: error,
    });
  }
};

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
  getUserProfile,
};
