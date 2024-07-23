import { Component } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { teacherModel } from '../teacher/modal/teacher.model';
import { SubjectService } from '../subject/subject.service';
import { ToastrService } from 'ngx-toastr';
import { TeacherService } from '../teacher/teacher.service';
import { ScolarService } from './scolar.service';
import { classeModel } from './modal/scolarYearDTO.model';
import { StudentService } from '../student/student.service';
import { StudentModel } from '../student/student.model';
import { ClasseListService } from './classList.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-scolar',
  templateUrl: './scolar.component.html',
  styleUrls: ['./scolar.component.scss']
})
export class ScolarComponent {
content: any;
total: Observable<number>;
classForm: UntypedFormGroup;
YearForm: UntypedFormGroup;
submitted: boolean = false;
modalRef?: BsModalRef;
// Form submition
submit: boolean;
teachers: teacherModel[]=[];
ScolarYearsList:any[]=[];
teachers_names: string[]=[];
subjects_names: string[]=[];
classes:classeModel[];
classesList:Observable<classeModel[]>;
studentsList:StudentModel[]=[];
students_names:string[]=[];
subjectsList:any[]=[];
years:string[]=[];
  constructor(public formBuilder: FormBuilder,private teacherService:TeacherService,private subjectService:SubjectService, private toastr:ToastrService,private modalService: BsModalService,
    private scolarService:ScolarService,private studentsService:StudentService,public classListService:ClasseListService
  ) {
    this.total = classListService.total$;
    this.classesList=classListService.classes$;
   }
  /**
   * Returns form
   */
  get form() {
    return this.YearForm.controls;
  }

  ngOnInit() {
    this.YearForm = this.formBuilder.group({
      // id:['',[Validators.nullValidator]],
      year: ['', [Validators.required, Validators.pattern('^\\d{4}/\\d{4}$')]],
    });
    this.classForm = this.formBuilder.group({
      // id:['',[Validators.nullValidator]], // not required
      teacher: ['', [Validators.required]],
      student: ['', [Validators.required]],
      subject: ['', [Validators.required]],
      scolar: ['', [Validators.required]],
    });
    this.submit = false;

    // fetch classes
    // this.fetchClasses();

    // Fetch scolar years
    this.fetchScolarYears();

    // Fetch teachers
    this.fetchTeachers();

    // Fetch students
    this.fetchStudents();

    // Fetch subjects
    this.fetchSubjects();
    this.classesList.subscribe(classe=>{
      this.classes=classe;
      console.log("classes",classe);
    })

  }
  //*** */ Fetch teachers ***
  // async fetchClasses(): Promise<void> {
  //   try {
  //     this.scolarService.getAllClasses().subscribe(classList=>{
  //       this.classes=classList;
  //       console.log("classes",this.classes);
  //     });
  //   } catch (error) {
  //     console.error('Error fetching classses', error.message);
  //   }finally{
  //     console.log("classes",this.classes);
  //   }
  // }
  
  async fetchTeachers(): Promise<void> {
    try {
        this.teachers=await this.teacherService.getAllTeachers()
        console.log("teachers",this.teachers);
        this.teachers_names=this.teachers.map(teacher=>( teacher.name+' - '+teacher.last_name))
    } catch (error) {
      console.error('Error fetching teachers', error.message);
    }finally{
      console.log("teachers",this.teachers);
    }
  }

  async fetchScolarYears(): Promise<void> {
    try {
      this.scolarService.getAllScolarYears().subscribe(yearsLists=>{
        this.ScolarYearsList=yearsLists;
        this.years=yearsLists.map(year=>year.year)
        console.log("ScolarYearList",this.ScolarYearsList);
      });
    } catch (error) {
      console.error('Error fetching years', error.message);
    }finally{
      console.log("scolar Years",this.ScolarYearsList);
    }
  }
  //*** */ Fetch students ***
  async fetchStudents(): Promise<void> {
    try {
      this.studentsList = await this.studentsService.getAllStudents();
      this.students_names=this.studentsList.map(student=>( student.name+' - '+student.last_name))
    } catch (error) {
      console.error('Error fetching students', error.message);
    }finally{
      console.log("students",this.studentsList);
    }
  }
    //*** */ Fetch subjects ***
    async fetchSubjects(): Promise<void> {
      try {
        this.subjectService.getAllSubjects().subscribe(subjectList=>{
          this.subjectsList=subjectList;
          console.log("subjectList",this.subjectsList);
          this.subjects_names=this.subjectsList.map(subject=>( subject.name))
        });
      } catch (error) {
        console.error('Error fetching subjects', error.message);
      }finally{
        console.log("subjects",this.subjectsList);
      }
    }

  async deleteScolarYear(id:number){
    try {
      this.subjectService.removeSubject(id).subscribe(
        evnt => {
          this.toastr.success('scolar year deleted with success!!.', 'Bootstrap');
          this.fetchScolarYears();
        },
        error => {
          console.error('Error deleting scolar year', error);
          this.toastr.error(error.message, 'Bootstrap');
        }
      );
    }catch(error){
      console.error('Error deleting scolar year', error);
      this.toastr.error(error.message, 'Bootstrap');
    }
  }


  /**
   * Bootsrap validation form submit method
   */
  getIdsByNameAndLastName(nls:any,list:any[]):any{
    if(!nls) return null
    console.log("nls", typeof nls);
    let Id:any[]=[];
    console.log("nls",nls);
    Id=list.filter(item=>(item.name==nls.split(" - ")[0] && item.last_name==nls.split(" - ")[1]))
    const ids=Id.map(item=>item.id);
    console.log("ids",ids);
    return ids[0]
  }
  getIdByName(nls:any,list:any[]):any{
    if(!nls) return null
    console.log("nls", typeof nls);
    let Id:any[]=[];
    console.log("nls",nls);
    Id=list.filter(item=>(item.name==nls || item.year==nls))
    const ids=Id.map(item=>item.id);
    console.log("ids",ids);
    return ids[0]
  }
  //valid submit
  saveYear() {
    this.submit = true;
    if(this.YearForm.valid){
      this.scolarService.addScolarYear(
        {
          year:this.YearForm.get('year').value,
        }
      ).subscribe(
        newSubject => {
          this.YearForm.reset();
          this.submit=!this.submit;
          console.log("newSubject",newSubject);
          this.toastr.success('subject saved with success!!.', 'Bootstrap');
          this.fetchScolarYears();
        },
        error => {
          console.error('Error adding scolar year',error );
          this.submit=false;
          this.toastr.error(error, 'Bootstrap');
        }
      );
    }else{
      this.toastr.info('please fill the important inputs!!', 'Bootstrap');
    }
  }

  validSubmit(){
    this.submit = true;
    if(this.classForm.valid){
      console.log("finale",{
        teacher:this.classForm.get('teacher').value ? Number(this.getIdsByNameAndLastName(this.classForm.get('teacher').value as string,this.teachers)) : null,
        student:this.classForm.get('student').value ? Number(this.getIdsByNameAndLastName(this.classForm.get('student').value as string,this.studentsList)) : null,
        subject:this.classForm.get('subject').value ? Number(this.getIdByName(this.classForm.get('subject').value as string,this.subjectsList)) : null,
        scolar:this.classForm.get('scolar').value ? Number(this.getIdByName(this.classForm.get('scolar').value as string,this.ScolarYearsList)) : null,
      })
      this.scolarService.addClass(
        {
          teacher:this.classForm.get('teacher').value ? Number(this.getIdsByNameAndLastName(this.classForm.get('teacher').value as string,this.teachers)) : null,
          student:this.classForm.get('student').value ? Number(this.getIdsByNameAndLastName(this.classForm.get('student').value as string,this.studentsList)) : null,
          subject:this.classForm.get('subject').value ? Number(this.getIdByName(this.classForm.get('subject').value as string,this.subjectsList)) : null,
          scolar:this.classForm.get('scolar').value ? Number(this.getIdByName(this.classForm.get('scolar').value as string,this.ScolarYearsList)) : null,
        }
      ).subscribe(
        newClasse => {
          this.classForm.reset();
          this.submit=!this.submit;
          console.log("newClasse",newClasse);
          this.toastr.success('classe saved with success!!.', 'Bootstrap');
          // this.fetchClasses();
        },
        error => {
          console.error('Error adding classe',error );
          this.submit=false;
          this.toastr.error(error, 'Bootstrap');
        }
      );
    }else{
      this.toastr.info('please fill the important inputs!!', 'Bootstrap');
    }
  }
  openModal(content: any) {
    this.submitted = false;
    this.modalRef = this.modalService.show(content, { class: 'modal-md' });
  }
  closeModal(){
    this.modalRef?.hide();
    this.submitted = false;
    this.classForm.reset();
  }
}
