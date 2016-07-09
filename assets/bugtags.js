require([ 'gitbook', 'jquery'],function( gitbook, $ ){
    var MAX_RESULTS = 15;
    var MAX_DESCRIPTION_SIZE = 500;

    var usePushState = (typeof history.pushState !== 'undefined');

    // DOM Elements
    var $body = $('body');
    var $bookSearchResults;
    var $searchInput;
    var $searchList;
    var $searchTitle;
    var $searchResultsCount;
    var $searchQuery;
    var keyword;
    var xhr;
    var CONFIG = {};

    function getCookie( name ){
        var nameEQ = name + '=';
        var cookies = document.cookie.split(';');
        var cookie;

        for (var i = 0; i < cookies.length; i++) {
            cookie = cookies[i];

            while ( cookie.charAt(0) == ' ') {
                cookie = cookie.substring(1, cookie.length);
            }

            if (cookie.indexOf(nameEQ) == 0) {
                return cookie.substring(nameEQ.length, cookie.length);
            }
        }
        return null;
    }

    function initUser(){
        if( !CONFIG.userApi ){
            return true;
        }
        var userId = getCookie('user_id');
        if (userId) {
            $.ajax({
                url: CONFIG.userApi + userId,
                xhrFields: { withCredentials: true },
                dataType:'jsonp',
                jsonp:'_callback',
                success:function(req){
                    if(typeof req === 'string'){
                        req = JSON.parse(req);
                    }
                    if (req.ret === 0) {
                        renderUser(req.data);
                    }
                }
            })
        }
    }

    function renderUser( data ){
        var $header = $('header .global-nav ul')
        $header.find('li.register,li.log').hide()
        var html = '<a href="' + CONFIG.siteHost + '" target="_blank">'
            + '<img src="' + data.avatar + '">' + data.nickname
            + '</a>'
        $header.find('li.user').html( html ).show()
    }

    function bindSearch(){
        $searchInput        = $('#book-search-input input');
        $bookSearchResults  = $('#book-search-results');
        $searchList         = $bookSearchResults.find('.search-results-list');
        $searchTitle        = $bookSearchResults.find('.search-results-title');
        $searchResultsCount = $searchTitle.find('.search-results-count');
        $searchQuery        = $searchTitle.find('.search-query');
        if( !CONFIG.searchPrefix ){
            console.log("没有配置搜索 API")
            return;
        }
        $searchInput.on("keyup",function( e ){
            var q = $(this).val()
            if( q ){
                if( q != keyword ){
                    if( xhr ){
                        // xhr.abort()
                    }
                    keyword = q
                    launchSearch( q )
                }
            }else{
                closeSearch()
            }
        })
    }

    function closeSearch() {
        keyword = null
        $body.removeClass('with-search');
        $body.removeClass('search-loading')
        $bookSearchResults.removeClass('open');
        // Empty search input
        $searchInput.val('');
    }

    function displayResults( res ){
        $bookSearchResults.addClass('open');
        var noResults = res.list.length == 0;
        $bookSearchResults.toggleClass('no-results', noResults);
        $searchList.empty();
        $searchResultsCount.text(res.count);
        $searchQuery.text( keyword );
        console.log("Should display results here")
    }

    function launchSearch( q ){
        $body.addClass('with-search');
        $body.addClass('search-loading');
        var url = CONFIG.searchPrefix + encodeURIComponent( q )
        // xhr = $.get( url, function( res ){
        //     console.log( res )
        // })
        var fakeRes = {
        }

        setTimeout(function(){
            displayResults( fakeRes )
        },2000)
    }

    function resetContainerHeight(){
        var gH = $(window).height()
        var $bookBody = $('.body-wrapper .book')
        $bookBody.css( 'height', gH - 50 )
    }

    function getParaFromUrl( name ){
        var url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)', 'i'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    function possibleURLSearch(){
        var q = getParaFromUrl( 'q' )
        if( q ){
            if( !$searchInput ){
                $searchInput = $('#book-search-input input');
            }
            $searchInput.val( q )
            launchSearch( q )
        }else{
            // do nothing
        }
    }


    gitbook.events.on('start',function(e, config){
        CONFIG = config.bugtagszh || {}
        initUser();
        // 如果链接中带有搜索关键词，则需要进行搜索
        possibleURLSearch()
    })

    gitbook.events.on('page.change',function(){
        bindSearch()
        closeSearch()
        resetContainerHeight()
    })
})
