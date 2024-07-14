function openSideNav() {
  $(".side-nav-menu").animate(
    {
      left: 0,
    },
    500
  );

  $(".open-close-icon").removeClass("fa-align-justify");
  $(".open-close-icon").addClass("fa-x");

  for (let i = 0; i < 5; i++) {
    $(".links li")
      .eq(i)
      .animate(
        {
          top: 0,
        },
        (i + 5) * 100
      );
  }
}

function closeSideNav() {
  let boxWidth = $(".side-nav-menu .nav-tab").outerWidth();
  $(".side-nav-menu").animate(
    {
      left: -boxWidth,
    },
    500
  );

  $(".open-close-icon").addClass("fa-align-justify");
  $(".open-close-icon").removeClass("fa-x");

  $(".links li").animate(
    {
      top: 300,
    },
    500
  );
}

closeSideNav();
$(".side-nav-menu i.open-close-icon").click(() => {
  if ($(".side-nav-menu").css("left") == "0px") {
    closeSideNav();
  } else {
    openSideNav();
  }
});

async function home() {
  try {
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=`
    );
    let data = await response.json();
    displayHome(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function displayHome(arr) {
  closeSideNav();
  let box = "";
  arr.meals.slice(0, 20).forEach((item) => {
    box += `
      <div class="col-md-3 py-3 text-dark">
        <div class="img-card position-relative overflow-hidden rounded-2">
          <div onclick="getMealDetails('${item.idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
            <img src="${item.strMealThumb}" alt="" class="w-100" />
            <div class="layer-cat">
              <p class="fw-bolder fs-4 py-5 my-5 px-1">${item.strMeal}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  });
  rowData.innerHTML = box;
}

home();

let rowData = document.querySelector(".row");

function categories(arr) {
  let box = "";
  arr.forEach((item) => {
    box += `
      <div class="col-md-3 py-3 text-dark text-center">
        <div class="img-card position-relative overflow-hidden rounded-2">
          <div onclick="getCategoryMeals('${
            item.strCategory
          }')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
            <img src="${item.strCategoryThumb}" alt="" class="w-100" />
            <div class="layer">
              <p class="fw-bolder fs-3">${item.strCategory}</p>
              <p>${
                item.strCategoryDescription
                  ? item.strCategoryDescription
                      .split(" ")
                      .slice(0, 20)
                      .join(" ")
                  : ""
              }</p>
            </div>
          </div>
        </div>
      </div>
    `;
  });
  rowData.innerHTML = box;
}

async function getCategories() {
  rowDetails.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300);
  rowData.innerHTML = "";
  try {
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/categories.php`
    );
    let data = await response.json();
    categories(data.categories);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

document.querySelector("#Categories").addEventListener("click", () => {
  closeSideNav();
  getCategories();
});

async function getCategoryMeals(category) {
  rowData.innerHTML = "";
  try {
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
    );
    let data = await response.json();
    displayGetCategoryMeals(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function displayGetCategoryMeals(arr) {
  closeSideNav();
  let box = "";
  arr.meals.forEach((item) => {
    box += `
      <div class="col-md-3 py-3 text-dark ">
        <div class="img-card position-relative overflow-hidden rounded-2">
          <div onclick="getMealDetails('${item.idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
            <img src="${item.strMealThumb}" alt="" class="w-100" />
            <div class="layer-cat">
              <p class="fw-bolder fs-4 py-5 my-5 px-1">${item.strMeal}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  });
  rowData.innerHTML = box;
}

let rowDetails = document.querySelector("#rowDetails");

async function getMealDetails(idMeal) {
  rowData.innerHTML = "";
  try {
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`
    );
    let data = await response.json();
    displayGetMealDetails(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function displayGetMealDetails(arr) {
  closeSideNav();
  let box = "";
  arr.meals.forEach((item) => {
    let tagsText = item.strTags
      ? item.strTags.split(",").slice(0, 2).join(", ")
      : "";
    box += `
              <div class="col-md-3">
            <div class="img-details">
              <img class=" w-100" src="${item.strMealThumb}" alt="" />
              <h3>${item.strMeal}</h3>
            </div>
          </div>
          <div class="col-md-9">
            <h2>Instructions</h2>
            <p>
            ${item.strInstructions}
            </p>
            <p class=" fs-3 fw-semibold">Area : ${item.strArea}</p>
            <p class=" fs-3 fw-semibold">Category : ${item.strCategory}</p>
            <p class=" fs-3 fw-semibold">Recipes : </p>
            <ul class=' d-flex  flex-wrap text-dark list-unstyled'>
          ${renderIngredients(item)}
        </ul>
            
            <p class=" fs-3 fw-semibold">Tags : <span class='bg-danger-subtle text-danger-emphasis fs-5 rounded rounded-2 p-1'>${tagsText}</span></p>
            <a href="${
              item.strSource
            }" target='_blank' class="btn btn-success my-3 mx-1">Source</a>
            <a href="${
              item.strYoutube
            }"target='_blank' class="btn btn-danger my-3">Youtube</a>
          </div>
    `;
  });
  rowDetails.innerHTML = box;
}

function renderIngredients(item) {
  let ingredientsList = "";
  for (let i = 1; i <= 20; i++) {
    const ingredient = item[`strIngredient${i}`];
    const measure = item[`strMeasure${i}`];
    if (!ingredient || !measure) break;
    ingredientsList += `<li class=' bg-info-subtle border border-5 border-black  rounded rounded-3 p-1'>${measure} ${ingredient}</li>`;
  }
  return ingredientsList;
}

document.querySelector("#Area").addEventListener("click", () => {
  closeSideNav();
  getArea();
});

async function getArea() {
  rowDetails.innerHTML = "";
  rowData.innerHTML = "";
  try {
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
    );
    let data = await response.json();
    displayArea(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function displayArea(arr) {
  box = "";
  arr.meals.slice(0, 20).forEach((item) => {
    box += `
      <div class="col-md-3 text-center cursor-pointer py-5 px-3">
          <div class="" onclick="apiGetArea('${item.strArea}')">
            <i class = " fa-solid fa-house-laptop display-1"></i>
              <h3 class="py-3">${item.strArea}</h3>
          </div>
          </div>
      `;
  });
  rowData.innerHTML = box;
}

async function apiGetArea(area) {
  closeSideNav();
  rowData.innerHTML = "";
  try {
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
    );
    let data = await response.json();
    displayGetArea(data.meals.slice(0, 20));
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function displayGetArea(arr) {
  rowDetails.innerHTML = "";
  box = "";
  arr.forEach((item) => {
    box += `
      <div class="col-md-3 py-3 text-dark ">
        <div class="img-card position-relative overflow-hidden rounded-2">
          <div onclick="getMealDetails('${item.idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
            <img src="${item.strMealThumb}" alt="" class="w-100" />
            <div class="layer-cat">
              <p class="fw-bolder fs-4 py-5 my-5 px-1">${item.strMeal}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  });
  rowData.innerHTML = box;
}

document.querySelector("#Ingredients").addEventListener("click", () => {
  closeSideNav();
  Ingredients();
});

async function Ingredients() {
  rowDetails.innerHTML = "";
  rowData.innerHTML = "";
  try {
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
    );
    let data = await response.json();
    displayIngredients(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function displayIngredients(arr) {
  box = "";
  arr.meals.slice(0, 20).forEach((item) => {
    box += `
      <div class="col-md-3 text-center cursor-pointer py-5 px-3">
          <div class="" onclick="apiIngredients('${item.strIngredient}')">
            <i class="fa-solid fa-drumstick-bite fa-5x"></i>
              <h3 class="py-2">${item.strIngredient}</h3>
              <p>${item.strDescription.split(" ").slice(0, 20).join(" ")}</p>
          </div>
          </div>
      `;
  });
  rowData.innerHTML = box;
}

async function apiIngredients(strIngredient) {
  closeSideNav();
  rowData.innerHTML = "";
  try {
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${strIngredient}`
    );
    let data = await response.json();
    displayApiIngredients(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function displayApiIngredients(arr) {
  rowDetails.innerHTML = "";
  box = "";
  arr.meals.forEach((item) => {
    box += `
      <div class="col-md-3 py-3 text-dark ">
        <div class="img-card position-relative overflow-hidden rounded-2">
          <div onclick="getMealDetails('${item.idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
            <img src="${item.strMealThumb}" alt="" class="w-100" />
            <div class="layer-cat">
              <p class="fw-bolder fs-4 py-5 my-5 px-1">${item.strMeal}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  });
  rowData.innerHTML = box;
}

document.querySelector("#Search").addEventListener("click", () => {
  rowDetails.innerHTML = "";
  closeSideNav();
  displaySearch();
});

async function searchByName(Name) {
  closeSideNav();
  try {
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${Name}`
    );
    let data = await response.json();
    displaySearchResults(data.meals);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function displaySearchResults(meals) {
  rowDetails.innerHTML = "";
  if (!meals) {
    rowDetails.innerHTML =
      "<p class=' text-center fs-3 fw-semibold py-5'>No meals found</p>";
    return;
  }
  meals.forEach((meal) => {
    let mealBox = document.createElement("div");
    mealBox.classList.add("col-md-3", "mb-4");
    mealBox.innerHTML = `
      <div class="img-card position-relative overflow-hidden rounded-2 text-dark">
        <div onclick="getMealDetails('${meal.idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-100">
          <div class="layer-cat">
            <p class="fw-bolder fs-4 py-5 my-5 px-1">${meal.strMeal}</p>
          </div>
        </div>
      </div>
    `;
    rowDetails.appendChild(mealBox);
  });
}

function displaySearch() {
  box = `
                <div class="col-md-6">
            <input onkeyup="searchByName(this.value)" class="form-control search" type="text" placeholder="Search By Name">
          </div>
          <div class="col-md-6">
            <input oninput="checkFirstLetterInput(this)" class="form-control search" type="text" placeholder="Search By First Letter">
          </div>
    `;
  rowData.innerHTML = box;
}

async function searchByFirstLetter(firstLetter) {
  closeSideNav();
  try {
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?f=${firstLetter}`
    );
    let data = await response.json();
    displaySearchResults(data.meals);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function checkFirstLetterInput(input) {
  input.value = input.value.slice(0, 1).toLowerCase();
  if (input.value) {
    searchByFirstLetter(input.value);
  }
}

document.querySelector("#Contact").addEventListener("click", () => {
  rowDetails.innerHTML = "";
  closeSideNav();
  Contact();
});

function Contact() {
  let box = `
    
      <div class="col-md-6">
        <input id='nameInput' onkeyup="inputsValidation()" type="text" placeholder="Enter Your Name" class='form-control'>
        <div id="nameAlert" class="alert alert-danger text-center w-100 mt-2 d-none">
          Special characters and numbers not allowed
        </div>
      </div>
      <div class="col-md-6">
        <input id='emailInput' onkeyup="inputsValidation()" type="email" placeholder="Enter Your Email" class='form-control'>
        <div id="emailAlert" class="alert alert-danger text-center w-100 mt-2 d-none">
          Email not valid *exemple@yyy.zzz
        </div>
      </div>
      <div class="col-md-6">
        <input id='phoneInput' onkeyup="inputsValidation()" placeholder="Enter Your Phone" class='form-control'>
        <div id="phoneAlert" class="alert alert-danger text-center w-100 mt-2 d-none">
          Enter valid Phone Number
        </div>
      </div>
      <div class="col-md-6">
        <input id='ageInput' onkeyup="inputsValidation()" type="number" placeholder="Enter Your Age" class='form-control'>
        <div id="ageAlert" class="alert alert-danger text-center w-100 mt-2 d-none">
          Enter valid age
        </div>
      </div>
      <div class="col-md-6">
        <input id='passwordInput' onkeyup="inputsValidation()" type="password" placeholder="Enter Your Password" class='form-control'>
        <div id="passwordAlert" class="alert alert-danger text-center w-100 mt-2 d-none">
          Enter valid password *Minimum eight characters, at least one letter and one number:*
        </div>
      </div>
      <div class="col-md-6">
        <input id='repasswordInput' onkeyup="inputsValidation()" type="password" placeholder="RePassword" class='form-control'>
        <div id="repasswordAlert" class="alert alert-danger text-center w-100 mt-2 d-none">
          Enter valid repassword
        </div>
        
      </div>
      <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3 ">Submit</button>

  `;

  rowData.innerHTML = box;

  submitBtn = document.getElementById("submitBtn");

  document.getElementById("nameInput").addEventListener("focus", () => {
    nameInputTouched = true;
  });
  document.getElementById("emailInput").addEventListener("focus", () => {
    emailInputTouched = true;
  });
  document.getElementById("phoneInput").addEventListener("focus", () => {
    phoneInputTouched = true;
  });
  document.getElementById("ageInput").addEventListener("focus", () => {
    ageInputTouched = true;
  });
  document.getElementById("passwordInput").addEventListener("focus", () => {
    passwordInputTouched = true;
  });
  document.getElementById("repasswordInput").addEventListener("focus", () => {
    repasswordInputTouched = true;
  });
}

let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;

function inputsValidation() {
  if (nameInputTouched) {
    if (nValid()) {
      document
        .getElementById("nameAlert")
        .classList.replace("d-bock", "d-none");
    } else {
      document
        .getElementById("nameAlert")
        .classList.replace("d-none", "d-bock");
    }
  }
  if (emailInputTouched) {
    if (eValid()) {
      document
        .getElementById("emailAlert")
        .classList.replace("d-bock", "d-none");
    } else {
      document
        .getElementById("emailAlert")
        .classList.replace("d-none", "d-bock");
    }
  }
  if (phoneInputTouched) {
    if (pValid()) {
      document
        .getElementById("phoneAlert")
        .classList.replace("d-bock", "d-none");
    } else {
      document
        .getElementById("phoneAlert")
        .classList.replace("d-none", "d-bock");
    }
  }
  if (ageInputTouched) {
    if (aValid()) {
      document.getElementById("ageAlert").classList.replace("d-bock", "d-none");
    } else {
      document.getElementById("ageAlert").classList.replace("d-none", "d-bock");
    }
  }
  if (passwordInputTouched) {
    if (passValid()) {
      document
        .getElementById("passwordAlert")
        .classList.replace("d-bock", "d-none");
    } else {
      document
        .getElementById("passwordAlert")
        .classList.replace("d-none", "d-bock");
    }
  }
  if (repasswordInputTouched) {
    if (repassValid()) {
      document
        .getElementById("repasswordAlert")
        .classList.replace("d-bock", "d-none");
    } else {
      document
        .getElementById("repasswordAlert")
        .classList.replace("d-none", "d-bock");
    }
  }

  if (
    nValid() &&
    eValid() &&
    pValid() &&
    aValid() &&
    passValid() &&
    repassValid()
  ) {
    submitBtn.removeAttribute("disabled");
  } else {
    submitBtn.setAttribute("disabled", true);
  }
}

function nValid() {
  return /^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value);
}
function eValid() {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    document.getElementById("emailInput").value
  );
}

function pValid() {
  return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(
    document.getElementById("phoneInput").value
  );
}
function aValid() {
  return /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(
    document.getElementById("ageInput").value
  );
}
function passValid() {
  return /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(
    document.getElementById("passwordInput").value
  );
}
function repassValid() {
  return (
    document.getElementById("repasswordInput").value ==
    document.getElementById("passwordInput").value
  );
}
