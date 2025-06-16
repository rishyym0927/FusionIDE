export const getDefaultFileTree = () => ({
    "README.md": {
        "file": {
            "contents": `# Welcome to Your Collaborative Development Environment

## 🚀 Getting Started

Welcome to your interactive development workspace! This platform provides a complete collaborative coding environment with real-time features and integrated tools.

## 📋 Platform Features

### 1. **File Management**
- **Create Files**: Click the "+" button in the file explorer to create new files
- **Delete Files**: Right-click on any file and select delete, or use the delete button
- **File Types**: Supports all common file types (JS, HTML, CSS, JSON, MD, etc.)
- **Auto-Save**: Your changes are automatically saved as you type

### 2. **Code Editor**
- **Syntax Highlighting**: Full syntax highlighting for multiple programming languages
- **Auto-Completion**: Intelligent code completion and suggestions
- **Keyboard Shortcuts**: 
  - \`Ctrl/Cmd + S\`: Save file
  - \`Ctrl/Cmd + Z\`: Undo
  - \`Ctrl/Cmd + Y\`: Redo
  - \`Ctrl/Cmd + F\`: Find in file
- **Line Numbers**: Navigate easily with line number references
- **Code Folding**: Collapse and expand code blocks

### 3. **Project Execution**
- **Run Button**: Execute your project with a single click
- **Stop Button**: Terminate running processes
- **Live Preview**: See your application running in real-time
- **Status Indicators**: Visual feedback on project status (Running, Stopped, Installing)

### 4. **Collaboration Features**
- **Real-Time Chat**: Communicate with team members instantly
- **Live Collaboration**: See changes from other developers in real-time
- **User Presence**: Know who's currently working on the project
- **Message History**: Access previous conversations and discussions

### 5. **Development Tools**
- **Console Logs**: View application output and debug information
- **Error Tracking**: Monitor and debug runtime errors
- **Process Management**: Control application lifecycle
- **Integrated Terminal**: Access to command-line tools

## 🛠️ How to Use This Platform

### Creating Your First Project

1. **Set Up Your Files**
   - Delete this README.md file when you're ready to start coding
   - Create your main application file (e.g., \`app.js\`, \`index.html\`)
   - Add a \`package.json\` if you're building a Node.js application

2. **Example Node.js Setup**
   \`\`\`json
   // package.json
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

3. **Example Express Server**
   \`\`\`javascript
   // app.js
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

### Running Your Project

1. **Click the "Run" button** in the top toolbar
2. **Monitor the logs** panel for output and errors
3. **View your application** in the preview panel on the right
4. **Stop the project** when you need to make changes

### Collaborating with Others

1. **Share your project** with team members
2. **Use the chat panel** to communicate in real-time
3. **See live updates** as others make changes
4. **Coordinate work** through the collaboration features

## 🎯 Best Practices

### Code Organization
- Use meaningful file and folder names
- Keep related files together
- Comment your code for better collaboration
- Follow consistent coding standards

### Collaboration Tips
- Communicate changes through chat before making major edits
- Use descriptive commit messages
- Test your code before sharing
- Respect others' work and coordinate conflicts

### Performance Optimization
- Keep file sizes reasonable for better loading times
- Use efficient coding practices
- Monitor console logs for performance issues
- Clean up unused files and dependencies

## 🔧 Troubleshooting

### Common Issues

**Project Won't Start**
- Check your \`package.json\` syntax
- Ensure all dependencies are properly defined
- Look for syntax errors in your main file

**Files Not Saving**
- Check your internet connection
- Ensure you have proper permissions
- Try refreshing the page if issues persist

**Collaboration Issues**
- Verify all team members have access
- Check that real-time updates are working
- Restart the project if sync issues occur

### Getting Help
- Use the chat feature to ask team members for help
- Check the console logs for detailed error messages
- Review your code for syntax errors
- Ensure all required files are present

## 📚 Supported Technologies

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- React, Vue.js, Angular
- Bootstrap, Tailwind CSS
- jQuery and other libraries

### Backend
- Node.js with Express
- Python with Flask/Django
- PHP applications
- Static file serving

### Databases & APIs
- REST API integration
- JSON data handling
- LocalStorage for client-side data
- External API connections

## 🌟 Advanced Features

### Custom Configurations
- Environment variables support
- Custom build scripts
- Multi-file project structures
- Package management

### Deployment Options
- Export your project files
- Share project links
- Download complete project
- Integration with Git repositories

---

## 🎉 Ready to Start Coding?

1. **Delete this README.md file**
2. **Create your project files**
3. **Start building something amazing!**

Happy coding! 🚀

---

*This collaborative development environment is designed to make coding together seamless and enjoyable. Explore all the features and make the most of your development experience!*`
        }
    }
})
