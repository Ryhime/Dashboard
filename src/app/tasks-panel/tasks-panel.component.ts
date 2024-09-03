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
   * Process new task data 
   * @param {any | null} data The new data coming in 
   */
  processIncomingTaskData(data: any | null) {
    this.dailyTasks = [];
    this.todaysTasks = [];

    if (!data) {
      return;
    }
    // Daily
    const dailyList: any = data.find((list: any) => list[0]['title'] === this.DAILY_TASK_TITLE);
    if (dailyList) {
      dailyList[1].forEach((task: any) => {
        this.dailyTasks.push(new Task(false, task['title']));
      });
      this.dailyTasks = this.sortTasks(this.dailyTasks);
    }

    // Todays
    const todaysList: any = data.find((list: any) => list[0]['title'] !== this.DAILY_TASK_TITLE);
    if (todaysList) {
      todaysList[1].forEach((task: any) => {
        this.todaysTasks.push(new Task(false, task['title']));
      });
      this.todaysTasks = this.sortTasks(this.todaysTasks);
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

  /**
   * Called when the star is clicked on a task
   * @param {boolean} isDaily If the task is a daily task
   * @param {number} index The index of the task 
   */
  onClickStar(isDaily: boolean, index: number): void {
    const target: Task[] = isDaily ? this.dailyTasks : this.todaysTasks;
    target[index].starred = !target[index].starred
    this.sortTasks(target);
  }

  /**
   * Called when a task is checked
   * @param {boolean} isDaily If the task is a daily task
   * @param {number} index The index of the task
   */
  onCheck(isDaily: boolean, index: number): void {
    const target: Task[] = isDaily ? this.dailyTasks : this.todaysTasks;
    target.splice(index, 1);
  }
}