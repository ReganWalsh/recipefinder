export default class Likes { //Exporting Class For Use In Other Classes
    constructor() { //Initialise Constructor With Empty Array
        this.likes = [];
    }

    addLike(id, title, author, image) {
        const like = {id, title, author, img: image};
        this.likes.push(like);
        this.persistData(); //Persist Data In localStorage
        return like;
    }

    deleteLike(id) { //Remove Like Based On ID
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);
        this.persistData(); //Persist Data In localStorage
    }

    isLiked(id) {
        return this.likes.findIndex(element => element.id === id) !== -1;
    }

    getNumberOfLikes() {
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes)); //Convert Like Into String To Be Sent To Server
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));
        if (storage) this.likes = storage; //Restore Likes From The localStorage
    }
}
