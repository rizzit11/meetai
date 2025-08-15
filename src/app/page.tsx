"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const { data: session } = authClient.useSession();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const onSubmit = () => {
    authClient.signUp.email(
      {
        name,
        email,
        password,
      },
      {
        onError: () => {
          window.alert("Something Went Wrong");
        },
        onSuccess: () => {
          window.alert("Success");
        },
      },
    );
  };

  const onLogin = () => {
    authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onError: () => {
          window.alert("Something Went Wrong");
        },
        onSuccess: () => {
          window.alert("Success");
        },
      },
    );
  };

  if (session) {
    return (
      <div className="flex flex-col p-4 gap-y-4">
        <p>Logged In As: {session.user.name}</p>
        <Button onClick={() => authClient.signOut()}>Sign Out</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-10">
      <div className="p-4 flex flex-col gap-y-4">
        <Input type="text" placeholder="name" value={name} onChange={(e) => setName(e.target.value)}/>
        <Input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        <Button onClick={onSubmit}>Create User</Button>
      </div>
      <div className="p-4 flex flex-col gap-y-4">
        <Input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
        <Input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        <Button onClick={onLogin}>Login</Button>
      </div>
    </div>
  );
}