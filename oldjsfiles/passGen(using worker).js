"use strict";

let passLengthSlider = document.getElementById("passLength");
let passLengthValue = document.getElementById("length");
let length = 18;

let lowercase = document.getElementById("lowercase");
let uppercase = document.getElementById("uppercase");
let numbers = document.getElementById("numbers");
let symbols = document.getElementById("symbols");

let MD5salt = "";
let SHA1salt = "";
let SHA256salt = "";
let SHA512salt = "";
let RMD160salt = "";
let Bcryptsalt = "";

// Array to hold generated passwords
let generatedPasswords = [];
let generatedPasswordsandHashes = [];
let generatedPasswordsandSaltedHashes = [];

// Create a web worker
let hashWorker = new Worker('js/hashWorker.js');

// Initial value
passLengthValue.textContent = passLengthSlider.value;

// Event listener for the slider input
passLengthSlider.addEventListener("input", function () {
    // Define the generated password length
    length = passLengthValue.textContent;
});

// Add an event listener for checkbox changes
[lowercase, uppercase, numbers, symbols].forEach(function (checkbox) {
    checkbox.addEventListener("change", function () {
        // Check if at least one checkbox is checked
        if (!lowercase.checked && !uppercase.checked && !numbers.checked && !symbols.checked) {
            // If none are checked, recheck all checkboxes
            lowercase.checked = true;
            uppercase.checked = true;
            numbers.checked = true;
            symbols.checked = true;
        }
    });
});

// Function to generate a random salt
function generateSalt() {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const saltLength = 16;
    let salt = '';

    for (let i = 0; i < saltLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        salt += characters.charAt(randomIndex);
    }

    return salt;
}

// Function to generate a random password
function generateRandomPassword(callback) {
    // Define the characters set from which to generate the password
    let charset = (lowercase.checked ? "abcdefghijklmnopqrstuvwxyz" : "") +
        (uppercase.checked ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "") +
        (numbers.checked ? "0123456789" : "") +
        (symbols.checked ? "!@#$%^&*()_+{}[]|:;>,.?/" : "");

    // An empty string to store the generated password
    let password = "";

    // Generate the password by selecting random characters from the charset
    for (let i = 0; i < length; i++) {
        // Generate a random index within the length of the charset
        const randomIndex = Math.floor(Math.random() * charset.length);

        // Append the selected character to the password
        password += charset.charAt(randomIndex);

        // Generate a unique salt for each hashing algorithm
        MD5salt = generateSalt();
        SHA1salt = generateSalt();
        SHA256salt = generateSalt();
        SHA512salt = generateSalt();
        RMD160salt = generateSalt();

        if (password.length === length) {
            // Send data to the web worker for hashing and salting
            hashWorker.postMessage({
                password,
                MD5salt,
                SHA1salt,
                SHA256salt,
                SHA512salt,
                RMD160salt,
                iterations: 10,
            });
        }

        if (callback) {
            callback(password);
        }
    }
}

hashWorker.onmessage = function (e) {
    const result = e.data;

    // Add the data to respetive arrays
    generatedPasswords.push(result.password);
    generatedPasswordsandHashes.push(
        "Password: " + result.password + ("\n"),
        result.MD5hash,
        result.saltedMD5hash,
        result.SHA1hash,
        result.saltedSHA1hash,
        result.SHA256hash,
        result.saltedSHA256hash,
        result.SHA512hash,
        result.saltedSHA512hash,
        result.RMD160hash,
        result.saltedRMD160hash,
        result.Bcrypthash,
    );
}

// Function to set the generated password in the input field and trigger the input event
function setGeneratedPassword(callback) {
    // Gets the password input field by its HTML id
    const passwordInput = document.getElementById("password");

    // Call generateRandomPassword with a callback
    generateRandomPassword((generatedPassword) => {
        // Sets the generated password as the value of the input field
        passwordInput.value = generatedPassword;

        // Creates a custom input event
        const event = new Event("input", {
            bubbles: true,
            cancelable: true,
        });

        // Triggers the custom input event on the password input field
        passwordInput.dispatchEvent(event);

        // Invoke the callback if provided
        if (callback) {
            callback(generatedPassword);
        }
    });
}

