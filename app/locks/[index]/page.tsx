import { LockDetailScreen } from "@/components/locks/lock-detail-screen";

export default async function LockDetailPage({ params }: { params: Promise<{ index: string }> }) {
  const { index } = await params;
  return <LockDetailScreen index={Number(index)} />;
}


