import { useState } from "react";

export function Login() {
  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  const onSubmit = async () => {
    if (username == null && password == null) return;
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    if (res.status != 200) return;
    window.location.href = res.url;
  };

  return (
    <>
      <form>
        <div className="p-5 flex flex-col">
          <span>Username</span>
          <input
            onChange={(e) => setUsername(e.target.value)}
            className="border-2 border-zinc-600 ring-0 outline-0 p-1"
            type="text"
            placeholder="your username"
          ></input>
        </div>
        <div className="p-5 flex flex-col">
          <span>Password</span>
          <input
            onChange={(e) => setPassword(e.target.value)}
            className="border-2 border-zinc-600 ring-0 outline-0 p-1"
            type="password"
          ></input>
          <div className="mt-5">
            <button
              type="button"
              onClick={() => onSubmit()}
              className="border-2 p-2 cursor-pointer"
            >
              Login
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
