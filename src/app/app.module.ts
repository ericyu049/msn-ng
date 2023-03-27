import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConnectComponet } from './component/connect/connect.component';
import { MainComponent } from './component/main/main.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChatComponent } from './component/chat/chat.component';
import { ConnectionStateService } from './service/connection-state.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { ChatroomStateService } from './service/chatroom-state.service';
import { TopNavComponent } from './component/topnav/topnav.component';
import { TaskBarComponent } from './component/taskbar/taskbar.component';
import { DesktopIconComponent } from './component/desktop-icon/desktop-icon.component';

@NgModule({
	declarations: [
		AppComponent,
		MainComponent,
		ConnectComponet,
		ChatComponent,
		TopNavComponent,
		TaskBarComponent,
		DesktopIconComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		ReactiveFormsModule,
		FormsModule,
		MaterialModule
	],
	providers: [
		ConnectionStateService,
		ChatroomStateService
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
