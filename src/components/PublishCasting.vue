<template>
  <div class="publish-card-container">
    <div class="publish-card">
      <button class="close-btn" @click="emitClose">&times;</button>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="companyName">Nombre de la empresa</label>
          <input type="text" v-model="castingInfo.companyName" required />
        </div>

        <div class="form-group">
          <label for="slots">Número de vacantes</label>
          <input
            type="text"
            v-model="castingInfo.slots"
            @input="validateNumber($event, 'slots')"
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
              @input="validateNumber($event, 'ageMin')"
              required
            />
            <input
              type="text"
              v-model="castingInfo.ageMax"
              placeholder="Edad máxima"
              @input="validateNumber($event, 'ageMax')"
              required
            />
          </div>
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
              @input="validateNumber($event, 'heightMin')"
            />
            <input
              type="text"
              v-model="castingInfo.heightMax"
              placeholder="Altura máxima"
              @input="validateNumber($event, 'heightMax')"
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

        <button type="submit" class="submit-btn" :disabled="isSubmitting">
          {{ isSubmitting ? 'Publicando...' : 'Publicar Casting' }}
        </button>
      </form>

      <ion-alert
        :is-open="showAlert"
        :header="alertHeader"
        :message="alertMessage"
        buttons="OK"
        @didDismiss="closeAlert"
      ></ion-alert>
    </div>
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
  emits: ['close'], 
  setup(_, { emit }) {
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

    const isSubmitting = ref(false); // Bandera para controlar el estado de envío
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

    const emitClose = () => {
      emit('close'); // Emite el evento 'close' al presionar el botón "X"
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

    const validateNumber = (event, field) => {
      const value = event.target.value;
      if (!/^\d*$/.test(value)) {
        showAlertMessage('Advertencia', 'Solo se permiten números en este campo.');
        castingInfo.value[field] = ''; // Vacía el campo si no es un número
      }
    };

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
      if (isSubmitting.value) return; 
      isSubmitting.value = true; 

      try {
        await castingStore.uploadCasting(castingInfo.value); 
        showAlertMessage('Éxito', 'Casting publicado con éxito');
        emitClose(); 
      } catch (error) {
        console.error('Error al subir el casting:', error);
        showAlertMessage('Error', 'Hubo un error al publicar el casting');
      } finally {
        isSubmitting.value = false;
      }
    };

    onMounted(() => {
      loadCountriesAndNationalities(); 
    });

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
      emitClose,
      validateNumber,
      isSubmitting,
    };
  },
};
</script>

<style scoped>
.publish-card-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.publish-card {
  width: 90%;
  max-width: 600px;
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  max-height: 90%;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 5px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}

.inline-fields {
  display: flex;
  gap: 10px;
}

.checkbox-group {
  display: flex;
  align-items: center;
}

.checkbox-group label {
  margin-right: 10px;
  color: #333;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 5px;
}
</style>
