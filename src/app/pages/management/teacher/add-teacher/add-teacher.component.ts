import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ParentService } from '../../parent/parent.service';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TeacherService } from '../teacher.service';
import { SubjectService } from '../../subject/subject.service';
import { SubjectModel } from '../../subject/subject.model';
import { teacherModel } from '../modal/teacher.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-teacher',
  templateUrl: './add-teacher.component.html',
  styleUrls: ['./add-teacher.component.scss']
})
export class AddTeacherComponent implements OnInit {
  constructor(public formBuilder: FormBuilder,private teacherService:TeacherService,private parentService:ParentService,private subjectService:SubjectService, private toastr:ToastrService,private modalService: BsModalService) { }
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
  parents_names: string[]=[];
  roles: string[]=["parent","admin"];
  subjects: SubjectModel[]=[];
  teachersList:any[]=[];
  subjects_names: string[]=[];
  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      id:['',[Validators.nullValidator]],
      name: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      last_name: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      email:['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
      phone_number: ['', [Validators.required, Validators.pattern('^\\d{8}$')]],
      password: ['', [Validators.required]],
      birth_date: ['', [Validators.required,Validators.pattern('^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/(19|20)\\d\\d$')]],
      age: ['', [Validators.required]],
      roles: ['', [Validators.nullValidator]],
      subjects: ['', [Validators.nullValidator]],
      classes: ['', [Validators.nullValidator]],
    });
    this.submit = false;

    //fetch subjects
    this.fetchSubjects();

    // Fetch teachers
    this.fetchTeachers();


  }
  //*** */ Fetch students ***
  async fetchSubjects(): Promise<void> {
    try {
      this.subjectService.getAllSubjects().subscribe(subjectList=>{
        this.subjects=subjectList;
        console.log("subjectList",this.subjects);
        this.subjects_names=this.subjects.map(subject=>( subject.name))
      });
    } catch (error) {
      console.error('Error fetching subjects', error.message);
    }finally{
      console.log("subjects",this.subjects);
    }
  }
  //*** */ Fetch Teachers ***
  async fetchTeachers(): Promise<void> {
    try {
      this.teachersList = await this.teacherService.getAllTeachers();
    } catch (error) {
      console.error('Error fetching teachers', error.message);
    }finally{
      console.log("teachers",this.teachersList);
    }
  }
  async deleteTeacher(id:number){
    try {
      this.teacherService.removeTeacher(id).subscribe(
        evnt => {
          this.toastr.success('teacher deleted with success!!.', 'Bootstrap');
          this.fetchTeachers();
        },
        error => {
          console.error('Error deleting teacher', error);
          this.toastr.error(error.message, 'Bootstrap');
        }
      );
    }catch(error){
      console.error('Error deleting teacher', error);
      this.toastr.error(error.message, 'Bootstrap');
    }
  }


  /**
   * Bootsrap validation form submit method
   */
  getSubjectsIdsByName(nls:any):string[]{
    let subjectsIds:any[]=[];
    for(let i=0;i<nls.length;i++){
      subjectsIds.push(...this.subjects.filter(subject=>(subject.name==nls[i])))
    }
    console.log("subjectsIds",subjectsIds);
    return subjectsIds.map(subject=>subject.id)
  }
  //valid submit
  validSubmit() {
    this.submit = true;
    if(this.formGroup.valid){
      console.log("row ",{...this.formGroup.getRawValue(),subjects:this.getSubjectsIdsByName(this.formGroup.get('subjects').value as string[]),roles:[...this.formGroup.get('roles').value,"teacher"]});
      this.teacherService.addTeacher(
        {
          ...this.formGroup.getRawValue(),
          phone_number:this.formGroup.get('phone_number').value as number,
          birth_date:this.formGroup.get('birth_date').value as string,
          subjects:this.getSubjectsIdsByName(this.formGroup.get('subjects').value as string[]),
          roles:this.formGroup.get('roles').value ? [...this.formGroup.get('roles').value,"teacher"] : ["teacher"],
          classes:[]
        }
      ).subscribe(
        newTeacher => {
          this.formGroup.reset();
          this.submit=!this.submit;
          console.log("newTeacher",newTeacher);
          this.toastr.success('teacaher saved with success!!.', 'Bootstrap');
          this.fetchTeachers();
        },
        error => {
          console.error('Error adding teacaher',error );
          this.submit=false;
          error.forEach(err => {
            this.toastr.error(err, 'Bootstrap');
          });
        }
      );
    }else{
      this.toastr.info('please fill the important inputs!!', 'Bootstrap');
    }
  }
   // Delete Data
   delete(event: any,teacherId:number) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger ms-2'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons
      .fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        showCancelButton: true
      })
      .then(result => {
        if (result.value) {
          swalWithBootstrapButtons.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          );
          event.target.closest('tr')?.remove();
          this.deleteTeacher(teacherId);
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelled',
            'Your imaginary file is safe :)',
            'error'
          );
        }
      });
  }
    /**
   * Open Edit modal
   * @param content modal content
   */
    editDataGet(id: any, content: any) {
      this.submitted = false;
      this.modalRef = this.modalService.show(content, { class: 'modal-md' });
      var modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
      modelTitle.innerHTML = 'Edit Teacher';
      var listData = this.teachersList.filter((teacher)=>teacher.id===id);
      console.log("Teacher selected",listData[0]);
      this.formGroup.controls['id'].setValue(listData[0].id);
      this.formGroup.controls['name'].setValue(listData[0].name);
      this.formGroup.controls['last_name'].setValue(listData[0].last_name);
      this.formGroup.controls['email'].setValue(listData[0].email);
      this.formGroup.controls['phone_number'].setValue(listData[0].phone_number);
      this.formGroup.controls['birth_date'].setValue(listData[0].birth_date);
      this.formGroup.controls['age'].setValue(listData[0].age);
      this.formGroup.controls['subjects'].setValue(listData[0].subjects.map((subject:any)=>subject.name));
      this.formGroup.controls['roles'].setValue(listData[0].roles);
    }
    closeModal(){
      this.modalRef?.hide();
      this.formGroup.reset();
    }
    saveEditStudent(){
      console.log(this.formGroup.value);
      
      this.teacherService.editTeacher(Number(this.formGroup.get('id')?.value),
        {name:this.formGroup.get('name')?.value,
          last_name:this.formGroup.get('last_name')?.value,
          email:this.formGroup.get('email')?.value,
          phone_number:this.formGroup.get('phone_number')?.value as number,
          birth_date:this.formGroup.get('birth_date')?.value,
          age:this.formGroup.get('age')?.value,
          subjects:this.getSubjectsIdsByName(this.formGroup.get('subjects').value as string[]),
          roles:this.formGroup.get('roles').value ? [...this.formGroup.get('roles').value] : ["teacher"]
        }
      ).subscribe(
        newTeacher=>{
          this.formGroup.reset();
          this.modalRef?.hide();
          this.toastr.success('Teacher updated with success!!.', 'Bootstrap');
          this.fetchTeachers();
        },
        error => {
          console.error('Error updating Teacher', error);
          this.toastr.error('Error updating Teacher', 'Bootstrap');
        }
      );
  }

}
