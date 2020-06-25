import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../_api';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.css'],
})
@Injectable({
  providedIn: 'root',
})
export class LicenseComponent implements OnInit {
  title = 'ng-bootstrap-modal-demo';

  buttonType = '';
  alert = '';
  alertMessage = '';
  showMessage = false;

  closeResult: string;
  modalOptions: NgbModalOptions;
  serverlicenseData = {
    licenseId: '',
    productId: '',
    installationId: '',
    installationName: '',
  };
  inputDisabled = false;

  activateForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) {
    this.initserverLicencse();
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      size: 'lg',
      keyboard: false,
      centered: true,
    };
    this.serverlicenseData.licenseId = '';
  }

  ngOnInit(): void {
    this.activateForm = this.formBuilder.group({
      licenseId: ['', Validators.required],
      password: ['', Validators.required],
      installationName: ['', Validators.required],
      // restartOnSuccess: [ '', Validators.required ]
    });
    console.log('CALL LICENSE COMPONENT');
    this.loadServerlicenseInfo();
  }

  get f() {
    return this.activateForm.controls;
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
      licenseId: this.f.licenseId.value,
      password: this.f.password.value,
      installationName: this.f.installationName.value,
    };
    if (this.buttonType == 'activate') {
      console.log('submit activated');
      this.apiService.postactivateLicenseOnline(data).subscribe(
        (res) => {
          console.log('postactivateLicenseOnline SUCCESS', res);
          this.alert = 'success';
          this.alertMessage =
            'This is an example top alert. You can edit what u wish.';
          this.showMessage = true;
          setTimeout(() => {
            this.loading = false;
          }, 2000);
        },
        (error) => {
          console.log('postactivateLicenseOnline ERROR', error);
        }
      );
    } else if (this.buttonType == 'refresh') {
      this.apiService.postactivateRefreshOffline(data).subscribe(
        (res) => {
          console.log('postactivateRefreshOffline SUCCESS', res);
          this.alert = 'success';
          this.alertMessage =
            'This is an example top alert. You can edit what u wish.';
          this.showMessage = true;
          setTimeout(() => {
            this.loading = false;
          }, 2000);
        },
        (error) => {
          console.log('postactivateRefreshOffline ERROR', error);
        }
      );
    }
  } // end of ng submit

  loadServerlicenseInfo() {
    this.apiService.getserverLicenseInfo().subscribe((resp) => {
      console.log('getserverLicenseInfo resp', resp.serverLicense);
      this.serverlicenseData = resp.serverLicense;
    });
  }

  initserverLicencse() {
    // this.serverlicenseData = {
    //   installationId: '',
    // };

    this.serverlicenseData = {
      licenseId: '',
      productId: '',
      installationId: '',
      installationName: '',
    };
  }

  openModal(content, type: any) {
    console.log('open', content);
    console.log('open', type);
    this.buttonType = type;
    this.modalService.open(content, this.modalOptions).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
    if (type === 'activate') {
      console.log('i am activate');
      this.title = 'Activate Online';
    } else {
      console.log('not activated');
      this.title = 'Refresh Online';
    }
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
