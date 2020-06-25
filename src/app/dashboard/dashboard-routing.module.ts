import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { BrowserModule } from '@angular/platform-browser';
import { DataTablesModule } from 'angular-datatables';

// import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DtapiService } from '../_api/dtapi.service';

import { DashoneComponent } from '../components/dashone/dashone.component';
import { NetworkComponent } from './network/network.component';
import { LicenseComponent } from './license/license.component';
import { GraphComponent } from './graph/graph.component';
import { UsersComponent } from './users/users.component';
import { DatatablesComponent } from './datatables/datatables.component';
import { AngDtablesComponent } from './ang-dtables/ang-dtables.component';

const routes: Routes = [
	{ path: '', component: DashoneComponent },
	{ path: 'dashone', component: DashoneComponent },
	{ path: 'network', component: NetworkComponent },
	{ path: 'license', component: LicenseComponent },
	{ path: 'graph', component: GraphComponent },
	{ path: 'users', component: UsersComponent },
	{ path: 'datatables', component: DatatablesComponent },
	{ path: 'angdtables', component: AngDtablesComponent }
];

@NgModule({
	imports: [
		RouterModule.forChild(routes),
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		// BrowserModule,
		DataTablesModule
	],
	exports: [ RouterModule ],
	declarations: [
		DashoneComponent,
		NetworkComponent,
		LicenseComponent,
		GraphComponent,
		UsersComponent,
		DatatablesComponent,
		AngDtablesComponent
	],
	providers: [ DtapiService ]
})
export class DashboardRoutingModule {}
