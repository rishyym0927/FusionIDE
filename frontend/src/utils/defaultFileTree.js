export const getDefaultFileTree = () => ({
    "README.md": {
        "file": {
            "contents": `# Welcome to Your Development Environment

## 🚀 Quick Start

This is your collaborative coding workspace with real-time features.

### Create Your First Project

1. **Delete this README.md** when you're ready to start
2. **Create your main file** (e.g., \`app.js\`, \`index.html\`)
3. **Add dependencies** if building a Node.js app

### Example Node.js Setup

Create \`package.json\`:
\`\`\`json
{
  "name": "my-project",
  "version": "1.0.0",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
\`\`\`

Create \`app.js\`:
\`\`\`javascript
import express from 'express';
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
\`\`\`

## 🛠️ Platform Features

- **File Management**: Create, edit, delete files
- **Code Editor**: Syntax highlighting, auto-save
- **Project Execution**: Run your code with one click
- **Real-Time Chat**: Collaborate with team members
- **Live Preview**: See your app running instantly

## 🎯 Tips

- Use **Ctrl+S** to save files manually
- Click **Run** to execute your project
- Use **Chat** for team communication
- Files auto-save as you type

---

**Ready to code?** Delete this file and start building! 🚀`
        }
    }
})
