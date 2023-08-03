/* 
23.07.24 KSB : add loadVideoInfo() = get Info by videoId
23.07.24 KSB : add loadVideoList() = get Video List 
23.07.25 KSB : add searchVideoList() = get Video List by Keyword
*/

function loadVideoList(){
    /*
    show all Video List
    */

    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function(){
        if(xhr.readyState === XMLHttpRequest.DONE){
            if (xhr.status === 200){
                // 데이터가 잘 받아와 졌을때
                let data = JSON.parse(xhr.responseText);

                // data 확인용 코드
                // let rawData = '';
                // rawData += '<p>' + data + '</p>';
                // document.getElementById('rawVideoList').innerHTML = rawData;

                if (data.Response === 'False'){
                    alert('영상 목록을 가져오는데 실패했습니다.\nResponse Error');
                } else {
                    // HTML 코드 작성용 변수
                    let videoList = '';

                    // 모든 영상의 갯수만큼 반복
                    for (let i = 0; i < data.length; i++){
                        
                        // 번호(임의) & 제목
                        videoList += '<h3> [' + i+1 + '] ' + data[i].video_title + '</h3>';
                        
                        // 채널명 & 태그 & 번호(고유번호)
                        videoList += '<p><strong>채널명: ' + data[i].video_channel + ' / 영상 태그: ' + data[i].video_tag + ' / ID: ' + data[i].video_id + '</strong></p>';
                        
                        // 설명
                        videoList += '<p>영상 설명: ' + data[i].video_detail + '</p>';

                        // 게시일 & 조회수
                        videoList += '<p><strong>게시일: </strong>' + data[i].upload_date + ' / 조회수: ' + data[i].views + '</p>';
                    };

                    // HTML 코드 적용
                    document.getElementById('videoList').innerHTML = videoList;
                }
            } else {
                alert('영상 목록을 가져오는데 실패했습니다.\nStatus Error');
            }
        }
    };

    // http://oreumi.appspot.com/api-docs
    xhr.open('GET', 'http://oreumi.appspot.com/video/getVideoList', true);

    xhr.send();
}

function searchVideoList(){
    /*
    get Keyword by 'Element Id : Keyword'
    search by Keyword
    show searched Video List
    
    loadVideoList를 통해 불러온 모든 Video 정보에서
    제목과 설명을 기반으로
    키워드가 들어간 영상을 찾아내는 함수
    */

}


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
                    
                    // 영상의 모든 정보 입력
                    videoInfo += '<h2>' + data.video_title + '</h2>';
                    videoInfo += '<p><strong>채널명: </strong>' + data.video_channel + '</p>';
                    videoInfo += '<p><strong>영상 설명: </strong>' + data.video_detail + '</p>';
                    videoInfo += '<p><string>영상 태그: </string>' + data.video_tag + '</p>'
                    
                    videoInfo += '<p><strong>ID: </strong>' + data.video_id + '</p>';
                    videoInfo += '<img src = "' + data.image_link + '">'; 
                    videoInfo += '<p>영상 링크: ' + data.video_link + '</p>'; 

                    document.getElementById('videoInfo').innerHTML = videoInfo;
                }
            } else {
                alert('영상 정보를 가져오는데 실패했습니다.\nStatus Error');
            }  
        }
    };

    // http://oreumi.appspot.com/api-docs
    xhr.open('GET', 'http://oreumi.appspot.com/video/getVideoInfo?video_id=' + 
    encodeURIComponent(videoID), true);

    xhr.send();

}