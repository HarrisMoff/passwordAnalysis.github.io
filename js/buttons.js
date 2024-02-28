"use strict";

/*******************************************************************************************************************/
/*
 *
 * File Upload,
 * Copy,
 * Clear Buttons
 * 
 * /
/*******************************************************************************************************************/

const uploadWorker = new Worker("js/uploadWorker.js"); // Web Worker

let fileUploaded = false;

// used to disable generate password button when copy button is disabled to avoid generating a new password over the password being copied
let copyButtonVal = false;

// An event listener to handle messages from the uploadWorker
uploadWorker.onmessage = function (event) {
    const analysisResults = event.data.analysisResults;
    const strongestPassword = event.data.strongestPassword;
    const weakestPassword = event.data.weakestPassword;
    const processingTime = event.data.processingTime;

    // Triggers the download
    generateDownload(analysisResults, weakestPassword, strongestPassword, processingTime);
};

const uploadButton = document.getElementById("upload-button");
//Event listner for the upload button being clicked
uploadButton.addEventListener("click", () => {
    //Checks to see if a file is has been uploaded before allowing another file to be uploaded
    if (!fileUploaded) {
        const fileInput = document.getElementById('fileInput');
        fileInput.click();
    } else if (fileUploaded) {
        alert("A file has been uploaded already. Wait for the file to be finished processing before uploading another file.");
    }
});

// Iterates through all elements with the class "input-copy-container"
document.querySelectorAll(".input-copy-container").forEach((copyLinkParent) => {
    // Finds the input field, upload, copy, and clear buttons within the container
    const inputField = copyLinkParent.querySelector(".input-copy-box");
    const copyButton = copyLinkParent.querySelector(".copy-button");
    const clearButton = copyLinkParent.querySelector(".clear-button");

    copyButtonVal = copyButton;

    //Input field
    inputField.addEventListener("focus", () => inputField.select());

    copyButton.addEventListener("click", () => {
        // Checks to see if the button is disabled to prevent multiple clicks
        if (!copyButton.disabled && inputField.value !== "") {
            // Select the content of the input field
            inputField.select();

            // Copy the selected text to the clipboard
            navigator.clipboard.writeText(inputField.value);

            // Store the original value of the input field
            const originalValue = inputField.value;

            // Change the input field string to "Copied!"
            inputField.value = "Copied!";

            // Disable the copy button to prevent multiple clicks
            copyButton.disabled = true;

            // After a 1-second delay, revert the input field string and re-enable the button
            setTimeout(() => {
                inputField.value = originalValue;
                copyButton.disabled = false;
            }, 1000);
        }
    });

    // Checks to see if the copy button is not disabled before clearing the input field
    clearButton.addEventListener("click", () => {
        if (!copyButton.disabled == true && inputField.value !== "") {
            inputField.value = "";
            //Makes sure basic and advanced info is hidden after input field is cleared
            toggleBasic();
            advancedInfo.style.display = "none";
        }

    });
});

function handleFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const fileUploadedTXT = document.getElementById('fileUploadedTXT');

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const extension = file.name.split('.').pop().toLowerCase();
        if (extension === 'txt') {
            // Check if a file is selected
            if (fileInput.files.length > 0) {

                fileUploaded = true;
                fileUploadedTXT.textContent = "Your file has been uploaded, don't refresh or leave this page... if you do the file will not be processed";
                setTimeout(() => {
                    fileUploadedTXT.textContent = "";
                }, 5000);

                const file = fileInput.files[0];

                // Create a FileReader object
                const reader = new FileReader();

                // Define a callback function to handle the file reading
                reader.onload = function (event) {
                    // Access the file content as a string
                    const fileContent = event.target.result;

                    // Pass the file content to the uploadWorker
                    uploadWorker.postMessage({ fileContent });

                    // Clear the input value after passing to the uploadWorker
                    fileInput.value = null;
                };
                // Read the file as text
                reader.readAsText(file);
            } else if (fileInput.files.length == 0) {
                uploadButton = false;
            }
        } else {
            alert("please upload a .txt file");
        }
    }
}

function generateDownload(analysisResults, weakestPassword, strongestPassword, processingTime,) {
    const content = `Total Passwords: ${analysisResults.total}\n
        Very Weak: ${analysisResults.veryWeak}\n
        Weak: ${analysisResults.weak}\n
        Moderate: ${analysisResults.moderate}\n
        Strong: ${analysisResults.strong}\n
        Very Strong: ${analysisResults.veryStrong}\n
        \n
        /***********************************************************************************************
        DO NOT USE THIS PASSWORD IF IT'S FROM A LIST OF PASSWORDS ONLINE... IT IS LIKELY COMPROMISED!!!
        IF IT'S A LIST OF PASSWORDS YOU CREATED/GENERATED FROM A TOOL... IT IS GOOD TO USE
        ***********************************************************************************************/\n
        Weakest Password: ${weakestPassword.password} (By Guesses (log10))\n
        Strongest Password: ${strongestPassword.password} (By Guesses (log10))\n
        Time to process file: ${processingTime}s\n`;

    const blob = new Blob([content], { type: 'text/plain' });
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'passwords_analysis_results.txt';
    downloadLink.click();
    fileUploaded = false;
}

/*******************************************************************************************************************/
/*
 *
 * Menus,
 * Password Generator Buttons
 * 
 * /
/*******************************************************************************************************************/

let configButton = document.getElementById("config-button");
let config = document.getElementById("config-options");

let passwordListButton = document.getElementById("password-list-button");
let passwordList = document.getElementById("password-list");
let passwordListDownloadButton = document.getElementById('passList-download-button');

// Event listener for the "Generate Password" button
const generateButton = document.getElementById("generate-password");
generateButton.addEventListener("click", function () {
    if (!copyButtonVal.disabled) {
        setGeneratedPassword();
        config.style.display = "none"
        configButton.textContent = "Show Config Menu";

    }
    if (generatedPasswords.length > 0) {
        passwordListButton.style.display = "block";

        const passwordListContainer = document.createElement("ol");

        // Assuming 'generatedPasswords' is an array of passwords
        generatedPasswords.forEach((password, index) => {
            const listItem = document.createElement("li");
            listItem.textContent = password;
            passwordListContainer.appendChild(listItem);
        });

        passwordList.innerHTML = `
    <style>
      #passList {
        padding: 10px 20px 20px 20px;
        font-size: 18px;
      }
    </style>
    <div class = "group-button">
        <div class="no-selecting">
            <div class="passListBtn" style="text-align:center;">
                <button
                    id="password-list-download-button"
                    class="genAdvanceBtn"
                    onclick="passwordListDownload()"
                    style="margin: 0px 20px 0px 20px;
                    width: 250px;"
                    >
                    Password List
                    <br>
                    <img src="assets/downloadIcon.svg" draggable="false" />
                </button>
                <button
                    id="password-hashes-download-button"
                    class="genAdvanceBtn"
                    onclick="passwordHashesDownload()"
                    style="margin: 0px 20px 0px 20px;
                    width: 250px;"
                    >
                    Password Hashes List
                    <br>
                    <img src="assets/downloadIcon.svg" draggable="false" />
                </button>
            </div>
    </div>

    <label id="passList">List of generated Password Hashes: </label>
    <br>
  `;

        // Append the ordered list to the container
        passwordList.appendChild(passwordListContainer);
    }
});

function passwordListDownload() {
    const joinedPasswords = generatedPasswords.join('\n');
    const blob = new Blob([joinedPasswords], { type: 'text/plain' });
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'generated_password_list.txt';
    downloadLink.click();
}

function passwordHashesDownload() {
    const joinedArray = generatedPasswordsandHashes.join('\n');
    const content = `
/***********************************************************************************************
This file contains the list of hashes using various algorithms including a salted hash for each
password. This is so you can see what your password would look like inside of a database where
it would be stored. It's also a good note to know that salted hashes are not the same as other 
salted hashes of the same password this is because the salt is generated each time a password is 
being hashed. This is so if a cybercriminal manages to get a database of salted hashes, if they 
are the same and they crack one, they won't have cracked multiple passwords.
***********************************************************************************************/\n
${joinedArray}\n`;


    const blob = new Blob([content], { type: 'text/plain' });
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'generated_hashes_list.txt';
    downloadLink.click();
}


// Function to toggle the display of basic info based on password input
function toggleBasic() {
    // Check if the password input is not empty and basic info is not visible
    if (passwordInput.value.length > 0 && !isBasicVisible) {
        isBasicVisible = true;
        basicInfo.style.display = "block";
        advancedButton.style.display = "block";
    } else if (passwordInput.value.length === 0) {
        // If password input is empty, hide basic info and advanced button
        isBasicVisible = false;
        basicInfo.style.display = "none";
        advancedButton.style.display = "none";
    }
    // Call displayPasswordInfo whenever the input changes
    displayPasswordInfo();
}

// Function to toggle the display of advanced info
function toggleAdvanced() {
    if (advancedInfo.style.display === "none") {
        // Show advanced info and change button text
        advancedInfo.style.display = "block";
        advancedButton.textContent = "Hide Advanced Data";
        isAdvancedVisible = true;
    } else {
        // Hide advanced info and change button text
        advancedInfo.style.display = "none";
        advancedButton.textContent = "Show Advanced Data";
        isAdvancedVisible = false;
    }
    // Call displayPasswordInfo whenever the "Show Advanced" button is clicked
    displayPasswordInfo();
}

function toggleConfig() {
    if (config.style.display === "none") {
        config.style.display = "block";
        configButton.classList.add('clicked');
        //configButton.style.backgroundColor = "#064b95"; // chnage these
        configButton.textContent = "Hide Config Menu";
        isConfigVisible = true;
    } else {
        config.style.display = "none";
        //configButton.style.backgroundColor = "#007bff"; // chnage these
        configButton.textContent = "Show Config Menu";
        isConfigVisible = false;
    }
}

function togglePasswordList() {
    if (passwordList.style.display === "none") {
        passwordList.style.display = "block";
        passwordListButton.textContent = "Hide Password List";
        isListVisible = true;
    } else {
        passwordList.style.display = "none";
        passwordListButton.textContent = "Show Password List";
        isListVisible = false;
    }
}

let slider = document.getElementById("passLength");
let output = document.getElementById("length");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function () {
    output.innerHTML = this.value;
}


// Event listener to continuously monitor the input field's value
passwordInput.addEventListener("input", () => {
    toggleBasic();
    // Checks if the input field is empty and resets advanced info if needed
    if (passwordInput.value.length === 0) {
        isBasicVisible = false;
        basicInfo.style.display = "none";
        isAdvancedVisible = false;
        advancedInfo.style.display = "none";
        advancedButton.textContent = "Show Advanced Data";
    }
    // Call displayPasswordInfo whenever the input changes
    displayPasswordInfo();
});

// Toggle advanced info when the button is clicked
advancedButton.addEventListener("click", () => {
    toggleAdvanced();
});

isAdvancedVisible = false;
// Call toggleBasic()
toggleBasic();