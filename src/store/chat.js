import { defineStore } from 'pinia';
import { dataBase } from '../firebase'; 
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  orderBy,
  serverTimestamp,
  getDocs,
  updateDoc,
  doc,
} from 'firebase/firestore';

export const useChatStore = defineStore('chat', {
  state: () => ({
    chats: [],
    messages: {}, 
    requests: [], 
  }),

  actions: {
    // Obtener chats para el usuario actual
    async fetchChats(userId) {
      const chatsRef = collection(dataBase, 'chats');
      const chatsQuery = query(chatsRef, where('participants', 'array-contains', userId));
      onSnapshot(chatsQuery, (snapshot) => {
        this.chats = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      });
    },

    // Obtener mensajes de un chat específico
    async fetchMessages(chatId) {
      const messagesRef = collection(dataBase, `chats/${chatId}/messages`);
      const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'), limit(50));
      onSnapshot(messagesQuery, (snapshot) => {
        this.messages[chatId] = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      });
    },

    // Obtener solicitudes de contacto recibidas
    async fetchRequests(userId) {
      const requestsRef = collection(dataBase, 'requests');
      const requestsQuery = query(requestsRef, where('receiverId', '==', userId), where('status', '==', 'pending'));
      onSnapshot(requestsQuery, (snapshot) => {
        this.requests = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      });
    },

    // Enviar mensaje a un chat
    async sendMessage(chatId, message) {
      const messagesRef = collection(dataBase, `chats/${chatId}/messages`);
      await addDoc(messagesRef, {
        sender: message.sender,
        content: message.content,
        timestamp: serverTimestamp(),
        isRead: false,
      });

      // Actualizar información del último mensaje en el chat
      const chatRef = doc(dataBase, 'chats', chatId);
      await updateDoc(chatRef, {
        lastMessage: message.content,
        lastUpdated: serverTimestamp(),
      });
    },

    // Crear un nuevo chat entre dos participantes
    async createChat(participant1, participant2) {
      const chatsRef = collection(dataBase, 'chats');
      const chatDoc = await addDoc(chatsRef, {
        participants: [participant1, participant2],
        lastMessage: '',
        lastUpdated: serverTimestamp(),
      });
      return chatDoc.id;
    },

    // Enviar solicitud de contacto
    async sendRequest(senderId, receiverId, senderName, receiverName) {
      const requestsRef = collection(dataBase, 'requests');
      const existingRequestQuery = query(
        requestsRef,
        where('senderId', '==', senderId),
        where('receiverId', '==', receiverId),
        where('status', '==', 'pending')
      );
    
      const existingRequests = await getDocs(existingRequestQuery);
      if (!existingRequests.empty) {
        throw new Error('Ya existe una solicitud pendiente.');
      }
    
      await addDoc(requestsRef, {
        senderId,
        receiverId,
        senderName,
        receiverName,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
    },

    // Aceptar una solicitud de contacto
    async acceptRequest(requestId, senderId, receiverId, senderName, receiverName) {
      const requestRef = doc(dataBase, 'requests', requestId);
    
      // Actualizar estado de la solicitud
      await updateDoc(requestRef, { status: 'accepted' });
    
      // Crear un nuevo chat con los nombres de los participantes
      const chatsRef = collection(dataBase, 'chats');
      const chatDoc = await addDoc(chatsRef, {
        participants: [senderId, receiverId],
        senderName, 
        receiverName, 
        lastMessage: '',
        lastUpdated: serverTimestamp(),
      });
    
      return chatDoc.id;
    },

    // Rechazar una solicitud de contacto
    async rejectRequest(requestId) {
      const requestRef = doc(dataBase, 'requests', requestId);
      await updateDoc(requestRef, { status: 'rejected' });
    },
  },
});
