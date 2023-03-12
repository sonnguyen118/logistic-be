const userModel = require("../models/userModel");

const userRoleService = {}


// role: role đối tượng cần xét
// rolesCanAccess: danh sách role có thể truy cập
userRoleService.checkUserHavePermission = async (userId, role, rolesCanAccess) => {
    if (rolesCanAccess.some(m => m == role)) {
        const user = await userModel.getUserRoleById(userId);
        if (!user || !rolesCanAccess.some(u => u == user.role)) {
            throw new Error('user does not have permission to access')
        }
    }

}

module.exports = userRoleService