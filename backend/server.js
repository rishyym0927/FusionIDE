import 'dotenv/config';
import http from 'http';
import app from './app.js';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import projectModel from './models/project.model.js';
import { generateResult } from './services/ai.service.js';

const port = process.env.PORT || 3000;



const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*'
    }
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

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return next(new Error('Authentication error'))
        }


        socket.user = decoded;

        next();

    } catch (error) {
        next(error)
    }

})


io.on('connection', socket => {
    socket.roomId = socket.project._id.toString()


    console.log('a user connected');



    socket.join(socket.roomId);

    socket.on('project-message', async data => {
        const message = data.message;
        const aiIsPresentInMessage = message.includes('@ai');
        
        // Broadcast to other users first
        socket.broadcast.to(socket.roomId).emit('project-message', data)

        if (aiIsPresentInMessage) {
            try {
                const prompt = message.replace('@ai', '').trim();
                
                if (!prompt) {
                    io.to(socket.roomId).emit('project-message', {
                        message: JSON.stringify({
                            "text": "Please provide a prompt after @ai. For example: '@ai create a react component'"
                        }),
                        sender: {
                            _id: 'ai',
                            email: 'AI'
                        }
                    });
                    return;
                }

                console.log('Generating AI response for prompt:', prompt);
                const result = await generateResult(prompt);
                console.log('AI response:', result);

                // Validate that result is valid JSON
                try {
                    JSON.parse(result);
                } catch (parseError) {
                    console.error('Invalid JSON from AI:', parseError);
                    throw new Error('AI returned invalid JSON');
                }

                io.to(socket.roomId).emit('project-message', {
                    message: result,
                    sender: {
                        _id: 'ai',
                        email: 'AI'
                    }
                });

            } catch (error) {
                console.error('Error generating AI response:', error);
                
                // Send error message to users
                io.to(socket.roomId).emit('project-message', {
                    message: JSON.stringify({
                        "text": "Sorry, I encountered an error while processing your request. Please try again."
                    }),
                    sender: {
                        _id: 'ai',
                        email: 'AI'
                    }
                });
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