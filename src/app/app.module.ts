import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';
// import { HttpModule } from '@angular/http';

@NgModule({
	declarations: [ AppComponent ],
	imports: [
		HttpClientModule,
		BrowserModule,
		AppRoutingModule,
		DataTablesModule
		// HttpModule,
	],
	providers: [],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
