import { MulterFile } from "src/common/utils/multer.util"

export type ProfileImage = {
    image_profile: MulterFile[],
    bg_profile: MulterFile[]
}