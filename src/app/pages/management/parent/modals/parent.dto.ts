interface ParentDto {
    id?:number;
    name: string;
    last_name: string;
    email: string;
    phone_number:number;
    birth_date: string;
    age: number;
    students?: string[];
    roles?: string[];
}
export default ParentDto;