import ParentDto from "../parent/modals/parent.dto";

export interface StudentModel{
    id?: number;
    name: string;
    last_name: string;
    email: string;
    phone_number: number;
    birth_date: string;
    age: number;
    grade:string;
    classe?:number[];
    parent?: ParentDto | null;
    roles?: string[];
}

export default class CreateStudentModel{
    name: string;
    last_name: string;
    email: string;
    password:string;
    phone_number: number;
    birth_date: string;
    age: number;
    grade: string;
    parent?: number| null;
    roles?: string[];
}