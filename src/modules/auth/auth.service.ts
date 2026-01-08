import { BadRequestException, ConflictException, Inject, Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthType } from './enums/type.enums';
import { AuthMethod } from './enums/method.enums';
import { isEmail, isMobilePhone } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { ProfileEntity } from '../user/entities/profile.entity';
import { AuthtMessage, BadRequestMessage, PublicMessage } from 'src/common/enums/message.enum';
import { OtpEntity } from '../user/entities/otp.entity';
import { randomInt } from 'crypto';
import { TokensService } from './tokens.service';
import express from 'express';
import { CookieKeys } from 'src/common/enums/cookie.enum';
import { AuthResponse } from './types/response';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {

    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectRepository(ProfileEntity) private profileRepository: Repository<ProfileEntity>,
        @InjectRepository(OtpEntity) private otpRepository: Repository<OtpEntity>,
        @Inject(REQUEST) private request: express.Request,
        private tokenService: TokensService,
    ) { }


    async userExistence(authDto: AuthDto, res: express.Response) {
        const { method, type, username } = authDto
        let result: AuthResponse
        switch (type) {
            case AuthType.Register:
                result = await this.register(method, username)
                return this.sendResponse(res, result)

            case AuthType.Login:

                result = await this.login(method, username)
                return this.sendResponse(res, result)


            default:
                throw new UnauthorizedException()
        }
    }

    async login(method: AuthMethod, username: string) {
        const validUsername = this.usernameValidator(method, username)
        const user = await this.checkExistUser(method, validUsername)
        if (!user) throw new UnauthorizedException(AuthtMessage.NotFoundAccount)
        const otp = await this.saveOtp(user.id)
        user.otpId = otp.id
        await this.userRepository.save(user)
        const token = this.tokenService.createOtpToken({ userId: user.id })
        return {
            token,
            code: otp.code
        }
    }

    async sendResponse(res: express.Response, result: AuthResponse) {
        const { token, code } = result
        res.cookie(CookieKeys.OTP, token, {
            httpOnly: true,
            expires: new Date(Date.now() + 2 * 60000), // 2 minutes
        })
        res.json({
            // message: PublicMessage.SendOtp
            code
        })
    }

    async register(method: AuthMethod, username: string) {
        const validUsername = this.usernameValidator(method, username)
        let user = await this.checkExistUser(method, validUsername)
        if (user) throw new ConflictException(AuthtMessage.AlreadyExistAccount)

        if (method === AuthMethod.Username) {
            throw new BadRequestException(BadRequestMessage.InValidRegisterData)
        }

        user = this.userRepository.create({
            [method]: username,
        })

        user = await this.userRepository.save(user)
        user.username = `m_${user.id}`
        await this.userRepository.save(user)
        const otp = await this.saveOtp(user.id)
        user.otpId = otp.id
        await this.userRepository.save(user)
        const token = this.tokenService.createOtpToken({ userId: user.id })

        return {
            token,
            code: otp.code
        }
    }

    async saveOtp(userId: number) {
        const code = randomInt(10000, 99999).toString()
        const expires_in = new Date(Date.now() + 2 * 60000) // 2 minutes from now
        let otp = await this.otpRepository.findOneBy({ userId })
        let existOtp = false

        if (otp) {
            existOtp = true
            otp.code = code
            otp.expires_in = expires_in
        } else {
            otp = this.otpRepository.create({ code, expires_in, userId })
        }

        otp = await this.otpRepository.save(otp)
        if (!existOtp) {
            await this.userRepository.update(userId, { otpId: otp.id })
        }
        return otp
        //send [SMS, Email] OtpCode
    }

    async checkOtp(code: string) {
        const token = this.request.cookies?.[CookieKeys.OTP]
        if (!token) new UnauthorizedException(AuthtMessage.ExpiredCode)
        const { userId } = this.tokenService.verifyOtpToken(token)
        const otp = await this.otpRepository.findOne({
            where: { userId }
        })
        if (!otp) throw new UnauthorizedException(AuthtMessage.TryAgain)
        const now = new Date()
        if (otp.expires_in < now) throw new UnauthorizedException(AuthtMessage.ExpiredCode)
        if (otp.code !== code) throw new UnauthorizedException(AuthtMessage.LoginAgain)
        const accessToken = this.tokenService.createAccessToken({ userId })
        return {
            message: PublicMessage.LoggedIn,
            accessToken
        }
    }

    async checkExistUser(method: AuthMethod, username: string) {
        let user: UserEntity | null = null;

        if (method === AuthMethod.Phone) {
            user = await this.userRepository.findOneBy({ phone: username })
        } else if (method === AuthMethod.Email) {
            user = await this.userRepository.findOneBy({ email: username })
        } else if (method === AuthMethod.Username) {
            user = await this.userRepository.findOneBy({ username })
        } else {
            throw new BadRequestException(BadRequestMessage.InValidLoginData)
        }
        return user
    }

    usernameValidator(method: AuthMethod, username: string) {
        switch (method) {
            case AuthMethod.Email:

                if (isEmail(username)) return username
                throw new BadRequestException("فرمت ایمیل اشتباه است!!")

            case AuthMethod.Phone:
                if (isMobilePhone(username, "fa-IR")) return username
                throw new BadRequestException("فرمت موبایل اشتباه است!!")

            case AuthMethod.Username:
                return username

            default:
                throw new UnauthorizedException("اطلاعات فرستاده شده صحیح نیست")
        }
    }


}
