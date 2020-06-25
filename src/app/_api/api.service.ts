import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { User } from '../_models';
// import axios from 'axios';

@Injectable({ providedIn: 'root' })
export class ApiService {
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

	constructor(private http: HttpClient) {
		this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
		this.currentUser = this.currentUserSubject.asObservable();
	}

	public get currentUserValue(): User {
		return this.currentUserSubject.value;
	}

	login(username, password) {
		let url = `${this.API_URL}/j_spring_security_check?username=${username}&password=${password}`;
		console.log('URL', url);
		return this.http.post<any>(url, { username, password }).pipe(
			map((user) => {
				//   // store user details and jwt token in local storage to keep user logged in between page refreshes
				//   //   localStorage.setItem('currentUser', JSON.stringify(user));
				// this.currentUserSubject.next(user);
				//   console.log('asdasdAPI', user);
				return user;
			})
		);
	}
	logout() {
		// remove user from local storage and set current user to null
		localStorage.removeItem('currentUser');
		this.currentUserSubject.next(null);
	}

	playPing() {
		let url = `${this.API_URL}/ping`;
		return this.http.get<any>(url);
	}

	getLogSessions() {
		let url = `${this.API_URL}/loginSession`;
		console.log('URL', url);
		return this.http.get<any>(url);
	}

	getAllSessions() {
		let url = `${this.API_URL}/allLoginSessions`;
		return this.http.get<any>(url);
	}

	getnetworkSettings() {
		let url = `${this.DEVSERVERAPI_URL}/networkSettings`;
		return this.http.get<any>(url);
		// return axios.get(apiConfig.baseURL + "/networkSettings")
	}

	getserverLicenseInfo() {
		let url = `${this.DEVSERVERAPI_URL}/serverLicenseInfo`;
		return this.http.get<any>(url);
		// return axios.get(apiConfig.baseURL + "/serverLicenseInfo");
	}

	postactivateLicenseOnline(data) {
		// console.log('postactivateLicenseOnline', data);
		let url = `${this.SWAGGER_URL}/activateLicenseOnline`;
		return this.http.post<any>(url, data);
	}

	postactivateRefreshOffline(data) {
		let url = `${this.SWAGGER_URL}/refreshLicenseOnline`;
		return this.http.post<any>(url, data);
	}

	// USERS

	getUsers() {
		let url = `${this.DEVSERVERAPI_URL}/users`;
		return this.http.get<any>(url);
	}

	postUsersAtomicUpdate(data) {
		console.log('postUsersAtomicUpdate', data);
		let url = `${this.DEVSERVERAPI_URL}/usersAtomicUpdate`;
		return this.http.post<any>(url, data);
	}
}
