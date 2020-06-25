// import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// import { HttpModule } from '@angular/http';
import { DashboardRoutingModule } from '../dashboard/dashboard-routing.module';
import { ApiService } from '../_api';
import { DataTablesModule } from 'angular-datatables';
import { WebSocketAPI } from '../../WebSocketAPI';
import { DtapiService } from '../_api/dtapi.service';
import { AngDtablesComponent } from './ang-dtables/ang-dtables.component';
// import { DatatablesComponent } from './datatables/datatables.component';
// import { NgxDatatableModule } from '@swimlane/ngx-datatable';

// import { FlotModule } from 'ng2modules-flot';

// import { DashboardComponent } from './dashboard.component';
@NgModule({
	imports: [
		CommonModule,
		HttpClientModule,
		DashboardRoutingModule,
		// NgxDatatableModule
		// HttpModule,
		DataTablesModule
		// FlotModule,
	],
	providers: [ WebSocketAPI, ApiService, DtapiService ],
	bootstrap: []
	// declarations: [ AngDtablesComponent ]
	// declarations: [ DashoneComponent ]
})
export class DashboardModule {}
