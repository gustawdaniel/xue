type UserRole = "admin";

export const useUser = () => {

  return useCookie<{
    id: string, email: string, avatar: string, name: string, roles: UserRole[]
  } | null>("user");
};
