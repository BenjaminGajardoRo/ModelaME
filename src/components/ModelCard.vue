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
        </div>
      </ion-content>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonModal, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton } from '@ionic/vue';

const props = defineProps({
  model: {
    type: Object,
    required: true,
  } 
});

const defaultAvatar = 'https://www.chilevision.cl/chilevision/site/artic/20230109/imag/foto_0000000220230109112259.jpg';

const showDetails = ref(false);

const toggleDetails = () => {
  showDetails.value = true;
};

const closeDetails = () => {
  showDetails.value = false;
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
</style>
