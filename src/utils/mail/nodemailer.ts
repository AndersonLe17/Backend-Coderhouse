import nodemailer from 'nodemailer';
import Env from '../env/env';

const enviroment = new Env();

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: enviroment.getStringEnv('GOOGLE_USER'),
        pass: enviroment.getStringEnv('GOOGLE_APP_PASSWORD')
    }
});