"use client";

import { useState } from "react";
import { YweetCard } from "@/components/YweetCard";
import type { Yweet } from "@/types/yweet";
import { PostYweetForm } from "@/components/PostYweetForm";
import { useAuth } from "@/auth/AuthProvider";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Timeline } from "@/components/Timeline";

type ProfileFeedProps = {
  initialYweets: Yweet[];
};

export function ProfileFeed({ initialYweets }: ProfileFeedProps) {
  const [yweets, setYweets] = useState<Yweet[]>(initialYweets);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { user, getAuthenticationHeader } = useAuth();
  const isLoggedIn = !!user;
  const isOpen = deletingId !== null;

  function handlePosted(created: Yweet) {
    setYweets((prev) => [created, ...prev]);
  }

  function handleDeleteClick(id: number) {
    setDeletingId(id);
  }

  function handleCancel() {
    setDeletingId(null);
  }

  async function handleConfirm() {
    if (deletingId === null) return;

    const authentication = getAuthenticationHeader();
    if (!authentication) {
      setDeletingId(null);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/yweets/${deletingId}`,
        {
          method: "DELETE",
          headers: {
            Authentication: authentication,
          },
        }
      );

      if (!res.ok) {
        throw new Error("削除に失敗しました");
      }

      setYweets((prev: Yweet[]) =>
        prev.filter((yweet: Yweet) => yweet.id !== deletingId)
      );
      setDeletingId(null);
    } catch {
      setDeletingId(null);
    }
  }

  return (
    <Timeline>
      {yweets.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-gray-500">
          まだ Yweet がありません
        </p>
      ) : (
        yweets.map((yweet) => {
          const isOwn = user?.username === yweet.user.username;

          return (
            <YweetCard
              key={yweet.id}
              username={yweet.user.username}
              content={yweet.content}
              avatarUrl={yweet.user.avatar}
              onDelete={isOwn ? () => handleDeleteClick(yweet.id) : undefined}
            />
          );
        })
      )}
      <ConfirmDialog
        isOpen={isOpen}
        message="この Yweet を削除しますか？"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </Timeline>
  );
}