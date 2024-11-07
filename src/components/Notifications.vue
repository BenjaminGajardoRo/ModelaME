<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Notificaciones</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-card v-if="recentModels.length > 0">
        <ion-card-header>
          <ion-card-title>Recién Llegados</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list>
            <ion-item v-for="model in recentModels" :key="model.id">
              <ion-avatar slot="start">
                <img :src="model.profilePictureUrl || 'https://via.placeholder.com/150'" alt="Foto de perfil" />
              </ion-avatar>
              <ion-label>
                <h2>{{ model.fullName }}</h2>
                <p>Registrado hace {{ calculateTimeAgo(model.createdAt) }}</p>
              </ion-label>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>

      <ion-card v-if="recentCastings.length > 0">
        <ion-card-header>
          <ion-card-title>Aventúrate</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list>
            <ion-item v-for="casting in recentCastings" :key="casting.id">
              <ion-label>
                <h2>{{ casting.companyName }}</h2>
                <p>Publicado hace {{ calculateTimeAgo(casting.createdAt) }}</p>
              </ion-label>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>

      <ion-card v-if="recentModels.length === 0 && recentCastings.length === 0">
        <ion-card-header>
          <ion-card-title>No hay notificaciones recientes</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <p>No se han encontrado modelos o castings recientes en las últimas 24 horas.</p>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonToolbar, IonAvatar } from '@ionic/vue';
import { useNotificationsStore } from '../store/notifications';

const notificationsStore = useNotificationsStore();

const { recentModels, recentCastings, fetchRecentModels, fetchRecentCastings } = notificationsStore;

onMounted(() => {
  fetchRecentModels();
  fetchRecentCastings();
});

const calculateTimeAgo = (createdAt: string | { toMillis: () => number }): string => {
  if (!createdAt) return 'Fecha desconocida';

  let createdAtDate: Date;

  if (typeof createdAt === 'string') {
    createdAtDate = new Date(createdAt);
  } else {
    createdAtDate = new Date(createdAt.toMillis());
  }

  const diffInMs = Date.now() - createdAtDate.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

  if (diffInHours < 24) {
    return `${diffInHours} horas`;
  } else {
    return `${Math.floor(diffInHours / 24)} días`;
  }
};
</script>

<style scoped>
.profile-avatar {
  width: 50px;
  height: 50px;
}

ion-card {
  margin-bottom: 20px;
}
</style>
