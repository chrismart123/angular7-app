import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  ViewChild,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { ApiService } from '../../_api';
import { first } from 'rxjs/operators';
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
// import
declare var $;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements AfterViewInit, OnDestroy, OnInit {
  // @ViewChild(DataTableDirective, { static: false }) datatableElement: DataTableDirective;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  // @ViewChild(DataTableDirective) datatableElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtInstance: DataTables.Api;
  dtTrigger: Subject<any> = new Subject();
  isLoading = true;
  isDtInitialized: boolean = false;

  @Output() activate = new EventEmitter<string>();
  @Output() item = new EventEmitter<string>();

  boomtest: any;
  title = 'UsersComponent';
  modalData: any = {};
  closeResult: string;
  modalOptions: NgbModalOptions;

  // dtOption: any = {};

  tableData: any = [];
  activateForm: FormGroup;
  postData: any;

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
  isDisabled = true;
  // router: any;

  constructor(
    private location: Location,
    private router: Router,
    private apiservice: ApiService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private chRef: ChangeDetectorRef
  ) {
    console.log('console ran');
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      size: 'lg',
      keyboard: false,
      centered: true,
    };
  }

  ngOnInit(): void {
    // this.router.routeReuseStrategy = () => {
    // 	return false;
    // };
    console.log('======= NG ON INTIT ON USERS COMPONENT users=======');
    this.activateForm = this.formBuilder.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
      priviledge: ['', Validators.required],
      // restartOnSuccess: [ '', Validators.required ]
    });
    this.loadUsers();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
    };
  }
  getUsers(data) {
    console.log('USERS COMPONENT getUsers PARENT ===', data);
    // console.log('======= ===this.dtElement.dtInstance', this.dtElement.dtInstance);
    this.tableData = data;
  }

  loadUsers() {
    console.log('========= FUNCTION LOAD USER =======');
    console.log('i am updates loadUsers', this.tableData);

    setTimeout(() => {
      $(() => {
        $('table.display').DataTable();
      });
      this.apiservice
        .getUsers()
        .pipe(first())
        .subscribe(
          (data) => {
            console.log('getUsers data', data);
            this.tableData = data;
            this.dtOptions = {
              ajax: this.tableData,
              columns: [
                {
                  title: 'ID',
                  data: 'id',
                },
                {
                  title: 'Users',
                  data: 'name',
                },
                {
                  title: 'Priviledge',
                  data: 'privilegeLevel',
                },
              ],
            };

            this.rerender();
          },
          (error) => {
            console.log('getUsers error', error);
          }
        );
    }, 500);
  }

  openModal(content) {
    this.modalService.open(content);
  }

  openModal_adduser(content) {
    this.activateForm.get('name').enable();
    this.activateForm.get('password').enable();
    this.activateForm.get('priviledge').enable();
    this.title = 'Add User';
    this.modalData = {};
    this.modalService.open(content);

    this.showAdd = true;
    this.showEdit = false;
    this.showDelete = false;
  }

  openModal_edituser(content: any, rowData: any) {
    this.activateForm.get('name').disable();
    this.activateForm.get('password').disable();
    this.activateForm.get('priviledge').enable();
    console.log('openModal_edituser rowData', rowData);
    // console.log('openModal_edituser evt', );
    this.title = 'Edit User';
    this.modalData = rowData;
    this.modalService.open(content);

    this.showAdd = false;
    this.showEdit = true;
    this.showDelete = false;
  }
  openModal_deluser(content: any, rowData: any) {
    // this.f.name.disabled;
    // this.f.controls['name'].disable();
    this.activateForm.get('name').disable();
    this.activateForm.get('password').disable();
    this.activateForm.get('priviledge').disable();
    console.log('openModal_edituser rowData', rowData);
    // console.log('openModal_edituser evt', );
    this.title = 'Delete User';
    this.modalData = rowData;
    this.modalService.open(content);

    this.showAdd = false;
    this.showEdit = false;
    this.showDelete = true;
  }

  doubleClick(evt: any, content: any, rowData: any) {
    this.title = rowData.id + ' - ' + rowData.name;
    // this.title = 'BOOM';
    console.log('doubleClick', evt);
    console.log('content', content);
    console.log('rowData', rowData);
    this.modalService.open(content);
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
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
      privilegeLevel: this.f.priviledge.value,
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
    }, 1000);
    // console.log('ADD data', data);
    // console.log(this.tableData);
  }

  addTableData(data) {
    console.log('ADD this.type', this.type);
    console.log('ADD data', data);
    this.addData.push(data);
    this.modalService.dismissAll();
    console.log('this.addData', this.addData);
    this.tableData.push(data);
  }

  editTableData(data) {
    var foundIndex = this.tableData.findIndex((x) => x.id == this.modalData.id);
    this.tableData[foundIndex] = this.modalData;
    console.log('EDIT ==== foundIndex', foundIndex);

    var foundEditIndex = this.editData.findIndex(
      (x) => x.id == this.modalData.id
    );
    console.log('foundEditIndex', foundEditIndex);
    if (foundEditIndex == -1) {
      //not found in edit Data, it adds new data
      this.editData.push(data);
      this.editData[this.editcount].id = this.modalData.id;
      this.editcount++;
    } else {
      this.editData[foundEditIndex] = this.modalData;
    }

    this.modalService.dismissAll();
  }

  deleteTableData(data) {
    const deleteData = this.tableData.filter(
      (item) => item.id !== this.modalData.id
    );
    console.log('DELETE ==== deleteData', deleteData);
    this.tableData = deleteData;
    this.deleteData.push(this.modalData.id);
    // this.rerender();
    this.rerender_datatable();
    this.modalService.dismissAll();
    // this.router.navigate([ '/dashboard/users' ]);
    this.router.navigateByUrl('/dashboard/users');
  }

  rerender_datatable() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  anyFunction() {
    console.log('called from parent');
  }

  onClick_Commit() {
    // this.activate.emit(this.tableData);
    // this.item.emit(this.tableData);
    let commitData = {
      addedUsers: this.addData,
      updatedUsers: this.editData,
      deletedUserIds: this.deleteData,
    };
    console.log('commitData', commitData);
    console.log('onClick_Commit data', this.tableData);
    this.apiservice
      .postUsersAtomicUpdate(commitData)
      .pipe(first())
      .subscribe(
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

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  ngOnChanges() {
    console.log(' ====== USER CHANGES ngOnChanges ========');
  }

  ngAfterViewInit() {
    console.log(' ====== USER CHANGES ngAfterViewInit ========');
    this.dtTrigger.next();
  }

  rerender(): void {
    // console.log('rerender tableData', this.tableData);
    // console.log('rerender dtElement', this.dtElement);
    const arrayData = this.tableData;
    // const table: any = $('table.display').DataTable();
    if (this.dtElement != undefined) {
      if (this.dtElement.dtInstance != undefined) {
        console.log('rerender IF2', this.dtElement.dtInstance);
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next();
        });
      } else {
        console.log('rerender ELSE2');
        this.dtTrigger.next();
      }
    } else {
      // this.dtElement: DataTableDirective
      console.log('rerender ELSE1');
      this.dtTrigger.next();
      console.log('rerender', this.tableData);

      $(() => {
        $('table.display').DataTable().destroy();
      });

      this.tableData = arrayData;

      setTimeout(() => {
        $('table.display')
          .DataTable({
            pageLength: 5,
            columns: [
              { data: 'id' },
              { data: 'name' },
              { data: 'privilegeLevel' },
              {
                data: null,
                defaultContent:
                  ' <span class="btn waves-effect waves-light btn-rounded btn-primary btnEdit"' +
                  '(click)="openModal_edituser(mymodal_users)">' +
                  'Edit Users' +
                  '</span> ' +
                  '<span class="btn waves-effect waves-light btn-rounded btn-primary">' +
                  'Delete' +
                  '</span>',
              },
            ],
          })
          .clear()
          .rows.add(this.tableData)
          .draw();
        console.log('rerender 2', this.tableData);
        // setTimeout(() => {
        // 	this.dtTrigger.next();
        // }, 500);
      }, 500);
    }
  }

  displayToConsole(dtElement: DataTableDirective): void {
    console.log('displayToConsole this.tableData', this.tableData);
    dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      console.log('displayToConsole', dtInstance);
      dtInstance.destroy();
      this.dtTrigger.next();
      // dtInstance.data(this.tableData);
      // dtInstance.draw();
    });
  }
}
