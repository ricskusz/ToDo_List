import Project from "./project";
import Item from "./todoitem"

// storage file


const saveToLocalStorage = (projects) => {
    projects.forEach(project => {
        localStorage.setItem(`${project.getProjectName()}`, `${JSON.stringify(project.getProjectItems())}`);
        let newProject = Project(project.getProjectName());
        let currentProjectTasks = JSON.parse(localStorage.getItem(`${project.getProjectName()}`));
        currentProjectTasks.forEach(task => {
            newProject.addProjectItem(task);
        });
    }); 
};

// read from localstorage
const loadPageFromStorage = () => {

    let projectArray = [];
    let projectNameArray = [];

    const currentKeys = Object.keys(localStorage);
    currentKeys.forEach(key => {
        let currentProjectTasks = JSON.parse(localStorage.getItem(`${key}`));
        let project = Project(key);
        currentProjectTasks.forEach(task => {
            project.addProjectItem(task);
        });
        projectArray.push(project);
        projectNameArray.push(key);
    });

    // demoproject
    if(projectArray.length <= 0){
        let demoProject = Project("Demo");
        demoProject.addProjectItem(Item(1, "low", "ToDo", "2022-07-26", demoProject.getProjectName(), "Your first ToDo item", false));
        projectArray.push(demoProject);
        projectNameArray.push(demoProject.getProjectName());
    }
    
    return{
        projectArray,
        projectNameArray
    }
};

export {
    saveToLocalStorage,
    loadPageFromStorage
};