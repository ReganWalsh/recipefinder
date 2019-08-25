import axios from 'axios'; //Promise Based HTTP Client For The Browser
import {key} from '../config'; //Importing Key From API

export default class Recipe { //Exporting Class For Use In Other Classes
    constructor(id) {
        this.id = id; //ID Associated With Recipe
    }

    async getRecipe() { //Performed Asynchronously By Way Of Event Loop
        try {
            const response = await axios(`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`); //Returns A Promise
            this.title = response.data.recipe.title; //Pulls Data From Promise
            this.author = response.data.recipe.publisher;
            this.img = response.data.recipe.image_url;
            this.url = response.data.recipe.source_url;
            this.ingredients = response.data.recipe.ingredients;
        } catch(error) {
            console.log(error);
            alert('Sorry, Something Went Wrong');
        }
    }

    calculateTime() { //Calculate Time For Recipe Based On Ingredients
        const numberOfIngredients = this.ingredients.length;
        const periods = Math.ceil(numberOfIngredients / 3); //Assuming That We Need 15 Minutes For Each 3 Ingredients

        this.time = periods * 15;
    }

    calculateServings() {
        this.servings = 4; //Default
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound']; //Used To Associate These Values With Full Length Values
        const units = [...unitsShort, 'kg', 'g']; //Adding More Units

        const newIngredients = this.ingredients.map(element => {
            let ingredient = element.toLowerCase(); //Uniform Units
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i])
            });
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' '); //Regular Expression To Removes Parenthesis
            const arrayIngredients = ingredient.split(' '); //Parse Ingredients Into Count, Unit And Ingredient
            const unitIndex = arrayIngredients.findIndex(el2 => units.includes(el2));

            let objectIngredients;
            if(unitIndex > -1) { //If There Is A Unit
                const arrayCount = arrayIngredients.slice(0, unitIndex); //4 1/2 cups, arrayCount [4, 1/2] ==> eval(4+1/2) ==> 4.5
                let count;
                if (arrayCount.length === 1) { //1 Number With Unit
                    count = eval(arrayIngredients[0].replace('-', '+'));
                } else {
                    count = eval(arrayIngredients.slice(0, unitIndex).join('+'));
                }
                objectIngredients = { //Ingredient Object
                    count,
                    unit: arrayIngredients[unitIndex],
                    ingredient: arrayIngredients.slice(unitIndex + 1).join(' ')
                }
            } else if(parseInt(arrayIngredients[0], 10)) { //There Is No Unit But 1st Element Is A Number
                objectIngredients = {
                    count: parseInt(arrayIngredients[0], 10),
                    unit:'',
                    ingredient: arrayIngredients.slice(1).join(' ')
                }
            } else if(unitIndex === -1) { //There Is No Unit And No Number In 1st Position
                objectIngredients = { //Default Object
                    count: 1,
                    unit: '',
                    ingredient
                }
            }
            return objectIngredients;
        });
        this.ingredients = newIngredients //Assign These Ingredients To Variable
    }

    updateServings(type) {
        const newServings = type === 'dec' ? this.servings - 1: this.servings + 1; //Servings
        this.ingredients.forEach(ingredient => { //Ingredients
            ingredient.count = ingredient.count * (newServings / this.servings);
        });
        this.servings = newServings; //Assign Servings To Variable
    }
}
