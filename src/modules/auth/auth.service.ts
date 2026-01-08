import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthType } from './enums/type.enums';
import { AuthMethod } from './enums/method.enums';
import { isEmail, isMobilePhone } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { ProfileEntity } from '../user/entities/profile.entity';
import e from 'express';
import { AuthtMessage, BadRequestMessage } from 'src/common/enums/message.enum';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectRepository(ProfileEntity) private profileRepository: Repository<ProfileEntity>,
    ) { }


    userExistence(authDto: AuthDto) {
        const { method, type, username } = authDto

        switch (type) {
            case AuthType.Register:
                return this.register(method, username)

            case AuthType.Login:

                return this.login(method, username)


            default:
                throw new UnauthorizedException()
        }
    }

    async login(method: AuthMethod, username: string) {
        const validUsername = this.usernameValidator(method, username)
        const user = await this.checkExistUser(method, validUsername)
        if (!user) throw new UnauthorizedException(AuthtMessage.NotFoundAccount)
    }

    async register(method: AuthMethod, username: string) {
        const validUsername = this.usernameValidator(method, username)
        const user = await this.checkExistUser(method, validUsername)
        if (user) throw new ConflictException(AuthtMessage.AlreadyExistAccount)
    }

    async checkOtp() { }

    async checkExistUser(method: AuthMethod, username: string) {
        let user: UserEntity | null = null

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
