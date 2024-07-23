export interface teacherModel {
    id: number;
    name: string;
    last_name: string;
    email: string;
    phone_number: number;
    birth_date: string;
    age: number;
    grade: string;
    roles: string[];
    subjects?: number[];
  }