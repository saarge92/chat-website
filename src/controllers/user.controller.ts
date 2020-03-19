import {Controller, Post} from "@decorators/express";
import express, {json} from "express";
import {transformAndValidate} from "class-transformer-validator";
import {UserInfo} from "../dto/user-info.dto";
import {UserService} from "../services/user-service";
import {Inject} from "@decorators/di";
import {LoginInfo} from "../dto/login-info";


/**
 * Controller for serving requests about users
 * @copyright Serdar Durdyev
 */
@Controller('/user')
export class UserController {
    constructor(@Inject(UserService) private readonly userService: UserService) {
    }

    /**
     * Register user in database
     * @param request HTTP-Request
     * @param response HTTP-Response
     * @returns {Promise<any>} Возвращает данные созданного пользователя
     */
    @Post('/')
    public async registerUser(request: express.Request, response: express.Response) {
        const userInfo = await transformAndValidate<UserInfo>(UserInfo, request.body).catch(error => {
            response.status(400).json({message: error})
        });
        const createdUser = await this.userService.registerUser(userInfo as UserInfo);
        return response.json({...createdUser}).status(200);
    }

    /**
     * Login user in system
     * @param request Http Request
     * @param response Http Response
     */
    @Post("/login")
    public async loginUser(request: express.Request, response: express.Response) {
        const userInfo = await transformAndValidate(LoginInfo, request.body).catch(error => {
            response.status(400).json({message: error});
        });
        const userData = await this.userService.userLogin(userInfo as LoginInfo);
        return response.json(userData).status(200)
    }
}