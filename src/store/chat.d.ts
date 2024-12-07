import { Timestamp } from "firebase/firestore";

declare module '../store/chat' {
  export interface Chat {
    id: string;
    participants: string[]; 
    lastMessage: string;
    lastUpdated: Timestamp; 
  }

  // Tipo para un mensaje
  export interface Message {
    id: string;
    sender: string;
    content: string; 
    timestamp: Timestamp; 
    isRead: boolean; 
  }

  // Tipo para una solicitud de contacto
  export interface Request {
    id: string;
    senderId: string; 
    receiverId: string;
    status: 'pending' | 'accepted' | 'rejected'; 
    createdAt: Timestamp; 
  }

  export interface ChatStore {
    chats: Chat[];
    messages: Record<string, Message[]>; 
    requests: Request[]; 

    fetchChats(userId: string): Promise<void>;
    fetchMessages(chatId: string): Promise<void>;
    sendMessage(chatId: string, message: Omit<Message, 'id'>): Promise<void>;
    createChat(participant1: string, participant2: string): Promise<string>;
    sendRequest(senderId: string, receiverId: string): Promise<void>;
    fetchReceivedRequests(userId: string): Promise<void>;
    acceptRequest(requestId: string, senderId: string, receiverId: string): Promise<string>;
    rejectRequest(requestId: string): Promise<void>;
  }
}
