// "use strict";

// let configButton = document.getElementById("config-button");
// let config = document.getElementById("config-options");

// // Function to toggle the display of basic info based on password input
// function toggleBasic() {
//     // Check if the password input is not empty and basic info is not visible
//     if (passwordInput.value.length > 0 && !isBasicVisible) {
//         isBasicVisible = true;
//         basicInfo.style.display = "block";
//         advancedButton.style.display = "block";
//     } else if (passwordInput.value.length === 0) {
//         // If password input is empty, hide basic info and advanced button
//         isBasicVisible = false;
//         basicInfo.style.display = "none";
//         advancedButton.style.display = "none";
//     }
//     // Call displayPasswordInfo whenever the input changes
//     displayPasswordInfo();
// }

// // Function to toggle the display of advanced info
// function toggleAdvanced() {
//     if (advancedInfo.style.display === "none") {
//         // Show advanced info and change button text
//         advancedInfo.style.display = "block";
//         advancedButton.textContent = "Hide Advanced Data";
//         isAdvancedVisible = true;
//     } else {
//         // Hide advanced info and change button text
//         advancedInfo.style.display = "none";
//         advancedButton.textContent = "Show Advanced Data";
//         isAdvancedVisible = false;
//     }
//     // Call displayPasswordInfo whenever the "Show Advanced" button is clicked
//     displayPasswordInfo();
// }

// function toggleConfig() {
//     if (config.style.display === "none") {
//         config.style.display = "block";
//         configButton.textContent = "Hide Config Menu";
//         isConfigVisible = true;
//     } else {
//         config.style.display = "none";
//         configButton.textContent = "Show Config Menu";
//         isConfigVisible = false;
//     }
// }

// let slider = document.getElementById("passLength");
// let output = document.getElementById("length");
// output.innerHTML = slider.value; // Display the default slider value

// // Update the current slider value (each time you drag the slider handle)
// slider.oninput = function () {
//     output.innerHTML = this.value;
// }


// // Event listener to continuously monitor the input field's value
// passwordInput.addEventListener("input", () => {
//     toggleBasic();
//     // Checks if the input field is empty and resets advanced info if needed
//     if (passwordInput.value.length === 0) {
//         isBasicVisible = false;
//         basicInfo.style.display = "none";
//         isAdvancedVisible = false;
//         advancedInfo.style.display = "none";
//         advancedButton.textContent = "Show Advanced Data";
//     }
//     // Call displayPasswordInfo whenever the input changes
//     displayPasswordInfo();
// });

// // Toggle advanced info when the button is clicked
// advancedButton.addEventListener("click", () => {
//     toggleAdvanced();
// });

// isAdvancedVisible = false;
// // Call toggleBasic()
// toggleBasic();