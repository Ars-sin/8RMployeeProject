import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { addChangeLog, LOG_TYPES, createLogDescription } from './changeLogService';

const PROJECTS_COLLECTION = 'projects';

// Add new project
export const addProject = async (projectData) => {
  try {
    const projectDoc = {
      ...projectData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), projectDoc);
    const newProject = { id: docRef.id, ...projectDoc };
    
    // Log the activity
    await addChangeLog({
      type: 'PROJECT_ADDED',
      action: 'Create',
      description: `Project "${projectData.projectName}" was added`,
      projectId: docRef.id,
      projectName: projectData.projectName,
      performedBy: 'HR',
      details: {
        location: projectData.location,
        status: projectData.status
      }
    });
    
    return newProject;
  } catch (error) {
    console.error('Error adding project:', error);
    throw error;
  }
};

// Get all projects
export const getProjects = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, PROJECTS_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting projects:', error);
    throw error;
  }
};

// Update project
export const updateProject = async (projectId, updates) => {
  try {
    const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
    const updateData = {
      ...updates,
      updatedAt: Timestamp.now()
    };
    
    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    await updateDoc(projectRef, updateData);
    
    // Log the activity
    await addChangeLog({
      type: 'PROJECT_UPDATED',
      action: 'Update',
      description: `Project "${updates.projectName || 'Project'}" was updated`,
      projectId: projectId,
      projectName: updates.projectName,
      performedBy: 'HR',
      details: {
        updatedFields: Object.keys(updates)
      }
    });
    
    return { id: projectId, ...updateData };
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

// Delete project permanently
export const deleteProject = async (projectId) => {
  try {
    // Get project data first for logging
    const projects = await getProjects();
    const project = projects.find(proj => proj.id === projectId);
    
    await deleteDoc(doc(db, PROJECTS_COLLECTION, projectId));
    
    // Log the activity
    await addChangeLog({
      type: 'PROJECT_DELETED',
      action: 'Delete',
      description: `Project "${project?.projectName || 'Project'}" was deleted`,
      projectId: projectId,
      projectName: project?.projectName,
      performedBy: 'HR',
      details: {
        location: project?.location,
        status: project?.status
      }
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};
