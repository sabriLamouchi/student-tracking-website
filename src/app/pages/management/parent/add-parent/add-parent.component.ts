import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { StudentService } from '../../student/student.service';
import { ParentService } from '../parent.service';
import { ToastrService } from 'ngx-toastr';
import { er } from '@fullcalendar/core/internal-common';
import ParentDto from '../modals/parent.dto';
import Swal from 'sweetalert2';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-add-parent',
  templateUrl: './add-parent.component.html',
  styleUrls: ['./add-parent.component.scss']
})
export class AddParentComponent implements OnInit {
  constructor(public formBuilder: FormBuilder, private http: HttpClient,private studentsService:StudentService,private parentService:ParentService, private toastr:ToastrService,private modalService: BsModalService) { }
  /**
   * Returns form
   */
  get form() {
    return this.parentForm.controls;
  }

  parentForm: UntypedFormGroup;
  submitted: boolean = false;
  modalRef?: BsModalRef;

  // Form submition
  submit: boolean;
  files: File[] = [];
  students: any=[];
  students_names: string[]=[];
  roles: string[]=["teacher","admin"];
  parentList:ParentDto[]=[];
  ngOnInit() {
    this.parentForm = this.formBuilder.group({
      id:['',[Validators.nullValidator]],
      name: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      last_name: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      email:['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^\\d{8}$')]],
      password: ['', [Validators.required]],
      birth_date: ['', [Validators.required, Validators.pattern('^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/(19|20)\\d\\d$')]],
      age: ['', [Validators.required]],
      roles: ['', [Validators.nullValidator]],
      students: ['', [Validators.nullValidator]],
    });
    this.submit = false;

    // Fetch students
    this.fetchStudents();

    //fetch parent
    this.fetchParents();

  }
  async fetchParents(): Promise<void> {
    try {
      this.parentService.getAllParents(false).subscribe(parentList=>{
        this.parentList=parentList;
        console.log("parentList",this.parentList);
      });
    } catch (error) {
      console.error('Error fetching parent', error.message);
    }finally{
      console.log("parentList",this.parentList);
    }
  }
  //*** */ Fetch students ***
  async fetchStudents(): Promise<void> {
    try {
      this.students = await this.studentsService.getAllStudents();
      this.students_names=this.students.map(student=>( student.name + ' - ' + student.last_name))
    } catch (error) {
      console.error('Error fetching students', error.message);
    }finally{
      console.log("students",this.students);
    }
  }
  async deleteParent(id:number){
    try {
      this.parentService.removeParent(id).subscribe(
        evnt => {
          this.toastr.success('Parent deleted with success!!.', 'Bootstrap');
          this.fetchParents();
        },
        error => {
          console.error('Error deleting parent', error);
          this.toastr.error(error.message, 'Bootstrap');
        }
      );
    }catch(error){
      console.error('Error deleting parent', error);
      this.toastr.error(error.message, 'Bootstrap');
    }
  }


onSelect(event: any) {
  this.files.push(...event.addedFiles);
  let file: File = event.addedFiles[0];
  const reader = new FileReader();
  reader.onload = () => {
    setTimeout(() => {
      // this.profile.push(this.imageURL)
    }, 100);
  }
  reader.readAsDataURL(file)
}
  /**
   * Bootsrap validation form submit method
   */
  getStudentsIdsByNameAndLastName(nls:any):string[]{
    let studentsId:any[]=[];
    for(let i=0;i<nls.length;i++){
      studentsId.push(...this.students.filter(student=>(student.name==nls[i].split(" - ")[0] && student.last_name==nls[i].split(" - ")[1])))
    }
    console.log("studentsId",studentsId);
    return studentsId.map(student=>student.id)
  }
  validSubmit() {
    this.submit = true;
    if(this.parentForm.valid){
      console.log("row ",{...this.parentForm.getRawValue(),students:this.getStudentsIdsByNameAndLastName(this.parentForm.get('students').value as string[])});
      this.parentService.addParent(
        {...this.parentForm.getRawValue(),
          phone_number:this.parentForm.get('phoneNumber').value as number,
          students:this.getStudentsIdsByNameAndLastName(this.parentForm.get('students').value as string[]),
          roles:this.parentForm.get('roles').value ? [...this.parentForm.get('roles').value,"parent"] : ["parent"]
        }
      ).subscribe(
        newStudent => {
          this.parentForm.reset();
          this.submit=!this.submit;
          console.log("newStudent",newStudent);
          this.toastr.success('Parent saved with success!!.', 'Bootstrap');
          this.fetchParents();
        },
        error => {
          console.error('Error adding parent', error);
          this.submit=false;
          this.toastr.error(error.message, 'Bootstrap');
        }
      );
    }else{
      this.toastr.info('please fill the important inputs!!', 'Bootstrap');
      console.log("form invalid",this.parentForm.getError('students'))
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
          this.deleteParent(parentId);
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
    modelTitle.innerHTML = 'Edit Parent';
    var listData = this.parentList.filter((parent)=>parent.id===id);
    console.log("parent selected",listData[0]);
    this.parentForm.controls['id'].setValue(listData[0].id);
    this.parentForm.controls['name'].setValue(listData[0].name);
    this.parentForm.controls['last_name'].setValue(listData[0].last_name);
    this.parentForm.controls['email'].setValue(listData[0].email);
    this.parentForm.controls['phoneNumber'].setValue(listData[0].phone_number);
    this.parentForm.controls['birth_date'].setValue(listData[0].birth_date);
    this.parentForm.controls['age'].setValue(listData[0].age);
    this.parentForm.controls['students'].setValue(listData[0].students.map((student:any)=>student.name+' - '+student.last_name));
  }
  
  closeModal(){
    this.modalRef?.hide();
    this.parentForm.reset();
  }

  saveEditParent(){
      console.log(this.parentForm.value);
      
      this.parentService.editParent(Number(this.parentForm.get('id')?.value),
        {name:this.parentForm.get('name')?.value,
          last_name:this.parentForm.get('last_name')?.value,
          email:this.parentForm.get('email')?.value,
          phone_number:this.parentForm.get('phoneNumber')?.value as number,
          birth_date:this.parentForm.get('birth_date')?.value,
          age:this.parentForm.get('age')?.value,
          students:this.getStudentsIdsByNameAndLastName(this.parentForm.get('students').value as string[]),
          roles:this.parentForm.get('roles').value ? [...this.parentForm.get('roles').value] : ["parent"]
        }
      ).subscribe(
        newParent=>{
          this.parentForm.reset();
          this.modalRef?.hide();
          this.toastr.success('Parent updated with success!!.', 'Bootstrap');
          this.fetchParents();
        },
        error => {
          console.error('Error adding parent', error);
          this.toastr.error(error.message, 'Bootstrap');
        }
      );
  }
}
