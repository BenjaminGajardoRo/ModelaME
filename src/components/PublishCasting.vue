<template>
  <div class="publish-card">
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="companyName">Nombre de la empresa</label>
        <input type="text" v-model="castingInfo.companyName" required />
      </div>

      <div class="form-group">
        <label for="slots">Número de vacantes</label>
        <input
          type="text"
          @input="validateHeight($event, 'slots')" 
          v-model="castingInfo.slots" 
          required 
        />
      </div>

      <div class="form-group">
        <label for="country">Ubicación (País)</label>
        <select v-model="castingInfo.location" required>
          <option v-for="country in countries" :key="country" :value="country">{{ country }}</option>
        </select>
      </div>

      <div class="form-group">
        <label for="nationality">Nacionalidad (No obligatoria)</label>
        <select v-model="castingInfo.nationality">
          <option v-for="nationality in nationalities" :key="nationality" :value="nationality">{{ nationality }}</option>
        </select>
      </div>

      <div class="form-group">
        <label for="castingType">Tipo de Casting</label>
        <select v-model="castingInfo.castingType" required>
          <option value="Modelaje">Modelaje</option>
          <option value="Fotografía">Fotografía</option>
          <option value="Comercial">Comercial</option>
          <option value="Publicidad">Publicidad</option>
          <option value="Otro">Otro</option>
        </select>
      </div>

      <div class="form-group">
        <label for="age">Rango de Edad</label>
        <div class="inline-fields">
          <input
            type="text"
            v-model="castingInfo.ageMin"
            placeholder="Edad mínima"
            @blur="validateAge('min')"
            required
          />
          <input
            type="text"
            v-model="castingInfo.ageMax"
            placeholder="Edad máxima"
            @blur="validateAge('max')"
            required
          />
        </div>
        <p v-if="errorAgeMin" class="error-message">{{ errorAgeMin }}</p>
        <p v-if="errorAgeMax" class="error-message">{{ errorAgeMax }}</p>
      </div>

      <div class="form-group">
        <label for="gender">Sexo</label>
        <select v-model="castingInfo.gender" required>
          <option value="Male">Masculino</option>
          <option value="Female">Femenino</option>
          <option value="Other">Otro</option>
        </select>
      </div>

      <div class="form-group">
        <label for="height">Altura (cm) (No obligatoria)</label>
        <div class="inline-fields">
          <input
            type="text"
            v-model="castingInfo.heightMin"
            placeholder="Altura mínima"
            @input="validateHeight($event, 'min')"
          />
          <input
            type="text"
            v-model="castingInfo.heightMax"
            placeholder="Altura máxima"
            @input="validateHeight($event, 'max')"
          />
        </div>
      </div>

      <div class="form-group">
        <label for="description">Descripción</label>
        <textarea v-model="castingInfo.description" required></textarea>
      </div>

      <div class="form-group checkbox-group">
        <label for="paid">¿Pagado?</label>
        <input type="checkbox" v-model="castingInfo.paid" />
      </div>

      <div class="form-group">
        <label for="image">Imagen</label>
        <input type="file" @change="handleFileUpload" />
      </div>

      <button type="submit" class="submit-btn">Publicar Casting</button>
    </form>

    <ion-alert
      :is-open="showAlert"
      :header="alertHeader"
      :message="alertMessage"
      buttons="OK"
      @didDismiss="closeAlert"
    ></ion-alert>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useCastingStore } from '@/store/castings';
import { IonAlert } from '@ionic/vue';

export default {
  components: {
    IonAlert,
  },
  setup() {
    const castingInfo = ref({
      companyName: '',
      slots: '',
      location: '',
      nationality: '',
      castingType: '', 
      ageMin: '',
      ageMax: '',
      gender: '',
      heightMin: '',
      heightMax: '',
      description: '',
      paid: false,
      image: null,
    });

    const errorAgeMin = ref(null);
    const errorAgeMax = ref(null);
    const countries = ref([]);
    const nationalities = ref([]);
    
    const showAlert = ref(false);
    const alertHeader = ref('');
    const alertMessage = ref('');

    const castingStore = useCastingStore();

    const showAlertMessage = (header, message) => {
      alertHeader.value = header;
      alertMessage.value = message;
      showAlert.value = true;
    };

    const closeAlert = () => {
      showAlert.value = false;
    };

    const loadCountriesAndNationalities = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const countriesData = await response.json();
        countries.value = countriesData.map((country) => country.name.common).sort();
        nationalities.value = countriesData
          .map((country) => country.demonyms?.eng?.m || country.name.common)
          .sort();
      } catch (error) {
        console.error('Error al cargar los países y nacionalidades:', error);
      }
    };

    onMounted(() => {
      loadCountriesAndNationalities(); 
    });

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = () => {
          const { width, height } = img;
          if (width < 600 || height < 200) {
            showAlertMessage('Error', 'La imagen debe tener al menos 600x200 píxeles.');
            castingInfo.value.image = null; 
          } else if (width <= height) {
            showAlertMessage('Error', 'Solo se permiten imágenes horizontales.');
            castingInfo.value.image = null; 
          } else {
            castingInfo.value.image = file; 
          }
        };
      } else {
        castingInfo.value.image = null;
      }
    };

    const handleSubmit = async () => {
      try {
        await castingStore.uploadCasting(castingInfo.value); 
        showAlertMessage('Éxito', 'Casting publicado con éxito');
      } catch (error) {
        console.error('Error al subir el casting:', error);
        showAlertMessage('Error', 'Hubo un error al publicar el casting');
      }
    };

    return {
      castingInfo,
      handleFileUpload,
      handleSubmit,
      countries,
      nationalities,
      showAlert,
      alertHeader,
      alertMessage,
      showAlertMessage,
      closeAlert,
      errorAgeMin,
      errorAgeMax,
    };
  },
};
</script>

<style scoped>
.publish-card {
  max-width: 900px;
  height: 1000px;
  padding: 40px;
  background-color: #575555;
  border-radius: 12px;
  border: 2px solid #575555;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  display: block;
  margin-bottom: 10px;
}

.form-group input[type="text"],
.form-group input[type="number"],
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 14px;
  border: 2px solid #575555;
  border-radius: 8px;
  font-size: 16px;
  color: #023e8a;
  background-color: #f0f8ff;
}

.inline-fields {
  display: flex;
  gap: 10px;
}

.form-group textarea {
  resize: vertical;
}

.form-group input[type="file"] {
  border: none;
}

.checkbox-group {
  display: flex;
  align-items: center;
}

.checkbox-group label {
  margin-right: 10px;
  color: #ffffff;
}

.submit-btn {
  width: 100%;
  padding: 20px;
  background-color: #0077b6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #00a8e8;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 5px;
}
</style>
