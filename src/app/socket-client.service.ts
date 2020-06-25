import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { filter } from 'rxjs/operators';

export enum SocketClientState {
	ATTEMPTING,
	CONNECTED
}

@Injectable({
	providedIn: 'root'
})
export class SocketClientService {
	private client: Client;
	private state: BehaviorSubject<SocketClientState>;

	constructor() {
		this.client = over(new SockJS(environment.api));
		this.state = new BehaviorSubject<SocketClientState>(SocketClientState.ATTEMPTING);
		this.client.connect({}, () => {
			this.state.next(SocketClientState.CONNECTED);
		});
	}

	private connect(): Observable<Client> {
		return new Observable<Client>((observer) => {
			this.state.pipe(filter((state) => state === SocketClientState.CONNECTED)).subscribe(() => {
				observer.next(this.client);
			});
		});
	}
}
