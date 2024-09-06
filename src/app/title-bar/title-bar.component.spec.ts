import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleBarComponent } from './title-bar.component';
import { BackendService } from '../Services/backend.service';
import { Observable } from 'rxjs';

describe('TitleBarComponent', () => {
  let component: TitleBarComponent;
  let fixture: ComponentFixture<TitleBarComponent>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockBackendService: any;

  beforeEach(async () => {
    mockBackendService = jasmine.createSpyObj('BackendService', ['getIsServiceDown']);
    mockBackendService['getIsServiceDown'].and.returnValue(new Observable());
    await TestBed.configureTestingModule({
      declarations: [TitleBarComponent],
      providers: [{provide: BackendService, useValue: mockBackendService}],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TitleBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
