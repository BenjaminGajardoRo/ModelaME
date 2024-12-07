import { StoreDefinition } from 'pinia';

declare module '@/store/user' {
  export const useUserStore: StoreDefinition;
}
