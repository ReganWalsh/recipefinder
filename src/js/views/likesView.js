import {elements} from "./base"; //Import Elements Object From Base
import {limitRecipeTitle} from "./searchView"; //Import Limit Reciple Title

export const toggleLikeButton = isLiked => { //Toggle Like Button
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined'; //If Liked, Then Filled Heart
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`); //Insert Heart Attributed Based On Like

};

export const toggleLikeMenu = numberOfLikes => {
    elements.likesMenu.style.visibility = numberOfLikes > 0 ? 'visible' : 'hidden'; //If No Likes Then Disable Visibility Of Likes Menu
};

export const renderLike = like => { //Create Like Based On Recipe
    const markup = `
                        <li>
                            <a class="likes__link" href="#${like.id}">
                                <figure class="likes__fig">
                                    <img src="${like.img}" alt="${like.title}">
                                </figure>
                                <div class="likes__data">
                                    <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
                                    <p class="likes__author">${like.author}</p>
                                </div>
                            </a>
                        </li>`;
    elements.likesList.insertAdjacentHTML('beforeend', markup); //Insert The Likes HTML Into List
};

export const deleteLike = id => { //Delete Like Based On ID
    const element = document.querySelector(`.likes__link[href*="#${id}"]`).parentElement;
    if(element) element.parentElement.removeChild(element);
};
