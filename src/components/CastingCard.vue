<template>
  <ion-card @click="openDetails">
    <img :src="casting.imageUrl || defaultAvatar" alt="Casting Image" />
    <ion-card-header>
      <ion-card-title>{{ casting.companyName }}</ion-card-title>
      <ion-card-subtitle>{{ casting.location }}</ion-card-subtitle>
    </ion-card-header>

    <ion-card-content>
      <p><strong>Vacantes:</strong> {{ casting.slots }}</p>
      <p><strong>Pagado:</strong> {{ casting.paid ? 'Sí' : 'No' }}</p>
      <p><strong>Especialidad:</strong> {{ casting.castingType }}</p>
    </ion-card-content>
  </ion-card>

  <ion-modal :is-open="isModalOpen" @did-dismiss="closeDetails">
    <ion-content>
      <ion-card>
        <img :src="casting.imageUrl || defaultAvatar" alt="Casting Image" />
        <ion-card-header>
          <ion-card-title>{{ casting.companyName }}</ion-card-title>
          <ion-card-subtitle>{{ casting.location }}</ion-card-subtitle>
        </ion-card-header>

        <ion-card-content>
          <p><strong>Vacantes:</strong> {{ casting.slots }}</p>
          <p><strong>Pagado:</strong> {{ casting.paid ? 'Sí' : 'No' }}</p>
          <p><strong>Descripción:</strong> {{ casting.description }}</p>
          <p><strong>Rango de Edad:</strong> {{ casting.ageMin }} - {{ casting.ageMax }}</p>
          <p><strong>Altura:</strong> {{ casting.heightMin }} cm - {{ casting.heightMax }} cm</p>
          <p><strong>Nacionalidad:</strong> {{ casting.nationality }}</p>
        </ion-card-content>

        <ion-button expand="block" @click="applyToCasting">Inscribirse</ion-button>

        <ion-button expand="block" color="danger" @click="closeDetails">Cerrar</ion-button>
      </ion-card>
    </ion-content>
  </ion-modal>
</template>

<script setup>
import { ref } from 'vue';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonModal, IonButton, IonContent } from '@ionic/vue';
const defaultAvatar = 'https://alexissaavedra.com/wp-content/uploads/2022/08/que-es-un-filmmaker-marketing-1.png';
const props = defineProps({
  casting: {
    type: Object,
    required: true
  }
});

const isModalOpen = ref(false);

const openDetails = () => {
  isModalOpen.value = true;
};

const closeDetails = () => {
  isModalOpen.value = false;
};

const applyToCasting = () => {
  alert('Te has inscrito al casting');
  closeDetails();
};
</script>

<style scoped>
ion-card {
  margin: 10px;
}

img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

ion-button {
  margin-top: 10px;
}
</style>
