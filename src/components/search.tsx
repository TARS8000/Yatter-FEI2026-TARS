"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { YweetCard } from "@/components/YweetCard";

type Yweet = {
  id: number;
  content: string;
  user: { username: string; avatar: string };
};

export function HeaderSearch() {
  const [query, setQuery] = useState("");
  const [yweets, setYweets] = useState<Yweet[]>([]);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const loadYweets = () => {
    const url = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!url) return;
    fetch(`${url}/v1/timelines/public`)
      .then((res) => res.json() as Promise<Yweet[]>)
      .then(setYweets)
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return yweets.filter((y) => y.content.toLowerCase().includes(q));
  }, [query, yweets]);

  return (
    <div ref={boxRef} className="relative">
      <input
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          setOpen(true);
          loadYweets();
        }}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        placeholder="検索"
        className="w-48 rounded-full border border-gray-300 bg-gray-50 px-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-64"
      />

      {open && query.trim() && (
        <div className="absolute left-1/2 top-full z-50 mt-2 w-96 max-w-[90vw] -translate-x-1/2 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
          <p className="border-b border-gray-200 px-4 py-2 text-sm text-gray-500">
            {results.length} 件の結果
          </p>
          <div className="max-h-[70vh] overflow-y-auto">
            {results.map((yweet) => (
              <YweetCard
                key={yweet.id}
                username={yweet.user.username}
                content={yweet.content}
                avatarUrl={yweet.user.avatar}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}