import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class ChatroomStateService {

    private chatroomSubject !: BehaviorSubject<any>;
    private chatroom$ !: Observable<any>;

    constructor() {
        this.chatroomSubject = new BehaviorSubject(undefined)
        this.chatroom$ = this.chatroomSubject.asObservable();
    }
    getChatroom() {
        return this.chatroom$;
    }
    setChatroom(state: any) {
        this.chatroomSubject.next(state);
    }
}