import {DOM, displayProjects, displayTodoList} from "./DOM";
import { addDays, format, formatDistance, formatRelative, subDays } from 'date-fns';
import Project from "./project";
import Item from "./todoitem";
import {saveToLocalStorage, loadPageFromStorage} from "./storage";

let projects = loadPageFromStorage().projectArray;
let projectNames = loadPageFromStorage().projectNameArray;


document.body.appendChild(DOM(projects, projectNames));

// controller js (build functionality)
const pageEvents = (() => {

    const projectButton = document.querySelector('#addnewproject');
    const todoButton = document.querySelector('#addItem');
    const projectModalCloseButton = document.querySelector('#closeProjectImg');
    const todoModalCloseButton = document.querySelector('#closeTodoModalImg');
    const newProjectButton = document.querySelector('#submitbutton');
    const projectItems = document.querySelectorAll('.project-item');
    const newTodoItemButton = document.querySelector('#addNewTodo');
    const deleteTaskButtons = document.querySelectorAll('.deleteItem');
    const removeProjectButtons = document.querySelectorAll('.removeProjectButton');
    const modifyButtons = document.querySelectorAll('.modifybutton');
    const projectModal = document.querySelector('.modal-container');
    const todoModal = document.querySelector('.todo-modal-container');
    const editTodoModal = document.querySelector('.modify-modal-container');
    const editTodoButton = document.querySelector('#changeTodo');
    const closeEditTodoModalButton = document.querySelector('#closeModifyTodoModalImg');

    const setButtonsFunctionality = (() => {
        projectButton.addEventListener('click', () => {
            projectModal.setAttribute('style', 'display: flex');
        });
        
        todoButton.addEventListener('click', () => {
            todoModal.setAttribute('style', 'display: flex')
        });
    
        projectModalCloseButton.addEventListener('click', () => {
            projectModal.setAttribute('style', 'display: none');
        });
    
        todoModalCloseButton.addEventListener('click', () => {
            todoModal.setAttribute('style', 'display: none');
        });

        closeEditTodoModalButton.addEventListener('click', () => {
            editTodoModal.setAttribute('style', 'display: none');
        });

    
        newProjectButton.addEventListener('click', () => {
            const projectName = document.querySelector('#projectname').value;
            handleProjects(projectName);
            projectModal.setAttribute('style', 'display: none');
            saveToLocalStorage(projects);
        });

        newTodoItemButton.addEventListener('click', () => {
            let currentProject = document.querySelector('#projectTitle').textContent;
            handleTasks(currentProject);
            const name = document.querySelector('#name');
            const date = document.querySelector('#time');
            const description = document.getElementById('description');
            name.value = date.value = description.value = "";
            todoModal.setAttribute('style', 'display: none');
            saveToLocalStorage(projects);
        });

        // edit opportunity
        editTodoButton.addEventListener('click', () => {
            const name = document.querySelector('#changename').value;
            const date = document.querySelector('#changetime').value; 
            const description = document.getElementById('changedescription').value;
            const prioritySelect = document.querySelector('#changepriority');
            const priority = prioritySelect[prioritySelect.selectedIndex].value;
            const itemId = document.querySelector('#taskid').value;
            const itemProject = document.querySelector("#project").value;
            let currentProject = getCurrentProject(itemProject);
            let currentProjectFolder = currentProject.getProjectItems();
            const toBeEdited = currentProjectFolder.filter(task => task.id == itemId)[0];
            
            toBeEdited.name = name;
            toBeEdited.date = date;
            toBeEdited.description = description;
            toBeEdited.priority = priority;
            const currentNavPoint = document.querySelector('#projectTitle');
            if(currentNavPoint.textContent == "Inbox"){
                swapTaskContent(displayTodoList(getAllProjectItems()));
            }else{
                swapTaskContent(displayTodoList(currentProjectFolder));
            }
            
            editTodoModal.setAttribute('style', 'display: none');
            
            saveToLocalStorage(projects);
            
        });

    })();

    // set main navbar events
    const setNavBarSectionEvents = (() => {

        const setInboxFunctionality = (() => {
            const inbox = document.querySelector('[data-navoption="Inbox"]');
            
            let title = document.querySelector("#projectTitle");
            inbox.addEventListener('click', () => {
                title.textContent = inbox.dataset.navoption;
                swapTaskContent(displayTodoList(getAllProjectItems()));
            });
        })();

        const todayFunctionality = (()=>{
            const todayNavPoint = document.querySelector('[data-navoption="Today"]');
            let title = document.querySelector("#projectTitle");
            todayNavPoint.addEventListener('click', () => {
                title.textContent = todayNavPoint.dataset.navoption;
                let allProjectTasks = getAllProjectItems();
                let currentDayTasks = allProjectTasks.filter(task => new Date(task.date).getDay() == new Date().getDay());
               
                swapTaskContent(displayTodoList(currentDayTasks));
            });

        })();

        const importantFunctionality = (() => {
            const importantNavPoint = document.querySelector('[data-navoption="Important"]');
            let title = document.querySelector("#projectTitle");
            importantNavPoint.addEventListener('click', () => {
                title.textContent = importantNavPoint.dataset.navoption;
                const allProjectTasks = getAllProjectItems();
                const importantTasks = allProjectTasks.filter(task => task.priority == "high");

                swapTaskContent(displayTodoList(importantTasks));
            });
        })()

    })();

    const setNavProjectSectionEvent = (items) => {
        items.forEach(item => {
            item.addEventListener('click' , () => {
                const projectTitle = document.querySelector('#projectTitle');
                
                let itemindex = item.dataset.index;
                projectTitle.textContent = projectNames[itemindex];
                console.log();
                swapTaskContent(displayTodoList(projects[itemindex].getProjectItems()));
            });
        });
    };

    // implement task delete opportunity
    const setRemoveTaskFunctionality = (buttons) => {

        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const project = document.querySelector(`[data-index="${e.target.id}"][data-item="true"]`);
                const taskProjectName = project.childNodes[1].childNodes[1].textContent
                const currentProject = getCurrentProject(taskProjectName);
                let currentProjectTasks = currentProject.getProjectItems();
                const taskIndex = currentProjectTasks.findIndex(task => task.id == e.target.id);

                if(currentProjectTasks.length == 1){ 
                    currentProjectTasks.shift();
                    refreshProjectFoler(currentProject);
                    saveToLocalStorage(projects);
                    swapTaskContent(displayTodoList(currentProjectTasks));
                    return;
                }

                currentProjectTasks.splice(taskIndex, 1);
                swapTaskContent(displayTodoList(currentProjectTasks));
                refreshProjectFoler(currentProject);
                saveToLocalStorage(projects);
                
            });
        });
    }

    // implement project delete opportunity
    const setRemoveProjectFunctionality = (buttons) => {
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                if(projects.length == 1) return;
                const projectTitle = document.querySelector('#projectTitle');
                const projectContainer = document.querySelector(`[data-index="${e.target.id}"]`);
                let currentProject = projects[e.target.id];

                projects.splice(e.target.id, 1);
                projectNames.splice(e.target.id, 1);
                swapProjectContent(displayProjects(projectNames));

                //since we must have one project minimum we can do this
                localStorage.removeItem(projectContainer.childNodes[0].childNodes[1].textContent);
                currentProject = projects[0].getProjectItems();
                swapTaskContent(displayTodoList(currentProject));
                projectTitle.textContent = projectNames[0];
                saveToLocalStorage(projects);
            });
        });
    }

    const setModifiTaskFunctionality = (buttons) => {
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                editTodoModal.setAttribute('style', 'display: flex');
                const name = document.querySelector('#changename');
                const date = document.querySelector('#changetime');
                const description = document.getElementById('changedescription');
                const prioritySelect = document.querySelector('#changepriority');
                const options = prioritySelect.querySelectorAll('option');
                const itemId = document.querySelector('#taskid');
                const itemProject = document.querySelector("#project");
                //get task information
                const project = document.querySelector(`[data-index="${e.target.id}"][data-item="true"]`);
                const taskProjectName = project.childNodes[1].childNodes[1].textContent;
                const taskProject = getCurrentProject(taskProjectName);
                const projectTasks = taskProject.getProjectItems();
                const task = projectTasks.filter(task => task.id == e.target.id)[0];
                // set the current values for the input field values
                itemProject.value = project.childNodes[1].childNodes[1].textContent;
                itemId.value = task.id;
                name.value = task.name;
                date.value = task.date;
                description.value = task.description;
                prioritySelect.selectedIndex = Array.from(options).findIndex(option => option.value == task.priority);
                editTodoModal.setAttribute('style', 'display: flex');
            });
        });
    }

    setNavProjectSectionEvent(projectItems);
    setRemoveTaskFunctionality(deleteTaskButtons);
    setRemoveProjectFunctionality(removeProjectButtons);
    setModifiTaskFunctionality(modifyButtons);

    return {
        setNavProjectSectionEvent,
        setRemoveTaskFunctionality,
        setRemoveProjectFunctionality,
        setModifiTaskFunctionality,
    }
})();

function handleProjects(projectName){
    projectNames.push(projectName);
    projects.push(Project(projectName));
    
    //rebuild project section with the new values
    swapProjectContent(displayProjects(projectNames));
}

// prevention bugs
function refreshProjectFoler(currentProject){
    let index = 1;
    for(let i = 0; i < currentProject.getProjectItems().length; i++){
        currentProject.getProjectItems()[i].id = index;
        index ++;
    }
}

function handleTasks(projectName){
    const name = document.querySelector('#name').value;
    const date = document.querySelector('#time').value; 
    const description = document.getElementById('description').value;
    const prioritySelect = document.querySelector('#priority');
    const priority = prioritySelect[prioritySelect.selectedIndex].value;

    if(name === "" || date === "" ) return alert('You must add a task name and due date.');

    let currentProject = getCurrentProject(projectName);
    let currentProjectFolder = currentProject.getProjectItems();
    let taskIndex = currentProjectFolder.length + 1;
    let item = Item(taskIndex, priority, name, date, currentProject.getProjectName(), description, false);
    currentProjectFolder.push(item);
    swapTaskContent(displayTodoList(currentProjectFolder));
}

const swapProjectContent = (newContent) => {
    const projectSection = document.querySelector('.project-section');
    const projectItemContainer = document.querySelector('.project-container');
    projectSection.removeChild(projectItemContainer);
    projectSection.appendChild(newContent);
     //after recreate the items we loose the functionality so we must set again
    const projectItems = document.querySelectorAll('.project-item');
    const removeProjectButtons = document.querySelectorAll('.removeProjectButton');

    pageEvents.setNavProjectSectionEvent(projectItems);
    pageEvents.setRemoveProjectFunctionality(removeProjectButtons);
}

const swapTaskContent = (newcontent) => {
    const todoItemsContainer = document.querySelector('.todo-items');
    const todoItems = document.querySelector('.items-container');
   

    todoItemsContainer.removeChild(todoItems);
    todoItemsContainer.appendChild(newcontent);
    const deleteTaskButtons = document.querySelectorAll('.deleteItem');
    const modifyButtons = document.querySelectorAll('.modifybutton');
    const todoButton = document.querySelector('#addItem');

    const title = document.querySelector('#projectTitle');

    if(!projectNames.includes(title.textContent)){
        todoButton.setAttribute('style', 'display: none');

        modifyButtons.forEach(button => {
            button.addEventListener('click', () => {
                alert('You can only change it in the folder');
            });
        });
        
        deleteTaskButtons.forEach(button => {
            button.addEventListener('click', () => {
                alert('You can only change it in the folder');
            });
        });   
        
    }else{
        todoButton.setAttribute('style', 'visibility: visible');
        //after recreate the items we loose the functionality so we must set again
        pageEvents.setRemoveTaskFunctionality(deleteTaskButtons);
        pageEvents.setModifiTaskFunctionality(modifyButtons);
    }
}

const getCurrentProject  = (name) => {
    if(name === undefined) return false;

    const currentProject = projects.filter(project => project.getProjectName() === name)[0];
    return currentProject;
}

const getAllProjectItems = () => {
    const allItems = [];
    projects.forEach(project => {
        let currentProjectTasks = project.getProjectItems();
        currentProjectTasks.forEach(task => {
            allItems.push(task);
        });
    });

    return allItems;
};

