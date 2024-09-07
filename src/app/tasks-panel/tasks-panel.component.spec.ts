/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksPanelComponent } from './tasks-panel.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Task } from './tasks-panel.component';
import { BackendService } from '../Services/backend.service';
import { of, Subject } from 'rxjs';

describe('TasksPanelComponent', () => {
  let component: TasksPanelComponent;
  let fixture: ComponentFixture<TasksPanelComponent>;

  let mockBackendService: any;

  function getTaskTestData(): Task[] {
    return [
      {'starred': true, 'text': 'B'},
      {'starred': false, 'text': 'F'},
      {'starred': false, 'text': 'E'},
      {'starred': true, 'text': 'C'},
      {'starred': false, 'text': 'B'},
      {'starred': false, 'text': 'E'},
      {'starred': false, 'text': 'F'},
      {'starred': true, 'text': 'G'},
      {'starred': false, 'text': 'H'},
      {'starred': true, 'text': 'J'},
      {'starred': false, 'text': 'K'},
      {'starred': true, 'text': 'Lo'},
      {'starred': false, 'text': 'Hi'},
      {'starred': true, 'text': 'med'},
    ];
  }

  beforeEach(async () => {
    mockBackendService = jasmine.createSpyObj('BackendService', ['tasksData$', 'setIsServiceDown']);
    mockBackendService['tasksData$'] = new Subject();
    
    await TestBed.configureTestingModule({
      providers: [
        {provide: BackendService, useValue: mockBackendService},
      ],
      declarations: [TasksPanelComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TasksPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('constructor', () => {
    it('should call processIncomingTaskData when valid data comes through', () => {
      spyOn(component, 'processIncomingTaskData');
      mockBackendService['tasksData$'].next(of({}));
      expect(component.processIncomingTaskData).toHaveBeenCalled();
      expect(mockBackendService.setIsServiceDown).toHaveBeenCalled();
    });
  });

  describe('Task class', () => {
    it('should create with given params', () => {
      const task: Task = new Task(true, 'Hello!');
      expect(task.starred).toEqual(true);
      expect(task.text).toEqual('Hello!');
    });
  });

  describe('processIncomingTaskData', () => {

    beforeEach(() => {
      component.dailyTasks = [new Task(false, '')];
      component.todaysTasks = [new Task(true, 'HELLO!!')];
    });

    it('should set both lists to nothing if no data', () => {
      component.processIncomingTaskData(null);

      expect(component.dailyTasks).toEqual(null);
      expect(component.todaysTasks).toEqual(null);
    });

    it('should set the list to null if there is no daily or todays task list', () => {
      const data: any = [];
      
      component.processIncomingTaskData(data);

      expect(component.dailyTasks).toBeNull();
      expect(component.todaysTasks).toBeNull();
    });

    it('should update the tasks with dailies and todays tasks', () => {
      spyOn(component, 'sortTasks').and.callThrough();
      const data: any = [
        [{
          'title': component.DAILY_TASK_TITLE
        }, 
          [
            {'title': 'B'},
            {'title': 'A'},
          ],
        ],
        [{
          'title': 'NOT'
        },[
          {'title': 'C'},
          {'title': 'B'}
        ]]
      ];

      const expectedDaily: Task[] = [new Task(false, 'A'), new Task(false, 'B')];
      const expectedToday: Task[] = [new Task(false, 'B'), new Task(false, 'C')];

      component.processIncomingTaskData(data);

      expect(component.dailyTasks).toEqual(expectedDaily);
      expect(component.todaysTasks).toEqual(expectedToday);
      expect(component.sortTasks).toHaveBeenCalledTimes(2);
    });
  });

  describe('sortTasks', () => {
    it('should sort according to favorite then text', () => {
      // Arrange
      const taskList: Task[] = getTaskTestData().slice(0, 5);
      const expected: Task[] = [
        {'starred': true, 'text': 'B'},
        {'starred': true, 'text': 'C'},
        {'starred': false, 'text': 'B'},
        {'starred': false, 'text': 'E'},
        {'starred': false, 'text': 'F'},
      ];

      // Act
      const sortedTaskList: Task[] = component.sortTasks(taskList);

      // Assert
      expect(expected).toEqual(sortedTaskList);
    });
  });
});
