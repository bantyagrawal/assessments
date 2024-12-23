import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ServicesService } from '../service/services.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent {

  taskForm: FormGroup;
  users: any[] = [];
  update: boolean = false;
  constructor(
    private fb: FormBuilder,
    private service: ServicesService,
    public dialogRef: MatDialogRef<AddTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.taskForm = this.fb.group(
      {
        title: ['', Validators.required],
        description: [''],
        status: ['', Validators.required],
        priority: ['', Validators.required],
        due_date: ['', Validators.required],
        user_id: [[]]
      });
    if (data.update) {
      this.update = true;
      this.patchForm(data.task);
    } else {
      this.update = false;
    }
  }
  ngOnInit() {
    this.getUsers();
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
    });
  }
  onSubmit() {
    if (this.taskForm.valid) {
      if (!this.update) {
        this.service.addTask(this.taskForm.value).subscribe({
          next: (res) => {
            alert('task has been added');
            this.dialogRef.close(res);
          },
          error: (err) => {
            alert(err.error);
          }
        });
      } else {
        this.taskForm.value._id = this.data.task._id;
        this.service.updateTask(this.taskForm.value).subscribe({
          next: (res) => {
            console.log(res);
            this.dialogRef.close(res);
          },
          error: (err) => {
            alert(err.error);
          }
        })
      }
    }
  }

  patchForm(task: any) {
    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      due_date: task.due_date,
      user_id: task.user_id
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
