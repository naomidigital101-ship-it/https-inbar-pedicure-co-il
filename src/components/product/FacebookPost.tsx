import { Facebook, ExternalLink } from "lucide-react";
import type { CommunityPost } from "@/lib/products";

export function FacebookPost({ post }: { post: CommunityPost }) {
  return (
    <article className="border border-[#222] bg-[#111] p-6">
      <header className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center bg-[#1877f2]/10 text-[#1877f2]">
          <Facebook className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-[#f0f0f0]">{post.author}</p>
          <p className="text-xs text-[#a0a0a0]">{post.date}</p>
        </div>
      </header>
      <blockquote className="mb-4 text-base leading-loose text-[#ccc]">
        "{post.quote}"
      </blockquote>
      <a
        href={post.url}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#e63000] hover:underline"
      >
        קרא את הפוסט המקורי
        <ExternalLink className="h-3 w-3" />
      </a>
    </article>
  );
}