import { Ref } from 'vue';

export interface Model {
  id: string;
  fullName: string;
  profilePictureUrl?: string;
  createdAt: string;
}

export interface Casting {
  id: string;
  companyName: string;
  createdAt: string;
}

export interface ContactRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  createdAt: string;
  senderName?: string; // Agregado para reflejar el nombre del remitente
}

export interface NotificationsStore {
  recentModels: Ref<Model[]>;
  recentCastings: Ref<Casting[]>;
  contactRequests: Ref<ContactRequest[]>; // Cambiado a contactRequests para reflejar la nueva funcionalidad

  fetchRecentModels: () => Promise<void>;
  fetchRecentCastings: () => Promise<void>;
  fetchContactRequests: (currentUserId: string) => Promise<void>; // Requiere el ID del usuario autenticado
}

export function useNotificationsStore(): NotificationsStore;
