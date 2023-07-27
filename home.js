
// 비디오 목록 API 불러와 홈 화면에 보여주기
function loadVideoList() {

    // 서버와 통신하기 위한 XMLHttpRequest 객체 생성
    let xhr = new XMLHttpRequest();
    // 비디오 리스트를 담을 변수 선언
    let data;

    xhr.open("GET", "http://oreumi.appspot.com/video/getVideoList");
    xhr.send();

    xhr.onload = async () => {
        // 받아 온 JSON 형식의 응답데이터를 비동기적으로 파싱하여 data 변수에 할당
        data = await (JSON.parse(xhr.responseText));
        // 받아 온 비디오리스트를 가공하여 홈 화면에 
        makeHomeDiv(data);
    }
}

// 비디오의 세부정보 API 불러오기
function loadVideoDetail(data) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();

        // ${data.video_id} 를 사용하여 data 객체의 video_id 값을 동적으로 넣어줌. 0~20 순서대로 나오게 구현해야 함.
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

function makeHomeDiv(datas) {

    const videoList = document.getElementById('videoList')

    for (let data of datas) {
        let dataDetail = loadVideoDetail(data)
            .then((dataDetail) => {

                const thumbnailItem = document.createElement("div");
                thumbnailItem.classList.add("thumbnail-item");

                const thumbnailImages = document.createElement("div");
                thumbnailImages.classList.add("thumbnail-images");


                const thumbnail = document.createElement("div");
                thumbnail.classList.add("thumbnail");

                const thumbnailProfilePic = document.createElement("div");
                thumbnailProfilePic.classList.add("thumbnail-profile-pic");

                const thumbnailDesc = document.createElement("div");
                thumbnailDesc.classList.add("thumbnail-desc");

                const thumbnailDescTitle = document.createElement("div");
                thumbnailDescTitle.classList.add("thumbnail-desc-title");

                const thumbnailDescInfo = document.createElement("div");
                thumbnailDescInfo.classList.add("thumbnail-desc-info");


                thumbnailDesc.appendChild(thumbnailDescTitle);
                thumbnailDesc.appendChild(thumbnailDescInfo);

                thumbnail.appendChild(thumbnailProfilePic);
                thumbnail.appendChild(thumbnailDesc);

                thumbnailItem.appendChild(thumbnailImages);
                thumbnailItem.appendChild(thumbnail);


                videoList.appendChild(thumbnailItem);

            })
            .catch((error) => {
                // 오류 처리
                console.error(error);
            });


    }

}
