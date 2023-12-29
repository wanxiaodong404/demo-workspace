#!/bin/bash
serverName='demo-workspace'
# port=3110
echo '正在拉取最新代码'
git pull
echo '拉取最新代码成功'
# echo '正在安装依赖'
# npm install
# echo '安装依赖成功'
# echo '正在编译项目'
# npm run build
# echo '编译项目成功'
# echo '正在拉取nodeJs服务代码'
# echo '正在复制编译好的代码至服务目录下'
rm -rf ../wanxiaodong-static/static/$serverName
cp -R ./ ../wanxiaodong-static/static/$serverName
echo '复制成功=======>^-^'