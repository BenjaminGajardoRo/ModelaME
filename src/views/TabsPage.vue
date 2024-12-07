<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="Castings" href="/tabs/Castings">
          <ion-icon :icon="videocam"></ion-icon>
          <ion-label>Castings</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="Models" href="/tabs/Models">
          <ion-icon :icon="people"></ion-icon>
          <ion-label>Modelos</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="Messages" href="/tabs/Messages">
          <ion-icon :icon="chatbubbleEllipsesOutline"></ion-icon>
          <ion-label>Mensajes</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="Profile" href="/tabs/Profile">
          <ion-icon :icon="person"></ion-icon>
          <ion-label>Perfil</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { videocam, people, person, chatbubbleEllipsesOutline } from 'ionicons/icons';

const icons = {
  videocam,
  people,
  person,
};
</script>
