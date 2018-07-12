// pages/toplist/toplist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    songlist:[],
    list_info:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.showLoading({
      title: '加载中...',
    })
    if (options.id){
      var id = options.id;
      wx.request({
        url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&tpl=3&page=detail&type=top&topid='+id+'&_='+new Date().getTime(),
        success:res=>{
          console.log(res);
          that.setData({
            list_info:res.data,
            songlist: res.data.songlist
          })
          wx.hideLoading();
        }
      })
    }
  },
  play:function(e){
    var data=e.currentTarget.dataset.data
    var params = JSON.stringify(data);
    wx.navigateTo({
      url: '/pages/play/musicplay?params=' + params,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  
  // }
})