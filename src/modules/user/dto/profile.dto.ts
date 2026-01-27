import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsMobilePhone, IsOptional, IsString, Length } from "class-validator";
import { Gender } from "../enum/gender.enum";
import { ValidationMessage } from "src/common/enums/message.enum";

export class ProfileDto {

    @ApiPropertyOptional()
    @IsOptional()
    @Length(3, 100)
    nick_name: string;

    @ApiPropertyOptional({ nullable: true })
    @IsOptional()
    @Length(10, 200)
    bio: string

    @ApiPropertyOptional({ nullable: true, format: "binary" })
    image_profile: string;

    @ApiPropertyOptional({ nullable: true, format: "binary" })
    bg_profile: string;

    @ApiPropertyOptional({ nullable: true, enum: Gender })
    @IsOptional()
    @IsEnum(Gender)
    gender: string;

    @ApiPropertyOptional({ nullable: true, example: "2026-01-11T18:12:02.919Z" })
    birthday: Date;

    @ApiPropertyOptional({ nullable: true })
    linkedin_profile: string;

    @ApiPropertyOptional({ nullable: true })
    x_profile: string;
}


export class ChangeEmailDto {
    @ApiPropertyOptional({ nullable: true })
    @IsEmail({}, { message: ValidationMessage.InvalidEmailFormat })
    email: string
}

export class ChangePhoneDto {
    @ApiPropertyOptional({ nullable: true })
    @IsMobilePhone("fa-IR", {}, { message: ValidationMessage.InvalidPhoneFormat })
    phone: string
}

export class ChangeUsernameDto {
    @ApiProperty()
    @IsString()
    @Length(3, 100)
    username: string;
}