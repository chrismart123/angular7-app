import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FooterComponent } from './components/footer/footer.component';

import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashoneComponent } from './components/dashone/dashone.component';
import { DashboardModule } from './dashboard/dashboard.module';

import { AuthGuard } from './_helpers';

const routes: Routes = [
	{ path: '', redirectTo: 'login', pathMatch: 'full' },
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: 'dashboard',
		component: DashboardComponent,
		canActivate: [ AuthGuard ],
		loadChildren: () => DashboardModule
		// loadChildren: './dashboard/dashboard.module.ts#DashboardModule'
		// loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule)
		// () => import(`./admin/admin.module`).then(m => m.AdminModule) },
		// children: [
		// 	{ path: '', component: DashoneComponent, outlet: 'dashboard' },
		// 	{ path: 'dash', component: DashoneComponent, outlet: 'dashboard' }
		// 	// {path: 'networksetting', component: ArtistAlbumListComponent},
		// ]
	},
	{ path: '**', component: LoginComponent }
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' }),
		FormsModule,
		ReactiveFormsModule,
		CommonModule
	],
	exports: [ RouterModule ],
	declarations: [
		HeaderComponent,
		SidebarComponent,
		FooterComponent,
		LoginComponent,
		DashboardComponent
		// DashoneComponent
	]
})
export class AppRoutingModule {}
