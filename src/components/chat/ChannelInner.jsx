import {
    Avatar,
    MessageInput,
    MessageList,
    Thread,
    Window,
    useChannelActionContext,
    useChannelStateContext,
    useChatContext,
  } from 'stream-chat-react';
  
  import { ChannelInfo } from '@/components/shared';
  import { useState, createContext } from 'react';
  
  export const GiphyContext = createContext({});
  
  const ChannelInner = ({ setIsEditing }) => {
    const [giphyState, setGiphyState] = useState(false);
    const { sendMessage } = useChannelActionContext();
  
    const overrideSubmitHandler = (message) => {
      let updatedMessage = {
        attachments: message.attachments,
        mentioned_users: message.mentioned_users,
        parent_id: message.parent?.id,
        parent: message.parent,
        text: message.text,
      };
  
      if (giphyState) {
        updatedMessage = {
          ...updatedMessage,
          text: `/giphy ${message.text}`,
        };
      }
  
      if (sendMessage) {
        sendMessage(updatedMessage);
        setGiphyState(false);
      }
    };
  
    return (
      <GiphyContext.Provider value={{ giphyState, setGiphyState }}>
        <div style={{ display: 'flex', width: '100%' }}>
          <Window>
            <TeamChannelHeader setIsEditing={setIsEditing} />
            <MessageList />
            <MessageInput overrideSubmitHandler={overrideSubmitHandler} />
          </Window>
          <Thread />
        </div>
      </GiphyContext.Provider>
    );
  };
  
  const TeamChannelHeader = ({ setIsEditing }) => {
    const { channel, watcher_count } = useChannelStateContext();
    const { client } = useChatContext();
  
    const MessagingHeader = () => {
      const members = Object.values(channel.state.members).filter(
        ({ user }) => user.id !== client.user.id
      );
  
      const additional = members.length - 3;
  
      return (
        <div className="team-channel-header__name-wrapper">
          {members.map(({ user }, i) => (
            <div key={i} className="team-channel-header__name-multi">
              <Avatar image={user.image} name={user.fullName || user.id} size={32} />
              <p className="team-channel-header__name user">
                {user.fullName || user.id}
              </p>
            </div>
          ))}
          {additional > 0 && (
            <p className="team-channel-header__name user">and {additional} more</p>
          )}
        </div>
      );
    };
  
    return (
      <div className="team-channel-header__container">
        {channel?.type === 'messaging' ? (
          <MessagingHeader />
        ) : (
          <div className="team-channel-header__channel-wrapper">
            <p className="team-channel-header__name"># {channel?.data?.name}</p>
            <span onClick={() => setIsEditing(true)} style={{ display: 'flex' }}>
              <ChannelInfo />
            </span>
          </div>
        )}
        <div className="team-channel-header__right">
          <p className="team-channel-header__right-text">
            {watcher_count === 1
              ? '1 user online'
              : `${watcher_count || 0} users online`}
          </p>
        </div>
      </div>
    );
  };
  
  export default ChannelInner;
  