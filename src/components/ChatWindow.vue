<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="$router.push('/tabs/Messages')">
            <ion-icon name="arrow-back-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Chat</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="messages-container">
        <div
          v-for="{ id, content, sender, timestamp } in chatMessages"
          :key="id"
          class="message"
          :class="{ 'outgoing': sender === user?.uid }"
        >
          <p>{{ content }}</p>
          <span class="timestamp">{{ formatTimestamp(timestamp) }}</span>
        </div>
        <div ref="bottom"></div>
      </div>
    </ion-content>

    <ion-footer>
      <ion-toolbar>
        <ion-item>
          <ion-input
            v-model="newMessage"
            placeholder="Escribe un mensaje..."
            required
            @keyup.enter="sendMessage"
          ></ion-input>
          <ion-button slot="end" @click="sendMessage" color="primary">
            Enviar
          </ion-button>
        </ion-item>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script>
import { ref, onMounted, nextTick } from "vue";

export default {
  name: "ChatWindow",
  props: {
    chatId: {
      type: String,
      required: true,
    },
  },
  setup() {
    const user = ref({ uid: "12345" });
    const chatMessages = ref([]);
    const newMessage = ref("");
    const bottom = ref(null);

    const scrollToBottom = () => {
      nextTick(() => {
        bottom.value?.scrollIntoView({ behavior: "smooth" });
      });
    };

    const botResponses = [
      "¡Bienvenido a ModelaME! ¿Sabías que puedes buscar modelos con filtros personalizados?",
      "¿Ya probaste publicar un casting? Es muy sencillo desde la vista de publicación.",
      "Recuerda que puedes contactar modelos directamente para coordinar tus proyectos.",
      "¿Sabías que los perfiles de modelo incluyen reseñas de otros contratantes? Esto te ayuda a tomar mejores decisiones.",
      "Si necesitas ayuda, siempre puedes escribirnos aquí. ¡Estamos para ayudarte!",
    ];

    const sendMessage = () => {
      if (!newMessage.value.trim()) return;

      chatMessages.value.push({
        id: Date.now(),
        sender: user.value.uid,
        content: newMessage.value.trim(),
        timestamp: new Date(),
      });

      newMessage.value = ""; 

      scrollToBottom();

      const botReply = botResponses[Math.floor(Math.random() * botResponses.length)];
      setTimeout(() => {
        chatMessages.value.push({
          id: Date.now() + 1,
          sender: "bot",
          content: botReply,
          timestamp: new Date(),
        });
        scrollToBottom();
      }, 1000);
    };

    onMounted(() => {
      chatMessages.value = [
        {
          id: 1,
          sender: "bot",
          content: "Hola, ¿cómo podemos ayudarte hoy en ModelaME?",
          timestamp: new Date(),
        },
        {
          id: 2,
          sender: "bot",
          content: "Recuerda que puedes buscar castings o modelos fácilmente desde la app.",
          timestamp: new Date(),
        },
      ];
      scrollToBottom();
    });

    return {
      chatMessages,
      newMessage,
      sendMessage,
      scrollToBottom,
      formatTimestamp: (timestamp) =>
        timestamp
          ? new Date(timestamp).toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
      bottom,
      user,
    };
  },
};
</script>

<style scoped>
.messages-container {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  max-height: calc(100vh - 120px);
}

.message {
  max-width: 70%;
  padding: 10px;
  border-radius: 10px;
  font-size: 14px;
  line-height: 1.5;
}

.outgoing {
  align-self: flex-end;
  background-color: #d1e7dd;
}

.timestamp {
  display: block;
  font-size: 12px;
  text-align: right;
  color: #6c757d;
}

ion-footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 10;
}
</style>