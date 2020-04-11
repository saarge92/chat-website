// tslint:disable-next-line:no-reference
///<reference path="../../node_modules/@types/jest/index.d.ts"/>

import {UserService} from "../../src/services/user-service";
import {JwtService} from "../../src/services/jwt-service";
import {UserInfo} from "../../src/dto/user-info.dto";
import * as faker from "faker";
import {RoleService} from "../../src/services/role-service";
import "dotenv/config";

/**
 * Unit testing for user service
 */
describe("User Service TEST", () => {
    let userService: UserService;

    beforeEach(() => {
        const jwtService = new JwtService();
        userService = new UserService(jwtService, new RoleService())
    });

    test("registerUser should return data with token", (done) => {
        const userDto: UserInfo = {
            email: faker.email,
            password: faker.password
        }
        const result = userService.registerUser(userDto);
        expect(result).resolves.toBeDefined();
        expect(result).resolves.toBeCalled();
        done();
    });

})