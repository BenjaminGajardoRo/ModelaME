<template>
  <ion-card class="custom-card" @click="toggleDetails">
    <ion-card-header>
      <img class="card-image" :src="model.profilePictureUrl ? model.profilePictureUrl : defaultAvatar" alt="Foto de perfil" />
      <ion-card-title>{{ model.fullName }}</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <p><strong>Altura:</strong> {{ model.height }} cm</p>
      <p><strong>Nacionalidad:</strong> {{ model.nationality }}</p>
      <p><strong>Ubicación:</strong> {{ model.location }}</p>
    </ion-card-content>
  </ion-card>

  <ion-modal :is-open="showDetails" @didDismiss="closeDetails" class="large-modal">
    <div class="modal-content">
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button @click="closeDetails">X</ion-button> 
          </ion-buttons>
          <ion-title>Detalles de {{ model.fullName }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content>
        <div class="modal-body">
          <div class="image-container">
            <img class="card-image-large" :src="model.profilePictureUrl ? model.profilePictureUrl : defaultAvatar" alt="Foto de perfil grande" />
          </div>
          <p><strong>Altura:</strong> {{ model.height }} cm</p>
          <p><strong>Características físicas:</strong> {{ model.bodyType }}</p>
          <p><strong>Color de Ojos:</strong> {{ model.eyeColor }}</p>
          <p><strong>Color de Pelo:</strong> {{ model.hairColor }}</p>
          <div class="button-container">
            <ion-button color="primary" @click="sendRequest">Contactar</ion-button>
          </div>
        </div>
      </ion-content>
    </div>
  </ion-modal>
  <ion-toast :is-open="toast.isOpen" :message="toast.message" duration="2000" position="bottom" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonModal, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonToast } from '@ionic/vue';
import { useChatStore } from '@/store/chat';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { dataBase } from '@/firebase';


const props = defineProps({
  model: {
    type: Object,
    required: true,
  },
});

const defaultAvatar = 'https://www.chilevision.cl/chilevision/site/artic/20230109/imag/foto_0000000220230109112259.jpg';

const showDetails = ref(false);


const chatStore = useChatStore();


const toast = ref({
  isOpen: false,
  message: '',
});


const toggleDetails = () => {
  showDetails.value = true;
};

const closeDetails = () => {
  showDetails.value = false;
};

const getCurrentUserName = async (userId: string): Promise<string> => {
  const userRef = doc(dataBase, 'Usuario', userId);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    return userDoc.data().fullName || `Usuario ${userId}`;
  } else {
    return `Usuario ${userId}`;
  }
};


const sendRequest = async () => {
  try {
    const auth = getAuth();
    const currentUserId = auth.currentUser?.uid;

    if (!currentUserId) {
      throw new Error('El usuario no está autenticado.');
    }

    const senderName = await getCurrentUserName(currentUserId);
    const receiverName = props.model.fullName;

    await chatStore.sendRequest(currentUserId, props.model.id, senderName, receiverName);

    toast.value = {
      isOpen: true,
      message: 'Solicitud enviada con éxito.',
    };
  } catch (error) {
    let errorMessage = 'Error al enviar solicitud';
    if (error.message.includes('ya enviada')) {
      errorMessage = 'No puede enviar más de una solicitud.';
    }

    toast.value = {
      isOpen: true,
      message: errorMessage,
    };
  }
};
</script>

<style scoped>
.custom-card {
  background-color: var(--color-light); 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  transition: transform 0.3s ease;
  overflow: hidden;
}

.custom-card:hover {
  transform: scale(1.05); 
}

.card-image {
  width: 480px; 
  height: 600px;
  object-fit: cover; 
  border-radius: 8px 8px 0 0; 
  display: block;
  margin: 0 auto; 
}

.large-modal {
  --width: 600px;
  --height: 800px; 
}

.modal-content {
  position: relative;
  height: 100%;
}

.modal-body {
  padding: 16px;
  text-align: center;
}

.image-container {
  width: 100%;
  max-width: 400px; 
  height: 400px; 
  margin: 0 auto;
  position: relative;
}

.card-image-large {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 12px;
}

ion-card-title {
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--color-primary-dark); 
}

ion-card-content p {
  margin: 4px 0;
  color: #666;
  font-size: 0.9rem;
}

ion-card-content p strong {
  color: #333;
}

.button-container {
  margin-top: 20px;
}
</style>
