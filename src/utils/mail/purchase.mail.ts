import { Ticket } from "../../app/dao/domain/ticket/Ticket";
import Env from "../env/env";

const enviroment = new Env();

export const mailTicket = (tickec: Ticket) => {
    return {
        from: enviroment.getStringEnv('GOOGLE_USER'),
        to: tickec.purchaser,
        subject: `E-Commerce - Ticket N° ${tickec.code}`,
        html: `
        <h1>Ticket N° ${tickec.code}</h1>
        <p>Fecha de compra: ${tickec.purchaseDateTime}</p>
        <p>Monto total: $${tickec.amount}</p>
        <p>Gracias por su compra</p>
        `
    };
};

export const mailForgotPassword = (email: string, url: string) => {
    return {
        from: enviroment.getStringEnv('GOOGLE_USER'),
        to: email,
        subject: `E-Commerce - Recuperación de contraseña`,
        html: `
        <h1>Recuperación de contraseña</h1>
        <p>Para recuperar su contraseña haga click <a href="${url}">aquí</a></p>
        `
    };
};

export const mailInactivityUser = (email: string) => {
    return {
        from: enviroment.getStringEnv('GOOGLE_USER'),
        to: email,
        subject: `E-Commerce - Cuenta Eliminada por inactividad`,
        html: `
        <h1>Cuenta inactiva</h1>
        <p>Su cuenta ha sido eliminada por inactividad</p>
        `
    };
}

export const deleteProduct = (email: string, product: string) => {
    return {
        from: enviroment.getStringEnv('GOOGLE_USER'),
        to: email,
        subject: `E-Commerce - Producto eliminado`,
        html: `
        <h1>Producto eliminado</h1>
        <p>El producto ${product} ha sido eliminado</p>
        `
    };
}