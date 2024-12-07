<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Registrarse</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div style="height: 100%; display: flex; align-items: center; justify-content: center;">
        <ion-card class="card-container">
          <div class="signup-logo">
            <span class="black">M</span><span class="white">odela</span><span class="black">ME</span>
          </div>
          <form @submit.prevent="onSignup">
            <ion-list>
              <ion-item>
                <ion-input
                  labelPlacement="stacked"
                  label="Nombre Completo"
                  v-model="userCredentials.fullName"
                  name="fullName"
                  type="text"
                  required
                ></ion-input>
              </ion-item>
              <ion-item>
                <ion-input
                  labelPlacement="stacked"
                  v-model="userCredentials.email"
                  label="Email"
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
              <ion-item>
                <ion-input
                  labelPlacement="stacked"
                  label="Confirmar Contraseña"
                  v-model="userCredentials.confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                ></ion-input>
              </ion-item>
            </ion-list>
            <div class="ion-padding">
              <ion-button type="submit" expand="block">Crear Cuenta</ion-button>
            </div>
          </form>
          <div class="ion-text-center ion-padding">
            <p>
              ¿Ya tienes una cuenta?
              <a @click="redirectToLogin" style="cursor: pointer; color: var(--ion-color-primary);">
                Inicia sesión
              </a>
            </p>
          </div>
        </ion-card>
      </div>

      <ion-toast
        :is-open="toast.isOpen"
        :message="toast.message"
        :duration="3000"
        @didDismiss="closeToast"
      ></ion-toast>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useRouter } from 'vue-router';
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
  IonToast,
  IonCard
} from "@ionic/vue";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, dataBase } from "@/firebase";

const userCredentials = ref({
  fullName: "",
  email: "",
  password: "",
  confirmPassword: ""
});

const toast = ref({
  isOpen: false,
  message: "",
  color: ""
});

const emailValid = computed(() => userCredentials.value.email.includes('@'));
const passwordValid = computed(() => userCredentials.value.password.length >= 6);
const passwordsMatch = computed(() => userCredentials.value.password === userCredentials.value.confirmPassword);

const showToast = (message: string, color: string) => {
  toast.value = {
    isOpen: true,
    message,
    color
  };
};

const closeToast = () => {
  toast.value.isOpen = false;
};

const onSignup = async () => {
  if (emailValid.value && passwordValid.value && passwordsMatch.value) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userCredentials.value.email, userCredentials.value.password);
      const user = userCredential.user;

      await setDoc(doc(dataBase, "Usuario", user.uid), {
        fullName: userCredentials.value.fullName,
        email: userCredentials.value.email,
        records: []
      });

      showToast("Registro exitoso!", "success");

      userCredentials.value = {
        fullName: "",
        email: "",
        password: "",
        confirmPassword: ""
      };

      router.push("/login");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        showToast("El correo ya está registrado.", "danger");
      } else {
        showToast(`Error en el registro: ${error.message}`, "danger");
      }
    }
  } else {
    if (!passwordsMatch.value) {
      showToast("Las contraseñas no coinciden", "danger");
    } else if (!emailValid.value) {
      showToast("Correo no válido", "danger");
    } else if (!passwordValid.value) {
      showToast("La contraseña debe tener al menos 6 caracteres", "danger");
    }
  }
};

const router = useRouter();
const redirectToLogin = () => {
  router.push("/login");
};
</script>

<style scoped>
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
