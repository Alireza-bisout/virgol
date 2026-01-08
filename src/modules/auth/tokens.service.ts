import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CookiePayload } from "./types/payload";
import { AuthtMessage } from "src/common/enums/message.enum";

@Injectable()
export class TokensService {
    constructor(
        private jwtService: JwtService
    ) { }


    createOtpToken(payload: CookiePayload) {
        const token = this.jwtService.sign(payload, {
            secret: process.env.OTP_TOKEN_SECRET,
            expiresIn: 60 * 2 // 2 minutes
        })
        return token
    }

    verifyOtpToken(token: string): CookiePayload {
        try {
            return this.jwtService.verify(token, {
                secret: process.env.OTP_TOKEN_SECRET,
            })
        } catch (err) {
            throw new UnauthorizedException(AuthtMessage.TryAgain)
        }
    }
}