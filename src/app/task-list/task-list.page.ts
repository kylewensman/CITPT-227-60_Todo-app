import { Component, OnInit } from '@angular/core';

import { IonItemSliding } from '@ionic/angular';

import { AlertController, ToastController } from '@ionic/angular';

import { Task } from './task';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.page.html',
  styleUrls: ['./task-list.page.scss'],
})
export class TaskListPage implements OnInit {
  taskList: AngularFireList<Task>;

  tasks: Observable<any[ ]>;

  constructor( 
    public alertCtrl: AlertController, 
    public toastCtrl: ToastController,
    public af: AngularFireDatabase
  ){
    this.taskList = this.af.list('/tasks'); 
    this.tasks = this.taskList.valueChanges();
  }

  async addItem(){
    let prompt = await this.alertCtrl.create({
      header: 'Todo List',
      message: 'Add a Task',
      inputs: [{
        name: 'newTask',
        type: 'text'
      }],
      buttons: [{
        text: 'Cancel',
        role: 'cancel'
      },{
        text: 'Add to List',
        handler: data => {
          let newTaskRef = this.taskList.push(
            { id: '', title: data.newTask, status: 'open' });
          newTaskRef.update( { id: newTaskRef.key } )
          toast.present();
        }
      }]
    });

    let toast = await this.toastCtrl.create({
      message: "Item Added!",
      duration: 5000,
      showCloseButton: true,
      color: 'dark'
    });
    prompt.present();
  }

    markAsDone(slidingItem: IonItemSliding, task: any) {
      if (task.status != "done"){
      task.status = "done";
      this.taskList.update( task.id, task );
      }else{
      task.status = "open";
      }
      slidingItem.close();
    }
    
    removeTask(slidingItem: IonItemSliding, task: any){
      this.taskList.remove( task.id );
      slidingItem.close();
    }

  ngOnInit() {}

}
