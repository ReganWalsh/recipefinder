import {elements} from "./base"; //Import Elements Object From Base

export const getInput = () => elements.searchInput.value; //Get Value Of The Search Field

export const clearInput = () => { //Clear Current Search Input
    elements.searchInput.value = '';
};

export const clearResults = () => { //Clear Returned Results
    elements.searchResultList.innerHTML = '';
    elements.searchResultPages.innerHTML = '';
};

export const highlightSelected = id => { //Highlight Selected Result
    const resultsArray = Array.from(document.querySelectorAll('.results__link'));
    resultsArray.forEach(element => {
        element.classList.remove('results__link--active') //Remove All Current Active Attributes
    });
    document.querySelector(`.results__link[href*="#${id}"]`).classList.add('results__link--active'); //Add Active Attribute For Current Link
};

export const limitRecipeTitle = (title, limit = 17) => { //17 Character Limit For Title, Following With ...
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((accuracy, current) => { //Split Words At The Spaces
            if(accuracy + current.length <= limit) {
                newTitle.push(current); //Push Reduced Title To Current Title
            }
            return accuracy + current.length;
        }, 0);
        return `${newTitle.join(' ')} ...`; //Return New Title Joined With Spaces + ...
    }
    return title; //Otherwise Return Original Title
};

const renderRecipe = recipe => { //Render Consolidated Recipe In Sidebar
    const markup = `<li>
                    <a class="results__link results__link--active" href="#${recipe.recipe_id}">
                        <figure class="results__fig">
                            <img src="${recipe.image_url}" alt="${recipe.title}">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                            <p class="results__author">${recipe.publisher}</p>
                        </div>
                    </a>
                </li>`;
    elements.searchResultList.insertAdjacentHTML('beforeend', markup); //Insert HTML After Child
};

const createButton = (page, type) => //'Prev' Or 'Next' Buttons
    `<button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>`;

const renderButtons = (page, numberOfResults, resultsPerPage) => { //Display Buttons In Interface
    const pages = Math.ceil(numberOfResults/resultsPerPage);
    let button;
    if (page === 1 && pages > 1) {
        button = createButton(page, 'next'); //Only Button To Go To Next Page
    } else if (page < pages) {
        button = `${createButton(page, 'next')}${createButton(page, 'prev')}`; //Both Buttons
    } else if (page === pages && pages > 1) {
        button = createButton(page, 'prev'); //Only Button To Go To Prev Page
    }

    elements.searchResultPages.insertAdjacentHTML('afterbegin', button); //Create Buttons Before Children
};

export const renderResults = (recipes, page = 1, resultsPerPage = 10) => {
    const start = (page-1) * resultsPerPage; //Render Results Of Current Page
    const end = page * resultsPerPage;
    recipes.slice(start, end).forEach(renderRecipe);
    renderButtons(page, recipes.length, resultsPerPage); //Render Page Buttons

};
