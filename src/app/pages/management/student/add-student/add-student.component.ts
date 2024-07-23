import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { StudentService } from '../student.service';
import { ToastrService } from 'ngx-toastr';
import { ParentService } from '../../parent/parent.service';
import { StudentModel } from '../student.model';
import ParentDto from '../../parent/modals/parent.dto';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.scss']
})
export class AddStudentComponent implements OnInit {
  constructor(public formBuilder: FormBuilder,private studentsService:StudentService,private parentService:ParentService, private toastr:ToastrService,private modalService: BsModalService) { }
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
  parents: ParentDto[]=[];
  parents_names: string[]=[];
  roles: string[]=["teacher","admin"];
  studentsList:StudentModel[]=[];
  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      id:['',[Validators.nullValidator]],
      name: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      last_name: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      email:['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
      password: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      birth_date: ['', [Validators.required,Validators.pattern('^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/(19|20)\\d\\d$')]],
      age: ['', [Validators.required]],
      grade: ['', [Validators.required]],
      roles: ['', [Validators.nullValidator]],
      parent: ['', [Validators.nullValidator]],
    });
    this.submit = false;

    //fetch parent
    this.fetchParents();

    // Fetch students
    this.fetchStudents();


  }
  async fetchParents(): Promise<void> {
    try {
      this.parentService.getAllParents(true).subscribe(parentList=>{
        this.parents=parentList;
        this.parents_names=parentList.map(parent=>(parent.name + ' - ' + parent.last_name))
        console.log("parentList",this.parents);
      });
    } catch (error) {
      console.error('Error fetching parent', error.message);
    }finally{
      console.log("parentList",this.parents);
    }
  }
  //*** */ Fetch students ***
  async fetchStudents(): Promise<void> {
    try {
      this.studentsList = await this.studentsService.getAllStudents();
    } catch (error) {
      console.error('Error fetching students', error.message);
    }finally{
      console.log("students",this.studentsList);
    }
  }
  async deleteStudent(id:number){
    try {
      this.studentsService.removeStudent(id).subscribe(
        evnt => {
          this.toastr.success('student deleted with success!!.', 'Bootstrap');
          this.fetchStudents();
        },
        error => {
          console.error('Error deleting student', error);
          this.toastr.error(error.message, 'Bootstrap');
        }
      );
    }catch(error){
      console.error('Error deleting student', error);
      this.toastr.error(error.message, 'Bootstrap');
    }
  }


  /**
   * Bootsrap validation form submit method
   */
  getParentsIdsByNameAndLastName(nls:any):string[]{
    if(!nls) return null
    console.log("nls", typeof nls);
    let parentId:any[]=[];
    console.log("nls",nls);
    parentId=this.parents.filter(parents=>(parents.name==nls.split(" - ")[0] && parents.last_name==nls.split(" - ")[1]))
    console.log("parentsId",parentId);
    return parentId.map(parent=>parent.id)[0]
  }
  //valid submit
  validSubmit() {
    this.submit = true;
    if(this.formGroup.valid){
      console.log("row ",{...this.formGroup.getRawValue(),parent:this.getParentsIdsByNameAndLastName(this.formGroup.get('parent').value as string)});
      // console.log("parent",this.getParentsIdsByNameAndLastName(this.formGroup.get('parent').value as string)[0] )
      this.studentsService.addStudent(
        {
          ...this.formGroup.getRawValue(),
          phone_number:this.formGroup.get('phoneNumber').value as number,
          birth_date:this.formGroup.get('birth_date').value as string,
          parent:this.formGroup.get('parent').value ? Number(this.getParentsIdsByNameAndLastName(this.formGroup.get('parent').value as string)) : null,
          roles:["student"]
        }
      ).subscribe(
        newStudent => {
          this.formGroup.reset();
          this.submit=!this.submit;
          console.log("newStudent",newStudent);
          this.toastr.success('Student saved with success!!.', 'Bootstrap');
          this.fetchStudents();
        },
        error => {
          console.error('Error adding student',error );
          this.submit=false;
          error.forEach(err => {
            this.toastr.error(err, 'Bootstrap');
          });
        }
      );
    }else{
      this.toastr.info('please fill the important inputs!!', 'Bootstrap');
      console.log("form invalid",this.formGroup.getError('students'))
    }
  }
   // Delete Data
   delete(event: any,parentId:number) {
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
          this.deleteStudent(parentId);
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
      modelTitle.innerHTML = 'Edit Student';
      var listData = this.studentsList.filter((student)=>student.id===id);
      console.log("student selected",listData[0]);
      this.formGroup.controls['id'].setValue(listData[0].id);
      this.formGroup.controls['name'].setValue(listData[0].name);
      this.formGroup.controls['last_name'].setValue(listData[0].last_name);
      this.formGroup.controls['email'].setValue(listData[0].email);
      this.formGroup.controls['phoneNumber'].setValue(listData[0].phone_number)
      this.formGroup.controls['grade'].setValue(listData[0].grade);
      this.formGroup.controls['birth_date'].setValue(listData[0].birth_date);
      this.formGroup.controls['age'].setValue(listData[0].age);
      this.formGroup.controls['parent'].setValue(listData[0]&&listData[0].parent.name + ' - ' +listData[0].parent.last_name);
      this.formGroup.controls['roles'].setValue(listData[0].roles);
    }
    closeModal(){
      this.modalRef?.hide();
      this.formGroup.reset();
    }
    saveEditStudent(){
      console.log(this.formGroup.value);
      
      this.studentsService.editStudent(Number(this.formGroup.get('id')?.value),
        {name:this.formGroup.get('name')?.value,
          last_name:this.formGroup.get('last_name')?.value,
          email:this.formGroup.get('email')?.value,
          birth_date:this.formGroup.get('birth_date')?.value,
          age:this.formGroup.get('age')?.value,
          parent:this.getParentsIdsByNameAndLastName(this.formGroup.get('parent').value as string),
          roles:this.formGroup.get('roles').value ? [...this.formGroup.get('roles').value] : ["student"]
        }
      ).subscribe(
        newStudent=>{
          this.formGroup.reset();
          this.modalRef?.hide();
          this.toastr.success('Parent updated with success!!.', 'Bootstrap');
          this.fetchStudents();
        },
        error => {
          console.error('Error updating student', error);
          this.toastr.error('Error updating student', 'Bootstrap');
        }
      );
  }
}
