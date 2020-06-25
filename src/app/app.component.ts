import { Component, Injectable } from '@angular/core';
// import { WebSocketAPI } from '../WebSocketAPI';
import { ApiService } from '../app/_api';
import { Inject } from '@angular/core';
// import { AppComponent } from '../app/app.component.ts';
import { DashboardComponent } from '../app/dashboard/dashboard.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
@Injectable()
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: [ './app.component.css' ],
	providers: [ ApiService ]
})
export class AppComponent {
	title = 'test-angular';

	// webSocketAPI: WebSocketAPI;
	apiService: ApiService;
	greeting: any;
	name: string;
	// dashboardComponent = new DashboardComponent();
	constructor() {
		// this.webSocketAPI = new WebSocketAPI();
	}
	// constructor(apiService: ApiService) {
	// 	this.apiService = apiService;
	// 	// this.webSocketAPI = new WebSocketAPI();
	// 	// this.apiservice = new ApiService();
	// }
	// otherSimple: OtherSimpleService;

	// constructor(otherSimple: any) { (1)
	//     this.otherSimple = otherSimple;
	// };

	// constructor(apiService: ApiService) {
	// 	this.apiService = apiService;
	// }

	ngOnInit() {
		// this.da;
		// this.webSocketAPI = new WebSocketAPI(new AppComponent());
		console.log('on init');
	}

	// connect() {
	// 	this.webSocketAPI._connect();
	// }

	// disconnect() {
	// 	this.webSocketAPI._disconnect();
	// }

	// sendMessage() {
	// 	this.webSocketAPI._send(this.name);
	// }

	handleMessage(message) {
		this.greeting = message;
	}
	test() {
		console.log('BOOMasdasd ==== BOOOM');
	}

	subscribeTopic(topic) {
		console.log('APP subscribeTopic', topic);
	}
}
