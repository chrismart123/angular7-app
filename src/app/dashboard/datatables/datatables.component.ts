import {
	Component,
	OnInit,
	ViewChild,
	AfterViewInit,
	EventEmitter,
	Output,
	ChangeDetectorRef,
	ElementRef,
	TemplateRef,
	OnDestroy
} from '@angular/core';
import { ApiService } from '../../_api';
import { TestService } from '../../_api/test.service';
import { DtapiService } from '../../_api/dtapi.service';
// import { DatatableApiService } from '../../_api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbModalOptions, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
// import Responsive from '';

declare var $;
@Component({
	selector: 'app-datatables',
	templateUrl: './datatables.component.html',
	styleUrls: [ './datatables.component.css' ]
})
export class DatatablesComponent implements OnInit, OnDestroy {
	private subsriptions: Subscription[] = [];
	@ViewChild('dataTable') table;
	@ViewChild('dataTableTest') tabletest;

	@ViewChild('mymodal_test') modalTest: TemplateRef<any>;

	@Output() activate = new EventEmitter<string>();
	@Output() item = new EventEmitter<string>();

	@ViewChild('activateForm', { static: false })
	myForm: FormBuilder;

	title = 'Datatables Component';
	modalData: any = {};
	closeResult: string;
	modalOptions: NgbModalOptions;

	dataTable: any;
	dtOption: any = {};
	dtOptions: any;

	initTableData: any = [];
	tableData: any = [];
	activateForm: FormGroup;
	postData: any;

	// FORMS
	alert = '';
	alertMessage = '';
	showMessage = false;
	loading = false;
	submitted = false;

	commitRevert = '';
	iscommitRevert = false;
	privLevel: any = [];

	type: any = '';
	addData: any = [];
	editData: any = [];
	deleteData: any = [];

	showEdit = false;
	showAdd = false;
	showDelete = false;

	editcount = 0;
	isDisabled = true;

	testDATA: any = {};
	constructor(
		config: NgbModalConfig,
		private location: Location,
		private router: Router,
		private apiservice: ApiService,
		private modalService: NgbModal,
		private formBuilder: FormBuilder,
		private chRef: ChangeDetectorRef,
		private elementRef: ElementRef,
		private dtapi: DtapiService
	) {
		this.modalOptions = {
			backdrop: 'static',
			backdropClass: 'customBackdrop',
			size: 'lg',
			keyboard: false,
			centered: true
		};

		this.privLevel = [ 'Admin', 'API' ];
	}

	ngOnInit(): void {
		console.log('ngOnInit', this.testDATA);

		const initdata = {};
		this.loadGetUsers('init', initdata);
	}

	formInit() {
		this.activateForm = this.formBuilder.group({
			name: [ '', Validators.required ],
			password: [ '', Validators.required ],
			priviledge: [ '', Validators.required ]
			// restartOnSuccess: [ '', Validators.required ]
		});
	}

	destroyTable() {
		console.log('Destroying Table');
		$(() => {
			$('table.display2').DataTable().destroy();
		});
	}

	loadGetUsers(type: any, data: any) {
		this.formInit();

		const newData = {
			data: []
		};
		// this.apiservice.getUsers().subscribe(
		// 	(data) => {
		// 		console.log('success:', data);
		// 		newData.data = data;
		// 		console.log('newDATA', newData);
		// 	},
		// 	(error) => {
		// 		console.log('error', error);
		// 	}
		// );

		let ajaxType = {};
		setTimeout(() => {
			// this.dtapi.dtLoadUser(type, data);

			if (type === 'init') {
				ajaxType = {
					url: 'http://localhost:8080/api/json/admin/users',
					type: 'GET',
					dataSrc: ''
				};
			} else if (type === 'update') {
				ajaxType = data;
			}
			console.log('ajaxType', ajaxType);
			$(() => {
				this.dtOptions = {
					ajax: ajaxType,
					pagingType: 'full_numbers',
					pageLength: 10,
					autoWidth: true,
					deferRender: true,
					columns: [
						{
							title: 'ID',
							data: 'id'
						},
						{
							title: 'Name',
							data: 'name'
						},
						{
							title: 'Password',
							data: 'password'
						},
						{
							title: 'Priviledge Level',
							data: 'privilegeLevel'
						},
						{
							title: 'Actions',
							data: null,
							class: 'text-center',
							defaultContent:
								' <span class="label label-success btn waves-effect waves-light btn-rounded btnEdit" data-target="#myModal"  data-toggle="modal">' +
								'Edit Users' +
								'</span> ' +
								'<span class="label label-danger btn waves-effect waves-light btn-rounded btnDel" data-target="#myModal"  data-toggle="modal">' +
								'Delete' +
								'</span>'
						}
					],
					columnDefs: [
						{ width: '20%', targets: 0 },
						{ width: '20%', targets: 1 },
						{ width: '20%', targets: 2, class: 'test-hide', visible: true },
						{ width: '20%', targets: 3 },
						{ width: '20%', targets: 4, class: 'text-center' }
					],
					drawCallback: (settings, json) => {
						const self = this;
						// console.log('drawCallback settings', settings);
						// console.log('drawCallback json', json);
						// var table = $('#dataTableTest').DataTable();
						console.log(' Draw Callback ...');
						this.initTableData = settings.json;
						// ++++++++++++++ BUTTON INITIALIZE EDIT ++++++++++++++
						$('.btnEdit').on('click', ($event) => {
							console.log('btn edit is clicked');
							// const el: any = this.elementRef.nativeElement;
							const DATA = $($event.currentTarget).parent().parent();
							console.log('index', DATA.index());
							const dataValues = {
								id: parseInt(DATA[0].cells[0].innerText),
								name: DATA[0].cells[1].innerText,
								password: DATA[0].cells[2].innerText,
								privilegeLevel: DATA[0].cells[3].innerText
							};

							var foundIndex = settings.json.findIndex((x) => x.id == dataValues.id);
							console.log('foundIndex', foundIndex);
							settings.json[foundIndex] = dataValues;

							this.tableData = settings.json;
							//   this.initTableData = settings.json;
							this.btnEditFunction(dataValues);
						});

						// ++++++++++++++ BUTTON INITIALIZE DELETE ++++++++++++++
						$('.btnDel').on('click', ($event) => {
							// console.log('drawCallback settings', settings);
							const DATA = $($event.currentTarget).parent().parent();
							// console.log('index', DATA.index());
							let dataValues = {
								id: parseInt(DATA[0].cells[0].innerText),
								name: DATA[0].cells[1].innerText,
								password: DATA[0].cells[2].innerText,
								privilegeLevel: DATA[0].cells[3].innerText
							};
							this.tableData = settings.json;
							this.btnDeleteFunction(dataValues);
						});
					}
				};
				$('table.display2').DataTable(this.dtOptions);
			});
		}, 500);
	}

	btnAddFunction() {
		console.log('openModal_adduser content');
		this.activateForm.get('name').enable();
		this.activateForm.get('password').enable();
		this.activateForm.get('priviledge').enable();
		this.title = 'Add User';
		this.formInit();

		this.showAdd = true;
		this.showEdit = false;
		this.showDelete = false;
	}

	btnEditFunction(rowData: any) {
		console.log('btnEditFunction this table data', this.tableData);
		console.log('btnEditFunction', rowData);
		this.activateForm.get('name').disable();
		this.activateForm.get('password').disable();
		this.activateForm.get('priviledge').enable();
		this.title = 'Edit User';
		this.modalData = rowData;
		this.showAdd = false;
		this.showEdit = true;
		this.showDelete = false;
	}

	btnDeleteFunction(rowData: any) {
		this.activateForm.get('name').disable();
		this.activateForm.get('password').disable();
		this.activateForm.get('priviledge').disable();
		console.log('btnDeleteFunction rowData', rowData);
		// console.log('openModal_edituser evt', );
		this.title = 'Delete User';
		this.modalData = rowData;
		// this.modalService.open(content);
		this.showAdd = false;
		this.showEdit = false;
		this.showDelete = true;
	}

	myTestFunction() {
		console.log('myTestFunction');
		// this.destroyTable();
	}

	openModal(content) {
		this.modalService.open(content);
	}
	openModal_CR(content, cr) {
		console.log('opening mODAL', cr);
		if (cr == 'commit') {
			this.iscommitRevert = true;
			this.commitRevert = 'Commit';
			console.log('i am committing');
		} else if (cr == 'revert') {
			this.iscommitRevert = false;
			this.commitRevert = 'Revert';
			console.log('i am reverting');
		}

		this.modalService.open(content);
	}

	get f() {
		return this.activateForm.controls;
	}
	// ADD
	buttonType(type) {
		console.log('buttonType', type);
		this.type = type;
		this.onSubmit();
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
		let commitData = {};
		if (this.type == 'add') {
			this.addTableData(data);
		} else if (this.type == 'edit') {
			this.editTableData(data);
		} else if (this.type == 'delete') {
			this.deleteTableData(data);
		}

		// console.log('ADD data', data);
		// this.addData.push(data);
		console.log('this.addData', this.addData);
		console.log('this.editData', this.editData);
		console.log('this.deleteData', this.deleteData);

		console.log('this.tableData', this.tableData);
		setTimeout(() => {
			this.loading = false;
			$('#myModal').modal('hide');
			// this.modalService.dismissAll();
		}, 2000);
		// console.log('ADD data', data);
		// console.log(this.tableData);
	}

	addTableData(data) {
		console.log('ADD this.type', this.type);
		console.log('ADD data', data);
		data.id = 0;
		this.addData.push(data);
		// this.modalService.dismissAll();
		console.log('this.addData', this.addData);
		this.tableData.push(data);
		$(() => {
			$('table.display2').DataTable().row.add(data).draw();
		});
	}

	editTableData(data) {
		// THIS NEEDS TO CHNAGE AND CAPTURE INDEX DATA OF TABLE DATA
		var foundIndex = this.tableData.findIndex((x) => x.id == this.modalData.id);
		this.tableData[foundIndex] = this.modalData;
		this.tableData[foundIndex].remove = '-1';
		console.log('EDIT ==== foundIndex', foundIndex);

		var foundEditIndex = this.editData.findIndex((x) => x.id == this.modalData.id);
		console.log('foundEditIndex', foundEditIndex);
		if (foundEditIndex == -1) {
			//not found in edit Data, it adds new data
			this.editData.push(data);
			this.editData[this.editcount].id = this.modalData.id;
			this.editcount++;
		} else {
			this.editData[foundEditIndex] = this.modalData;
		}
		this.tableData.push(data);
		var removeIndex = this.tableData
			.map(function(item) {
				return item.id;
			})
			.indexOf(foundIndex);
		console.log('removeIndex', removeIndex);
		this.tableData.splice(removeIndex, 1);
		console.log(this.tableData);

		$(() => {
			$('table.display2').DataTable().row.add(data).draw();
		});
		setTimeout(() => {
			$(() => {
				$('table.display2').DataTable().row(parseInt(foundIndex)).remove().draw();
			});
		}, 500);
	}

	deleteTableData(data) {
		var foundIndex = this.tableData.findIndex((x) => x.id == this.modalData.id);
		const deleteData = this.tableData.filter((item) => item.id !== this.modalData.id);
		console.log('foundIndex', foundIndex);
		this.tableData = deleteData;
		this.deleteData.push(this.modalData.id);
		console.log('deleteData', deleteData);
		$(() => {
			$('table.display2').DataTable().draw();
		});

		setTimeout(() => {
			$(() => {
				$('table.display2').DataTable().row(parseInt(foundIndex)).remove().draw();
			});
		}, 500);
	}

	onClick_Commit() {
		let commitData = {
			addedUsers: this.addData,
			updatedUsers: this.editData,
			deletedUserIds: this.deleteData
		};
		console.log('commitData', commitData);
		console.log('onClick_Commit data', this.tableData);
		this.subsriptions.push(
			this.apiservice.postUsersAtomicUpdate(commitData).pipe(first()).subscribe(
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
			)
		);
	}

	onClick_Revert() {
		const initdata = {};
		console.log('on Click Revert');
		console.log('init Table', this.initTableData);
		this.modalService.dismissAll();
		this.destroyTable();
		this.loadGetUsers('init', initdata);
	}

	ngAfterViewInit() {
		console.log('ngAfterViewInit');
		$(() => {});
	}

	ngOnDestroy(): void {
		console.log('ngOnDestroy', this.subsriptions);
		this.destroyTable();
		this.subsriptions.forEach((sub) => sub.unsubscribe());
		//   this.postUsersAtomicUpdate().unsubscribed()
		// throw new Error('Method not implemented.');
	}
}
