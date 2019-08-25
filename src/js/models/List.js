import uniqid from 'uniqid'; //Creates A Unique ID For Each Item

export default class List { //Exporting Class For Use In Other Classes
    constructor() {
        this.items = []; //Initialise Constructor With Empty Array
    }

    addItem(count, unit, ingredient) {
        const item = { //Item Object
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item); //Push New Item To End Of Array
        return item; //Return The Item
    }

    deleteItem(id) { //Delete Item Based On ID
        const index = this.items.findIndex(element => element.id === id);
        this.items.splice(index, 1);
    }

    updateCount(id, newCount) { //Update Item Based On ID And New Required
        this.items.find(element => element.id === id).count = newCount;
    }
}
