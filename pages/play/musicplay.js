// pages/musicplay.js
const backgroundAudioManager = wx.getBackgroundAudioManager()
var clock;
Page({

  /**d
   * 页面的初始数据
   */
  data: {
    album: "",
    album_name: "",
    src: "",
    title: "",
    siger: "",
    status: 0,//0暂停1播放2停止
    deg: 0,//旋转角度
    duration: 0,//总时长
    currentPosition: 0,//当前秒数
    currentMinute: 0,
    currentSecond: 0,
    totalMinute: 0,
    totalSecond: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (!!options.params) {
      var music_params = JSON.parse(options.params);
      console.log(music_params)
      var pic = getAlbum(music_params.album ? music_params.album.mid : music_params.albummid);
      that.setData({ album: pic, album_name: music_params.album ? music_params.album.name : music_params.albumname, title: music_params.name ? music_params.name : music_params.songname, siger: music_params.singer[0].name });
      var duration = music_params.interval;
      that.setData({
        duration: duration,
        totalMinute: parseInt(duration / 60) + "",
        totalSecond: parseInt(duration % 60) + ""
      })
      wx.setNavigationBarTitle({
        title: music_params.name ? music_params.name : music_params.songname,
      })
      getMusic_fcg(music_params.file ? music_params.file.media_mid : music_params.songmid, function (res) {
        wx.hideLoading();
        that.setData({
          src: res
        })
        backgroundAudioManager.title = that.data.title;
        backgroundAudioManager.epname = that.data.title;
        backgroundAudioManager.singer = that.data.siger;
        backgroundAudioManager.coverImgUrl = that.data.album;
        backgroundAudioManager.src = res;// 设置了 src 之后会自动播放
        wx.onBackgroundAudioPlay(function (e) {
          that.setData({ status: 1 });
        })
        wx.onBackgroundAudioPause(function () {
          that.setData({ status: 0 })
        });
        wx.onBackgroundAudioStop(function () {
          that.setData({ status: 2 })
          clearInterval(clock);
          that.setData({
            deg: 0,
            currentPosition: 0,//当前秒数
            currentMinute: 0,
            currentSecond: 0,
          })
        })
        clock = setInterval(function () {
          wx.getBackgroundAudioPlayerState({
            success: res => {
              if (that.data.deg > 360) {
                that.data.deg = that.data.deg - 360;
              }
              that.setData({
                currentPosition: res.currentPosition ? res.currentPosition : 0,
                deg: that.data.deg + 0.2,
                currentMinute: parseInt(res.currentPosition / 60) + "",
                currentSecond: parseInt(res.currentPosition % 60 )+ "",
              })
            }
          })
        }, 100)
      });
      // getMusic_Lyric(music_params.id, function (res) {
      //   console.log(res);
      // });
    }
  },
  play: function () {
    var that = this;
    backgroundAudioManager.play();
    clock = setInterval(function () {
      wx.getBackgroundAudioPlayerState({
        success: res => {
          if (that.data.deg > 360) {
            that.data.deg = that.data.deg - 360;
          }
          that.setData({
            currentPosition: res.currentPosition ? res.currentPosition : 0,
            deg: that.data.deg + 0.2,
            currentMinute: parseInt(res.currentPosition / 60) + "",
            currentSecond: parseInt(res.currentPosition % 60) + ""
          })
        }
      })
    }, 100)
  },
  start: function () {
    var that = this;
    backgroundAudioManager.src = this.data.src;
    clock = setInterval(function () {
      wx.getBackgroundAudioPlayerState({
        success: res => {
          if (that.data.deg > 360) {
            that.data.deg = that.data.deg - 360;
          }
          that.setData({
            currentPosition: res.currentPosition,
            deg: that.data.deg + 0.2,
            currentMinute: parseInt(res.currentPosition / 60) + "",
            currentSecond: parseInt(res.currentPosition % 60) + ""
          })
        }
      })
    }, 100)
  },
  pause: function () {
    backgroundAudioManager.pause();
    clearInterval(clock);
  },
  changeProgress: function (e) {
    var that = this;
    var value = e.detail.value;
    wx.seekBackgroundAudio({
      position: value,
      success: function () {
        that.setData({
          currentPosition: value,
          currentMinute: parseInt(value / 60) + "",
          currentSecond: parseInt(value % 60) + ""
        });
      }
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
function getAlbum(mid) {
  return 'https://y.gtimg.cn/music/photo_new/T002R300x300M000' + mid + '.jpg?max_age=2592000';
}
function getMusic_fcg(mid, callback) {
  wx.showLoading({
    title: '载入中。。。',
  })
  wx.request({
    url: 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg?g_tk=110495564&&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0&cid=205361747&uin=0&songmid=' + mid + '&filename=C400' + mid + '.m4a&guid=924661402',
    success: res => {
      console.log(res)
      var vkey = res.data.data.items[0].vkey;
      var src = 'https://dl.stream.qqmusic.qq.com/C400' + mid + '.m4a?vkey=' + vkey + "&&guid=924661402&uin=0&fromtag=66";
      callback(src)
    }
  })
}
function getMusic_Lyric(mid, callback) {
  console.log(mid)
  wx.request({
    url: "https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg?pcachetime="+new Date().getTime()+"&songmid=0031TAKo0095np&g_tk=5381&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0",
    header:{
      "Referer": "https://y.qq.com/portal/player.html",
    },
    success: res => {
      callback(res)
    }
  })
}