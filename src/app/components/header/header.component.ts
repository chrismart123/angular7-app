import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../_api';
import { Router } from '@angular/router';
@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: [ './header.component.css' ]
})
@Injectable({ providedIn: 'root' })
export class HeaderComponent implements OnInit {
	@Output() functionTest = new EventEmitter<string>();

	@Input() dataHead: any;
	@Input() testvalue;
	constructor(private http: HttpClient, private apiService: ApiService, private router: Router) {}

	ngOnInit(): void {
		console.log('header', this.dataHead);
		console.log('header', this.testvalue);
	}

	handleLogout() {
		this.functionTest.emit('eventDesc Trigger parent functtion');
		setTimeout(() => {
			this.apiService.logout();
			this.router.navigate([ '/login' ]);
		}, 1000);
	}

	ngOnChanges() {
		console.log(' headerrngOnChanges');
		console.log('header', this.dataHead);
		console.log('header', this.testvalue);
	}

	ngAfterViewInit() {
		console.log('ngAfterViewInit');
	}
}
