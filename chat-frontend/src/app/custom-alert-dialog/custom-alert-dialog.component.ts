import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-custom-alert-dialog',
  templateUrl: './custom-alert-dialog.component.html',
  styleUrls: ['./custom-alert-dialog.component.css']
})
export class CustomAlertDialogComponent {
  message: string; 
  constructor ( 
    private service: SocketService,
    public dialogRef: MatDialogRef<CustomAlertDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any 
  ) 
  { 
    this.message = data.message.message.title; 
  }

  onOkClick(): void { 
    // this.service.seenNotification(this.data.message.message);
    this.dialogRef.close(true);
    }
}
