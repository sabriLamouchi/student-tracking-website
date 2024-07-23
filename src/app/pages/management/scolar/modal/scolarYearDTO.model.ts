import { StudentModel } from "../../student/student.model";
import { SubjectModel } from "../../subject/subject.model";
import { teacherModel } from "../../teacher/modal/teacher.model";

export interface scolarYearDTO{
    year:string;
}

export interface classeModel{
    name:string;
    teacher:teacherModel;
    student:StudentModel;
    scolar:scolarYearDTO;
    subject:SubjectModel;

}
export interface createClassDTO{
    teacher:number;
    student:number;
    scolar:number;
    subject:number;
}