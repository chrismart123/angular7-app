import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { first, map } from 'rxjs/operators';
import { ApiService } from '../../_api';
import { Subject } from 'rxjs';
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
// import { setTimeout } from 'timers';
// import $ from 'jquery';
import 'datatables.net';
// import 'datatables.net-bs4';
declare var $;
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css'],
})
export class NetworkComponent implements OnInit {
  title = '';
  modalData: any = {};
  closeResult: string;
  modalOptions: NgbModalOptions;
  // that = this;
  // dtOptions: DataTables.Settings = {};
  dtOptions: DataTables.Settings = {};

  dataArray: [];
  dataTable: any;

  datatable: any;
  dtOption: any = {};
  tableData = [];
  dtTrigger: Subject<any> = new Subject();
  loading = false;
  @ViewChild('dataTable', { static: true })
  table;
  constructor(private apiService: ApiService, private modalService: NgbModal) {
    console.log('constructor');
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      size: 'lg',
      keyboard: false,
      centered: true,
    };
  }

  ngOnInit(): void {
    console.log('LOAD NETWORKS');
    this.loadNetworkSettings();
  }
  // end of ng init

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  loadNetworkSettings() {
    this.apiService.getnetworkSettings().subscribe((resp) => {
      this.tableData = resp.ipsettings;
      this.dataTable = $(this.table.nativeElement);
      this.dtOption = {
        paging: true,
        ordering: false,
        info: false,
        pageLength: 5,
      };
      $(() => {
        $('table.display').DataTable(this.dtOption);
      });
    });
  }

  doubleClick(evt, rowData, content) {
    console.log('doubleClick', evt);
    console.log('rowData', rowData);
    this.modalData = rowData;
    this.title = 'Network Settings';
    this.modalService.open(content, this.modalOptions).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
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
}
