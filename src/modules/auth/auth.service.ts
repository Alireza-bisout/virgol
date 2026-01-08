import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthType } from './enums/type.enums';
import { AuthMethod } from './enums/method.enums';
import { isEmail, isMobilePhone } from 'class-validator';

@Injectable()
export class AuthService {
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

    login(method: AuthMethod, username: string) {
        return this.usernameValidator(method, username)

    }

    register(method: AuthMethod, username: string) {
        return this.usernameValidator(method, username)
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
