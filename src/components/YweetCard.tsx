import Link from "next/link";

type YweetCardProps = {
  username: string;
  content: string;
  avatarUrl?: string;
  onDelete?: () => void;
};

export function YweetCard({
  username,
  content,
  avatarUrl,
  onDelete,
}: YweetCardProps) {
  const src = avatarUrl && avatarUrl.length > 0 ? avatarUrl : "/avatar-default.svg";

  return (
    <article className="border-b border-gray-200 bg-white px-4 py-3">
      <div className="flex gap-3">
        <img
          src={src}
          alt=""
          width={40}
          height={40}
          className="h-10 w-10 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <Link href={`/users/${username}`} className="truncate font-bold text-gray-900">@{username}</Link>
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="shrink-0 rounded px-2 py-1 text-sm text-red-500 hover:bg-red-50"
              >
                削除
              </button>
            )}
          </div>
          <p className="mt-1 whitespace-pre-wrap break-words text-gray-800">
            {content}
          </p>
        </div>
      </div>
    </article>
  );
}