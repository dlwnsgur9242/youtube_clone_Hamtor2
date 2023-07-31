
// 비디오 목록 API 불러와 홈 화면에 보여주기
function loadVideoList() {

    // 서버와 통신하기 위한 XMLHttpRequest 객체 생성
    let xhr = new XMLHttpRequest();
    let data;

    xhr.open("GET", "http://oreumi.appspot.com/video/getVideoList");
    xhr.send();

    xhr.onload = async () => {
        // 받아 온 JSON 형식의 응답데이터를 비동기적으로 파싱하여 data 변수에 할당
        data = await (JSON.parse(xhr.responseText));
        // 받아 온 비디오리스트를 가공하여 홈 화면에 보여줌
        makeHomeDiv(data);
    }
}

// 비디오의 세부정보 API 불러오기
function loadVideoDetail(data) {
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

// 업로더 프로필 이미지 랜덤으로 띄우기 (랜덤이라기 보단 배열 순서대로 돌아가며 뜸)
function randomAvatarPic(video_id){
    let avatarPic = ['AlanCooper.svg', 'AlexisSears.svg', 'AnnaWhite.svg', 'JamesGouse.svg', 'JesicaLambert.svg', 'MainProfile.svg', 'MarcusLevin.svg', 'SkylarDias.svg'];

    let index = video_id % avatarPic.length;
    return avatarPic[index]
}

function makeHomeDiv(datas) {

    let videoList = document.getElementById('Video_Container')

    for (let data of datas) {
        let dataDetail = loadVideoDetail(data)
            .then((dataDetail) => {

                let avatarName = randomAvatarPic(dataDetail.video_id);

                let thumbnailItem = document.createElement("div");
                thumbnailItem.classList.add("thumbnail_item");

                let thumbnailImages = document.createElement("img");
                thumbnailImages.classList.add("thumbnail_images");
                thumbnailImages.src = dataDetail.image_link;

                let thumbnail = document.createElement("div");
                thumbnail.classList.add("thumbnail");

                let thumbnailProfilePic = document.createElement("img");
                thumbnailProfilePic.classList.add("thumbnail_profile_pic");
                thumbnailProfilePic.src = `./image/Avatar/${avatarName}`

                let thumbnailDesc = document.createElement("div");
                thumbnailDesc.classList.add("thumbnail_desc");

                let thumbnailDescTitle = document.createElement("div");
                thumbnailDescTitle.classList.add("thumbnail_desc_title");
                thumbnailDescTitle.textContent = dataDetail.video_title;

                let thumbnailDescInfo = document.createElement("div");
                thumbnailDescInfo.classList.add("thumbnail_desc_info");
                thumbnailDescInfo.textContent = dataDetail.video_channel;
                thumbnailDescInfo.textContent = dataDetail.views;
                thumbnailDescInfo.textContent = dataDetail.upload_date;


                thumbnailDesc.appendChild(thumbnailDescTitle);
                thumbnailDesc.appendChild(thumbnailDescInfo);

                thumbnail.appendChild(thumbnailProfilePic);
                thumbnail.appendChild(thumbnailDesc);

                thumbnailItem.appendChild(thumbnailImages);
                thumbnailItem.appendChild(thumbnail);

                videoList.appendChild(thumbnailItem);

            })
            .catch((error) => {

                console.error(error);
            });
    }
}
