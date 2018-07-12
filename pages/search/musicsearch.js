// pages/music.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    music_name:'',
    music_list:[],
    list:[],
    index:0,//tab选中项
    ranking_list:[],//排行榜
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&_=1530247024891',
      success:res=>{
        wx.hideLoading();
        if (res.data.data.topList && res.data.data.topList.length>0){
          var ranking_list = res.data.data.topList
          that.setData({
            ranking_list: ranking_list
          })
        }
      }
    })
  },
  /**
   * 搜索歌曲
   */
  search:function(){
    var that=this;
    if (that.data.music_name.length>0){
      search(that.data.music_name, function (res) {
        wx.hideLoading();
        var list = res.data.data.song.list;
        var music_list = [];
        for (var i = 0; i < list.length; i++) {
          var music_item = {};
          music_item.index = i;
          music_item.id = list[i].id;
          music_item.name = list[i].name.length < 50 ? list[i].name : list[i].name.substr(0,50)+"...";
          music_item.singer = list[i].singer[0].name;
          music_item.album_mid = list[i].album.mid;
          music_item.long = intervalParse(list[i].interval);
          music_list.push(music_item);
        }
        that.setData({
          music_list: music_list,
          list: list
        })
      })
    }
  },
  play:function(e){
    console.log(e)
    var index = e.currentTarget.dataset.id;
    var params = JSON.stringify(this.data.list[index]);
    wx.navigateTo({
      url: '/pages/play/musicplay?params='+params,
    })
  },
  //输入改变事件
  bindinput: function (e) {
    this.setData({
      music_name: e.detail.value
    })
  },
  //清除输入内容
  clear:function(){
    this.setData({ music_name: "", music_list:[]})
  },
  //tap点击
  chooseTap:function(e){
    var index = e.target.dataset.id;
    this.setData({
      index:index
    })
  },
  toTopList:function(e){
    var list_id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/toplist/toplist?id=' + list_id,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
function search(music_name,callback){
  wx.showLoading({
    title: '搜索中...',
  })
  wx.request({
    url: 'https://c.y.qq.com/soso/fcgi-bin/client_search_cp?new_json=1&remoteplace=txt.yqq.center&searchid=47323989855609655&t=0&aggr=1&cr=1&catZhida=1&lossless=0&flag_qc=0&p=1&n=20&w='+music_name+'&g_tk=5381&jsonpCallback=MusicJsonCallback8504864618997605&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=h5&needNewCode=0',
    success: res => {
      callback(res)
    }
  })
}
function intervalParse(interval){
  var minutes = parseInt(interval / 60);
  var seconds = parseInt(interval % 60);
  return (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
}
function strlen(str) {
  var len = 0;
  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i);
    //单字节加1   
    if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
      len++;
    }
    else {
      len += 2;
    }
  }
  return len;
} 