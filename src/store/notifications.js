import { defineStore } from 'pinia';
import { ref } from 'vue';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { dataBase } from '@/firebase';

export const useNotificationsStore = defineStore('notifications', () => {
  const recentModels = ref([]);
  const recentCastings = ref([]);
  const requests = ref([]);

  // Obtener modelos registrados en las últimas 24 horas
  const fetchRecentModels = async () => {
    try {
      const modelsRef = collection(dataBase, 'Usuario');
      const oneDayAgo = Timestamp.fromDate(new Date(Date.now() - 24 * 60 * 60 * 1000));
      const modelsQuery = query(modelsRef, where('createdAt', '>=', oneDayAgo)); // Filtrar en Firebase
      const modelsSnapshot = await getDocs(modelsQuery);

      recentModels.value = modelsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error al obtener los modelos recientes:', error.message);
    }
  };

  // Obtener castings publicados en las últimas 24 horas
  const fetchRecentCastings = async () => {
    try {
      const castingsRef = collection(dataBase, 'Castings');
      const oneDayAgo = Timestamp.fromDate(new Date(Date.now() - 24 * 60 * 60 * 1000));
      const castingsQuery = query(castingsRef, where('createdAt', '>=', oneDayAgo)); // Filtrar en Firebase
      const castingsSnapshot = await getDocs(castingsQuery);

      recentCastings.value = castingsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error al obtener los castings recientes:', error.message);
    }
  };

  // Obtener solicitudes de contacto pendientes para el usuario actual
  const fetchRequests = async (currentUserId) => {
    try {
      if (!currentUserId) {
        throw new Error('El usuario no está autenticado.');
      }

      const requestsRef = collection(dataBase, 'requests');
      const requestsQuery = query(
        requestsRef,
        where('receiverId', '==', currentUserId),
        where('status', '==', 'pending')
      );
      const requestsSnapshot = await getDocs(requestsQuery);

      requests.value = requestsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error al obtener las solicitudes de contacto:', error.message);
    }
  };

  return {
    recentModels,
    recentCastings,
    requests,
    fetchRecentModels,
    fetchRecentCastings,
    fetchRequests,
  };
});
