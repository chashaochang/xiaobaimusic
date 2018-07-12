//index.js

Page({
  data: {
    
  },
  onLoad: function () {
    setTimeout(function(){
      wx.redirectTo({
        url: '../search/musicsearch',
      })
    },1500)
  },
  
})
