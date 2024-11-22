import GroupChat from "@/components/GroupChat";

export default function GroupChatPage({ groupId }) {
  return (
    <div>
      <GroupChat group={{ gid: groupId }} handleBack={() => window.history.back()} />
    </div>
  );
}

export async function getServerSideProps(context) {
  const { groupId } = context.params;

  if (!groupId) {
    return {
      notFound: true, 
    };
  }

  return {
    props: {
      groupId,
    },
  };
}
