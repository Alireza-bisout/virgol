import { applyDecorators, ParseFilePipe, UploadedFiles } from "@nestjs/common"

export const UploadedOptinoalFiles = () => {
    return UploadedFiles(new ParseFilePipe({
        fileIsRequired: false,
        validators: []
    }))
}