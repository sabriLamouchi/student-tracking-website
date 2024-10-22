import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DashboardsRoutingModule } from './dashboards-routing.module';
import { UIModule } from '../../shared/ui/ui.module';
import { WidgetModule } from '../../shared/widget/widget.module';

import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from './saas/shared/shared.module'

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule,BsDropdownConfig} from 'ngx-bootstrap/dropdown';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';

import { SimplebarAngularModule } from 'simplebar-angular';

import { DefaultComponent } from './default/default.component';
import { SaasComponent } from './saas/saas.component';
import { CryptoComponent } from './crypto/crypto.component';
import { BlogComponent } from './blog/blog.component';
import { JobsComponent } from './jobs/jobs.component';
import { ManagementModule } from '../management/management.module';
import { AuthenticationModule } from 'src/app/authentication/authentication.module';
import { defaultService } from './default/default.service';

@NgModule({
  declarations: [DefaultComponent, SaasComponent, CryptoComponent, BlogComponent, JobsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardsRoutingModule,
    UIModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    TabsModule.forRoot(),
    CarouselModule.forRoot(),
    WidgetModule,
    NgApexchartsModule,
    SharedModule,
    SimplebarAngularModule,
    ModalModule.forRoot(),
    ManagementModule,
    AuthenticationModule,
  ],
  providers: [BsDropdownConfig,defaultService],
})
export class DashboardsModule { }
