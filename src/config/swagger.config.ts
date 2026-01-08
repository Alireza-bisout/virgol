import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { SecuritySchemeObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";

export const SwaggerConfigInit = (app: INestApplication): void => {
    const document = new DocumentBuilder()
        .setTitle("Virgol")
        .setDescription("backend of virgol web app")
        .setVersion("v0.0.1")
        .addBearerAuth(swaggerAuthConfig(), "Authorization")
        .build()
    const swaggerDocument = SwaggerModule.createDocument(app, document)
    SwaggerModule.setup("/swagger", app, swaggerDocument)
}

const swaggerAuthConfig = (): SecuritySchemeObject => {
    return {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
    }
}