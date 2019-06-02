export default interface AuthUser {
    id: string;
    email: string;
    name?: string;
    role: string,
    name2?: string;
    about?: string;
    publicUsername?: string;
}