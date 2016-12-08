$(function(){
	
	/*界面设计*/
	var startPage=$("#start");
	var playPage=$("#bg");
	var start=$(".sBtn");
	var about=$(".guanyu");
	var about1=$(".about");
	var back=$(".tuichu");
	var level1=$(".level1");  //模式一按钮
	var level2=$(".level2");  //模式儿 按钮
	var way1=$(".way1");  //人对战机
	var way2=$(".way2");  //人人对战
	var fh=$(".fh");  //主菜单
	var undo=$(".undo");  //悔棋
	var last =[]; //最后一枚棋子
	var qipan=$(".box1");  //棋盘
	
	/*对战模式变量*/
	var flag=1;  //1:人人对战  2：人机对战 
	var gameState='pause';
	var kongbai={};
	
	start.on('click',function(e){
		startPage.addClass("active1");
		playPage.addClass("active2");
	})
	about.on('click',function(e){
		about1.addClass("aboutShow");
	})
	about1.on('click',function(e){
		about1.addClass("aboutHide");
		return false;
	})
	back.on('click',function(e){
		close();
	})
	/*游戏失败弹出框*/
	var success=$(".success");
	function tk1(name){
		success.addClass("show2");
		success.html(name+'五子连珠');
	}
	success.on('click',function(e){
		$(this).removeClass("show2");
		qipan.addClass("qipanNo");
	})
	
	/*人人对战*/
	way2.on('click',function(e){
		qipan.addClass("qipan");
		if(gameState==='play'){
			return;
		}
		flag=1;
	})
	/*人机对战*/
	way1.on('click',function(e){
		qipan.addClass("qipan");
		if(gameState==='play'){
			return;
		}
		flag=2;
	})
	
	/*返回主菜单*/
	fh.on('click',function(e){
		playPage.addClass("active2No");
		startPage.addClass("active1No")
		location.reload();
	})
	/*界面设计*/
	
	
	var canvas=$("#canvas").get(0);
	var ctx=canvas.getContext('2d');
	
	var canvas1=$("#canvas1").get(0);
	var ctx1=canvas1.getContext('2d');
	
	var canvas2=$("#canvas2").get(0);
	var ctx2=canvas2.getContext('2d');
	
	var audio=$("#audio").get(0);
	var sep=40;  //一颗棋子的宽度
	var sR=4;  //小圆点的半径
	var bR=20;//棋子半径
	var qizi={};//记录棋子位置及状态
	var kaiguan=true;  //判断棋子的颜色
	
	var l=0;
	var r=0;
	

	/*计时器*/
	function mz1(){
		ctx1.clearRect(0,0,80,80);
		ctx1.save();
		ctx1.translate(40,40);
		ctx1.beginPath();
		ctx1.arc(0,0,10,0,Math.PI*2);
		ctx1.closePath();
		ctx1.strokeStyle="#656887";
		ctx1.stroke();
		ctx1.restore();
		
		ctx1.save();
		ctx1.translate(40,40);
		ctx1.rotate(Math.PI/180 * 6*l);
		ctx1.beginPath();
		ctx1.strokeStyle="#494B59";
		ctx1.moveTo(0,10);
		ctx1.lineTo(0,25);
		
		ctx1.moveTo(0,-10);
		ctx1.lineTo(0,-55);
		ctx1.closePath();
		ctx1.stroke();
		ctx1.restore();
		l+=1;
		if(l>=360){
			l=0;
		}
	}
	function mz2(){
		ctx2.clearRect(0,0,80,80);
		ctx2.save();
		ctx2.translate(40,40);
		ctx2.beginPath();
		ctx2.arc(0,0,10,0,Math.PI*2);
		ctx2.closePath();
		ctx2.strokeStyle="#656887";
		ctx2.stroke();
		ctx2.restore();
		
		ctx2.save();
		ctx2.translate(40,40);
		ctx2.rotate(Math.PI/180 * 6*r);
		ctx2.beginPath();
		ctx2.strokeStyle="#494B59";
		ctx2.moveTo(0,10);
		ctx2.lineTo(0,30);
		
		ctx2.moveTo(0,-10);
		ctx2.lineTo(0,-55);
		ctx2.closePath();
		ctx2.stroke();
		ctx2.restore();
		r+=1;
		if(r>=360){
			r=0;
		}
	}
	mz1();
	mz2();
	var t1=setInterval(mz1,1000);
	var t2;
	
	/*棋谱*/
	var chessMaunal=function () {
		var i=0;
		ctx.save();
		ctx.fillStyle='red';
		ctx.font='18px/1 "微软雅黑"';
		ctx.textBaseline='middle';
		ctx.textAlign='center';
		for(var k in qizi){
			var arr=k.split('_');
			ctx.fillText(i++,hy(parseInt(arr[0])),hy(parseInt(arr[1])));
		}
		ctx.restore();
		$(".imgBox").show().width(600).height(600);
		if($(".imgBox").find(".img").length!=0){
			$(".imgBox").find(".img").attr('src',canvas.toDataURL() ).appendTo('.imgBox');
			$(".imgBox").find(".img").attr('href',canvas.toDataURL() )
			.attr('download','qipu.png').appendTo('.imgBox');
		}else{
			$('<img class="img">').attr('src',canvas.toDataURL() ).appendTo('.imgBox');
			$('<a class="load">↓</a>').attr('href',canvas.toDataURL() )
			.attr('download','qipu.png').appendTo('.imgBox');
		}
		
	}
	/*棋谱*/
	
	/*获取/取消棋谱*/
	var hq=$(".hq"); 
	var del_qp=$(".del");
	hq.on('click',function(e){
		chessMaunal();
	})
	del_qp.on('click',function(e){
		$(".imgBox").hide().width(0).height(0);
		ctx.clearRect(0,0,600,600);
		kaiguan=true;
		drawQipan();
		ctx.save();
		var i=0;
		for(var k in qizi){
			var arr=k.split('_');
			if(kaiguan){
				luozi(parseInt(arr[0]),parseInt(arr[1]),'black');
				kaiguan=false;
			}else{
				luozi(parseInt(arr[0]),parseInt(arr[1]),'white');
				kaiguan=true;
			}
		}
		ctx.restore();
		return false;
	})
	
	/*获取/取消棋谱*/
	
	/*判断输赢*/
	function lianjie(a,b){
		return a+'_'+b;
	}
	function panduan(x,y,val,person){
		var hx=1;
		var zx=1;
		var zxx=1;
		var fxx=1;
		i=1; while(qizi[lianjie(x+i,y)]===val){hx++; i++;}
		i=1; while(qizi[lianjie(x-i,y)]===val){hx++; i++;}
		i=1; while(qizi[lianjie(x,y+i)]===val){zx++; i++;}
		i=1; while(qizi[lianjie(x,y-i)]===val){zx++; i++;}
		i=1; while(qizi[lianjie(x+i,y+i)]===val){zxx++; i++;}
		i=1; while(qizi[lianjie(x-i,y-i)]===val){zx++; i++;}
		i=1; while(qizi[lianjie(x+i,y-i)]===val){fxx++; i++;}
		i=1; while(qizi[lianjie(x-i,y+i)]===val){fxx++; i++;}
		return Math.max(hx,zx,zxx,fxx);
	}
	
	/*画圆的函数*/
	function circle(x,y,r){
		ctx.save();
		ctx.beginPath();
		ctx.arc(hy(x),hy(y),r,0,Math.PI*2);
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	}
	
	/*还原真实坐标*/
	function hy(r){
		return (r+0.5)*sep+0.5;
	}
	
	/*画棋盘*/
	function drawQipan(){
		ctx.save();
		ctx.beginPath();
		for(var i=0;i<15;i++){
			ctx.moveTo(hy(i),hy(0));
			ctx.lineTo(hy(i),hy(14));
			
			ctx.moveTo(hy(0),hy(i));
			ctx.lineTo(hy(14),hy(i));
		}
		ctx.closePath();
		ctx.stroke();
		ctx.restore();
		
		circle(3,3,sR);
		circle(11,3,sR);
		circle(7,7,sR);
		circle(3,11,sR);
		circle(11,11,sR);
		for(var i=0;i<15;i++){
			for(var j=0;j<15;j++){
				kongbai[lianjie(i,j)]=true;
			}
		}
//		gameState='play';
	}
	drawQipan();
	
	/*让棋盘可以落子*/
	function luozi(x,y,color){
		delete kongbai[lianjie(x,y)];
		ctx.save();
		ctx.beginPath();
		ctx.translate(hy(x),hy(y));
		ctx.arc(0,0,bR,0,Math.PI*2);
		if(color==="black"){
			var g1=ctx.createRadialGradient(1,3,0,0,0,40);
			g1.addColorStop(0.1,'#eee');
			g1.addColorStop(0.5,'rgb(0,0,0)');
			g1.addColorStop(1,'rgb(0,0,0)');
			ctx.fillStyle=g1;
		}
		else{
			var g2=ctx.createRadialGradient(1,3,0,0,0,40);
			g2.addColorStop(0.1,'#fff');
			g2.addColorStop(0.5,'#ddd');
			g2.addColorStop(1,'#ddd');
			ctx.fillStyle=g2;
		}
		ctx.closePath();
		ctx.fill();
		ctx.restore();
		qizi[lianjie(x,y)]=color;
		last[0] = lianjie(x,y)
		gameState='play';
	}
	/*对战模式*/
	function intel(){
		var pos1={};
		var pos2={};
		var max1=0;
		var max2=0;
		for(var k in kongbai){
			if(kongbai[k]){
				var x=parseInt(k.split('_')[0]);
				var y=parseInt(k.split('_')[1]);
				if(panduan(x,y,'black','黑棋')>max1){
					max1=panduan(x,y,'black','黑棋');
					pos1={x:x,y:y};
				}
				if(panduan(x,y,'white','白棋')>max2){
					max2=panduan(x,y,'white','白棋');
					pos2={x:x,y:y};
				}
			}
		}
		if(max2>max1){
			return pos2;
		}else{
			return pos1;
		}
	}
	
	/*play*/
	function play(e){
		if(flag===1){
			ex=Math.floor(e.offsetX/sep);
			ey=Math.floor(e.offsetY/sep);
			audio.play();
			if(qizi[lianjie(ex,ey)]) {return;}
			if(kaiguan){
				luozi(ex,ey,'black');
				if(panduan(ex,ey,'black','黑棋')>=5){
					audio.pause();
					tk1('黑棋');
				}
				l=0;
				r=0;
				mz1();
				clearInterval(t1);
				t2=setInterval(mz2,1000);
			}else{
				luozi(ex,ey,'white');
				if(panduan(ex,ey,'white','白棋')>=5){
					audio.pause();
					tk1('白棋');
				}
				l=0;
				r=0;
				mz2();
				clearInterval(t2);
				t1=setInterval(mz1,1000);
			}
			kaiguan=!kaiguan;
			return false;
		}else if(flag===2){
			ex=Math.floor(e.offsetX/sep);
			ey=Math.floor(e.offsetY/sep);
			audio.play();
			if(qizi[lianjie(ex,ey)]) {return;}
			luozi(ex,ey,'black');
			if(panduan(ex,ey,'black','黑棋')>=5){
				audio.pause();
				tk1('黑棋');
			}
			l=0;
			r=0;
			mz1();
			clearInterval(t1);
			t2=setInterval(mz2,1000);
			
			var ex1=intel().x;
			var ey1=intel().y;
			luozi(ex1,ey1,'white');
			if(panduan(ex1,ey1,'white','白棋')>=5){
				audio.pause();
				tk1('白棋');
			}
			l=0;
			r=0;
			mz2();
			clearInterval(t2);
			t1=setInterval(mz1,1000);
			return false;
		}
	}
	/*play*/
	$(canvas).on('click',play);
	/*再来一局*/
	function zlyj(){
		ctx.clearRect(0,0,600,600);
		drawQipan();
		qipan.addClass("qipan");
		qizi={};
		$(canvas).on('click',play);
		return false;
	}
	/*再来一局*/	
	
	/*悔棋*/
	function Undo() {
		if(flag === 1){
			ctx.clearRect(0,0,600,600);
			for(var i in qizi){
				if(i == last[0]){
					delete qizi[i];
					kongbai[i] = true;
				}
			}
			drawQipan();
			for(var j in qizi){
				var a1 = parseInt(j.split("_")[0]);
				var a2 = parseInt(j.split("_")[1]);	
				luozi(a1,a2,qizi[j]);
			}
		}	
	}
	undo.on('click',Undo);
	/*悔棋*/
	
})
