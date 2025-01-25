//Get the reference to every input objects in the DOM
const addEntryButton = document.getElementById('add-entry');
const entryDropdown = document.getElementById('entry-dropdown');
const clearButton = document.getElementById('clear');
const calorieCounter = document.getElementById('calorie-counter');
const budgetNumberInput = document.getElementById('budget');
const output = document.getElementById('output');

//Initialize error flag to be false
let isError = false;

//Function to clean text input
function cleanInputString(str) {
    const regex = /[+-\s]/g;
    return str.replace(regex, '');
}

//Function to check if number type inputs are valid
function isInvalidInput(str) {
    const regex = /\d+e\d+/i;
    return str.match(regex);
}

//Function to add an entry based dropdown option
function addEntry() {
    const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
    const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length + 1;
    const HTMLString = `
    <label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
    <input type="text" id="${entryDropdown.value}-${entryNumber}-name" placeholder="Name" />
    <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
    <input type="number" min="0" id="${entryDropdown.value}-${entryNumber}-calories" placeholder="Calories"
    />`;
    targetInputContainer.insertAdjacentHTML('beforeend', HTMLString);
}

//Function to clear the form
function clearForm() {
    const inputContainers = Array.from(document.querySelectorAll('.input-container'));
  
    for (const container of inputContainers) {
      container.innerHTML = '';
    }
  
    budgetNumberInput.value = '';
    output.innerText = '';
    output.classList.add('hide');
}

//Function to generate calorie report
function calculateCalories(e) {
    e.preventDefault();
    isError = false;
  
    const breakfastNumberInputs = document.querySelectorAll("#breakfast input[type='number']");
    const lunchNumberInputs = document.querySelectorAll("#lunch input[type='number']");
    const dinnerNumberInputs = document.querySelectorAll("#dinner input[type='number']");
    const snacksNumberInputs = document.querySelectorAll("#snacks input[type='number']");
    const exerciseNumberInputs = document.querySelectorAll("#exercise input[type='number']");
  
    const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
    const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
    const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
    const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
    const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);
    const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);
  
    if (isError) {
      return;
    }
  
    const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
    const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;
    const surplusOrDeficit = remainingCalories < 0 ? 'Surplus' : 'Deficit';

    output.innerHTML = `
    <hr>
    <fieldset id="calorie-report">
      <legend>Calories Report</legend>
      <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
      <hr>
      <p>${budgetCalories} Calories Budgeted</p>
      <p>${consumedCalories} Calories Consumed</p>
      <p>${exerciseCalories} Calories Burned</p>
    </fieldset>`;
  
    output.classList.remove('hide');
}
  
function getCaloriesFromInputs(list) {
    let calories = 0;

    for (const item of list) {
        const currVal = cleanInputString(item.value);
        const invalidInputMatch = isInvalidInput(currVal);

        if (invalidInputMatch) {
            alert(`Invalid Input: ${invalidInputMatch[0]}`);
            isError = true;
            return null;
        }
        calories += Number(currVal);
    }
    return calories;
}

addEntryButton.addEventListener("click", addEntry);
clearButton.addEventListener("click",clearForm);
calorieCounter.addEventListener("submit", calculateCalories);