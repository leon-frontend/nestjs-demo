// todo: 该文件用于读取 yaml 环境变量配置文件
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import * as _ from 'lodash';

// 读取公共环境变量的 yaml 文件
const YAML_COMMON_CONFIG = 'config.yaml';
const commonPath = join(__dirname, '../config', YAML_COMMON_CONFIG);
const commonConfig = yaml.load(readFileSync(commonPath, 'utf8')); // 使用 yaml.laod 解析 yaml 文件，并返回一个对象

// 根据 NODE_ENV 变量的值决定读取开发环境还是生产环境的 yaml 文件
const YAML_ENV_CONFIG = `config.${process.env.NODE_ENV || 'development'}.yaml`;
const envPath = join(__dirname, '../config', YAML_ENV_CONFIG);
const envConfig = yaml.load(readFileSync(envPath, 'utf8'));

// 导出一个函数是为了在 app.module.ts 中的 load 配置项中使用
export default () => {
  // 使用 lodash 的 merge 方法将公共配置和当前环境配置合并成一个新的配置对象(深度合并)
  return _.merge(commonConfig, envConfig) as Record<string, any>;
};
