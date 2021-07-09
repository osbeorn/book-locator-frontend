import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SearchLogsComponent} from './search-logs.component';

describe('LibrariesComponent', () => {
  let component: SearchLogsComponent;
  let fixture: ComponentFixture<SearchLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchLogsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
