import { cookies } from "next/headers";
import Link from "next/link";
import { Timeline } from "@/components/Timeline";
import { ProfileFeed } from "@/components/ProfileFeed";
import { ProfileHeader } from "@/components/ProfileHeader";
import type { Yweet } from "@/types/yweet";
import type { User } from "@/types/user";
import {
  AUTH_COOKIE_KEY,
  parseUsernameCookieValue,
  toAuthenticationHeader,
} from "@/lib/authCookie";

type PageProps = {
  params: Promise<{ username: string }>;
};

type Relationship = {
  id: number;
  following: boolean;
  followed_by: boolean;
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

export default async function UserPage({ params }: PageProps) {
  const { username } = await params;

  const cookieStore = await cookies();
  const loginUsername = parseUsernameCookieValue(
    cookieStore.get(AUTH_COOKIE_KEY)?.value
  );

  const user = await getUser(username);
  const yweets = await getYweetsByUsername(username);

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

  let isFollowing = false;
  if (loginUsername && loginUsername !== username) {
    const relationshipRes = await fetch(
      `${baseUrl}/v1/users/relationships?username=${encodeURIComponent(username)}`,
      {
        cache: "no-store",
        headers: {
          Authentication: toAuthenticationHeader(loginUsername),
        },
      }
    );
    if (relationshipRes.ok) {
      const relationships = (await relationshipRes.json()) as Relationship[];
      isFollowing = relationships[0]?.following ?? false;
    }
  }

  return (
    <Timeline>
      <ProfileHeader user={user} initialFollowing={isFollowing} />
      <ProfileFeed initialYweets={yweets} />
    </Timeline>
  );
}