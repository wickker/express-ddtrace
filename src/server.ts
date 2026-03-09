import "./tracer.js"; // MUST be first import
import cors, { type CorsOptions } from "cors";
import express from "express";
import { logger } from "./logger.js";

const app = express();

const allowedOrigins = [
	"https://react-rum-5529d.sevalla.page",
	"http://localhost:3000",
	"http://localhost:5173",
];

const corsOptions: CorsOptions = {
	origin: (origin, callback) => {
		// allow non-browser tools like curl/postman with no origin
		if (!origin) {
			return callback(null, true);
		}

		if (allowedOrigins.includes(origin)) {
			return callback(null, true);
		}

		return callback(new Error("Not allowed by CORS"));
	},
	methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
	credentials: true,
};

app.use(cors(corsOptions));

app.options("/{*splat}", cors(corsOptions));

app.use(express.json());

app.use((req, res, next) => {
	const { method, originalUrl } = req;
	const { statusCode } = res;

	res.on("finish", () => {
		logger.info("Http request", {
			method,
			path: originalUrl,
			status: statusCode,
		});
	});

	next();
});

app.get("/", (_req, res) => {
	res.send("DIAN-EXPRESS-APP IS UP AND RUNNING");
});

app.get("/health", (_req, res) => {
	res.json({ message: "health ok" });
});

app.get("/users", (_req, res) => {
	res.json([
		{ id: 1, username: "alice", email: "alice@example.com" },
		{ id: 2, username: "bob", email: "bob@example.com" },
		{ id: 3, username: "charlie", email: "charlie@example.com" },
	]);
});

const port = 9000;
app.listen(port, () => {
	logger.info(`Listening on port: `, { port });
});
