<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Mensajes</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content>
        <!-- Sección de solicitudes pendientes -->
        <ion-list>
          <ion-list-header>
            <h3>Solicitudes Pendientes</h3>
          </ion-list-header>
          <ion-item v-for="request in requests" :key="request.id">
            <ion-label>
              <h2>{{ request.senderName }}</h2>
              <p>Quiere iniciar un chat contigo.</p>
            </ion-label>
            <ion-button color="success" @click="acceptRequest(request.id, request.senderId, request.receiverId, request.senderName, request.receiverName)">Aceptar</ion-button>
            <ion-button color="danger" @click="rejectRequest(request.id)">Rechazar</ion-button>
          </ion-item>
        </ion-list>
  
        <!-- Sección de chats activos -->
        <ion-list>
          <ion-list-header>
            <h3>Chats Activos</h3>
          </ion-list-header>
          <ion-item v-for="chat in chats" :key="chat.id" @click="openChat(chat.id)">
            <ion-label>
              <h2>{{ getParticipantName(chat) }}</h2>
              <p>{{ chat.lastMessage }}</p>
            </ion-label>
            <ion-badge v-if="hasUnreadMessages(chat.id)" color="primary">Nuevo</ion-badge>
          </ion-item>
        </ion-list>
      </ion-content>
    </ion-page>
  </template>
  
  <script>
  import { ref, computed, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { useChatStore } from "../store/chat";
  import { auth } from "@/firebase";
  
  export default {
    setup() {
      const chatStore = useChatStore();
      const router = useRouter();
      const userId = ref(null);
      const chats = computed(() => chatStore.chats);
      const requests = computed(() => chatStore.requests);
  
      const fetchUserId = async () => {
        const currentUser = auth.currentUser;
        if (currentUser) {
          userId.value = currentUser.uid;
          await chatStore.fetchChats(userId.value);
          await chatStore.fetchRequests(userId.value);
        } else {
          console.error("Usuario no autenticado");
        }
      };
  
      const acceptRequest = async (requestId, senderId, receiverId, senderName, receiverName) => {
        try {
          await chatStore.acceptRequest(requestId, senderId, receiverId, senderName, receiverName);
        } catch (error) {
          console.error("Error al aceptar la solicitud:", error);
        }
      };
  
      const rejectRequest = async (requestId) => {
        try {
          await chatStore.rejectRequest(requestId);
        } catch (error) {
          console.error("Error al rechazar la solicitud:", error);
        }
      };
  
      const getParticipantName = (chat) => {
        return chat.senderId === userId.value ? chat.receiverName : chat.senderName;
      };
  
      const hasUnreadMessages = (chatId) => {
        const chat = chatStore.chats.find((c) => c.id === chatId);
        return chat && chat.unreadMessages > 0;
      };
  
      const openChat = (chatId) => {
  router.push({ name: "ChatWindow", params: { chatId } }).catch((err) => {
    console.error("Error en router.push:", err);
  });
};
  
      onMounted(fetchUserId);
  
      return {
        chats,
        requests,
        getParticipantName,
        hasUnreadMessages,
        openChat,
        acceptRequest,
        rejectRequest,
      };
    },
  };
  </script>
  
  <style scoped>
  ion-item {
    cursor: pointer;
  }
  ion-badge {
    margin-left: 8px;
  }
  </style>
  