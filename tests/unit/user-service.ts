// tslint:disable-next-line:no-reference
///<reference path="../../node_modules/@types/jest/index.d.ts"/>

import {UserService} from "../../src/services/user-service";
import {JwtService} from "../../src/services/jwt-service";
import {UserInfo} from "../../src/dto/user-info.dto";
import * as faker from "faker";

describe("User Service TEST", () => {
    let userService;
    beforeAll(() => {
        jest.setTimeout(5000);
    })

    beforeEach(() => {
        const jwtService = new JwtService();
        userService = new UserService(jwtService)
    });

    test("should return createdUser", async (done) => {
        const userDto: UserInfo = {
            email: faker.email,
            password: faker.password
        }
        const result = await userService.registerUser(userDto);
        expect(result).toBeDefined();
        done();
    });
})