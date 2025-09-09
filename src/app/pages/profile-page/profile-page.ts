import { Component, inject, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostsService } from '../../services/posts/posts';
import { Post } from '../../models/post';
import { PostsListComponent } from '../../components/posts/posts-list/posts-list';
import { finalize, forkJoin, Subscription } from 'rxjs';
import { User } from '../../models/user';
import { UserService } from '../../services/user/user';
import { AuthService } from '../../services/auth/auth';
import { FormsModule } from '@angular/forms';
import { PostFormComponent } from '../../components/posts/post-form/post-form';

@Component({
  selector: 'app-profile-page',
  imports: [PostsListComponent, PostFormComponent, FormsModule],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.less',
})
export class ProfilePage {
  private postService = inject(PostsService);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);

  @ViewChild('avatarInput') avatarInput!: ElementRef<HTMLInputElement>;

  userInfo!: User;

  posts: Post[] = [];
  isLoading = true;
  isUploading = false;

  private routeSub: Subscription = new Subscription();

  isAuthenticated = this.authService.isAuthenticated();

  isCurrentUser = false;
  isLoggingOut = false;

  isEditingName = false;
  isEditingAbout = false;

  isSubscribing = false;
  isSubscribed = false;

  tempName = '';
  tempAbout = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.loadProfileData();
  }

  private loadProfileData(): void {
    this.routeSub = this.route.paramMap.subscribe((params) => {
      const userIdParam = params.get('user_id');

      if (!userIdParam || isNaN(Number(userIdParam))) {
        this.router.navigate(['/not-found']);
        return;
      }

      const userId = Number(userIdParam);
      const currentUser = this.authService.getCurrentUser();
      this.isAuthenticated = currentUser !== null;
      this.isCurrentUser = currentUser?.id === userId;

      this.isLoading = true;

      forkJoin({
        posts: this.postService.getUsersPosts(userId),
        user: this.userService.getUser(userId),
      }).subscribe({
        next: ({ posts, user }) => {
          this.posts = posts;
          this.userInfo = user;

          if (currentUser && !this.isCurrentUser) {
            this.isSubscribed =
              currentUser.subscriptions?.includes(userId) || false;
          }

          this.isLoading = false;
        },
        error: (err) => {
          console.error('Ошибка при загрузке данных:', err);
          this.isLoading = false;

          if (err?.status === 404) {
            this.router.navigate(['/not-found']);
          }
        },
      });
    });
  }

  loadUsersPosts(user_id: User['id']) {
    this.isLoading = true;
    this.postService.getUsersPosts(user_id).subscribe({
      next: (posts) => {
        this.posts = posts;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
      },
    });
  }

  changeAvatar() {
    this.avatarInput.nativeElement.click();
  }

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    this.isUploading = true;

    const reader = new FileReader();
    reader.onload = () => {
      this.userService
        .uploadAvatar(reader.result as string)
        .pipe(
          finalize(() => {
            this.isUploading = false;
            input.value = '';
          })
        )
        .subscribe({
          next: (response) => {
            if (response?.avatar) {
              this.userInfo.avatar = response.avatar;
              if (this.isCurrentUser) {
                const updatedUser = {
                  ...this.authService.getCurrentUser(),
                  avatar: response.avatar,
                };
                this.authService.updateUser(updatedUser as User);
              }
            }
          },
          error: (error) => console.error('Ошибка:', error),
        });
    };
    reader.readAsDataURL(file);
  }

  startEditingName(): void {
    this.tempName = this.userInfo.name;
    this.isEditingName = true;
  }

  saveName(): void {
    const newName = this.tempName.trim();
    if (newName && newName !== this.userInfo.name) {
      this.userService.updateUserName(this.userInfo.id, newName).subscribe({
        next: () => {
          this.userInfo.name = newName;
          this.isEditingName = false;

          if (this.isCurrentUser) {
            const updatedUser = {
              ...this.authService.getCurrentUser(),
              name: newName,
            };
            this.authService.updateUser(updatedUser as User);
          }
        },
        error: (error) => {
          console.error('Ошибка изменения имени:', error);
          this.cancelEditingName();
        },
      });
    } else {
      this.cancelEditingName();
    }
  }

  cancelEditingName(): void {
    this.isEditingName = false;
  }

  startEditingAbout(): void {
    this.tempAbout = this.userInfo.about;
    this.isEditingAbout = true;
  }

  saveAbout(): void {
    const newAbout = this.tempAbout.trim();
    if (newAbout != this.userInfo.about) {
      this.userService.updateUserAbout(this.userInfo.id, newAbout).subscribe({
        next: () => {
          this.userInfo.about = newAbout;
          this.isEditingAbout = false;

          if (this.isCurrentUser) {
            const updatedUser = {
              ...this.authService.getCurrentUser(),
              about: newAbout,
            };
            this.authService.updateUser(updatedUser as User);
          }
        },
        error: (error) => {
          console.error('Ошибка изменения информации:', error);
          this.cancelEditingAbout();
        },
      });
    } else {
      this.cancelEditingAbout();
    }
  }

  cancelEditingAbout(): void {
    this.isEditingAbout = false;
  }

  onNameKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.saveName();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.cancelEditingName();
    }
  }

  onAboutKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.saveAbout();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.cancelEditingAbout();
    }
  }

  onPostCreated(newPost: Post): void {
    this.posts = [newPost, ...this.posts];
  }

  onPostDeleted(postId: any): void {
    this.posts = this.posts.filter((post) => post.id !== postId);
  }

  logout(): void {
    if (this.isLoggingOut) return;

    this.isLoggingOut = true;

    this.authService.logOut().subscribe({
      next: (response) => {
        if (response.success) {
          this.authService.clearAuthData();
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        console.error('Ошибка при выходе:', error);
        this.authService.clearAuthData();
        this.router.navigate(['/']);
      },
      complete: () => {
        this.isLoggingOut = false;
      },
    });
  }

  toggleSubscription(): void {
    if (this.isSubscribing || this.isCurrentUser) return;

    this.isSubscribing = true;
    const targetUserId = this.userInfo.id;

    const subscriptionAction = this.isSubscribed
      ? this.userService.unsubscribe(targetUserId)
      : this.userService.subscribe(targetUserId);

    subscriptionAction.subscribe({
      next: (response) => {
        if (response.success) {
          this.isSubscribed = !this.isSubscribed;

          const currentUser = this.authService.getCurrentUser();
          if (currentUser) {
            const updatedUser = {
              ...currentUser,
              subscriptions: response.subscriptions,
            };
            this.authService.updateUser(updatedUser as User);
          }
        }
      },
      error: (error) => {
        console.error('Ошибка при изменении подписки:', error);
        alert('Не удалось изменить подписку');
      },
      complete: () => {
        this.isSubscribing = false;
      },
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
