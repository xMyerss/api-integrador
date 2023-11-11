import { pool } from "../DB/db.js";
import { array } from "../array.js";
import upload from "../multer/multer.config.js";
import multer from "multer";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { config } from "dotenv";
config();

const up = upload.single('image');

export const getUsers = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM users");
        return res.status(200).json(rows);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error" });
    }
};

export const logUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const [user] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
        if (user.length === 0){
            throw new Error("Usuario no encontrado");
        }
        if (password !== user[0].pass){
            throw new Error("Contraseña incorrecta");
        }
        return res.status(200).json({
            value: true,
            message: "Inicio de sesion exitoso",
            email: email
        });
    } catch (error) {
        console.log(error.name + ": " + error.message);
        return res.status(500).json({
            value: false,
            message: error.message
        });
    }
};

export const updateImage = async (req, res) => {
    up(req, res, async (err) => {
        const { email } = req.body;
        const [valor] = await pool.query("SELECT image FROM users WHERE email = ?", [email]);
        console.log(valor[0].image);


        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        console.log(__dirname);
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ message: "Algo ocurrió mal..." })
        } else if(err) {
            console.log(err);
            return res.status(500).json({ message: err })
        } else if (req.file == null || undefined) {
            return res.status(500).json({ message: "Falta la imagen" })
        }
        try {
            const imgUrl = `${process.env.API_HOST}/public/${array.data}`;
            console.log(array.data)
            console.log(imgUrl);
            const { email } = req.body;
            const [rows] = await pool.query("UPDATE users SET image = ? WHERE email = ?", [ imgUrl, email]);
            
            if (rows.affectedRows > 0) {
                return res.status(201).json({ message: "Actualizado correctamente" });
                }
        } catch (error) {
            fs.unlinkSync(`./src/storage/imgs/${array.data}`);
            console.log(error);
            return res.status(500).json({ message: "Error" });
        }
    });
};

export const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
            email,
          ]);

        if (rows.length <= 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        return res.status(200).json(rows[0]);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { email } = req.params;
        const [rows] = await pool.query("DELETE FROM users WHERE email = ?", [email]);

        if (rows.length <= 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        return res.status(204).json({ message: "Usuario eliminado" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error" });
    }
};

export const createUser = async (req,res) => {
    try {
        const {email,id_region,name_of_responsible,phone,mobile_phone,name_of_disability,relationship,password, image} = req.body;
        const [rows] = await pool.query(
            "INSERT INTO users (email,id_region,name_of_responsible,phone,mobile_phone,name_of_disability,relationship,pass,image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [email,id_region,name_of_responsible,phone,mobile_phone,name_of_disability,relationship,password, image]
        );
        return res.status(201).json({ message: "Usuario creado" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error" });
    }
};