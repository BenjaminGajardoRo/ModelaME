import { defineStore } from 'pinia';
import { setDoc, doc, collection } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { dataBase } from '@/firebase';

export const useCastingStore = defineStore('castings', {
  actions: {
    async uploadCasting(castingInfo) {
      try {
        let imageUrl = null;

        if (castingInfo.image) {
          
          const storage = getStorage();
          const imageRef = storageRef(storage, `castings/${castingInfo.image.name}`);
          const snapshot = await uploadBytes(imageRef, castingInfo.image);
          imageUrl = await getDownloadURL(snapshot.ref);
        }

        const castingData = {
          companyName: castingInfo.companyName,
          slots: castingInfo.slots,
          location: castingInfo.location, 
          nationality: castingInfo.nationality, 
          ageMin: castingInfo.ageMin, 
          ageMax: castingInfo.ageMax, 
          gender: castingInfo.gender, 
          heightMin: castingInfo.heightMin, 
          heightMax: castingInfo.heightMax, 
          castingType: castingInfo.castingType,
          description: castingInfo.description,
          paid: castingInfo.paid,
          imageUrl: imageUrl || null,
          createdAt: new Date().toISOString() 
        };

        const castingsCollectionRef = collection(dataBase, 'Castings');
        const newCastingRef = doc(castingsCollectionRef);
        await setDoc(newCastingRef, castingData);
      } catch (error) {
        throw new Error('Error al subir el casting: ' + error.message);
      }
    }
  }
});
