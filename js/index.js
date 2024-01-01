


// search 


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

// search input
function searchInput(selector="", attribute="", input="", data="") {
  let array = []
  if (data.includes(input)) {
    // !! Nodelist
    array.push(document.querySelector(`${selector}[${attribute}*="${data}"][hidden]`))
  }
  return array
}



// Nodes


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
  // card.setAttribute("data-id", recipe.id);id
  card.dataset.recipeId = recipe.id
  card.setAttribute("title", recipe.name.toLowerCase());
  card.setAttribute("description", recipe.description.toLowerCase());
  card.setAttribute("appliance", recipe.appliance.toLowerCase());
  card.classList.add("card");
  time.classList.add("card__time");
  description.classList.add("description__text");
  descriptionContainer.classList.add("description__container");
  ingredients.classList.add("ingredients__container");
  // 
  name.textContent = recipe.name;
  ingredientsTitle.textContent = "Ingrédients";
  descriptionTitle.textContent = "Recette";
  description.textContent = recipe.description;
  time.textContent = `${recipe.time} min`;
  // 
  let ustensils = ""
  recipe.ustensils.forEach(ustensil => ustensils 
    ? ustensils += ` , ${ustensil.toLowerCase()}` 
    : ustensils += ustensil.toLowerCase())
  card.setAttribute("ustensils", ustensils.toLowerCase())
  // 
  let string = "";
  for (const obj of recipe.ingredients) {
    const ingredient = document.createElement("p");
    ingredient.classList.add("ingredient");
    string
      ? (string += " , " + obj.ingredient.toLowerCase())
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
  card.setAttribute("ingredients", string.toLowerCase());
  card.appendChild(image);
  card.appendChild(time);
  card.appendChild(name);
  descriptionContainer.appendChild(descriptionTitle);
  descriptionContainer.appendChild(description);
  card.appendChild(descriptionContainer);
  card.appendChild(ingredientsTitle);
  card.appendChild(ingredients);
  main.appendChild(card);
}

// Display Options
function displayOptions(selector, keywordsArray) {
  const elmt = document.getElementById(selector);
  const container = document.createElement("div");
  const searchContainer = document.createElement("div");
  const search = document.createElement("input");
  const searchIcon = document.createElement("span");
  //
  search.setAttribute("type", "search");
  search.classList.add("keyword__search");
  container.classList.add("keyword__container");
  searchIcon.classList.add("searchbar_icon_container");
  searchContainer.classList.add("searchbar__container");
  // 
  keywordsArray.forEach(function (value) {
    displayKeyword(selector, container, value)
  })
  fieldsSearchEventHandler(selector, search, keywordsArray);
  searchContainer.appendChild(search);
  searchContainer.appendChild(searchIcon);
  elmt.appendChild(searchContainer);
  elmt.appendChild(container);
}
// Display tag
function displayTag(name, selector) {
  const list = document.getElementById("tags");
  const item = document.createElement("li");
  const container = document.createElement("div");
  const title = document.createElement("h3");
  const closeBtn = document.createElement("span")
  //
  closeBtn.classList.add("close__button")
  item.classList.add("header_tags_item");
  container.classList.add("header_tags_item--container");
  title.classList.add("tag");
  title.textContent = name;
  title.setAttribute("name", name.toLowerCase());
  //
  tagsEventHandler(selector, name, closeBtn)
  container.appendChild(title);
  item.appendChild(container);
  item.appendChild(closeBtn);
  list.appendChild(item);
}

// Clear tags
function clearTag(selector) {
  const element = document.querySelector(`.header_tags_item:has(.tag[name="${selector}"])`);
  if (!element) return
  element.remove();
}

// Display keywords
function displayKeyword(selector, parent, keyword) {
  const option = document.createElement("span");
  option.textContent = keyword;
  option.classList.add("keyword");
  option.classList.add(selector) 
  option.setAttribute("name", keyword.toLowerCase());
  // 
  fieldsKeywordsEventHandler(selector, option, keyword)
  parent.appendChild(option)
}

// Show, enable or Hide, disable Elements
function toggleElements(option, selector) {
  const nodes = document.querySelectorAll(`.${selector}`);
  if (option === "hide") {
    console.log("hide : ", selector)
    nodes.forEach(function (element) {
      element.setAttribute("hidden", "")
    });
  }
  if (option === "show") {
    console.log("show : ", selector)
    nodes.forEach(function (element) {
      element.removeAttribute("hidden")
    });
  }
  if (option === "enable") {
    console.log("enable : ", selector)
    nodes.forEach(function (node) {
      if ( node.hasAttribute("hidden") ) node.removeAttribute("hidden")
    });
  }
  if (option === "disable") {
    console.log("disable : ", selector)
    nodes.forEach(function (node) {
      node.setAttribute("hidden", "")
    });
  }
}

// Update counter
function updateCardCount(message) {
  const cards = document.querySelectorAll(".card:not([hidden])");
  const results = document.getElementById("results");
  let count = cards.length
  if (count === 0 && message) { 
    results.textContent = `
    Aucune recette ne contient "${message}" . Vous pouvez chercher "tarte aux pommes", "Poisson", ect.`  ;
    return
  }
  results.textContent = `${count} resultats`;
}



// Events
  

// main searchbar events
function mainSearchFieldEventHandler(searchbar, model) {
  // search cards
  searchbar.addEventListener("input", (e) => {
      const [...ingredients] = model.ingredients 
      if (e.target.value.length < 3) {
        toggleElements("show", "card");
        updateCardCount();
        return;
      }
      toggleElements("hide", "card");
      for (let index = 0; index < model.titles.length; index++) {
        // const element = array[index];
        const nodes = searchInput(
          "article",
          "title",
          e.target.value.toLowerCase(),
          model.titles[index]
        );
        if (nodes && nodes.length > 0) {
          const nodesArray = Array.from(nodes)
          for (let index = 0; nodesArray.length > index ; index++) {
            nodesArray[index].removeAttribute("hidden")
          }
        }
        // nodes && nodes.length > 0
        //   ? nodes.forEach((node) => node.removeAttribute("hidden"))
        //   : null;
        updateCardCount(e.target.value);
      }
      for (let index = 0; index < model.description.length; index++) {
        // const element = model.description[index];
        const nodes = searchInput(
          "article",
          "description",
          e.target.value.toLowerCase(),
          model.description[index]
        );
        if (nodes && nodes.length > 0) {
          const nodesArray = array.from(nodes)
          for (let index = 0; nodesArray.length > index ; index++) {
            nodesArray[index].removeAttribute("hidden")
          }
        }
        // nodes && nodes.length > 0
        //   ? nodes.forEach((node) => node.removeAttribute("hidden"))
        //   : null;
        updateCardCount(e.target.value);
      }
      for (let index = 0; index < ingredients.length; index++) {
        // const element = ingredients[index];
        const nodes = searchInput(
          "article",
          "ingredients",
          e.target.value.toLowerCase(),
          ingredients[index]
        );
        if (nodes && nodes.length > 0) {
          const nodesArray = array.from(nodes)
          for (let index = 0; nodesArray.length > index ; index++) {
            nodesArray[index].removeAttribute("hidden")
          }
        }
        // nodes && nodes.length > 0
        //   ? nodes.forEach((node) => node.removeAttribute("hidden"))
        //   : null;
        updateCardCount(e.target.value);
      }
      // model.titles.forEach(title => {
      //   const nodes = searchInput("article", "title", e.target.value.toLowerCase(), title);
      //   nodes && nodes.length > 0 ? nodes.forEach(node => node.removeAttribute("hidden")) : null;
      //   updateCardCount(e.target.value);
      // });
      // // 
      // model.descriptions.forEach(description => {
      //   const nodes = searchInput("article", "description", e.target.value.toLowerCase(), description);
      //   nodes && nodes.length > 0 ? nodes.forEach(node => node.removeAttribute("hidden")) : null;
      //   updateCardCount(e.target.value);
      // });
      // // 
      // model.ingredients.forEach(ingredient => {
      //   const nodes = searchInput("article", "ingredients", e.target.value.toLowerCase(), ingredient);
      //   nodes && nodes.length > 0 ? nodes.forEach(node => node.removeAttribute("hidden")) : null;
      //   updateCardCount(e.target.value);
      // });
    });
}

// fields Searchbar Input  
function fieldsSearchEventHandler(selector, element, keywordsArray) {
  element.addEventListener("input", (e) => {
    if (e.target.value === "" || e.target.value.length < 3) {
      toggleElements("show", "keyword")
      return;
    }
    toggleElements("hide", `keyword.${selector}`)
    keywordsArray.forEach(function (keyword) {
      const nodes = searchInput("span", "name", e.target.value.toLowerCase(), keyword)
      nodes.length > 0 ? nodes.forEach(node => {node.removeAttribute("hidden")}) : null
    })
  });
}



/* **** */
// fields Keyword click
function fieldsKeywordsEventHandler(selector, element, keyword) {
  element.addEventListener("click", (e) => {
    // disable keyword
    const tags = document.querySelectorAll(`h3.tag`);
    if (element.hasAttribute("active")) {
      clearTag(keyword);
      element.removeAttribute("active");
      // 
      // disable cards
      toggleElements("disable", `card[${selector}*="${keyword}"]`)
      updateCardCount()
      return
      // 
    } else {
      // enable keyword
      displayTag(keyword, selector);
      element.setAttribute("active", "");
      // 
      // enable cards
      toggleElements("hide", "card:not([hidden])")
      toggleElements("enable", `card[${selector}*="${keyword}"]`)
      if (tags.length > 0) {
        tags.forEach(function (tag) {
          console.log(tag)
          toggleElements("enable", `card[${selector}*="${tag.getAttribute("name")}"]`)
          updateCardCount()
          return
        })
      }
      // toggleElements("show", "card")
      updateCardCount()
    }
  })
}

// tags
function tagsEventHandler(selector, keyword, btn) {
  btn.addEventListener("click", function (e) {
    clearTag(keyword);
    const tags = document.querySelectorAll(`h3.tag`);
    const span = document.querySelector(`.keyword[name="${keyword}"]`);
    span.removeAttribute("active");
    //
    // disable cards
    toggleElements("disable", `card[${selector}*="${keyword}"]`)
    if (tags.length === 0) {
      toggleElements("show", "card")
      updateCardCount()
      return
    }
    updateCardCount();
  });
}
/* **** */



// app

function init() {
  const Model = {
    // resultsCounter: 0,
    ingredients: new Set(),
    appliances: new Set(),
    ustensils: new Set(),
    titles: [],
    descriptions: [],
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
      this.descriptions.push(description);
    },
    setAll: function (all) {
      this.all.push(all);
    },
  };
  //
  for (const recipe in recipes) {
    initModel(recipes[recipe], Model);
    displayCards(recipes[recipe]);
  }
  // 
  updateCardCount();
  const searchbar = document.getElementById("searchbar");
  mainSearchFieldEventHandler(searchbar, Model);
  // 
  displayOptions("ingredients", Model.ingredients);
  displayOptions("appliance", Model.appliances);
  displayOptions("ustensils", Model.ustensils);
}
//
init();
