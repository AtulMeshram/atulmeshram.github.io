(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function () {
  var Loader        = require('./module/Loader_Image');
  var LoadingAnim   = require('./module/LoadingAnimation');
  var FitSize       = require('./module/FitSize');
  var SceneManager  = require('./module/Scene.manager');
  var Scroll        = require('./module/Scroll.sliding');
  var UA            = require('./module/UA')();
  var Gallery       = require('./module/Gallery');
  var Util          = require('./module/Util').Util;

  var colors      = ['#FF5252', '#FF5252', '#FF5252', '#FF5252', '#FF5252', '#FF5252', '#FF5252', '#FF5252', '#FF5252', '#FF5252', '#FF5252', '#FF5252'];

  var sceneColors = [];
  var $loadingWrap,$alertWrap;

  
  $(document).ready(function(){
    sceneColors   = Util.Array.shuffle(colors);
    $loadingWrap  = $('.loading-wrap');
    $alertWrap    = $('.alert-wrap');

    $alertWrap.find('.alert-close').on('click',function(){
      $alertWrap.removeClass('alertOn');
    });

    $('.social-pc .social-btn').each(function(i){
      btnHover($(this),sceneColors[i],'#0B1028');
    });
    $('.flip-navi .social-btn').each(function(i){
      btnHover($(this),sceneColors[i],'#444C74');
    }); 

    if(!checkDevice()){
      $alertWrap.addClass('alertOn');
    }

    if(UA.isPC){
      btnHover($('#buyhere_header'),sceneColors[0],'#0B1028');
      btnHover($('#buyhere_spec'),sceneColors[sceneColors.length-3],'#0B1028');
      btnHover($('#buyhere_credit'),sceneColors[sceneColors.length-2],'#0B1028');
      btnHover($('#logo_air'),sceneColors[sceneColors.length-1],'#0B1028');
      btnHover($('#portfolio_link'),sceneColors[sceneColors.length-1],'#0B1028');
      btnHover($('#logo_portfolio'),sceneColors[sceneColors.length-1],'#444C74');
    }else{
      TweenLite.set($('#buyhere_header'),{backgroundColor:sceneColors[0]});
      TweenLite.set($('#buyhere_spec'),{backgroundColor:sceneColors[sceneColors.length-3]});
      TweenLite.set($('#buyhere_credit'),{backgroundColor:sceneColors[sceneColors.length-2]});
      TweenLite.set($('#logo_air'),{backgroundColor:sceneColors[sceneColors.length-1]});
      TweenLite.set($('#portfolio_link'),{backgroundColor:sceneColors[sceneColors.length-1]});
      TweenLite.set($('#logo_portfolio'),{backgroundColor:sceneColors[sceneColors.length-1]});
    }

    LoadingAnim.init(sceneColors[0],sceneColors[0] == '#faef01'?'#000':'#fff');
    imgLoad();
  });

  function imgLoad(){
    var loader = new Loader();
    loader.load($('#wrap'));
    loader.loading = function(p){
      LoadingAnim.loading(p);
    }
    loader.loaded = function(){
      init();
      LoadingAnim.loaded(start);
    };
  }

  function btnHover(elem,onColor,outColor){
    elem.on('mouseover',function(){
      TweenLite.set(elem,{backgroundColor:onColor});
    })
    elem.on('mouseout',function(){
      TweenLite.set(elem,{backgroundColor:outColor});
    });
  }

  function checkDevice(callback){
    var check = true;
    if(UA.isIOS){
      if(UA.iosVersion < 9){
        check = false;
      }
    }

    if(UA.isAndroid){
      var v = Number(UA.androidVersion.substr(0,3));
      if(v < 4.4){
        check = false;
      }
    }

    if(UA.isIE){
      if(!UA.isEdge){
        if(UA.isLtIE11)check = false;
      }
    }
    return check;
  }
  /* ************************************************************
    Initilize
  ************************************************************ */
  var $wrap,$wrapInner,$sideNavi;
  var $flipNavi,$flipOpen,$flipClose;
  var $scrollDown,$scrollUp;
  var $loadingWrap;
  var $indexLogo;
  var $headerLogo;
  
  var flags = {jump:false,freeze:false};
  function start(){
    TweenLite.set($loadingWrap,{transformPerspective:1000});
    TweenLite.to($loadingWrap,1,{delay:0.1,y:'100%',ease:Quint.easeInOut,onComplete:function(){
      $loadingWrap.remove();
      scenes[0].bg.addClass('bgOn');
    }});
  }

  var gallerys = [];
  function init(){
    $wrap       = $('#wrap');
    $wrapInner  = $('#wrapInner');
    $sideNavi   = $('.navi');
    $flipNavi   = $('.flip-navi');
    $flipOpen   = $('.flip-navi-btn');
    $flipClose  = $('.flip-close');
    $flipCover  = $('.flip-color-cover');
    $flipNaviListWrap = $flipNavi.find('ol');
    $scrollDown = $('#scrollDown');
    $scrollUp = $('#scrollUp');

    $indexLogo = $('.index-logo img');
    $headerLogo = $('.header-logo img');


    TweenLite.set($scrollDown.find('.scroll-circle'),{backgroundColor:sceneColors[0]});
    TweenLite.set($scrollUp.find('.scroll-circle'),{backgroundColor:sceneColors[sceneColors.length-2]});
    
    $('.bg-mobile').each(function(){
      var op = {align:'c'};
      if($(this).parent().parent().attr("id") == 'sceneTop'){
        op.align = 'b';
      }
      new FitSize($(this),op)
    });

    $('.img-mobile').each(function(){
      new FitSize($(this),{align:'c'})
    });

    $('.bg-pc').each(function(){
      new FitSize($(this),{align:'c'})
    });

    $('.img-pc').each(function(){
      new FitSize($(this),{align:'c'})
    });

    setScene();
    setEvent();

    gallerys[0] = new Gallery($('#sceneLandingTour .gallery'),$('#sceneLandingTour .thumbs'),flags,sceneColors[2]);
    gallerys[1] = new Gallery($('#sceneDevice .gallery'),$('#sceneDevice .thumbs'),flags,sceneColors[2]);
    gallerys[2] = new Gallery($('#sceneEqualizer .gallery'),$('#sceneEqualizer .thumbs'),flags,sceneColors[2]);
    gallerys[3] = new Gallery($('#sceneSettings .gallery'),$('#sceneSettings .thumbs'),flags,sceneColors[2]);
    gallerys[4] = new Gallery($('#sceneProfiles .gallery'),$('#sceneProfiles .thumbs'),flags,sceneColors[2]);
    $flipOpen.on('click',function(){
      flipNaviOpen();
    });

    $flipClose.on('click',function(){
      flipNaviClose();
    });

    $scrollDown.on('click',function(){
      if(!flags.jump && crtScene<scenes.length-1){
        gotoScene(crtScene+1);
      }
    });

    $scrollUp.on('click',function(){
      if(!flags.jump && crtScene>0){
        gotoScene(0);
      }
    });

    $headerLogo.on('click',function(){
      if(!flags.jump && crtScene!=0){
        gotoScene(0);
      }
    });

  }


  /* ************************************************************
      Scene Setting
  ************************************************************ */
  var sceneM,scroll;
  var crtScene    = 0;
  var sceneTotal  = 0;
  var scenes      = [];
  var sceneOffset = {zoom:0,duration:1,z:1000,perspective:1500,ease: Quint.easeInOut};
  function setScene(){
    sceneM = new SceneManager({stats:0});
    $(sceneM).bind(sceneM.EVENT_DELETE_SCROLL, onScrollDelete);

    scroll = new Scroll({
      target      : "#wrap",
      speed       : .1,
      friction    : 0.05,
      touchSpeed  : 10,
      stats       : false,
      screenFix   : true,
      freeze      : true,
      step        : onScroll,
      scrollType  : 'y'
    });


    if(UA.isPC)TweenLite.set($wrap,{transformPerspective:1000});

    var copyColor = [];
    for(var i=0; i<colors.length; i++){
      copyColor.push(colors[i]);
    }

    sceneTotal = $('.scene').length;

    $('.scene').each(function(i){
      var wrap = $(this);
      var sceneName = wrap.data('sceneName');
      var colorCover = $('<figure class="color-cover"></figure>').appendTo($(this));
      var coverTitle = $('<span class="cover-title">'+sceneName+'</span>').appendTo(colorCover);
      TweenLite.set(colorCover,{backgroundColor:sceneColors[i],z:100});
      if(i==0)TweenLite.set(colorCover,{y:'-100%'});
      
      wrap.css({position:'absolute'});
      TweenLite.set(wrap,{transformPerspective:sceneOffset.perspective,transformOrigin:'50% 50%'});
      if(i > 0)TweenLite.set(wrap,{y:'0%',opacity:1,z:sceneOffset.z*i,opacity:0});
      else wrap.addClass('sceneUnLock');
      var sceneInfo = {id:i,wrap:wrap,inner:wrap.find('.scene-inner'),bg:wrap.find('.bg'),name:sceneName,colorCover:colorCover,coverTitle:coverTitle};
      if(i>0){
        // sceneInfo.inner.css({visibility:'hidden'});
        TweenLite.set(sceneInfo.inner,{visibility:'hidden',scale:0});
      }
      scenes[i] = sceneInfo;
      if(i<sceneTotal){
        if(i==sceneTotal-1){
          sceneM.addScene( i, 1, 'normal', {duration:sceneOffset.duration+0.8,onComplete:function(){flags.jump=false;}});
        }else{
          sceneM.addScene( i, 1000, 'quick', {duration:sceneOffset.duration+0.8,onComplete:function(){flags.jump=false;}});
          sceneChange(i);
        }
      }else{
      }
    });

    for(var i=0; i<sceneTotal; i++){
      setNavi(scenes[i].name,i);
    }

    sceneMoving();
  }

  function setEvent(){
    $(window).on('keydown', onKeydown);
  }

  function sceneChange(id){
    sceneM.addSceneFrameStartActor(id,function(direct){
      if(direct){
        if(!flags.jump){
          changeScene(id,1);
        }
      }else{
      }
    });
    sceneM.addSceneFrameEndActor(id,function(direct){
        if(!direct){
          if(!flags.jump){
            changeScene(id,-1);
          }
        }else{
        }
    });
  }

  function changeScene(id,direct){
    var nextScene = direct>0?id+1:id;
    if(nextScene==crtScene)return;

    TweenLite.set($scrollDown.find('.scroll-circle'),{backgroundColor:sceneColors[nextScene]});

    var dis = Math.abs(nextScene-crtScene);
    for(var i=0; i<sceneTotal; i++){
      var wrap = scenes[i].wrap,
          inner = scenes[i].inner;
      if(i == nextScene){
        if(!wrap.hasClass('sceneUnLock')){
          wrap.addClass('sceneUnLock');
        }
      }else{
        if(wrap.hasClass('sceneUnLock')){
          wrap.removeClass('sceneUnLock');
        }
      }
    }

    var offsetRX = 5;
    var offsetScale = 0.1;

    if(UA.isPC){
      TweenLite.set($wrap,{z:-200*dis,rotationX:(offsetRX*dis)*direct});
      TweenLite.set($wrap,{delay:sceneOffset.duration*0.5,z:0,scale:1,rotationX:0});
    }else{
      TweenLite.set($wrap,{scale:1-offsetScale*dis});
      TweenLite.set($wrap,{delay:sceneOffset.duration*0.5,scale:1});
    }

    scenes[crtScene].coverTitle.css({opacity:0});
    TweenLite.set(scenes[crtScene].colorCover,{x:'0%',y:direct*100+'%'});
    TweenLite.to(scenes[crtScene].colorCover,sceneOffset.duration*0.8,{x:'0%',y:'0%', ease:Expo.easeInOut,onComplete:function(){
      TweenLite.set(scenes[crtScene].inner,{visibility:'hidden',scale:0});
      if(scenes[crtScene].bg){
        setTimeout(function(){
          scenes[crtScene].bg.removeClass('bgOn');
        },100);
      }
    }});

    scenes[nextScene].coverTitle.css({opacity:1});
    TweenLite.set(scenes[nextScene].colorCover,{x:'0%',y:'0%'});
    TweenLite.to(scenes[nextScene].colorCover,sceneOffset.duration*0.9,{delay:sceneOffset.duration*0.9,y:direct*100+'%',ease:Expo.easeInOut});
    
    TweenLite.to(sceneOffset,sceneOffset.duration,{zoom:sceneOffset.z*nextScene,ease:sceneOffset.ease,onComplete:function(){
      if(scenes[nextScene].bg){
        setTimeout(function(){
          scenes[nextScene].bg.addClass('bgOn');
        },1200);
      }
      TweenLite.set(scenes[nextScene].inner,{visibility:'visible',scale:1});
    }});

    if(crtScene==2){
      setTimeout(function(){gallerys[0].changeImage(0);},1000);
    }

    if(crtScene==3){
      setTimeout(function(){gallerys[1].changeImage(0);},1000);
    }

    if(crtScene==4){
      setTimeout(function(){gallerys[2].changeImage(0);},1000);
    }


    crtScene = nextScene;
    activeNavi(crtScene);

    swapLogo(nextScene==0?'index':'sub');

    if(nextScene == navis.length-1){
      TweenLite.to($scrollDown,.7,{opacity:0,scale:0,ease:Back.easeInOut});
      TweenLite.to($scrollUp,.7,{delay:0.7,opacity:1,scale:1,ease:Back.easeInOut});
    }else{
      TweenLite.to($scrollDown,.7,{delay:0.7,opacity:1,scale:1,ease:Back.easeInOut});
      TweenLite.to($scrollUp,.7,{opacity:0,scale:0,ease:Back.easeInOut});
    }
  }

  var isIndexLogo = true;
  function swapLogo(type){
    if(type == 'index'){
      if(!isIndexLogo){
        TweenLite.to($indexLogo,1,{delay:0,y:'0%',ease:Power3.easeInOut});
        TweenLite.to($headerLogo,1,{y:'100%',ease:Power3.easeInOut});  
        isIndexLogo = true;
      }
    }else{
      if(isIndexLogo){
        TweenLite.to($indexLogo,1,{delay:1,y:'-100%',ease:Power3.easeInOut});
        TweenLite.to($headerLogo,1,{y:'0%',ease:Power3.easeInOut});
        isIndexLogo = false;
      }
      
      
    }
  }

  var navis = [];
  var flipNavis = [];
  var outTimer = null;
  function setNavi(name,id){
    var $navi = $('<li></li>').appendTo($sideNavi);
    var $name = $('<div class="navi-name"><span class="navi-name-txt">'+name+'<span class="navi-name-bg"></span></span></div>').appendTo($navi);
    var $icon = $('<span class="navi-dot"></span>').appendTo($navi);
    var $icon2 = $('<span class="navi-dot-over"></span>').appendTo($navi);

    var $flipNaviList = $('<li class="flip-mene">'+name+'</li>');
    $flipNaviListWrap.append($flipNaviList);
    if(id==scenes.length-1)$flipNaviListWrap.append($('.flip-social'));

    TweenLite.set($icon2,{backgroundColor:sceneColors[id]});
    TweenLite.set($name,{transformPerspective:1000});
    TweenLite.set($name.find('.navi-name-bg'),{backgroundColor:sceneColors[id],transformPerspective:1000});

    $navi.on('click',function(){
      if(flags.jump || id==crtScene)return;
      gotoScene(id);
    });

    $flipNaviList.on('click',function(){
      if(flags.jump || id==crtScene)return;
      flags.jump = true;
      flipNaviClose();
      setTimeout(function(){
        gotoScene(id);
      },500);
    });

    navis[id] = $navi;
    flipNavis[id] = $flipNaviList;

    $navi.on('mouseover',function(){
      activeNavi(id);
      clearTimeout(outTimer);
      outTimer = null;
      $('.navi-name').each(function(i){
        var delay = Math.abs(i-id),
            name = $(this);
        TweenLite.set(name,{delay:delay*0.06,opacity:1,onComplete:function(){
          if(outTimer == null)name.addClass('naviOn');
        }})
      });
    });

    $navi.on('mouseout',function(){
      activeNavi(crtScene);
      outTimer = setTimeout(function(){
        $('.navi-name').removeClass('naviOn');
      },100)
      
    });

    $flipNaviList.on('mouseover',function(){
      activeNavi(id);
    });

    $flipNaviList.on('mouseout',function(){
      activeNavi(crtScene);
    });

  }

  function gotoScene(id){
    flags.jump = true;
    sceneM.gotoScene(id,{duration:1.5,onComplete:function(){ flags.jump = false; }});
    onKeyScrollControl(1);
    if(crtScene > id){
      changeScene(id,-1);
    }else{
      changeScene(id-1,1);
    }
  }

  function activeNavi(id){
    for(var i=0; i<navis.length; i++){
      var navi = navis[i],
          fNavi = flipNavis[i];

      if(i == id){
        navi.addClass('naviActive');
        fNavi.addClass('naviActive');
      }else{
        navi.removeClass('naviActive');
        fNavi.removeClass('naviActive');
      }
    }
  }

  function flipNaviOpen(){
    TweenLite.set($flipNavi,{x:'0%'});
    TweenLite.set($wrapInner,{x:'10%',scale:0.9});
    TweenLite.set($flipCover,{backgroundColor:sceneColors[crtScene]});
    $flipCover.addClass('flipOn');

    TweenLite.set(scenes[crtScene].colorCover,{x:'-100%',y:'0%',ease:Expo.easeInOut});
    TweenLite.to(scenes[crtScene].colorCover,sceneOffset.duration*0.7,{x:'0%',y:'0%',ease:Expo.easeInOut});

  }

  function flipNaviClose(){
    TweenLite.set($flipNavi,{x:'-100%'});
    TweenLite.set($wrapInner,{x:'0%',scale:1});
    $flipCover.removeClass('flipOn');

    TweenLite.set(scenes[crtScene].colorCover,{x:'0%',y:'0%',ease:Expo.easeInOut});
    TweenLite.to(scenes[crtScene].colorCover,sceneOffset.duration*0.7,{x:'-100%',y:'0%',ease:Expo.easeInOut});
  }


  function sceneMoving(){
    for(var i=0; i<sceneTotal; i++){
      var z   = (i*sceneOffset.z)-sceneOffset.zoom,
          y   = (z/10)*0.1+'%'
          op  = 1-z/sceneOffset.z;
      if(op<-1)op=0;
      if(op>0.99)op=1;
      if(crtScene==1 && i == 0){
      }
      TweenLite.set(scenes[i].wrap,{z:z,opacity:op});
    }
  }
  /* ************************************************************
      Event Handler
  ************************************************************ */

  function onScroll(offset){
    if(sceneM && !flags.freeze && !flags.jump){
      sceneM.update(scroll.offset,'');
    }
    sceneMoving();
  }

  function onScrollDelete(){
    if(scroll)scroll.stopRender();
  }

  function onKeydown(e){
    switch(e.keyCode){
        case 38 : onKeyScrollControl(1); break;
        case 40 : onKeyScrollControl(-1); break;
    }
  }
  var keybordValue = UA.isMac?10:1;
    function onKeyScrollControl(delta){
    for(var i=0; i<10; i++){
        var del = delta*keybordValue;
        if(scroll)scroll.onWheel({},del, del, del);
    }
  }

}).call(this);
},{"./module/FitSize":2,"./module/Gallery":3,"./module/Loader_Image":4,"./module/LoadingAnimation":5,"./module/Scene.manager":7,"./module/Scroll.sliding":8,"./module/UA":9,"./module/Util":10}],2:[function(require,module,exports){
(function(){
  function FitSize($elem,option){
    var global = this,
        target = $elem,
        isReady = $elem[0]=='undefined'?false:true;
    var directW = 1,
        directH = 1;

    this.config = { 
      position : "", 
      align : "c",
      size : "cover",
      marginX : 0,
      marginY : 0,
      compareTarget : isReady?$elem.parent():null,
      minWidth:undefined, 
      minHeight:undefined, 
      maxWidth:undefined, 
      maxWidth:undefined, 
      callBack : undefined, 
      autoResize : true
    };

    $.extend(this.config,option);
    if(this.config.align.indexOf('r') > -1)directW = -1;
    if(this.config.align.indexOf('b') > -1)directH = -1;

    this.targetInfo = {
      obj:$elem,
      width:0,
      height:0,
      aspect:0,
      update:update,
      css : { width:0,height:0,left:0,top:0},
      fit : function(){
        this.obj.css(this.css);
      }
    }

    this.compareTargetInfo = {
      obj:global.config.compareTarget,
      width:0,height:0,aspect:0,
      update : update
    }

    function update(){
      if(isReady){
        this.width  = this.obj.outerWidth();
        this.height = this.obj.outerHeight();
        this.aspect = this.width/this.height;
      }
    }

    this.fit = function(){
      var frameW  = this.compareTargetInfo.width,
          frameH  = this.compareTargetInfo.height,
          aspect  = this.targetInfo.aspect,
          targetCss = this.targetInfo.css;
      
      if(frameW/aspect < frameH){
          targetCss.width   = frameH*aspect;
          targetCss.height  = frameH;
      }else{
          targetCss.width   = frameW;
          targetCss.height  = frameW/aspect;
      }


      switch(this.config.size){
        case 'cover'  : break;
        case 'width'  : targetCss.width   = frameW;
                        targetCss.height  = frameW/aspect; 
                        break;

        case 'height' : targetCss.width   = frameH*aspect;
                        targetCss.height  = frameH;
                        break;

        case 'contain' : if(frameH*aspect > frameW){
                          targetCss.width   = frameW;
                          targetCss.height  = frameW/aspect; 
                        }else{
                          targetCss.width   = frameH*aspect;
                          targetCss.height  = frameH;
                        }
                        break;
      }

      // targetCss.width = Math.floor(targetCss.width);
      // targetCss.height = Math.floor(targetCss.height);

      if(typeof this.config.minWidth !== 'undefined'){
        if(targetCss.width < this.config.minWidth){
          targetCss.width  = this.config.minWidth;
          targetCss.height = targetCss.width/aspect;
        }
      }

      if(typeof this.config.minHeight !== 'undefined'){
        if(targetCss.height < this.config.minHeight){
          targetCss.height = this.config.minHeight;
          targetCss.width   = targetCss.height*aspect;
        }
      }

      if(typeof this.config.maxWidth !== 'undefined'){
        if(targetCss.width > this.config.maxWidth){
          targetCss.width  = this.config.maxWidth;
          targetCss.height = targetCss.width/aspect;
        }
      }

      if(typeof this.config.maxHeight !== 'undefined'){
        if(targetCss.height > this.config.maxHeight){
          targetCss.height = this.config.maxHeight;
          targetCss.width   = targetCss.height*aspect;
        }
      }

      targetCss.left  = (frameW-targetCss.width)*0.5;
      targetCss.top   = (frameH-targetCss.height)*0.5;
      
      switch(this.config.align){
          case 'l'  : targetCss.left = 0;
                      break;
          case 'r'  : targetCss.left = (frameW-targetCss.width);
                      break;
          case 't'  : targetCss.top = 0;
                      break;
          case 'b'  : targetCss.top = (frameH-targetCss.height);
                      break;
          case 'lt' : targetCss.left = 0; targetCss.top = 0;
                      break;
          case 'lb' : targetCss.left = 0; targetCss.top = (frameH-targetCss.height);
                      break;
          case 'rt' : targetCss.left = (frameW-targetCss.width); targetCss.top = 0;
                      break;
          case 'rb' : targetCss.left = (frameW-targetCss.width); targetCss.top = (frameH-targetCss.height);
                      break;
      }
      targetCss.left += this.config.marginX;
      var marginH = targetCss.height-frameH;
          
      // if(ratioH > 1){
        targetCss.top += marginH*0.01*this.config.marginY*directH;
        // if(this.config.align == 'b')targetCss.top *= -1;
      // }
      

      this.targetInfo.fit();
    };

    function init(){
      if(isReady){
        // console.log(global.targetInfo.obj.css('position'));
        if(global.targetInfo.obj.css('position') == 'static'){
          global.targetInfo.obj.css('position','relative')
        }
        global.update();
        if(global.config.autoResize){
          $(window).on('resize',global.onResize);
        }
      }
    }

    this.update = function(){
      this.targetInfo.update();
      this.compareTargetInfo.update();
      this.fit();
    }

    this.onResize = function(){
      global.update();
    }

    init();
    return this;
  }

  FitSize.prototype.constructor = FitSize;
  this.FitSize = FitSize;
  module.exports = FitSize;
}).call(this);
},{}],3:[function(require,module,exports){
(function(){
  var Util = require('./Util').Util;
  var TouchUtil = Util.Touch;
  var UA   = require('./UA')();

  var Gallery = function($wrap,$thumbs,flags,dotColor){
    var Util_CSS = Util.Css;
    var _this = this;
    var initialized = false;
    var images  = [];
    var names   = [];
    var thumbs  = [];
    var crtID   = 0;
    var imgStock = [];
    var nameStock = [];
    var crtImage  = null;
    var prevImage = null;
    var nextImage = null;
    var offset = { opacity:0, scale:.5, duration:0.97  }
    var arrL = $('<article class="scroll arrL arrColorBlack"><div class="scroll-circle"><figure class="line line1"></figure><figure class="line line2"></figure></div></article>');
    var arrR = $('<article class="scroll arrR arrColorBlack"><div class="scroll-circle"><figure class="line line1"></figure><figure class="line line2"></figure></div></article>');

    var arrL_sp = $('<figure class="arrL_sp"></figure>');
    var arrR_sp = $('<figure class="arrR_sp"></figure>');
    
    
    var isMoving = false;

    this.init = function(){
      $wrap.find('.img-wrap').each(function(i){
        var imgWrap = $(this),
            img = imgWrap.find('img'),
            name = img.attr('src');
        images[i] = imgWrap;

        if($wrap.find('.names')[0]){
          names[i] = $wrap.find('.name').eq(i);
        }
        // Util_CSS.setTransition(imgWrap,i==0?offset.duration:0,'cubic-bezier(.35,.08,.33,.99)');
        if(i>0)TweenLite.set(imgWrap,{x:'100%',z:offset.scale,opacity:offset.opacity,display:'none'});
        if(UA.isPC)TweenLite.set(imgWrap,{transformPerspective:1000});
      });



      $thumbs.find('.thumb').each(function(i){
        var thumb = $(this);
        var thumbIcon = $('<figure class="thumb-dot"></figure>');
        // TweenLite.set(thumb,{transformPerspective:1000});
        TweenLite.set(thumbIcon,{backgroundColor:'#FF5252',borderColor:'#FF5252'});
        thumb.append(thumbIcon);
        thumb.on('click',function(){
          _this.changeImage(i);
        });

        thumb.on('mouseover',function(){
          _this.activeDock(i);
        });

        thumb.on('mouseout',function(){
          _this.activeDock(crtID);
        })

        thumbs[i] = thumb;
      });

      $wrap.append(arrL);
      $wrap.append(arrR);

      $wrap.append(arrL_sp);
      $wrap.append(arrR_sp);

      crtImage = images[0];
      this.positionReset();
      this.checkArr();

      arrL.on('click',function(){
        if(crtID<=0)return;
        _this.changeImage(crtID-1);
      });

      arrR.on('click',function(){
        if(crtID>images.length-1)return;
        _this.changeImage(crtID+1);
      });


      arrL_sp.on('click',function(){
        if(crtID<=0)return;
        _this.changeImage(crtID-1);
      });

      arrR_sp.on('click',function(){
        if(crtID>images.length-1)return;
        _this.changeImage(crtID+1);
      });


      TouchUtil.getTouchEvent($wrap,{
        onStart:function(e){ flags.freeze = true; },
        onMove:function(e){},
        onEnd:function(e){
          var dis = e.distance,
              disOffset = e.distanceOffset();

          if(disOffset.x>disOffset.y){
            if(dis.x<0){
              if(crtID>0)_this.changeImage(crtID-1);
            }else{
              if(crtID<images.length-1)_this.changeImage(crtID+1);
            }
          }else{
            flags.freeze = false;
          }
        }
      })
      this.activeChange(crtID);
      return this;
    }
    
    this.rearrangement = function(id){
      
    }

    var movingTimer = null;
    var moveTime = 0.8;
    this.changeImage = function(id){
      if(id == crtID || isMoving)return;
      this.activeChange(id);
      isMoving = true;

      if(id > crtID){
        imgStock[0] = crtID>1?images[crtID-1]:null;
        imgStock[1] = images[crtID];
        imgStock[2] = images[id];

        if(imgStock[0])imgStock[0].hide();
        imgStock[1].show();
        if(imgStock[2])imgStock[2].show();

        TweenLite.set(imgStock[2],{x:'100%',scale:offset.scale,opacity:offset.opacity});
        TweenLite.to(imgStock[2],offset.duration,{delay:0.01,x:'0%',opacity:1,scale:1,ease:Power3.easeInOut});
        TweenLite.to(imgStock[1],offset.duration,{delay:0.01,x:'-100%',scale:offset.scale,opacity:offset.opacity,ease:Power3.easeInOut,onComplete:function(){
          if(!isMoving)imgStock[1].hide();
        }});


        if(names.length > 0){
          nameStock[0] = crtID>1?names[crtID-1]:null;
          nameStock[1] = names[crtID];
          nameStock[2] = names[id];

          TweenLite.set(nameStock[2],{x:'-50%',y:'100%'});
          TweenLite.to(nameStock[2],offset.duration,{delay:0.01,x:'-50%',y:'0%',ease:Power3.easeInOut});
          TweenLite.to(nameStock[1],offset.duration,{delay:0.01,x:'-50%',y:'-100%',ease:Power3.easeInOut});
        }

      }else{

        imgStock[0] = images[id];
        imgStock[1] = images[crtID];
        imgStock[2] = crtID<images.length-1?images[crtID+1]:null;


        if(imgStock[0])imgStock[0].show();
        imgStock[1].show();
        if(imgStock[2])imgStock[2].hide();

        TweenLite.set(imgStock[0],{x:'-100%',scale:offset.scale,opacity:offset.opacity});
        TweenLite.to(imgStock[0],offset.duration,{delay:0.01,x:'0%',opacity:1,scale:1,ease:Power3.easeInOut});
        TweenLite.to(imgStock[1],offset.duration,{delay:0.01,x:'100%',scale:offset.scale,opacity:offset.opacity,ease:Power3.easeInOut,onComplete:function(){
          if(!isMoving)imgStock[1].hide();
        }});

        if(names.length > 0){
          nameStock[0] = names[id];
          nameStock[1] = names[crtID];
          nameStock[2] = crtID<names.length-1?names[crtID+1]:null;  


          TweenLite.set(nameStock[0],{x:'-50%',y:'-100%'});
          TweenLite.to(nameStock[0],offset.duration,{delay:0.01,x:'-50%',y:'0%',ease:Power3.easeInOut});
          TweenLite.to(nameStock[1],offset.duration,{delay:0.01,x:'-50%',y:'100%',ease:Power3.easeInOut});
        }

        
      }

      movingTimer = setTimeout(function(){
        isMoving = false;
      },offset.duration*900);
      
      crtID = id;
      this.checkArr();
    }

    this.positionReset = function(){
      // TweenLite.set(crtImage,{x:'0%'});
    }

    this.activeChange = function(id){
      this.activeDock(id);
      for(var i=0; i<thumbs.length; i++){
        var thumb = thumbs[i];
        if(i == id){
          if(!thumb.hasClass('thumbOn'))thumb.addClass('thumbOn');
          // TweenLite.set(thumb.find('.thumb-dot'),{backgroundColor:dotColor});
        }else{
          if(thumb.hasClass('thumbOn'))thumb.removeClass('thumbOn');
          // TweenLite.set(thumb.find('.thumb-dot'),{backgroundColor:'#b3b3b3'});
        }
      }
    }

    this.activeDock = function(id){
      for(var i=0; i<thumbs.length; i++){
        var thumb = thumbs[i];
        var dis = Math.abs(i-id);
        var scale = 0.4, z = 0;
        if(dis>3){
          z = -100;
        }else{
          // scale += (3-dis)*0.1;
          if(dis==0)scale = 0.6;
        }

        TweenLite.set(thumb,{scale:scale});
      }
    };

    var dur = 0.8;
    this.checkArr = function(){

      if(crtID == 0){
        arrL.addClass('arrColorBlack');
        arrR.addClass('arrColorBlack');
        // arrL.hide();
        TweenLite.to(arrL,dur,{x:-60,opacity:0,ease:Power4.easeInOut});
        TweenLite.to(arrL_sp,dur,{x:'-100%',y:'-50%',opacity:0,ease:Power4.easeInOut});
      }else{
        arrL.removeClass('arrColorBlack');
        arrR.removeClass('arrColorBlack');

        TweenLite.to(arrL,dur,{x:0,opacity:1,ease:Power4.easeInOut});
        TweenLite.to(arrL_sp,dur,{x:'-50%',y:'-50%',opacity:1,ease:Power4.easeInOut});
      }

      if(crtID == images.length-1){
        TweenLite.to(arrR,dur,{x:60,opacity:0,ease:Power4.easeInOut});
        TweenLite.to(arrR_sp,dur,{x:'100%',y:'-50%',opacity:0,ease:Power4.easeInOut});
      }else{
        TweenLite.to(arrR,dur,{x:0,opacity:1,ease:Power4.easeInOut});
        TweenLite.to(arrR_sp,dur,{x:'50%',y:'-50%',opacity:1,ease:Power4.easeInOut});
      }
    }

    return this.init();
  }

  Gallery.prototype.constructor = Gallery;
  module.exports = Gallery;
}).call(this)
},{"./UA":9,"./Util":10}],4:[function(require,module,exports){
/*!
 * imagesLoaded PACKAGED v3.0.3
 * JavaScript is all like "You images are done yet or what?"
*/
(function(){"use strict";function e(){}function t(e,t){for(var n=e.length;n--;)if(e[n].listener===t)return n;return-1}var n=e.prototype;n.getListeners=function(e){var t,n,i=this._getEvents();if("object"==typeof e){t={};for(n in i)i.hasOwnProperty(n)&&e.test(n)&&(t[n]=i[n])}else t=i[e]||(i[e]=[]);return t},n.flattenListeners=function(e){var t,n=[];for(t=0;e.length>t;t+=1)n.push(e[t].listener);return n},n.getListenersAsObject=function(e){var t,n=this.getListeners(e);return n instanceof Array&&(t={},t[e]=n),t||n},n.addListener=function(e,n){var i,r=this.getListenersAsObject(e),s="object"==typeof n;for(i in r)r.hasOwnProperty(i)&&-1===t(r[i],n)&&r[i].push(s?n:{listener:n,once:!1});return this},n.on=n.addListener,n.addOnceListener=function(e,t){return this.addListener(e,{listener:t,once:!0})},n.once=n.addOnceListener,n.defineEvent=function(e){return this.getListeners(e),this},n.defineEvents=function(e){for(var t=0;e.length>t;t+=1)this.defineEvent(e[t]);return this},n.removeListener=function(e,n){var i,r,s=this.getListenersAsObject(e);for(r in s)s.hasOwnProperty(r)&&(i=t(s[r],n),-1!==i&&s[r].splice(i,1));return this},n.off=n.removeListener,n.addListeners=function(e,t){return this.manipulateListeners(!1,e,t)},n.removeListeners=function(e,t){return this.manipulateListeners(!0,e,t)},n.manipulateListeners=function(e,t,n){var i,r,s=e?this.removeListener:this.addListener,o=e?this.removeListeners:this.addListeners;if("object"!=typeof t||t instanceof RegExp)for(i=n.length;i--;)s.call(this,t,n[i]);else for(i in t)t.hasOwnProperty(i)&&(r=t[i])&&("function"==typeof r?s.call(this,i,r):o.call(this,i,r));return this},n.removeEvent=function(e){var t,n=typeof e,i=this._getEvents();if("string"===n)delete i[e];else if("object"===n)for(t in i)i.hasOwnProperty(t)&&e.test(t)&&delete i[t];else delete this._events;return this},n.emitEvent=function(e,t){var n,i,r,s,o=this.getListenersAsObject(e);for(r in o)if(o.hasOwnProperty(r))for(i=o[r].length;i--;)n=o[r][i],s=n.listener.apply(this,t||[]),(s===this._getOnceReturnValue()||n.once===!0)&&this.removeListener(e,o[r][i].listener);return this},n.trigger=n.emitEvent,n.emit=function(e){var t=Array.prototype.slice.call(arguments,1);return this.emitEvent(e,t)},n.setOnceReturnValue=function(e){return this._onceReturnValue=e,this},n._getOnceReturnValue=function(){return this.hasOwnProperty("_onceReturnValue")?this._onceReturnValue:!0},n._getEvents=function(){return this._events||(this._events={})},"function"==typeof define&&define.amd?define(function(){return e}):"undefined"!=typeof module&&module.exports?module.exports=e:this.EventEmitter=e}).call(this),function(e){"use strict";var t=document.documentElement,n=function(){};t.addEventListener?n=function(e,t,n){e.addEventListener(t,n,!1)}:t.attachEvent&&(n=function(t,n,i){t[n+i]=i.handleEvent?function(){var t=e.event;t.target=t.target||t.srcElement,i.handleEvent.call(i,t)}:function(){var n=e.event;n.target=n.target||n.srcElement,i.call(t,n)},t.attachEvent("on"+n,t[n+i])});var i=function(){};t.removeEventListener?i=function(e,t,n){e.removeEventListener(t,n,!1)}:t.detachEvent&&(i=function(e,t,n){e.detachEvent("on"+t,e[t+n]);try{delete e[t+n]}catch(i){e[t+n]=void 0}});var r={bind:n,unbind:i};"function"==typeof define&&define.amd?define(r):e.eventie=r}(this),function(e){"use strict";function t(e,t){for(var n in t)e[n]=t[n];return e}function n(e){return"[object Array]"===h.call(e)}function i(e){var t=[];if(n(e))t=e;else if("number"==typeof e.length)for(var i=0,r=e.length;r>i;i++)t.push(e[i]);else t.push(e);return t}function r(e,n){function r(e,n,o){if(!(this instanceof r))return new r(e,n);"string"==typeof e&&(e=document.querySelectorAll(e)),this.elements=i(e),this.options=t({},this.options),"function"==typeof n?o=n:t(this.options,n),o&&this.on("always",o),this.getImages(),s&&(this.jqDeferred=new s.Deferred);var a=this;setTimeout(function(){a.check()})}function h(e){this.img=e}r.prototype=new e,r.prototype.options={},r.prototype.getImages=function(){this.images=[];for(var e=0,t=this.elements.length;t>e;e++){var n=this.elements[e];"IMG"===n.nodeName&&this.addImage(n);for(var i=n.querySelectorAll("img"),r=0,s=i.length;s>r;r++){var o=i[r];this.addImage(o)}}},r.prototype.addImage=function(e){var t=new h(e);this.images.push(t)},r.prototype.check=function(){function e(e,r){return t.options.debug&&a&&o.log("confirm",e,r),t.progress(e),n++,n===i&&t.complete(),!0}var t=this,n=0,i=this.images.length;if(this.hasAnyBroken=!1,!i)return this.complete(),void 0;for(var r=0;i>r;r++){var s=this.images[r];s.on("confirm",e),s.check()}},r.prototype.progress=function(e){var t=this;this.hasAnyBroken=this.hasAnyBroken||!e.isLoaded,setTimeout(function(){t.emit("progress",t,e),t.jqDeferred&&t.jqDeferred.notify(t,e)})},r.prototype.complete=function(){var e=this.hasAnyBroken?"fail":"done";if(this.isComplete=!0,this.emit(e,this),this.emit("always",this),this.jqDeferred){var t=this.hasAnyBroken?"reject":"resolve";this.jqDeferred[t](this)}},s&&(s.fn.imagesLoaded=function(e,t){var n=new r(this,e,t);return n.jqDeferred.promise(s(this))});var c={};return h.prototype=new e,h.prototype.check=function(){var e=c[this.img.src];if(e)return this.useCached(e),void 0;if(c[this.img.src]=this,this.img.complete&&void 0!==this.img.naturalWidth)return this.confirm(0!==this.img.naturalWidth,"naturalWidth"),void 0;var t=this.proxyImage=new Image;n.bind(t,"load",this),n.bind(t,"error",this),t.src=this.img.src},h.prototype.useCached=function(e){if(e.isConfirmed)this.confirm(e.isLoaded,"cached was confirmed");else{var t=this;e.on("confirm",function(e){return t.confirm(e.isLoaded,"cache emitted confirmed"),!0})}},h.prototype.confirm=function(e,t){this.isConfirmed=!0,this.isLoaded=e,this.emit("confirm",this,t)},h.prototype.handleEvent=function(e){var t="on"+e.type;this[t]&&this[t](e)},h.prototype.onload=function(){this.confirm(!0,"onload"),this.unbindProxyEvents()},h.prototype.onerror=function(){this.confirm(!1,"onerror"),this.unbindProxyEvents()},h.prototype.unbindProxyEvents=function(){n.unbind(this.proxyImage,"load",this),n.unbind(this.proxyImage,"error",this)},r}var s=e.jQuery,o=e.console,a=o!==void 0,h=Object.prototype.toString;"function"==typeof define&&define.amd?define(["eventEmitter","eventie"],r):e.imagesLoaded=r(e.EventEmitter,e.eventie)}(window);

Loader_IMG = function(){
    var global = this;
    this.progress = 0;
    this.fps = 60;

    this.load = function(loadWrap){
        var imgLoader   = imagesLoaded(loadWrap),
            imgTotal    = imgLoader.images.length;
        var progress = 0,percent = 0,imgLoaded = 0,animLoaded = 0;
        imgLoader.on("progress",function(instance,image){
            var result = image.isLoaded ? 'loaded' : 'broken';
            imgLoaded++;
            progress   = (imgLoaded/imgTotal)*100;
        });
        var progressTimer = setInterval(function(){
            percent += (progress-percent)*0.1;
            global.loading(percent/100);
            if(percent >= 100){
                global.progress = percent;
                global.loaded(percent/100);
                clearInterval(progressTimer);
                setTimeout(function(){},50);
                return;
            }
            if(percent >= 99.9)percent = 100;
        },1000/this.fps);
    }

    this.loading = function(progress){}
    this.loaded = function(progress){}
};

Loader_IMG.prototype.constructor = Loader_IMG;
module.exports = Loader_IMG;

},{}],5:[function(require,module,exports){
(function(){
  var Logo = require('./Logo');
  var LoadingAnimation = {
    wrap : null,
    logoClass : null,
    line : null,
    initialized : false,
    progress : 0,
    bars : [],
    paths : [],
    steps : [],
    characters : [],
    pathRatio :0,
    cnt:0,

    init : function(color,logoColor){
      if(this.initialized)return;
      this.initialized = true;
      var _this = this;
      this.wrap = $('.loading-wrap');
      TweenLite.set(this.wrap,{backgroundColor:color});

      this.logoClass = new Logo($('#logoWrap'));
      // this.logoClass.color(logoColor);

      // this.line = this.logoClass.getPaths('k');

      // this.characters = [
      //   {value:20,draw:false,lines:this.logoClass.getPaths('k').paths,shape:this.logoClass.getShape('k').shapes[0]},
      //   {value:30,draw:false,lines:this.logoClass.getPaths('u1').paths,shape:this.logoClass.getShape('u1').shapes[0]},
      //   {value:40,draw:false,lines:this.logoClass.getPaths('u2').paths,shape:this.logoClass.getShape('u2').shapes[0]},
      //   {value:50,draw:false,lines:this.logoClass.getPaths('m').paths,shape:this.logoClass.getShape('m').shapes[0]}
      // ]

      // for(var i=0; i<this.characters.length; i++){
      //   var c = this.characters[i];
      //   TweenLite.set(c.shape,{opacity:0});
      // }

      // this.paths = this.line.paths;
      // this.pathRatio = 100/this.paths.length;
      // for(var i=0; i<this.paths.length; i++){
      //   this.steps.push({passed:false,value:this.pathRatio*i});
      // }

    },
    loading : function(p){
      this.progress = p;

      // for(var i=0; i<this.characters.length; i++){
      //   var chr = this.characters[i];
      //   if(p*100 > chr.value){
      //     if(!chr.draw){
      //       var lines = chr.lines;
      //       for(var j=0; j<lines.length; j++){
      //         var line = lines[j],
      //             delay = j*0.1;
      //         line.change(0,0, line.length,line.length,Power4.easeInOut);
      //         line.change(0.5,delay, 0,line.length,Power4.easeInOut);
      //       }
      //       chr.draw = true;
      //       this.cnt++;
      //     }
      //   }
      // }
    },

    loaded : function(callBack){
      var _this = this;
      var scale = 1,
          x = ((1-scale)*100)*0.5,
          d = scale>1?-1:1;
      
            callBack();
   

      // for(var i=0; i<this.characters.length; i++){
      //   var chr = this.characters[i];
      //   var lines = chr.lines;
      //   for(var j=0; j<lines.length; j++){
      //     var line = lines[j],
      //         delay = Math.random()*0.5+this.cnt*0.2;
      //     line.change(1,0.1+j*0.05, -line.length,line.length,Power4.easeInOut);
      //   }
      //   TweenLite.to(chr.shape,1,{delay:0,opacity:1,scale:1,x:'0%',y:'0%',ease:Power1.easeInOut});
      //   TweenLite.to(chr.shape,0.7,{delay:1,scale:scale,opacity:1,x:d*x+'%',y:d*x+'%',ease:Quint.easeInOut});
      //   if(i==3){
      //     setTimeout(function(){
      //       callBack();
      //     },1000);
      //   }
      // }
      
    }
  };
  module.exports = LoadingAnimation;
}).call(this);
},{"./Logo":6}],6:[function(require,module,exports){
/**
 * 2016.01
 * Heo Util ver 0.01
 * Author : Heonwongeun
 * LOGO SVG CLASS
 * useto

- this.loadedCombo(id,callback)
- this.loadedComboRandom(callback)
- this.fromTo(from,to,duration,callback) from,to 0 ~ 2
- this.color('#f00');
- this.progress(0~2); //1はlogoが完全に見える状態
*/

(function(){
  var _bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Logo = function($logoWrap){
    init = _bind(init,this);

    var global = this;
    var _color = '#fff'

    var $svgWrap;
    var reversePaths = [];

    this.animSequence = {length:0};
    this.animShapes   = {length:0};
    this.animLines    = {length:0};

    this.color = function(color){
      _color = color;
      $svgWrap.attr({stroke:color,fill:color});
    }


    this.loadingPath;
    this.progress = function(prog){
      if(this.loadingPath){
        this.loadingPath.progress = prog;
        this.loadingPath.update();
      }
    };

    this.getProgress = function(){
      return this.loadingPath.progress;
    }

    this.addCombo = function(name,combos){
      this.animSequence.length++;
      this.animSequence[name] = function(){
        var delay = 0;
        for(var i=0; i<combos.length; i++){
          var objs = combos[i];
          delayAcition(objs);
          delay = objs.delay;
        }

        return delay+1.25;
      }
    }


    this.loadedCombo = function(id,callback){
      if(this.loadingPath){
        var combo = this.animSequence['combo'+id];
        this.loadingPath.fromTo(1,2,combo(),callback);
      }
    }

    this.playCombo = function(id,callback){
      var combo = this.animSequence['combo'+id]();
      // this.loadingPath.fromTo(1,2,combo(),callback);
    }

    this.getPaths = function(id){
      return this.animLines[id];
    }

    this.getShape = function(id){
      return this.animShapes[id];
    }


    this.loadedComboRandom = function(callback){
      if(this.loadingPath){
        var id = Math.floor(Math.random()*this.animSequence.length)+1;
        var combo = this.animSequence['combo'+id];
        this.loadingPath.fromTo(1,2,combo(),callback);
      }
    }

    this.fromTo = function(from,to,duration,callback){
      this.loadingPath.fromTo(from,to,duration,callback);
    }
    

    function delayAcition(objs){
      setTimeout(function(){
        objs.view();
      },objs.delay*1000);
    }

    function init(){
      var _this = this;

      $svgWrap = $logoWrap.find('svg');
      $logoWrap.find('g').each(function(){
        var g = $(this),
            id = g.attr('id');
        // if(id.indexOf('line')>-1){
          

          // if(name.indexOf('loading')>-1){
          //   lineClass.progress = 0;
          //   lineClass.update();
          //   _this.loadingPath = lineClass;
          // }
        // }

        if(id.indexOf('shape')>-1){
          var name = id.replace('shape_','');
          _this.animShapes[name] = new ShapeBasic(g,name);
        }else{
          var direction = reversePaths.indexOf(id)>-1?-1:1;
          var name = id;
          var lineClass = new LineBasic(g,direction,name);  
          _this.animLines[name] = lineClass;
        }

        g.show();
      });
      // setCombo();
    }

    function setCombo(){
      // return;
    //   global.addCombo('combo1',[
    //     {view:global.animLines['inside-s-out'].view,delay:.0},
    //     {view:global.animLines['inside-s-in'].view,delay:.2},
    //     {view:global.animLines['diagonal-r'].view,delay:.3},
    //     {view:global.animLines['circle'].view,delay:.4}
    //   ]);

    //   global.addCombo('combo2',[
    //     {view:global.animLines['cone-in'].view,delay:0},
    //     {view:global.animLines['cone-out'].view,delay:.2},
    //     {view:global.animLines['square'].view,delay:.4},
    //     {view:global.animLines['circle'].view,delay:.4}
    //   ]);

    //   global.addCombo('combo3',[
    //     {view:global.animLines['cone-small'].view,delay:0},
    //     {view:global.animLines['cone-medium'].view,delay:.2},
    //     {view:global.animLines['circle'].view,delay:.4}
    //   ]);

    //   global.addCombo('combo4',[
    //     {view:global.animLines['diagonal-l'].view,delay:0},
    //     {view:global.animLines['diagonal-r'].view,delay:.2},
    //     {view:global.animLines['square'].view,delay:.4}
    //   ]);

    //   global.addCombo('combo5',[
    //     {view:global.animLines['outside-s-out'].view,delay:.0},
    //     {view:global.animLines['circle'].view,delay:.2},
    //     {view:global.animLines['square'].view,delay:.4},
    //   ]);

    //   global.addCombo('combo6',[
    //     {view:global.animLines['outside-s-in'].view,delay:.0},
    //     {view:global.animLines['circle'].view,delay:.2},
    //     {view:global.animLines['square'].view,delay:.4},
    //   ]);

    //   global.addCombo('combo7',[
    //     {view:global.animLines['cone-medium'].view,delay:0},
    //     {view:global.animLines['cone-in'].view,delay:.2},
    //     {view:global.animLines['circle'].view,delay:.4}
    //   ]);

    //   global.addCombo('combo8',[
    //     {view:global.animLines['cross-s'].view,delay:0},
    //     {view:global.animLines['circle'].view,delay:0.2},
    //     {view:global.animLines['square'].view,delay:.4},
    //   ]);
    }

    init();
    return this;
  }

  Logo.prototype.constructor = Logo;
  this.Logo = Logo;
  module.exports = Logo;


  LineBasic = function($wrap,direction,name){
    var _this = this;
    init = _bind(init,this);
    this.name = name;
    this.duration = 0;
    this.paths = [];
    this.shape = null;
    this.type = 'straight';
    this.progress = 1;
      
    function init(){
      // if(name.indexOf('s-')>-1)this.type = 'curve';
      $wrap.find('path').each(function(i){
        var path = $(this),
            length = path[0].getTotalLength();

        // console.log(path);
        // console.log(name +' : '+ length)
        _this.duration = length/500,
        _this.paths[i] = {
          path        : path,
          length      : length,
          dashOffset  : direction==1?length:-length,
          dashArray   : length,
          change:function(dur,delay,stDashOff,stDashArr,ease){
            var _this = this;
            TweenLite.to(this,dur,{
              delay:delay,
              dashOffset:stDashOff,
              dashArray:stDashArr,
              update:function(){
                _this.update();
              },
              onComplete:function(){},
              ease:ease});
          },
          update:name.indexOf('loading')>-1?update2:update1
        }
        _this.paths[i].update();
      });

      this.shape = $wrap.find('.shape');
      TweenLite.set(this.shape,{opacity:0});

      function update1(){
        TweenLite.set(this.path,{strokeDashoffset:this.dashOffset.toFixed(3)*_this.progress+'px',strokeDasharray:this.dashArray.toFixed(3)+'px ' + this.dashArray.toFixed(3)+'px'});
      }

      function update2(){
        TweenLite.set(this.path,{strokeDashoffset:(this.dashOffset+this.length*_this.progress).toFixed(3)+'px',strokeDasharray:this.dashArray.toFixed(3)+'px'});
      }
      this.view = _bind(this.view,this);
    };


    this.view = function(){
      for(var o in this.paths){
        var p = this.paths[o];
        p.change(0,0, p.length*direction,p.length,Power4.easeInOut);
        p.change(0.5,0, 0,p.length,Quart.easeInOut);
        p.change(0.8,0.45, -p.length*direction,p.length,Power4.easeInOut);
      }
    };

    this.fromTo = function(from,to,duration,callback){
      var paths = this.paths;
      var _this = this;
      this.progress = from;
      TweenLite.to(this,duration,{progress:to,ease:Power4.easeInOut,
        onUpdate:function(){
          for(var o in _this.paths){
            var p = _this.paths[o];
            p.update();
          }
        },
        onComplete:function(){
          if(callback){callback();}
        }
      });
    }

    this.update = function(){
      for(var o in this.paths){
        var p = this.paths[o];
        p.update();
      }
    }

    init();
    return this;
  }
  LineBasic.prototype.constructor = LineBasic;


  ShapeBasic = function($wrap,name){
    var _this = this;
    init = _bind(init,this);

    this.name = name;
    this.shapes = [];
    

    function init(){
      $wrap.find('path').each(function(i){
        _this.shapes.push($(this));
      });

      // this.init = _bind(shapeAnimations[name].init,this);
      // this.view = _bind(shapeAnimations[name].view,this);
      
      this.init();
    };

    this.init = function(){

    };
    this.view = function(){
    };

    init();
    return this;
  }
  ShapeBasic.prototype.constructor = ShapeBasic;

  shapeAnimations = {};
  shapeAnimations['ellipse'] = {
    init : function(){
      var s1 = this.shapes[0],
          s2 = this.shapes[1];

      TweenLite.set(s1,{opacity:0,x:0,y:0,ease:Power4.easeInOut});
      TweenLite.set(s2,{opacity:0,x:-0,y:-0,ease:Power4.easeInOut});
    },
    view : function(){
      var s1 = this.shapes[0],
          s2 = this.shapes[1];

      this.init();

      TweenLite.to(s1,.3,{opacity:1,x:0,y:0,ease:Power2.easeOut});
      TweenLite.to(s2,.3,{opacity:1,x:0,y:0,ease:Power2.easeOut});
      TweenLite.to(s1,.3,{delay:0.4,opacity:0,x:-31,y:-30,ease:Power4.easeInOut});
      TweenLite.to(s2,.3,{delay:0.4,opacity:0,x:31,y:30,ease:Power4.easeInOut});
    }
  }

}).call(this);
},{}],7:[function(require,module,exports){
/**
 * 2013.03.
 * Scenes ver 0.1.2
 * Author : Heonwongeun
 * FaceBook : https://www.facebook.com/heo.wongeun
 */

/* ************************************************************
 HOW TO USE

Scenes.addScene(sceneID,sceneFrame,type,option)
Scenes.addSceneActor(sceneID,fn)
Scenes.addFrameActor(startFrame,totalFrame,fn)
Scenes.addSceneFrameActor(sceneID,startFrame,totalFrame,fn)
Scenes.addSceneFrameStartActor(sceneID, fn)
Scenes.addSceneFrameEndActor(sceneID, fn)
Scenes.addSceneActorSet(sceneID, start, main, end)
************************************************************ */


var _bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

/* *********************************************************
*  Constructor
********************************************************** */
    
function Scenes(option){
    var scope       = this;

    this.option     = { stats : false }
    $.extend(this.option,option);

    this.scrollPossible = true;
    this.frame      = { root:scope, current:0, old:0, total:0, estimate:0, estimation:frameEstimation, update:frameUpdate, direction:0 , resistance : [] };
    this.scene      = { root:scope, current:0, old:0, total:0, estimate:0, estimation:sceneEstimation, update:sceneUpdate, scene:null, type:null, jump:null, link : null};
    this.type       = { current:null, old:null };
    this.direction  = "";

    this.scenes    = [];
    this.actors    = [];

    touchPosY      = 0;
    
    this.browserCheck();
    this.addEvent();
}
Scenes.prototype.constructor = Scenes;

//update
function frameUpdate(offset){
    if(this.current < 0 )this.current += -this.current*0.7;
    if(this.current > this.total )this.current += (this.total-this.current)*0.7;

    if(offset > 0){
        for(var o in this.resistance){
            var resistance = this.resistance[o];
            if(this.current > resistance.start && this.current < resistance.total){
                resistance.amount += offset*resistance.speed;
                this.current += (resistance.start+resistance.amount-this.current)*resistance.speed;
            }else{
                resistance.amount = 0;
            }    
        }
    }

    this.current    += offset;
    this.direction  = this.current-this.old;
    this.old        = this.current;
    this.estimate   = this.current;
}

function sceneUpdate(id){
    this.current    = id;
    this.scene      = this.root.scenes[this.current];
    this.type       = this.scene.type;
    this.estimate   = this.current;
}

//estimation
function frameEstimation(offset){
    this.estimate += offset;
}

function sceneEstimation(){
    for(var o in this.root.scenes){
        this.root.scenes[o].estimation();
    }
}


/* *********************************************************
*  SCROLL EVENT 
********************************************************** */
Scenes.prototype.addEvent = function(){
    this.onResize = _bind(this.onResize,this);
    $(window).bind("resize", this.onResize);
    this.onResize();
}
Scenes.prototype.EVENT_DELETE_SCROLL = "delete_scroll";

/* *********************************************************
*  ADD , REMOVE 
********************************************************** */
Scenes.prototype.addScene = function(sceneID,sceneFrame,type,option){
    if(typeof this.scenes[sceneID] == "undefined"){
        this.scenes[sceneID] = new Scene(sceneID,sceneFrame,type,this);
        if(typeof option != "undefined")this.scenes[sceneID].option = option;
        this.frame.total += sceneFrame;
        if(this.scene.total == 0)this.scene.update(0);
        this.scene.total = this.scenes.length - 1;

        for(var o in this.scenes){
            this.scenes[o].init();
        }
    }
}

Scenes.prototype.addSceneActor = function(sceneID,fn){
    if(typeof this.getScene(sceneID) != "undefined"){
        this.getScene(sceneID).add(fn);
    }
};

Scenes.prototype.addFrameActor = function(startFrame,totalFrame,fn){
    var actor   = new Actor(startFrame,totalFrame,fn);
    actor.stage = this;
    this.actors.push(actor);
}

Scenes.prototype.addSceneFrameActor = function(sceneID,startFrame,totalFrame,fn){
    var tgScene = this.getScene(sceneID);
    if(typeof tgScene == "undefined")return;
    if(startFrame == 0 && totalFrame == 0)startFrame = 1;
    var actor   = new Actor(tgScene.frame.start+startFrame,totalFrame,fn);
    actor.stage = this;
    this.actors.push(actor);
}

Scenes.prototype.addresistance = function(sceneID,startFrame,totalFrame,speed){
    var tgScene = this.getScene(sceneID);
    if(typeof tgScene == "undefined")return;
    this.frame.resistance.push({
        start   : tgScene.frame.start+startFrame,
        total   : tgScene.frame.start+startFrame+totalFrame,
        amount  : 0,
        speed   : typeof speed == "undefined"?0.5:speed
    })
}

Scenes.prototype.addSceneFrameStartActor = function(sceneID, fn){
    var tgScene = this.getScene(sceneID);
    if(typeof tgScene == "undefined")return;
    var actor   = new Actor(tgScene.frame.start + 1, 0, fn);
    actor.stage = this;
    this.actors.push(actor);
}

Scenes.prototype.addSceneFrameEndActor = function(sceneID, fn){
    var tgScene = this.getScene(sceneID);
    if(typeof tgScene == "undefined")return;
    var actor   = new Actor(tgScene.frame.end - 1, 0, fn);
    actor.stage = this;
    this.actors.push(actor);
}

Scenes.prototype.addSceneActorSet = function(sceneID, start, end, step){
    if(start) this.addSceneFrameStartActor(sceneID, start);
    if(step) this.addSceneActor(sceneID, main);
    if(end) this.addSceneFrameEndActor(sceneID, end);
}


/* *********************************************************
*  Scenes update 
********************************************************** */
Scenes.prototype.scrollPossibleOn = function(delay){
    var scope = this;
    setTimeout(function(){
        scope.scrollPossible = true;
    },delay);
}

Scenes.prototype.update = function(offset,type){
    if(offset == 0)return;
    if(!this.scrollPossible)return;
    var type = this.scene.type,estimate,tgScene;
    if(this.scrollPossible){
        this.frame.estimation(offset);
        this.scene.estimation();
        estimate = this.scene.estimate;
    }

    if(this.scene.current != this.scene.estimate){
        // if(!this.scrollPossible)return;
        if(offset > 0){
            this.frame.update(this.getScene(this.scene.estimate).frame.start-this.frame.current);
            this.animation();
        }else{
            this.frame.update(this.getScene(this.scene.estimate).frame.end-this.frame.current);
            this.animation();
            this.scene.current  = estimate;
            this.scene.estimate = estimate;
            this.scene.type     = this.getScene(this.scene.estimate).type;
        }

        // $(this).trigger(this.EVENT_DELETE_SCROLL);
        // this.scrollPossible = false;
        // this.scrollPossibleOn(500);
        
    }else{
        // if(!this.scrollPossible)return;
        if(type == "normal"){
            this.frame.update(offset);
            this.animation();
        }else if(type == "quick"){

            
            if(this.scene.current == this.scene.total){ //last scene
                var scene = this.getScene(this.scene.total);
                this.scrollPossible = false;
                if(offset > 0){
                    this.direction  = 1;
                    this.gotoFrame(scene.frame.end,scene.option);
                }else{
                    this.direction  = -1;
                    this.gotoFrame(scene.frame.start,scene.option);
                }
            }else{
                if(offset > 0){
                    tgScene         = this.getScene(this.scene.current+1);
                    this.direction  = 1;
                    if(typeof tgScene != "undefined")this.gotoScene(tgScene.id,this.scene.scene.option);
                }else{
                    var sceneID = this.scene.current==this.scene.total-1?this.scene.current:this.scene.current;

                    tgScene         = this.getScene(sceneID);
                    this.direction  = -1;
                    if(typeof tgScene != "undefined")this.gotoScene(tgScene.id,tgScene.option);
                }
            }
        }
    }
}

// Scenes.prototype.

/* *********************************************************
*   Scene Function
********************************************************** */

Scenes.prototype.nextScene = function(){
    if(this.scene.current < this.scene.total){
        var nextScene       = this.scene.current+1;

        this.scrollPossible = false;
        this.gotoFrame(this.scenes[nextScene].frame.start);
        this.scene.update(nextScene);
    }
}

Scenes.prototype.prevScene = function(){
    if(this.scene.current > 0){
        var prevScene = this.scene.current-1;

        this.scrollPossible = false;
        this.gotoFrame(this.scenes[prevScene].frame.start);
        this.scene.update(prevScene);
    }
}

Scenes.prototype.gotoScene = function(sceneID,option){
    if(!this.scrollPossible)return;
    this.scrollPossible = false;

    if(this.scene.current < sceneID){
        this.direction = 1;
        this.gotoFrame(this.getScene(sceneID).frame.start,option);
    }else{
        this.direction = 0;
        this.gotoFrame(this.getScene(sceneID).frame.start,option);
    }
}

/* *********************************************************
*  Scenes type check 
********************************************************** */
Scenes.prototype.animation = function(){
    for(var o in this.scenes)this.scenes[o].update();
    for(var a in this.actors)this.actors[a].update();

    if(this.option.stats && this.scenes.length > 0)this.status();
}

Scenes.prototype.gotoFrame = function(tgFrame,option) {
    var obj     = { current : tgFrame, estimate : tgFrame },
        config  = { duration:1,ease:"easeInOutQuint"},
        scope   = this;
    $.extend(config,option);

    if(config.duration==0){
        $.extend(this.frame,obj);
        onComplete(option);
    }else{
        obj.onUpdate = stepAnimation;
        obj.onComplete = function(){ onComplete(option)};
        obj.ease = Power0.easeNone;
        TweenLite.to($(this.frame),config.duration,obj);
    }
    
    function onComplete(option){
        if(option.onComplete){
            if(!option.jump)option.onComplete();
        }

        stepAnimation();
        $(scope).trigger(scope.EVENT_DELETE_SCROLL);
        scope.scrollPossible = true;

        var option = scope.scene.scene.option;

        if(scope.direction > 0){
            if(option.jump && typeof option.jump.next != "undefined")scope.gotoScene(scope.scene.scene.option.jump.next,scope.scene.scene.option);
        }else{
            if(option.jump && typeof option.jump.prev != "undefined")scope.gotoScene(scope.scene.scene.option.jump.prev,scope.scene.scene.option);
        }
    }

    function stepAnimation(){
        scope.animation();
    }
};


Scenes.prototype.getScene = function(sceneID){
    return this.scenes[sceneID];
}



/* *********************************************************
*  EventHandler
********************************************************** */
Scenes.prototype.onResize = function(){
    this.sw    = this.windowWidth();
    this.sh    = this.windowHeight();
    this.animation();
}

/* *********************************************************
*  infomation stats
********************************************************** */
Scenes.prototype.status = function(){
    if(typeof this.sceneStatus == 'undefined'){
        this.sceneStatus = $("<div id='sceneStatus'></div>").prependTo($('body'));
        this.sceneStatus.css({
            'position' : 'absolute',
            'z-index': 1000000,
            'padding': 10,
            'font-size' : 10,
            'font-weight' : 300,
            'text-transform' : 'uppercase',
            'background-color' : 'rgba(0,0,0,0.8)',
            'color' : '#fff',
            'width' : 200,
            'letter-spacing' : '0.02em',
            'line-height' : '1.7em',
            'font-family' : 'Helvetica'
        })
    }

    var currentScene = this.scenes[this.scene.current];
    this.sceneStatus.html(
        "total scene / frame = " + this.scene.total + " / " + this.frame.total + "<br>" + 
        "- scene / frame  = " + currentScene.id + " / " + this.frame.current.toFixed(1) + "<br>" +
        "- scene frame = " + (this.frame.current - currentScene.frame.start).toFixed(1)
    )
}


/* *********************************************************
* Class
********************************************************** */

function Scene(id,frame,type,parent){

    this.id             = id;
    this.type           = type;
    this.parent         = parent;
    this.option         = {};
    this.progress       = 0;
    this.oldProgress    = 0;
    this.objs;

    this.init = function(){
        var startFrame = 0;
        for(var o in this.parent.scenes){
            if(o < this.id)startFrame += this.parent.scenes[o].frame.total;
        }
        this.frame = { start : startFrame , end : startFrame+frame, total:frame }; 
    }


    this.add = function(fn){
        if(typeof this.objs =="undefined")this.objs = [];
        fn = _bind(fn,this);
        this.objs.push(fn)
    }

    this.remove = function(){

    }

    this.update = function(){
        this.progress = ((this.parent.frame.current - this.frame.start)/this.frame.total).toFixed(6);
        this.progress = Number(this.progress);
        
        if(this.progress >= 0 && this.progress <= 1){
            this.sceneCheck();
            if(this.oldProgress != this.progress)for(var f in this.objs)this.objs[f](this.progress);
        }else{
            this.overCheck();
        }
        this.oldProgress = this.progress;
    }

    this.sceneCheck = function(){
        if(this.progress >= 0 && this.progress <= 1){
            this.parent.scene.update(this.id);
        }
    }

    this.estimation = function(){
        var p = (this.parent.frame.estimate - this.frame.start)/this.frame.total;
        if(p >= 0 && p < 1){
            this.parent.scene.estimate = this.id;
        }
    }

    this.overCheck = function(){
        if(this.progress < 0)this.progress = 0;
        if(this.progress > 1)this.progress = 1;
        if(this.oldProgress != this.progress){
            for(var f in this.objs)this.objs[f](this.progress);
        }
    }

    this.timeRevision = function(startF,totalF,easing){
        var totalframe = typeof totalF=="undefined"?(this.frame.total - startF):totalF,
            newPogress = (this.parent.frame.current - this.frame.start - startF) / totalframe // (totalF != "undefined"?totalF:(this.frame.total - startF)); 
        if(newPogress < 0) newPogress = 0;
        if(newPogress > 1) newPogress = 1;

        if(typeof easing !== 'undefined' && typeof $.easing[easing] !== 'undefined'){
            newPogress = $.easing[easing](newPogress,newPogress,0,1,1);
        }
        
        return newPogress;
    }
}

Scene.prototype.constructor = Scene;


function Actor(startFrame,totalFrame,act){
    this.stage          = null;
    this.act            = act;
    this.progress       = 0;
    this.oldProgress    = 0;
    this.frame          = { start : startFrame , end : startFrame+totalFrame, total:totalFrame }; 

    this.update = function(){
        this.progress = ((this.stage.frame.current - this.frame.start)/this.frame.total).toFixed(6);;
        this.progress = Number(this.progress);

        if(this.progress >= 0 && this.progress <= 1){
            if(this.oldProgress != this.progress)this.act(this.progress);
        }else{
            this.overCheck();
        }

        this.oldProgress = this.progress;
    }

    this.overCheck = function(){
        if(this.progress < 0)this.progress = 0;
        if(this.progress > 1)this.progress = 1;
        if(this.oldProgress != this.progress){
            if(Math.floor(this.oldProgress) == 1 || Math.floor(this.oldProgress) == 0){
                this.act(this.progress);
            }
        }
    }

}

Actor.prototype.constructor = Actor;

/* *********************************************************
*  UTILITY FUNCTION
********************************************************** */
Scenes.prototype.windowWidth = function(){
    if (document.documentElement.clientWidth) {
        this.sw = document.documentElement.clientWidth;
    } else if (document.body.clientWidth) {
        this.sw = document.body.clientWidth;
    } else if (window.innerWidth) {
        this.sw = window.innerWidth;
    }
}

Scenes.prototype.windowHeight = function(){
    if (document.documentElement.clientHeight) {
        this.sh = document.documentElement.clientHeight;
        
    } else if (document.body.clientHeight) {
        this.sh = document.body.clientHeight;
    } else if (window.innerHeight) {
        this.sh = window.innerHeight;
    }
}

Scenes.prototype.browserCheck = function(){
    this.ua = navigator.userAgent.toLowerCase();
    return {
      // IE
      isIE: /msie (\d+)/.test(this.ua),
      // IE6
      isIE6: /msie (\d+)/.test(this.ua) && RegExp.$1 == 6,
      // IE7
      isIE7: /msie (\d+)/.test(this.ua) && RegExp.$1 == 7,
      // IE8
      isIE8: /msie (\d+)/.test(this.ua) && RegExp.$1 == 8,
      // IE9
      isIE9: /msie (\d+)/.test(this.ua) && RegExp.$1 == 9,
      // IE9未満
      isLtIE9: /msie (\d+)/.test(this.ua) && RegExp.$1 < 9
   }
}

// this.Scenes = Scenes;

module.exports = Scenes;
},{}],8:[function(require,module,exports){
(function(){
/* ************************************************************
  title  : Scroll ver 0.1.3
  date   : 2014.05
  author : Heowongeun
  modifications :
      - changed speed
      - changed friction
  features : 
      - added scroll bar, 
      - target moves by scroll bar
      - scroll x,y
  require : 
      TweenLite
************************************************************ */

//scroll = new Scroll({speed:.1, friction:0.1, touchSpeed:5, step:scrolling});
var _bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
var getPagePos = function(e){
  var pos, touch;
  pos = {x:0, y:0};
  if("ontouchstart" in window) {
    if (e.touches != null) {
        touch = e.touches[0];
    } else {
        touch = e.originalEvent.touches[0];
    }
    pos.x = touch.clientX;
    pos.y = touch.clientY;
  } else {
    pos.x = e.clientX;
    pos.y = e.clientY;
  }
  return pos;
}

var nv  = window.navigator,
  ua  = nv.userAgent.toLowerCase(),
  uas = {
    mac : /mac/i.test(nv['platform']),
    win : /win/i.test(nv['platform']),
    isLtIE9 : /msie\s(\d+)/.test(ua)?RegExp.$1 * 1 < 9:false
  }
/* *********************************************************
*  Constructor 
********************************************************** */

function Scroll(option){
  this.scrollBar;

  this.config     = {
    target      : document,
    speed       : .1,
    friction    : 0.1,
    touchSpeed  : 5,
    freeze      : false,
    type        : "wheel",
    scrollType  : "y",
    screenFix   : false,
    scrollLimit : 30,
    scrollBar   : null,
    step        : function(){},
    start       : function(){},
    stop        : function(){},
    touchStart  : function(){},
    touchMove   : function(){},
    touchEnd    : function(){}
  }

  this.touchInfos = {
    start:{x:0,y:0},
    move:{x:0,y:0},
    end:{x:0,y:0},
    distance:{x:0,y:0},
    distanceOffset : function(){
      return {x:Math.abs(this.distance.x),y:Math.abs(this.distance.y)};
    }
  };

  $.extend(this.config,option);
  this.config.friction = 1-Math.max(0,Math.min(1,this.config.friction));
  if(this.config.friction >= 1 )this.config.friction = 0.99;

  if(this.config.scrollBar){
    var sbInfo = this.config.scrollBar;
    this.scrollBar = new ScrollBar(
      sbInfo.moveTarget,
      sbInfo.scrollBarWrap,
      $.extend({scrollClass:this,scrollType:this.config.scrollType},sbInfo.option == 'undefined'?{}:sbInfo.option)
    );
  }

  this.offset         = 0;
  this.offsetMax      = 0;
  this.offsetMin      = 0;      
  this.isRender       = false;
  this.renderingID;
  this.onRender       = _bind(this.onRender,this);

  
  //wheelEvent
  this.onWheel = _bind(this.onWheel,this);
  // $(this.config.target).bind("mousewheel", this.onWheel);
  $(this.config.target).bind("mousewheel", $.throttle( 10, this.onWheel ) );
  //touchEvent
  this.onTouchStart   = _bind(this.onTouchStart,this);
  this.onTouchMove    = _bind(this.onTouchMove,this);
  this.onTouchEnd     = _bind(this.onTouchEnd,this);
  this.touchOld = {x:0,y:0};

  $(this).bind('ScrollBarEvents',this.eventListener);

  $(this.config.target).bind("touchstart", this.onTouchStart);
  $(this.config.target).bind("touchmove", this.onTouchMove);
  $(this.config.target).bind("touchend", this.onTouchEnd);
};

Scroll.prototype.constructor = Scroll;
Scroll.prototype.init = function(){

}

Scroll.prototype.optionChange = function(option){
  $.extend(this.config,option);
}

/* *********************************************************
*  SCROLL EVENT 
********************************************************** */
Scroll.prototype.EVENT_FREEZE_ON           = "freezeOn";
Scroll.prototype.EVENT_FREEZE_OFF          = "freezeOff";

// Scroll.prototype.EVENT_TOUCHSTART       = "touch_start";
// Scroll.prototype.EVENT_TOUCHEND         = "touch_end";

// Scroll.prototype.EVENT_SCROLLSTART      = "scroll_start";
// Scroll.prototype.EVENT_SCROLLAFTER      = "scroll_after";

// Scroll.prototype.event_dispatch = function(event){
  // $(this).trigger(event);
// }

Scroll.prototype.eventDispatcher = function(events){
  $(this).trigger('ScrollBarEvents',events);
}
Scroll.prototype.eventListener = function(event,data){
  switch(data) {
    case this.EVENT_FREEZE_ON  : this.config.freeze = true; break;
    case this.EVENT_FREEZE_OFF : this.config.freeze = false; break;
  }
}

/* *********************************************************
*  Event Handler
********************************************************** */

Scroll.prototype.onTouchStart = function(e){
  // if(this.config.screenFix)e.preventDefault();
  this.isTouch　= true;
  // var touch = this.getTouchInfo(e);
  this.touchInfos.start     = this.getTouchInfo(e);
  this.touchInfos.move      = {x:0,y:0};
  this.touchInfos.end       = {x:0,y:0};
  this.touchInfos.distance  = {x:0,y:0};

  // this.touchOld.x = touch.x;
  // this.touchOld.y = touch.y;
  this.startRender();
  this.config.touchStart();
}

Scroll.prototype.onTouchMove = function(e){
  if(this.config.screenFix)e.preventDefault();
  this.touchInfos.move = this.getTouchInfo(e);
  this.touchInfos.distance.x = this.touchInfos.start.x - this.touchInfos.move.x;
  this.touchInfos.distance.y = this.touchInfos.start.y - this.touchInfos.move.y;

  this.offset = this.touchInfos.distance.y;
  this.config.touchMove(this.touchInfos);
}

Scroll.prototype.onTouchEnd = function(e){
  if(typeof this.t_moveP == 'undefined')return;
  this.isTouch = false;
  this.touchInfos.end = this.touchInfos.move;

  var dis = this.touchInfos.distanceOffset();

  this.offset = dis.x>dis.y?0:this.touchInfos.distance.y;
  this.startRender();
  this.config.touchEnd(this.touchInfos);
}


Scroll.prototype.getTouchInfo = function(e){
  if(!this.time)this.time = new Date();
  var info = { x : 0 , y : 0 , time: new Date().getTime()};
  $.extend(info,getPagePos(e));
  return info;
}

Scroll.prototype.onWheel = function(event, delta, deltaX, deltaY){
  var del = 0;
  // console.log(delta, deltaX, deltaY);
  
  if(uas.isLtIE9){
      del = delta;
  }else{
    switch(this.config.scrollType){
      case "x" : del = deltaX; break;
      case "y" : del = deltaY; break;
    }
  }

  if(uas.win)del*=20;
  // else del*=0.05;
  // del *= 0.1;

  this.offset += -del*this.config.speed;
  this.startRender();
}

/* *********************************************************
*  Rendering
********************************************************** */
Scroll.prototype.startRender = function(){
  if(typeof this.renderingID == 'undefined'){
    // this.event_dispatch(this.EVENT_SCROLLSTART);
    this.config.start();
    this.renderingID = requestAnimationFrame(this.onRender);
  }
}

Scroll.prototype.stopRender = function(){
  this.config.stop();
  cancelAnimationFrame(this.renderingID);
  this.renderingID = undefined;
  this.offset = 0;
}

Scroll.prototype.onRender = function(){
  if(Math.abs(this.offset) < 0.001 && !this.isTouch){
    this.stopRender();
    this.config.step(this.offset);
    // this.event_dispatch(this.EVENT_SCROLLAFTER);
    return;
  }

  if(this.config.friction != 0)this.offset *= this.config.friction;
  
  this.config.step(this.offset);
  this.renderingID = requestAnimationFrame(this.onRender);
  if(this.config.stats && !uas.isLtIE9)this.stats();

  if(this.scrollBar)this.scrollBar.onScrolling(this.offset);
  
  if(this.config.friction == 0){
      this.stopRender();
      this.config.step(this.offset);
  }
}


/* ************************************************************
  stats
************************************************************ */
Scroll.prototype.stats = function(){
  if(typeof this.scrollStatus == 'undefined'){
    this.scrollStatus = $("<div id='scrollStatus'></div>").prependTo(this.config.target);
    this.scrollStatus.css({
      'position' : 'absolute',
      'z-index': 1000000,
      'padding': 10,
      'font-size' : 10,
      'font-weight' : 300,
      'text-transform' : 'uppercase',
      'background-color' : 'rgba(255,0,0,.9)',
      'color' : '#fff',
      'width' : 200,
      'letter-spacing' : '0.02em',
      'line-height' : '1.7em',
      'font-family' : 'Helvetica'
    })
  }

  this.scrollStatus.html(
    "scroll type = " + this.config.scrollType + "<br>" +
    "scroll speed = " + this.config.speed + "<br>" +
    "scroll offset = " + this.offset.toFixed(2)
  )
}
// this.Scroll = Scroll;



/* ************************************************************
title  : Scroll Bar ver 0.01
date   : 2015.02
author : Heowongeun
************************************************************ */
function ScrollBar(moveTarget,scrollBarWrap,option){
  this.moveTarget = $(moveTarget);
  this.moveTargetParent = this.moveTarget.parent();
  this.scWrap     = $(scrollBarWrap);
  this.scBarHit   = $('<div class="scbar-hitarea"></div>').appendTo(this.scWrap);
  this.scBarIn    = $('<div class="scbar-inner"></div>').appendTo(this.scWrap);
  this.scBar      = $('<div class="scbar"></div>').appendTo(this.scBarIn);
  this.isDrag     = false;
  this.isMiniSize = false;

  this.config = {
    scrollType  : 'y',
    freeze      : false,
    minSize     : true,
    bounceFriction  : 0.2,
    dragSpeed   : 0.2
  };

  this.positions = {
    dragging    : {x:0,y:0},
    onDownPos  : {x:0,y:0},
    onDownScrollTop : 0,
    onDownScrollLeft : 0,
  }

  this.scroll = {
    top         : 0,
    left        : 0,
    width       : 0,
    height      : 0,
    current     : 0,
    total       : 0,
    range       : 0,
    ratio       : 0,
    ratioOld    : 0
  }

  this.renderingID = undefined;
  if(typeof option != undefined)$.extend(this.config,option);
  
  this.init = function(){
    this.addEvent();
    return this;
  }
  // this.sizeOrigin();
  this.addEvent = function(){
    this.onMouseOver    = _bind(this.onMouseOver,this);
    this.onMouseOut     = _bind(this.onMouseOut,this);
    this.onMouseDown    = _bind(this.onMouseDown,this);
    this.onMouseUp      = _bind(this.onMouseUp,this);
    this.onMouseMove    = _bind(this.onMouseMove,this);
    this.onResize       = _bind(this.onResize,this);
    this.onRender       = _bind(this.onRender,this);

    this.eventListener  = _bind(this.eventListener,this);

    this.scBar.bind('mousedown',this.onMouseDown);
    this.scWrap.bind('mouseover',this.onMouseOver);
    this.scWrap.bind('mouseout',this.onMouseOut);

    $(this).bind('ScrollBarEvents',this.eventListener);
    $(window).bind('resize',this.onResize);
    this.onResize();
  }

  this.init();
  return this;
};

/* *********************************************************
*  SCROLL EVENT 
********************************************************** */
ScrollBar.prototype.EVENT_FREEZE_ON           = "freezeOn";
ScrollBar.prototype.EVENT_FREEZE_OFF          = "freezeOff";

// Scroll.prototype.EVENT_TOUCHEND         = "touch_end";
// Scroll.prototype.EVENT_SCROLLSTART      = "scroll_start";
// Scroll.prototype.EVENT_SCROLLAFTER      = "scroll_after";

// Scroll.prototype.event_dispatch = function(event){
  // $(this).trigger(event);
// }


ScrollBar.prototype.eventDispatcher = function(events){
  $(this).trigger('ScrollBarEvents',events);
}
ScrollBar.prototype.eventListener = function(event,data){
  switch(data) {
    case this.EVENT_FREEZE_ON  : this.config.freeze = true; break;
    case this.EVENT_FREEZE_OFF : this.config.freeze = false; break;
  }
}

ScrollBar.prototype.scrollTop = function(){
  return this.scroll.top;
}



ScrollBar.prototype.scrollMove = function(y,duration,onComplete){

  this.eventDispatcher(this.EVENT_FREEZE_ON);
  this.config.scrollClass.eventDispatcher(this.EVENT_FREEZE_ON);

  var _this = this;
  TweenLite.to(this.scroll,duration,{current:y,ease:Power4.easeInOut
    ,onUpdate:function(){
      _this.calculate();
      _this.update();
    }
    ,onComplete:function(){
      if(onComplete)onComplete();
      _this.eventDispatcher(_this.EVENT_FREEZE_OFF);
      _this.config.scrollClass.eventDispatcher(_this.config.scrollClass.EVENT_FREEZE_OFF);
    }
  });
}

ScrollBar.prototype.sizeMini = function(){
  if(!this.isMiniSize){
    this.isMiniSize = true;
  }
  
}

ScrollBar.prototype.sizeOrigin = function(){
  if(this.isMiniSize){
    this.isMiniSize = false;
  }
}

ScrollBar.prototype.onMouseOver = function(e){
  this.sizeOrigin();
  this.isDrag = true;
}

ScrollBar.prototype.onMouseOut = function(e){
  this.isDrag = false;
  // this.sizeMini();
}

ScrollBar.prototype.onMouseDown = function(e){
  if(this.config.freeze)return;
  e.preventDefault(); e.stopImmediatePropagation();

  switch(this.config.scrollType){
    case 'x' : 
      this.positions.onDownScrollLeft = this.scroll.left;
      this.positions.onDownPos.x = e.clientX;
      break;
      this.positions.onDownScrollTop = this.scroll.top;
      this.positions.onDownPos.y = e.clientY;
    case 'y' :
      break;
  }


  
  $('body').addClass('select-none');
  $(document).bind('mousemove',this.onMouseMove);
  $(document).bind('mouseup',this.onMouseUp);

  this.isDrag = true;
  if(this.config.scrollClass)this.config.scrollClass.stopRender();
}

ScrollBar.prototype.onMouseUp = function(e){
  $('body').removeClass('select-none');
  $(document).unbind('mousemove',this.onMouseMove);
  $(document).unbind('mouseup',this.onMouseUp);

  this.isDrag = false;
}

ScrollBar.prototype.onMouseMove = function(e){

  switch(this.config.scrollType){
    case 'x' : 
      this.positions.dragging.x = this.positions.onDownScrollLeft+e.clientX-this.positions.onDownPos.x;
      if(this.positions.dragging.x < 0)this.positions.dragging.x = 0;
      if(this.positions.dragging.x > this.scroll.range)this.positions.dragging.x = this.scroll.range;
      break;
    case 'y' :
      this.positions.dragging.y = this.positions.onDownScrollTop+e.clientY-this.positions.onDownPos.y;
      if(this.positions.dragging.y < 0)this.positions.dragging.y = 0;
      if(this.positions.dragging.y > this.scroll.range)this.positions.dragging.y = this.scroll.range;
      break;
  };

  this.startRender();
}

ScrollBar.prototype.startRender = function(){
  if(typeof this.renderingID == 'undefined'){
    this.renderingID = requestAnimationFrame(this.onRender);
  }
}

ScrollBar.prototype.stopRender = function(){
  if(typeof this.renderingID != 'undefined'){
    cancelAnimationFrame(this.renderingID);
    this.renderingID = undefined;
    this.positions.dragging.x = 0;
    this.positions.dragging.y = 0;
  }
}

ScrollBar.prototype.onRender = function(){
  switch(this.config.scrollType){
    case 'x' : 
      if(Math.abs(this.scroll.left-this.positions.dragging.x) < 0.001){
          this.stopRender();
          return;
      }

      this.scroll.left += (this.positions.dragging.x-this.scroll.left)*this.config.dragSpeed;
      this.scroll.ratio  = (this.scroll.left/this.scroll.range).toFixed(5);
      this.scroll.current = this.scroll.ratio * this.scroll.total;

      break;

    case 'y' : 
      if(Math.abs(this.scroll.top-this.positions.dragging.y) < 0.001){
          this.stopRender();
          return;
      }

      this.scroll.top += (this.positions.dragging.y-this.scroll.top)*this.config.dragSpeed;
      this.scroll.ratio  = (this.scroll.top/this.scroll.range).toFixed(5);
      this.scroll.current = this.scroll.ratio * this.scroll.total;

      break;
  }


  

  this.update();
  this.renderingID = requestAnimationFrame(this.onRender);
}


ScrollBar.prototype.onScrolling = function(delta){
  this.stopRender();

  switch(this.config.scrollType){
    case 'x' : this.scroll.current -= delta; break;
    case 'y' : this.scroll.current += delta; break;
  }

  if(this.scroll.current < 0)this.scroll.current += -this.scroll.current*this.config.bounceFriction;
  if(this.scroll.current > this.scroll.total)this.scroll.current += (this.scroll.total-this.scroll.current)*this.config.bounceFriction;
  this.calculate();
  this.update();
}

ScrollBar.prototype.calculate = function(delta){
  this.scroll.ratio   = (this.scroll.current/this.scroll.total).toFixed(5);

  switch(this.config.scrollType){
    case 'x' : this.scroll.left = this.scroll.ratio * this.scroll.range; break;
    case 'y' : this.scroll.top = this.scroll.ratio * this.scroll.range; break;
  }

}

ScrollBar.prototype.update = function(){
  switch(this.config.scrollType){
    case 'x' : 
      if(this.scroll.ratio == this.scroll.ratioOld)return;
      this.scBar.css(translate(this.scroll.left,this.scroll.top));
      this.moveTarget.css(translate(-this.scroll.ratio*this.scroll.total,0));
    break;

    case 'y' : 
      if(this.scroll.ratio == this.scroll.ratioOld)return;
      this.scBar.css(translate(0,this.scroll.top));
      this.moveTarget.css(translate(0,-this.scroll.ratio*this.scroll.total));
      // TweenLite.set(this.scBar,{y:this.scroll.top});
      // TweenLite.set(this.moveTarget,{y:-this.scroll.ratio*this.scroll.total.y});
    break;
  }

  // this.scroll.ratioOld = this.scroll.ratio;

  if(this.config.scrollClass){
    this.config.scrollClass.config.step();
  }
}


function translate(x,y){
  var css3 = "matrix(1,0,0,1,"+x+","+y+")";
  return{
      "-webkit-transform" : css3,
      "transform"         : css3
  };
}


ScrollBar.prototype.onResize = function(e){

  switch(this.config.scrollType){
    case 'x' : 
      this.scroll.total   = this.moveTarget.width()-this.moveTargetParent.width();
      this.scroll.width  = (this.moveTargetParent.width()/this.moveTarget.width())*this.scBarIn.width();
      this.scBar.css({width:this.scroll.width});
      this.scroll.range   = this.scBarIn.width()-this.scBar.width();
      break;
    case 'y' : 
      this.scroll.total   = this.moveTarget.height()-this.moveTargetParent.height();
      this.scroll.height  = (this.moveTargetParent.height()/this.moveTarget.height())*this.scBarIn.height();
      this.scBar.css({height:this.scroll.height});
      this.scroll.range   = this.scBarIn.height()-this.scBar.height();
      break;
  }
  
  this.onScrolling(0);
  this.update();
}

ScrollBar.prototype.construcore = ScrollBar;
this.ScrollBar = ScrollBar;
module.exports = Scroll;
}).call(this);







},{}],9:[function(require,module,exports){
(function() {
  var UA = function(){
    var e, t, n, r, u;
    u   = navigator.userAgent;
    r   = navigator.userAgent.toLowerCase();
    nv  = window.navigator;
    t = {
      isIE : false,
      isIE6 : false,
      isIE7 : false,
      isIE8 : false,
      isIE9 : false,
      isLtIE9 : false,
      isLtIE10 : false,
      isLtIE11 : false,
      isIE10 : false,
      isIE11 : false,
      isEdge : false,
      isIOS : false,
      isIOS8 : false,
      isIPhone : false,
      isIPad : false,
      isIPhone4 : false,
      isIPad3 : false,
      isAndroid : false,
      isAndroidMobile : false,
      isChrome : false,
      isSafari : false,
      isMozilla : false,
      isWebkit : false,
      isOpera : false,
      isPC : false,
      isTablet : false,
      isSmartPhone : false,
      browser : r,
      isMac : /mac/i.test(nv['platform']),
      isWin : /win/i.test(nv['platform'])
    };
    
    if (t.isIE = /msie\s(\d+)/.test(r)) {
      n = RegExp.$1;
      n *= 1;
      t.isIE6 = n === 6;
      t.isIE7 = n === 7;
      t.isIE8 = n === 8;
      t.isIE9 = n === 9;
      t.isIE10 = n === 10;
      t.isLtIE9 = n < 9;
      t.isLtIE10 = n < 10;
      t.isLtIE11 = n < 11;
    }

    if (t.isIE7 && r.indexOf("trident/4.0") !== -1) {
      t.isIE7 = false;
      t.isIE8 = true
    }
    if (r.indexOf("trident/7.0") !== -1) {
      t.isIE = true;
      t.isIE11 = true;
    }

    if (r.indexOf("applewebkit") > -1 && r.indexOf("edge") > -1){
      t.isEdge = true;
    };

    if (t.isIPhone = /i(phone|pod)/.test(r)) {
      t.isIPhone4 = window.devicePixelRatio === 2
    }
    if (t.isIPad = /ipad/.test(r)) {
      e = window.devicePixelRatio === 2
    }
    t.isIOS = t.isIPhone || t.isIPad;

    if(t.isIOS){
      t.isIOS8 = /iphone os 8/.test(r);
      t.iosVersion = r.substr(r.lastIndexOf('iphone os')+10,1);
    }


    t.isAndroid = /android/.test(r);

    if(t.isAndroid){
      t.androidVersion = u.match(/Android [\d+\.]{3,5}/)[0].replace('Android ','');
    }
    t.isAndroidMobile = /android(.+)?mobile/.test(r);
    t.isPC = !t.isIOS && !t.isAndroid;
    t.isTablet = t.isIPad || t.isAndroid && t.isAndroidMobile;
    t.isSmartPhone = t.isIPhone || t.isAndroidMobile;
    t.isChrome = /chrome/.test(r);

    if(t.isIOS){
      t.isChrome = /crios/.test(r);
    }

    if(t.isChrome){
      if(t.isAndroidMobile){
        t.chromeVersion = r.substr(r.lastIndexOf('chrome/') + 7, 2);
      }else if(t.isAndroid && t.isTablet){
        t.chromeVersion = r.substr(r.lastIndexOf('chrome/') + 7, 2);
      }else{
        t.chromeVersion = r.substr(r.lastIndexOf('crios/') + 6, 2);
      }
    }

    t.isWebkit = /webkit/.test(r);
    t.isOpera = /opera/.test(r);
    t.isMozilla = r.indexOf("compatible") < 0 && /mozilla/.test(r);
    t.isSafari = !t.isChrome && t.isWebkit;
    return t
  }

  UA.prototype.constructor = UA;
  module.exports = UA;
}).call(this);

},{}],10:[function(require,module,exports){
/**
* 2013.10.
* Heo Util ver 0.02
* Author : Heonwongeun
* FaceBook : https://www.facebook.com/heo.wongeun
*/

(function(){
  var Util = {};
  if(typeof Heo == 'undefined')Heo = {};
  Heo.Util = Util;
  Util._bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  /* ************************************************************
      Change Image To Canvas
  ************************************************************ */
  Heo.Util.changeToCanvas = function($img){
    var w   = $img.width(),
        h   = $img.height();

    var image = new Image();
    image.src = $img.attr('src');
    image.onload = function(){
      w = image.width;
      h = image.height;

      var canvas = $('<canvas width="'+w+'" height="'+h+'"></canvas>').addClass($img[0].className).css({display:'block'});
      var ctx = canvas[0].getContext("2d");

      $img.before(canvas);
      $.extend(canvas.data(),$img.data());
      if($img[0].id != 'undefined')canvas.attr('id',$img[0].id);
      
      canvas.width    = w;
      canvas.height   = h;
      ctx.drawImage(image, 0, 0, w, h);
      $img.remove();
    }
  }

  /* ************************************************************
      Scroll Event On / Off
  ************************************************************ */
  var keys = {37: 1, 38: 1, 39: 1, 40: 1};
  function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault)
        e.preventDefault();
    e.returnValue = false;  
  }

  function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
  }
  Heo.Util.DisableScroll = function(){
    if (window.addEventListener) // older FF
    window.addEventListener('DOMMouseScroll', preventDefault, false);
    window.onwheel = preventDefault; // modern standard
    window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
    window.ontouchmove  = preventDefault; // mobile
    document.onkeydown  = preventDefaultForScrollKeys;
  }

  Heo.Util.EnableScroll = function(){
    if (window.removeEventListener)
      window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel = document.onmousewheel = null; 
    window.onwheel = null; 
    window.ontouchmove = null;  
    document.onkeydown = null;  
  }

  /* ***************************************************************************************
      set transition
      require : jQuery
  *************************************************************************************** */
  Util.Css = {};
  Util.Css.setTransition = function(obj,duration,ease){
    var css = duration +'s '+ease;
    obj.css({"-webkit-transition" : css, "transition" : css});
  },

  Util.Css.setTransitionDuration = function(obj,duration){
    var css = duration +'s';
    obj.css({"-webkit-transition-duration" : css, "transition-duration" : css});
  }

  Util.Css.setTransitionDelay = function(obj,duration){
    var css = duration +'s';
    obj.css({"-webkit-transition-delay" : css, "transition-delay" : css});
  }

  /* ************************************************************
      favorite ease
  ************************************************************ */
  /* ************************************************************
      Math
  ************************************************************ */
  Util.Math = {};
  Util.Math.getRandom = function(max,min){
    return Math.floor(Math.random() * (max - min)) + min;
  }

  Util.Math.getToRadian = function(degree){
    return Math.PI * degree / 180;
  }

  Util.Math.getToDegree = function(radian){
    return radian * 180 / Math.PI;
  }


  Util.Array = {};
  Util.Array.shuffle = function(array){
    var n = array.length, t, i;
    while (n) {
      i = Math.floor(Math.random() * n--);
      t = array[n];
      array[n] = array[i];
      array[i] = t;
    }
    return array;
  }

  /* ************************************************************
      Touch
      require : jQuery
  ************************************************************ */
  Util.Touch = {};
  Util.Touch.getTouchEvent = function(target,config){
    var touchMoveOffset = 0,
        touchStartPos = {},
        touchMovePos = {};
    var infos = {
      start:{x:0,y:0},
      move:{x:0,y:0},
      end:{x:0,y:0},
      distance:{x:0,y:0},
      distanceOffset : function(){
        return {x:Math.abs(this.distance.x),y:Math.abs(this.distance.y)};
      }
    }

    var _config = {
      onStart : function(e){},
      onMove : function(e){},
      onEnd : function(e){},
    };

    $.extend(_config,config);
    
    $(target).bind("touchstart", function(e){
      infos.start = getPageInfo(e);
      infos.move      = {x:0,y:0};
      infos.end       = {x:0,y:0};
      infos.distance  = {x:0,y:0};
      _config.onStart(infos);
    });

    $(target).bind("touchmove", function(e){
      e.preventDefault();
      infos.move = getPageInfo(e);
      infos.distance.x = infos.start.x - infos.move.x;
      infos.distance.y = infos.start.y - infos.move.y;
      _config.onMove(infos);
    });

    $(target).bind("touchend", function(e){
      infos.end = infos.move;
      _config.onEnd(infos);
    });
  }

  function getPageInfo(e){
    var info = {x:0, y:0}; 
    if("ontouchstart" in window) {
      var touch;
      if (e.touches != null) {
          touch = e.touches[0];
      } else {
          touch = e.originalEvent.touches[0];
      }
      info.x = touch.clientX;
      info.y = touch.clientY;
    } else {
      info.x = e.clientX;
      info.y = e.clientY;
    }
    return info;
  }


  /* ************************************************************
      get Window Size
  ************************************************************ */
  Heo.Util.windowSize = function(){
    var size = { width:0,height:0};
    if (document.documentElement.clientHeight) {
        size.width = document.documentElement.clientWidth;
        size.height = document.documentElement.clientHeight;
    } else if (document.body.clientHeight) {
        size.width = document.body.clientWidth;
        size.height = document.body.clientHeight;
    } else if (stage.height) {
        size.width = stage.width;
        size.height = stage.height;
    }

    size.halfX = size.width * 0.5;
    size.halfY = size.height * 0.5;
    return size;
  }
  /* ************************************************************
      change scope
  ************************************************************ */
  Heo.Util.changeScope = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  module.exports = Heo;

}).call(this);

// HEO_Util = function(){
//     this.init = function(){}

//     /* ***************************************************************************************
//         set transition
//     *************************************************************************************** */

//     this.setTransition = function(obj,duration,easing){
//         var css = duration +'s '+easing;
//         obj.css({"-webkit-transition" : css, "transition" : css});
//     }

//     this.setTransitionDuration = function(obj,duration){
//         var css = duration +'s';
//         obj.css({"-webkit-transition-duration" : css, "transition-duration" : css});
//     }

//     /* ***************************************************************************************
//         get touch info
//     *************************************************************************************** */
//     this.touchHandler = function(target,callBack){
//         var touchMoveOffset = 0,
//             touchStartPos = {},
//             touchMovePos = {};

//         // console.log(target);
//         $(target).bind("touchstart", function(e){
//             touchMoveOffset = 0;
//             touchStartPos = getTouchInfo(e);
//             touchMovePos  = getTouchInfo(e);
//         });

//         $(target).bind("touchmove", function(e){
//             e.preventDefault();
//             touchMovePos = getTouchInfo(e);w
//             var movedY = touchStartPos.y - touchMovePos.y,
//                 movedX = touchStartPos.x - touchMovePos.x;
//             touchMoveOffset = Math.abs(movedX) < Math.abs(movedY)?0:movedX;
//         });
//         $(target).bind("touchend", function(e){
//             callBack(touchMoveOffset);
//         });
//     }

//      ***************************************************************************************
//         get window size
//     *************************************************************************************** 
//     this.windowSize = function(){
//         var size = { width:0,height:0};
//         if (document.documentElement.clientHeight) {
//             size.width = document.documentElement.clientWidth;
//             size.height = document.documentElement.clientHeight;
//         } else if (document.body.clientHeight) {
//             size.width = document.body.clientWidth;
//             size.height = document.body.clientHeight;
//         } else if (stage.height) {
//             size.width = stage.width;
//             size.height = stage.height;
//         }

//         size.halfX = size.width * 0.5;
//         size.halfY = size.height * 0.5;
//         return size;
//     }
//     this.init();

//     /* ************************************************************
      
//     ************************************************************ */
//     this.Renderer = function{
//         renderID : null,
//         list : {},

//         addList : function(name,fn){
//             this.list[name] = {update:fn,freeze:false};
//             return this.list[name];
//         },
//         start : function(){
//             var _this = this;
//             this.render = _bind(this.render,this)
//             this.renderID = requestAnimationFrame(this.render);
//         },

//         stop    : function(){},
//         render  : function(){
//             for(var o in this.list){
//                 if(!this.list[o].freeze)this.list[o].update();
//             }
//             this.renderID = requestAnimationFrame(this.render);
//         }
//     }

//     /* ************************************************************
      
//     ************************************************************ */
  
  
// }
// HEO_Util.prototype.constructor = HEO_Util;
// this.HEO_Util = HEO_Util;
},{}]},{},[1]);
