import express from "express";
import { createUser,loginUser } from "../controllers/userController.ts";
import { authenticate,authorizeAdmin } from "../middlewares/authMiddleware.ts";



const router = express.Router();

router.route('/').post(
  createUser
).get(authenticate,authorizeAdmin);

router.post('/login',loginUser);

export default router;