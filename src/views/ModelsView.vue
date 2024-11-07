<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Modelos</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Modelos</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-accordion-group>
        <ion-accordion value="filters">
          <ion-item slot="header">
            <ion-label>Filtros</ion-label>
          </ion-item>
          <div class="ion-padding" slot="content">
            <ion-list>
              <ion-item button @click="filterCategory('editorial')">
                <ion-label>Editorial</ion-label>
              </ion-item>
              <ion-item button @click="filterCategory('pasarela')">
                <ion-label>Pasarela</ion-label>
              </ion-item>
              <ion-item button @click="filterCategory('publicidad')">
                <ion-label>Publicidad</ion-label>
              </ion-item>
              <ion-item button @click="filterCategory('fotografía')">
                <ion-label>Fotografía</ion-label>
              </ion-item>
              <ion-item button @click="filterCategory('comercial')">
                <ion-label>Comercial</ion-label>
              </ion-item>
              <ion-item button @click="clearFilter">
                <ion-label>Todos</ion-label>
              </ion-item>
            </ion-list>
          </div>
        </ion-accordion>
      </ion-accordion-group>

      <div class="model-grid">
        <ModelCard v-for="model in filteredModels" :key="model.id" :model="model" />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonAccordion, IonAccordionGroup, IonItem, IonLabel, IonList } from '@ionic/vue';
import { ref, onMounted } from 'vue';
import { collection, getDocs } from 'firebase/firestore';
import { dataBase } from '@/firebase'; 
import ModelCard from '@/components/ModelCard.vue';

interface Model {
  id: string;
  fullName: string;
  height: number;
  nationality: string;
  location: string;
  bodyType: string;
  eyeColor: string;
  hairColor: string;
  specialty: string; 
}

const models = ref<Model[]>([]);
const filteredModels = ref<Model[]>([]);

const fetchModels = async () => {
  try {
    const querySnapshot = await getDocs(collection(dataBase, 'Usuario'));
    
    const modelsData: Model[] = querySnapshot.docs.map(doc => ({
      ...doc.data() as Model,
      id: doc.id,
    }));
    
    models.value = modelsData;
    filteredModels.value = modelsData;
  } catch (error) {
    console.error('Error al obtener los modelos desde Firebase:', error);
  }
};

const filterCategory = (category: string) => {
  filteredModels.value = models.value.filter(model => model.specialty === category);
};

const clearFilter = () => {
  filteredModels.value = models.value;
};

onMounted(() => {
  fetchModels();
});
</script>

<style scoped>
.model-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 10px;
}
</style>
