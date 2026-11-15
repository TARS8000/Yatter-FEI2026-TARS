import { Timeline } from "@/components/Timeline";
import { YweetCard } from "@/components/YweetCard";

// src/app/page.tsx

type Yweet = {
  id: number;
  content: string;
  user: {
    username: string;
    avatar: string;
  };
};

type TimelineResponse = Yweet[];

const url = process.env.NEXT_PUBLIC_API_BASE_URL;

export default async function Home() {
  const data = await fetch(url + "/v1/timelines/public");

  // 確認する
  console.log(data);

  const yweets = (await data.json()) as TimelineResponse;

  console.log(yweets);

  return (
    <>
      {yweets.map((yweet) => (
        <YweetCard
          key={yweet.id}
          username={yweet.user.username}
          content={yweet.content}
          avatarUrl={yweet.user.avatar}
        />
      ))}
    </>
  );
}
