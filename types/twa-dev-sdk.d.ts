declare module '@twa-dev/sdk' {
  export function ready(): void;
  export function expand(): void;
  export const initData: {
    user?: {
      id: string;
      // Add other properties as needed
    };
  };
  export function showAlert(message: string): void;
}