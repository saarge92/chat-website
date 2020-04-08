// tslint:disable-next-line:no-reference
///<reference path="../../node_modules/@types/jest/index.d.ts"/>

import {UserService} from "../../src/services/user-service";
import {JwtService} from "../../src/services/jwt-service";
import {UserInfo} from "../../src/dto/user-info.dto";
import * as faker from "faker";
import {RoleService} from "../../src/services/role-service";

describe("User Service TEST", () => {
    let userService;

    beforeEach(() => {
        jest.setTimeout(10000);
        const jwtService = new JwtService();
        userService = new UserService(jwtService, new RoleService())
    });

    test("should return createdUser", async () => {
        const userDto: UserInfo = {
            email: faker.email,
            password: faker.password
        }
        const result = await userService.registerUser(userDto);
        expect(result).toBeDefined();
    });

    beforeAll((done) => {
        done(); // calling it
    });
})