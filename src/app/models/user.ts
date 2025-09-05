export type User = {
  id: number;
  login: string;
  name: string;
  avatar: string;
  subscriptions: number[];
}

export type UserData = {
    login: string;
    password: string;
}