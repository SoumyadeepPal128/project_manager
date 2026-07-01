import { Router } from "express";
import {
    createTask, getTasks, updateTask, deleteTask,
    getTaskById, createSubTask, updateSubTask, deleteSubTask
} from "../controllers/task.controller.js"
import { verifyJWT, validateProjectPermission } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";

const router = Router();
router.use(verifyJWT)

router
    .route("/:projectId")
    .get(validateProjectPermission(AvailableUserRole), getTasks)
    .post(
        validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]),
        upload.array("attachments", 5),
        createTask
    )

router
    .route("/:projectId/t/:taskId")
    .get(validateProjectPermission(AvailableUserRole), getTaskById)
    .put(validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]), updateTask)
    .delete(validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]), deleteTask)

router
    .route("/:projectId/t/:taskId/subtasks")
    .post(validateProjectPermission(AvailableUserRole), createSubTask)

router
    .route("/:projectId/st/:subtaskId")
    .put(validateProjectPermission(AvailableUserRole), updateSubTask)
    .delete(validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]), deleteSubTask)

export default router