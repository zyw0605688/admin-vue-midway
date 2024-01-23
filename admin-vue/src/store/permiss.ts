import {defineStore} from 'pinia';

interface ObjectList {
  [key: string]: string[];
}

export const usePermissStore = defineStore('permiss', {
  state: () => {
    const keys = localStorage.getItem('permit_keys');
    return {
      key: keys ? JSON.parse(keys) : <string[]>[],
      defaultList: <ObjectList>{
        admin: ['1', '2', '3', '4', '5', '6', '7'],
        user: ['1', '2', '3', '4', '5', '6', '7']
      }
    };
  },
  actions: {
    handleSet(val: string[]) {
      this.key = val;
    }
  }
});
