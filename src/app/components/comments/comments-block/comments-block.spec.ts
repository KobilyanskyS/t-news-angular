import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsBlockComponent } from './comments-block';

describe('CommentsBlockComponent', () => {
  let component: CommentsBlockComponent;
  let fixture: ComponentFixture<CommentsBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentsBlockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentsBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
