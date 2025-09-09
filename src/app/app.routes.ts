import { Routes } from '@angular/router';
import { FeedPage } from './pages/feed-page/feed-page';
import { LogInPage } from './pages/log-in-page/log-in-page';
import { SignUpPage } from './pages/sign-up-page/sign-up-page';
import { ProfilePage } from './pages/profile-page/profile-page';
import { SearchPage } from './pages/search-page/search-page';
import { NotFoundPage } from './pages/not-found-page/not-found-page';
import { userIdMatcher } from './routing/user-id-matcher';

export const routes: Routes = [
  {
    path: "feed",
    component: FeedPage,
  },
  {
    path: "log-in",
    component: LogInPage,
  },
  {
    path: "sign-up",
    component: SignUpPage,
  },
  {
    path: "search",
    component: SearchPage,
  },
  {
    path: "",
    redirectTo: "feed",
    pathMatch: "full",
  },
  {
    matcher: userIdMatcher,
    component: ProfilePage,
  },
  {
    path: "not-found",
    component: NotFoundPage,
  },
  {
    path: "**",
    redirectTo: "not-found",
  },
];
