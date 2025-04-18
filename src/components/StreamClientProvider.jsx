import { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import {Chat } from 'stream-chat-react';
import Cookies from 'universal-cookies';

import 'stream-chat-react/dist/css/v2/index.css';

const apiKey = import.meta.env.VITE_STREAM_API_KEY;
const client = StreamChat.getInstance(apiKey);
const cookies = new Cookies();

const StreamClientProvider = ({ children }) => {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const connectUser = async () => {
            const token = cookies.get('token');

            if (!token) return;

            await client.connectUser(
                {
                    id: cookies.get('userId'),
                    name: cookies.get('username'),
                    fullName: cookies.get('fullName'),
                    image: cookies.get('avatarURL'),
                    hashedPassword: cookies.get('hashedPassword'),
                    phoneNumber: cookies.get('PhoneNumber'),
                },
                token
            );
            setIsReady(true);
        };
        connectUser();

        return () => {
            if (client) client.disconnectUser();
        };
    }
    , []);

    if (!isReady) return <div> Loading chat...</div>;

    return <Chat client={client} theme="team light">{children}</Chat>;

};

export default StreamClientProvider;