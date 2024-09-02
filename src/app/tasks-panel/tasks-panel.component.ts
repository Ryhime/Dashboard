import {Component, OnInit} from '@angular/core';


export class Task{
  starred: boolean;
  text: string;
  constructor(starred: boolean, text: string) {
    this.starred = starred;
    this.text = text;
  }
}

@Component({
  selector: 'app-tasks-panel',
  templateUrl: './tasks-panel.component.html',
  styleUrl: './tasks-panel.component.scss',
})
export class TasksPanelComponent implements OnInit{
  // NOTE COULD HAVE SOMETHING LIKE A STREAK FOR DAILIES
  dailyTasks: Task[] = [
    {'starred': false, 'text': 'Not Starred'},
    {'starred': true, 'text': 'Starred 1'},
    {'starred': true, 'text': 'Starred 2'},
    {'starred': false, 'text': 'Not Starred 2'},
  ];
  todaysTasks: Task[] = [
    {'starred': true, 'text': 'starred task'},
    {'starred': false, 'text': 'starred task'},
    {'starred': true, 'text': 'starred task'},
    {'starred': true, 'text': 'starred task'},
    {'starred': false, 'text': 'starred task'},
    {'starred': true, 'text': 'starred task'},
  ];

  ngOnInit(): void {
    this.dailyTasks = this.sortTasks(this.dailyTasks);
    this.todaysTasks = this.sortTasks(this.todaysTasks);
  }

  sortTasks(tasks: Task[]): Task[] {
    return tasks.sort((task1: Task, task2: Task) => {
      if (task1.starred !== task2.starred) {
        return Number(task2.starred) - Number(task1.starred);
      }
      return task1.text.localeCompare(task2.text);
    });
  }

  onClickStar(isDaily: boolean, index: number): void {
    const target: Task[] = isDaily ? this.dailyTasks : this.todaysTasks;
    target[index].starred = !target[index].starred
    this.sortTasks(target);
  }

  onCheck(isDaily: boolean, index: number): void {
    const target: Task[] = isDaily ? this.dailyTasks : this.todaysTasks;
    target.splice(index, 1);
  }
}