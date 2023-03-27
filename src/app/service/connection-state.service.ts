import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Socket } from "socket.io-client";

@Injectable()
export class ConnectionStateService {
    private connectionSubject!: BehaviorSubject<any>;
    private connection$ !: Observable<any>;
    
    constructor() {
        this.connectionSubject = new BehaviorSubject(null)
        this.connection$ = this.connectionSubject.asObservable();
    }
    getConnectionState() {
        return this.connection$;
    }
    setConnectionState(state: any) {
        this.connectionSubject.next(state);
    }
}