import { defineStore } from 'pinia';
import { dataBase } from '@/firebase';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    recentModels: [] as any[],
    recentCastings: [] as any[],
  }),

  actions: {
    fetchRecentModels() {
      const modelsQuery = query(
        collection(dataBase, 'models'),
        where('createdAt', '>=', new Date(Date.now() - 24 * 60 * 60 * 1000)),
        orderBy('createdAt', 'desc'),
        limit(10)
      );

      onSnapshot(modelsQuery, (snapshot) => {
        this.recentModels = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      });
    },

    fetchRecentCastings() {
      const castingsQuery = query(
        collection(dataBase, 'castings'),
        where('createdAt', '>=', new Date(Date.now() - 24 * 60 * 60 * 1000)),
        orderBy('createdAt', 'desc'),
        limit(10)
      );

      onSnapshot(castingsQuery, (snapshot) => {
        this.recentCastings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      });
    },
  },
});
