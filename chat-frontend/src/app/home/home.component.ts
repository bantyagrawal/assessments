import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ServicesService } from '../service/services.service';
import { SocketService } from '../socket.service';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskComponent } from '../add-task/add-task.component';
import { CustomAlertDialogComponent } from '../custom-alert-dialog/custom-alert-dialog.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  tasks = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['title', 'description', 'user', 'status', 'priority', 'due_date', 'actions'];
  users: any[] = [];
  filerValue: string = "";
  constructor(
    private service: ServicesService,
    private socket: SocketService,
    public dialog: MatDialog
  ) {
    this.getUsers();
  }
  ngOnInit() {
    this.loadTasks();
    this.socket.createConnection();
    this.socket.onMessage().subscribe((message: any) => {
      this.openAlertDialog(message);
      this.loadTasks();
    });
  };

  loadTasks() {
    this.service.getTaskList().subscribe({
      next: (res) => {
        this.tasks.data = res.response;
        console.log('filter value',this.filerValue);
        
        this.tasks.data = this.tasks.data.filter(task => task.priority.includes(this.filerValue));
        console.log(this.tasks.data);
      },
      error: (err) => {
        alert(err.error);
      }
    });
  };

  deleteTask(task: any) {
    this.service.deleteTask(task).subscribe({
      next: (res) => {
        const data = { ...res.response, type: 'DELETE' }
        this.socket.sendMessage(data);
        this.loadTasks();
      },
      error: (err) => {
        alert(err.error);
      }
    })
  }

  getUsers() {
    this.service.getUserList().subscribe({
      next: (res) => {
        this.users = res.response;
        console.log(this.users);

      },
      error: (err) => {
        alert(err.error);
      }
    })
  }

  openDialog() {
    let dialogRef = this.dialog.open(AddTaskComponent, {
      width: '300px',
      height: '600px',
      data: { users: this.users }
    });
    dialogRef.afterClosed().subscribe((res) => {
      const data = { ...res.response, type: 'ADD' }
      this.socket.sendMessage(data);
      this.loadTasks();
    })
  }

  updateTask(task: any) {
    let dialogRef = this.dialog.open(AddTaskComponent, {
      width: '300px',
      height: '600px',
      data: { "update": true, task }
    });
    dialogRef.afterClosed().subscribe((res) => {
      const data = { ...res.response, type: 'UPDATE' }
      this.socket.sendMessage(data);
      this.loadTasks();
    })
  }

  openAlertDialog(data: any): void {
    const dialogRef = this.dialog.open(CustomAlertDialogComponent, {
      width: '250px',
      data: {
        message: data
      }
    });
  }

  filterByPriority(event: any): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.tasks.data = this.tasks.data.filter(task => task.priority.toLowerCase().includes(filterValue));
  }
}