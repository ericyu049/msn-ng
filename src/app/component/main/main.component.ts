import { Component, ElementRef, HostListener, Input, ViewChild } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { Socket } from "socket.io-client";
import { ChatroomStateService } from "src/app/service/chatroom-state.service";
import { ConnectionStateService } from "src/app/service/connection-state.service";

@Component({
    selector: 'main-comp',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent {
    socket!: Socket;
    nickname: string = '';
    counter = 1;
    onlineExpanded: boolean = true;
    banner: string = 'assets/banner/python.jpeg';
    banners: string[] = [
        'assets/banner/python.jpeg',
        'assets/banner/socketio.webp',
        'assets/banner/angular.jpeg',
    ];
    clients: any;
    chatWindows: any[] = [];
    constructor(private connectionState: ConnectionStateService, private chatroomState: ChatroomStateService) {

    }
    ngOnInit() {
        setInterval(() => {
            this.banner = this.banners[this.counter];
            this.counter = this.counter < this.banners.length - 1 ? this.counter + 1 : 0;
        }, 8000)
        this.connectionState.getConnectionState().subscribe({
            next: (state) => {
                if (state?.connected) {
                    this.socket = state.socket;
                    this.socket.emit('getNickname', (nickname: any) => this.nickname = nickname);
                    this.socket.emit('clients');

                }
            }
        })
        this.socket.on('client_results', (clients: any) => {
            this.clients = Object.entries(clients).map(([sid, nickname]) => ({ sid, nickname })).filter((client: any) => client.sid !== this.socket.id);
        });
    }
    getClients() {
        this.socket.emit('clients');
    }
    async openChat(client: any) {
        console.log(client);
        const windows: any = await firstValueFrom(this.chatroomState.getChatWindows());
        console.log(windows, 'find window: ', windows.find((window: any) => window.target.sid === client.sid));
        if (!windows.find((window: any) => window.target.sid === client.sid)) {
            this.chatWindows.push({ target: client });
            this.chatroomState.setChatWindows(this.chatWindows);
        }

    }
    enterLobby() {
        // this.chatWindows.push({ roomId: 'lobby', target: { sid: 'lobby', nickname: 'Main Lobby' } });
        // this.chatroomState.setChatWindows(this.chatWindows);
    }
    checkWindows() {
        this.chatroomState.getChatWindows().subscribe({
            next: (data) => {
                console.log('current windows: ', data);
            }
        })
    }
}