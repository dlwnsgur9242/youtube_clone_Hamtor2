/* 
23.07.24 KSB : add loadVideoInfo() = get Info by videoId
23.07.24 KSB : add loadVideoList() = get List by Keyword
*/

function loadVideoList(){
    /*
    get Keyword by Element Id : Keyword
    search video by Keyword
    show search result
    */
    let videoKeyword = document.getElementById("Keyword").value // Keyword : 검색어
    if (videoKeyword ===''){
        alert('검색어를 입력해 주세요')
        return ;
    }

    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function(){
        if(xhr.readyState === XMLHttpRequest.DONE){
            if (xhr.status === 200){
                // 데이터가 잘 받아와 졌을때
                let data = JSON.parse(xhr.responseText);

                if (data.Response === 'False'){
                    alert('영상 정보를 가져오는데 실패했습니다.\nResponse Error');
                } else {
                    let videoInfo = '';
                    videoInfo += '<h2>' + data.video_title + '</h2>';
                    videoInfo += '<p><strong>채널명</strong>' + data.video_channel + '</p>';
                    videoInfo += '<p><strong>영상 설명</strong>' + data.video_detail + '</p>';
                    videoInfo += '<p><string>영상 태그</string>' + data.video_tag + '</p>'
                    
                    videoInfo += '<p><strong>ID</strong>' + video_id + '</p>';
                    videoInfo += '<img src = "' + image_link + '">'; 
                    videoInfo += '<p>영상 링크'  + video_link + '">'; 

                    document.getElementById('videoInfo').innerHTML = videoInfo;
                }
            } else {
                alert('영상 정보를 가져오는데 실패했습니다.\nStatus Error');
            }

        }

    };

    // http://oreumi.appspot.com/api-docs
    xhr.open('GET', 'http://oreumi.appspot.com/video/getVideoList'
    , true);

    xhr.send();
}


function loadVideoInfo(){
    /* HTML이 미완성이므로 하드 코딩 상태 */
    
    // 선택한 videoID를 입력하도록 후에 변경
    let videoID = 10

    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function(){
        if(xhr.readyState === XMLHttpRequest.DONE){
            if (xhr.status === 200){
                // 데이터가 잘 받아와 졌을때
                let data = JSON.parse(xhr.responseText);

                if (data.Response === 'False'){
                    alert('영상 정보를 가져오는데 실패했습니다.\nResponse Error');
                } else {
                    let videoInfo = '';
                    videoInfo += '<h2>' + data.video_title + '</h2>';
                    videoInfo += '<p><strong>채널명</strong>' + data.video_channel + '</p>';
                    videoInfo += '<p><strong>영상 설명</strong>' + data.video_detail + '</p>';
                    videoInfo += '<p><string>영상 태그</string>' + data.video_tag + '</p>'
                    
                    videoInfo += '<p><strong>ID</strong>' + data.video_id + '</p>';
                    videoInfo += '<img src = "' + data.image_link + '">'; 
                    videoInfo += '<p>영상 링크'  + data.video_link + '">'; 

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