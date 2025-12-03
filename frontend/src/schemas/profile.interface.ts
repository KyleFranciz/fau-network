export interface UserProfileDisplay {
  id: string;
  name: string;
  email: string;
  profileImage: string;
  headline: string;
  website: string;
  bio: string;
  attended: number;
  admin?: boolean;
}