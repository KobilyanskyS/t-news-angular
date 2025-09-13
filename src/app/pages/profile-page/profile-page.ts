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

  // ViewChild
  @ViewChild('avatarInput') avatarInput!: ElementRef<HTMLInputElement>;

  // Состояние компонента
  userInfo!: User;
  posts: Post[] = [];

  isLoading = true; // загрузка страницы/данных
  isUploading = false; // загрузка аватара

  isAuthenticated = this.authService.isAuthenticated();
  isCurrentUser = false; // просмотр своего профиля

  // Режимы редактирования
  isEditingName = false;
  isEditingAbout = false;

  // Подписки
  isSubscribing = false;
  isSubscribed = false;

  // Временные буферы для полей редактирования
  tempName = '';
  tempAbout = '';

  // Вспомогательные поля
  isLoggingOut = false;
  private routeSub: Subscription = new Subscription();

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.loadProfileData();
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  // Загрузка данных профиля
  private loadProfileData(): void {
    this.routeSub = this.route.paramMap.subscribe((params) => {
      const userIdParam = params.get('user_id');
      if (!userIdParam || isNaN(Number(userIdParam))) {
        this.router.navigate(['/not-found']);
        return;
      }

      const userId = Number(userIdParam);
      this.prepareAuthState(userId);
      this.isLoading = true;

      forkJoin({
        posts: this.postService.getUsersPosts(userId),
        user: this.userService.getUser(userId),
      }).subscribe({
        next: ({ posts, user }) => {
          this.posts = posts;
          this.userInfo = user;
          this.updateSubscriptionState(userId);
          this.isLoading = false;
        },
        error: (err) => this.handleLoadError(err),
      });
    });
  }

  // Подготовить состояние аутентификации и флага текущего пользователя
  private prepareAuthState(userId: number) {
    const currentUser = this.authService.getCurrentUser();
    this.isAuthenticated = !!currentUser;
    this.isCurrentUser = currentUser?.id === userId;
  }

  // Обновить флаг подписки исходя из текущего пользователя
  private updateSubscriptionState(targetUserId: number) {
    const currentUser = this.authService.getCurrentUser();
    this.isSubscribed = !!(
      currentUser &&
      !this.isCurrentUser &&
      currentUser.subscriptions?.includes(targetUserId)
    );
  }

  // Обработка ошибок при загрузке профиля
  private handleLoadError(err: any) {
    console.error('Ошибка при загрузке данных:', err);
    this.isLoading = false;
    if (err?.status === 404) this.router.navigate(['/not-found']);
  }

  // Управление списком постов
  loadUsersPosts(user_id: User['id']) {
    this.isLoading = true;
    this.postService.getUsersPosts(user_id).subscribe({
      next: (posts) => {
        this.posts = posts;
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });
  }

  onPostCreated(newPost: Post): void {
    this.posts = [newPost, ...this.posts];
  }

  onPostDeleted(postId: number): void {
    this.posts = this.posts.filter((post) => post.id !== postId);
  }

  // Управление аватаром
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
          next: (response) => this.applyAvatarResponse(response),
          error: (error) => console.error('Ошибка:', error),
        });
    };
    reader.readAsDataURL(file);
  }

  private applyAvatarResponse(response: any) {
    if (!response?.avatar) return;
    this.userInfo.avatar = response.avatar;
    if (this.isCurrentUser) {
      this.updateAuthUser({ avatar: response.avatar });
    }
  }

  // Редактирование полей профиля (имя / о себе)
  startEditingName(): void {
    this.tempName = this.userInfo?.name || '';
    this.isEditingName = true;
  }

  saveName(): void {
    const newName = this.tempName.trim();
    if (!newName || newName === this.userInfo.name) {
      this.cancelEditingName();
      return;
    }

    this.userService.updateUserName(this.userInfo.id, newName).subscribe({
      next: () => {
        this.userInfo.name = newName;
        this.isEditingName = false;
        if (this.isCurrentUser) this.updateAuthUser({ name: newName });
      },
      error: (error) => {
        console.error('Ошибка изменения имени:', error);
        this.cancelEditingName();
      },
    });
  }

  cancelEditingName(): void {
    this.isEditingName = false;
  }

  startEditingAbout(): void {
    this.tempAbout = this.userInfo?.about || '';
    this.isEditingAbout = true;
  }

  saveAbout(): void {
    const newAbout = this.tempAbout.trim();
    if (newAbout === this.userInfo.about) {
      this.cancelEditingAbout();
      return;
    }

    this.userService.updateUserAbout(this.userInfo.id, newAbout).subscribe({
      next: () => {
        this.userInfo.about = newAbout;
        this.isEditingAbout = false;
        if (this.isCurrentUser) this.updateAuthUser({ about: newAbout });
      },
      error: (error) => {
        console.error('Ошибка изменения информации:', error);
        this.cancelEditingAbout();
      },
    });
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

  // Аутентификация / профиль текущего пользователя
  private updateAuthUser(patch: Partial<User>) {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;
    const updated = { ...currentUser, ...patch } as User;
    this.authService.updateUser(updated);
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
      complete: () => (this.isLoggingOut = false),
    });
  }

  // Подписки
  toggleSubscription(): void {
    if (this.isSubscribing || this.isCurrentUser) return;
    this.isSubscribing = true;

    const targetUserId = this.userInfo.id;
    const action$ = this.isSubscribed
      ? this.userService.unsubscribe(targetUserId)
      : this.userService.subscribe(targetUserId);

    action$.subscribe({
      next: (response) => {
        if (response.success) {
          this.isSubscribed = !this.isSubscribed;
          if (response.subscriptions) {
            const currentUser = this.authService.getCurrentUser();
            if (currentUser)
              this.updateAuthUser({ subscriptions: response.subscriptions });
          }
        }
      },
      error: (error) => {
        console.error('Ошибка при изменении подписки:', error);
        alert('Не удалось изменить подписку');
      },
      complete: () => (this.isSubscribing = false),
    });
  }
}
