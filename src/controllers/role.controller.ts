import {Controller, Delete, Get, Params, Post, Response} from "@decorators/express";
import express from "express";
import {transformAndValidate} from "class-transformer-validator";
import {RoleInfo} from "../dto/role-info";
import {Inject} from "@decorators/di";
import {RoleService} from "../services/role-service";
import {UserRoleDto} from "../dto/user-role.dto";
import {AdminMiddleware} from "../middleware/is-admin.middleware";

/**
 * Controller for working with roles in database
 * Contains basic routes for CRUD operations with roles
 * @copyright Serdar Durdyev
 */
@Controller("/roles", [AdminMiddleware])
export class RoleController {
    constructor(@Inject(RoleService) private readonly roleService: RoleService) {
    }

    /**
     * Create role in database
     * @param request Http request with body of creating role
     * @param response Response for user
     */
    @Post("/")
    public async createRole(request: express.Request, response: express.Response) {
        const roleInfo = await transformAndValidate<RoleInfo>(RoleInfo, request.body).catch((error) => {
            response.status(400).json({message: error})
        }) as RoleInfo;
        const createdRole = await this.roleService.createRole(roleInfo);
        return response.json({
            name: createdRole.name,
            id: createdRole._id,
            created_at: createdRole.created_at
        }).status(200)
    }

    /**
     * Delete role in table
     * @param request Request with body params
     * @param response Response for user
     */
    @Delete("/:id")
    public async deleteRole(request: express.Request, response: express.Response) {
        const deleted = await this.roleService.deleteRole(request.params.id);
        if (!deleted) return response.json({message: "Роль не удалена, поскольку отсутсвует в базе"}).json(400);
        return response.json({message: "Роль удалена"}).status(200)
    }

    /**
     * Get role by id
     * @param id Id of role
     * @param response response for user
     */
    @Get("/:id")
    public async getRoleById(@Params("id") id: string, @Response() response: express.Response) {
        const role = await this.roleService.findRoleById(id);
        return response.json({...role}).status(200);
    }

    /**
     * Assign role to user
     * @param request Body of requests with role & user
     * @param response Response for user with result operation
     */
    @Post("/assign")
    public async assingnUserToRole(request: express.Request, response: express.Response) {
        const assignInfo = await transformAndValidate(UserRoleDto, request.body).catch((error) => {
            return response.json({message: error}).status(400);
        });

        const isUpdated: any = await this.roleService.assignRoleToUser(assignInfo as UserRoleDto);

        if (isUpdated.ok == 1) return response.json({message: "Успешно обновлено"}).status(200)
        else return response.json({message: "Что-то пошло не так"}).status(409)
    }
}