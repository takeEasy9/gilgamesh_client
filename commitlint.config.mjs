// commitlint.config.mjs
export default {
  extends: ['@commitlint/config-conventional'],
};

/*
git commit -m <type>[optional scope]: <description> //注意冒号后面有空格
- type：提交的改动类型（如新增、修改、更新等）
- optional scope：标识此次提交主要涉及到代码中哪个模块
- description：一句话描述此次提交的主要内容
常用type
feat 新增功能
fix bug 修复
style 不影响程序逻辑的代码修改(修改空白字符，补全缺失的分号等)
refactor 重构代码(既没有新增功能，也没有修复 bug)
docs 文档更新
test 增加测试
chore 构建过程或辅助工具的变动
 */
