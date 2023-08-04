
// function loadVideoDetail 는 home.js 처럼 비디오 세부정보 API를 가져왔고
// function makeChannelDiv 로 Search On '21 아래 부분 div를 만들어서 loadVideoDetail을 불러왔습니다.
// 피그마에 보시면 Search On '21이 두 번 반복되는 것처럼 보이지만, 한 개로 간주하고 아래에 비디오가 연결되어 쭉 뜨게 했습니다.
// 채널 주인을 "oreumi"라고 생각했을 때 본인 소유의 video_id = 0부터 9까지만 뜨도록 for문의 범위를 줬습니다.

function loadVideoList() {

    // 서버와 통신하기 위한 XMLHttpRequest 객체 생성
    let xhr = new XMLHttpRequest();
    let data;

    xhr.open("GET", "https://oreumi.appspot.com/video/getVideoList");
    xhr.send();

    xhr.onload = async () => {
        // 받아 온 JSON 형식의 응답데이터를 비동기적으로 파싱하여 data 변수에 할당
        data = await (JSON.parse(xhr.responseText));
        // 받아 온 비디오리스트를 가공하여 홈 화면에 보여줌
        makeChannelDiv(data);
    }
}


// 비디오의 세부정보 API 불러오기
function loadVideoDetail(data) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();

        // ${data.video_id} 를 사용하여 data 객체의 video_id 값을 동적으로 넣어줌 (id # 순서대로 불러오지는 못했음)
        xhr.open("GET", `https://oreumi.appspot.com/video/getVideoInfo?video_id=${data.video_id}`);
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
// 수정해보았지만 구동되지 않아 주석으로 남겨놓습니다
// 5개 단위로 나타나게 하려했는데 문제가 좀 있습니다
// async function makeChannelDiv(datas) {
//     const videoList = document.getElementById('Video_Container_Line')

//     // 5개씩 잘라서 표시
//     for (let i = 0; i < datas.length; i += 5) {
//         const chunk = datas.slice(i, i + 5);
//         const chunkDiv = document.createElement("div");
//         chunkDiv.classList.add("chunk_div"); // 5개를 묶어주는 div만듬 그 div에 "chunk_div"라는 클래스를 추가

//         for (let data of chunk) {
//             try {
//                 const dataDetail = await loadVideoDetail(data);

// Search On '21 아래 부분 div 만들기
function makeChannelDiv(datas) {

    const videoList = document.getElementById('Video_Container_Line')  // id는 임시로 Video_Container로 입력, channel.html과 맞춰야 합니다.

    for (let data of datas) {
        let dataDetail = loadVideoDetail(data)
            .then((dataDetail) => {

                // 하위 클래스명은 home.js와 비슷하게 했고 css 담당자와 공유 필요합니다.
                const thumbnailItem = document.createElement("div");
                thumbnailItem.classList.add("thumbnail_item");

                const thumbnailImages = document.createElement("img");
                thumbnailImages.classList.add("thumbnail_images");
                thumbnailImages.src = dataDetail.image_link;

                const thumbnailDesc = document.createElement("div");
                thumbnailDesc.classList.add("thumbnail_desc");

                const thumbnailDescTitle = document.createElement("div");
                thumbnailDescTitle.classList.add("thumbnail_desc_title");
                thumbnailDescTitle.textContent = dataDetail.video_title;

                const thumbnailDescInfo = document.createElement("div");
                thumbnailDescInfo.classList.add("thumbnail_desc_info");
                thumbnailDescInfo.textContent = dataDetail.video_channel;
                thumbnailDescInfo.textContent = dataDetail.views;
                thumbnailDescInfo.textContent = dataDetail.upload_date;


                thumbnailDesc.appendChild(thumbnailDescTitle);
                thumbnailDesc.appendChild(thumbnailDescInfo);

                thumbnailItem.appendChild(thumbnailImages);
                thumbnailItem.appendChild(thumbnailDesc);

                videoList.appendChild(thumbnailItem);

            })
            .catch((error) => {
                console.error(error);
            });
    }
}