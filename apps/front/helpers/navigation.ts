export const navigation = [
  // { name: 'Home', href: '#', current: true },
  // { name: 'Profile', href: '#', current: false },
  // { name: 'Resources', href: '#', current: false },
  // { name: 'Company Directory', href: '#', current: false },
  // { name: 'Openings', href: '#', current: false },
];
export const userNavigation = [
  {
    name: "Your Profile",
    href: "/profile",
    private: true,
    class: "text-white bg-indigo-500 hover:bg-opacity-75",
  },
  {
    name: "Sign out",
    href: "/logout",
    private: true,
    class: "text-white bg-indigo-500 hover:bg-opacity-75",
  },
  // {name: 'Settings', href: '/settings', private: true},
  {
    name: "Login",
    href: "/login",
    private: false,
    class: "text-white bg-indigo-500 hover:bg-opacity-75",
    activeClass: "bg-opacity-75",
  },
  {
    name: "Register",
    href: "/register",
    private: false,
    class: "text-indigo-600 bg-white hover:bg-indigo-50",
    activeClass: "bg-indigo-50",
  },
];
