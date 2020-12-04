

onload = function(){

	var c = document.getElementById('canvas');
	c.width = 500;
	c.height = 300;


	var gl = c.getContext('webgl') || c.getContext('experimental-webgl');

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	
	gl.clearDepth(1.0);
	
	gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
	
	var v_shader = create_shader('vs');
	var f_shader = create_shader('fs');
	
	var prg = create_program(v_shader,f_shader);
	
	var attLocation=gl.getAttribLocation(prg,'position');
	var attLocation2=gl.getAttribLocation(prg,'color');
	var attStride=3;
	var attStride2=4;
	var vertex_position=[
		0.0,1.0,0.0,
		1.0,0.0,0.0,
		-1.0,0.0,0.0
	
	
	];

	
	var vertex_color = [
    	1.0, 0.0, 0.0, 1.0,
    	0.0, 1.0, 0.0, 1.0,
    	0.0, 0.0, 1.0, 1.0
	];


	var vbo = create_vbo(vertex_position);


	var color_vbo=create_vbo(vertex_color);

	let attLocations=[attLocation,attLocation2];
	let attStrides=[attStride,attStride2];

    set_Attribute([vbo, color_vbo], attLocations, attStrides);


	var m=new matIV();
	
	var mMatrix =m.identity(m.create());
	var vMatrix=m.identity(m.create());
	var pMatrix=m.identity(m.create());
	var mvpMatrix=m.identity(m.create());
	var tmpMatrix=m.identity(m.create());
	m.lookAt([0.0,1.0,3.0],[0,0,0],[0,1,0],vMatrix);
	m.perspective(90,c.width/c.height,0.1,100,pMatrix);
	
	m.multiply(pMatrix,vMatrix,tmpMatrix);
	
	
	m.translate(mMatrix, [1.5, 0.0, 0.0], mMatrix)
	m.multiply(tmpMatrix,mMatrix,mvpMatrix);
	
	var uniLocation=gl.getUniformLocation(prg,'mvpMatrix');
	gl.uniformMatrix4fv(uniLocation,false,mvpMatrix);

	
	
	
	gl.drawArrays(gl.TRIANGLES,0,3);
	
	
	m.identity(mMatrix);
	m.translate(mMatrix, [-1.5, 0.0, 0.0], mMatrix)
	m.multiply(tmpMatrix,mMatrix,mvpMatrix);
	
	

	var uniLocation=gl.getUniformLocation(prg,'mvpMatrix');
	gl.uniformMatrix4fv(uniLocation,false,mvpMatrix);

	
	
	
	gl.drawArrays(gl.TRIANGLES,0,3);
	gl.flush();
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
};