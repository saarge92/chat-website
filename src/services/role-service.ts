import {Injectable} from "@decorators/di";
import {RoleInfo} from "../dto/role-info";
import {IRole, RoleModel} from "../models/roles-model";
import HttpException from "../exceptions/http-exception";
import {Schema, Types} from "mongoose";
import {UserRoleDto} from "../dto/user-role.dto";
import {UserModel} from "../models/user-model";

@Injectable()
export class RoleService {
    /**
     * Create role in database
     * @param roleInfo object with data about role creation
     */
    public async createRole(roleInfo: RoleInfo) {
        const isRoleExists = await this.isRoleExistedInDatabase(roleInfo.name);
        if (isRoleExists) throw new HttpException(400, "Роль в базе уже существует");
        const createdRole = await RoleModel.create({
            name: roleInfo.name
        })
        return createdRole;
    }

    /**
     * Get role by name
     * @param name Name for searching
     */
    public async getRoleByName(name: string): Promise<IRole> {
        const role = await RoleModel.findOne({name}).lean()
        return role;
    }

    /**
     * Check if role exists in roles table
     * @param name Name of role for searching
     * @returns {boolean} Returns true or false if exists
     */
    public async isRoleExistedInDatabase(name: string): Promise<boolean> {
        return await this.getRoleByName(name) != null;
    }

    /**
     * Delete role by id
     * @param id Id of deleting role
     */
    public async deleteRole(id: string): Promise<IRole> {
        const deleted = await RoleModel.findByIdAndRemove({_id: id});
        return deleted;
    }

    /**
     * Find role by id
     * @param id Id of searched role
     */
    public async findRoleById(id: string): Promise<IRole> {
        return RoleModel.findOne({_id: id}).lean();
    }

    /**
     * Assign Role To user
     * @param userRoleDto Object dto about roles assignation
     */
    public async assignRoleToUser(userRoleDto: UserRoleDto): Promise<any> {
        const role = await this.findRoleById(userRoleDto.role_id);
        if (!role) throw new HttpException(400, "Такой роли не существует в базе");
        const isUpdated = await UserModel.updateOne({_id: userRoleDto.user_id}, {$push: {roles: userRoleDto.role_id}}).lean();
        return isUpdated;
    }
}