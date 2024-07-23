import { Component } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { teacherModel } from '../teacher/modal/teacher.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TeacherService } from '../teacher/teacher.service';
import { SubjectService } from './subject.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss']
})
export class SubjectComponent {
  constructor(public formBuilder: FormBuilder,private teacherService:TeacherService,private subjectService:SubjectService, private toastr:ToastrService,private modalService: BsModalService) { }
  /**
   * Returns form
   */
  get form() {
    return this.formGroup.controls;
  }

  formGroup: UntypedFormGroup;
  submitted: boolean = false;
  modalRef?: BsModalRef;
  // Form submition
  submit: boolean;
  teachers: teacherModel[]=[];
  subjectsList:any[]=[];
  teachers_names: string[]=[];
  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      id:['',[Validators.nullValidator]],
      name: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
    });
    this.submit = false;

    //fetch subjects
    // this.fetchTeachers();

    // Fetch teachers
    this.fetchSubjects();


  }
  //*** */ Fetch teachers ***
  async fetchTeachers(): Promise<void> {
    try {
      
        this.teachers=await this.teacherService.getAllTeachers()
        console.log("teachers",this.teachers);
        this.teachers_names=this.teachers.map(teacher=>( teacher.name+'-'+teacher.last_name))
    } catch (error) {
      console.error('Error fetching teachers', error.message);
    }finally{
      console.log("teachers",this.teachers);
    }
  }
  //*** */ Fetch Teachers ***
  async fetchSubjects(): Promise<void> {
    try {
      this.subjectService.getAllSubjects().subscribe(subjectList=>{
        this.subjectsList=subjectList;
        console.log("subjectList",this.subjectsList);
      });
    } catch (error) {
      console.error('Error fetching teachers', error.message);
    }finally{
      console.log("teachers",this.subjectsList);
    }
  }
  async deleteSubject(id:number){
    try {
      this.subjectService.removeSubject(id).subscribe(
        evnt => {
          this.toastr.success('teacher deleted with success!!.', 'Bootstrap');
          this.fetchSubjects();
        },
        error => {
          console.error('Error deleting subject', error);
          this.toastr.error(error.message, 'Bootstrap');
        }
      );
    }catch(error){
      console.error('Error deleting subject', error);
      this.toastr.error(error.message, 'Bootstrap');
    }
  }


  /**
   * Bootsrap validation form submit method
   */
  getTeachersIdsByNameAndLastName(nls:any):string[]{
    let teachersIds:any[]=[];
    for(let i=0;i<nls.length;i++){
      teachersIds.push(...this.teachers.filter(teacher=>(teacher.name==nls[i].split(" - ")[0] && teacher.last_name==nls[i].split(" - ")[1])))
    }
    console.log("teachersIds",teachersIds);
    return teachersIds.map(teacher=>teacher.id)
  }
  //valid submit
  validSubmit() {
    this.submit = true;
    if(this.formGroup.valid){
      this.subjectService.addSubject(
        {
          name:this.formGroup.get('name').value,
          // teachers:this.getTeachersIdsByNameAndLastName(this.formGroup.get('teachers').value as string[]),
        }
      ).subscribe(
        newSubject => {
          this.formGroup.reset();
          this.submit=!this.submit;
          console.log("newSubject",newSubject);
          this.toastr.success('subject saved with success!!.', 'Bootstrap');
          this.fetchSubjects();
        },
        error => {
          console.error('Error adding subject',error );
          this.submit=false;
          this.toastr.error(error, 'Bootstrap');
        }
      );
    }else{
      this.toastr.info('please fill the important inputs!!', 'Bootstrap');
    }
  }
}
