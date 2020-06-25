import { Component, OnInit, Injectable, OnChanges, ViewChild } from '@angular/core';
import { ApiService } from '../_api';
import { first, map } from 'rxjs/operators';
import { WebSocketAPI } from '../../WebSocketAPI';
import { Router, RouterOutlet } from '@angular/router';
import { HostListener } from '@angular/core';
import { UsersComponent } from '../dashboard/users/users.component';
import { DatatablesComponent } from '../dashboard/datatables/datatables.component';
import { AngDtablesComponent } from '../dashboard/ang-dtables/ang-dtables.component';
import { DataTableDirective } from 'angular-datatables';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { from } from 'rxjs';

@Injectable({ providedIn: 'root' })
@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: [ './dashboard.component.css' ],
	providers: [ UsersComponent, DatatablesComponent, AngDtablesComponent ]
})
export class DashboardComponent implements OnInit, OnChanges {
	@ViewChild(DataTableDirective) datatableElement: DataTableDirective;
	// @ViewChild('myRouterOutlet', { static: true })
	// routerOutlet: RouterOutlet;
	webSocketAPI: WebSocketAPI;
	greeting: any;
	name: string;
	apiService: ApiService;
	// userC: UsersComponent;
	webSocketEndPoint: string = 'http://localhost:8080/gbWebApp/stomp';
	topic: string = 'http://localhost:8080/api/json/admin/topic/greetings';
	stompClient: any;

	// appComponent = new AppComponent();
	// appComponent = AppComponent;
	// UsersComponent = new UsersComponent();
	// dashtest: DashboardComponent;
	loggedIn = true;
	logout = false;
	listeners = [];
	StompTopic = {};
	// router: any;
	// @HostListener('document:keyup', [ '$event' ])
	// onKeyUp(ev: KeyboardEvent) {
	// 	// do something meaningful with it
	// 	console.log(`The user just pressed ${ev.key}!`);
	// }

	// @HostListener('document:storage', [ '$event' ])
	// onStorage($event): void {
	// 	console.log(`onStorage ${$event.type}`);
	// }
	constructor(
		apiService: ApiService,
		private router: Router,
		private userC: UsersComponent,
		private dTables: DatatablesComponent,
		private angDT: AngDtablesComponent
	) {
		this.apiService = apiService;
		this.userC = userC;
		this.dTables = dTables;
		this.angDT = angDT;
		this.connect();
		console.log('userC', this.userC);
		window.addEventListener(
			'storage',
			(event) => {
				if (event.storageArea == localStorage) {
					let token = localStorage.getItem('currentUser');
					if (token == undefined) {
						this.loggedIn = false;
						window.location.href = '/';
					}
				}
			},
			false
		);
	}

	userName = '';
	dataValue = {};
	allUsers = [];
	count: any;
	testValue = 'test';
	currentSessions = [];

	pingLoopStarted = false;

	ngOnInit() {
		// this.webSocketAPI._connect();

		console.log('DASHBOARD FIRST INITIALIZE this.loggedIn', this.loggedIn);
		// if (this.loggedIn) {

		// this.loggedIn = true;
		console.log('WebSocketAPI on init');
		let user = {
			token: ''
		};

		//to connect always in the server with out removing session id
		this.pingLoop();
		this.allUsers = [];
		this.callapi_getAllSessions();
		this.callapi_getLogSessions();
		// this.updateUserList();
		// } else {
		// 	this.router.navigate([ '/login' ]);
		// }
	}

	pingLoop() {
		if (!this.pingLoopStarted) {
			this.pingLoopStarted = true;
			window.setInterval(() => {
				this.apiService.playPing().subscribe((data) => {}, (error) => {});
			}, 1000);
		}
	}

	async updateUserList() {
		console.log('updateUserList');
		this.callapi_getAllSessions();
		this.callapi_getLogSessions();
		// console.log('thisSession', thisSession);
		// console.log('allSessions', allSessions);
		// this.currentSessions = allSessions.length;
	}

	async callapi_getLogSessions() {
		await this.apiService.getLogSessions().pipe(first()).subscribe(
			(data) => {
				console.log('getLogSessions data', data);
				this.dataValue = data;
				this.userName = data.userName;
				// console.log('localStorage', localStorage);
				if (localStorage.length != 0) {
					var item = JSON.parse(localStorage.currentUser);
					// console.log('callapi_getLogSessions', item);
					if (item.token == '') {
						item.token = data.sessionId;
					} else {
						// this.router.navigate([ '/login' ]);
						// this.router.navigate([ '/login' ]);
					}
					localStorage.setItem('currentUser', JSON.stringify(item));
				} else {
					console.log('i will be redirected in login');
					// this.router.navigate([ '/login' ]);
				}
			},
			(error) => {
				console.log('getLogSessions error', error);
			}
		);
	}
	async callapi_getAllSessions() {
		await this.apiService.getAllSessions().pipe(first()).subscribe(
			(data) => {
				console.log('getAllSessions data', data);
				this.allUsers = data;
				this.count = data.length;
			},
			(error) => {
				console.log('getAllSessions error', error);
				// window.location.href = '/';
				// this.router.navigate([ '/login' ]);
			}
		);
	}

	ngOnChanges() {
		console.log('ngOnChanges');
		this.callapi_getAllSessions();
	}

	ngAfterViewInit() {
		console.log('ngAfterViewInit', this.loggedIn);
		// if (this.loggedIn == false) {
		// 	console.log('redirect me to login');
		// 	this.router.navigate([ '/login' ]);
		// }
	}

	connect() {
		console.log('========= INITIALIZE CONNECTION ==============');
		// this.webSocketAPI._connect();
		console.log('Initialize WebSocket Connection');
		let ws = new SockJS(this.webSocketEndPoint);
		this.stompClient = Stomp.over(ws);

		console.log('WS', ws);
		console.log('stompClient', this.stompClient);
		const _this = this;

		if (_this.stompClient === undefined) {
			console.log(`DataSource: No websocket connection can be made`);
			return;
		}
		console.log('websocket connected');
		console.log('StompTopic', this.StompTopic['LogUpdate']);

		_this.stompClient.connect(
			{},
			function(frame) {
				console.log('BOOM');

				_this.stompClient.reconnect_delay = 2000;

				// _this.subscribeTopic('/topic/notifyRouteLogUpdate');
				// _this.subscribeTopic('/topic/ipStreamStatus/thumbnailUpdate');
				// _this.subscribeTopic('/topic/ipStreamStatus/notifySLSUpdate');
				// _this.subscribeTopic('/topic/ipStreamStatus/notifySegmentDownloadUpdate');
				// _this.subscribeTopic('/topic/ipStreamStatus/notifyRouteTransmitUpdate');
				// _this.subscribeTopic('/topic/ipStreamStatus/notifyMpdStatusUpdate');
				// _this.subscribeTopic('/topic/ipStreamStatus/notifyIPStreamsUpdate');
				_this.subscribeTopic('/topic/notifyLoginSessionsUpdate');
				_this.subscribeTopic('/topic/admin/notifyUsersUpdate');
			}
			// this.errorCallBack();
		);
	}

	disconnect() {
		console.log('disconnect is cliect');
		const _this = this;
		// console.log;
		this.loggedIn = false;
		// this.subscribeTopic('/topic/notifyLoginSessionsUpdate');
		console.log('========= DISABLING CONNECTION ==============', _this.stompClient);
		// this.webSocketAPI._disconnect();
		if (_this.stompClient !== null) {
			_this.stompClient.disconnect();
			// console.log('i wil be disconnected');
			// this.unsubscribeTopic('/topic/notifyLoginSessionsUpdate');
			// _this.subscribeTopic('/topic/notifyLoginSessionsUpdate');
		}
		console.log('Disconnected', _this.stompClient);
		this.updateUserList();
	}

	sendMessage() {
		console.log('========= sendMessage ==============');
		this.webSocketAPI._send(this.name);
	}

	handleMessage(message) {
		console.log('========= handleMessage ==============');
		this.greeting = message;
	}

	changes() {
		console.log('changes');
	}

	uptestfunction(e) {
		console.log('uptestfunction', e);
	}

	//////////TEST///////
	// unsubscribeTopic(topic) {
	// 	console.log('UNsubscribeTopic', topic);
	// 	this.stompClient.unsubscribe(topic, (message) => {
	// 		this.fireStompMessage(topic, message);
	// 	});
	// }

	subscribeTopic(topic) {
		console.log('subscribeTopic RAR', topic);
		const _this = this;
		// console.log('_this', _this);
		// console.log('topic', topic);
		// console.log('message', message);
		this.stompClient.subscribe(topic, (message) => {
			console.log('topic', topic);
			console.log('message', message);
			_this.fireStompMessage(topic, message);
		});
		// _this.fireStompMessage(topic, message);
	}

	fireStompMessage(stompTopic, message) {
		console.log('fireStompMessage stompTopic', stompTopic);
		console.log('fireStompMessage message', message);
		// if (!IPSEApp.app.isLoggedIn()) {
		//     return;
		// }
		switch (stompTopic) {
			// case '/topic/notifyRouteLogUpdate':
			// 	console.log('AAAAAA ');
			// 	break;
			// case '/topic/ipStreamStatus/thumbnailUpdate':
			// 	console.log('BBBBBB ');
			// 	break;
			// case '/topic/ipStreamStatus/notifySLSUpdate':
			// 	console.log('CCCCCC ');
			// 	break;
			// case '/topic/ipStreamStatus/notifySegmentDownloadUpdate':
			// 	console.log('DDDDDD ');
			// 	break;
			// case '/topic/ipStreamStatus/notifyRouteTransmitUpdate':
			// 	console.log('EEEEEE ');
			// 	break;
			// case '/topic/ipStreamStatus/notifyMpdStatusUpdate':
			// 	console.log('FFFFFF ');
			// 	break;
			// case '/topic/ipStreamStatus/notifyIPStreamsUpdate':
			// 	console.log('GGGGGG ');
			// 	break;
			case '/topic/notifyLoginSessionsUpdate':
				console.log('BOOMBASTICS');
				// this.fireLogUpdate(message);
				this.fireLoginSessionsUpdate(message);
				break;

			case '/topic/admin/notifyUsersUpdate':
				console.log('BOOMBASTICS notifyUsersUpdate');
				this.firenotifyUsersUpdate(message);
				break;
		}
	}

	firenotifyUsersUpdate(message) {
		const initdata = {};
		console.log('firenotifyUsersUpdate', message);
		let arrayData = [];
		// this.dashboardComponent.changes();
		const update = JSON.parse(message.body);
		for (const listener of this.listeners) {
			listener.notifyUsersUpdate(update.loginSessions);
			console.log('listener', listener);
		}
		console.log('update BOOM', update);
		// this.apiService.getUsers().pipe(first()).subscribe((data) => {
		// 	console.log('firenotifyUsersUpdate getUsers data', data);
		// 	arrayData = data;
		// 	// this.userC.getUsers(arrayData);
		// 	this.userC.loadUsers();
		// });
		this.dTables.destroyTable();
		// this.dTables.destroyTable();
		this.dTables.loadGetUsers('init', initdata);
		// this.angDT.rerender();
		// this.angDT.destroyTable();
		// this.angDT.loadAngularUser();
		// this.userC.loadUsers(this.datatableElement);

		// this.activate.emit(this.tableData);
		// HOW TO UPDATE TABLE DATA ON CHILD COMPONENT
		// this.onActivate(event);
		// for (const listener of DataSource.listeners) {
		//     listener.logUpdate(update);
		// }
	}

	fireLoginSessionsUpdate(message) {
		console.log('fireLoginSessionsUpdate', message);
		const update = JSON.parse(message.body);
		// if (update.loginSessions.length == 0) {
		// 	this.apiService.logout();
		// 	this.router.navigate([ '/login' ]);
		// }
		for (const listener of this.listeners) {
			listener.loginSessionsUpdate(update.loginSessions);
			console.log('listener', listener);
		}
		console.log('update BOOM', update);

		// console.log('fireLoginSessionsUpdate', message);
		this.callapi_getAllSessions();
		// this.dashboardComponent.changes();
	}

	childFunctionActivate(data) {
		console.log('childFunctionActivate', data);
	}
	//  can access all child routes
	onActivate(event) {
		console.log('onActivate test', event);
		if (event.title == 'UsersComponent') {
			console.log('parent UsersComponent');
			event.anyFunction();
			event.onClick_Commit();
			this.userC.getUsers(event.tableData);
		}
		// console.log(componentReference)
		// event.anyFunction();
	}
}
