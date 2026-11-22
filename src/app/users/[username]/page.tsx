import { cookies } from "next/headers";
import Link from "next/link";
import { Timeline } from "@/components/Timeline";
import type { Yweet } from "@/types/yweet";
import { ProfileFeed } from "@/components/ProfileFeed";
import { ProfileActionButton } from "@/components/ProfileActionButton";
import {
  AUTH_COOKIE_KEY,
  parseUsernameCookieValue,
  toAuthenticationHeader,
} from "@/lib/authCookie";

type User = {
  id: number;
  username: string;
  display_name: string;
  note: string;
  avatar: string;
  header: string;
  followers_count: number;
  following_count: number;
};

type PageProps = {
  params: Promise<{ username: string }>;
};

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

async function getUser(username: string) {
  const res = await fetch(`${baseUrl}/v1/users/${username}`, {
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("user fetch failed");
  return (await res.json()) as User;
}

async function getYweetsByUsername(username: string) {
  const res = await fetch(`${baseUrl}/v1/users/${username}/yweets`, {
    cache: "no-store",
  });
  if (!res.ok) return [] as Yweet[];
  return (await res.json()) as Yweet[];
}

async function getIsFollowing(me: string | null, target: string) {
  if (!me || me === target) return false;

  const res = await fetch(
    `${baseUrl}/v1/users/relationships?username=${encodeURIComponent(target)}`,
    {
      headers: { Authentication: toAuthenticationHeader(me) },
      cache: "no-store",
    }
  );
  if (!res.ok) return false;
  const data = (await res.json()) as { following: boolean }[];
  return data[0]?.following ?? false;
}

export default async function UserPage({ params }: PageProps) {
  const { username } = await params;

  const cookieStore = await cookies();
  const me = parseUsernameCookieValue(cookieStore.get(AUTH_COOKIE_KEY)?.value);

  const [user, yweets, isFollowing] = await Promise.all([
    getUser(username),
    getYweetsByUsername(username),
    getIsFollowing(me, username),
  ]);

  if (!user) {
    return (
      <Timeline>
        <div className="px-4 py-8 text-center">
          <p className="text-sm text-gray-500">
            ユーザーが見つかりませんでした
          </p>
          <p className="mt-4">
            <Link href="/" className="text-sm text-blue-500 hover:underline">
              トップへ戻る
            </Link>
          </p>
        </div>
      </Timeline>
    );
  }

  return (
    <Timeline>
      <div className="border-b border-gray-200">
        {user.header ? (
          <img
            src={user.header}
            alt=""
            className="h-36 w-full object-cover"
          />
        ) : (
          <div className="h-36 w-full bg-gray-200" />
        )}
        <div className="px-4 pb-4">
          <div className="flex items-start justify-between">
            <img
              src={
                user.avatar && user.avatar.length > 0
                  ? user.avatar
                  : "/avatar-default.svg"
              }
              alt=""
              width={80}
              height={80}
              className="-mt-10 h-20 w-20 rounded-full border-4 border-white object-cover"
            />
            <div className="pt-3">
              <ProfileActionButton
                username={user.username}
                initialIsFollowing={isFollowing}
              />
            </div>
          </div>
          <p className="mt-2 text-xl font-bold text-gray-900">
            {user.display_name || `@${user.username}`}
          </p>
          <p className="text-sm text-gray-500">@{user.username}</p>
          {user.note ? (
            <p className="mt-3 whitespace-pre-wrap break-words text-sm text-gray-800">
              {user.note}
            </p>
          ) : null}
          <p className="mt-3 text-sm text-gray-500">
            <span className="font-bold text-gray-900">
              {user.following_count}
            </span>{" "}
            フォロー
            <span className="ml-4 font-bold text-gray-900">
              {user.followers_count}
            </span>{" "}
            フォロワー
          </p>
        </div>
      </div>
      <ProfileFeed initialYweets={yweets} />
    </Timeline>
  );
}