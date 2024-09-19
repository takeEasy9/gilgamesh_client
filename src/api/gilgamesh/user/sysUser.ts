/**
 * 用户模块接口列表
 */

import { baseUrl, gilgameshRequest } from '@/api//base';

interface User {
  userId?: number;
  username: string;
  password: string;
  verifyCode: string;
}
// 用户相关接口
const sysUser = {
  login: async (user: User) => gilgameshRequest.post(`${baseUrl.gilgamesh}/login`, user),
};

export default sysUser;
