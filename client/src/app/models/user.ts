import { Role } from "app/models/Role";

export class User {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    token: string;
    role: Role; 
}