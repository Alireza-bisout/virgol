import { Request } from "express";
import { mkdirSync } from "fs";
import { extname, join } from "path";
import { ValidationMessage } from "../enums/message.enum";
import { BadRequestException } from "@nestjs/common";

export type CallbackDestination = (error: any, destination: string) => void
export type CallbackFilename = (error: any, filename: string) => void
export type MulterFile = Express.Multer.File


export const multerDestination = (fildname: string) => {
    return (req: Request, file: MulterFile, callback: CallbackDestination): void => {
        let path = join("public", "uploads", fildname)
        mkdirSync(path, { recursive: true })
        callback(null, path)
    }
}

export const multerFilename = (req: Request, file: MulterFile, callback: CallbackFilename): void => {
    const ext = extname(file.originalname).toLowerCase()
    if (!isValidImageFormat(ext)) {
        callback(new BadRequestException(ValidationMessage.InvalidImageFormat), "null")

    } else {
        const filename = `${Date.now()}${ext}`
        callback(null, filename)
    }
}

const isValidImageFormat = (ext: string) => {
    return [".png", ".jpg", ".jpeg"].includes(ext)
}


export const multerStorage = (folderName: string) => {
    return ({
        destination: multerDestination(folderName),
        filename: multerFilename
    })
}