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
	constructor(private connectionState: ConnectionStateService, private chatroom: ChatroomStateService) {
	}
	ngOnInit() {
		this.connectionState.getConnectionState().subscribe({
			next: (state) => {
				if (state?.connected) {
					this.socket = state.socket;
					this.connected = true;
					this.socket?.on('got_nudged', (data) => {
						this.chatroom.setChatroom(data.sender);
						this.shakeit = true;
						setTimeout(() => {
							this.shakeit = false;
						}, 5000);
					})
				}
			}
		})
		this.chatroom.getChatroom().subscribe({
			next: (state) => {
				this.hideChat = (state === undefined)
			}
		});

	}
}
