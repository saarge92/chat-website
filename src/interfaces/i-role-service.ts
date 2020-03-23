import {RoleInfo} from "../dto/role-info";
import {IRole} from "../models/roles-model";
import {UserRoleDto} from "../dto/user-role.dto";

/**
 * Interface for role service which contains
 * basic methods for business logic of roles
 * @copyright Serdar Durdyev
 */
export interface IRoleService {
    createRole(roleInfo: RoleInfo);

    getRoleByName(name: string): Promise<IRole>;

    isRoleExistedInDatabase(name: string): Promise<boolean>;

    deleteRole(id: string): Promise<IRole>;

    findRoleById(id: string): Promise<IRole>;

    assignRoleToUser(userRoleDto: UserRoleDto): Promise<any>;
}