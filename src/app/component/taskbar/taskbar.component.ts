import { Component } from "@angular/core";

@Component({
    selector: 'taskbar',
    templateUrl: './taskbar.component.html',
    styleUrls: ['./taskbar.component.scss']
})
export class TaskBarComponent {
    now: any;
    ngOnInit() {
        setInterval(() => {
            this.now = new Date();
        }, 1000)
    }
}