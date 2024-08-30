import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksPanelComponent } from './tasks-panel.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Task } from './tasks-panel.component';

describe('TasksPanelComponent', () => {
  let component: TasksPanelComponent;
  let fixture: ComponentFixture<TasksPanelComponent>;

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
    await TestBed.configureTestingModule({
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

  describe('ngOnInit', () => {
    it('should sort the daily tasks', () => {
      // Arrange
      component.dailyTasks = getTaskTestData().slice(5);

      // Act
      const expected = component.sortTasks(component.dailyTasks);
      component.ngOnInit();

      // Assert
      expect(expected).toEqual(component.dailyTasks);
    });

    it('should sort todays tasks', () => {
      // Arrange
      component.todaysTasks = getTaskTestData();

      // Act
      const expected = component.sortTasks(component.todaysTasks);
      component.ngOnInit();

      // Assert
      expect(expected).toEqual(component.todaysTasks);
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

  describe('onClickStar', () => {
    beforeEach(() => {
      component.dailyTasks = getTaskTestData().slice(0, 5);
      component.todaysTasks = getTaskTestData().slice(5);
    });

    it('should star a daily task and sort', () => {
      // Arrange
      const firstUnstarIndex: number = component.dailyTasks.findIndex((task: Task) => !task.starred)!;
      const targetTask: Task = component.dailyTasks[firstUnstarIndex];

      let expected: Task[] = [...component.dailyTasks];
      expected[firstUnstarIndex] = {'starred': true, 'text': expected[firstUnstarIndex].text};
      expected = component.sortTasks(expected);
      
      // Act
      component.onClickStar(true, firstUnstarIndex);

      // Assert
      expect(expected).toEqual(component.dailyTasks);
      expect(targetTask.starred).toEqual(true);
    });

    it('should un star a daily task and sort', () => {
      // Arrange
      const firstStarIndex: number = component.dailyTasks.findIndex((task: Task) => task.starred)!;
      const targetTask: Task = component.dailyTasks[firstStarIndex];

      let expected: Task[] = [...component.dailyTasks];
      expected[firstStarIndex] = {'starred': false, 'text': expected[firstStarIndex].text};
      expected = component.sortTasks(expected);
      
      // Act
      component.onClickStar(true, firstStarIndex);

      // Assert
      expect(expected).toEqual(component.dailyTasks);
      expect(targetTask.starred).toEqual(false);
    });

    it('should star a todays task and sort', () => {
      // Arrange
      const firstUnstarIndex: number = component.todaysTasks.findIndex((task: Task) => !task.starred)!;
      const targetTask: Task = component.todaysTasks[firstUnstarIndex];

      let expected: Task[] = [...component.todaysTasks];
      expected[firstUnstarIndex] = {'starred': true, 'text': expected[firstUnstarIndex].text};
      expected = component.sortTasks(expected);
      
      // Act
      component.onClickStar(false, firstUnstarIndex);

      // Assert
      expect(expected).toEqual(component.todaysTasks);
      expect(targetTask.starred).toEqual(true);
    });

    it('should un star a todays task and sort', () => {
      // Arrange
      const firstStarIndex: number = component.todaysTasks.findIndex((task: Task) => task.starred)!;
      const targetTask: Task = component.todaysTasks[firstStarIndex];

      let expected: Task[] = [...component.todaysTasks];
      expected[firstStarIndex] = {'starred': false, 'text': expected[firstStarIndex].text};
      expected = component.sortTasks(expected);
      
      // Act
      component.onClickStar(false, firstStarIndex);

      // Assert
      expect(expected).toEqual(component.todaysTasks);
      expect(targetTask.starred).toEqual(false);
    });
  });

  describe('onCheck', () => {
    beforeEach(() => {
      component.dailyTasks = getTaskTestData().slice(0, 5);
      component.todaysTasks = getTaskTestData().slice(5);
    });

    it('should remove a checked daily task', () => {
      // Arrange
      const indexToRemove: number = 2;
      const removedElement: Task = component.dailyTasks[indexToRemove];
      const expectedLength: number = component.dailyTasks.length - 1;
      
      // Act
      component.onCheck(true, indexToRemove);

      // Assert
      expect(component.dailyTasks.length).toEqual(expectedLength);
      expect(component.dailyTasks.find((task: Task) => task === removedElement)).toBeFalsy();
    });

    it('should remove a checked todays task', () => {
      // Arrange
      const indexToRemove: number = 1;
      const removedElement: Task = component.todaysTasks[indexToRemove];
      const expectedLength: number = component.todaysTasks.length - 1;
      
      // Act
      component.onCheck(false, indexToRemove);

      // Assert
      expect(component.todaysTasks.length).toEqual(expectedLength);
      expect(component.todaysTasks.find((task: Task) => task === removedElement)).toBeFalsy();
    });
  });
});
