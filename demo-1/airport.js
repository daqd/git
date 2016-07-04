/**
 * 机场列表插件，可正常机场列表
 * @author 米梦宇
 * @editor 2016-04-20
 */


	/**
	* 默认配置参数
	*/
	var AirportListConfig = {
			airListUrl:getRootPath() + '/book/queryAirport.json', //获取机场列表的URL
			airportListWrap:'airportListWrap', //完整城市列表容器
			Airlistele:'airportListContent', //机场列表生成并显示的容器节点
			localStroageName:'', //本地存储的key
			hideEle:'',//触发城市列表，要隐藏的主容器节点
			searchInputEle:'searchCityInput', //触发搜索的节点
			searchRes:'airportListRes',//搜索结果放置的容器
			showEle:'',
			showWrap:'',//选择完城市要显示的节点
			AirportshowEle:'',//选择完城市后将选择的城市放置的节点
			isNeedHideCityHeader:false,//是否需要隐藏默认的Header
			saveAirlistItemEle:'',//要存储三字码的节点  #id
			byOrgCode:'',//去程的城市三字码
		    airHotCityUrl:getRootPath() + '/book/queryHotAirport.json', //热门城市的URL
		    airhotCityWrap:'airportHotCity',/* 热门城市主容器*/
		    fastSearchwrap:'aside_nav_A-Z',
			airportHistoryWrap:'airportHistoryCity',/* 历史城市主容器*/
			clearOrgCity:false, //是否需要清除到达城市信息
			isSpecialPriceList:false //是否特价专区页调用参数
			//新加入一条的记录
			//第三次提交
	};

	//机场列表主方法

	
	function AirportList(configs){
		this._initAir(configs);
	}

	AirportList.prototype={

		/**
		*初始化机场列表方法
		*
		*/
		_initAir:function(configs){
			//初始化
			this._initSettings(configs);

			//获取数据,解析存储为对象
			var getObj = this._queryData();

			/* 获取热门城市数据对象 */
			var hotObj = this._queryHotCityData();

			//解析JSON并拼接HTML
			this._SaveDataToObj(getObj,hotObj);

			//执行搜索
			this._SeachCity(getObj);
			
			//事件绑定
			this._BindClick();
		},
		
		/**
         * 初始化设置
         * @private
         */
        _initSettings: function(configs) {
            this.settings = $.extend({}, AirportListConfig, configs);
        },
        
        
        /**
        * 拿到JSON并解析
        * @private
        */
        _queryData: function(){
        	//定义存储对象
        	var letterObj = {
        			"A":[],
        			"B":[],
        			"C":[],
        			"D":[],
        			"E":[],
        			"F":[],
        			"G":[],
        			"H":[],
        			"I":[],
        			"J":[],
        			"K":[],
        			"L":[],
        			"M":[],
        			"N":[],
        			"O":[],
        			"P":[],
        			"Q":[],
        			"R":[],
        			"S":[],
        			"T":[],
        			"U":[],
        			"V":[],
        			"W":[],
        			"X":[],
        			"Y":[],
        			"Z":[]
        	};
                $.ajax({                    
                         url:this.settings.airListUrl,
                         data:{cityCode:this.settings.byOrgCode},  
                         type:'post',  
                         async:false,  
                         dataType:'json',  
                         success:function(getdata) {
                        	 AirData = getdata.airports;
                        	 //console.log(AirData);
                        	 for(var each in letterObj){
                        		 for(var i=0;i<AirData.length;i++){
                        			 if(AirData[i].pinyinHead.charAt(0).toUpperCase()==each){
                        				 letterObj[each].push(AirData[i]);
                        			 }
                        		 }
                              }
                        	
                         },
                         error:function() {
                        	
                         }
                });
             return letterObj;
        },

		/* 获取热门城市的json  */
		_queryHotCityData: function () {
			var cityObj = {
				"A":[],
				"B":[],
				"C":[],
				"D":[],
				"E":[],
				"F":[],
				"G":[],
				"H":[],
				"I":[],
				"J":[],
				"K":[],
				"L":[],
				"M":[],
				"N":[],
				"O":[],
				"P":[],
				"Q":[],
				"R":[],
				"S":[],
				"T":[],
				"U":[],
				"V":[],
				"W":[],
				"X":[],
				"Y":[],
				"Z":[]
			};
			$.ajax({
				url:this.settings.airHotCityUrl,
				data:{cityCode:this.settings.byOrgCode},
				type:'post',
				async:false,
				dataType:'json',
				success:function(getdata) {
					hotData = getdata.airports;
					//console.log(hotData);
					for(var each in cityObj){
						for(var i=0; i<hotData.length; i++){
							if(hotData[i].pinyinHead.charAt(0).toUpperCase() == each){
								cityObj[each].push(hotData[i]);
							}
						}
					}
					//console.log(cityObj);
				},
				error:function(){

				}
			});
			return cityObj;
		},
        /**
         * 解析存储对象，并拼接HTML
         * @private
         */
        _SaveDataToObj: function(obj,hotObj){
        	var _InputEle = this.settings.showEle;
        	var _hideEle = this.settings.hideEle;
        	var _ShowAirWrap = this.settings.showWrap;

        	//隐藏主页面
        	$("."+_ShowAirWrap).hide();
        	$("."+_hideEle).show();
        	//是否需要隐藏默认的Header
        	if(this.settings.isNeedHideCityHeader){
            	$(".CommonHeader").hide();
            	$(".fillingWrap").hide();
            }
        	$(".airportListWrap").empty();
         	if(this.settings.isNeedHideCityHeader){
         		var headerHtml = '<div class="header cityList-header"><div class="back" onclick="showDeaultHeader();showHideNode(\''+_ShowAirWrap+'\',\''+_hideEle+'\')"></div>城市搜索</div><div class="fillingWrap"></div><div class="Common-CitySearch-Wrap"><div class="Common-Item-Wrap Common-FrontSize-M SearchCityInput"><input class="Common-FrontSize-M" id="searchCityInput" type="text" placeholder="北京/beijing/bj/NAY"><div class="searchIcon"></div><div class="clearCityInput">X</div></div></div>  <div class="airportHistoryCity"></div>  <div class="airportHotCity"></div>  <div class="airportListContent"></div><div class="airportListRes"></div>';
        	}else{
        		var headerHtml = '<div class="header cityList-header"><div class="back" onclick="showHideNode(\''+_ShowAirWrap+'\',\''+_hideEle+'\')"></div>城市搜索</div><div class="fillingWrap"></div><div class="Common-CitySearch-Wrap"><div class="Common-Item-Wrap Common-FrontSize-M SearchCityInput"><input class="Common-FrontSize-M" id="searchCityInput" type="text" placeholder="北京/beijing/bj/NAY"><div class="searchIcon"></div><div class="clearCityInput">X</div></div></div>  <div class="airportHistoryCity"></div>  <div class="airportHotCity"></div>  <div class="airportListContent"></div><div class="airportListRes"></div>';
        	}

			headerHtml += '<div class="aside_nav_A-Z"></div>';//添加快速搜索主容器
        	$(".airportListWrap").append(headerHtml);

			//$('.airportListContent a[data-achor-search]').css('top',-$('.cityList-header').height()+'px');
			//创建快速搜索元素列表
			var fastSearchList = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];//字母写死A-Z
			var fastSearchEleHtml = '';
			for(var f=0;f<fastSearchList.length;f++){
				 fastSearchEleHtml +='<a href="#search'+fastSearchList[f]+'" class="fastSearch-items">'+fastSearchList[f]+'</a>'
			}
			$('.'+this.settings.fastSearchwrap).append(fastSearchEleHtml);

			if(!this.settings.byOrgCode){
				//创建历史城市
				citySearchExtend.supportLocalStg() && this._concatHistoryCity();

				//创建热门城市html片段
				var hotHtml = '';
				for(var key in hotObj){
					if(hotObj[key].length>0){//
						if(hotObj[key].length<16){
							for(var h=0; h<hotObj[key].length; h++){
								hotHtml += '<span class="hotCity-items airportItem" data-airportName="'+hotObj[key][h]['airportName']+'" data-cityCode="'+hotObj[key][h]['cityCode']+'" data-cityId="'+hotObj[key][h]['cityId']+'" data-code="'+hotObj[key][h]['code']+'" data-id="'+hotObj[key][h]['id']+'" data-pinyin="'+hotObj[key][h]['pinyin']+'" data-pinyinHead="'+hotObj[key][h]['pinyinHead']+'"> '+hotObj[key][h]['airportName']+'</span>';
							}
						}else{
							for(var h=0; h<16; h++){//限制显示 4行 4列 写死限制
								hotHtml += '<span class="hotCity-items airportItem" data-airportName="'+hotObj[key][h]['airportName']+'" data-cityCode="'+hotObj[key][h]['cityCode']+'" data-cityId="'+hotObj[key][h]['cityId']+'" data-code="'+hotObj[key][h]['code']+'" data-id="'+hotObj[key][h]['id']+'" data-pinyin="'+hotObj[key][h]['pinyin']+'" data-pinyinHead="'+hotObj[key][h]['pinyinHead']+'"> '+hotObj[key][h]['airportName']+'</span>';
							}
						}
					}
				}
				$("."+this.settings.airhotCityWrap).append('<div class="airportTit Common-Item-Wrap Common-MaxWidth Common-FrontSize-S common-Gray-Background"><div class="Common-Item-Wrap">热门城市</div></div><div class="hotCity-warp">'+hotHtml+'</div>');//添加DOM元素
			}


        	var html = '';
         	//console.log(obj);
        	for(var item in obj){
        	 	//当前首字母下没有机场列表，则不显示，首字符标题
        		//console.log(obj[item].length);
        		if(obj[item].length>0){
            		html+='<div class="airportTit Common-Item-Wrap Common-MaxWidth Common-FrontSize-S common-Gray-Background"> <a class="target-fix" id="search'+item+'" name="search'+item+'"></a> <div class="Common-Item-Wrap">'+item+'</div></div>';
        		}
        		for(var m=0;m<obj[item].length;m++){
        			if(m == obj[item].length){
              			html+='<div class="Common-Item-Wrap viewport-airportItem Common-FrontSize-M airportItem" data-airportName="'+obj[item][m]['airportName']+'" data-cityCode="'+obj[item][m]['cityCode']+'" data-cityCode="'+obj[item][m]['cityCode']+'" data-cityId="'+obj[item][m]['cityId']+'" data-code="'+obj[item][m]['code']+'" data-id="'+obj[item][m]['id']+'" data-pinyin="'+obj[item][m]['pinyin']+'" data-pinyinHead="'+obj[item][m]['pinyinHead']+'"> '+obj[item][m]['airportName']+'</div>';
        			}else{
             			html+='<div class="Common-Item-Wrap viewport-airportItem border-Dashed-BottomBorder Common-FrontSize-M airportItem" data-airportName="'+obj[item][m]['airportName']+'" data-cityCode="'+obj[item][m]['cityCode']+'" data-cityCode="'+obj[item][m]['cityCode']+'" data-cityId="'+obj[item][m]['cityId']+'" data-code="'+obj[item][m]['code']+'" data-id="'+obj[item][m]['id']+'" data-pinyin="'+obj[item][m]['pinyin']+'" data-pinyinHead="'+obj[item][m]['pinyinHead']+'"> '+obj[item][m]['airportName']+'</div>';
        			}
        			//console.log(obj[item][m]['airportName']);
        		}
        		//console.log(obj[item]);
        	}
        	$("."+this.settings.Airlistele).append(html);
        },
		/**
		 * 设置本地存储，并做数据处理
		 * @private
		 */
    	_setlocalStorage: function (strEle) {
			/*if(window['localStorage'].historyCityStr !== undefined && window['localStorage'].historyCityStr != ''){
				//document.write('进入本地存储函数2');
				if( window['localStorage'].historyCityStr[window['localStorage'].historyCityStr.length-1] ==','){
					window['localStorage'].historyCityStr += (strEle+',');
					//document.write('进入本地存储函数4');
				}else{
					//document.write('进入本地存储函数5');
					localStorage.historyCityStr += (','+strEle+',');
					//document.write('进入本地存储函数6');
				}
			}else{
				//document.write('进入本地存储函数7');
				localStorage.historyCityStr = strEle+',';
				//document.write('进入本地存储函数8');
			}*/
			try{
				//localStorage.setItem(historyCityStr,strEle);
				if(window['localStorage'].historyCityStr !== undefined && window['localStorage'].historyCityStr != ''){
					if( window['localStorage'].historyCityStr[window['localStorage'].historyCityStr.length-1] ==','){
						window['localStorage'].historyCityStr += (strEle+',');
					}else{
						localStorage.historyCityStr += (','+strEle+',');
					}
				}else{
					localStorage.historyCityStr = strEle+',';
				}
			}catch(oException){
				if(oException.name == 'QuotaExceededError'){
					//console.log('超出本地存储限额！');
					return false;
				}
			}

			/*if(window['localStorage'].historyCityStr == undefined){
				window['localStorage'].historyCityStr = '';
			}
			//var historyCityStr = window.localStorage.historyCityStr;
			if(window['localStorage'].historyCityStr[window.localStorage.historyCityStr.length-1] ==','){
				document.write('进入本地存储函数4');
				window.localStorage.historyCityStr += (strEle+',');
			}else{
				window.localStorage.historyCityStr += (','+strEle+',');
			}*/
			//var arr = window.localStorage.historyCityStr.split(',');
			var arr = window['localStorage'].historyCityStr.split(',');
			var result = [];
			//console.log(window.localStorage.historyCityStr);
			if(arr[0] == ''){
				arr.splice(0,1);
			}
			for(var i = 0; i<arr.length-1; i++) {
				if(result.indexOf(arr[i]) == -1){
					result.push(arr[i]);
				}
			}
			//console.log(result);
			window['localStorage'].historyCityStr = result.length < 4 ? result.join(',') : result.splice(-4).join(',');
		},
		/**
		 * 拼接历史城市HTML，添加元素
		 * @private
		 */
		_concatHistoryCity: function () {
			if(window.localStorage.historyCityStr!=undefined && window.localStorage.historyCityStr!=''){
				$('.'+this.settings.airportHistoryWrap).append('<div class="airportTit Common-Item-Wrap Common-MaxWidth Common-FrontSize-S common-Gray-Background"><div class="Common-Item-Wrap">历史城市</div></div><div class="historyCity-warp">'+window.localStorage.historyCityStr.replace(/,/g,'')+'</div>');
			}
		},
         /**
          * 执行搜索
          * @private
          */
    	_SeachCity: function(data){
        	var _InputEle = this.settings.searchInputEle,
        	_ListWrapEle = this.settings.Airlistele,
        	_airportListRes = this.settings.searchRes,
			_airHotCityEle = this.settings.airhotCityWrap,
			_fastSearchWrap = this.settings.fastSearchwrap,
			_historyCityWarp = this.settings.airportHistoryWrap,
        	SavaResArray = Array();
        	var byOrgCode = this.settings.byOrgCode;
        	$("#"+this.settings.searchInputEle).bind('input propertychange', function() {
        		var getInputMes = citySearchExtend.getInputVal(_InputEle);
            	//判断是否输入值
            	if(getInputMes[0].length==0){
            		$("."+_ListWrapEle).show();
					$('.'+_fastSearchWrap).show();/* 显示快速搜索 */
					//if(this.settings.byOrgCode != '' || this.settings.byOrgCode == undefined) {
					if(!byOrgCode) {
						$('.' + _airHotCityEle).show();/* 显示热门城市 */
						$('.' + _historyCityWarp).show();/* 显示历史城市 */
					}
					$("."+_airportListRes).empty();
            		SavaResArray = [];
            		//console.log(_airportListRes);
				}
            	 
            	 //判断是否输入正确的类型
            	 if(getInputMes[1].length==0){
            		// alert("请输入正确的搜索类型！");
            	 }

            	//按照中文搜索
            	 if(getInputMes[1]=='ChineseCharacter'){
              		 SavaResArray = [];
              		 $("."+_airportListRes).empty();
            		 var findEles = $("."+_ListWrapEle).find(".airportItem");
            		 //console.log(getInputMes[0]);
            		 for(var i=0;i<findEles.length;i++){
            			 if(findEles[i].innerText.replace(/\s/g,"").indexOf(getInputMes[0])!=-1){
            				 SavaResArray.push(findEles[i]);
            			 }
            		 }
            		 //console.log(SavaResArray);
            		 var htmls = '';
            		 for(var m=0;m<SavaResArray.length;m++){
            			 htmls+= SavaResArray[m].outerHTML;
            		 }
            		 
            		 if(!SavaResArray.length==0){
                		 $("."+_ListWrapEle).hide();
						 $('.'+_fastSearchWrap).hide();/* 隐藏快速搜索 */
						 if(!byOrgCode) {
							 $('.' + _airHotCityEle).hide();/* 隐藏热门城市 */
							 $('.' + _historyCityWarp).hide();/* 隐藏历史城市 */
						 }
						 $("."+_airportListRes).empty();
                		 $("."+_airportListRes).append(htmls); 
            		 }
                 //按照三字码或拼音
            	 }else if(getInputMes[1]=='letter'&&getInputMes[0].length!=0){
            		 //alert("xxx");
					 SavaResArray = [];
					 $("."+_airportListRes).empty();
					 findEles = $("."+_ListWrapEle).find(".airportItem");
					 for(var i = 0;i<findEles.length;i++){
						 var code = $(findEles[i]).attr("data-code");
						 var pinyin = $(findEles[i]).attr("data-pinyin");
						 var pinyinhead = $(findEles[i]).attr("data-pinyinhead");
						 if(code.toLowerCase().indexOf(getInputMes[0].toLowerCase())!=-1 ||
							 pinyin.indexOf(getInputMes[0])!=-1 ||
							 pinyinhead.indexOf(getInputMes[0])!=-1)
						 {
							 SavaResArray.push(findEles[i]);
						 }
					 }
					 //console.log(SavaResArray);
					 var htmls = '';
					 for(var m=0;m<SavaResArray.length;m++){
						 htmls+= SavaResArray[m].outerHTML;
					 }
					 //console.log(SavaResArray);
					 if(!SavaResArray.length == 0){
						 $("."+_ListWrapEle).hide();
						 $('.'+_fastSearchWrap).hide();/* 隐藏快速搜索 */
						 if(!byOrgCode){
							 $('.'+_airHotCityEle).hide();/* 隐藏热门城市 */
							 $('.'+_historyCityWarp).hide();/* 隐藏历史城市 */
						 }
						 $("."+_airportListRes).empty();
						 $("."+_airportListRes).append(htmls);
					 }
				 }else{
            		 
            	 }
            	//alert(getInputMes);  
        	 }); 
            	
        	
         },
         
         /**
		 * 事件绑定
		 *
		 */
         _BindClick: function(){
        	 var _ListWrapEle ='.'+this.settings.Airlistele,
        	 _SaveCityCode='#'+this.settings.saveAirlistItemEle,
        	 _ShowSelectedEle ='#'+this.settings.AirportshowEle,
        	 _ShowWrap ='.'+this.settings.showWrap,
        	 _airportListRes = '.'+this.settings.searchRes,
        	 _isNeedHideCityHeader = '.'+this.settings.isNeedHideCityHeader,
			 _hotCityWrap = '.'+this.settings.airhotCityWrap,
			 _fastSearchWarp = '.'+this.settings.fastSearchwrap,
			 _historyCityWarp = '.'+this.settings.airportHistoryWrap,
			 _searchInputEle = '#'+this.settings.searchInputEle,//触发搜索的元素
			 _isSpecialPriceList= this.settings.isSpecialPriceList,
        	 _tripType = this.settings.clearOrgCity;
        	 var self = this;
        	 $(''+_ListWrapEle+','+_airportListRes+','+_hotCityWrap+','+_historyCityWarp).on("click",".airportItem",function(){
				 //存储选择的城市列表数据
        		 $(_ShowSelectedEle).text($(this).attr("data-airportname"));
        		 $(_SaveCityCode).val($(this).attr("data-code"));
        		 //长字节机场名称单独处理
        		 if($(this).attr("data-airportname").length>5){
        			 $(_ShowSelectedEle).attr('style','font-size:0.18rem;');
        		 }else{
        			 $(_ShowSelectedEle).removeAttr('style');
        		 }
				 if(citySearchExtend.supportLocalStg()){
					 self._setlocalStorage('<span class="historyCity-items airportItem" data-airportName="'+$(this).attr('data-airportName')+'" data-cityCode="'+$(this).attr('data-cityCode')+'" data-cityId="'+$(this).attr('data-cityId')+'" data-code="'+$(this).attr('data-code')+'" data-id="'+$(this).attr('data-id')+'" data-pinyin="'+$(this).attr('data-pinyin')+'" data-pinyinHead="'+$(this).attr('data-pinyinHead')+'"> '+$(this).attr('data-airportName')+'</span>');
				 }
				 //document.write('执行4');
        		 //隐藏节点，清空DOM,初始化数组
        		 $(".airportListWrap").empty();
        		 $(".airportListWrap").hide();
        		 $(_ShowWrap).show();
        		 
                 //是否需要显示默认的Header
                 if(_isNeedHideCityHeader){
                 	$(".CommonHeader").show();
                 	$(".fillingWrap").show();
                 }
                 //是否起始城市，是否需要将到达城市清除
                 if(_tripType){
                	 $('.ReachCityAirport').text("请选择到达城市");
					 $('.ReachCityAirport').attr('style','font-size:0.18rem;');
                	 $("#dstCity1").val("null");
                 }
                 //特价日历页执行的方法
                 if(_isSpecialPriceList){
                	  var paramString = $(this).attr("data-code")
                	
                	  $.ajax({
                          type: "POST",
                          datatype: "html",
                          url: getRootPath() + '/special/getSpecialProductLowestDon.html',
                          data: {
                              paramString: paramString
                          },
                          success: function (data) {
                              unloading();
                              //$("#status").html(data);
                              //$("#flight-infoContent-warp").hide();
                              $("#flight-infoContent-warp").html(data);
                          },
                          error: function () {
                          }
                      });
                 
                 
                 }
                 
        	 });
             //点击完，页面返回顶部
             document.getElementsByTagName('body')[0].scrollTop=0;
             
        	 //清除输入记录
        	 $(".clearCityInput").unbind('click')[CLICK](function(){
				 //console.log();
				 $(_searchInputEle).val('');
				 $(_airportListRes).empty();
				 $(_ListWrapEle).show();
				 $(_fastSearchWarp).show();
				 if(!self.settings.byOrgCode){
					 $(_hotCityWrap).show();
					 $(_historyCityWarp).show();
				 }
        	 });
        	 
         }
       }
	
    /**
     * 城市列表工具类
     * @type {{getInputVal: Function, clearInputVal: Function}}
     */
    ;var citySearchExtend = {

		    /**
		     * 判断要搜索的内容类型
		     * @return array
		     */
			getInputVal: function(inputEle){
				var strType = '',
				inputMes = [],
				_inputEleVal = $("#"+inputEle).val();
				inputMes.push(_inputEleVal);
				//判断是否为英文
				if(/^[a-zA-Z]*$/.test(_inputEleVal))
				{
					strType = 'letter';
				}
				else if(/^[\u4e00-\u9fa5]*$/.test(_inputEleVal))
				{
					strType = 'ChineseCharacter';
				}
				
				inputMes.push(strType);
				
				return inputMes;
			},
			
			//清楚输入的内容
			clearInputVal: function(){
				
			},
			//判断是否支持本地存储
			supportLocalStg: function(){
				return ('localStorage' in window) && window['localStorage'] != null;
			}

	};