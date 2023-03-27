import { NgModule } from "@angular/core";
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({

	exports: [
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		MatDividerModule,
		MatIconModule,
		DragDropModule

	]
})
export class MaterialModule { }
