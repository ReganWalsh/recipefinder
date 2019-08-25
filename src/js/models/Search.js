import axios from 'axios'; //Promise Based HTTP Client For The Browser
import {key} from '../config'; //Importing Key From API

export default class Search { //Exporting Class For Use In Other Classes
    constructor(query) {
        this.query = query;
    }

    async getResults() { //Get Search Results Using API Key And User Query Data
        try{
            const response = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`); //returns a promise
            this.result = response.data.recipes; //Pull Recipe Data From Promise
        } catch(error) {
            alert(error);
        }
    }
}

