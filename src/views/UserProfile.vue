<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Perfil de Usuario</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div class="profile-container">
        <div class="profile-photo-section">
          <ion-avatar class="profile-avatar">
            <img :src="profilePicture" alt="Foto de perfil" />
          </ion-avatar>
          <label for="file-input" class="upload-icon">
            <ion-icon :icon="brush"></ion-icon>
          </label>
          <input id="file-input" type="file" @change="uploadProfilePhoto" style="display: none" />
        </div>
        <h3>{{ userProfile.fullName }}</h3>
      </div>

      <ion-list>
        <ion-item>
          <ion-label position="stacked">Altura (cm)</ion-label>
          <ion-input
            v-model="userProfile.height"
            type="text"
            inputmode="numeric"
            placeholder="Ej: 170"
            @input="validateHeight"
          >
            <ion-note slot="end">cm</ion-note>
          </ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Nacionalidad</ion-label>
          <ion-select v-model="userProfile.nationality" placeholder="Selecciona tu nacionalidad">
            <ion-select-option v-for="nationality in nationalities" :key="nationality" :value="nationality">
              {{ nationality }}
            </ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Ubicación</ion-label>
          <ion-select v-model="userProfile.location" placeholder="Selecciona tu ubicación">
            <ion-select-option v-for="country in countries" :key="country" :value="country">
              {{ country }}
            </ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Tipo de Cuerpo</ion-label>
          <ion-select v-model="userProfile.bodyType" placeholder="Selecciona tu tipo de cuerpo">
            <ion-select-option value="delgado">Delgado</ion-select-option>
            <ion-select-option value="atlético">Atlético</ion-select-option>
            <ion-select-option value="robusto">Robusto</ion-select-option>
            <ion-select-option value="curvilíneo">Curvilíneo</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Color de Ojos</ion-label>
          <ion-select v-model="userProfile.eyeColor" placeholder="Selecciona tu color de ojos">
            <ion-select-option value="azul">Azul</ion-select-option>
            <ion-select-option value="verde">Verde</ion-select-option>
            <ion-select-option value="café">Café</ion-select-option>
            <ion-select-option value="gris">Gris</ion-select-option>
            <ion-select-option value="negro">Negro</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Color de Pelo</ion-label>
          <ion-select v-model="userProfile.hairColor" placeholder="Selecciona tu color de pelo">
            <ion-select-option value="rubio">Rubio</ion-select-option>
            <ion-select-option value="castaño">Castaño</ion-select-option>
            <ion-select-option value="negro">Negro</ion-select-option>
            <ion-select-option value="rojo">Rojo</ion-select-option>
            <ion-select-option value="canoso">Canoso</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Especialidad</ion-label>
          <ion-select v-model="userProfile.specialty" placeholder="Selecciona tu especialidad">
            <ion-select-option value="editorial">Editorial</ion-select-option>
            <ion-select-option value="pasarela">Pasarela</ion-select-option>
            <ion-select-option value="publicidad">Publicidad</ion-select-option>
            <ion-select-option value="fotografía">Fotografía</ion-select-option>
            <ion-select-option value="comercial">Comercial</ion-select-option>
          </ion-select>
        </ion-item>
      </ion-list>

      <ion-button expand="block" color="success" @click="saveProfile">Guardar Cambios</ion-button>

      <!-- Alerta de éxito -->
      <ion-alert
        :is-open="showAlert"
        :header="alertHeader"
        :message="alertMessage"
        buttons="OK"
        @didDismiss="closeAlert"
      ></ion-alert>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  IonBackButton,
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonToolbar,
  IonAvatar,
  IonIcon,
  IonAlert,
} from '@ionic/vue';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, dataBase } from '@/firebase';
import { useUserStore } from '@/store/user';
import { brush } from 'ionicons/icons';

const profilePicture = ref('https://via.placeholder.com/150'); 

const userStore = useUserStore();

const userProfile = ref({
  fullName: '',
  height: '',
  nationality: '',
  location: '',
  bodyType: '',
  eyeColor: '',
  hairColor: '',
  specialty: '',
});

const countries = ref<string[]>([]);
const nationalities = ref<string[]>([]);

const showAlert = ref(false);
const alertHeader = ref("");
const alertMessage = ref("");

// Función para mostrar la alerta
const showAlertMessage = (header: string, message: string) => {
  alertHeader.value = header;
  alertMessage.value = message;
  showAlert.value = true;
};

const closeAlert = () => {
  showAlert.value = false;
};

const loadUserProfile = async () => {
  try {
    await userStore.fetchDataFromDB();
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error('No se pudo identificar al usuario');
    }
    const userDoc = await getDoc(doc(dataBase, 'Usuario', userId));
    if (userDoc.exists()) {
      Object.assign(userProfile.value, userDoc.data());
      if (userDoc.data().profilePictureUrl) {
        profilePicture.value = userDoc.data().profilePictureUrl;
      }
    }
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error);
  }
};

const validateHeight = (event: any) => {
  const inputValue = event.target.value;
  const sanitizedValue = inputValue.replace(/[^0-9]/g, '');
  userProfile.value.height = sanitizedValue;
};

const saveProfile = async () => {
  try {
    userProfile.value.height = userProfile.value.height.replace(/[^0-9]/g, '');
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error('No se pudo identificar al usuario');
    }
    await setDoc(doc(dataBase, 'Usuario', userId), userProfile.value, { merge: true });
    showAlertMessage("Éxito", "Sus datos se han actualizado correctamente");
  } catch (error) {
    console.error('Error al guardar los cambios del perfil:', error);
  }
};

const loadCountriesAndNationalities = async () => {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const countriesData = await response.json();
    countries.value = countriesData.map((country: any) => country.name.common).sort();
    nationalities.value = countriesData.map((country: any) => country.demonyms?.eng?.m || country.name.common).sort();
  } catch (error) {
    console.error('Error al cargar los países y nacionalidades:', error);
  }
};

const uploadProfilePhoto = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error('No se pudo identificar al usuario');
    }

    const storage = getStorage();
    const storageReference = storageRef(storage, `profilePictures/${userId}`);

    await uploadBytes(storageReference, file);

    const downloadUrl = await getDownloadURL(storageReference);
    profilePicture.value = downloadUrl;
    await setDoc(doc(dataBase, 'Usuario', userId), { profilePictureUrl: downloadUrl }, { merge: true });
    await loadUserProfile();

    console.log('Foto de perfil actualizada con éxito');
  } catch (error) {
    console.error('Error al subir la foto de perfil:', error);
  }
};

onMounted(() => {
  loadUserProfile();
  loadCountriesAndNationalities();
});
</script>

<style scoped>
.profile-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.profile-photo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
}

.profile-avatar {
  width: 150px;
  height: 150px;
  margin-bottom: 10px;
}

.upload-icon {
  cursor: pointer;
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  padding: 8px;
  outline: auto;
}
</style>
