import { Timeline } from "@/components/Timeline";
import type { Yweet } from "@/types/yweet";
import { PostYweetForm } from "@/components/PostYweetForm";
import { TimelineFeed } from "@/components/TimelineFeed";

const url = process.env.NEXT_PUBLIC_API_BASE_URL;

export default async function Home() {
  const data = await fetch(url + "/v1/timelines/public");

  // 確認する
  console.log(data);

  const yweets = (await data.json()) as Yweet[];

  console.log(yweets);

  return (
    <Timeline>
      <TimelineFeed initialYweets={yweets} />
    </Timeline>
  );
}
