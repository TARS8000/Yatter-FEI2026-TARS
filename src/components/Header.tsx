import Link from "next/link";
import type { ReactNode } from "react";
import {HeaderSearch} from "@/components/search";

type HeaderProps = {
  /** 右側（ログイン／ログアウトなど）。HeaderNav などから渡す */
  children?: ReactNode;
};

/**
 * 全ページ共通ヘッダー（見た目用）
 * 右側の中身は children で受け取る（ロジックは HeaderNav 側）
 */
export function Header({ children }: HeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto grid h-14 max-w-2xl grid-cols-[1fr_minmax(0,18rem)_1fr] items-center gap-4 px-4">
        <Link
          href="/"
          className="justify-self-start text-xl font-bold text-blue-500"
        >
          Yatter
        </Link>
        <HeaderSearch />
        <div className="flex items-center gap-2 justify-self-end">
          {children}
        </div>
      </div>
    </header>
  );
}

