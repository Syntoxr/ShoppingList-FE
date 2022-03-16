import { Item } from "../shared/item.model";

export class Recipe {

    constructor(
        public name: string, 
        public description: string, 
        public imagePath: string, 
        public items: Item[]
        ) {  }
}