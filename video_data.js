// /* 
// 23.07.24 KSB : add loadVideoInfo() = get Info by videoId
// 23.07.24 KSB : add loadVideoList() = get Video List 
// 23.07.25 KSB : add searchVideoList() = get Video List by Keyword
// */

getVideoList().then(createVideoItem);

let currentURL = window.location.href;
let url = new URL(currentURL);
let videoId = url.searchParams.get("id");

async function getVideoList() {
    let response = await fetch("http://oreumi.appspot.com/video/getVideoList");
    let videoListData = await response.json();
    return videoListData;
}

async function getVideoInfo(videoId) {
    let url = `http://oreumi.appspot.com/video/getVideoInfo?video_id=${videoId}`
    let response = await fetch(url);
    let videoData = await response.json();
    return videoData;
}

async function getChannelInfo(channelName) {
    let url = `http://oreumi.appspot.com/channel/getChannelInfo`;

    let response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({video_channel: channelName}),
    });

    let channelData = await response.json();
    return channelData;
}

async function getChannelVideo() {
    let response = await fetch(
        `http://oreumi.appspot.com/channel/getChannelVideo?video_channel=${channelName}`
    );
    let videoListData = await response.json();
    return videoListData;
}

async function createVideoItem(videoList) {
    let videoContainer = document.createElementClassName("Youtube_Player");
    let videoTitle = document.getElementById("Video_Info_Title");
    let videoInfoBox = document.getElementById("Video_Info_text");

    let currentVideoInfo = await getVideoInfo(videoId);
    let tagList = currentVideoInfo.video_tags;
    let channelName = currentVideoInfo.video_channel;

    videoContainer.innerHTML = `
        <video id="current_video" constrols autoplay muted>
            <source src="https://storage.googleapis.com/oreumi.appspot.com/video_${videoId}.mp4">
        </video>
    `;

    videoTitle.innerHTML = `
        <div id="video_title" class="video_title">
            ${currentVideoInfo.video_title}
        </div>
    `;

    videoInfoBox.innerHTML = `
        <p>조회수 ${convertViews(currentVideoInfo.views)}회 • ${convertDate(
            currentVideoInfo.upload_date    
        )}</p>
    `;

    let recoSortButtons = document.getElementById("reco_sort_buttons");

    recoSortButtons.innerHTML += `<button class="selected">${currentVideoInfo.video_channel}</button>`;

    for (let i = 0; i < tagList.length; i++) {
        let tag = tagList[i];

        recoSortButtons.innerHTML += `
            <button>${tag}</button>
            `;
    }

    let currentChannelInfo = await getChannelInfo(channelName);
    let currentChannelURL = `./channel.html?channelName=${channelName}`;
    let channelInfoBox = document.getElementById("Channel_profile_pic");
    channelInfoBox.innerHTML = `
        <div class="channel_profile">
            <img src=${currentChannelInfo.channel_profile} alt="">
        </div>
        <a href="${currentChannelURL}">
            <div id="channel_info_text" class="channel_info_text">
                <h5>${currentChannelInfo.channel_name}</h5>
                <p>구독자 ${convertViews(currentChannelInfo.subscribers)}명</p>
            </div>
        </a>
        `;

    let channelInfoDownSide = document.getElementById("Video_Desc_in_Video-Desc_in_Btn");
    channelInfoDownSide.innerHTML = `
        <p>${currentVideoInfo.video_details.title}
        </p>
        <button>SHOW MORE</button>
        `;

    let videoInfoPromises = videoList.map((video) => 
        getVideoInfo(video.video_id)
    );
    let videoInfoList = await Promise.all(videoInfoPromises);
    let filteredVideoList = videoInfoList.filter(
        (videoInfo) => videoInfo.video_channel === channelName
    );

    let videoListDiv = document.getElementByClassName("Video");
    let videoListItems = "";
    for (let i = 0; i < filteredVideoList.length; i++) {
        let video = filteredVideoList[i];
        let channelName = video.video_channel;
        let videoURL = `./video.html?id=%{i}"`;
        let channelURL = `./channel.html?channelName=${channelName}`;
        
        videoListItems += `
            <div class="video_box">
                <div class="video_thumnail">
                    <img src="${video.image_link}" alt="">
                </div>
                <div class="video_textbox">
                    <a href="${videoURL}">
                    <h4>${video.video_title}</h4>
                    </a>
                    <a href="${channelURL}">
                        <p>${video.video_channel}</p>
                    </a>
                    <p>조회수 ${convertViews(video.views)} • ${convertDate(
                        video.upload_date
                    )}</p>
                </div>
            </div>
            `;
    }
    videoListDiv.innerHTML = videoListItems;
}

// function loadVideoList(){
//     /*
//     show all Video List
//     */

//     let xhr = new XMLHttpRequest();

//     xhr.onreadystatechange = function(){
//         if(xhr.readyState === XMLHttpRequest.DONE){
//             if (xhr.status === 200){
//                 // 데이터가 잘 받아와 졌을때
//                 let data = JSON.parse(xhr.responseText);

//                 // data 확인용 코드
//                 // let rawData = '';
//                 // rawData += '<p>' + data + '</p>';
//                 // document.getElementById('rawVideoList').innerHTML = rawData;

//                 if (data.Response === 'False'){
//                     alert('영상 목록을 가져오는데 실패했습니다.\nResponse Error');
//                 } else {
//                     // HTML 코드 작성용 변수
//                     let videoList = '';

//                     // 모든 영상의 갯수만큼 반복
//                     for (let i = 0; i < data.length; i++){
                        
//                         // 번호(임의) & 제목
//                         videoList += '<h3> [' + i+1 + '] ' + data[i].video_title + '</h3>';
                        
//                         // 채널명 & 태그 & 번호(고유번호)
//                         videoList += '<p><strong>채널명: ' + data[i].video_channel + ' / 영상 태그: ' + data[i].video_tag + ' / ID: ' + data[i].video_id + '</strong></p>';
                        
//                         // 설명
//                         videoList += '<p>영상 설명: ' + data[i].video_detail + '</p>';

//                         // 게시일 & 조회수
//                         videoList += '<p><strong>게시일: </strong>' + data[i].upload_date + ' / 조회수: ' + data[i].views + '</p>';
//                     };

//                     // HTML 코드 적용
//                     document.getElementById('videoList').innerHTML = videoList;
//                 }
//             } else {
//                 alert('영상 목록을 가져오는데 실패했습니다.\nStatus Error');
//             }
//         }
//     };

//     // http://oreumi.appspot.com/api-docs
//     xhr.open('GET', 'http://oreumi.appspot.com/video/getVideoList', true);

//     xhr.send();
// }

// function searchVideoList(){
//     /*
//     get Keyword by 'Element Id : Keyword'
//     search by Keyword
//     show searched Video List
    
//     loadVideoList를 통해 불러온 모든 Video 정보에서
//     제목과 설명을 기반으로
//     키워드가 들어간 영상을 찾아내는 함수
//     */

// }


<<<<<<< HEAD
function loadVideoInfo(videoID){
    /* 
    HTML이 미완성이므로 하드 코딩 상태 
    search by Video Id
    show Video Info
    */
    
    // 선택한 videoID를 입력하도록 후에 변경
    videoID = 10

    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function(){
        if(xhr.readyState === XMLHttpRequest.DONE){
            if (xhr.status === 200){
                // 데이터가 잘 받아와 졌을때
                let data = JSON.parse(xhr.responseText);

                if (data.Response === 'False'){
                    alert('영상 정보를 가져오는데 실패했습니다.\nResponse Error');
                } else {
                    // HTML 코드 작성용 변수
                    let videoInfo = '';
=======
// function loadVideoInfo(){
//     /* 
//     HTML이 미완성이므로 하드 코딩 상태 
//     search by Video Id
//     show Video Info
//     */
    
//     // 선택한 videoID를 입력하도록 후에 변경
//     let videoID = 10

//     let xhr = new XMLHttpRequest();

//     xhr.onreadystatechange = function(){
//         if(xhr.readyState === XMLHttpRequest.DONE){
//             if (xhr.status === 200){
//                 // 데이터가 잘 받아와 졌을때
//                 let data = JSON.parse(xhr.responseText);

//                 if (data.Response === 'False'){
//                     alert('영상 정보를 가져오는데 실패했습니다.\nResponse Error');
//                 } else {
//                     // HTML 코드 작성용 변수
//                     let videoInfo = '';
>>>>>>> js_2
                    
//                     // 영상의 모든 정보 입력
//                     videoInfo += '<h2>' + data.video_title + '</h2>';
//                     videoInfo += '<p><strong>채널명: </strong>' + data.video_channel + '</p>';
//                     videoInfo += '<p><strong>영상 설명: </strong>' + data.video_detail + '</p>';
//                     videoInfo += '<p><string>영상 태그: </string>' + data.video_tag + '</p>'
                    
//                     videoInfo += '<p><strong>ID: </strong>' + data.video_id + '</p>';
//                     videoInfo += '<img src = "' + data.image_link + '">'; 
//                     videoInfo += '<p>영상 링크: ' + data.video_link + '</p>'; 

//                     document.getElementById('videoInfo').innerHTML = videoInfo;
//                 }
//             } else {
//                 alert('영상 정보를 가져오는데 실패했습니다.\nStatus Error');
//             }  
//         }
//     };

//     // http://oreumi.appspot.com/api-docs
//     xhr.open('GET', 'http://oreumi.appspot.com/video/getVideoInfo?video_id=' + 
//     encodeURIComponent(videoID), true);

//     xhr.send();

// }