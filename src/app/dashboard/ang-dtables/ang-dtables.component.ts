import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ApiService } from '../../_api';
import { DtapiService } from '../../_api/dtapi.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbModalOptions, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
// import { url } from 'inspector';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Subject, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { ActivatedRoute } from '@angular/router';

// import 'rxjs/add/operator/map';
class TableData {
	id: number;
	name: string;
	password: string;
	privilegeLevel: string;
}

class DataTablesResponse {
	data: any[];
	draw: number;
	recordsFiltered: number;
	recordsTotal: number;
}

@Component({
	selector: 'app-ang-dtables',
	templateUrl: './ang-dtables.component.html',
	styleUrls: [ './ang-dtables.component.css' ]
})
export class AngDtablesComponent implements OnDestroy, OnInit {
	private subsriptions: Subscription[] = [];
	@ViewChild(DataTableDirective, { static: false })
	dtElement: DataTableDirective;

	dtOptions: DataTables.Settings = {};
	// dtOptions: Promise<DataTables.Settings>;
	dtTrigger: Subject<any> = new Subject();

	myForm: FormBuilder;
	title = 'Datatables Component';
	modalData: any = {};

	tableData: any = [];
	activateForm: FormGroup;

	// FORMS
	alert = '';
	alertMessage = '';
	showMessage = false;
	loading = false;
	submitted = false;

	type: any = '';
	addData: any = [];
	editData: any = [];
	deleteData: any = [];

	showEdit = false;
	showAdd = false;
	showDelete = false;

	editcount = 0;

	// http: any;
	constructor(
		private api: ApiService,
		private dtapi: DtapiService,
		private http: HttpClient,
		private modalService: NgbModal,
		private formBuilder: FormBuilder,
		private activeRoute: ActivatedRoute
	) {}

	// constructor(private activeRoute: ActivatedRoute) {
	// }
	ngOnInit(): void {
		const queryParams = this.activeRoute.snapshot.queryParams;
		const routeParams = this.activeRoute.snapshot.params;

		console.log('ngOnInit');
		console.log('ngOnInit queryParams', queryParams);
		console.log('ngOnInit routeParams', routeParams);
		this.loadAngularUser();
	}

	destroyTable() {
		console.log('Destroying Table');
		// $(() => {
		// 	$('table').DataTable().destroy();
		// });
		this.dtTrigger.next();
		this.rerender();
	}

	loadAngularUser() {
		this.formInit();
		this.dtOptions = {
			pagingType: 'full_numbers',
			pageLength: 2
		};
		// setTimeout(() => {
		console.log('ANGULAR DATATABLE +++++ LOAD GET USERS DATAABLES');
		this.subsriptions.push(
			this.api.getUsers().subscribe(
				(data) => {
					console.log('getusers data success', data);
					this.tableData = data;
					setTimeout(() => {
						this.dtTrigger.next();
					}, 500);
				},
				(error) => {
					console.log('getusers data error', error);
				}
			)
		);
		// this.dtOptions = this.api
		// 	.getUsers()
		// 	.toPromise()
		// 	.then((response) => console.log(response))
		// 	.catch(this.handleError);
		// console.log('this.dtOptions', this.dtOptions);
		// }, 500);
	}

	private handleError(error: any): Promise<any> {
		console.error('An error occurred', error); // for demo purposes only
		return Promise.reject(error.message || error);
	}

	// ngAfterViewInit(): void {
	// 	this.dtTrigger.next();
	// }

	formInit() {
		this.activateForm = this.formBuilder.group({
			name: [ '', Validators.required ],
			password: [ '', Validators.required ],
			priviledge: [ '', Validators.required ]
			// restartOnSuccess: [ '', Validators.required ]
		});
	}

	get f() {
		return this.activateForm.controls;
	}
	// ADD
	openModal(content, type) {
		console.log('type', type);
		this.modalService.open(content, { windowClass: 'modal-holder', centered: true });
		if (type == 'add') {
			// this.formInit();
			this.btnAddFunction();
		}
	}

	// ADD
	buttonType(type) {
		console.log('buttonType', type);
		this.type = type;
		this.onSubmit();
	}

	btnAddFunction() {
		this.activateForm.get('name').enable();
		this.activateForm.get('password').enable();
		this.activateForm.get('priviledge').enable();
		this.title = 'Add User';
		this.formInit();

		this.showAdd = true;
		this.showEdit = false;
		this.showDelete = false;
	}

	onSubmit() {
		console.log('BOOM', this.f);
		this.showMessage = false;
		this.submitted = true;
		if (this.activateForm.invalid) {
			return;
		}
		this.loading = true;
		const data = {
			name: this.f.name.value,
			password: this.f.password.value,
			privilegeLevel: this.f.priviledge.value
		};
		// let commitData = {};
		console.log('onSubmit data', data);
		if (this.type == 'add') {
			this.addTableData(data);
		}

		console.log('this.addData', this.addData);
		console.log('this.editData', this.editData);
		console.log('this.deleteData', this.deleteData);
		console.log('this.tableData', this.tableData);
		setTimeout(() => {
			this.loading = false;
			// $('#myModal').modal('hide');
			this.modalService.dismissAll();
		}, 2000);
	}

	addTableData(data) {
		console.log('ADD this.type', this.type);
		console.log('ADD data', data);
		data.id = 0;
		this.addData.push(data);
		console.log('this.addData', this.addData);
		// delete this.addData.id;

		// data.id = 0;
		this.tableData.push(data);
		this.rerender();
	}

	onClick_Commit() {
		let commitData = {
			addedUsers: this.addData,
			updatedUsers: this.editData,
			deletedUserIds: this.deleteData
		};
		console.log('onClick_Commit', commitData);

		this.api.postUsersAtomicUpdate(commitData).pipe(first()).subscribe(
			(data) => {
				console.log('postUsersAtomicUpdate', data);
				(this.addData = []), (this.editData = []), (this.deleteData = []);
				this.modalService.dismissAll();
				//restart edit count array
				this.editcount = 0;
			},
			(error) => {
				console.log('postUsersAtomicUpdate', error);
			}
		);
	}

	rerender(): void {
		// console.log('i am clicked', this.dtElement);
		// console.log('i am clicked', this.dtElement.dtInstance);
		// this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
		// 	// Destroy the table first
		// 	console.log('dtInstance', dtInstance);
		// 	dtInstance.destroy();
		// 	// Call the dtTrigger to rerender again
		// 	this.dtTrigger.next();
		// });
	}

	// private extractData(res: Response) {
	// 	const body = res.json();
	// 	return body.data || {};
	// }

	// ngOnDestroy(): void {}
	ngOnDestroy(): void {
		// Do not forget to unsubscribe the event
		this.dtTrigger.unsubscribe();
		console.log('ngOnDestroy', this.subsriptions);
		this.subsriptions.forEach((sub) => sub.unsubscribe());
	}
}
