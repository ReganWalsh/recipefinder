import {elements} from "./base"; //Import Elements Object From Base

export const renderItem = item => { //Render Item With Associated Values From Recipe
    const markup = `<li class="shopping__item" data-itemid=${item.id}>
                    <div class="shopping__count">
                        <input type="number" value="${item.count}" step="${item.count}" class="shopping__count-value">
                        <p>${item.unit}</p>
                    </div>
                    <p class="shopping__description">${item.ingredient}</p>
                    <button class="shopping__delete btn-tiny">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-cross"></use>
                        </svg>
                    </button>
                </li>`;
    elements.shopping.insertAdjacentHTML('beforeend', markup); //Insert The HTML Into The Shopping list Item
};

export const deleteItem = id => { //Delete Item From Shopping List With Assiciated ID
    const item = document.querySelector(`[data-itemid="${id}"]`);
    if (item) item.parentElement.removeChild(item); //Remove Shopping List Item Child
};