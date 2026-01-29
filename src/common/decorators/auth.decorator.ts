import { applyDecorators, UseGuards } from "@nestjs/common"
import { ApiBearerAuth } from "@nestjs/swagger"
import { AuthGuard } from "src/modules/auth/guards/auth.guard"
import { RoleGaurd } from "src/modules/auth/guards/role.guard"

export const AuthDecorator = () => {
    return applyDecorators(
        ApiBearerAuth("Authorization"),
        UseGuards(AuthGuard, RoleGaurd)
    )
}