import swaggerJsDoc from "swagger-jsdoc";
import { DEVELOPMENT_URL, PRODUCTION_URL } from "../constants/index";

const swaggerOptions: swaggerJsDoc.Options = {
	definition: {
		openapi: "3.0.3",
		info: {
			title: "SwaggerUI",
			version: "1.0.0",
			description: "A Simple Express Library API"
		},
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					in: "header",
					scheme: "bearer",
					bearerFormat: "JWT",
					name: "Authorization",
					description: "Bearer token to access these api endpoints"
				}
			}
		},
		security: [
			{
				bearerAuth: []
			}
		],
		servers: [
			{
				url: DEVELOPMENT_URL,
				description: "Development"
			},
			{
				url: PRODUCTION_URL,
				description: "Production"
			}
		]
	},
	apis: ["**/*.yaml"]
};

const swaggerSpecs = swaggerJsDoc(swaggerOptions);
export { swaggerSpecs };
