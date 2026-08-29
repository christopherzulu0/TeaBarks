import {
  AtSign,
  BookOpen,
  Camera,
  FileText,
  Megaphone,
  MessagesSquare,
  Mic,
  MonitorPlay,
  Music2,
  Quote,
  Radio,
  ThumbsUp,
  type LucideIcon,
} from "lucide-react";
import type { SourcePlatform } from "@/lib/types";
import { cn } from "@/lib/utils";

const icons: Record<SourcePlatform, LucideIcon> = {
  youtube: MonitorPlay,
  tiktok: Music2,
  instagram: Camera,
  facebook: ThumbsUp,
  x: AtSign,
  podcast: Mic,
  article: FileText,
  book: BookOpen,
  interview: MessagesSquare,
  speech: Megaphone,
  livestream: Radio,
  statement: Quote,
};

export function PlatformIcon({
  platform,
  className,
}: {
  platform: SourcePlatform;
  className?: string;
}) {
  const Icon = icons[platform] ?? FileText;
  return <Icon className={cn("size-4", className)} aria-hidden />;
}
