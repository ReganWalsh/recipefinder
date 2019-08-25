import Search from './models/Search'; //Importing All Needed Modules
import Likes from './models/Likes';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import {elements, renderLoader, clearLoader} from "./views/base";
import Recipe from'./models/Recipe';

const state = {}; //Initialise State With Empty Object

//Search Controller
const controlSearch = async () => { //Async Function Runs Independently Of Main Program (Event Loop)
    const query = searchView.getInput(); //Receive Query From View

    if(query) { //If There Is A Query
        state.search = new Search(query); //Create New Search Object, Then Add To State

        searchView.clearInput(); //Prepare UI For Results
        searchView.clearResults();
        renderLoader(elements.searchResult);

        try {
            await state.search.getResults(); //Search For Recipes From The API
            clearLoader();//Render Results On UI
            searchView.renderResults(state.search.result);
        } catch (err) {
            alert('Sorry, Something Wrong With The Search');
            clearLoader();
        }
    }
};

elements.searchForm.addEventListener('submit', element => {
    element.preventDefault(); //Prevents Reloading Page
    controlSearch(); //Perform Search
});

elements.searchResultPages.addEventListener('click', element => {
    const button = element.target.closest('.button-inline'); //Allows More Leeway For Mouse Clicks
    if(button) { //If Clicked
        const goToPage = parseInt(button.dataset.goto, 10);
        searchView.renderResults(state.search.result, goToPage);
    }
});

//Search Controller
const controlRecipe = async () => {
    const id = window.location.hash.replace('#', ''); //Get ID From URL

    if(id) { //With ID Selected
        recipeView.clearRecipe(); //Prepare UI For Changes
        renderLoader(elements.recipe);
        if(state.search) searchView.highlightSelected(id); //Highlight Selected Search Item
        state.recipe = new Recipe(id); //Create New Recipe Object

        try {
            await state.recipe.getRecipe(); //Get Recipe Data And Parse The Ingredients
            state.recipe.parseIngredients();

            state.recipe.calculateTime(); //Calculate Servings And Time For Recipe
            state.recipe.calculateServings();
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id)); //Render Completed Recipe
        } catch(err) {
            console.log(err);
            alert('Error Processing Recipe')
        }
    }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe)) //When Fragment Identifier Of The URL Has Changed (#)/Recipe ID -> Change The Recipe

//List Controller
const controlList = () => {
    if (!state.list) state.list = new List(); //Create A New List If There Isnt One Currently

    state.recipe.ingredients.forEach(element => { //Add Each New Ingredient To List And UI
        const item = state.list.addItem(element.count, element.unit, element.ingredient);
        listView.renderItem(item);
    })
};

elements.shopping.addEventListener('click', element => { //Handle Delete And Update List Item Events
    const id = element.target.closest('.shopping__item').dataset.itemid;

    if(element.target.matches('.shopping__delete, .shopping__delete *')) { //Delete Event For List Delete Or Its Parent
        state.list.deleteItem(id); //Delete Item From State
        listView.deleteItem(id); //Delete Item From UI
    } else if (element.target.matches('.shopping__count-value')) { //Handle Count Update
        const value = parseFloat(element.target.value, 10);
        state.list.updateCount(id, value);
    }
});

//Like Controller
const controlLike = () => {
    if(!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    if(!state.likes.isLiked(currentID)) { //User Has Liked The Current Recipe

        const newLike = state.likes.addLike( //Create New Like Object And Add It To The State
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );

        likesView.toggleLikeButton(true); //Toggle The Like Button
        likesView.renderLike(newLike); //Add Like To The UI List

    } else { //User Has Unliked The Current Recipe
        state.likes.deleteLike(currentID); //Remove The Like From The State
        likesView.toggleLikeButton(false); //Toggle The Like Button Off
        likesView.deleteLike(currentID); //Remove Like From The UI List
    }
    likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
};

window.addEventListener('load', () => { //Restore Like Recipes On Page Load
    state.likes = new Likes(); //Initialise Likes In Restored State
    state.likes.readStorage();//Restore Likes In New Empty State
    likesView.toggleLikeMenu(state.likes.getNumberOfLikes()); //Toggle Like Menu Button
    state.likes.likes.forEach(likes => likesView.renderLike(likes)) //Render The Existing Likes

});

elements.recipe.addEventListener('click', element => { //Handling Recipe Button Clicks
    if(element.target.matches('.btn-decrease, .btn-decrease *')) { //Decrease Button Or Parent Is Clicked
        if(state.recipe.servings > 1) {
            state.recipe.updateServings('dec'); //Update Decrease In Servings
            recipeView.updateServingsIngredients(state.recipe); //Update Ingredients
        }
    } else if(element.target.matches('.btn-increase, .btn-increase *')) { //Increase Button Or Parent Is Clicked
        state.recipe.updateServings('inc'); //Update Increate In Servings
        recipeView.updateServingsIngredients(state.recipe); //Update Ingredients
    } else if (element.target.matches('.recipe__btn--add, .recipe__btn--add *')) { //Add Updated Ingredients To Shopping List
        controlList();
    } else if(element.target.matches('.recipe__love, .recipe__love *')) {
        controlLike();
    }
});













