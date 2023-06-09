import { trigger, state, style, transition, animate, keyframes, AnimationBuilder } from '@angular/animations';
import { Component, ElementRef, OnInit, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { Socket } from 'socket.io-client';
import { ChatroomStateService } from './service/chatroom-state.service';
import { ConnectionStateService } from './service/connection-state.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	title = 'ng-client';
	socket!: Socket;
	hideChat: boolean = true;
	connected: boolean = false;
	shakeit: boolean = false;
	chatWindows: any[] = [];
	@ViewChildren('windows') windows !: QueryList<ElementRef>;

	constructor(private connectionState: ConnectionStateService, private chatroom: ChatroomStateService, private renderer: Renderer2) {
	}
	ngOnInit() {

		this.connectionState.getConnectionState().subscribe({
			next: (state) => {
				if (state?.connected) {
					this.socket = state.socket;
					this.connected = true;
					this.socket?.on('got_nudged', (data) => {
						console.log('data: ', data)
						const room_exist = this.chatWindows.find(window => window.target.sid === data.sender.sid)

						if (!room_exist && !data.self_copy) {
							// open the window
							this.chatWindows.push({ target: data.sender });
							this.chatroom.setChatWindows(this.chatWindows);
						}
						const chatWindow = this.windows.find(window => window.nativeElement.id === data.sender.sid)
						setTimeout(() => {
							this.renderer.addClass(chatWindow?.nativeElement, 'shakeit');
						}, 5000);
						this.renderer.removeClass(chatWindow?.nativeElement, 'shakeit');
					})


					// receives a message 
					this.socket?.on('message', (data) => {
						const room_exist = this.chatWindows.find(window => window.target.sid === data.sender.sid)

						if (!room_exist && !data.self_copy) {
							// open the window
							this.chatWindows.push({ target: data.sender });
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
	checkWindows() {
		console.log(this.windows);
	}
}

