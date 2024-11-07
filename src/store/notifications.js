import { defineStore } from 'pinia';
import { ref } from 'vue';
import { collection, getDocs } from 'firebase/firestore';
import { dataBase } from '@/firebase';

export const useNotificationsStore = defineStore('notifications', () => {
  const recentModels = ref([]);
  const recentCastings = ref([]);

  const fetchRecentModels = async () => {
    const modelsRef = collection(dataBase, 'Usuario');
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const modelsSnapshot = await getDocs(modelsRef);

    recentModels.value = modelsSnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter(model => new Date(model.createdAt) >= oneDayAgo);
  };

  const fetchRecentCastings = async () => {
    const castingsRef = collection(dataBase, 'Castings');
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const castingsSnapshot = await getDocs(castingsRef);

    recentCastings.value = castingsSnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter(casting => new Date(casting.createdAt) >= oneDayAgo);
  };

  return {
    recentModels,
    recentCastings,
    fetchRecentModels,
    fetchRecentCastings,
  };
});
