export interface IUserData {
  data: {
    email: string;
    password: string;
    City: string | null;
    'Country/Region': string | null;
    Postcode: string | null;
    Province: string | null;
    State: string | null;
    birth_date: string | null;
    phone_number: string | null;
  };
  result: {
    status: number;
    error: boolean;
    errorMsg: null;
    time: number;
  };
}

export interface IUserStore {
  userData: IUserData | null;
  setUserData: (userData: IUserData | null) => void;
}
