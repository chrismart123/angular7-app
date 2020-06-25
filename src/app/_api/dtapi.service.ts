import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { User } from '../_models';
// import { DtapiService } from '../_api/';
// import { DatatablesComponent } from '../dashboard/datatables/datatables.component';

// import (DatatablesComponent)

class DataTablesResponse {
	data: any[];
	draw: number;
	recordsFiltered: number;
	recordsTotal: number;
}
class TableData {
	id: number;
	name: string;
	password: string;
	privilegeLevel: string;
}
@Injectable({ providedIn: 'root' })
export class DtapiService {
	private readonly API_URL = 'http://localhost:8080/gbWebApp';
	// private readonly API_URL = 'http://10.77.60.152/gbWebApp';
	// private readonly DEVSERVERAPI_URL = 'http://10.77.60.152/api/json/admin';

	private readonly DEVAPI_URL = 'http://localhost:8080/gbWebApp';
	private readonly DEVSERVERAPI_URL = 'http://localhost:8080/api/json/admin';

	private readonly SWAGGER_URL = 'https://virtserver.swaggerhub.com/Triveni-Digital/GBWebApp/1.0.0';

	// baseURL: "https://virtserver.swaggerhub.com/Triveni-Digital/GBWebApp/1.0.0",
	//localURL: "http://localhost:8080/gbWebApp", //local
	// localURL: "http://10.77.60.152", //dev
	//localserverAPIURL: "http://localhost:8080/api/json/admin", //local
	// localserverAPIURL: "http://10.77.60.152/api/json/admin", //dev
	public currentUserSubject: BehaviorSubject<User>;
	public currentUser: Observable<User>;

	dtOptions: any;
	tableData: any = [];
	constructor(private http: HttpClient) {
		this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
		this.currentUser = this.currentUserSubject.asObservable();
	}

	getUsers(): Observable<DataTablesResponse[]> {
		let url = `${this.DEVSERVERAPI_URL}/users`;
		return this.http.get<DataTablesResponse[]>(url);
	}

	dtLoadUser(type: any, data: any) {
		console.log('LOAD GET USERS DATAABLES ===== dtLoadUser');
		console.log('type', type);
		console.log('data', data);
		const newData = {
			data: []
		};

		let ajaxType = {};
		// setTimeout(() => {
		// 	if (type === 'init') {
		// 		ajaxType = {
		// 			url: 'http://localhost:8080/api/json/admin/users',
		// 			type: 'GET',
		// 			dataSrc: ''
		// 		};
		// 	} else if (type === 'update') {
		// 		ajaxType = data;
		// 	}
		// 	console.log('ajaxType', ajaxType);
		// 	$(() => {
		// 		this.dtOptions = {
		// 			ajax: ajaxType,
		// 			pagingType: 'full_numbers',
		// 			pageLength: 10,
		// 			autoWidth: true,
		// 			deferRender: true,
		// 			columns: [
		// 				{
		// 					title: 'ID',
		// 					data: 'id'
		// 				},
		// 				{
		// 					title: 'Name',
		// 					data: 'name'
		// 				},
		// 				{
		// 					title: 'Password',
		// 					data: 'password'
		// 				},
		// 				{
		// 					title: 'Priviledge Level',
		// 					data: 'privilegeLevel'
		// 				},
		// 				{
		// 					title: 'Actions',
		// 					data: null,
		// 					class: 'text-center',
		// 					defaultContent:
		// 						' <span class="label label-success btn waves-effect waves-light btn-rounded btnEdit" data-target="#myModal"  data-toggle="modal">' +
		// 						'Edit Users' +
		// 						'</span> ' +
		// 						'<span class="label label-danger btn waves-effect waves-light btn-rounded btnDel" data-target="#myModal"  data-toggle="modal">' +
		// 						'Delete' +
		// 						'</span>'
		// 				}
		// 			],
		// 			columnDefs: [
		// 				{ width: '20%', targets: 0 },
		// 				{ width: '20%', targets: 1 },
		// 				{ width: '20%', targets: 2, class: 'test-hide', visible: true },
		// 				{ width: '20%', targets: 3 },
		// 				{ width: '20%', targets: 4, class: 'text-center' }
		// 			],
		// 			drawCallback: (settings, json) => {
		// 				const self = this;
		// 				// console.log('drawCallback settings', settings);
		// 				// console.log('drawCallback json', json);
		// 				// var table = $('#dataTableTest').DataTable();
		// 				console.log(' Draw Callback ...');

		// 				// ++++++++++++++ BUTTON INITIALIZE EDIT ++++++++++++++
		// 				$('.btnEdit').on('click', ($event) => {
		// 					console.log('settings', settings);
		// 					console.log('json', json);
		// 					console.log('btn edit is clicked', $event);
		// 					// const el: any = this.elementRef.nativeElement;
		// 					const DATA = $($event.currentTarget).parent().parent();
		// 					console.log('DATA', DATA[0]);
		// 					console.log('index', DATA.index());
		// 					// if (DATA[0].cells != undefined) {
		// 					const dataValues = {
		// 						// id: parseInt(DATA[0].cells[0].innerText),
		// 						// name: DATA[0].cells[1].innerText,
		// 						// password: DATA[0].cells[2].innerText,
		// 						// privilegeLevel: DATA[0].cells[3].innerText
		// 					};

		// 					var foundIndex = settings.json.findIndex((x) => x.id == dataValues.id);
		// 					console.log('foundIndex', foundIndex);
		// 					settings.json[foundIndex] = dataValues;

		// 					this.tableData = settings.json;
		// 					// this.dtapi.btnEditFunction(dataValues);
		// 					// }
		// 				});

		// 				// ++++++++++++++ BUTTON INITIALIZE DELETE ++++++++++++++
		// 				$('.btnDel').on('click', ($event) => {
		// 					console.log('drawCallback settings', settings);
		// 					const DATA = $($event.currentTarget).parent().parent();
		// 					console.log('index', DATA.index());
		// 					let dataValues = {
		// 						// id: parseInt(DATA[0].cells[0].innerText),
		// 						// name: DATA[0].cells[1].innerText,
		// 						// password: DATA[0].cells[2].innerText,
		// 						// privilegeLevel: DATA[0].cells[3].innerText
		// 					};
		// 					this.tableData = settings.json;
		// 					// this.dtapi.btnDeleteFunction(dataValues);
		// 				});
		// 			}
		// 		};

		// 		$('table.display2').DataTable(this.dtOptions);
		// 	});
		// }, 500);
	}
}
