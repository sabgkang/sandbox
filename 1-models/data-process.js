var isAndroid = kendo.support.mobileOS.android;

//var apiSite = 'https://api-linko-sports-center.herokuapp.com/';
var apiSite = 'https://beida-api-for-firebase.herokuapp.com/';

var loadCoupons = false;

// override datasources
navDataSource = new kendo.data.DataSource({
  // 使用 data 的方法一
  //  data: [
  //      {
  //        "課程名稱": "一起來運動",
  //        "url": "2-views/couponDetail.html?couponId=U0001",
  //        "section": "A"
  //      },
  //      {
  //        "課程名稱": "運動運動",
  //        "url": "2-views/pullToRefresh.html?couponId=U0002",
  //        "section": "A"        
  //      },
  //      {
  //        "課程名稱": "年後減肥大作戰",
  //        "url": "2-views/couponDetail.html?couponId=U0003",
  //        "section": "B"        
  //      },
  //      {
  //        "課程名稱": "飛輪",
  //        "url": "2-views/couponDetail.html?couponId=U0004",
  //        "section": "B"        
  //      },
  //      {
  //        "課程名稱": "瑜珈",
  //        "url": "2-views/couponDetail.html?couponId=U0005",
  //        "section": "C"        
  //      },    
  //    
  //  ],
  
  // 使用 data 的方法二, transport
  transport: {
    read: function (data) { getCouponData(navDataSource); getCouponHistory(couponHistorySource);  }
  },
//  sort: {
//    field: "課程名稱",
//    dir: "asc"
//  },
  requestStart: function () {
    kendo.ui.progress($("#loading"), true);
  },
  requestEnd: function () {
    kendo.ui.progress($("#loading"), false);
  },

  schema: {
    total: function () {
      console.log("scheme total");
      取得經緯度();    
      return 77;
    }
  },
  serverPaging: true,
  pageSize: 40,
  //group: { field: "section" }
})

couponHistorySource = new kendo.data.DataSource({
  transport: {
    read: function (data) { getCouponHistory(couponHistorySource); }
  },
//  sort: {
//    field: "課程名稱",
//    dir: "asc"
//  },
  requestStart: function () {
    kendo.ui.progress($("#loading"), true);
  },
  requestEnd: function () {
    kendo.ui.progress($("#loading"), false);
  },

  schema: {
    total: function () {
      console.log("couponHistorySource scheme total");
      //取得經緯度();    
      return 77;
    }
  },
  serverPaging: true,
  pageSize: 40,
  //group: { field: "section" }
})

searchDataSource = navDataSource;

function getCouponData(data) {
  console.log("getting data");
  
  if (loadCoupons == false) return 1;
  
  allDataReady = 0;
  readCoupons();

  var checkDataReady = setInterval(function(){
    if (allDataReady==4) {
      //console.log(inCoupon, couponData);
      clearInterval(checkDataReady);
      //console.log("Set up data for listview")
      var dataTemp =[];
      notInCoupon.forEach(function(coupon, index, array){
        couponData.forEach(function(item, ind, arr){
          if (coupon==item[0]) {
            //console.log(coupon, ind);
            var 優惠券圖片Url = ( couponData[ind][4] !=undefined)?couponData[ind][4]:"picPlaceholder.png";
            var couponTitle = {
              "優惠券編號": couponData[ind][0],              
              "優惠券名稱": couponData[ind][1],
              "優惠券時間": couponData[ind][2], // + " | " + couponData[ind][3], 
              "優惠券說明": couponData[ind][3],
              "優惠券圖片": 優惠券圖片Url,
              "繳費狀況": "",
              "繳費狀況顏色": "coral",              
              "url": "2-views/couponDetail.html?couponId=" + couponData[ind][0],
              "section": "A"             
            };   
            
//            couponMember.forEach(function(coupon1, index1, array1){
//              //console.log(index1, couponData[ind][0]);
//              if (coupon1[0]==couponData[ind][0]) {
//                for (var i=1; i< coupon1.length;i++){
//                  //console.log(coupon1[i][3]);
//                  if (coupon1[i][3]== userId[1] && coupon1[i][1]=="已使用") {
//                    couponTitle.繳費狀況 = "已使用";
//                    couponTitle.繳費狀況顏色 = "darkslategray";
//                  }               
//                }
//              }
//            });           
            
            
            dataTemp.push(couponTitle);

          }
        });
      });
   
      console.log(dataTemp.length);
      data.success(dataTemp);      
      
      if (dataTemp.length==0) {
        $("#報名課程title").text("尚無報名課程");
      }else {
        $("#報名課程title").text("熱門優惠券");
      }      

    }
    
  }, 100);

}

function getCouponHistory(data) {
  console.log("getting CouponHistory", loadCoupons);
  
  if (loadCoupons == false) return 1;

  var checkDataReady = setInterval(function(){
    //console.log("in history", allDataReady);
    if (allDataReady==4) {
      clearInterval(checkDataReady);
      //console.log("in xxx", myHistory)
      var dataTemp =[];
      inCoupon.forEach(function(coupon, index, array){
        couponData.forEach(function(item, ind, arr){
          if (coupon==item[0]) {
            //console.log(coupon, ind);
            var 優惠券圖片Url = ( couponData[ind][4] !=undefined)?couponData[ind][4]:"picPlaceholder.png";
            var couponTitle = {
              "優惠券編號": couponData[ind][0],              
              "優惠券名稱": couponData[ind][1],
              "優惠券時間": "已使用", //couponData[ind][2], // + " | " + couponData[ind][3], 
              "優惠券說明": couponData[ind][3],
              "優惠券圖片": 優惠券圖片Url,
              "繳費狀況": "",
              "繳費狀況顏色": "coral",              
              "url": "2-views/couponDetail.html?couponId=" + couponData[ind][0],
              "section": "A"             
            };   
            
            couponMember.forEach(function(coupon1, index1, array1){
              //console.log(index1, couponData[ind][0]);
              if (coupon1[0]==couponData[ind][0]) {
                for (var i=1; i< coupon1.length;i++){
                  //console.log(coupon1[i][3]);
                  if (coupon1[i][3]== userId[1]) {
                    couponTitle.優惠券時間 = coupon1[i][1];
                  }               
                }
              }
            });           
                        
            dataTemp.push(couponTitle);

          }
        });
      });

      myHistory.forEach(function(coupon, index, array){
        console.log(coupon);
        couponHistory.forEach(function(item, ind, arr){
          if (coupon==item[0]) {
            //console.log(coupon, ind);
            var 優惠券圖片Url = ( couponHistory[ind][4] !=undefined)?couponHistory[ind][4]:"picPlaceholder.png";
            var couponTitle = {
              "優惠券編號": couponHistory[ind][0],              
              "優惠券名稱": couponHistory[ind][1],
              "優惠券時間": "已使用", //couponData[ind][2], // + " | " + couponData[ind][3], 
              "優惠券說明": couponHistory[ind][3],
              "優惠券圖片": 優惠券圖片Url,
              "繳費狀況": "",
              "繳費狀況顏色": "coral",              
              "url": "2-views/couponDetail.html?couponId=" + couponHistory[ind][0],
              "section": "A"             
            };   
            
//            couponMember.forEach(function(coupon1, index1, array1){
//              //console.log(index1, couponData[ind][0]);
//              if (coupon1[0]==couponData[ind][0]) {
//                for (var i=1; i< coupon1.length;i++){
//                  //console.log(coupon1[i][3]);
//                  if (coupon1[i][3]== userId[1]) {
//                    couponTitle.優惠券時間 = coupon1[i][1];
//                  }               
//                }
//              }
//            });           
                        
            dataTemp.push(couponTitle);

          }          
//          if (coupon==item[0]) {
//            //console.log(coupon, ind);
//            var 課程圖片Url = ( item[11] !=undefined )?item[11]:"picPlaceholder.png";            
//            var couponTitle = {
//              "課程編號": item[0],              
//              "課程名稱": item[1],
//              "老師時間": item[2] + " | " + item[3], 
//              "課程費用": item[5], 
//              "課程圖片": 課程圖片Url,              
//              "url": "2-views/couponDetail.html?couponId=" + couponData[ind][0],
//              "section": "A"             
//            };
//            dataTemp.push(couponTitle);
//          }
        });
      });      
   
      //console.log(dataTemp);
      data.success( dataTemp);  
      
      if (dataTemp.length==0) {
        $("#我的優惠券title").text("尚無我的優惠券");
      }else {
        $("#我的優惠券title").text("我的優惠券");
      }      
      
    }
    
  }, 100);

}


function nullForNow(e) {
  console.log("nullForNow");
  //currentExample = nullForNow;
}

function removeView(e) {
  //console.log("removeView", e);  
  if (reloadCouponNeeded) {
    readCoupons(); 
    reloadCouponNeeded = false;
  }
  if (!e.view.element.data("persist")) {
    //console.log(e);
    
    // KPC: 找不到 persist 如何設定，只好用粗暴的做法
    if (e.view.id != "#forms") e.view.purge();
    
    //e.view.purge();
  }

}

function initSearch(e) {
  console.log("initSearch");
  var searchBox = e.view.element.find("#demos-search");

  searchBox.on("input", function () {
    searchForCoupon(searchBox.val()); //, product);
  });

  searchBox.on("blur", function () {
    //        if (searchBox.val() == "") {
    //            hideSearch();
    //        }
    searchBox.val("");
    searchForCoupon("");
    hideSearch();
  });
}

var desktop = !kendo.support.mobileOS;

function showSearch() {
  $("#normal").addClass("navbar-hidden");
  $("#search").removeClass("navbar-hidden");
  if (desktop) {
    setTimeout(function () {
      $("#demos-search").focus();
    });
  } else {
    $("#demos-search").focus();
  }
}

function hideSearch() {
  $("#normal").removeClass("navbar-hidden");
  $("#search").addClass("navbar-hidden");
}

function checkSearch(e) {
  if (!searchDataSource.filter()) {
    e.preventDefault();
    this.replace([]);
    $("#search-tooltip").show();
  } else {
    $("#search-tooltip").hide();
  }
}

function searchForCoupon(value){ 
  if (value.length < 2) {
        searchDataSource.filter(null);
    } else {
        var filter = { logic: "and", filters: []};
        var words = value.split(" ");

        for (var i = 0; i < words.length; i ++) {
            var word = words[i];
            filter.filters.push({
                logic: "or",
                filters: [
                    //{ field: "section", operator: "contains", value: word },
                    { field: "課程名稱", operator: "contains", value: word },
                    //{ field: "title", operator: titleContains(word) }
                ]
            });
        }

        searchDataSource.filter(filter);
    }
}

window.app = new kendo.mobile.Application($(document.body), {
  layout: "couponDiv",
  transition: "slide",
  skin: "nova",
  icon: {
    "": '@Url.Content("~/content/mobile/AppIcon72x72.png")',
    "72x72": '@Url.Content("~/content/mobile/AppIcon72x72.png")',
    "76x76": '@Url.Content("~/content/mobile/AppIcon76x76.png")',
    "114x114": '@Url.Content("~/content/mobile/AppIcon72x72@2x.png")',
    "120x120": '@Url.Content("~/content/mobile/AppIcon76x76@2x.png")',
    "152x152": '@Url.Content("~/content/mobile/AppIcon76x76@2x.png")'
  }
});