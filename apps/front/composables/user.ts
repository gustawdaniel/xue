type UserRole = "admin";

export interface User {
  id: string, email: string, avatar: string, name: string, roles: UserRole[]
}

export const useUser = () => {
  return useCookie<User | null>("user");
};
