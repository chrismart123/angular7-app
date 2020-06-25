import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { AppComponent } from './app/app.component';
import { DashboardComponent } from '../src/app/dashboard/dashboard.component';
import { Injectable } from '@angular/core';
import { ApiService } from '../src/app/_api';
import { HttpClient } from '@angular/common/http';
// import { Console } from 'console';

@Injectable()
export class WebSocketAPI {
	//   webSocketEndPoint: string = 'http://localhost:8080';
	webSocketEndPoint: string = 'http://localhost:8080/gbWebApp/stomp';
	topic: string = 'http://localhost:8080/api/json/admin/topic/greetings';
	stompClient: any;
	// appComponent = new AppComponent();
	// appComponent = AppComponent;
	// dashboardComponent = new DashboardComponent();
	// dashtest: DashboardComponent;

	logout = false;
	listeners = [];
	StompTopic = {};
	greeting: any;
	name: string;

	constructor() {
		console.log(' constructor ===== this.dashtest');
	}
	// // constructor(dashboardComponent: DashboardComponent) {
	// 	this.dashboardComponent = dashboardComponent;
	// 	// this.StompTopic['LogUpdate'] = '/topic/notifyRouteLogUpdate';
	// }
	// constructor() {
	// 	this.dashboardComponent = new DashboardComponent();
	// }
	_connect() {
		// this.appComponent.test();
		// this.dashboardComponent.changes();
		// this.dashboardComponent.changes();
		// console.log('appComponent');
		// console.log('this.dashtest', this.dashtest);
		// console.log('dashboardComponent', DashboardComponent);
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
				// _this.stompClient.subscribe(
				// 	'',
				// 	(data) => {
				// 		console.log('success data', data);
				// 	},
				// 	(error) => {
				// 		console.log('error data', error);
				// 	}
				// );
				_this.stompClient.reconnect_delay = 2000;
				// _this.stompClient.subscribe(_this.topic, function(sdkEvent) {
				// 	// _this.onMessageReceived(sdkEvent);
				// 	console.log(' RAR sdkEvent', sdkEvent);
				// });
				// _this.stompClient.reconnect_delay = 2000;
				// _this.appComponent.subscribeTopic('BOOM');
				_this.subscribeTopic('/topic/notifyRouteLogUpdate');
				_this.subscribeTopic('/topic/ipStreamStatus/thumbnailUpdate');
				_this.subscribeTopic('/topic/ipStreamStatus/notifySLSUpdate');
				_this.subscribeTopic('/topic/ipStreamStatus/notifySegmentDownloadUpdate');
				_this.subscribeTopic('/topic/ipStreamStatus/notifyRouteTransmitUpdate');
				_this.subscribeTopic('/topic/ipStreamStatus/notifyMpdStatusUpdate');
				_this.subscribeTopic('/topic/ipStreamStatus/notifyIPStreamsUpdate');
				_this.subscribeTopic('/topic/notifyLoginSessionsUpdate');
			}
			// this.errorCallBack();
		);
	}
	// connecting() {
	// 	let ws = new SockJS(this.webSocketEndPoint);
	// 	const _this = this;
	// 	console.log('_this.stompClient2 ', _this.stompClient);
	// 	if (_this.stompClient === undefined) {
	// 		console.log(`DataSource: No websocket connection can be made`);
	// 		return;
	// 	}
	// 	console.log('websocket connected');
	// 	_this.stompClient.subscribe(_this.topic, function(sdkEvent) {
	// 		_this.onMessageReceived(sdkEvent);
	// 		console.log(' RAR sdkEvent', sdkEvent);
	// 	});
	// 	_this.stompClient.reconnect_delay = 2000;
	// 	console.log('_this.stompClient', _this.stompClient.debug);
	// 	// _this.stompClient.debug = undefined;
	// }

	_disconnect() {
		if (this.stompClient !== null) {
			this.stompClient.disconnect();
		}
		console.log('Disconnected');
	}

	// on error, schedule a reconnection attempt
	errorCallBack(error) {
		console.log('errorCallBack -> ' + error);
		setTimeout(() => {
			this._connect();
		}, 5000);
	}

	/**
   * Send message to sever via web socket
   * @param {*} message
   */
	_send(message) {
		// let ping = 'http://localhost:8080/gbWebApp/ping';
		let ping = 'http://localhost:8080/api/json/admin/topic/greetings';
		console.log('calling logout api via web socket');
		this.stompClient.send(ping, {}, JSON.stringify(message));
	}

	onMessageReceived(message) {
		console.log('Message Recieved from Server :: ' + message);
		// this.appComponent.handleMessage(JSON.stringify(message.body));
	}

	//////////TEST///////

	subscribeTopic(topic) {
		console.log('subscribeTopic', topic);
		this.stompClient.subscribe(topic, (message) => {
			this.fireStompMessage(topic, message);
		});
	}

	fireStompMessage(stompTopic, message) {
		console.log('fireStompMessage stompTopic', stompTopic);
		console.log('fireStompMessage message', message);
		// if (!IPSEApp.app.isLoggedIn()) {
		//     return;
		// }
		switch (stompTopic) {
			case '/topic/notifyRouteLogUpdate':
				break;
			case '/topic/ipStreamStatus/thumbnailUpdate':
				break;
			case '/topic/ipStreamStatus/notifySLSUpdate':
				break;
			case '/topic/ipStreamStatus/notifySegmentDownloadUpdate':
				break;
			case '/topic/ipStreamStatus/notifyRouteTransmitUpdate':
				break;
			case '/topic/ipStreamStatus/notifyMpdStatusUpdate':
				break;
			case '/topic/ipStreamStatus/notifyIPStreamsUpdate':
				break;
			case '/topic/notifyLoginSessionsUpdate':
				console.log('BOOMBASTICS');

				// this.fireLogUpdate(message);
				this.fireLoginSessionsUpdate(message);
				break;
		}
	}

	fireLogUpdate(message) {
		console.log('fireLogUpdate', message);
		// this.dashboardComponent.changes();
		// const update = LogUpdate.fromJSON(JSON.parse(message.body));
		// for (const listener of DataSource.listeners) {
		//     listener.logUpdate(update);
		// }
	}
	fireLoginSessionsUpdate(message) {
		console.log('fireLoginSessionsUpdate', message);
		const update = JSON.parse(message.body);
		for (const listener of this.listeners) {
			listener.loginSessionsUpdate(update.loginSessions);
		}
		console.log('fireLoginSessionsUpdate', message);
		// this.dashboardComponent.changes();
	}
}
