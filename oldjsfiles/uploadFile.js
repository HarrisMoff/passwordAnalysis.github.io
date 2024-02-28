// "use strict";

// const worker = new Worker("js/worker.js");

// let fileUploaded = false;

// // Add an event listener to handle messages from the worker
// worker.onmessage = function (event) {
//     const analysisResults = event.data.analysisResults;
//     const strongestPassword = event.data.strongestPassword;

//     // Trigger the download with the analysis results and strongest password
//     generateDownload(analysisResults, strongestPassword);
// };

// function uploadFile() {
//     if (fileUploaded === false) {
//         const fileInput = document.getElementById('fileInput');
//         fileInput.click();
//         fileUploaded = true;
//     }
// }

// function handleFileUpload() {
//     const fileInput = document.getElementById('fileInput');

//     // Check if a file is selected
//     if (fileInput.files.length > 0) {
//         const file = fileInput.files[0];

//         // Create a FileReader object
//         const reader = new FileReader();

//         // Define a callback function to handle the file reading
//         reader.onload = function (event) {
//             // Access the file content as a string
//             const fileContent = event.target.result;

//             // Pass the file content to the worker
//             worker.postMessage({ fileContent });

//             // Clear the input value after passing to the worker
//             fileInput.value = null;
//         };

//         // Read the file as text
//         reader.readAsText(file);
//     } else {
//     }
// }

// function generateDownload(analysisResults, strongestPassword) {
//     const content = `Total Passwords: ${analysisResults.total}\n
//         Very Weak: ${analysisResults.veryWeak}\n
//         Weak: ${analysisResults.weak}\n
//         Moderate: ${analysisResults.moderate}\n
//         Strong: ${analysisResults.strong}\n
//         Very Strong: ${analysisResults.veryStrong}\n
//         \n
//         /***********************************************************************************************
//         DO NOT USE THIS PASSWORD IF IT'S FROM A LIST OF PASSWORDS ONLINE... IT IS LIKELY COMPROMISED!!!
//         IF IT'S A LIST OF PASSWORDS YOU CREATED/GENERATED FROM A TOOL... IT IS GOOD TO USE
//         ***********************************************************************************************/\n
//         Strongest Password: ${strongestPassword.password}\n
//         Guesses (log10): ${strongestPassword.guessesLog10}\n`;

//     const blob = new Blob([content], { type: 'text/plain' });
//     const downloadLink = document.createElement('a');
//     downloadLink.href = URL.createObjectURL(blob);
//     downloadLink.download = 'passwords_analysis_results.txt';
//     downloadLink.click();
//     fileUploaded = false
// }