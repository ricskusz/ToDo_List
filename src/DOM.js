import Nav from "./navbar";

// import logos from another directory
function importAll(r) {
    let images = {};
    r.keys().map((item) => { images[item.replace('./', '')] = r(item); });
    return images;
}

const images = importAll(require.context('./nav_logos', false, /\.(png|jpe?g|svg)$/));

function getNav(){
    const navLogos = [
        "inbox.png",
        "calendar-today.png",
        "calendar-star.png",
    ];
    const navOptions = [
        "Inbox",
        "Today",
        "Important",
    ];

    const navBar = Nav();
    navBar.fillNav(navLogos, navOptions);
    const navbarContainer = document.createElement('div');
    navbarContainer.classList.add('navbar');
    const navMenus = document.createElement('div');
    navMenus.classList.add('nav-menus');

    const navItems = navBar.getNavItems();

    for(let i = 0; i < navItems.length; i++){
        const navItem = document.createElement('div');
        navItem.classList.add('nav-item');
        navItem.setAttribute('data-navoption', `${navOptions[i]}`);
        const navItemLogo = document.createElement('div');
        navItemLogo.classList.add('logo');
        const logo = document.createElement('img');
        logo.src = images[navItems[i].logo];
        navItemLogo.appendChild(logo);
        const navText = document.createElement('div');
        navText.classList.add('nav-text');
        navText.textContent = navItems[i].option;
        navItem.appendChild(logo);
        navItem.appendChild(navText);
        navMenus.appendChild(navItem);
    }

    navbarContainer.appendChild(navMenus);

    return navbarContainer;
}

function displayProjects(projectArray){

    const projectContainer = document.createElement('div');
    projectContainer.classList.add('project-container');


    for(let i = 0; i < projectArray.length; i++){

        let projectName = projectArray[i];

        if(projectName.length > 15){
            projectName = projectName.slice(0, 12);
            projectName += "...";
        };

        const projectItem = document.createElement('div');
        projectItem.classList.add('project-item');
        projectItem.setAttribute('data-index', `${i}`);
        const info = document.createElement('div');
        info.classList.add('info');
        const logoContainer = document.createElement('div');
        logoContainer.classList.add('project-logo');
        const projectLogo = document.createElement('img');
        projectLogo.src = images['folder.png'];
        logoContainer.appendChild(projectLogo);
        const projectItemTitle = document.createElement('div');
        projectItemTitle.classList.add('project-item-title');
        projectItemTitle.textContent = projectName;

        info.appendChild(logoContainer);
        info.appendChild(projectItemTitle);

        const modifySection = document.createElement('div');
        modifySection.classList.add('modify');
        const deleteIconContainer = document.createElement('div');
        deleteIconContainer.classList.add('project-logo');
        deleteIconContainer.classList.add('remove');
        const deleteIcon = document.createElement('img');
        deleteIcon.src = images['delete.png'];
        deleteIcon.setAttribute('id', `${i}`);
        deleteIcon.setAttribute('onclick', 'event.stopPropagation()');
        deleteIcon.classList.add('removeProjectButton');
        deleteIconContainer.appendChild(deleteIcon);

        modifySection.appendChild(deleteIconContainer);

        projectItem.appendChild(info);
        projectItem.appendChild(modifySection);

        projectContainer.appendChild(projectItem);
    }

    return projectContainer;
}

function displayTodoList(projectItems){

    const items_container = document.createElement('div');
    items_container.classList.add('items-container');

    for(let i = 0; i < projectItems.length; i++){

        const todo_item = document.createElement('div');
        todo_item.classList.add('todo-item');
        todo_item.setAttribute('data-index', `${i + 1}`);
        todo_item.setAttribute('data-item', 'true');
        const todo_name_container = document.createElement('div');
        todo_name_container.classList.add('todo-name');
        const priority = document.createElement('div');
        priority.classList.add('priority');

        switch(projectItems[i].priority){
            case "low": priority.classList.add('low'); break;
            case "medium": priority.classList.add('medium'); break;
            case "high": priority.classList.add('high'); break;
        }

        const todo_item_title = document.createElement('div');
        todo_item_title.classList.add('todo-title');
        todo_item_title.textContent = projectItems[i].name;

        todo_name_container.appendChild(priority);
        todo_name_container.appendChild(todo_item_title);

        const todo_info_container = document.createElement('div');
        todo_info_container.classList.add('todo-info');
        const todo_date = document.createElement('div');
        todo_date.classList.add('todo-date');
        todo_date.textContent = projectItems[i].date;
        const folderName = document.createElement('div');
        folderName.classList.add('folder-name');
        folderName.textContent = projectItems[i].project;
        const editImageContainer = document.createElement('div');
        editImageContainer.classList.add('edit');


        const editImage = document.createElement('img');
        editImage.src = images['text-box-edit-black.png'];
        editImage.setAttribute('id', `${i + 1}`);
        editImage.classList.add('modifybutton');
        editImageContainer.appendChild(editImage);
        const deleteImageContainer = document.createElement('div');
        deleteImageContainer.classList.add('delete');
        const deleteImage = document.createElement('img');
        deleteImage.src = images['delete_black.png'];
        deleteImage.classList.add('deleteItem');
        deleteImage.setAttribute('id', `${i + 1}`);
        deleteImageContainer.appendChild(deleteImage);

        todo_info_container.appendChild(todo_date);
        todo_info_container.appendChild(folderName);

        todo_info_container.appendChild(editImageContainer);
        todo_info_container.appendChild(deleteImageContainer);

        todo_item.appendChild(todo_name_container);
        todo_item.append(todo_info_container);
        items_container.appendChild(todo_item);
    }

    return items_container;
}

function displayProjectModal(){
    const modalContainer = document.createElement('div');
    modalContainer.classList.add('modal-container');

    const addNewProjectModal = document.createElement('div');
    addNewProjectModal.classList.add('add-new-project-modal');
    modalContainer.appendChild(addNewProjectModal);
    const modalTitle = document.createElement('div');
    modalTitle.classList.add('modal-title');
    const titleText = document.createElement('p');
    titleText.textContent = "New Project";
    const closeImage = document.createElement('img');
    closeImage.src = images['close.png'];
    closeImage.setAttribute('id', 'closeProjectImg');

    modalTitle.appendChild(titleText);
    modalTitle.appendChild(closeImage);

    const formContainer = document.createElement('div');
    formContainer.classList.add('newproject-form');

    const form = document.createElement('div');
    form.classList.add('form');
    const label = document.createElement('div');
    label.classList.add('label');
    label.textContent = "Name";
    const inputContainer = document.createElement('div');
    inputContainer.classList.add('project-name');
    const input = document.createElement('input');
    input.setAttribute('id', 'projectname');
    input.setAttribute('type', 'text');
    inputContainer.appendChild(input);

    form.appendChild(label);
    form.appendChild(inputContainer);

    formContainer.appendChild(form);

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('id', 'submitbutton');
    button.textContent = "Create";
    buttonContainer.appendChild(button);

    addNewProjectModal.appendChild(modalTitle);
    addNewProjectModal.appendChild(formContainer);
    addNewProjectModal.appendChild(buttonContainer);

    modalContainer.appendChild(addNewProjectModal);

    return modalContainer;
}

function displayToDoModal(){
    const todoModalContainer = document.createElement('div');
    todoModalContainer.classList.add('todo-modal-container');

    let modalTitleText = "New task";

    const todoModal = document.createElement('div');
    todoModal.classList.add('todo-modal');
    const todoModalTitleContainer = document.createElement('div');
    todoModalTitleContainer.classList.add('todo-modal-title');
    const title = document.createElement('p');
    title.textContent = modalTitleText;
    const closeImage = document.createElement('img');
    closeImage.src = images['close.png'];
    closeImage.setAttribute('id', 'closeTodoModalImg');

    todoModalTitleContainer.appendChild(title);
    todoModalTitleContainer.appendChild(closeImage);

    todoModal.appendChild(todoModalTitleContainer);

    const formItemContainer = document.createElement('div');
    formItemContainer.classList.add('form-item-container');

    const formItems = `
        <div class="form-item">
            <div class="item-label">Name</div>
            <div class="form-input">
                <input type="text" id="name">
            </div>
        </div>
        <div class="form-item">
            <div class="item-label">Due date</div>
            <div class="form-input">
                <input type="date" id="time">
            </div>
        </div>
        <div class="form-item">
            <div class="item-label">Description</div>
            <div class="form-input">
                <textarea id="description" cols="20" rows="3"></textarea>
            </div>
        </div>
        <div class="form-item">
            <div class="item-label">Priority</div>
            <div class="form-input">
                <select id="priority">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>
        </div>
    `;
    formItemContainer.innerHTML = formItems;

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');
    buttonContainer.classList.add('item-button');
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('id', 'addNewTodo');
    button.textContent = "Add";
    buttonContainer.appendChild(button);

    todoModal.appendChild(formItemContainer);
    todoModal.appendChild(buttonContainer);
    todoModalContainer.appendChild(todoModal);

    return todoModalContainer;

}

function displayModifyToDoModal(){
    const todoModalContainer = document.createElement('div');
    todoModalContainer.classList.add('modify-modal-container');

    let modalTitleText = "Edit task";

    const todoModal = document.createElement('div');
    todoModal.classList.add('modify-todo');
    const todoModalTitleContainer = document.createElement('div');
    todoModalTitleContainer.classList.add('todo-modal-title');
    const title = document.createElement('p');
    title.textContent = modalTitleText;
    const closeImage = document.createElement('img');
    closeImage.src = images['close.png'];
    closeImage.setAttribute('id', 'closeModifyTodoModalImg');

    todoModalTitleContainer.appendChild(title);
    todoModalTitleContainer.appendChild(closeImage);

    todoModal.appendChild(todoModalTitleContainer);

    const formItemContainer = document.createElement('div');
    formItemContainer.classList.add('form-item-container');

    const formItems = `
        <input type="hidden" id="taskid">
        <input type="hidden" id="project">
        <div class="form-item">
            <div class="item-label">Name</div>
            <div class="form-input">
                <input type="text" id="changename">
            </div>
        </div>
        <div class="form-item">
            <div class="item-label">Due date</div>
            <div class="form-input">
                <input type="date" id="changetime">
            </div>
        </div>
        <div class="form-item">
            <div class="item-label">Description</div>
            <div class="form-input">
                <textarea id="changedescription" cols="20" rows="3"></textarea>
            </div>
        </div>
        <div class="form-item">
            <div class="item-label">Priority</div>
            <div class="form-input">
                <select id="changepriority">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>
        </div>
    `;
    formItemContainer.innerHTML = formItems;

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');
    buttonContainer.classList.add('item-button');
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('id', 'changeTodo');
    button.textContent = "Change";
    buttonContainer.appendChild(button);

    todoModal.appendChild(formItemContainer);
    todoModal.appendChild(buttonContainer);
    todoModalContainer.appendChild(todoModal);

    return todoModalContainer;

}

function todoItemsContainerHeader(projectName){
    const todo_title = document.createElement('div');
    todo_title.classList.add('option-title');
    const projectTitle = document.createElement('p');
    projectTitle.setAttribute('style', 'margin: 0;');
    projectTitle.setAttribute('id', 'projectTitle');
    projectTitle.textContent = projectName;
    todo_title.appendChild(projectTitle);
    const addTodoImage = document.createElement('img');
    addTodoImage.src = images['plus-circle-black.png'];
    addTodoImage.setAttribute('id', 'addItem');
    todo_title.appendChild(addTodoImage);

    return todo_title;
}

const DOM = (projects, projectNames) => {
    //default project
    //default project end

    let content = document.createElement('div');
    content.classList.add('content');
    let pageBody = document.createElement('div');
    pageBody.classList.add('page-body');
    //header
    const header = document.createElement('div');
    header.classList.add('header');
    const headerText = document.createElement('div');
    headerText.classList.add('header-text');
    headerText.textContent = "TODO-Project";
    header.appendChild(headerText);
    const todoModal = displayToDoModal();
    const projectModal = displayProjectModal();
    const editTodoModal = displayModifyToDoModal();

   
    //navbar section
    const nav = getNav();
    //project section
    const projectSection = document.createElement('div');
    projectSection.classList.add('project-section');
    const title = document.createElement('div');
    title.classList.add('title');
    const text = document.createElement('p');
    text.textContent = "Projects";
    const addProjectImage = document.createElement('img');
    addProjectImage.src = images['plus-circle.png'];
    addProjectImage.setAttribute('id', 'addnewproject');
    title.appendChild(text);
    title.appendChild(addProjectImage);

    projectSection.appendChild(title);
    projectSection.appendChild(displayProjects(projectNames));

    nav.appendChild(projectSection);

    //{todo items container
    const todo_items_container = document.createElement('div');
    todo_items_container.classList.add('todo-items');
    todo_items_container.setAttribute('id', 'todocontainer');
    
    todo_items_container.appendChild(todoItemsContainerHeader(projects[0].getProjectName()));
    todo_items_container.appendChild(displayTodoList(projects[0].getProjectItems()));
    //todo items container}

    //page body section
    pageBody.appendChild(nav);
    pageBody.appendChild(todo_items_container);

    //page content looks like this
    content.appendChild(todoModal);
    content.appendChild(projectModal);
    content.appendChild(editTodoModal);
    content.appendChild(header);
    content.appendChild(pageBody);

    return content;
};

export {
    getNav,
    displayProjects,
    displayTodoList,
    displayProjectModal,
    DOM
}