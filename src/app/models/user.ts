export type User = {
  id: number;
  login: string;
  name: string;
  about: string;
  avatar: string;
  subscriptions: number[];
}

export type UserData = {
    login: string;
    password: string;
}