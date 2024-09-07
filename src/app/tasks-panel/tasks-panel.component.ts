/* eslint-disable @typescript-eslint/no-explicit-any */
import {Component} from '@angular/core';
import { BackendService } from '../Services/backend.service';
import { catchError, of, take } from 'rxjs';


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
  dailyTasks: Task[] | undefined | null = undefined;
  todaysTasks: Task[] | undefined | null = undefined;

  constructor(backendService: BackendService) {
    backendService.tasksData$.pipe(take(1), catchError(() => of(null))).subscribe((data: any) => {
      backendService.setIsServiceDown(data === null);
      this.processIncomingTaskData(data);
    });
  }

  /**
   * Process new task data 
   * @param {any | null} data The new data coming in 
   */
  processIncomingTaskData(data: any | null) {
    if (data === null) {
      this.dailyTasks = null;
      this.todaysTasks = null;
      return;
    }
    console.log(data);
    // Daily
    const dailyList: any = data.find((list: any) => list[0]['title'] === this.DAILY_TASK_TITLE);
    if (dailyList) {
      this.dailyTasks = [];
      dailyList[1].forEach((task: any) => {
        this.dailyTasks!.push(new Task(false, task['title']));
      });
      this.dailyTasks = this.sortTasks(this.dailyTasks);
    } else {
      this.dailyTasks = null;
    }

    // Todays
    const todaysList: any = data.find((list: any) => list[0]['title'] !== this.DAILY_TASK_TITLE);
    if (todaysList) {
      this.todaysTasks = [];
      todaysList[1].forEach((task: any) => {
        this.todaysTasks!.push(new Task(false, task['title']));
      });
      this.todaysTasks = this.sortTasks(this.todaysTasks);
    } else {
      this.todaysTasks = null;
    }
  }

  /**
   * Sorts the tasks by star then text
   * @param {Task[]} tasks The tasks to sort
   * @return {Task[]} The sorted tasks
   */
  sortTasks(tasks: Task[]): Task[] {
    return tasks.sort((task1: Task, task2: Task) => {
      if (task1.starred !== task2.starred) {
        return Number(task2.starred) - Number(task1.starred);
      }
      return task1.text.localeCompare(task2.text);
    });
  }
}