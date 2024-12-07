import { defineStore } from "pinia";
import { dataBase, auth } from '@/firebase.js';
import { doc, updateDoc, arrayUnion, getDoc, collection, addDoc } from "firebase/firestore";

export const useUserStore = defineStore('Usuario', {
  state: () => ({
    records: [],
    reviews: [] 
  }),
  actions: {
    async fetchDataFromDB() {
      const docRef = doc(dataBase, "Usuario", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("Document data:", data);
        this.records = [...data.records];
      } else {
        console.log("No such document!");
      }
    },
    
    async addRecordToStore(record) {
      this.records.push(record);

      const recordReference = doc(dataBase, "Usuario", auth.currentUser.uid);
      await updateDoc(recordReference, {
        records: arrayUnion(record)
      });
    },
    
    async addReviewToUser(userId, reviewText) {
      const review = {
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || "Anónimo",
        review: reviewText,
        date: new Date()
      };

      const reviewRef = collection(dataBase, "Usuario", userId, "reseñas");
      
      await addDoc(reviewRef, review);
      
      console.log("Reseña añadida:", review);
    },

    clearData() {
      this.records = [];
      this.reviews = []; 
    }
  }
});


// Creditos Into the Coding