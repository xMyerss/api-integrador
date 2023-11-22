import { pool } from "../DB/db.js";;
import fs from "fs";
import { config } from "dotenv";
import { uploadFile } from '../aws_s3.js'
config();

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
    try {
        const {email} = req.body;
        const uri = await uploadFile(req.files.file);
        const result = await pool.query(`UPDATE users SET image = ${uri} WHERE email = ${email}`);
        return res.status(200).send(uri);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error" });
    }
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