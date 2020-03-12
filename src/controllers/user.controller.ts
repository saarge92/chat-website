import {Controller, Post} from "@decorators/express";
import express from "express";
import {transformAndValidate} from "class-transformer-validator";
import {UserInfo} from "../dto/user-info.dto";
import {UserService} from "../services/user-service";
import {Inject} from "@decorators/di";

@Controller('/user')
export class UserController {
    constructor(@Inject(UserService) private readonly userService: UserService) {
    }

    @Post('/')
    public async registerUser(request: express.Request, response: express.Response) {
        const userInfo = await transformAndValidate<UserInfo>(UserInfo, request.body).catch(error => {
            response.status(400).json({message: error})
        });
        const createdUser = await this.userService.registerUser(userInfo as UserInfo);
        return response.json({...createdUser}).status(200);
    }
}