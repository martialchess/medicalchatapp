import { Avatar, useChatContext } from 'stream-chat-react';

const ResultsDropdown = ({
  teamChannels,
  directChannels,
  focusedId,
  loading,
  setChannel,
  setToggleContainer,
}) => {
  const { client, setActiveChannel } = useChatContext();

  const selectChannel = async (channel) => {
    if (channel.type === 'user') {
      const filters = {
        type: 'messaging',
        member_count: 2,
        members: { $eq: [client.user.id, channel.id] },
      };

      const [existingChannel] = await client.queryChannels(filters);

      if (existingChannel) {
        setActiveChannel(existingChannel);
        return;
      }

      const newChannel = client.channel('messaging', {
        members: [client.user.id, channel.id],
      });

      await newChannel.create();
      setActiveChannel(newChannel);
      setChannel(newChannel);
    } else {
      setChannel(channel);
      setActiveChannel(channel);
    }

    if (setToggleContainer) setToggleContainer((prev) => !prev);
  };

  const renderResult = (channel, i, type) => {
    const isFocused = focusedId === channel.id;
    const containerClass = isFocused
      ? 'channel-search__result-container__focused'
      : 'channel-search__result-container';

    if (type === 'channel') {
      return (
        <div
          key={i}
          onClick={() => selectChannel(channel)}
          className={containerClass}
        >
          <div className="result-hashtag">#</div>
          <p className="channel-search__result-text">{channel?.data?.name}</p>
        </div>
      );
    }

    return (
      <div
        key={i}
        onClick={() => selectChannel(channel)}
        className={containerClass}
      >
        <div className="channel-search__result-user">
          <Avatar
            image={channel.image || undefined}
            name={channel.name}
            size={24}
          />
          <p className="channel-search__result-text">{channel.name}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="channel-search__results">
      <p className="channel-search__results-header">Channels</p>
      {loading && !teamChannels.length && (
        <p className="channel-search__results-header">
          <i>Loading...</i>
        </p>
      )}
      {!loading && !teamChannels.length ? (
        <p className="channel-search__results-header">
          <i>No channels found</i>
        </p>
      ) : (
        teamChannels?.map((channel, i) =>
          renderResult(channel, i, 'channel')
        )
      )}

      <p className="channel-search__results-header">Users</p>
      {loading && !directChannels.length && (
        <p className="channel-search__results-header">
          <i>Loading...</i>
        </p>
      )}
      {!loading && !directChannels.length ? (
        <p className="channel-search__results-header">
          <i>No direct messages found</i>
        </p>
      ) : (
        directChannels?.map((user, i) => renderResult(user, i, 'user'))
      )}
    </div>
  );
};

export default ResultsDropdown;
