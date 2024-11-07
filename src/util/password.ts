import bcrypt from "bcrypt";

export const hash = async (password: string) => {
    const saltRound = 10;
    const result = await bcrypt.hash(password, saltRound);
    return result;
}

export const compare = async (password: string, hashedPassword: string) => {
    const result = await bcrypt.compare(password, hashedPassword);
    return result;
}