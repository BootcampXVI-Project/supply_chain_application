import express, { Express } from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUI from "swagger-ui-express";
import cookieParse from "cookie-parser";
import routing from "./routes/index";
import connectDatabase from "./config/connectDatabase";
import { swaggerSpecs } from "./config/configSwagger";
import { PORT, HOST_URL, SWAGGER_URL } from "./constants";

const app: Express = express();

// Config Swagger
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpecs));

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParse());

// Connect database and routing
connectDatabase();
routing(app);

app.listen(PORT, () => {
	console.log(`Server is listening at ${HOST_URL}`);
	console.log(`API Documentation: ${SWAGGER_URL}`);
});
