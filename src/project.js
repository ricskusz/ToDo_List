const Project = (name) => {

    let items = [];

    const addProjectItem = (item) => {
        items.push(item);
    }

    const getProjectItems = () => {
        return items;
    }

    const getProjectName = () => {
        return name;
    }

    return {
        addProjectItem,
        getProjectItems,
        getProjectName,
        name
    }
}

export default Project;