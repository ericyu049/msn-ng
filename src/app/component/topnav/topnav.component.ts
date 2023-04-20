import { Component, Input, Output } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { ChatroomStateService } from "src/app/service/chatroom-state.service";
import { EventEmitter } from "stream";

@Component({
    selector: 'top-nav',
    templateUrl: './topnav.component.html',
    styleUrls: ['./topnav.component.scss']
})
export class TopNavComponent {
    @Input() id!: string;
    constructor(private chatstate: ChatroomStateService) {

    }
    async closeWindow() {
        // if (this.id === 'chat') this.chatState.setChatroom(undefined);
        const windows = await firstValueFrom(this.chatstate.getChatWindows());
        const element = windows.find((window: any) => window.target.sid === this.id)

        const index = windows.indexOf(element);
        if (index > -1) {
            windows.splice(index, 1);
            this.chatstate.setChatWindows(windows);
        }

    }
}