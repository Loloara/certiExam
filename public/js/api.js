//Shorten 버튼 클릭시 /api/shorten post 요청
//error 처리 -> message 출력
//URL 유효성 체크 안함
$('#shortenButton').click(function(){
  $.ajax({
    'url':'/api/shorten',
    'type':'POST',
    'dataType':'json',
    'data':{'longUrl':$('#longUrlInput').val()},
    'success':  function(result){
        if(result['result'] === 'SUCCESS')
            $('#shortUrlLabel').html("<a href= \"" + result['shortUrl'] +"\">" +result['shortUrl']+"</a>");
        else
            $('#shortUrlLabel').html(result['message']);
    }
  });
});

//Customize 버튼 클릭시 DB에 있는 URL일시 /api/korean put 요청
//DB에 없는 URL일시 /api/korean post 요청
//Custom URL 중복 에러 처리
$('#customButton').click(function(){
  $.ajax({  //변환한적 있는 URL인지 확인
    'url':'/api/korean',
    'type':'GET',
    'dataType':'json',
    'data':{'longUrl':$('#originalUrlInput').val()},
    'success':  function(result){
        if(result['result'] === 'SUCCESS'){
            if(result['message'] === 'not found'){    //변환한적 없는 URL
              $.ajax({  //DB에 새로운 URL 저장 및 custom url 셋팅
                'url':'/api/korean',
                'type':'POST',
                'dataType':'json',
                'data':{'longUrl':$('#originalUrlInput').val(), 'customUrl':$('#koreanUrlInput').val()},
                'success': function(result2){
                  if(result2['result'] === 'SUCCESS'){
                      $('#customUrlLabel').html("<a href= \"" + result2['customUrl'] +"\">" +result2['customUrl']+"</a>");
                    }
                  else{ //
                      $('#customUrlLabel').html(result2['message']);
                      $('#koreanUrlInput').val('');
                    }
                }
              });
            }else{
              $.ajax({
                'url':'/api/korean',
                'type':'PUT',
                'dataType':'json',
                'data':{'longUrl':$('#originalUrlInput').val(), 'customUrl':$('#koreanUrlInput').val()},
                'success': function(result2){
                  if(result2['result'] === 'SUCCESS'){
                      $('#customUrlLabel').html("<a href= \"" + result2['customUrl'] +"\">" +result2['customUrl']+"</a>");
                    }
                  else{
                      $('#customUrlLabel').html(result2['message']);
                      $('#koreanUrlInput').val('');
                    }
                }
              });
            }
        }
        else{
            $('#customUrlLabel').html(result['message']);
        }
    }
  });
});

//Analyze 버튼 클릭시 /api/analysis get 요청
$('#analysisButton').click(function(){
  $.ajax({
    'url':'/api/analysis',
    'type':'GET',
    'dataType':'json',
    'data':{'customUrl':$('#customUrlInput').val()},
    'success':  function(result){
        if(result['result'] === 'SUCCESS'){
            $('#analysisLabel').html('http://localhost:3000/'+ $('#customUrlInput').val() +' 로 방문한 횟수: '+result['count'] + '번');
          }
        else{
            $('#analysisLabel').html(result['message']);
            $('#customUrlInput').val('');
          }
    }
  });
});
