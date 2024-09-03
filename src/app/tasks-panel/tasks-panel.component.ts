/* eslint-disable @typescript-eslint/no-explicit-any */
import {Component} from '@angular/core';
import { BackendService } from '../Services/backend.service';
import { take } from 'rxjs';


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
export class TasksPanelComponent {
  DAILY_TASK_TITLE: string = 'Dailies';

  // NOTE COULD HAVE SOMETHING LIKE A STREAK FOR DAILIES
  dailyTasks: Task[] = [];
  todaysTasks: Task[] = [];

  constructor(backendService: BackendService) {
    backendService.tasksData$.pipe(take(1)).subscribe((data: any) => {
      this.processIncomingTaskData(data);
    });
  }

  /**
   * Processes new task data
   */
  processIncomingTaskData(data: any) {
    // Daily
    const dailyList: any = data.find((list: any) => list[0]['title'] === 'Dailies');
    if (dailyList) {
      dailyList[1].forEach((task: any) => {
        this.dailyTasks.push(new Task(false, task['title']));
      });
      this.dailyTasks = this.sortTasks(this.dailyTasks);
    } else {
      this.dailyTasks = [];
    }

    // Todays
    const todaysList: any = data.find((list: any) => list[0]['title'] !== 'Dailies');

    if (todaysList[0]['title'] !== 'Dailies') {
      todaysList[1].forEach((task: any) => {
        this.todaysTasks.push(new Task(false, task['title']));
      });
      this.todaysTasks = this.sortTasks(this.todaysTasks);
    } else {
      this.todaysTasks = [];
    }
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