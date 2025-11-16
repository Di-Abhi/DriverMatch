// src/types/auth.ts

export interface UserDetails {
  id: string;
  email: string;
  name?: string;
  role?: 'user' | 'driver';
}

export interface AuthSuccessResponse {
  userDetails: UserDetails;
  // Add other properties here
  token: string; 
}

export interface GoogleAuthResponse {
  credential: string; // The ID Token
  // other properties...
}

export interface SetUserAction {
  type: "SET_USER";
  payload: UserDetails;
}

// You can also define the Dispatch type here
export type AppDispatch = (action: SetUserAction) => void;