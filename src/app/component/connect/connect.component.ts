import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { io } from "socket.io-client";
import { ConnectionStateService } from "src/app/service/connection-state.service";

@Component({
    selector: 'connect-comp',
    templateUrl: './connect.component.html',
    styleUrls: ['./connect.component.scss']
})
export class ConnectComponet {
    nickname: string = '';
    connectForm !: FormGroup;

    constructor(private fb: FormBuilder, private connectionState: ConnectionStateService) {

    }
    ngOnInit() {
        this.connectForm = this.fb.group({
            nickname: [null, [Validators.required]],
        });
    }
    connect() {
        const socket = io('https://chatserver.ai-amadeus.com');
        socket.on('connect', () => {
        	console.log('connected to socket.io server');
            socket.emit('setNickname', this.connectForm.value.nickname);
            socket.emit('enter_lobby');
            this.connectionState.setConnectionState({connected: true, socket: socket})
        });
       
    }
}