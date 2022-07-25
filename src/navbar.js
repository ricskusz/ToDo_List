const Nav = () => {
    const navItems = [];
    
    const fillNav = (logos, options) => {
        for(let i = 0; i < options.length; i++){
            addNavItem(logos[i], options[i]);
        }
    }

    const addNavItem = (logo, option) => {
        navItems.push({logo, option});
    }

    const getNavItems = () => {
        return navItems;
    }

    return {
        fillNav,
        addNavItem,
        getNavItems
    };
}

export default Nav;






