import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class ChatroomStateService {

    private chatroomSubject !: BehaviorSubject<any>;
    private chatroom$ !: Observable<any>;

    private chatWindowsSubject !: BehaviorSubject<any>;
    private chatWindows$ !: Observable<any>;

    constructor() {
        this.chatroomSubject = new BehaviorSubject(undefined)
        this.chatroom$ = this.chatroomSubject.asObservable();

        this.chatWindowsSubject = new BehaviorSubject([]);
        this.chatWindows$ = this.chatWindowsSubject.asObservable();
    }
    getChatroom() {
        return this.chatroom$;
    }
    setChatroom(state: any) {
        this.chatroomSubject.next(state);
    }
    getChatWindows() {
        return this.chatWindows$;
    }
    setChatWindows(state: any) {
        return this.chatWindowsSubject.next(state);
    }
}