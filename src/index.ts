import express, { Express } from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUI from "swagger-ui-express";
import cookieParse from "cookie-parser";
import routing from "./routes";
import connectDatabase from "./config/connectDatabaseConfig";
import { swaggerSpecs } from "./config/swaggerConfig";
import { PORT, HOST_URL, SWAGGER_URL } from "./constants";

const app: Express = express();

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpecs));
app.use(cors());
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "http://localhost:4200");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParse());

connectDatabase();
routing(app);

app.listen(PORT, () => {
	console.log(`Server is listening at ${HOST_URL}`);
	console.log(`API Documentation: ${SWAGGER_URL}`);
});
