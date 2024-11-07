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
  message: string;
  createdAt: string;
}

export interface NotificationsStore {
  recentModels: Ref<Model[]>;
  recentCastings: Ref<Casting[]>;
  contactRequests: Ref<ContactRequest[]>;

  fetchRecentModels: () => Promise<void>;
  fetchRecentCastings: () => Promise<void>;
  fetchContactRequests: () => Promise<void>;
}

export function useNotificationsStore(): NotificationsStore;
