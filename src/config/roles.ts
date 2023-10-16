const adminOnlyRoles = ['create_user','delete_task' , 'get_users'];
const regularRoles = ['create_task', 'list_tasks', 'get_user','get_tasks','get_task','delete_user', 'update_task', 'view_user', 'update_user'];

const admiinRoles = adminOnlyRoles.concat(regularRoles);

const allRoles = {
  regular: regularRoles,
  admin: admiinRoles,
};

export const roles: string[] = Object.keys(allRoles);
export const roleRights: Map<string, string[]> = new Map(Object.entries(allRoles));
