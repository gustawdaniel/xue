type UserRole = "admin";

export interface User {
    id: string,
    email: string,
    avatar: string,
    name: string,
    roles: UserRole[],
    default_course_id: string | null
}

export const useUser = () => {
    return useCookie<User | null>("user");
};
