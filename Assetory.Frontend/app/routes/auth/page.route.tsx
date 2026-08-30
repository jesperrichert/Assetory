import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Login } from "~/components/custom/auth/login.component";
import { Oidc } from "~/components/custom/auth/oidc.component";
import { Register } from "~/components/custom/auth/register.component";

export default function AuthPage() {
  const [tab, setTab] = useState<"register" | "login">("login");
  // const [message, setMessage] = useState<string>();
  const [showRegister, setShowRegister] = useState<string>("false");

  useEffect(() => {
    async function config() {
      const res = await fetch("/api/auth/config");
      if (res.status != 200) return setShowRegister("false");
      const json = await res.json();
      setShowRegister(json.showRegister);
    }
    config();
    handleAuthCallback();
    if (Cookies.get("session") != undefined) window.open("/", "_self");
  });

  const handleAuthCallback = () => {
    if (!document.location.search.includes("?success=")) return;
    let params = new URL(document.location.toString()).searchParams;
    const success = params.get("success");
    const details = params.get("details") as string;
    if (success) Cookies.set("session", details);
  };

  return (
    <>
      <div className="h-screen flex flex-col justify-center items-center">
        <div className="flex flex-col">
          <span className="flex flex-row">
            <button
              className="border-2 p-2 cursor-pointer"
              onClick={() => setTab("login")}
            >
              Login
            </button>
            {showRegister == "true" ? (
              <button
                className="border-2 p-2 cursor-pointer"
                onClick={() => setTab("register")}
              >
                Register
              </button>
            ) : (
              <></>
            )}
          </span>
          <div className="flex flex-col border-2 p-2">
            {tab == "login" ? (
              <Login></Login>
            ) : tab == "register" ? (
              showRegister == "true" ? (
                <Register></Register>
              ) : (
                <></>
              )
            ) : (
              <span>No tab found.</span>
            )}
          </div>
        </div>
        <hr className="p-2"></hr>
        <span>
          <Oidc></Oidc>
        </span>
      </div>
    </>
  );
}
