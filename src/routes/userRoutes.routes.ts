import { Router } from "express";
import UserController from "../controllers/UserController";

const router = Router();
const controller = new UserController();

router.post("/", controller.createUser);
router.get("/", controller.getUsers);
router.get("/:id", controller.getUser);
router.put("/:id", controller.updateUser);
router.delete("/:id", controller.deleteUser);

export default router;
