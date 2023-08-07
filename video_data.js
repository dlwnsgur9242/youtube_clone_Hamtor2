// API로 비디오 목록 데이터 받기
async function getVideoList() {
<<<<<<< HEAD
    let response = await fetch("https://oreumi.appspot.com/video/getVideoList");
    let videoListData = await response.json();
    return videoListData;
}

async function getVideoInfo(videoId) {
    let url = `https://oreumi.appspot.com/video/getVideoInfo?video_id=${videoId}`
    let response = await fetch(url);
    let videoData = await response.json();
    return videoData;
}

async function getChannelInfo(channelName) {
    let url = `https://oreumi.appspot.com/channel/getChannelInfo`;

=======
    try {
      let response = await fetch("https://oreumi.appspot.com/video/getVideoList");
      if (!response.ok) {
        throw new Error("Failed to fetch video list");
      }
      let videoList = await response.json();
      return videoList;
    } catch (error) {
      console.error(error);
      return [];
    }
}
  
// API로 비디오의 세부 데이터 받기
async function getVideoDetail(data) {
    try {
      let response = await fetch(`https://oreumi.appspot.com/video/getVideoInfo?video_id=${data.video_id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch video detail");
      }
      let dataDetail = await response.json();
      return dataDetail;
    } catch (error) {
      console.error(error);
      return {};
    }
}
  
  // API로 채널 데이터 받기
  async function getChannelInfo(channelName) {
    let url = `https://oreumi.appspot.com/channel/getChannelInfo`;
  
>>>>>>> js_2
    let response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ video_channel: channelName }),
    });
  
    let channelData = await response.json();
    return channelData;
<<<<<<< HEAD
}

async function getChannelVideo() {
    let response = await fetch(
        `https://oreumi.appspot.com/channel/getChannelVideo?video_channel=${channelName}`
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
=======
  }
  
  // API로 비디오 목록 검색
  async function searchVideoList(query) {
    let response = await fetch(`https://oreumi.appspot.com/video/search?query=${encodeURIComponent(query)}`);
    let searchResults = await response.json();
    return searchResults;
  }
  
  // 입력 받은 데이터를 통해 HTML div 코드 작성 : ver Home
  async function makeHomeDiv(datas) {
    const videoListContainer = document.getElementById('Video');
    videoListContainer.innerHTML = ""; // 검색 결과를 보여줄 컨테이너 비우기
  
    try {
      const avatarPic = ['AlanCooper.svg', 'AlexisSears.svg', 'AnnaWhite.svg', 'JamesGouse.svg', 'JesicaLambert.svg', 'MainProfile.svg', 'MarcusLevin.svg', 'SkylarDias.svg'];
  
      const channelCache = new Map();
  
      const videoDetailPromises = datas.map(data => getVideoDetail(data));
      const videoDetails = await Promise.all(videoDetailPromises);
  
      for (let i = 0; i < datas.length; i++) {
        const data = datas[i];
        const dataDetail = videoDetails[i];
        const channelName = dataDetail.video_channel;
  
        let channelDetail;
        if (channelCache.has(channelName)) {
          channelDetail = channelCache.get(channelName);
        } else {
          channelDetail = await getChannelInfo(channelName);
          channelCache.set(channelName, channelDetail);
        }
  
        const avatarName = avatarPic[i % avatarPic.length];
        const thumbnailImages = `<img class="thumbnail_images" src="${dataDetail.image_link}" alt="Thumbnail Image">`;
        const thumbnailProfilePic = `<img class="thumbnail_profile_pic" src="${channelDetail.channel_profile}" alt="Channel Profile">`;
        const thumbnailDescTitle = `<div class="thumbnail_desc_title">${dataDetail.video_title}</div>`;
        const thumbnailDescInfo = `<div class="thumbnail_desc_info">${dataDetail.video_channel} - ${dataDetail.views} views - ${dataDetail.upload_date}</div>`;
        const thumbnailDesc = `<div class="thumbnail_desc">${thumbnailDescTitle}${thumbnailDescInfo}</div>`;
        const thumbnail = `<div class="thumbnail">${thumbnailProfilePic}${thumbnailDesc}</div>`;
        const thumbnailItem = `<div class="thumbnail_item">${thumbnailImages}${thumbnail}</div>`;
  
        videoListContainer.insertAdjacentHTML('beforeend', thumbnailItem);
      }
    } catch (error) {
      console.error("Failed to load video detail", error);
>>>>>>> js_2
    }
  }
// 비디오 목록 로드 및 화면에 표시
async function loadVideoList() {
    try {
      let videoList = await getVideoList();
      makeHomeDiv(videoList);
    } catch (error) {
      console.error('Failed to load video list', error);
    }
<<<<<<< HEAD
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
                }
            }
        }
    }
}
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
=======
  }
  
// DOMContentLoaded 이벤트를 기다린 후 비디오 목록 로드
document.addEventListener('DOMContentLoaded', async () => {
// 검색 버튼 클릭 시 동작
document.getElementById('nav_search_Box_But_icon').addEventListener('click', () => {
    performSearch();
});

// 엔터 키 누를 시 동작
document.getElementById('search_input').addEventListener('keyup', event => {
    if (event.key === 'Enter') {
    performSearch();
    }
});

// 비디오 아이템 클릭 시 페이지 이동
document.querySelector('.thumbnail_items').addEventListener('click', async event => {
    const target = event.target.closest('.thumbnail_item');
    if (target) {
    const index = Array.from(target.parentElement.children).indexOf(target);
    const videoList = await getVideoList();
    const selectedVideo = videoList[index];
    window.location.href = `channel.html?video_id=${data.video_id}`;
    }
});

// 비디오 목록 로드
await loadVideoList();
});
>>>>>>> js_2
