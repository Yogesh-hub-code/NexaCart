export interface User {
  UserId: number;
  RoleId: number;
  FirstName: string;
  LastName: string;
  Email: string;
  PasswordHash: string;
  MobileNumber: string;
  ProfileImage: string;
  IsEmailVerified: boolean;
  IsActive: boolean;
  CreatedOn: Date;
  ModifiedOn: Date;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    userId: number;
    name: string;
    email: string;
  };
}
