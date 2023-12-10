import bcrypt from 'bcrypt';

export const createHash = (password: string) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (password: string, hash: string) => bcrypt.compareSync(hash, password);