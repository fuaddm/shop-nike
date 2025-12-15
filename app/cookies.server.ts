import { createCookie } from 'react-router';

export interface IUserCookie {
  publicToken?: string;
  privateToken?: string;
  rememberMeToken?: string;
}

export const userCookie = createCookie('user', {
  maxAge: 60 * 60 * 3,
});

export const themeCookie = createCookie('theme', {
  maxAge: 2_592_000,
});
