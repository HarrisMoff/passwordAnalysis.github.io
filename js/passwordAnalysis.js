"use strict";

let isBasicVisible = false;
let isAdvancedVisible = false;
let isConfigVisible = false;
let isListVisible = false;

let passwordInput = document.getElementById("password");
let basicInfo = document.getElementById("basicInfo");
let advancedInfo = document.getElementById("advancedInfo");
let advancedButton = document.getElementById("advanced-button");

// Function to display password information
function displayPasswordInfo() {
    // Get DOM elements and user password from the input field
    const passwordInput = document.getElementById("password");
    const userPassword = passwordInput.value;
    const basicInfo = document.getElementById("basicInfo");
    const advancedInfo = document.getElementById("advancedInfo");

    // Uses the zxcvbn library to analyze the password
    const passwordAnalysis = zxcvbn(userPassword);
    const passwordScore = passwordAnalysis.score;
    const warningText = passwordAnalysis.feedback.warning || "No warnings";
    const suggestionText = passwordAnalysis.feedback.suggestions.join("<br>") || "No suggestions needed";

    // Determine the password strength based on the score
    let passwordStrengthText = "";
    switch (passwordScore) {
        case 0:
            passwordStrengthText += "Very Weak";
            break;
        case 1:
            passwordStrengthText += "Weak";
            break;
        case 2:
            passwordStrengthText += "Moderate";
            break;
        case 3:
            passwordStrengthText += "Strong";
            break;
        case 4:
            passwordStrengthText += "Very Strong";
            break;
        default:
            passwordStrengthText += "Unknown";
            break;
    }

    // Display basic password information
    basicInfo.innerHTML = `
    Password: ${userPassword}<br>
    Time to Crack: ${passwordAnalysis.crack_times_display.offline_slow_hashing_1e4_per_second}<br>
    Password Strength: ${passwordStrengthText}<br>
    Warnings: ${warningText}<br>
    Suggestions ${suggestionText}
  `;

    // If advanced info is visible, display additional details
    if (isAdvancedVisible) {
        advancedInfo.style.display = "block";
        let advancedInfoHTML = "";

        // Adds advanced information based on availability (If there is none, then it won't display leaving a null field)
        if (passwordAnalysis.guesses_log10 !== null && passwordAnalysis.guesses_log10 !== undefined) {
            advancedInfoHTML += `Guesses (log10): ${passwordAnalysis.guesses_log10.toFixed(5)}<br>`;
        }
        if (passwordAnalysis.calc_time !== null && passwordAnalysis.calc_time !== undefined) {
            advancedInfoHTML += `Function Runtime (ms): ${passwordAnalysis.calc_time}<br>`;
        }
        if (passwordAnalysis.crack_times_display) {
            // Display time to crack for different types of attacks
            advancedInfoHTML += "<br>Time to Crack Via Types of Attacks:<br>";
            if (passwordAnalysis.crack_times_display.online_throttling_100_per_hour !== null && passwordAnalysis.crack_times_display.online_throttling_100_per_hour !== undefined) {
                advancedInfoHTML += `- 100 / hour: ${passwordAnalysis.crack_times_display.online_throttling_100_per_hour} | throttled Online Attack <br>`;
            }
            if (passwordAnalysis.crack_times_display.online_no_throttling_10_per_second !== null && passwordAnalysis.crack_times_display.online_no_throttling_10_per_second !== undefined) {
                advancedInfoHTML += `- 10 / second: ${passwordAnalysis.crack_times_display.online_no_throttling_10_per_second} | Unthrottled Online Attack <br>`;
            }
            if (passwordAnalysis.crack_times_display.offline_slow_hashing_1e4_per_second !== null && passwordAnalysis.crack_times_display.offline_slow_hashing_1e4_per_second !== undefined) {
                advancedInfoHTML += `- 10k / second: ${passwordAnalysis.crack_times_display.offline_slow_hashing_1e4_per_second} | Offline Attack, Slow Hash, Many Cores <br>`;
            }
            if (passwordAnalysis.crack_times_display.offline_fast_hashing_1e10_per_second !== null && passwordAnalysis.crack_times_display.offline_fast_hashing_1e10_per_second !== undefined) {
                advancedInfoHTML += `- 10B / second: ${passwordAnalysis.crack_times_display.offline_fast_hashing_1e10_per_second} | Offline Attack, Fast Hash, Many Cores <br>`;
            }

            advancedInfoHTML += `<br>Match Sequence<br><br>`;

            // Display the "Match Sequence" information
            passwordAnalysis.sequence.forEach(sequenceItem => {
                advancedInfoHTML += `'${sequenceItem.token}'<br><br>`;

                if (sequenceItem.guesses_log10 !== null && sequenceItem.guesses_log10 !== undefined) {
                    advancedInfoHTML += `Pattern: ${sequenceItem.pattern}<br>`;
                    advancedInfoHTML += `Guesses (log10): ${sequenceItem.guesses_log10.toFixed(5)}<br>`;
                }
                if (sequenceItem.dictionary_name !== null && sequenceItem.dictionary_name !== undefined) {
                    advancedInfoHTML += `Dictionary Name: ${sequenceItem.dictionary_name}<br>`;
                }
                if (sequenceItem.rank !== null && sequenceItem.rank !== undefined) {
                    advancedInfoHTML += `Rank: ${sequenceItem.rank}<br>`;
                }
                if (sequenceItem.reversed !== null && sequenceItem.reversed !== undefined) {
                    advancedInfoHTML += `Reversed: ${sequenceItem.reversed}<br>`;
                }
                if (sequenceItem.l33t_subs !== null && sequenceItem.l33t_subs !== undefined) {
                    advancedInfoHTML += `L33t Subs: ${sequenceItem.l33t_subs}<br>`;
                }
                if (sequenceItem.base_token !== null && sequenceItem.base_token !== undefined) {
                    advancedInfoHTML += `Un-L33ted: ${sequenceItem.base_token}<br>`;
                }
                if (sequenceItem.base_guesses !== null && sequenceItem.base_guesses !== undefined) {
                    advancedInfoHTML += `Base Guesses: ${sequenceItem.base_guesses}<br>`;
                }
                if (sequenceItem.uppercase_variations !== null && sequenceItem.uppercase_variations !== undefined) {
                    advancedInfoHTML += `Uppercase Variations: ${sequenceItem.uppercase_variations}<br>`;
                }
                if (sequenceItem.l33t_variations !== null && sequenceItem.l33t_variations !== undefined) {
                    advancedInfoHTML += `L33t Variations: ${sequenceItem.l33t_variations}<br>`;
                }
                advancedInfoHTML += "<br>";
            });

            advancedInfo.innerHTML = advancedInfoHTML;
        } else {
            // Ensures that basic info is displayed when advanced info is hidden
            advancedInfo.style.display = "none";
            basicInfo.style.display = "block";
        }


    }
}
// Call the displayPasswordInfo function initially
displayPasswordInfo();