import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsBlock } from './comments-block';

describe('CommentsList', () => {
  let component: CommentsBlock;
  let fixture: ComponentFixture<CommentsBlock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentsBlock]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentsBlock);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
