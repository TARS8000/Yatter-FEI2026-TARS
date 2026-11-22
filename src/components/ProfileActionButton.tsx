"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/auth/AuthProvider";
import { Button } from "@/components/Button";

type ProfileActionButtonProps = {
  username: string;
  initialIsFollowing: boolean;
};

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export function ProfileActionButton({
  username,
  initialIsFollowing,
}: ProfileActionButtonProps) {
  const { user, getAuthenticationHeader } = useAuth();
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);

  if (!user || user.username === username) {
    return null;
  }

  async function handleClick() {
    const auth = getAuthenticationHeader();
    if (!auth) return;

    setLoading(true);
    const action = isFollowing ? "unfollow" : "follow";
    const res = await fetch(
      `${baseUrl}/v1/users/${encodeURIComponent(username)}/${action}`,
      {
        method: "POST",
        headers: { Authentication: auth },
      }
    );
    setLoading(false);

    if (!res.ok) {
      console.error("フォロー操作に失敗", res.status, await res.text());
      return;
    }

    setIsFollowing(!isFollowing);
    router.refresh();
  }

  return (
    <Button type="button" onClick={handleClick} disabled={loading}>
      {isFollowing ? "フォロー解除" : "フォロー"}
    </Button>
  );
}