// tslint:disable-next-line:no-reference
///<reference path="../../node_modules/@types/jest/index.d.ts"/>

import {UserService} from "../../src/services/user-service";
import {UserInfo} from "../../src/dto/user-info.dto";
import * as faker from "faker";
import "dotenv/config";
import {UserModel} from "../../src/models/user-model";
import {Container} from "@decorators/di";
import * as bluebird from "bluebird";

/**
 * Unit testing for user service class
 * Contains testing for methods
 */
describe("User Service TEST", () => {
    let userService: UserService;

    beforeEach(() => {
        global.Promise = bluebird.Promise;
        userService = Container.get<UserService>(UserService);
    });

    it("RegisterUser should return data with token", (done) => {
        const userDto: UserInfo = {
            email: faker.email,
            password: faker.password
        }
        const result = userService.registerUser(userDto);

        expect(result).resolves.toBeDefined();
        expect(result).resolves.toBeCalled();
        done();
    });

    it("GetUserByEmail should return user", async () => {
        const randomUser = UserModel.find().limit(1).findOne();
        const resultGetUserByEmail = userService.getUserByEmail((randomUser).email);

        expect(randomUser).resolves.toBeInstanceOf(UserModel);
        expect(resultGetUserByEmail).resolves.toBe(randomUser);
    });

    it("UserExistByEmail should return true", async () => {
        expect.assertions(1);
        const userModel = UserModel.find().limit(1).exec()
        return expect(userModel).resolves.toBe(123)
    })

})