import projectModel from '../models/project.model.js';
import mongoose from 'mongoose';

export const createProject = async ({
    name, userId
}) => {
    if (!name) {
        throw new Error('Name is required')
    }
    if (!userId) {
        throw new Error('UserId is required')
    }

    let project;
    try {
        project = await projectModel.create({
            name,
            users: [ userId ]
        });
    } catch (error) {
        if (error.code === 11000) {
            throw new Error('Project name already exists');
        }
        throw error;
    }

    return project;

}


export const getAllProjectByUserId = async ({ userId }) => {
    if (!userId) {
        throw new Error('UserId is required')
    }

    const allUserProjects = await projectModel.find({
        users: userId
    }).populate('users')

    return allUserProjects
}

export const addUsersToProject = async ({ projectId, users, userId }) => {

    if (!projectId) {
        throw new Error("projectId is required")
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid projectId")
    }

    if (!users) {
        throw new Error("users are required")
    }

    if (!Array.isArray(users) || users.some(userId => !mongoose.Types.ObjectId.isValid(userId))) {
        throw new Error("Invalid userId(s) in users array")
    }

    if (!userId) {
        throw new Error("userId is required")
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid userId")
    }


    const project = await projectModel.findOne({
        _id: projectId,
        users: userId
    })

    console.log(project)

    if (!project) {
        throw new Error("User not belong to this project")
    }

    const updatedProject = await projectModel.findOneAndUpdate({
        _id: projectId
    }, {
        $addToSet: {
            users: {
                $each: users
            }
        }
    }, {
        new: true
    })

    return updatedProject



}

export const getProjectById = async ({ projectId }) => {
    if (!projectId) {
        throw new Error("projectId is required")
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid projectId")
    }

    const project = await projectModel.findOne({
        _id: projectId
    }).populate('users')

    if (!project) {
        throw new Error("Project not found")
    }

    // Ensure fileTree is initialized
    if (!project.fileTree) {
        project.fileTree = {}
    }

    return project;
}

export const updateFileTree = async ({ projectId, fileTree }) => {
    if (!projectId) {
        throw new Error("projectId is required")
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid projectId")
    }

    if (!fileTree) {
        throw new Error("fileTree is required")
    }

    console.log('Updating fileTree for project:', projectId, 'with data:', Object.keys(fileTree))

    const project = await projectModel.findOneAndUpdate({
        _id: projectId
    }, {
        fileTree
    }, {
        new: true
    })

    if (!project) {
        throw new Error("Project not found")
    }

    console.log('FileTree updated successfully')
    return project;
}

export const mergeFileTree = async ({ projectId, newFiles }) => {
    if (!projectId) {
        throw new Error("projectId is required")
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid projectId")
    }

    if (!newFiles) {
        throw new Error("newFiles is required")
    }

    // Get current project
    const currentProject = await projectModel.findById(projectId);
    if (!currentProject) {
        throw new Error("Project not found")
    }

    // Merge existing fileTree with new files
    const mergedFileTree = {
        ...currentProject.fileTree,
        ...newFiles
    };

    const project = await projectModel.findOneAndUpdate({
        _id: projectId
    }, {
        fileTree: mergedFileTree
    }, {
        new: true
    })

    return project;
}

export const updateFileContent = async ({ projectId, fileName, content }) => {
    if (!projectId) {
        throw new Error("projectId is required")
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid projectId")
    }

    if (!fileName) {
        throw new Error("fileName is required")
    }

    if (content === undefined) {
        throw new Error("content is required")
    }

    const project = await projectModel.findOneAndUpdate({
        _id: projectId
    }, {
        $set: {
            [`fileTree.${fileName}.file.contents`]: content
        }
    }, {
        new: true
    })

    return project;
}

export const createFolder = async ({ projectId, folderPath }) => {
    if (!projectId) {
        throw new Error("projectId is required")
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid projectId")
    }

    if (!folderPath) {
        throw new Error("folderPath is required")
    }

    const project = await projectModel.findOneAndUpdate({
        _id: projectId
    }, {
        $set: {
            [`fileTree.${folderPath}`]: {
                directory: {}
            }
        }
    }, {
        new: true
    })

    return project;
}

export const createFileInFolder = async ({ projectId, filePath, content = '' }) => {
    if (!projectId) {
        throw new Error("projectId is required")
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid projectId")
    }

    if (!filePath) {
        throw new Error("filePath is required")
    }

    const project = await projectModel.findOneAndUpdate({
        _id: projectId
    }, {
        $set: {
            [`fileTree.${filePath}`]: {
                file: {
                    contents: content
                }
            }
        }
    }, {
        new: true
    })

    return project;
}

export const deleteFileOrFolder = async ({ projectId, path }) => {
    if (!projectId) {
        throw new Error("projectId is required")
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid projectId")
    }

    if (!path) {
        throw new Error("path is required")
    }

    const project = await projectModel.findOneAndUpdate({
        _id: projectId
    }, {
        $unset: {
            [`fileTree.${path}`]: ""
        }
    }, {
        new: true
    })

    return project;
}