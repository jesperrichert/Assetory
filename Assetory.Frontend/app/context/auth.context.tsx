import { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

export type AuthToken = string | null;
export type UserDto = {
  username: string;
  isOidc: string;
} | null;

export type UserSession = {
  session: AuthToken;
  user: UserDto;
};

export const AuthContext = createContext<UserSession | null>(null);

export function Auth({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthToken | null>(null);
  const [user, setUser] = useState<UserDto | null>(null);

  useEffect(() => {
    if (window.location.href.split("/").includes("auth")) return;
    const cookie = Cookies.get("session");
    setAuth(cookie as string);

    async function me() {
      const data = await fetch("/api/auth/@me", {
        headers: {
          Authorization: cookie ?? "",
        },
      });
      if (data.status != 200) {
        Cookies.remove("session")
        window.open("/auth", "_self");
      }
      const res = await data.json();
      const userDto = res.data;
      setUser(userDto);
    }
    me();
  }, []);

  return (
    <AuthContext value={{ session: auth, user: user }}>{children}</AuthContext>
  );
}
