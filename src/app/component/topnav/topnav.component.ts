import { Component, Input } from "@angular/core";
import { ChatroomStateService } from "src/app/service/chatroom-state.service";

@Component({
    selector: 'top-nav',
    templateUrl: './topnav.component.html',
    styleUrls: ['./topnav.component.scss']
})
export class TopNavComponent {
    @Input() id!: string;
    constructor(private chatState: ChatroomStateService) {

    }
    closeWindow() {
        if (this.id === 'chat') this.chatState.setChatroom(undefined);
    }
}