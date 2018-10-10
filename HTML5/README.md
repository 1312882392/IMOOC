# 前言

由于这会是一篇很长的课程学习总结，为了优化大家的阅读体验，强烈建议安装Chrome浏览器的插件——GayHub。[下载安装地址](https://github.com/jawil/GayHub)，还有就是有问题尽量慕课里面私信给我，Issues就别提了<br>


# 1、FirstWxPro => [入门微信小程序](https://www.imooc.com/learn/974)

这是一门十分简单的小程序入门指南视频（应该说小程序本来就很简单），根据老师的提供的源码和素材，将其做了部分的结构和样式更改，有兴趣的可以下载该项目，运行查看结果。<br>

起步过于简单，在这不说明，请直接到[官方网站](https://developers.weixin.qq.com/miniprogram/dev/)开启自己的小程序之旅，下面整理一些自己认为重要的知识点。<br>

### 全局配置文件
app.json文件用来对微信小程序进行全局配置，决定页面文件的路径、窗口表现、设置网络超时时间、设置多 tab 等，具体的请[点击这里](https://developers.weixin.qq.com/miniprogram/dev/framework/config.html)<br>

### swiper组件的使用
[这个组件](https://developers.weixin.qq.com/miniprogram/dev/component/swiper.html?search-key=swiper)是比较常用的，说它比较重要，不仅仅是因为它的常用性，也因为它的栗子有十分好的借鉴性。<br>

结构代码<br>
```html
<swiper indicator-dots="{{indicatorDots}}" autoplay="{{autoplay}}" interval="{{interval}}" duration="{{duration}}" indicator-dots="true">
  <block wx:for="{{imgUrls}}" wx:key="">
    <swiper-item>
      <image src="{{item}}" class="slide-image" width="355" height="150"/>
    </swiper-item>
  </block>
</swiper>
```

脚本代码<br>
```js
Page({
  data: {
    imgUrls: [
      '/images/home1.jpg',
      '/images/home2.jpg',
      '/images/home3.jpg',
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    proList: null,
  }
})
```
说这个组件的使用具有借鉴性是因为将属性和属性值完全分离了来进行管理，在一定程度上来说，这是十分好的一种方式，结构代码和脚本代码分离便于管理和维护。<br>

### 调用数据的三种方式
在小程序中，一共有三种调用数据的方式，其中一种是调用后台数据，另外两种是调用本地数据，现在我们先来看一看最简单的本地数据调用方式：
```js
// 定义本地脚本数据
Page({
  data: {
    imgUrls: [
      '/images/home1.jpg',
      '/images/home2.jpg',
      '/images/home3.jpg',
    ]
  }
})

//调用本地数据
<block wx:for="{{imgUrls}}" wx:key="">
  <swiper-item>
    <image src="{{item}}" class="slide-image" width="355" height="150"/>
  </swiper-item>
</block>
```
第二种调用本地数据稍微复杂一些，它和Vue程序中调用json数据的方式完全不同，在小程序不能直接调用json文件中的数据，只能将数据保存在一个脚本文件中，然后将其exports出来，最后在需要调用数据的文件中导入，具体请看以下代码：
```js
// 步骤一：分离数据，将数据定义在顶层的data目录下
var joinList_data = [
  {
    "proName": "关于NBA",
    "proDesc": "NBA（National Basketball Association）是美国职业篮球联赛的简称",
    "id": "001"
  }
]
module.exports = {
  joinList: joinList_data
}

// 步骤二：在需要调用数据的脚本文件中引入
var joinListData = require("../../data/joinList.js");

// 步骤三：在周期函数中赋值
Page({
  data: {
    joinList: null
  },
  // 生命周期函数--监听页面加载
  onLoad: function () {
    this.setData({
      joinList: joinListData.joinList
    })
  }
})

// 步骤四：在结构代码中遍历数据
<view class='block' wx:for="{{joinList}}" wx:key="">
  <view class='block-title'>{{item.proName}}</view>
  <text class='block-desc'>{{item.proDesc}}</text>
</view>
```
第三种数据调用方式最重要，因为那是必须会的，这种方式是从后台请求回来数据进行使用，具体方式请看以下代码：
```js
Page({
  data: {
    proList: null,
  },
  onLoad: function () {
    this.getProList();
  }
  // API请求方法
  getProList: function(){
    var self = this;
    wx.request({
      url: 'http://guozhaoxi.top/wx/data.json',
      method: 'GET',
      success: function(res){
        self.setData({
          proList: res.data,
        })
      },
      fail: function(){
        console.log('调用数据失败');
      }
    })
  }
})

// 使用请求回来的数据
<view class='pro-item' wx:for="{{proList}}" wx:key=""></view>
```

### 组件之间的三种传值方式
一说到组件传值，相信有经验的开发人员都知道它的重要性，下面简单的来看看三种传值方式的代码。<br>

第一种：全局传值<br>
```js
// 步骤一：在全局脚本文件中定义数据
App({
  globalData: {
    userInfo: null,
    userName: '全局变量传值',
  }
})

// 步骤二：获取应用实例，不然无法调用全局变量
const app = getApp()

// 步骤三：调用全局变量
Page({
  data: {
  
  },
  onLoad: function (options) {
    console.log(app.globalData.userName);
  },
})
```

第二种：url传值
```js
// 步骤一：使用关键字bindtap绑定一个点击事件方法，data-index是传入一个值
<image class="btn-detail" src='/images/btn_detail.png' bindtap='toDetail' data-index='{{index}}'></image>

// 步骤二：在脚本文件中定义这个方法（方法并不是定义在一个methods集合中的）
Page({
  data: {},
  onLoad: function () {},
  toDetail: function(e){
    // index代表的遍历对象的下标
    var index = e.currentTarget.dataset.index;
    var proList = this.data.proList;
    var title = proList[index].proName;
    wx.navigateTo({
      url: '/pages/detail/detail?title='+title,
    })
  }
})

// 步骤三：在detail组件的脚本文件中接收title这个传入过来的值
Page({
  data: {},
  onLoad: function (options) {
    console.log(options.title);
  },
})
```

第三种：setStorageSync传值
```js
// 步骤一：使用关键字bindtap绑定一个点击事件方法，data-index是传入一个值
<image class="btn-detail" src='/images/btn_detail.png' bindtap='toDetail' data-index='{{index}}'></image>

// 步骤二：在脚本文件中定义这个方法（方法并不是定义在一个methods集合中的）
Page({
  data: {},
  onLoad: function () {},
  toDetail: function(e){
    var index = e.currentTarget.dataset.index;
    var proList = this.data.proList;
    var title = proList[index].proName;
    wx.setStorageSync('titleName', title);
    wx.navigateTo({
      url: '/pages/detail/detail',
    })
  }
})

// 步骤三：在detail组件的脚本文件中使用wx.getStorageSync接收titleName这个传入过来的值
Page({
  data: {},
  onLoad: function (options) {
    var titlen = wx.getStorageSync('titleName');
    console.log(titlen);
  },
})
```

#### 组件传值的应用场景
关于组件传值的应用，老师在视频中并没有给出，自己瞎琢磨出一个栗子，记住：**在真正开发中，千万别这么用。** 这个栗子的作用是让我们对组件的传值有一个大概的应用场景，下面请看代码实现：
```js
// 数据接收方
Page({
  data: {
    iskebi: false,
    iszhan: false,
    isqiao: false,
    isgeli: false
  },
  onLoad: function (options) {
    
  },
  onReady: function () {
    var titlee = wx.getStorageSync('titleName');
    console.log(titlee);
    if (titlee == '科比·布莱恩特') {
      this.setData({iskebi: true});
    } else if (titlee == '勒布朗·詹姆斯'){
      this.setData({ iszhan: true });
    } else if (titlee == '迈克尔·乔丹') {
      this.setData({ isqiao: true });
    } else{
      this.setData({ isgeli: true });
    }
  }
})

// 数据显示层
<view wx:if="{{iskebi}}">
  我是科比的球迷
</view>
<view wx:if="{{iszhan}}">
  我是詹姆斯的球迷
</view>
<view wx:if="{{isqiao}}">
  我是乔丹的球迷
</view>
<view wx:if="{{isgeli}}">
  我是格里芬的球迷
</view>
```


### 基础库兼容
这个东西其实也不是太重要，知道有个玩意，以及如何去判断和解决就行，下面看代码：
```js
Page({
  data: {},
  onLoad: function () {},
  // copy事件
  copy: function(){
    // 检测版本是否具备wx.setClipboardData这个API
    if (wx.setClipboardData){
      wx.setClipboardData({
        // 复制的内容，可以设置为动态的数据
        data: '232323232',
        success: function (res) {
          // 模态框
          wx.showModal({
            title: '复制成功',
            content: '内容已经复制成功！',
          })
        }
      })
    }
    else{
      wx.showModal({
        title: '提示',
        content: '您的微信版本太低，请升级',
      })
    }
  }
})
```

### 尾声
以上就是我所做的一些总结，源码都在[这里](https://github.com/CruxF/IMOOC/tree/master/HTML5/FirstWxPro?1528811143397)，有疑问的可以加我慕课账号（Zz皓）私信聊。<br><br>

 
# 2、H5Game => [H5小游戏-爱心鱼（上）](https://www.imooc.com/learn/515)

就是这门课程，让我下定决心好好研读一下《JavaScript数据结构与算法》。以我现在的功力对这种程度的课程还是没有办法进行更好的解读，只是心理上不会感到太大的压力，只能略尽微薄之力将课程章节代码进行整理一番，增加了大量的代码注释，让有缘人更好的去品位这门课程，下面进入正文。<br><br>

### 章节2-1
该章节代码作用就是绘制动画的背景图片，为了更好的管理代码，采用了模块化的开发方式，核心主要是[main2-1.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5Game/js/main2-1.js)代码和[background2-1.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5Game/js/background2-1.js)代码。要看懂这两份代码不难，难的地方是理解gameloop()这个函数发挥的作用，这个我也不太懂，下面直接看该章节的代码效果<br>
[点击查看](https://cruxf.github.io/IMOOC/HTML5/H5Game/index2-1.html)<br><br>

### 章节2-3
该章节代码的作用是绘制静态海葵，在这份的源码中，主要的是[main2-3.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5Game/js/main2-3.js)代码和[ane2-3.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5Game/js/ane2-3.js)，内部我做了大量的注释，这有可能会帮助到你更好的理解这节课程内容。下面我们一起来看看该章节的代码效果<br>
[点击查看](https://cruxf.github.io/IMOOC/HTML5/H5Game/index2-3.html)<br><br>

### 章节2-4
该章节代码作用是绘制由海葵产出的果实，核心代码是[ane2-3.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5Game/js/ane2-3.js)、[main2-4.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5Game/js/main2-4.js)和[fruit2-4.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5Game/js/fruit2-4.js)，还是和上面两个章节一样，在代码内部做了大量的注释，有兴趣的请前往进行查看，下面直接看该章节的代码效果<br>
[点击查看](https://cruxf.github.io/IMOOC/HTML5/H5Game/index2-4.html)<br><br>

### 章节2-5
该章节代码挺容易理解的，就是改变果实的高度、隐藏果实以及改变果实的大小，核心代码只有一个[fruit2-5.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5Game/js/fruit2-5.js)，和之前一样，分析都在内部代码的注释中，请前往查看，下面直接看该章节的代码效果<br>
[点击查看](https://cruxf.github.io/IMOOC/HTML5/H5Game/index2-5.html)<br><br>

### 章节2-6
该章节代码作用是不断重复且随机绘制果实，核心代码为[fruit2-6.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5Game/js/fruit2-6.js)，分析都在内部代码的注释中。下面直接看该章节的代码效果<br>
[点击查看](https://cruxf.github.io/IMOOC/HTML5/H5Game/index2-6.html)<br><br>

### 章节2-7
该章节代码作用是绘制大鱼，在这节课程中很多人无法显示绘制出来的大鱼，也没有代码错误，经过我一番研究发现，原来问题出现在mian.js这个文件中，我们需要先执行这段代码`ctx1.clearRect(0, 0, canWidth, canHeight)`，再来执行`mom.draw()`。原因在该节课程的问答中有提到，有兴趣的可以前往观看。这个章节的核心代码为[main2-7.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5Game/js/main2-7.js)和[mom2-7.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5Game/js/mom2-7.js)，具体分析同样在内部代码的注释中，下面请看该章节的代码效果<br>
[点击查看](https://cruxf.github.io/IMOOC/HTML5/H5Game/index2-7.html)<br><br>

### 章节2-8
该章节代码作用是让大鱼跟着鼠标的移动而移动，其中有很多封装好的方法，涉及到算法，这个是我目前的弱点，因此就不细说了，以免误人子弟。不过我仍然在核心代码[main2-8.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5Game/js/main2-8.js)和[mom2-8.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5Game/js/mom2-8.js)中做了大量的注释，有兴趣的请前往查看，下面直接看该章节的代码效果<br>
[点击查看](https://cruxf.github.io/IMOOC/HTML5/H5Game/index2-8.html)<br><br>

### 章节2-9
该章节代码作用是创建大鱼吃掉果实的方法，挺容易理解的，核心代码为[main2-9.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5Game/js/main2-9.js)、[collision2-9.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5Game/js/collision2-9.js)和[fruit2-9.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5Game/js/fruit2-9.js)，同样的，具体分析在内部代码的注释中。下面直接看该章节的代码效果<br>
[点击查看](https://cruxf.github.io/IMOOC/HTML5/H5Game/index2-9.html)<br><br>

### 章节2-10
该章节代码作用十分简单明了，只有一行，目的就是解决切换网页的时候deltaTime变量无限变大。只要加这么一行代码`if(deltaTime > 40) deltaTime = 40`，该问题就得到了解决，下面直接看该章节的代码效果<br>
[点击查看](https://cruxf.github.io/IMOOC/HTML5/H5Game/index2-10.html)<br><br>

### 章节2-11
最后一个章节，代码的作用是绘制小鱼，思路和绘制大鱼的思路一致，核心代码为[main2-11.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5Game/js/main2-11.js)和[baby2-11.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5Game/js/baby2-11.js)，具体分析在内部代码的注释中，并不是太难理解，慢慢消化，搞清楚每个方法的作用以及代码的逻辑即可。下面直接看最后一个章节的代码效果<br>
[点击查看](https://cruxf.github.io/IMOOC/HTML5/H5Game/index2-11.html)<br><br>

### 尾声
经过之前一段十分困难的代码分析过程，现在面对这种程度的课程不会感到有太大的压力。然而在这学习的过程中还是发现了自己技术上的不足和思维上的短板，接下来得好好加油了。<br><br>


# 3、H5GameNext => [H5小游戏-爱心鱼（下）](https://www.imooc.com/learn/516)

这门课程是上一门的后续，相关的代码和思路都被继续延续下来了。趁热打铁，接下来请看我对这门课程的章节分析。<br><br>

### 章节1-2
这个章节主要是实现小鱼的尾巴摆动的功能，核心代码为[main1-2.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5GameNext/js/main1-2.js)和[baby1-2.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5GameNext/js/baby1-2.js)，解析都在源码的注释中，大家都懂得，就不多说了，下面请直接看代码效果<br>
[点击查看](https://cruxf.github.io/IMOOC/HTML5/H5GameNext/index1-2.html)<br><br>

### 章节1-3
这个章节是实现小鱼眨眼睛的功能，思路和实现鱼尾摆动一样，核心代码为[main1-3.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5GameNext/js/main1-3.js)和[baby1-3.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5GameNext/js/baby1-3.js)，解析都在源码的注释中，好好读，认真读，下面请直接看代码效果<br>
[点击查看](https://cruxf.github.io/IMOOC/HTML5/H5GameNext/index1-3.html)<br><br>

### 章节1-4
这个章节是实现小鱼身体逐渐变白的功能，思路也之前小鱼摆尾、小鱼眨眼一样，通过每一帧的变化来改变图片，核心代码为[main1-4.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5GameNext/js/main1-4.js)和[baby1-4.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5GameNext/js/baby1-4.js)。下面直接看代码效果<br>
[点击查看](https://cruxf.github.io/IMOOC/HTML5/H5GameNext/index1-4.html)<br><br>

### 章节2-1
这个章节实现大鱼接近小鱼而改变小鱼身体颜色的功能，代码简单，容易理解，核心代码为[main2-1.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5GameNext/js/main2-1.js)和[collision2-1.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5GameNext/js/collision2-1.js)。下面直接看代码效果<br>
[点击查看](https://cruxf.github.io/IMOOC/HTML5/H5GameNext/index2-1.html)<br><br>

### 章节2-2
这个章节实现了大鱼的尾巴摆动功能，跟小鱼摆尾实现思路一样，具体分析看核心代码[main2-2.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5GameNext/js/main2-2.js)和[mom2-2.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5GameNext/js/mom2-2.js)就好了。下面直接看代码效果<br>
[点击查看](https://cruxf.github.io/IMOOC/HTML5/H5GameNext/index2-2.html)<br><br>

### 章节2-3
这个章节实现了大鱼眨眼睛的功能，完全是小鱼眨眼睛的翻版，具体分析看核心代码[main2-3.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5GameNext/js/main2-3.js)和[mom2-3.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5GameNext/js/mom2-3.js)就好了。下面直接看代码效果<br>
[点击查看](https://cruxf.github.io/IMOOC/HTML5/H5GameNext/index2-3.html)<br><br>

### 章节2-4
这个章节实现了大鱼吃果实后的分数计算功能，思路不是很复杂，首先创建一个存储分数的[data2-4.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5GameNext/js/data2-4.js)文件，接着在[collision2-4.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5GameNext/js/collision2-4.js)文件计算分数，最后在[main2-4.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5GameNext/js/main2-4.js)文件中将即时计算的游戏分数绘制出来。下面直接看代码效果<br>
[点击查看](https://cruxf.github.io/IMOOC/HTML5/H5GameNext/index2-4.html)<br><br>

### 章节2-5
这个章节实现了大鱼吃果实身体变化的功能，认认真真看到这里的童鞋相信都能够很轻松的理解讲师的思路了，千变一律先在[main2-5.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5GameNext/js/main2-5.js)文件中用数组存储大鱼身体变化的图片列表，接着在[collision2-5.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5GameNext/js/collision2-5.js)文件中对该数组的下标进行计算，最后在[mom2-5.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5GameNext/js/mom2-5.js)文件中绘制出大鱼身体。下面直接看代码效果<br>
[点击查看](https://cruxf.github.io/IMOOC/HTML5/H5GameNext/index2-5.html)<br><br>

### 章节2-6
这个章节实现了游戏分数的基本计算功能，逻辑很清晰，就是先在[data2-6.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5GameNext/js/data2-6.js)文件中定义一个分数累加的方法，接着在[collision2-6.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5GameNext/js/collision2-6.js)文件中执行这个方法，最后为了优化性能，将分数绘制的代码移到了[main2-6.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5GameNext/js/main2-6.js)这个文件中。下面直接看代码效果<br>
[点击查看](https://cruxf.github.io/IMOOC/HTML5/H5GameNext/index2-6.html)<br><br>

### 章节2-7
这个章节实现了当小鱼死亡后的种种事件，代码很简单，主要流程为首先在[data2-7.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5GameNext/js/data2-7.js)文件中定义游戏状态变量和游戏结束提示文字；接着在[baby2-7.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5GameNext/js/baby2-7.js)文件中改变游戏状态；然后在[collision2-7.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5GameNext/js/collision2-7.js)文件中定义当游戏状态为“结束”时，相关事件不触发；最后就是在[main2-7.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5GameNext/js/main2-7.js)文件中定义当游戏结束时画布内的大鱼和小鱼停止游动。下面直接看代码<br>
[点击查看](https://cruxf.github.io/IMOOC/HTML5/H5GameNext/index2-7.html)<br><br>

### 章节3-1
这个章节主要是实现大鱼吃果实动画效果的前期，思路很容易理解，就是当大鱼碰到果实的时候触发waveObj对象的born方法，与之有关的代码文件为[main3-1.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5GameNext/js/main3-1.js)、[wave3-1.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5GameNext/js/wave3-1.js)和[collision3-1.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5GameNext/js/collision3-1.js)。下面直接看代码效果，记得打开控制台~<br>
[点击查看](https://cruxf.github.io/IMOOC/HTML5/H5GameNext/index3-1.html)<br><br>

### 章节3-2
这个章节实现了大鱼吃到果实后圈圈散开的效果，实现思路是这样滴：首先在[collision3-2.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5GameNext/js/collision3-2.js)文件中传入当前果实的x和y轴的坐标，然后在[wave3-2.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5GameNext/js/wave3-2.js)文件中接收到果实坐标，并且根据坐标位置绘制出一个变化的圈圈。下面直接看代码效果<br>
[点击查看](https://cruxf.github.io/IMOOC/HTML5/H5GameNext/index3-2.html)<br><br>

### 章节3-3
这个章节只不过是稍微让让大鱼吃果实散发出来的圈圈样式变得更加好看些，没有什么逻辑方面的，直接看[wave3-3.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5GameNext/js/wave3-3.js)源码就好。下面我们来看该章节的代码效果<br>
[点击查看](https://cruxf.github.io/IMOOC/HTML5/H5GameNext/index3-3.html)<br><br>

### 章节3-4
这个章节是实现大鱼喂小鱼吃果实的效果前期，实现思路完全和大鱼吃果实的一毛一样，在这就不说什么了，具体解析都在[main3-4.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5GameNext/js/main3-4.js)和[halo3-4.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5GameNext/js/halo3-4.js)文件中。下面直接看代码效果<br>
[点击查看](https://cruxf.github.io/IMOOC/HTML5/H5GameNext/index3-4.html)<br><br>

### 章节3-5
这个章节实现了大鱼喂小鱼果实的效果，实现思路其实就是**章节3-2** 的翻版，[collision3-5.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5GameNext/js/collision3-5.js)文件传参数，[halo3-5.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5GameNext/js/halo3-5.js)文件接收参数并绘制效果。下面直接看代码效果<br>
[点击查看](https://cruxf.github.io/IMOOC/HTML5/H5GameNext/index3-5.html)<br><br>

### 章节3-6
这个章节实现了海葵摆动效果，看得迷迷糊糊的，不是太明白，估计是对贝赛尔曲线这个玩意理解的并不是很充分，这个缺板得找个时间补上去。现在留一份充满注释的核心源码[ane3-6.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5GameNext/js/ane3-6.js)给有缘人。下面直接看代码效果<br>
[点击查看](https://cruxf.github.io/IMOOC/HTML5/H5GameNext/index3-6.html)<br><br>

### 章节3-7
这个章节。。。不行了，撑不住了，不懂是啥玩意了，还出现了严重bug：果实数量不断累加，分数暴涨。不分析了，头疼，下面请直接看这份有严重bug的代码效果<br>
[点击查看](https://cruxf.github.io/IMOOC/HTML5/H5GameNext/index3-7.html)<br><br>

### 章节3-8
这个章节实现漂浮物摇摆效果，实现思路和**章节3-6** 差不多，在这就不多说了。然而问题是上一节的bug依然没有得到解决，好桑心......下面直接看有重大bug的代码效果<br>
[点击查看](https://cruxf.github.io/IMOOC/HTML5/H5GameNext/index3-8.html)<br><br>

### 尾声
MMP的，经过好几个小时的排查，终于解决了章节3-7和章节3-8的bug，那就是在main.js文件中不能先执行fruit.draw()，然后再执行fruitMonitor()。正确的方式是要把两者的执行顺序调换过来。导致bug出现的原因看源码[fruit3-7.js](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5GameNext/js/fruit3-7.js)应该能略知一二。然而让我摸不着头脑的是：同样的main.js代码结构，为啥在章节3-7之前就没有出现这个bug？？？？做游戏果然难度大.....得加油了，骚年！下面请看最后正常的代码效果<br>
[点击查看](https://cruxf.github.io/IMOOC/HTML5/H5GameNext/index.html)<br><br>


# 4、H5GameGirl => [canvas实现星星闪烁特效](https://www.imooc.com/learn/338)

同一个老师，同样的风格，由于在上面两节课程中我已经做了大量的讲解，因此这节课程的代码就不做过多的具体解释了，我把相关一些相关的代码说明都写到了源码中，有兴趣的可以来[这里看一看](https://github.com/CruxF/IMOOC/blob/master/HTML5/H5GameGirl)，下面直接看课程代码效果<br>
[点击查看](https://cruxf.github.io/IMOOC/HTML5/H5GameGirl/starGirl.html)<br><br>


