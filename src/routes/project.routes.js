import { Router } from "express";
import {addMembersToProject,
    getProjectById,
    getProjectMembers,
    getProjects,
    createProject,
    updateMemberRole,
    updateProject,
    deleteProject,
    deleteMember} from "../controllers/project.controller.js"
import { validate,v } from "../middlewares/validator.middleware.js";
import {createProjectValidator,addMembertoProjectValidator} from "../validators/index.js"
import { verifyJWT,validateProjectPermission } from "../middlewares/auth.middleware.js";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";
import {userRegisterValidator,
  userLoginValidator,
  userChangeCurrentPasswordValidator,
  userForgotPasswordValidator,
  userResetForgotPasswordValidator,
  createProjectValidator,
  addMembertoProjectValidator,}
  from "../validators/index.js"

const router = Router();
router.use(verifyJWT)


router
    .route("/")
    .get(getProjects)
    .post(createProjectValidator(),validate,createProject);

router
    .route("/:projectId")
    .get(validateProjectPermission(AvailableUserRole),getProjectById)
    .put(
        validateProjectPermission([UserRolesEnum.ADMIN]),
        createProjectValidator(),
        validate,
        updateProject
    )
    .delete(
        validateProjectPermission([UserRolesEnum.ADMIN]),
        deleteProject
    )

router
    .route(":/projectId/members/")
    .get(getProjectMembers)
    .post(
        validateProjectPermission([UserRolesEnum.ADMIN]),
        addMembertoProjectValidator(),
        validate,
        addMembersToProject
    )

router
    .route("/:projectId/members/:userId")
    .put(validateProjectPermission([UserRolesEnum.ADMIN]),updateMemberRole)
    .delete(validateProjectPermission([UserRolesEnum.ADMIN]),deleteMember)


export default router
