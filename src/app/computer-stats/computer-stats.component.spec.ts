import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComputerStatsComponent } from './computer-stats.component';

describe('ComputerStatsComponent', () => {
  let component: ComputerStatsComponent;
  let fixture: ComponentFixture<ComputerStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComputerStatsComponent]
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
