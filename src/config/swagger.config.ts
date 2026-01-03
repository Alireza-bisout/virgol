import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export const SwaggerConfigInit = (app: INestApplication): void => {
    const document = new DocumentBuilder()
        .setTitle("Virgol")
        .setDescription("backend of virgol web app")
        .setVersion("v0.0.1")
        .build()
    const swaggerDocument = SwaggerModule.createDocument(app, document)
    SwaggerModule.setup("/swagger", app, swaggerDocument)
}