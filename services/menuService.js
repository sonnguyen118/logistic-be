
const menuService = {}
// role: role đối tượng cần xét
// rolesCanAccess: danh sách role có thể truy cập
menuService.arrangeMenu = (menu) => {
    for (let i = menu.length - 1; i >= 0; i--) {
        const parentId = menu[i].parent_id
        for (let j = 0; j < menu.length; j++) {
            if (menu[j].id == parentId) {
                if (!menu[j].subMenu) {
                    menu[j].subMenu = []
                }
                menu[j].subMenu.push(menu[i])
                menu.splice(i, 1);
            }
        }
    }
}

module.exports = menuService