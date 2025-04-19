import { MessageTeam, useMessageContext } from 'stream-chat-react';

const TeamMessage = () => {
  const { message } = useMessageContext();

  return (
    <MessageTeam
      message={{
        ...message,
        user: message.user || {}, // fallback to avoid undefined
      }}
    />
  );
};

export default TeamMessage;
