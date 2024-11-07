<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Iniciar Sesión</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div style="height: 100%; display: flex; align-items: center; justify-content: center;">
      <ion-card class="card-container">
        <div class="signup-logo">
          <span class="black">M</span><span class="white">odela</span><span class="black">ME</span>
        </div>

          <form novalidate @submit.prevent="onLogin">
            <ion-list>
              <ion-item>
                <ion-input
                  labelPlacement="stacked"
                  label="Correo Electrónico"
                  v-model="userCredentials.email"
                  name="email"
                  type="email"
                  required
                ></ion-input>
              </ion-item>

              <ion-item>
                <ion-input
                  labelPlacement="stacked"
                  label="Contraseña"
                  v-model="userCredentials.password"
                  name="password"
                  type="password"
                  required
                ></ion-input>
              </ion-item>
            </ion-list>

            <div class="ion-padding">
              <ion-button :disabled="!canSubmit" type="submit" expand="block">Iniciar Sesión</ion-button>
            </div>
          </form>

          <div class="ion-text-center ion-padding">
            <p>
              ¿No tienes cuenta?
              <a @click="redirectToRegister" style="cursor: pointer; color: var(--ion-color-primary);">
                Regístrate
              </a>
            </p>
          </div>
        </ion-card>
      </div>

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
import { ref, computed } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonButton,
  IonContent,
  IonList,
  IonItem,
  IonTitle,
  IonInput,
  IonAlert,
  IonCard,
} from "@ionic/vue";
import { useRouter } from 'vue-router';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";

const userCredentials = ref({
  email: '',
  password: ''
});

const showAlert = ref(false);
const alertHeader = ref("");
const alertMessage = ref("");

const canSubmit = computed(() => userCredentials.value.email.trim() !== "" && userCredentials.value.password.trim() !== "");

const showAlertMessage = (header: string, message: string) => {
  alertHeader.value = header;
  alertMessage.value = message;
  showAlert.value = true;
};

const closeAlert = () => {
  showAlert.value = false;
};

// Iniciar sesión
const onLogin = async () => {
  if (userCredentials.value.email && userCredentials.value.password) {
    try {
      // Autenticación de usuario en Firebase 
      await signInWithEmailAndPassword(auth, userCredentials.value.email, userCredentials.value.password);
      
      showAlertMessage("Éxito", "Inicio de sesión exitoso!");

      // Limpiar los campos
      userCredentials.value = {
        email: '',
        password: ''
      };

      // Redirigir al usuario a la página principal
      router.push({ name: 'Castings' });
    } catch (error) {
      // Manejo de error específico cuando el correo no está registrado
      if (error.code === 'auth/user-not-found') {
        showAlertMessage("Error", "Este correo no está registrado. Por favor, crea una cuenta.");
      } else if (error.code === 'auth/wrong-password') {
        showAlertMessage("Error", "Contraseña incorrecta. Inténtalo de nuevo.");
      } else {
        showAlertMessage("Error", `Error en el inicio de sesión: ${error.message}`);
      }
    }
  } else {
    showAlertMessage("Error", "Por favor, completa los campos.");
  }
};

// Redireccionar a la vista de registro
const router = useRouter();
const redirectToRegister = () => {
  router.push("/register");
};
</script>

<style scoped>
.login-logo {
  padding: 20px 0;
  min-height: 200px;
  text-align: center;
}

.login-logo img {
  max-width: 150px;
}

@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@200..700&display=swap');

.signup-logo {
font-family: 'Oswald', sans-serif;
font-size: 36px;
text-align: center;
padding: 20px 0;
font-weight: 700;
}

.signup-logo .black {
color: black;
text-shadow: 2px 2px 0px white, -2px -2px 0px white, 2px -2px 0px white, -2px 2px 0px white;
}

.signup-logo .white {
color: white;
text-shadow: 2px 2px 0px black, -2px -2px 0px black, 2px -2px 0px black, -2px 2px 0px black;
}

.card-container {
width: 100%;
max-width: 400px; 
padding: 20px;
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
border-radius: 8px;
}
</style>
