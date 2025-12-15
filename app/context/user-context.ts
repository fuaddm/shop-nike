import { createContext } from 'react-router';

import type { IUserData } from '@models/store/userStore';

interface IUserContext {
  isAuth: boolean;
  userData?: IUserData | null;
}

export const userContext = createContext<IUserContext | null>(null);
