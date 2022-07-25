const Item = (id ,priority, name, date, project, description, completed) => {
    return {
        id: id,
        priority : priority,
        name: name,
        date: date,
        project: project,
        description: description,
        completed: completed
    }
}

export default Item;