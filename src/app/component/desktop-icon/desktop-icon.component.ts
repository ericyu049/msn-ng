import { Component, Input } from "@angular/core";

@Component({
    selector: 'desktop-icon',
    templateUrl: './desktop-icon.component.html',
    styleUrls: ['./desktop-icon.component.scss']
})
export class DesktopIconComponent {
    @Input() appName: string = '';
    filePath: string = '';
    ngOnInit() {
        this.filePath = '/assets/' + this.appName + '.png'
    }
}