// Displays cards
function displayCards(recipe) {
  const main = document.getElementById("main_content");
  const card = document.createElement("article");
  const name = document.createElement("h2");
  const image = document.createElement("img");
  const time = document.createElement("p");
  const descriptionContainer = document.createElement("div");
  const description = document.createElement("p");
  const ingredients = document.createElement("div");
  const descriptionTitle = document.createElement("h3");
  const ingredientsTitle = document.createElement("h3");
  //
  image.setAttribute("src", `./photos/${recipe.image}`);
  card.setAttribute("title", recipe.name.toLowerCase());
  card.classList.add("card");
  //   card.classList.add("hidden");
  time.classList.add("card__time");
  description.classList.add("description__text");
  descriptionContainer.classList.add("description__container");
  ingredients.classList.add("ingredients__container");
  name.textContent = recipe.name;
  ingredientsTitle.textContent = "Ingrédients";
  descriptionTitle.textContent = "Recette";
  card.setAttribute("description", recipe.description.toLowerCase());
  description.textContent = recipe.description;
  time.textContent = `${recipe.time} min`;
  //
  let string = "";
  ingredients.appendChild(ingredientsTitle);
  for (const obj of recipe.ingredients) {
    const ingredient = document.createElement("p");
    ingredient.classList.add("ingredient");
    string
      ? (string += "," + obj.ingredient.toLowerCase())
      : (string += obj.ingredient.toLowerCase());
    ingredient.textContent = obj.ingredient;
    if (obj.quantity) {
      ingredient.dataset["quantity"] = obj.quantity;
    }
    if (obj.unit) {
      ingredient.dataset["quantity"] = `${obj.quantity}${obj.unit}`;
    }
    ingredients.appendChild(ingredient);
  }
  card.setAttribute("ingredients", string);
  card.appendChild(image);
  card.appendChild(time);
  card.appendChild(name);
  descriptionContainer.appendChild(descriptionTitle);
  descriptionContainer.appendChild(description);
  card.appendChild(descriptionContainer);
  card.appendChild(ingredients);
  main.appendChild(card);
}
// Set tags
function initModel(recipe, model) {
  model.setTitle(recipe.name.toLowerCase());
  model.setDescription(recipe.description.toLowerCase());
  model.setAppliance(recipe.appliance.toLowerCase());

  //
  for (const obj of recipe.ingredients) {
    model.setIngredient(obj.ingredient.toLowerCase());
    model.setAll(obj.ingredient.toLowerCase());
  }
  //
  for (const str of recipe.ustensils) {
    model.setUstensil(str.toLowerCase());
  }
}
// Display ingredients
function displayOptions(selector, keywordsArray) {
  const elmt = document.getElementById(selector);
  const container = document.createElement("div");
  const searchContainer = document.createElement("div");
  const search = document.createElement("input");
  const searchIcon = document.createElement("span");
  //
  search.setAttribute("type", "search");
  container.classList.add("keyword__container");
  searchIcon.classList.add("searchbar_icon_container");
  searchContainer.classList.add("searchbar__container");
  inputEventHandler(search, keywordsArray);
  //
  searchContainer.appendChild(search);
  searchContainer.appendChild(searchIcon);
  elmt.appendChild(searchContainer);
  for (const str of keywordsArray) {
    const option = document.createElement("span");
    option.textContent = str;
    option.classList.add("keyword");
    option.setAttribute("name", str);
    container.appendChild(option);
  }
  elmt.appendChild(container);
  // elmt.classList.add("hidden")
}
// Display tag
function displayTag(name) {
  const list = document.getElementById("tags");
  const item = document.createElement("li");
  const title = document.createElement("h3");
  //
  item.classList.add("header_tags_item");
  title.classList.add("tag");
  title.textContent = name;
  title.setAttribute("name", name);
  //
  item.appendChild(title);
  list.appendChild(item);
}
// Clear tags
function clearTags(tag) {
  const elements = document.querySelectorAll("#tags > *");
  elements.forEach(function (element) {
    element.remove();
  });
}
// Hide cards
function toggleCards(option, counter) {
  const cards = document.querySelectorAll(".card");
  if (option === "hide") {
    cards.forEach(function (element) {
      element.classList.add("hidden");
    });
    return counter;
  }
  if (option === "show") {
    cards.forEach(function (element) {
      element.classList.remove("hidden");
    });
    return counter;
  }
}
// Display results
function updateResults() {
  const cards = document.querySelectorAll(".card:not(.hidden)");
  const results = document.getElementById("results");
  let count = 0;
  cards.forEach(function (card) {
    count += 1;
  });
  results.textContent = `${count} resultats`;
}
// Search
function searchTags(input, keywordsSet) {
  keywordsSet.forEach(function (keyword) {
    if (document.querySelector(`.tag[name="${keyword}"]`)) {
      return;
    }
    //
    if (input.length >= 3 && keyword.substring(0, input.length) === input) {
      displayTag(keyword);
    }
  });
}
//
// function searchIngredients(input, ingredientsSet) {
//   if (input.length < 3) return ["no recipes found"];
//   let arr = [];
//   for (const keyword of ingredientsSet) {
//     let temp = keyword.split(" ");
//     if (temp.length === 1) {
//       if (input.length >= 3 && temp[0].substring(0, input.length) === input) arr.push(keyword);
//     } else {
//       for (const str of temp) {
//         if (input.length >= 3 && str.substring(0, input.length) === input) arr.push(keyword);
//       }
//     }
//   }
// }
//  Input Events
function inputEventHandler(element, keywordsArray) {
  element.addEventListener("input", (e) => {
    if (e.target.value === "") {
      clearTags("");
      return;
    }
    searchTags(e.target.value, keywordsArray);
  });
}

// app
function init() {
  const Model = {
    resultsCounter: 0,
    ingredients: new Set(),
    appliances: new Set(),
    ustensils: new Set(),
    titles: [],
    description: [],
    all: [],
    setIngredient: function (ingredient) {
      this.ingredients.add(ingredient);
    },
    setAppliance: function (appliance) {
      this.appliances.add(appliance);
    },
    setUstensil: function (ustensil) {
      this.ustensils.add(ustensil);
    },
    setTitle: function (title) {
      this.titles.push(title);
    },
    setDescription: function (description) {
      this.description.push(description);
    },
    setAll: function (all) {
      this.all.push(all);
    },
    searchCardsBy: function (attribute, input, data) {
      let temp = data.split(" ");
      if (temp.length === 1) {
        if (temp[0].substring(0, input.length) === input) {
          return document.querySelector(`article[${attribute}="${data}"]`);
        }
      } else {
        for (const str of temp) {
          if (str.substring(0, input.length) === input) {
            return document.querySelector(`article[${attribute}="${data}"]`);
          }
        }
      }
    },
    // searchCardsByIngredients : function (input, string) {
    //     // if (input.length < 3) return ["not found"];
    //     let temp = string.split(" ");
    //     // if ( temp.length > 1 ) return ["search error !"]
    //     if (temp.length === 1) {
    //       if ( temp[0].substring(0, input.length) === input ) {
    //         // return document.querySelector(`.card > [name="${string}"]`)
    //       }
    //     } else {
    //       for (const str of temp) {
    //         if ( str.substring(0, input.length) === input ) {
    //             // return document.querySelector(`.card > [name="${string}"]`)
    //         }
    //       }
    //     }
    // },
    // searchCardsByDescription : function (input, string) {
    //     // if (input.length < 3) return ["not found"];
    //     let temp = string.split(" ");
    //     // if ( temp.length > 1 ) return ["search error !"]
    //     if (temp.length === 1) {
    //       if ( temp[0].substring(0, input.length) === input ) {
    //         // return document.querySelector(`.card > [name="${string}"]`)
    //       }
    //     } else {
    //       for (const str of temp) {
    //         if ( str.substring(0, input.length) === input ) {
    //             // return document.querySelector(`.card > [name="${string}"]`)
    //         }
    //       }
    //     }
    // },
  };
  //
  for (const recipe in recipes) {
    initModel(recipes[recipe], Model);
    displayCards(recipes[recipe]);
  }
  const searchbar = document.getElementById("searchbar");
  searchbar.addEventListener("input", (e) => {
    if (e.target.value.length < 3) {
      clearTags("");
      toggleCards("show", Model.resultsCounter);
      updateResults();
      return;
    }
    toggleCards("hide", Model.resultsCounter);
    // Find & Show cards
    for (const keyword of Model.titles) {
      const node = Model.searchCardsBy("title", e.target.value, keyword);
      node ? node.classList.remove("hidden") : null;
    }
    for (const keyword of Model.ingredients) {
      const node = Model.searchCardsBy("ingredients", e.target.value, keyword);
      node ? node.classList.remove("hidden") : null;
    }
    for (const keyword of Model.description) {
      const node = Model.searchCardsBy("description", e.target.value, keyword);
      node ? node.classList.remove("hidden") : null;
    }
    updateResults();
  });
  displayOptions("ingredients", Model.ingredients);
  displayOptions("appliance", Model.appliances);
  displayOptions("ustensils", Model.ustensils);
}
//
init();
