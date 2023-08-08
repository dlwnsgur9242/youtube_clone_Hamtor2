// 비디오 조회수 포맷팅 함수
function formatViews(views) {
  return views.toLocaleString();
}

// 비디오 정보를 가져오는 함수 (병렬 처리)
async function getVideoInfo(videoId) {
  const apiUrl = `http://oreumi.appspot.com/video/getVideoInfo?video_id=${videoId}`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data;
}

// API로 채널 데이터 받기
async function getChannelInfo(channelName) {
  try {
    const url = `https://oreumi.appspot.com/channel/getChannelInfo`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ video_channel: channelName }),
    });

    const channelData = await response.json();
    return channelData;
  } catch (error) {
    console.error("Error fetching channel info:", error);
    return {};
  }
}

// 이미지 로딩을 위한 IntersectionObserver 생성
const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const lazyImage = entry.target;
      lazyImage.src = lazyImage.dataset.src;
      lazyImage.classList.remove('lazy');
      imageObserver.unobserve(lazyImage);
    }
  });
}, {
  threshold: 0.1, // 뷰포트 내에 10% 이상 들어왔을 때 로딩 시작
});

// 비디오 목록을 출력하는 함수 (비동기/병렬 처리)
async function displayVideoList(searchQuery = '') {
  const videoListContainer = document.getElementById('Video_Container');
  let videoListHtml = ''; // 비디오 정보를 누적할 빈 문자열

  try {
    // 비디오 정보를 병렬로 가져오고 출력
    const videoInfoPromises = Array.from({ length: 21 }, (_, videoId) => getVideoInfo(videoId));
    const videoInfoList = await Promise.all(videoInfoPromises);

    for (const videoInfo of videoInfoList) {
      // 검색어 필터링
      const lowerCaseVideoTitle = videoInfo.video_title.toLowerCase();
      const lowerCaseVideoChannel = videoInfo.video_channel.toLowerCase();
      const lowerCaseSearchQuery = searchQuery.toLowerCase();

      if (searchQuery && !(lowerCaseVideoTitle.includes(lowerCaseSearchQuery) || lowerCaseVideoChannel.includes(lowerCaseSearchQuery))) {
        continue;
      }

      // 조회수 포맷팅
      const formattedViews = formatViews(videoInfo.views);

      // 채널 정보 가져오기
      const channelInfo = await getChannelInfo(videoInfo.video_channel);

      // 각각의 비디오 정보를 표시하는 HTML 코드 생성
      const videoItemHtml = `
        <div class="video-grid-box">
          <div class="thumbnail-row">
            <a href="video_page.html?id=${videoInfo.video_id}">
              <img class="thumbnail lazy" data-src="${videoInfo.image_link}" alt="Thumbnail" />
            </a>
          </div>
          <div class="video-info-grid">
            <div class="channel-picture">
              <a href="Channel_page.html?name=${videoInfo.video_channel}">
                <img class="profile-picture lazy" data-src="${channelInfo.channel_profile}" alt="Thumbnail"/>
              </a>
            </div>
            <div class="video-info">
              <p class="video-title">${videoInfo.video_title}</p>
              <p class="video-stats">조회수: ${formattedViews} 회 &#183; ${videoInfo.upload_date}</p>
            </div>
          </div>
        </div>
      `;

      videoListHtml += videoItemHtml;
    }

    // 비디오 목록 출력
    videoListContainer.innerHTML = videoListHtml;

    // 이미지 태그에 대해 이미지 지연 로딩 적용
    const lazyImages = document.querySelectorAll('.lazy');
    lazyImages.forEach((lazyImage) => {
      imageObserver.observe(lazyImage);
    });
  } catch (error) {
    console.error("Error displaying video list:", error);
  }
}

// 검색 버튼 클릭 이벤트 핸들러 등록
document.getElementById('nav_search_Box_But').addEventListener('click', () => {
  const searchQuery = document.getElementById('search_input').value;
  displayVideoList(searchQuery); // 검색 쿼리에 따라 비디오를 표시
});

// 검색 창에서 Enter 키 이벤트 핸들러 등록
document.getElementById('search_input').addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    const searchQuery = document.getElementById('search_input').value;
    displayVideoList(searchQuery); // 검색 쿼리에 따라 비디오를 표시
  }
});

// 페이지 로드 시 초기 비디오 목록 표시
window.addEventListener('DOMContentLoaded', () => {
  // 초기 비디오 목록 출력 후 이미지 로딩 시작
  displayVideoList();
});