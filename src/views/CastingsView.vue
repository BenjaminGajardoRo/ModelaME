<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Castings</ion-title>
        <ion-buttons slot="end">
          <!-- Botón para publicar casting -->
          <ion-button @click="openPublishCasting">
            <ion-icon slot="icon-only" :icon="share"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Castings</ion-title>
        </ion-toolbar>
      </ion-header>

      <!-- FILTROS DESPLEGABLES -->
      <ion-accordion-group>
        <ion-accordion value="filters">
          <ion-item slot="header">
            <ion-label>Filtros</ion-label>
          </ion-item>
          <div class="ion-padding" slot="content">
            <ion-list>
              <ion-item button @click="filterCategory('Modelaje')">
                <ion-label>Modelaje</ion-label>
              </ion-item>
              <ion-item button @click="filterCategory('Fotografía')">
                <ion-label>Fotografía</ion-label>
              </ion-item>
              <ion-item button @click="filterCategory('Comercial')">
                <ion-label>Comercial</ion-label>
              </ion-item>
              <ion-item button @click="filterCategory('Publicidad')">
                <ion-label>Publicidad</ion-label>
              </ion-item>
              <ion-item button @click="filterCategory('Otro')">
                <ion-label>Otro</ion-label>
              </ion-item>
              <ion-item button @click="clearFilter">
                <ion-label>Todos</ion-label>
              </ion-item>
            </ion-list>

            <!-- Filtro de Solo Pagados -->
            <ion-item lines="none">
              <ion-label>Solo Pagados</ion-label>
              <ion-toggle v-model="filters.paidOnly" @ionChange="applyFilters"></ion-toggle>
            </ion-item>
          </div>
        </ion-accordion>
      </ion-accordion-group>

      <!-- LISTA DE CASTINGS -->
      <div class="casting-grid">
        <CastingCard
          v-for="casting in filteredCastings"
          :key="casting.id"
          :casting="casting"
        />
      </div>

      <!-- Modal para publicar casting -->
      <ion-modal :is-open="isModalOpen" @did-dismiss="closePublishCasting">
        <publish-casting @close="closePublishCasting" @castingPublished="onCastingPublished"></publish-casting>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonModal, IonItem, IonLabel, IonToggle, IonAccordion, IonAccordionGroup, IonList } from '@ionic/vue';
import { collection, onSnapshot } from 'firebase/firestore';
import { dataBase } from '@/firebase'; 
import { share } from 'ionicons/icons'; 
import CastingCard from '@/components/CastingCard.vue'; 
import PublishCasting from '@/components/PublishCasting.vue'; 

interface Casting {
  id: string;
  companyName: string;
  slots: number;
  location: string;
  nationality: string;
  castingType: string;
  ageMin: number;
  ageMax: number;
  gender: string;
  heightMin: number;
  heightMax: number;
  description: string;
  paid: boolean;
  imageUrl?: string;
}

const isModalOpen = ref(false);

const openPublishCasting = () => {
  isModalOpen.value = true;
};

const closePublishCasting = () => {
  isModalOpen.value = false;
};

const castings = ref<Casting[]>([]);
const filteredCastings = ref<Casting[]>([]);

const filters = ref({
  category: '',
  paidOnly: false,
});

const loadCastings = () => {
  const castingsCollection = collection(dataBase, 'Castings');
  onSnapshot(castingsCollection, (snapshot) => {
    castings.value = snapshot.docs.map(doc => {
      const data = doc.data();
      return { 
        id: doc.id, 
        companyName: data.companyName || 'Empresa desconocida',
        slots: data.slots || 0,
        location: data.location || 'Ubicación no especificada',
        nationality: data.nationality || 'Nacionalidad no especificada',
        castingType: data.castingType || 'Tipo no especificado',
        ageMin: data.ageMin || 18,
        ageMax: data.ageMax || 200,
        gender: data.gender || 'Otro',
        heightMin: data.heightMin || 0,
        heightMax: data.heightMax || 0,
        description: data.description || 'Descripción no disponible',
        paid: data.paid || false,
        imageUrl: data.imageUrl || null 
      } as Casting;
    });
    applyFilters();
  });
};

onMounted(() => {
  loadCastings();
});

const filterCategory = (category: string) => {
  filters.value.category = category;
  applyFilters();
};

const applyFilters = () => {
  filteredCastings.value = castings.value.filter(casting => {
    const matchesCategory = filters.value.category ? casting.castingType === filters.value.category : true;
    const matchesPaid = filters.value.paidOnly ? casting.paid === true : true;
    return matchesCategory && matchesPaid;
  });
};

const clearFilter = () => {
  filters.value = { category: '', paidOnly: false };
  applyFilters();
};

const onCastingPublished = () => {
  loadCastings();
  closePublishCasting();
};
</script>

<style scoped>
.casting-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  padding: 10px;
}
</style>
