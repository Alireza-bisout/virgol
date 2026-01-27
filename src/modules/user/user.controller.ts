import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseInterceptors, UploadedFiles, ParseFilePipe, UseGuards, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ChangeEmailDto, ChangePhoneDto, ChangeUsernameDto, ProfileDto } from './dto/profile.dto';
import { SwaggerConsumes } from 'src/common/enums/swagger-consume.enums';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerStorage } from 'src/common/utils/multer.util';
import { UploadedOptinoalFiles } from 'src/common/decorators/upload-file.decorator';
import { CookieKeys } from 'src/common/enums/cookie.enum';
import { CookiesOptionsToken } from 'src/common/utils/cookie.util';
import express from 'express';
import { PublicMessage } from 'src/common/enums/message.enum';
import { CheckOtpDto } from '../auth/dto/auth.dto';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';

@Controller('user')
@ApiTags('User')
@AuthDecorator()
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Put("/profile")
  @ApiConsumes(SwaggerConsumes.MultipartData)
  @UseInterceptors(FileFieldsInterceptor([
    { name: "image_profile", maxCount: 1 },
    { name: "bg_profile", maxCount: 1 }
  ],
    {
      storage: multerStorage("user-profile")
    }
  ))


  changeProfile(
    @UploadedOptinoalFiles()
    files: any,
    @Body() profileDto: ProfileDto) {
    return this.userService.changeProfile(files, profileDto)
  }


  @Get("/profile")
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  profile() {
    return this.userService.profile()
  }

  @Patch("/change-email")
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  async changeEmail(@Body() emailDto: ChangeEmailDto, @Res() res: express.Response) {
    const { code, token, message } = await this.userService.changeEmail(emailDto.email)
    if (message) res.json({ message })
    res.cookie(CookieKeys.EmailOTP, token, CookiesOptionsToken())
    res.json({
      code,
      message: PublicMessage.SentOtp
    })
  }

  @Post("/verify-email-otp")
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  async verifyEmail(@Body() otpDto: CheckOtpDto) {
    return this.userService.verifyEmail(otpDto.code)
  }

  @Patch("/change-phone")
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  async changePhone(@Body() phoneDto: ChangePhoneDto, @Res() res: express.Response) {
    const { code, token, message } = await this.userService.changePhone(phoneDto.phone)
    if (message) res.json({ message })
    res.cookie(CookieKeys.PhoneOTP, token, CookiesOptionsToken())
    res.json({
      code,
      message: PublicMessage.SentOtp
    })
  }

  @Post("/verify-phone-otp")
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  async verifyPhone(@Body() otpDto: CheckOtpDto) {
    return this.userService.verifyPhone(otpDto.code)
  }

  @Patch("/change-username")
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  async changeUsername(@Body() usernameDto: ChangeUsernameDto) {
    return this.userService.changeUsername(usernameDto.username)
  }

}