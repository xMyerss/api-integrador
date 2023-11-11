import { Router } from "express";
import{
    createUser,
    deleteUser,
    getUsers,
    getUserByEmail,
    logUser,
    updateImage,
} from "../controllers/users.controller.js";

const router = Router();

router.get('/', getUsers);
router.get('getUser/:email', getUserByEmail);
router.delete('/delete/:email', deleteUser);
router.post('/create', createUser);
router.post('/log', logUser);
router.post('/updateimg', updateImage);

export default router;