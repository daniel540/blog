const fs = require('fs').promises;
const path = require('path');
const marked = require('marked');

// Adjust paths to work from the js/ directory
const postsDirectory = path.join(__dirname, '..', 'posts');
const outputDirectory = path.join(__dirname, '..', 'public');

// Define your blog name here
const blogName = "daniel.supply";

async function generatePosts() {
    try {
        // Ensure output directory exists
        await fs.mkdir(outputDirectory, { recursive: true });

        // Read all files in the posts directory
        const files = await fs.readdir(postsDirectory);
        const markdownFiles = files.filter(file => path.extname(file).toLowerCase() === '.md');

        let postsData = [];

        for (const file of markdownFiles) {
            const filePath = path.join(postsDirectory, file);
            const content = await fs.readFile(filePath, 'utf8');

            // Parse front matter (you might want to add a front matter parser library for this)
            const titleMatch = content.match(/^#\s+(.+)$/m);
            const title = titleMatch ? titleMatch[1] : 'Untitled Post';

            // Extract date from filename (assuming format: YYYY-MM-DD-title.md)
            const dateMatch = file.match(/^(\d{4}-\d{2}-\d{2})/);
            const date = dateMatch ? dateMatch[1] : 'Unknown Date';

            // Create URL-friendly filename without date
            const urlTitle = file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace('.md', '');
            const htmlFileName = `${urlTitle}.html`;

            const htmlContent = marked.parse(content);
            const htmlFilePath = path.join(outputDirectory, htmlFileName);

            // Generate HTML file
            const htmlTemplate = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${title} - ${blogName}</title>
                <link rel="stylesheet" href="../css/style.css">
                <link rel="icon" href="../favicon.ico" type="image/x-icon">
            </head>
            <body>
                <header>
                    <h1 class="site-title"><a href="../index.html">${blogName}</a></h1>
                    <nav>
                        <ul>
                            <li><a href="../index.html">Home</a></li>
                            <li><a href="../about.html">About</a></li>
                        </ul>
                    </nav>
                </header>
            
                <main>
                    <article class="blog-post">
                        <p class="date">${date}</p>
                        ${htmlContent}
                    </article>
                </main>
            
                <footer>
                    <p>&copy; 2024 ${blogName}. <a href="../impressum.html">Impressum</a></p>
                </footer>
            </body>
            </html>
                        `;

            await fs.writeFile(htmlFilePath, htmlTemplate);

            postsData.push({
                title,
                date,
                file: htmlFileName,
                preview: htmlContent.substring(0, 1000) // Get first 1000 characters as preview
            });
        }

        // Sort posts by date (newest first)
        postsData.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Generate posts index
        await fs.writeFile(
            path.join(outputDirectory, 'posts-data.js'),
            `const postsData = ${JSON.stringify(postsData, null, 2)};`
        );

        console.log('Posts generated successfully!');
    } catch (error) {
        console.error('Error generating posts:', error);
    }
}

generatePosts();