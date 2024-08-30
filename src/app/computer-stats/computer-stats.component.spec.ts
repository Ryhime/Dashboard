import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComputerStatsComponent } from './computer-stats.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ComputerStatsComponent', () => {
  let component: ComputerStatsComponent;
  let fixture: ComponentFixture<ComputerStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComputerStatsComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComputerStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
