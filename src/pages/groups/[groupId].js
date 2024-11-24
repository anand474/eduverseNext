import { useRouter } from "next/router";
import GroupChat from "@/components/GroupChat";

export default function GroupChatPage() {
  const router = useRouter();
  const { groupId } = router.query;

  if (!groupId) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <GroupChat group={{ gid: groupId }} handleBack={() => window.history.back()} />
    </div>
  );
}