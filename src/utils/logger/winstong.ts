import winston from "winston";
import Env from "../env/env";

const enviroment = new Env();

export const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: enviroment.getEnvironment("NODE_ENV")? "info" : "debug",
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
            )
        }),
        new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.prettyPrint(),
            )
        }),
    ]
});