import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';

import { AddParentComponent } from './parent/add-parent/add-parent.component';
import { AddTeacherComponent } from './teacher/add-teacher/add-teacher.component';
import { AddStudentComponent } from './student/add-student/add-student.component';
import { ManagementRoutingModule } from './management-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// dropzone
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { StudentService } from './student/student.service';
import { ParentService } from './parent/parent.service';

//Ui
import { UIModule } from 'src/app/shared/ui/ui.module';
import { UiModule } from '../ui/ui.module';
import { SubjectComponent } from './subject/subject.component';
import { TeacherService } from './teacher/teacher.service';
import { SubjectService } from './subject/subject.service';
import { ScolarComponent } from './scolar/scolar.component';
import { ScolarService } from './scolar/scolar.service';
import { ClasseListService } from './scolar/classList.service';

@NgModule({
  declarations: [
    AddParentComponent,
    AddTeacherComponent,
    AddStudentComponent,
    SubjectComponent,
    ScolarComponent
  ],
  imports: [
    CommonModule,
    ManagementRoutingModule,
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    NgSelectModule,
    NgxDropzoneModule,
    FormsModule,
    ReactiveFormsModule,
    UIModule,
    UiModule,
  ],
  providers: [
    StudentService,ParentService,TeacherService,SubjectService,ScolarService,DecimalPipe,ClasseListService]
})
export class ManagementModule { }
