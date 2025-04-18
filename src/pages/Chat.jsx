import StreamClientProvider from '@/components/StreamClientProvider';


const ChatPage = () => {
    return (
        <StreamClientProvider>
            <div>
                <h2>Chat App Connected to Stream!</h2>
            </div>
        </StreamClientProvider>
    );
};

export default ChatPage;
// // This is a placeholder for the ChatPage component.

