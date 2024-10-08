import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppsComponent } from './apps.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AppsComponent', () => {
  let component: AppsComponent;
  let fixture: ComponentFixture<AppsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppsComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
