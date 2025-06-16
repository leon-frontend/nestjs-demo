// GET 请求 /user 路径时传递 Query 参数的类型
export interface GetUserDto {
  page: number;
  limit?: number;
  username?: string;
  roleId?: number; // 前端一般是一个下拉选择框
  gender?: number;
}
