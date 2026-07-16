export interface LoginResponse {

  success: boolean;

  message: string;

  token: string;

  expires: string;

  user: {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    roleId: number;
    roleName: string;
  };

}