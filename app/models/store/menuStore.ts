export interface IMenuStore {
  isOpen: boolean;
  setIsOpen: (callbackFunction: ((isOpen?: boolean) => boolean) | boolean) => void;
}
