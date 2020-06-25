import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from '../_api';
import { User } from '../_models';
// import { ApiService } from '../_api/api.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements OnInit {
	private currentUserSubject: BehaviorSubject<User>;
	public currentUser: Observable<User>;
	loginForm: FormGroup;
	loading = false;
	submitted = false;
	returnUrl: string;

	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private apiService: ApiService
	) {
		// redirect to home if already logged in
		this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
		this.currentUser = this.currentUserSubject.asObservable();
		if (this.apiService.currentUserValue) {
			this.router.navigate([ '/dashboard' ]);
		}
	}

	// public get currentUserValue(): User {
	// 	return this.currentUserSubject.value;
	// }

	ngOnInit() {
		this.loginForm = this.formBuilder.group({
			username: [ '', Validators.required ],
			password: [ '', Validators.required ]
		});

		this.updateLogInSessions();
		// get return url from route parameters or default to '/'
		// this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
		// console.log('this.returnUrl', this.returnUrl);
	}

	get f() {
		return this.loginForm.controls;
	}

	updateLogInSessions() {
		console.log('updateLogInSessions');
		this.apiService.getLogSessions();
		this.apiService.getAllSessions();
	}

	onSubmit() {
		this.submitted = true;

		if (this.loginForm.invalid) {
			return;
		}
		this.loading = true;

		let user = {
			username: this.f.username.value,
			password: this.f.password.value,
			id: 0,
			firstName: '',
			lastName: '',
			token: ''
		};
		this.apiService.login(this.f.username.value, this.f.password.value).pipe(first()).subscribe(
			(data) => {
				console.log('SUCCESS', data);
			},
			(error) => {
				const splitted = error.url.split('?');
				if (splitted[1] === 'authenticated') {
					localStorage.setItem('currentUser', JSON.stringify(user));
					this.apiService.currentUserSubject.next(user);
					this.router.navigate([ 'dashboard' ]);
				} else {
					console.log('ERROR DATA AUTHENTICATE', splitted[1]);
				}
				this.loading = false;
			}
		);
	}
}
