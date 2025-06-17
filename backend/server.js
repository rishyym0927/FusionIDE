import 'dotenv/config';
import http from 'http';
import app from './app.js';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import projectModel from './models/project.model.js';
import messageModel from './models/message.model.js';
import { generateResult } from './services/ai.service.js';

const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
    },
});


io.use(async (socket, next) => {

    try {

        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[ 1 ];
        const projectId = socket.handshake.query.projectId;

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return next(new Error('Invalid projectId'));
        }


        socket.project = await projectModel.findById(projectId);


        if (!token) {
            return next(new Error('Authentication error'))
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-key');

        if (!decoded) {
            return next(new Error('Authentication error'))
        }


        socket.user = decoded;

        next();

    } catch (error) {
        next(error)
    }

})


io.on('connection', async socket => {
    socket.roomId = socket.project._id.toString()

    console.log('a user connected');

    socket.join(socket.roomId);

    // Send existing messages to the newly connected user
    try {
        const existingMessages = await messageModel.find({ 
            projectId: socket.project._id 
        }).sort({ timestamp: 1 }).limit(50); // Get last 50 messages
        
        socket.emit('load-messages', existingMessages);
    } catch (error) {
        console.error('Error loading existing messages:', error);
    }

    socket.on('project-message', async data => {
        const message = data.message;
        const aiIsPresentInMessage = message.includes('@ai');
        
        // Save user message to database
        try {
            const newMessage = new messageModel({
                projectId: socket.project._id,
                message: data.message,
                sender: {
                    _id: data.sender._id || socket.user._id,
                    email: data.sender.email || socket.user.email
                }
            });
            await newMessage.save();
        } catch (error) {
            console.error('Error saving message:', error);
        }
        
        // Broadcast to other users
        socket.broadcast.to(socket.roomId).emit('project-message', data)

        if (aiIsPresentInMessage) {
            try {
                const prompt = message.replace('@ai', '').trim();
                
                if (!prompt) {
                    const aiResponse = {
                        message: JSON.stringify({
                            "text": "Please provide a prompt after @ai. For example: '@ai create a react component'"
                        }),
                        sender: {
                            _id: 'ai',
                            email: 'AI Assistant'
                        }
                    };

                    // Save AI response to database
                    const aiMessage = new messageModel({
                        projectId: socket.project._id,
                        message: aiResponse.message,
                        sender: aiResponse.sender
                    });
                    await aiMessage.save();

                    io.to(socket.roomId).emit('project-message', aiResponse);
                    return;
                }

                console.log('Generating AI response for prompt:', prompt);
                const result = await generateResult(prompt);
                console.log('AI response:', result);

                // Validate that result is valid JSON
                let parsedResult;
                try {
                    parsedResult = JSON.parse(result);
                } catch (parseError) {
                    console.error('Invalid JSON from AI:', parseError);
                    throw new Error('AI returned invalid JSON');
                }

                const aiResponse = {
                    message: result,
                    sender: {
                        _id: 'ai',
                        email: 'AI Assistant'
                    }
                };

                // If AI response contains fileTree, save it to database
                if (parsedResult.fileTree) {
                    try {
                        const updatedProject = await projectModel.findOneAndUpdate({
                            _id: socket.project._id
                        }, {
                            $set: {
                                fileTree: {
                                    ...socket.project.fileTree,
                                    ...parsedResult.fileTree
                                }
                            }
                        }, {
                            new: true
                        });
                        
                        console.log('FileTree updated in database via AI');
                        
                        // Update the socket's project reference
                        socket.project = updatedProject;
                    } catch (dbError) {
                        console.error('Error updating fileTree in database:', dbError);
                    }
                }

                // Save AI response to database
                const aiMessage = new messageModel({
                    projectId: socket.project._id,
                    message: result,
                    sender: aiResponse.sender
                });
                await aiMessage.save();

                io.to(socket.roomId).emit('project-message', aiResponse);

            } catch (error) {
                console.error('Error generating AI response:', error);
                
                const errorResponse = {
                    message: JSON.stringify({
                        "text": "Sorry, I encountered an error while processing your request. Please try again."
                    }),
                    sender: {
                        _id: 'ai',
                        email: 'AI Assistant'
                    }
                };

                // Save error message to database
                try {
                    const errorMessage = new messageModel({
                        projectId: socket.project._id,
                        message: errorResponse.message,
                        sender: errorResponse.sender
                    });
                    await errorMessage.save();
                } catch (saveError) {
                    console.error('Error saving error message:', saveError);
                }

                io.to(socket.roomId).emit('project-message', errorResponse);
            }
            return;
        }
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
        socket.leave(socket.roomId)
    });
});




server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})