"use strict";

let passLengthSlider = document.getElementById("passLength");
let passLengthValue = document.getElementById("length");
let length = 18;

let lowercase = document.getElementById("lowercase");
let uppercase = document.getElementById("uppercase");
let numbers = document.getElementById("numbers");
let symbols = document.getElementById("symbols");

const MD5 = new Hashes.MD5;
const SHA1 = new Hashes.SHA1;
const SHA256 = new Hashes.SHA256;
const SHA512 = new Hashes.SHA512;
const RMD160 = new Hashes.RMD160;

let MD5hash = "";
let SHA1hash = "";
let SHA256hash = "";
let SHA512hash = "";
let RMD160hash = "";
let Bcrypthash = "";

let MD5salt = "";
let SHA1salt = "";
let SHA256salt = "";
let SHA512salt = "";
let RMD160salt = "";

// Array to hold generated passwords
let generatedPasswords = [];
let generatedPasswordsandHashes = [];

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
function generateRandomPassword() {
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
    }

    // Generate a unique salt for each hashing algorithm
    MD5salt = generateSalt();
    SHA1salt = generateSalt();
    SHA256salt = generateSalt();
    SHA512salt = generateSalt();
    RMD160salt = generateSalt();

    // Generate unsalted hashes
    MD5hash = "MD5 Hash: " + MD5.hex(password);
    SHA1hash = "SHA1 Hash: " + SHA1.hex(password);
    SHA256hash = "SHA256 Hash: " + SHA256.hex(password);
    SHA512hash = "SHA512 Hash: " + SHA512.hex(password);
    RMD160hash = "RMD160 Hash: " + RMD160.hex(password);
    Bcrypthash = "Bcrypt Hash: " + TwinBcrypt.hashSync(password) + ("\n") + ("\n");

    // Generate salted hashes
    const saltedMD5hash = "MD5 Salted Hash: " + hashWithSalt(MD5, password, MD5salt, 10) + ("\n");
    const saltedSHA1hash = "SHA1 Salted Hash: " + hashWithSalt(SHA1, password, SHA1salt, 10) + ("\n");
    const saltedSHA256hash = "SHA256 Salted Hash: " + hashWithSalt(SHA256, password, SHA256salt, 10) + ("\n");
    const saltedSHA512hash = "SHA512 Salted Hash: " + hashWithSalt(SHA512, password, SHA512salt, 10) + ("\n");
    const saltedRMD160hash = "RMD160 Salted Hash: " + hashWithSalt(RMD160, password, RMD160salt, 10) + ("\n");

    // console.log(MD5hash);
    // console.log("Salt: " + MD5salt);
    // console.log(saltedMD5hash);

    // console.log(SHA1hash);
    // console.log(saltedSHA1hash);

    // console.log(SHA256hash);
    // console.log("Salt: " + SHA256salt);
    // console.log(saltedSHA256hash);

    // console.log(SHA512hash);
    // console.log(saltedSHA512hash);

    // console.log(RMD160hash);
    // console.log(saltedRMD160hash);

    // console.log(Bcrypthash);

    // Add the data to respetive arrays
    generatedPasswords.push(password);
    generatedPasswordsandHashes.push(
        "Password: " + password + ("\n"),
        MD5hash,
        saltedMD5hash,

        SHA1hash,
        saltedSHA1hash,

        SHA256hash,
        saltedSHA256hash,

        SHA512hash,
        saltedSHA512hash,

        RMD160hash,
        saltedRMD160hash,

        Bcrypthash,
    );

    return password;
}

function hashWithSalt(hashFunction, password, salt, iterations) {
    let hashedPassword = hashFunction.hex(password + salt);

    for (let i = 1; i < iterations; i++) {
        hashedPassword = hashFunction.hex(hashedPassword + salt);
    }

    return hashedPassword;
}


// Function to set the generated password in the input field and trigger the input event
function setGeneratedPassword() {
    // Gets the password input field by its HTML id
    const passwordInput = document.getElementById("password");

    // Generates a random password using the generateRandomPassword function
    const generatedPassword = generateRandomPassword();

    // Sets the generated password as the value of the input field
    passwordInput.value = generatedPassword;

    // Creates a custom input event
    const event = new Event("input", {
        bubbles: true,
        cancelable: true,
    });

    // Triggers the custom input event on the password input field
    passwordInput.dispatchEvent(event);
}