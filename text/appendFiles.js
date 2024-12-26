const fs = require('fs');
const path = require('path');

// Directory where the text files are located
const inputDir = path.join(__dirname, './fi-finnish');

// Output file path (where the combined content will be saved)
const outputFile = path.join(__dirname, './fi-finnish/fi-finnish.txt');

// Function to append all files into a single file
function appendFiles() {
    // Read all files in the input directory
    fs.readdir(inputDir, (err, files) => {
        if (err) {
            console.error('Error reading input directory:', err);
            return;
        }

        // Filter out non-txt files
        const txtFiles = files.filter(file => file.endsWith('.txt'));

        // Limit to the first 114 txt files
        const filesToProcess = txtFiles.slice(0, 114);

        // Initialize a write stream to the output file
        const writeStream = fs.createWriteStream(outputFile, { flags: 'a' });

        // Iterate over the files and append their content
        filesToProcess.forEach((file, index) => {
            const filePath = path.join(inputDir, file);

            // Read each file asynchronously and process its content
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    console.error(`Error reading file ${file}:`, err);
                    return;
                }

                // Remove the last empty line if it exists
                const lines = data.split('\n');
                if (lines[lines.length - 1] === '') {
                    lines.pop(); // Remove the last empty line
                }

                // Append the processed content to the output file
                writeStream.write(lines.join('\n') + '\n', (err) => {
                    if (err) {
                        console.error('Error writing to output file:', err);
                    }
                });

                console.log(`Appended file: ${file} (${index + 1}/${filesToProcess.length})`);
            });
        });

        // Close the write stream after all files are processed
        writeStream.on('finish', () => {
            console.log('All files have been appended to combined.txt');
        });
    });
}

// Run the function to append files
appendFiles();
