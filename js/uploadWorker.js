importScripts('https://cdn.jsdelivr.net/npm/zxcvbn/dist/zxcvbn.js');

onmessage = function (event) {

    const fileContent = event.data.fileContent;

    // Split the content into an array of lines
    const lines = fileContent.split('\n');

    // Initialize variables to track the strongest password
    let strongestPassword = "";
    let strongestPasswordGuessesLog10 = Number.NEGATIVE_INFINITY
    let weakestPassword = "";
    let weakestPasswordGuessesLog10 = Number.POSITIVE_INFINITY

    const startTime = performance.now();

    // Perform the password analysis
    const analysisResults = { total: lines.length, veryWeak: 0, weak: 0, moderate: 0, strong: 0, veryStrong: 0 };

    lines.forEach(line => {
        const password = line.trim();
        if (password.length > 0) {
            const passwordAnalysis = zxcvbn(password);
            const strength = passwordAnalysis.score;

            switch (strength) {
                case 0:
                    analysisResults.veryWeak++;
                    break;
                case 1:
                    analysisResults.weak++;
                    break;
                case 2:
                    analysisResults.moderate++;
                    break;
                case 3:
                    analysisResults.strong++;
                    break;
                case 4:
                    analysisResults.veryStrong++;
                    break;
            }

            // Update the strongest password if needed
            if (passwordAnalysis.guesses_log10 > strongestPasswordGuessesLog10) {
                strongestPassword = line.trim();
                strongestPasswordGuessesLog10 = passwordAnalysis.guesses_log10;
            }
            if (passwordAnalysis.guesses_log10 < weakestPasswordGuessesLog10) {
                weakestPassword = line.trim();
                weakestPasswordGuessesLog10 = passwordAnalysis.guesses_log10;
            }
        }
    });

    const endTime = performance.now();
    const processingTime = ((endTime - startTime) / 1000).toFixed(2);

    // Post the analysis results back to the main thread
    postMessage({
        analysisResults,
        strongestPassword: {
            password: strongestPassword
        },
        weakestPassword: {
            password: weakestPassword
        },
        processingTime: processingTime
    });
};