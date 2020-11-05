let vertexShaderText =
[
  'precision mediump float;',
  '',
  'attribute vec3 vertPosition;',
  'attribute vec3 vertColor;',
  'varying vec3 fragColor;',
  'uniform mat4 mWorld;',
  'uniform mat4 mView;',
  'uniform mat4 mProj;',
  'void main()',
  '{',
  'fragColor = vertColor;',
  ' gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);', // işlem sağdan sola gerçekleşir
  '}'
].join('\n');


let fragmentShaderText =
[
  'precision mediump float;',
  '',
  'varying vec3 fragColor;',
  'void main()',
  '{',
  ' gl_FragColor = vec4(fragColor, 1.0);',
  '}'
].join('\n');



let initDemo = function () {


  let canvas = document.getElementById('game-surface');
  let gl = canvas.getContext('webgl');
  gl.enable(gl.DEPTH_TEST);
  // gl.enable(gl.CULL_FACE);
  // gl.cullFace(gl.FRONT);

  if(!gl) {
    console.log("WebGL not supported, falling back on experimental-WebGL");
    gl = canvas.getContext('experimental-webgl');
  }
  if(!gl) {
    console.log("Your browser does not support WebGL");
  }
/*
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gl.viewport(0, 0, window.innerWidth, window.innerHeight);
*/
  gl.clearColor(0.75, 0.85, 0.8, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  /*
  console.log(vertexShaderText);
  console.log(fragmentShaderText);
  */

  let vertexShader = gl.createShader(gl.VERTEX_SHADER);
  let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  gl.shaderSource(vertexShader, vertexShaderText);
  gl.shaderSource(fragmentShader, fragmentShaderText);

  gl.compileShader(vertexShader);
  if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    // controls if we get any error while compiling shader
    console.error('error at compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
    return;
  }

  gl.compileShader(fragmentShader);
  if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    // controls if we get any error while compiling shader
    console.error('error at compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
    return;
  }

  let program = gl.createProgram();

  // we don't need to say which one is vertex || fragment shader
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    // if we get any error at linking program
    console.error('error linking program!', gl.getProgramInfoLog(program));
    return;
  }

  gl.validateProgram(program);
  if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    // this catches extra error
    console.error('error at validating program!', gl.getProgramInfoLog(program));
    return;
  }
  console.log("Doing good so far!");

  //
  // Create Buffer
  //
  let boxVertices = [ // x, y, z,  r, g, b
    // Top
		-1.0, 1.0, -1.0,   0.25, 0.25, 0.25,
		-1.0, 1.0, 1.0,    0.25, 0.25, 0.25,
		1.0, 1.0, 1.0,     0.25, 0.25, 0.25,
		1.0, 1.0, -1.0,    0.25, 0.25, 0.25,

		// Left
		-1.0, 1.0, 1.0,    0.75, 0.25, 0.5,
		-1.0, -1.0, 1.0,   0.75, 0.25, 0.5,
		-1.0, -1.0, -1.0,  0.75, 0.25, 0.5,
		-1.0, 1.0, -1.0,   0.75, 0.25, 0.5,

		// Right
		1.0, 1.0, 1.0,    0.25, 0.25, 0.75,
		1.0, -1.0, 1.0,   0.25, 0.25, 0.75,
		1.0, -1.0, -1.0,  0.25, 0.25, 0.75,
		1.0, 1.0, -1.0,   0.25, 0.25, 0.75,

		// Front
		1.0, 1.0, 1.0,    1.0, 0.0, 0.15,
		1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
		-1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
		-1.0, 1.0, 1.0,    1.0, 0.0, 0.15,

		// Back
		1.0, 1.0, -1.0,    0.0, 1.0, 0.15,
		1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
		-1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
		-1.0, 1.0, -1.0,    0.0, 1.0, 0.15,

		// Bottom
		-1.0, -1.0, -1.0,   0.5, 0.5, 1.0,
		-1.0, -1.0, 1.0,    0.5, 0.5, 1.0,
		1.0, -1.0, 1.0,     0.5, 0.5, 1.0,
		1.0, -1.0, -1.0,    0.5, 0.5, 1.0
  ];

  let boxIndices = [
    // Top
    0, 1, 2,
    0, 2, 3,
    // Left
    4, 5, 6,
    4, 6, 7,
    // Right
    8, 9, 10,
    8, 10, 11,
    // Front
    12, 13, 14,
    12, 14, 15,
    // Back
    16, 17, 18,
    16, 18, 19,
    //Bottom
    20, 21, 22,
    20, 22, 23
  ];

  let boxVertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

  let boxIndexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);


  let positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
  let colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
  gl.vertexAttribPointer(
    positionAttribLocation, // attribute location
    3, // number of elements per attribute
    gl.FLOAT, // Type of elements
    gl.FALSE,
    6 * 4, // 4 is 32 bit float size // size of an individual vertex -> x, y 2 * 4
    0 // offset from the beginning of a single vertex to this attribute
  );

  gl.vertexAttribPointer(
    colorAttribLocation, // attribute location
    3, // number of elements per attribute
    gl.FLOAT, // Type of elements
    gl.FALSE,
    6 * 4, // 4 is 32 bit float size // size of an individual vertex -> x, y 2 * 4
    3 * 4 // pffset from the beginning of a single vertex to this attribute
  );

  gl.enableVertexAttribArray(positionAttribLocation);
  gl.enableVertexAttribArray(colorAttribLocation);

  gl.useProgram(program);

  let matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
  let matViewUniformLocation = gl.getUniformLocation(program, 'mView');
  let matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

  let worldMatrix = new Float32Array(16);
  let viewMatrix = new Float32Array(16);
  let projMatrix = new Float32Array(16);

  glMatrix.mat4.identity(worldMatrix); // mat4.identity -> glMatrix.mat4.identity
  glMatrix.mat4.lookAt(viewMatrix, [3, 3, -8], [0, 0, 0], [0, 1, 0]);
  glMatrix.mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);

  gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE /* matrixi transpoze edecek mi? */, worldMatrix);
  gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE /* matrixi transpoze edecek mi? */, viewMatrix);
  gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE /* matrixi transpoze edecek mi? */, projMatrix);

  //
  //  Main render group
  //
  let angle = 0;
  let identityMatrix = new Float32Array(16);
  glMatrix.mat4.identity(identityMatrix);

  let loop = function () {
    angle = window.performance.now() / 1000 / 6 * 2 * Math.PI;
    glMatrix.mat4.rotate(worldMatrix, identityMatrix, angle, [0, -1, -1]); // (output, original matrix, angle, rotating axies)
    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

    gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);
    window.requestAnimationFrame(loop);
  };
  window.requestAnimationFrame(loop);



  gl.drawArrays(gl.TRIANGLES, 0, 3);


}
