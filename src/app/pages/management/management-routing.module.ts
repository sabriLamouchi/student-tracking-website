import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddParentComponent } from './parent/add-parent/add-parent.component';
import { AddStudentComponent } from './student/add-student/add-student.component';
import { AddTeacherComponent } from './teacher/add-teacher/add-teacher.component';
import { SubjectComponent } from './subject/subject.component';
import { ScolarComponent } from './scolar/scolar.component';

const routes: Routes = [
   {
    path:"parent",
    component:AddParentComponent
   },
   {
    path:"student",
    component:AddStudentComponent
   },{
    path:"teacher",
    component:AddTeacherComponent
   },
   {
    path:"subject",
    component:SubjectComponent
   },
   {
    path:"scolar",
    component:ScolarComponent
   }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ManagementRoutingModule {}
