import { Routes } from '@angular/router';
import { FeedPage } from './pages/feed-page/feed-page';
import { LogInPage } from './pages/log-in-page/log-in-page';
import { SignUpPage } from './pages/sign-up-page/sign-up-page';
import { ProfilePage } from './pages/profile-page/profile-page';

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
        path: "",
        redirectTo: "feed",
        pathMatch: 'full',
    },
    {
        path: ":user_id",
        component: ProfilePage
    },
];
