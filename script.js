

onload = function(){

	var c = document.getElementById('canvas');
	c.width = 500;
	c.height = 300;


	var gl = c.getContext('webgl') || c.getContext('experimental-webgl');


	var v_shader = create_shader('vs');
	var f_shader = create_shader('fs');
	
	var prg = create_program(v_shader,f_shader);
	
	var attLocation=gl.getAttribLocation(prg,'position');
	var attLocation2=gl.getAttribLocation(prg,'color');
	var	attLocation3 = gl.getAttribLocation(prg, 'normal');
	var attStride=3;
	var attStride2=3;
	var	attStride3 = 4;
	// var vertex_position=[
		 // 0.0,  1.0,  0.0,
		 // 1.0,  0.0,  0.0,
		// -1.0,  0.0,  0.0,
		 // 0.0, -1.0,  0.0
	
	
	// ];

	
	// var vertex_color = [
    	// 1.0, 0.0, 0.0, 1.0,
    	// 0.0, 1.0, 0.0, 1.0,
    	// 0.0, 0.0, 1.0, 1.0,
		// 0.0, 0.0, 1.0, 1.0
	// ];

	// var index = [
		// 0, 1, 2,
		// 1, 2, 3
	// ];
	// var vbo = create_vbo(vertex_position);




	// var color_vbo=create_vbo(vertex_color);

	 let attLocations=[attLocation,attLocation2,attLocation3];
	 let attStrides=[attStride,attStride2,attStride3];

    // set_Attribute([vbo, color_vbo], attLocations, attStrides);
    // var ibo = create_ibo(index);
	
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);

	


	


			var annulus=torus(32, 32, 1.0, 2.0);
	
	
	var tposition = annulus[0];
var normal = annulus[1];
var tcolor = annulus[2];
var tindex = annulus[3];

	
	var annulusVbo = create_vbo(tposition);
	var annulusCVbo = create_vbo(tcolor);
	var annulusNVbo=create_vbo(normal);
	
	set_Attribute([annulusVbo,annulusNVbo, annulusCVbo], attLocations, attStrides);
	var annulusIbo = create_ibo(tindex);
	    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, annulusIbo); 

	uniLocation = gl.getUniformLocation(prg, 'mvpMatrix');
	invLocation=gl.getUniformLocation(prg,'invMatrix');
	lightLocation=gl.getUniformLocation(prg,'lightDirection');
	
	


	
		var m=new matIV();
	var mMatrix =m.identity(m.create());
	var vMatrix=m.identity(m.create());
	var pMatrix=m.identity(m.create());
	var mvpMatrix=m.identity(m.create());
	var tmpMatrix=m.identity(m.create());
	var invMatrix=m.identity(m.create());
	m.lookAt([0.0, 0.0, 20.0], [0, 0, 0], [0, 1, 0], vMatrix);
	m.perspective(45, c.width / c.height, 0.1, 100, pMatrix);
	m.multiply(pMatrix, vMatrix, tmpMatrix);


	var lightDirection = [-0.5, 0.5, 0.5];
	var count=0;
	
		// カリングと深度テストを有効にする
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	gl.enable(gl.CULL_FACE);
	

	(function(){
		
		

				gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clearDepth(1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		


		count++;
		// コンテキストの再描画

	

	var rad=(count%360)*Math.PI/180;
	var x=Math.cos(rad);
	var y=Math.sin(rad);

	

    // m.translate(mMatrix, [x, y + 1.0, 0.0], mMatrix);


	// m.multiply(tmpMatrix,mMatrix,mvpMatrix);
	// gl.uniformMatrix4fv(uniLocation,false,mvpMatrix);
	// gl.drawArrays(gl.TRIANGLES,0,3);
	
	// m.identity(mMatrix);
    // m.translate(mMatrix, [1.0,-1.0, 0.0], mMatrix);

	
	// m.multiply(tmpMatrix,mMatrix,mvpMatrix);
	// gl.uniformMatrix4fv(uniLocation,false,mvpMatrix);
		// gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_SHORT, 0);
	// var s=Math.sin(rad)+1.0;


	


	 // gl.drawArrays(gl.TRIANGLES,0,3);
	

    m.identity(mMatrix);
	m.rotate(mMatrix,rad,[0,1,1],mMatrix);
	 // m.scale(mMatrix,[s,s,0.0],mMatrix)


			 m.multiply(tmpMatrix,mMatrix,mvpMatrix);
	m.inverse(mMatrix, invMatrix);

	  gl.uniformMatrix4fv(uniLocation,false,mvpMatrix);
	  	  gl.uniformMatrix4fv(invLocation,false,invMatrix);
		  	  gl.uniform3fv(lightLocation,lightDirection);
			gl.drawElements(gl.TRIANGLES, tindex.length, gl.UNSIGNED_SHORT, 0);
	gl.flush();
	
     setTimeout(arguments.callee, 1000 / 30);

	})();

	function create_ibo(data){
		var ibo=gl.createBuffer();
		
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ibo);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Int16Array(data),gl.STATIC_DRAW);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);
	
		return ibo;
		
	
	}
	


	function create_vbo(data){
	//生成缓存对象
		var vbo=gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER,vbo);
		gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);
	
		gl.bindBuffer(gl.ARRAY_BUFFER,null);
	
		return vbo;
	} 

	function create_shader(id){
		var shader;
	
		var scriptElement = document.getElementById(id);
		if(!scriptElement){return;}
		switch(scriptElement.type){
		
			case 'x-shader/x-vertex':
				shader=gl.createShader(gl.VERTEX_SHADER);
				break;
			case 'x-shader/x-fragment':
				shader=gl.createShader(gl.FRAGMENT_SHADER);
				break;
			default :
				return;
		}
		gl.shaderSource(shader,scriptElement.text);
		gl.compileShader(shader);
	
		if(gl.getShaderParameter(shader,gl.COMPILE_STATUS))
			return shader;
		else
			alert(gl.getShaderInfoLog(shader));
	
	}

	function create_program(vs,fs){
		var program=gl.createProgram();
		gl.attachShader(program,vs);
		gl.attachShader(program,fs);
	
		gl.linkProgram(program);
	
		if(gl.getProgramParameter(program,gl.LINK_STATUS)){
		
			gl.useProgram(program);
			return program;
		}
		else{
		
			alert(gl.getProgramInfoLog(program));
		}
	
	}
	
	function set_Attribute(vbos,attL,attS){
		
		for(var i in vbos){
			let vbo=vbos[i];
			let attLocation=attL[i];
			let attStride=attS[i];
			gl.bindBuffer(gl.ARRAY_BUFFER,vbo);
			gl.enableVertexAttribArray(attLocation);
			gl.vertexAttribPointer(attLocation,attStride,gl.FLOAT,false,0,0);
		}
			




	
	}
	
//第一个参数，是将管子分割成多少份，这个数值越大，生成的圆环体就越圆滑，数值太小的话，就会出现棱角。 

//第二个参数，是构成这个管子的圆是多少个顶点，数值越大，管子就越接近一个圆的形状，太小的话，这个圆就有棱角了。 

//第三个参数，是生成这个管子的半径。 
 
//第四个参数，是原点到管子中心的距离。
	
function torus(row, column, irad, orad){
  var pos = new Array(), nor = new Array(),
        col = new Array(), idx = new Array();
    for(var i = 0; i <= row; i++){
        var r = Math.PI * 2 / row * i;
        var rr = Math.cos(r);
        var ry = Math.sin(r);
        for(var ii = 0; ii <= column; ii++){
            var tr = Math.PI * 2 / column * ii;
            var tx = (rr * irad + orad) * Math.cos(tr);
            var ty = ry * irad;
            var tz = (rr * irad + orad) * Math.sin(tr);
            var rx = rr * Math.cos(tr);
            var rz = rr * Math.sin(tr);
            pos.push(tx, ty, tz);
            nor.push(rx, ry, rz);
            var tc = hsva(360 / column * ii, 1, 1, 1);
            col.push(tc[0], tc[1], tc[2], tc[3]);
        }
    }
    for(i = 0; i < row; i++){
        for(ii = 0; ii < column; ii++){
            r = (column + 1) * i + ii;
            idx.push(r, r + column + 1, r + 1);
            idx.push(r + column + 1, r + column + 2, r + 1);
        }
    }
    return [pos, nor, col, idx];

}

/*
HSV色彩模式到RGB色彩模式的转换
生成圆环体的模型数据的函数中，还使用了另一个函数，就是将返回值赋给变量tc的函数hsva。 
这次的demo，圆环体中使用HSV色彩模式。HSV是一种和RGB不同的表示颜色的方法，使用颜色的[ 色调 = Hue ]・[ 饱和度 = Saturation ]・[ 亮度 = Value ]来表示颜色。 
使用RGB来指定颜色是很麻烦的，使用HSV的话就非常简单了，这次的demo，内置了一个从HSV到RGB之间颜色转换的函数，这样就可以给圆环体添加一个漂亮的彩虹颜色了。 
>HSV转换到RGB的函数 
*/
function hsva(h, s, v, a){
    if(s > 1 || v > 1 || a > 1){return;}
    var th = h % 360;
    var i = Math.floor(th / 60);
    var f = th / 60 - i;
    var m = v * (1 - s);
    var n = v * (1 - s * f);
    var k = v * (1 - s * (1 - f));
    var color = new Array();
    if(!s > 0 && !s < 0){
        color.push(v, v, v, a); 
    } else {
        var r = new Array(v, n, m, m, k, v);
        var g = new Array(k, v, v, n, m, m);
        var b = new Array(m, m, k, v, v, n);
        color.push(r[i], g[i], b[i], a);
    }
    return color;

}
}