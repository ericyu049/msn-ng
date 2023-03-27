import { Component, ElementRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Socket } from "socket.io-client";
import { ChatroomStateService } from "src/app/service/chatroom-state.service";
import { ConnectionStateService } from "src/app/service/connection-state.service";

@Component({
    selector: 'chat-comp',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
    client !: any;
    messageForm !: FormGroup;
    socket!: Socket;
    lobby: boolean = false;
    messages: any[] = [];
    get isValid() { return this.messageForm.valid; }

    @ViewChild('chatContainer') chatContainer!: ElementRef;
    constructor(private fb: FormBuilder, private chatroomState: ChatroomStateService, private connectionState: ConnectionStateService) { }

    ngOnInit() {
        this.chatroomState.getChatroom().subscribe({
            next: (client) => {
                this.messages = [];
                this.client = client;
                this.lobby = client?.sid === 'lobby';
                this.getMessageHistory(client?.sid);
            }
        })
        this.messageForm = this.fb.group({
            message: [null],
        });
        this.connectionState.getConnectionState().subscribe({
            next: (state) => {
                if (state) this.socket = state?.socket;
            }
        })
        this.socket.on('message', (data) => {
            this.messages.push(data);
            this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight + 200;
        });
        this.socket.on('got_nudged', (data) => {
            this.messages.push({type: 'nudge', sender: this.client, message: this.client.nickname + ' nudged you.' });
        })
        this.getMessageHistory(this.client?.sid);
    }
    getMessageHistory(target: any) {
        this.socket?.emit('history', target, (response: any) => {
            this.messages.push(...response);
            this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight + 200;
        })
    }
    sendMessage() {
        console.log(this.messageForm.value.message);
        this.socket.emit('send_message', this.messageForm.value.message, this.client.sid);
    }
    keydownSubmit(event: KeyboardEvent) {
        if (event.key === 'Enter' && this.messageForm.value.message && this.messageForm.value.message.trim() !== '') {
            this.sendMessage();
            event.preventDefault();
            this.messageForm.reset();
            return;
        }
        else return;
    }
    nudge() {
        this.socket.emit('nudge', this.client);
        this.messages.push({type: 'nudge', sender: this.client, message: 'You nudged ' + this.client.nickname});
    }
}