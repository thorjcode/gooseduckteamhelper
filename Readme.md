# 项目名：鹅鸭杀组队小程序
## 技术：`vue`+`uniapp`+`阿里云`+`微信小程序`（时代的眼泪）
#
### 导入项目 配置项目过程，功能演示视频：https://www.bilibili.com/video/BV1os4y1P7mN/?share_source=copy_web&vd_source=652b50647b3da3ba324d79d31cc81632

1. 打开HBuilderX，导入项目；注：导入前先把“image_materials”图片素材文件夹移除项目目录，图片素材有中文可能会引起报错！！！

2. 修改微信小程序资源配置：
- 2-1. 点击 `manifest.json` 选择基础配置，获取uni-app应用标识。
- 2-2. 点击 `manifest.json` 选择微信小程序配置，把自己的微信小程序AppID填入。

3. 点击`uniCloud`右键——>`打开uniCloud Web控制台`——>`新建服务空间`——>服务商选择`阿里云`——>服务空间名称`duckdev`(注：任意写)；——>付费方式(建议先选免费，后面可以升级为付费)`免费`——>`立即购买`。
- 3-1. 等待片刻后，点击`uniCloud`右键——>`关联云服务空间或项目...`——>关联云服务空间——>选择刚刚创建的云空间`duckdev`(注：选你自己的)。
- 3-2.点击`uniCloud`——>点击`database`右键——>`上传所有DB Schema`（注：上传成功会自动在云数据库里创建以下数据表）。

    DuckUsers       //用户表，数据权限：都为：true（可读、可写）
    SysGameMap      //系统游戏地图表,数据权限：都为：true（可读、可写）
    SysGameMode     //系统游戏模式表，数据权限：都为：true（可读、可写）
    SysHeadImg      //系统用户头像表,数据权限：都为：true（可读、可写）
    SysMeTopImg     //系统我的页面背景表,数据权限：都为：true（可读、可写）
    SysNotice       //系统通知信息表，数据权限：都为：true（可读、可写）
    SysTeamType     //系统队伍类型表,数据权限：都为：true（可读、可写）
    TeamHall        //队伍大厅表,数据权限：都为：true（可读、可写）


4. 点击`uniCloud`——>点击`cloudfunctions`右键——>`上传所有云函数，公共模块等...`。
- 3-1.getOpenid是云函数获取OpenId，
- 3-2.deleteImgFile是云函数删除文件/图片等，
- 3-3.getTeamhall是云函数获取云数据库数据（队伍大厅数据），


5. 点击`uniCloud`右键——>`打开uniCloud Web控制台`——>选择服务空间`duckdev`——>云存储——>上传文件（注：上传两个初始系统可选用户头像，可在static文件夹——>iconimg文件夹里的male.jpg、female.jpg）——>上传成功后点击`详情`——>复制`下载地址`到pages(文件夹)——>me(文件夹)——>me.vue里的201行代码和204行代码。

6. 点击登录，登录后，手动去数据库里设置第一个初始的管理员信息，在 `DuckUsers`表里把admin修改为true,把 `level`字段修改为：2 (代表超级管理员，具有添加普通管理员的权限)、1 (代表普通管理员)、0（代表普通用户），管理员可以在后台页面管理小程序内容。

```json
    "admin":true,
    "level":2,
```

7. 微信小程序域名配置（要配置了真机调试才能服务阿里云数据库）：
- 8-1.打开微信公众平台——>登录小程序账号——>开发管理——>开发设置——>服务器域名——>配置request合法域名（注：把这些增加进去）：https://api.bspapp.com，https://api.next.bspapp.com
- 8-1.配置uploadFile合法域名（注：把这些增加进去）：https://bsppub.oss-cn-shanghai.aliyuncs.com

8. 运行——>运行到小程序模拟器——>微信开发者工具








