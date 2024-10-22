import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { emailSentBarChart, monthlyEarningChart } from './data';
import { ChartType } from './dashboard.model';
import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { EventService } from '../../../core/services/event.service';

import { ConfigService } from '../../../core/services/config.service';
import { ParentService } from '../../management/parent/parent.service';
import { StudentService } from '../../management/student/student.service';
import { TeacherService } from '../../management/teacher/teacher.service';
import { AuthService } from 'src/app/authentication/auth.service';
import { defaultService } from './default.service';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
interface stateData{
  icon:string;
  title:string;
  value:number;
}
@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss'],
})
export class DefaultComponent implements OnInit {
  modalRef?: BsModalRef;
  isVisible: string;
  profile:any;
  emailSentBarChart: ChartType;
  monthlyEarningChart: ChartType;
  transactions: any;
  statData: stateData[]=[];
  config:any = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  admins:any=[];
  submitted: boolean = false;
  isActive: string;

  @ViewChild('content') content;
  @ViewChild('center', { static: false }) center?: ModalDirective;
  formGroup: UntypedFormGroup;
  constructor(private modalService: BsModalService, private configService: ConfigService, private eventService: EventService,private parentService:ParentService,private studentsService:StudentService,private teacherService:TeacherService,private authService:AuthService,private defaultService:defaultService,
    public formBuilder: FormBuilder,private toastr:ToastrService,
  ) {
  }

  get form() {
    return this.formGroup.controls;
  }

  ngOnInit() {

    /**
     * horizontal-vertical layput set
     */
    
    this.formGroup = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      last_name: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      email:['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
      phone_number: ['', [Validators.required, Validators.pattern('^\\d{8}$')]],
      password: ['', [Validators.required]],
      birth_date: ['', [Validators.required,Validators.pattern('^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/(19|20)\\d\\d$')]],
      age: ['', [Validators.required]],
      roles: ['', [Validators.nullValidator]],
    });
    const attribute = document.body.getAttribute('data-layout');

    this.isVisible = attribute;
    const vertical = document.getElementById('layout-vertical');
    if (vertical != null) {
      vertical.setAttribute('checked', 'true');
    }
    if (attribute == 'horizontal') {
      const horizontal = document.getElementById('layout-horizontal');
      if (horizontal != null) {
        horizontal.setAttribute('checked', 'true');
      }
    }

    /**
     * Fetches the data
     */
    this.fetchParents();
    this.fetchStudents();
    this.fetchTeachers();
    this.getProfile();
    this.fetchadmins();
  }

  ngAfterViewInit() {
    setTimeout(() => {
     this.center?.show()
    }, 2000);
  }

  /**
   * Fetches the data
   */
  async getProfile(){
    this.authService.getProfile().subscribe(profile=>{
      this.profile = profile;
      console.log(profile)
    });
  }
  async fetchParents(): Promise<void> {
    try {
      this.parentService.getAllParents(false).subscribe(parentList=>{
        this.statData.push({icon:"bx bx-user-circle",title:"Parents",value:parentList.length});
      });
    } catch (error) {
      console.error('Error fetching parent', error.message);
    }
  }
  async fetchStudents(): Promise<void> {
    try {
      const studentsList = await this.studentsService.getAllStudents();
      this.statData.push({icon:"bx bx-user-circle",title:"Students",value:studentsList.length});
    } catch (error) {
      console.error('Error fetching students', error.message);
    }
  }
  async fetchTeachers(): Promise<void> {
    try {
      const teachersList = await this.teacherService.getAllTeachers();
      this.statData.push({icon:"bx bx-user-circle",title:"Teachers",value:teachersList.length});
    } catch (error) {
      console.error('Error fetching students', error.message);
    }
  }
  async fetchadmins(): Promise<void> {
    try {
      this.defaultService.getAdmins().subscribe(admins=>{
        this.admins=admins.filter((user)=>user.id!=this.profile.userId);
        console.log(this.admins);
      })
    } catch (error) {
      console.error('Error fetching students', error.message);
    }
  }
  
  private fetchData() {
    this.emailSentBarChart = emailSentBarChart;
    this.monthlyEarningChart = monthlyEarningChart;

    this.isActive = 'year';
    this.configService.getConfig().subscribe(data => {
      this.transactions = data.transactions;
      // this.statData = data.statData;
    });
  }
  saveAdmin(){
    console.log({...this.formGroup.value,roles:['admin']});
    if(this.formGroup.valid){
      this.defaultService.createAdmin({...this.formGroup.value,roles:['admin']}
    ).subscribe(
      newAdmin=>{
        this.formGroup.reset();
        this.modalRef?.hide();
        this.toastr.success('new admin created with success!!.', 'Bootstrap');
      },
      error => {
        console.error('Error updating Teacher', error);
        this.toastr.error('Error updating Teacher', 'Bootstrap');
      }
    );
    }else{
      this.toastr.info('please fill the important inputs!!', 'Bootstrap');
    }

}
closeModal(){
  this.modalRef?.hide();
  this.formGroup.reset();
}

  opencenterModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  openAddModal(content:any){
    this.modalRef = this.modalService.show(content, { class: 'modal-md' });
  }
  weeklyreport() {
    this.isActive = 'week';
    this.emailSentBarChart.series =
      [{
        name: 'Series A',
        data: [44, 55, 41, 67, 22, 43, 36, 52, 24, 18, 36, 48]
      }, {
        name: 'Series B',
        data: [11, 17, 15, 15, 21, 14, 11, 18, 17, 12, 20, 18]
      }, {
        name: 'Series C',
        data: [13, 23, 20, 8, 13, 27, 18, 22, 10, 16, 24, 22]
      }];
  }

  monthlyreport() {
    this.isActive = 'month';
    this.emailSentBarChart.series =
      [{
        name: 'Series A',
        data: [44, 55, 41, 67, 22, 43, 36, 52, 24, 18, 36, 48]
      }, {
        name: 'Series B',
        data: [13, 23, 20, 8, 13, 27, 18, 22, 10, 16, 24, 22]
      }, {
        name: 'Series C',
        data: [11, 17, 15, 15, 21, 14, 11, 18, 17, 12, 20, 18]
      }];
  }

  yearlyreport() {
    this.isActive = 'year';
    this.emailSentBarChart.series =
      [{
        name: 'Series A',
        data: [13, 23, 20, 8, 13, 27, 18, 22, 10, 16, 24, 22]
      }, {
        name: 'Series B',
        data: [11, 17, 15, 15, 21, 14, 11, 18, 17, 12, 20, 18]
      }, {
        name: 'Series C',
        data: [44, 55, 41, 67, 22, 43, 36, 52, 24, 18, 36, 48]
      }];
  }


  /**
   * Change the layout onclick
   * @param layout Change the layout
   */
  changeLayout(layout: string) {
    this.eventService.broadcast('changeLayout', layout);
  }
}
