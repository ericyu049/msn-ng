import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatMenuTrigger } from "@angular/material/menu";
import { Socket } from "socket.io-client";
import { ChatroomStateService } from "src/app/service/chatroom-state.service";
import { ConnectionStateService } from "src/app/service/connection-state.service";

@Component({
    selector: 'chat-comp',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
    @Input() window !: any;

    client !: any;
    messageForm !: FormGroup;
    socket!: Socket;
    messages: any[] = [];
    showEmoji: boolean = false;
    myClass: string[] = ['emojiMenu'];

    get isValid() { return this.messageForm.valid; }

    @ViewChild('chatContainer') chatContainer!: ElementRef;
    @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;
    constructor(private fb: FormBuilder, private chatroomState: ChatroomStateService, private connectionState: ConnectionStateService) { }

    ngOnInit() {
        this.client = this.window.target;
        console.log('open chat client: ', this.client);
        this.getMessageHistory(this.client?.sid);

        this.messageForm = this.fb.group({
            message: [null],
        });
        this.connectionState.getConnectionState().subscribe({
            next: (state) => {
                if (state) this.socket = state?.socket;
            }
        })
        this.socket.on('message', (data: any) => {
            console.log('message: ', data)
            if (this.client.sid === data.sender.sid || data.self_copy) {
                this.messages.push(data);
                this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight + 200;
            }
        });
        this.socket.on('got_nudged', (data) => {
            this.messages.push({ type: 'nudge', sender: this.client, message: this.client.nickname + ' nudged you.' });
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
        this.socket.emit('send_message', this.messageForm.value.message, this.client.sid)
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
        this.messages.push({ type: 'nudge', sender: this.client, message: 'You nudged ' + this.client.nickname });
    }
    openEmoji() {
        this.showEmoji = !this.showEmoji;
    }
    addEmoji(event: any) {
        const message = (this.messageForm.value.message ? this.messageForm.value.message : '') + event.emoji.native;
        this.messageForm.controls['message'].setValue(message);
        this.trigger.closeMenu();
    }
}