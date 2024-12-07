import { defineStore} from "pinia";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

import { setDoc, doc } from "firebase/firestore";

import { dataBase, auth } from '@/firebase'

import { useUserStore } from '@/store/user';


export const useAuthStore = defineStore('auth', {
    state: () => ({
        isLoggedIn: false,
    }),
    actions: {
        register(user: any) {
            console.log('Something!')
            createUserWithEmailAndPassword(auth, user.email, user.password)
                .then(async (userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                    this.isLoggedIn = true

                    await setDoc(doc(dataBase, "Usuarios", userCredential.user.uid), {
                        records: []
                    });
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                });
        },

        login(user: any) {
            signInWithEmailAndPassword(auth, user.email, user.password)
                .then(async (userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                    this.isLoggedIn = true

                    const store = useUserStore()
                    await store.clearData()
                    await store.fetchDataFromDB()
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                });
        }
    }
})

// Creditos Into the Coding