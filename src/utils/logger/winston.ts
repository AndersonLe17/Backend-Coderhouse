import winston from "winston";
import Env from "../env/env";

const enviroment = new Env();
const env: string | undefined = enviroment.getEnvironment("NODE_ENV");

const customLevel: winston.config.AbstractConfigSetLevels = {
    debug: 0, 
    http: 1, 
    info: 2, 
    warning: 3, 
    error: 4, 
    fatal: 5
}
const customColors: Record<string, string> = {
    debug: "blue",
    http: "green",
    info: "cyan",
    warning: "yellow",
    error: "red",
    fatal: "magenta"
}
interface CustomLevels extends winston.Logger {
    debug: winston.LeveledLogMethod;
    http: winston.LeveledLogMethod;
    info: winston.LeveledLogMethod;
    warning: winston.LeveledLogMethod;
    error: winston.LeveledLogMethod;
    fatal: winston.LeveledLogMethod;
}

export const logger = <CustomLevels>winston.createLogger({
    levels: customLevel,
    transports: [   
        new winston.transports.Console({
            stderrLevels: env ? ['info', 'warning', 'error', 'fatal'] : ['debug', 'http', 'info', 'warning', 'error', 'fatal'],
            format: winston.format.combine(
                winston.format.colorize({ colors: customColors }),
                winston.format.simple(),
            )
        }),
        new winston.transports.File({
            filename: "logs/errors.log",
            level: "error",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.prettyPrint(),
            )
        }),
    ]
});