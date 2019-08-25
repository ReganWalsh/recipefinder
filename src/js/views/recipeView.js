import {elements} from "./base";
import {Fraction} from 'fractional';

export const clearRecipe = () => { //Clear Current Recipe
    elements.recipe.innerHTML = '';
};

const formatCount = count => { //Format Numbers Into Fractions
    if (count) {
        //count = 2.5 --> 2 1/2
        //count = 0.5 --> 1/2
        const newCount = Math.round(count * 100) / 100;
        const [integer, decimal] = newCount.toString().split('.').map(el => parseInt(el, 10));
        if (!decimal) return count; //Return Whole Number If No Decimal
        if (integer === 0) {
            const fraction = new Fraction(count);
            return `${fraction.numerator}/${fraction.denominator}`;
        } else {
            const fraction = new Fraction(count - integer);
            return `${integer} ${fraction.numerator}/${fraction.denominator}`;
        }
    }
    return '?' //Otherwise Return ?
};

const createIngredient = ingredient => //Create Ingredient With Corresponding Values
                    `<li class="recipe__item">
                        <svg class="recipe__icon">
                            <use href="img/icons.svg#icon-check"></use>
                        </svg>
                        <div class="recipe__count">${formatCount(ingredient.count)}</div>
                        <div class="recipe__ingredient">
                            <span class="recipe__unit">${ingredient.unit}</span>
                            ${ingredient.ingredient}
                        </div>
                    </li>
`;

export const renderRecipe = (recipe, isLiked) => { //Render Whole Recipe With Ingredients And If It Is Liked
    const markup = `
            <figure class="recipe__fig">
                <img src="${recipe.img}" alt="${recipe.title}" class="recipe__img">
                <h1 class="recipe__title">
                    <span>${recipe.title}</span>
                </h1>
            </figure>
            <div class="recipe__details">
                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="img/icons.svg#icon-stopwatch"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
                    <span class="recipe__info-text"> minutes</span>
                </div>
                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="img/icons.svg#icon-man"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
                    <span class="recipe__info-text"> servings</span>

                    <div class="recipe__info-buttons">
                        <button class="btn-tiny btn-decrease" >
                            <svg>
                                <use href="img/icons.svg#icon-circle-with-minus"></use>
                            </svg>
                        </button>
                        <button class="btn-tiny btn-increase">
                            <svg>
                                <use href="img/icons.svg#icon-circle-with-plus"></use>
                            </svg>
                        </button>
                    </div>
                </div>
                <button class="recipe__love">
                    <svg class="header__likes">
                        <use href="img/icons.svg#icon-heart${isLiked ? '' : '-outlined'}"></use>
                    </svg>
                </button>
            </div>
            <div class="recipe__ingredients">
                <ul class="recipe__ingredient-list">
                    ${recipe.ingredients.map(element => createIngredient(element)).join('')}
                    </ul>
                <button class="btn-small recipe__btn recipe__btn--add">
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-shopping-cart"></use>
                    </svg>
                    <span>Add to shopping list</span>
                </button>
            </div>
            <div class="recipe__directions">
                <h2 class="heading-2">How to cook it</h2>
                <p class="recipe__directions-text">
                    This recipe was carefully designed and tested by
                    <span class="recipe__by">${recipe.author}</span>. Please check out directions at their website.
                </p>
                <a class="btn-small recipe__btn" href=${recipe.url} target="_blank">
                    <span>Directions</span>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-right"></use>
                    </svg>
                </a>
            </div>
    `;
    elements.recipe.insertAdjacentHTML('afterbegin', markup); //Add HTML Inside Element, Before Its Child
};

export const updateServingsIngredients = recipe => {
    document.querySelector('.recipe__info-data--people').textContent = recipe.servings; //Update Servings
    const countElements = Array.from(document.querySelectorAll('.recipe__count')); //Select Count From HTML
    countElements.forEach((element, i) => {
        element.textContent = formatCount(recipe.ingredients[i].count); //Format New Ingredients Count For Each Ingredient
    })
}
