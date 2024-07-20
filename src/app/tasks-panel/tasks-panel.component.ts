import { Component, OnInit } from '@angular/core';
import { PanelModule } from 'primeng/panel';


class Task{
  starred: boolean = false;
  text: string = '';
}

@Component({
  selector: 'app-tasks-panel',
  templateUrl: './tasks-panel.component.html',
  styleUrl: './tasks-panel.component.scss',
})
export class TasksPanelComponent implements OnInit{
  // NOTE COULD HAVE SOMETHING LIKE A STREAK FOR DAILIES
  dailyTasks: Task[] = [];
  todaysTasks: Task[] = [];

  ngOnInit(): void {
    // Testing Data
    this.dailyTasks.push({'starred': false, 'text': 'Not Starred'});
    this.dailyTasks.push({'starred': true, 'text': 'Starred 1'});
    this.dailyTasks.push({'starred': true, 'text': 'Starred 2'});
    this.dailyTasks.push({'starred': false, 'text': 'Not Starred 2'});



     
    this.todaysTasks.push({'starred': true, 'text': 'starred task'});
    this.todaysTasks.push({'starred': true, 'text': 'starred task'});
    this.todaysTasks.push({'starred': false, 'text': 'starred task'});
    this.todaysTasks.push({'starred': true, 'text': 'starred task'});
    this.todaysTasks.push({'starred': false, 'text': 'starred task'});
    this.todaysTasks.push({'starred': false, 'text': 'starred task'});


    this.dailyTasks = this.sortTasks(this.dailyTasks);
    this.todaysTasks = this.sortTasks(this.todaysTasks);
  }

  sortTasks(tasks: Task[]) {
    return tasks.sort((task1: Task, task2: Task) => {
      if (task1.starred !== task2.starred) {
        return Number(task2.starred) - Number(task1.starred);
      }
      return task1.text.localeCompare(task2.text);
    });
  }

  onClickStar(isDaily: boolean, index: number) {
    let target: Task[] = isDaily ? this.dailyTasks : this.todaysTasks;
    target[index].starred = !target[index].starred
    this.sortTasks(target);
  }

  onCheck(isDaily: boolean, index: number) {
    let target: Task[] = isDaily ? this.dailyTasks : this.todaysTasks;
    target.splice(index, 1);
  }
}