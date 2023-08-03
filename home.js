//////* API 로 데이터 수신 */////

// API로 비디오 목록 데이터 받기
async function getVideoList() {
    let response = await fetch("http://oreumi.appspot.com/video/getVideoList");
    let videoList = await response.json();
    return videoList;
}

// API로 비디오의 세부 데이터 받기
async function getVideoDetail(data) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();

        // ${data.video_id} 를 사용하여 data 객체의 video_id 값을 동적으로 넣어줌 (id # 순서대로 불러오지는 못했음)
        xhr.open("GET", `http://oreumi.appspot.com/video/getVideoInfo?video_id=${data.video_id}`);
        xhr.send();

        xhr.onload = () => {
            const dataDetail = JSON.parse(xhr.responseText);
            resolve(dataDetail);
        };

        xhr.onerror = () => {
            reject(new Error('Failed to load video detail'));
        };
    });
}

// API로 채널 데이터 받기
async function getChannelInfo(channelName) {
  
    // API 통해서 데이터 수신
    let url = `http://oreumi.appspot.com/channel/getChannelInfo`;
  
    let response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ video_channel: channelName }),
    });
  
    // 받은 데이터 파싱
    let channelData = await response.json();
  
    return channelData;
}



// 비디오 목록 API 불러와 홈 화면에 보여주기
async function loadVideoList(){
    let xhr = new XMLHttpRequest(); // 서버와 통신하기 위한 XMLHttpRequest 객체 
    xhr.open("GET", "http://oreumi.appspot.com/video/getVideoList");
    xhr.send();

    xhr.onload = async () => {
        // 받아 온 JSON 형식의 응답데이터를 비동기적으로 파싱하여 data 변수에 할당
        let data = await (JSON.parse(xhr.responseText));
        // 받아 온 비디오리스트를 가공하여 홈 화면에 보여줌
        makeHomeDiv(data);
    }
    
    // makeHomeDiv(getVideoList())
}

// async function loadVideoList() {
//     try {
//         let videoList = await getVideoList();
//         makeHomeDiv(videoList);
//     } catch(error) {
//         console.error("Failed to load video list", error);
//     }
// } window.addEventListener("DOMContentLoaded", loadVideoList);



// 입력 받은 데이터를 통해 HTML div 코드 작성 : ver Home
async function makeHomeDiv(datas) {

    // Video_Container(ID:purple 이었던 것)으로 변경
    let videoList = document.getElementById('Video_Container')

    for (let data of datas) {
        try {
        
        let dataDetail = await getVideoDetail(data);
        let avatarName = getVideoImgInfo(dataDetail.video_id);
        

                //let avatarName = randomAvatarPic(dataDetail.video_id);
                
                /* 구성 요소
                최상위 : thumbnailItem
                상위 : thumbnailImages, thumbnail
                중위 : thumbnailProfilePic, thumbnailDesc
                하위 : thumbnailDescTitle, thumbnailDescInfo

                thumbnailItem = thumbnailImages + thumbnail(thumbnailProfilePic + thumbnailDesc(thumbnailDescTitle + thumbnailDescInfo))

                thumbnailItem 은 thumbnail 와 thumbnailImages 으로 구성
                thumbnail 은 thumbnailProfilePic 와 thumbnailDesc 으로 구성
                thumbnailDesc 은 thumbnailDescTitle 와 thumbnailDescInfo 으로 구성
                */

                // thumbnailItem : 최상위 구성 요소
                let thumbnailItem = document.createElement("div");
                thumbnailItem.classList.add("thumbnail_item");

                // thumbnailImages, thumbnail : 상위 구성 요소
                let thumbnailImages = document.createElement("img");
                thumbnailImages.classList.add("thumbnail_images");
                thumbnailImages.src = dataDetail.image_link;

                let thumbnail = document.createElement("div");
                thumbnail.classList.add("thumbnail");

                // thumbnailProfilePic, thumbnailDesc : 중위 구성 요소 
                let thumbnailProfilePic = document.createElement("img");
                thumbnailProfilePic.classList.add("thumbnail_profile_pic");
                let channelDetail = getChannelInfo(dataDetail.video_channel); // channel_profile 가져오는데 사용
                thumbnailProfilePic.src = channelDetail.channel_profile /* Err: 채널의 프로필을 온전히 가져오지 못하고 있음 */

                let thumbnailDesc = document.createElement("div");
                thumbnailDesc.classList.add("thumbnail_desc");

                // thumbnailDescTitle, thumbnailDescInfo : 하위 구성 요소
                let thumbnailDescTitle = document.createElement("div");
                thumbnailDescTitle.classList.add("thumbnail_desc_title");
                thumbnailDescTitle.textContent = dataDetail.video_title;

                let thumbnailDescInfo = document.createElement("div");
                thumbnailDescInfo.classList.add("thumbnail_desc_info");
                thumbnailDescInfo.textContent = dataDetail.video_channel;
                thumbnailDescInfo.textContent = dataDetail.views;
                thumbnailDescInfo.textContent = dataDetail.upload_date;



                // 구성 요소 결합
                thumbnailDesc.appendChild(thumbnailDescTitle);
                thumbnailDesc.appendChild(thumbnailDescInfo);

                thumbnail.appendChild(thumbnailProfilePic);
                thumbnail.appendChild(thumbnailDesc);

                thumbnailItem.appendChild(thumbnailImages);
                thumbnailItem.appendChild(thumbnail);

                // 구성 요소 적용
                videoList.appendChild(thumbnailItem);
            } catch (error) {
                console.error("Failed to load video detail", error);
            }
            };
}


// 입력 받은 데이터를 통해 HTML div 코드 작성
// makeHomeDiv 함수를 범용성 있게 개선 => 검색, channel 영상 목록 등에 사용 (makeHomeDiv 함수 완성 후 작성 예정)
function makeVideoDiv(datas) {
    
}

/* channel api 사용하는 코드로 수정한 후, 기존 코드 주석 처리 예정 */
// 업로더 프로필 이미지 랜덤으로 띄우기 (랜덤이라기 보단 배열 순서대로 돌아가며 뜸)
// randomAvatarPic -> getVideoImgInfo
function getVideoImgInfo(video_id){
    let avatarPic = ['AlanCooper.svg', 'AlexisSears.svg', 'AnnaWhite.svg', 'JamesGouse.svg', 'JesicaLambert.svg', 'MainProfile.svg', 'MarcusLevin.svg', 'SkylarDias.svg'];

    let index = video_id % avatarPic.length;
    return avatarPic[index]
} 



//////* 검색 기능 *//////

// nav_searchBox : 검색어 입력 창
let searchBox = document.getElementById("nav_searchBox");
// nav_search_Box_But : 검색 버튼
let searchButton = document.getElementById("nav_search_Box_But");



// 검색 함수
async function searchVideo(){
    let searchKeyword = searchBox.value.toLowerCase(); // 검색어 

    try {
        let videoList = await getVideoList();
        let filteredVideoList = videoList.filter((video) => {
            // video.video_title이 존재하고, 검색어가 포함된 제목의 영상을 필터링
            return video.video_title && video.video_title.toLowerCase().includes(searchKeyword);
        });
        makeHomeDiv(filteredVideoList);
    } catch (error) {
        console.error("Failed to search video", error);
    }
}

// '검색 버튼' 클릭 시 검색 동작
searchButton.addEventListener("click", function () {
    searchVideo()
});

// '검색어 입력창'에서 엔터 키 입력 시 동작
searchBox.addEventListener("keypress", function (event) {
    if (event.keyCode === 13) { // ENTER(\n) === 13 <ASCII>
        searchVideo()
    }
});