export interface Item {
  name: string;
  amount: number;
  id: number;
  onShoppinglist: boolean;
}

export class customError {
  constructor(public message: string) {}
}
