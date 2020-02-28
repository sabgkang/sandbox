function addCoupon() {
  console.log("addCoupon");

  if (!isLogin) {
    alert("必須登入後才能新增優惠券");
    return 0;
  }

  $("#couponName").val("");  
  $("#couponDate").val("");
  $("#couponOtherDesc").val("");
  $("#上傳訊息").text("圖片尚未選擇");
  $("#上傳優惠券圖片").attr("src", "");
  securePicUrl = "";
  
  //couponNum++;
  $("#couponNumber").text("新增優惠券 - C" + zeroFill(couponNum+1, 4));

  $("#couponTable").hide();
  $("#couponHistoryTable").hide();
  $("#spacerBetweenTables").hide();

  $(".dataTables_filter").hide();
  $(".dataTables_info").hide();
  $('#couponTable_paginate').hide();
  $('#couponHistoryTable_paginate').hide();

  $("#addCoupon").show();


  $("#inProgress").hide();
  $("#addCouponBtn").hide();
  $("#refreshBtn").hide();
  //      $("#addCouponBtn").attr("disabled", true);
  //      $("#refreshBtn").attr("disabled", true);
}

function couponConfirm() {
  console.log("couponConfirm");

  if (!isLogin) {
    alert("必須登入後才能新增優惠券");
    return 0;
  }

  var startDate = new Date($("#couponDate").val());
  var nextDate = new Date();
  //console.log(startDate);
  nextDate.setDate(startDate.getDate() - 7);
  var repeatTimes=$("#repeatN").val();
  for (var i=0; i<repeatTimes; i++){
    couponNum++;
    nextDate.setDate(nextDate.getDate() + 7);
    nextDateStr = nextDate.toLocaleDateString();
    nextDateStr = nextDateStr.replace(/\//g, "-");
    //console.log(couponNum, nextDateStr);
    
    if(nextDate == "Invalid Date") {
      alert("有效期限日期錯誤");
      return 0;
    }
    
    var couponNameTmp;
    couponNameTmp = (repeatTimes>1)? $("#couponName").val()+" ("+(i+1)+")":$("#couponName").val();
    
    var dataToAdd = [
              "C" + zeroFill(couponNum, 4),
              couponNameTmp,
              //$("#couponName").val(),
              nextDateStr,
              $("#couponOtherDesc").val(),
              securePicUrl,
            ];

    console.log(dataToAdd);
    
    // 更新 local couponData 及 couponMember
    couponData.push(dataToAdd);
    couponMember.push(["C" + zeroFill(couponNum, 4)]); //Fix bug:重複週期 新增優惠券 會只有增加最後一個優惠券 到 couponMember
        
  }
  
  securePicUrl="";

  // 優惠券寫入資料庫
  database.ref('users/三峽運動中心/優惠券').set({
    現在優惠券: JSON.stringify(couponData),
    過去優惠券: JSON.stringify(couponHistory),
  }, function (error) {
    if (error) {
      console.log("Write to database error, revert couponData back");
      couponData.pop();
    }
    console.log('Write to database successful');
  });


  database.ref('users/三峽運動中心/優惠券管理').set({
    優惠券會員: JSON.stringify(couponMember),
  }, function (error) {
    if (error) {
      //console.log(error);
      return 0;
    }
    console.log('Write to database successful');
  });

  // 更新優惠券表格
  var couponTable = $('#couponTable').DataTable();
  couponTable.clear().draw();
  couponTable.rows.add(couponData);
  couponTable.draw();

  $("#addCoupon").hide();
  $("#couponTable").show();
  $("#spacerBetweenTables").show();
  $("#couponHistoryTable").show();

  $(".dataTables_filter").show();
  $(".dataTables_info").show();
  $('#couponTable_paginate').show();
  $('#couponHistoryTable_paginate').show();

  $("#inProgress").show();
  $("#addCouponBtn").show();
  $("#refreshBtn").show();
  //      $("#addCouponBtn").attr("disabled", false);
  //      $("#refreshBtn").attr("disabled", false);      
}

function couponCancel() {
  console.log("couponCancel");
  //couponNum--;
  $("#addCoupon").hide();
  $("#spacerBetweenTables").show();
  $("#couponHistoryTable").show();
  $("#couponTable").show();

  $(".dataTables_filter").show();
  $(".dataTables_info").show();
  $('#couponTable_paginate').show();
  $('#couponHistoryTable_paginate').show();

  $("#inProgress").show();
  $("#addCouponBtn").show();
  $("#refreshBtn").show();
  //      $("#addCouponBtn").attr("disabled", false);
  //      $("#refreshBtn").attr("disabled", false);       
}

function zeroFill(number, width) {
  width -= number.toString().length;
  if (width > 0) {
    return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
  }
  return number + ""; // always return a string
}

function refreshCourse() {
  console.log("Refresh Course");

  var couponTable = $('#couponTable').DataTable();
  couponTable.clear().draw();
  couponTable.rows.add(couponData);
  couponTable.draw();

  var couponTable = $('#couponHistoryTable').DataTable();
  couponTable.clear().draw();
  couponTable.rows.add(couponHistory);
  couponTable.draw();
}

function backToHome() {
  console.log("Refresh Course");

  $("#couponDetailDiv").hide();

  $("#couponTable").show();
  $("#couponHistoryTable").show();
  $("#spacerBetweenTables").show();

  $(".dataTables_filter").show();
  $(".dataTables_info").show();
  $('#couponTable_paginate').show();
  $('#couponHistoryTable_paginate').show();
  $("#addCoupon").hide();
  $("#inProgress").show();
  $("#addCouponBtn").show();
  $("#refreshBtn").show();
}

function couponUpdate() {
  console.log("couponUpdate");

  if (!isLogin) {
    alert("必須登入後才能更新優惠券");
    return 0;
  }

  var securityNum = Math.floor(Math.random()*8999+1000); 
  var securityStr = "確定要更新此優惠券，請輸入確認碼: " + String(securityNum);
  //console.log(prompt(securityStr));
  var confirmIt = prompt(securityStr) == securityNum;
  console.log("確認碼:", confirmIt);  

  if (!confirmIt) {
    alert("確認碼輸入錯誤，不進行更新動作");
    return 0;
  } else {
    var dataToReplace = [
      couponNumber,
      $("#couponDetail").val(),
      $("#couponDateDetail").val(),
      $("#couponOtherDescDetail").val(),
      securePicUrl,
    ];

    //console.log(dataToReplace);
    
    // 尋找 couponData 這筆資料，並取代
    for (var i =0; i< couponData.length; i++){
      //console.log(couponData[i][0]);
      if (couponData[i][0]==couponNumber) {
        couponData[i] = dataToReplace;
        break;
      }
    }
        
    // 優惠券寫入資料庫
    database.ref('users/三峽運動中心/優惠券').set({
      現在優惠券: JSON.stringify(couponData),
      過去優惠券: JSON.stringify(couponHistory),
    }, function (error) {
      if (error) {
        console.log("Write to database error, revert couponData back");
        couponData.pop();
      }
      console.log('Write to database successful');
    });

    // 更新優惠券表格
    var couponTable = $('#couponTable').DataTable();
    couponTable.clear().draw();
    couponTable.rows.add(couponData);
    couponTable.draw();

    $("#couponDetailDiv").hide();
    $("#couponTable").show();
    $("#spacerBetweenTables").show();
    $("#couponHistoryTable").show();

    $(".dataTables_filter").show();
    $(".dataTables_info").show();
    $('#couponTable_paginate').show();
    $('#couponHistoryTable_paginate').show();

    $("#inProgress").show();
    $("#addCouponBtn").show();
    $("#refreshBtn").show();    

  }

}

function logInAndOut() {
  //  if (!isLogin) {
  //    $("#password").val("");
  //    $("#loginDiv").show();
  //  } else {
  //    firebase.auth().signOut();
  console.log(isLogin);
  if (!isLogin) {
    window.location.href = '0-login.html';
  } else {
    firebase.auth().signOut();
  }
}

//function signIn() {
//  //check email
//  if (!validateEmail($("#emailAddress").val())) {
//    $("#emailAddress").val("");
//    $("#emailAddress").attr("placeholder", "Email Address Error, try again!");
//    $("#emailAddress").css("background-color", "yellow");
//  } else {
//    $("#loginDiv").hide();
//    firebase.auth().signInWithEmailAndPassword($("#emailAddress").val(), $("#password").val()).catch(function (error) {
//      // Handle Errors here.
//      var errorCode = error.code;
//      var errorMessage = error.message;
//      alert("Login Error! Try again!")
//    });
//  }
//
//}

//function validateEmail(email) {
//  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//
//  return re.test(String(email).toLowerCase());
//}
//
//
//function signInAbort() {
//  $("#loginDiv").hide();
//}

//function addNewCoach() {
//  console.log("Query and Check coach");
//
//  var coachs = $('#coachList').DataTable();
//  coachs.clear().draw();
//  coachs.rows.add(coachSet);
//  coachs.draw();
//
//  $("#addCoupon").hide();
//  $("#coachTable").show();
//  $("#coachList_paginate").css({
//    "font-size": "16px"
//  });

//}



function memberManage() {
  console.log("客戶管理");

  if (!isLogin) {
    alert("必須登入後才能進行客戶管理");
    return 0;
  }

  window.location.href = '1-addMember.html';

  //  $("#memberDiv").show();
  //  var memberTable = $('#memberTable').DataTable();
  //  memberTable.clear().draw();
  //  memberTable.rows.add(memberData);
  //  memberTable.draw();
}

function closeMember() {
  console.log("關閉客戶管理");

  $("#memberDiv").hide();
}

function addMember() {
  console.log("新增客戶");

  $("#memberDiv").hide();
  $("#addMemberInfo").show();
}

function closeAddMember() {
  console.log("close addMemberInfo");
  $("#addMemberInfo").hide();
  $("#memberDiv").show();
}

function addMemberInfo() {
  console.log("確定新增會員");

  if (!isLogin) {
    alert("必須登入後才能進行新增客戶");
    return 0;
  }

  var dataToAdd = [
            $("#newMemberName").val(),
            $("#newMemberLINEId").val(),
            $("#newMemberGender").val(),
            $("#newMemberBirth").val(),
            $("#newMemberPhoneNum").val(),
            $("#newMemberIdNum").val(),
            $("#newMemberAssress").val(),
          ];

  //console.log(dataToAdd);

  // memberData 取回 完整的 LINE Id
  memberData.forEach(function(member, index, array){
    member[1]=memberLineId[index];
  });
  
  // 更新 local couponData
  memberData.push(dataToAdd);


  // 客戶寫入資料庫
  database.ref('users/三峽運動中心/客戶管理').set({
    會員資料: JSON.stringify(memberData),
  }, function (error) {
    if (error) {
      console.log("Write to database error");
      couponData.pop();
    }
    console.log('Write to database successful');
  });


  // 更新客戶表格  
  //  var memberTable = $('#memberTable').DataTable();
  //  memberTable.clear().draw();
  //  memberTable.rows.add(memberData);
  //  memberTable.draw();  
  //  
  //  $("#addMemberInfo").hide();
  //  $("#memberDiv").show(); 

}

// functions for Cloudinary
function readURL(input) {
  console.log("readURL");
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      console.log("aaa");
      $('#上傳優惠券圖片')
        .attr('src', e.target.result)
        .width(520)
        //.height(200);
      
      $("#上傳訊息").text("圖片尚未上傳");
      securePicUrl ="";
    };

    reader.readAsDataURL(input.files[0]);
  }
}

function readURL_detail(input) {
  console.log("readURL_detail");
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      console.log("bbb");
      $('#優惠券圖片')
        .attr('src', e.target.result)
        .width(520)
        //.height(200);
      
      $("#上傳訊息-詳細").text("圖片尚未上傳");
      securePicUrl ="";
    };

    reader.readAsDataURL(input.files[0]);
  }
}

function onProgress(){
  console.log(event.loaded, event.total);
} 

function onSuccess(){
  response = JSON.parse(this.responseText);
  
  securePicUrl = response.secure_url;
  
  if ( securePicUrl != undefined) {
    console.log("Success", securePicUrl);
    if ($("#上傳訊息").text() == "圖片上傳中 ...") $("#上傳訊息").text("圖片上傳成功");
    if ($("#上傳訊息-詳細").text() == "圖片上傳中 ...") $("#上傳訊息-詳細").text("圖片上傳成功");
  } else {
    alert("圖片上傳失敗");
    if ($("#上傳訊息").text() == "圖片上傳中 ...") $("#上傳訊息").text("圖片上傳失敗");
    if ($("#上傳訊息-詳細").text() == "圖片上傳中 ...") $("#上傳訊息-詳細").text("圖片上傳失敗");    
  }
}    
    
function uploadToCloudinary() {
  console.log("upload file to Cloudinary");
  
  var 需要上傳 = ($("#上傳訊息").text() == "圖片尚未上傳" );

  if ( !需要上傳 ){
    alert("圖片尚未選擇或圖片已上傳");
    return 0;
  }
  
  $("#上傳訊息").text("圖片上傳中 ...");
  
  var formElement =document.getElementById('picUpload')
  var dataToSend = new FormData(formElement)
  dataToSend.append("upload_preset",presetName);
  //console.log(dataToSend.getAll("upload_preset"));
  
  var xhr = new XMLHttpRequest();
  xhr.onprogress = onProgress;
  xhr.onload = onSuccess;
  xhr.open("post", cloudinaryPostUrl);
  console.log(dataToSend)
  xhr.send(dataToSend);
  
}

function updateToCloudinary() {
  console.log("update file to Cloudinary");
  
  var 需要上傳 = ($("#上傳訊息-詳細").text() == "圖片尚未上傳" );

  if ( !需要上傳 ){
    alert("圖片尚未選擇或圖片已上傳");
    return 0;
  }
  
  $("#上傳訊息-詳細").text("圖片上傳中 ...");
  
  var formElement =document.getElementById('picUpdate')
  var dataToSend = new FormData(formElement)
  dataToSend.append("upload_preset",presetName);
  //console.log(dataToSend.getAll("upload_preset"));
  
  var xhr = new XMLHttpRequest();
  xhr.onprogress = onProgress;
  xhr.onload = onSuccess;
  xhr.open("post", cloudinaryPostUrl);
  xhr.send(dataToSend);  
}

//======= Using Imgur ==============
function uploadToImgur() {
  console.log("upload file to Imgur");
  
  var 需要上傳 = ($("#上傳訊息").text() == "圖片尚未上傳" );

  if ( !需要上傳 ){
    alert("圖片尚未選擇或圖片已上傳");
    return 0;
  }
  
  $("#上傳訊息").text("圖片上傳中 ...");
  

  var myHeaders = new Headers();
  //myHeaders.append("Authorization", "Bearer 5130399359e4fe9be958edd10450a8763df34277");
  myHeaders.append("Authorization", "Client-ID e113d4b4cf3d463");

  var selectedFile=$("#file-upload").get(0).files;
  console.log(selectedFile[0].size); // 可以查看檔案大小


  var formdata = new FormData();
  formdata.append("image", selectedFile[0]);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: formdata,
    redirect: 'follow'
  };

  fetch("https://api.imgur.com/3/image", requestOptions)
  .then(response => response.text())
  .then(result => {
    var returnObj = JSON.parse(result);
    console.log(returnObj.data.link);

    securePicUrl = returnObj.data.link;

    if ( securePicUrl != undefined) {
      console.log("Success", securePicUrl);
      if ($("#上傳訊息").text() == "圖片上傳中 ...") $("#上傳訊息").text("圖片上傳成功");
      if ($("#上傳訊息-詳細").text() == "圖片上傳中 ...") $("#上傳訊息-詳細").text("圖片上傳成功");
    } else {
      alert("圖片上傳失敗");
      if ($("#上傳訊息").text() == "圖片上傳中 ...") $("#上傳訊息").text("圖片上傳失敗");
      if ($("#上傳訊息-詳細").text() == "圖片上傳中 ...") $("#上傳訊息-詳細").text("圖片上傳失敗");    
    }    
  })
  .catch(error => console.log('Upload to Imgur error', error));
  
}

function updateToImgur() {
  console.log("update file to Imgur");
  
  var 需要上傳 = ($("#上傳訊息-詳細").text() == "圖片尚未上傳" );

  if ( !需要上傳 ){
    alert("圖片尚未選擇或圖片已上傳");
    return 0;
  }
  
  $("#上傳訊息-詳細").text("圖片上傳中 ...");

  var myHeaders = new Headers();
  //myHeaders.append("Authorization", "Bearer 5130399359e4fe9be958edd10450a8763df34277");
  myHeaders.append("Authorization", "Client-ID e113d4b4cf3d463");

  var selectedFile=$("#file-update").get(0).files;
  console.log(selectedFile[0].size); // 可以查看檔案大小


  var formdata = new FormData();
  formdata.append("image", selectedFile[0]);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: formdata,
    redirect: 'follow'
  };

  fetch("https://api.imgur.com/3/image", requestOptions)
  .then(response => response.text())
  .then(result => {
    var returnObj = JSON.parse(result);
    console.log(returnObj.data.link);

    securePicUrl = returnObj.data.link;

    if ( securePicUrl != undefined) {
      console.log("Success", securePicUrl);
      if ($("#上傳訊息").text() == "圖片上傳中 ...") $("#上傳訊息").text("圖片上傳成功");
      if ($("#上傳訊息-詳細").text() == "圖片上傳中 ...") $("#上傳訊息-詳細").text("圖片上傳成功");
    } else {
      alert("圖片上傳失敗");
      if ($("#上傳訊息").text() == "圖片上傳中 ...") $("#上傳訊息").text("圖片上傳失敗");
      if ($("#上傳訊息-詳細").text() == "圖片上傳中 ...") $("#上傳訊息-詳細").text("圖片上傳失敗");    
    }    
  })
  .catch(error => console.log('Upload to Imgur error', error));
  
}