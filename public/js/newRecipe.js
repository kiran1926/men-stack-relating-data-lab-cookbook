document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("add-ingredient-btn").addEventListener("click", addIngredient);
});

function addIngredient() {
    let inputField = document.getElementById("ingredient-input");
    let ingredientName = inputField.value.trim();

    if (ingredientName !== "") {
        // Create a hidden input for the new ingredient
        let hiddenInput = document.createElement("input");
        hiddenInput.type = "hidden";
        hiddenInput.name = "newIngredients[]"; // Important: Use newIngredients[] to match backend
        hiddenInput.value = ingredientName;

        // Append hidden input to form (ensure it's part of the form submission)
        document.querySelector("form").appendChild(hiddenInput);

        // Create a checkbox for the new ingredient (optional, just for UI purposes)
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = true;
        checkbox.disabled = true; // Disable since it’s always selected

        // Create a label for the checkbox
        let label = document.createElement("label");
        label.textContent = " " + ingredientName;

        // Create a container div for checkbox, label, and hidden input
        let div = document.createElement("div");
        div.appendChild(checkbox);
        div.appendChild(label);

        // Append to ingredient list
        document.getElementById("ingredient-list").appendChild(div);

        // Clear input field
        inputField.value = "";
    }
}
