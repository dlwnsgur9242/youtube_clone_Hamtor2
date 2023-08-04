// API로 비디오 목록 데이터 받기
async function getVideoList() {
  let response = await fetch("https://oreumi.appspot.com/video/getVideoList");
  let videoList = await response.json();
  return videoList;
}

// API로 비디오의 세부 데이터 받기
async function getVideoDetail(data) {
  let response = await fetch(`https://oreumi.appspot.com/video/getVideoInfo?video_id=${data.video_id}`);
  let dataDetail = await response.json();
  return dataDetail;
}

// API로 채널 데이터 받기
async function getChannelInfo(channelName) {
  let url = `https://oreumi.appspot.com/channel/getChannelInfo`;

  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ video_channel: channelName }),
  });

  let channelData = await response.json();
  return channelData;
}

// API로 비디오 목록 검색
async function searchVideoList(query) {
  let response = await fetch(`https://oreumi.appspot.com/video/search?query=${encodeURIComponent(query)}`);
  let searchResults = await response.json();
  return searchResults;
}

// 입력 받은 데이터를 통해 HTML div 코드 작성 : ver Home
async function makeHomeDiv(datas) {
  const videoListContainer = document.getElementById('Video_Container');
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
  }
}

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
document.getElementById('Video_Container').addEventListener('click', async event => {
  const target = event.target.closest('.thumbnail_item');
  if (target) {
    const index = Array.from(target.parentElement.children).indexOf(target);
    const videoList = await getVideoList();
    const selectedVideo = videoList[index];
    window.location.href = `channel.html?video_id=${selectedVideo.video_id}`;
  }
});

// 비디오 목록 로드 및 화면에 표시
async function loadVideoList() {
  try {
    let videoList = await getVideoList();
    makeHomeDiv(videoList);
  } catch (error) {
    console.error('Failed to load video list', error);
  }
}

// 페이지 로딩 시 비디오 목록 로드
loadVideoList();