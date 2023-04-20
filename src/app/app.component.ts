import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Socket } from 'socket.io-client';
import { ChatroomStateService } from './service/chatroom-state.service';
import { ConnectionStateService } from './service/connection-state.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	title = 'ng-client';
	socket!: Socket;
	hideChat: boolean = true;
	connected: boolean = false;
	shakeit: boolean = false;
	chatWindows: any[] = [];
	constructor(private connectionState: ConnectionStateService, private chatroom: ChatroomStateService) {
	}
	ngOnInit() {
		this.connectionState.getConnectionState().subscribe({
			next: (state) => {
				if (state?.connected) {
					this.socket = state.socket;
					this.connected = true;
					// this.socket?.on('got_nudged', (data) => {
					// 	this.chatroom.setChatroom(data.sender);
					// 	this.shakeit = true;
					// 	setTimeout(() => {
					// 		this.shakeit = false;
					// 	}, 5000);
					// })


					// receives a message 
					this.socket?.on('message', (data) => {
						console.log(this.socket)
						console.log('received message: ', data);
						const room_exist = this.chatWindows.find(window => window.target.sid === data.sender.sid)

						if (!room_exist && !data.self_copy) {
							// open the window
							this.chatWindows.push({target: data.sender});
							this.chatroom.setChatWindows(this.chatWindows);
						}
					})
				}
			}
		})
		this.chatroom.getChatWindows().subscribe({
			next: (state) => {
				this.chatWindows = state
			}
		})
	}
}
