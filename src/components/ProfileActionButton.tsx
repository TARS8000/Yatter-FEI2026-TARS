"use client";

import { useState } from "react";
import { useAuth } from "@/auth/AuthProvider";
import { Button } from "@/components/Button";

type Relationship = {
  id: number;
  following: boolean;
  followed_by: boolean;
};

type ProfileActionButtonProps = {
  username: string;
  initialFollowing: boolean;
  /** フォロー状態が変わったことを親に伝える */
  onFollowChange: (following: boolean) => void;
};

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export function ProfileActionButton({
  username,
  initialFollowing,
  onFollowChange,
}: ProfileActionButtonProps) {
  const { user, getAuthenticationHeader } = useAuth();
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user || user.username === username) {
    return null;
  }

  async function handleClick() {
    const authentication = getAuthenticationHeader();
    if (!authentication) return;

    const action = isFollowing ? "unfollow" : "follow";
    setIsSubmitting(true);
    try {
      const res = await fetch(
        `${baseUrl}/v1/users/${encodeURIComponent(username)}/${action}`,
        {
          method: "POST",
          headers: {
            Authentication: authentication,
          },
        }
      );
      if (!res.ok) {
        console.error("フォロー操作に失敗", res.status, await res.text());
        return;
      }
      const relationship = (await res.json()) as Relationship;
      setIsFollowing(relationship.following);
      onFollowChange(relationship.following);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isFollowing) {
    return (
      <Button
        type="button"
        className="border border-gray-300 !bg-white !text-gray-900 hover:!bg-gray-50"
        disabled={isSubmitting}
        onClick={handleClick}
      >
        フォロー中
      </Button>
    );
  }

  return (
    <Button type="button" disabled={isSubmitting} onClick={handleClick}>
      フォロー
    </Button>
  );
}