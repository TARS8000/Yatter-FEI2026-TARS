// src/app/login/page.tsx

"use client";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useRouter } from "next/navigation";
import { useAuth } from "@/auth/AuthProvider";
import { useState } from "react";
import Link from "next/link";

export default function Page() {
  const { login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);    

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    }
  );

    if (!res.ok) {
    setError("ログインに失敗しました。");
    // エラー表示など
    return;
    }

    // ログイン成功時の処理
    const data = (await res.json()) as { username: string };
    console.log(data);

    // 空チェック ...

    try {
      await login(username, password);
      router.push("/");
    } catch {
    setError("ログインに失敗しました。");
    return;
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-sm flex-col justify-center px-4">
      <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
        ログイン
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        {error && (
          <p
            role="alert"
            id="login-error"
            className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {error}
          </p>
        )}
        <label className="flex flex-col gap-1 text-sm text-gray-700">
          ユーザー名
          <Input
            type="text"
            name="username"
            placeholder="john"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-gray-700" >
          パスワード
          <Input
            type="password"
            name="password"
            placeholder="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <Button type="submit" className="w-full">
          ログイン
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
      アカウントがない場合は{" "}
      <Link href="/signup" className="text-blue-500 hover:underline">
      新規登録
      </Link>
    </p>
    </div>
  );
}
