let angle = 0;
let angle_offset = 0.02;

let points = [];

let rot_state = 0;
let prev_angle = 0;

let datas = [];
let currentNode = 0;

let font;
let transp = 100;
let up_transp = false;

let end_angle = 0;
let dimension = 2;
let angle_offsset = 1;
let isStart = false;
let size, bg_color;

function preload() {
  font = loadFont('assets/NanumGothicBold.ttf');
  for (let i=0; i<datas_ori.length; i++) {
    datas.push(new Data(datas_ori[i]));
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  points[0] = new P4Vector(-1, -1, 0, 0);
  points[1] = new P4Vector(1, -1, 0, 0);
  points[2] = new P4Vector(1, 1, 0, 0);
  points[3] = new P4Vector(-1, 1, 0, 0);
  points[4] = new P4Vector(-1, -1, 0, 0);
  points[5] = new P4Vector(1, -1, 0, 0);
  points[6] = new P4Vector(1, 1, 0, 0);
  points[7] = new P4Vector(-1, 1, 0, 0);
  points[8] = new P4Vector(-1, -1, 0, 0);
  points[9] = new P4Vector(1, -1, 0, 0);
  points[10] = new P4Vector(1, 1, 0, 0);
  points[11] = new P4Vector(-1, 1, 0, 0);
  points[12] = new P4Vector(-1, -1, 0, 0);
  points[13] = new P4Vector(1, -1, 0, 0);
  points[14] = new P4Vector(1, 1, 0, 0);
  points[15] = new P4Vector(-1, 1, 0, 0);
  textFont(font);
  textAlign(CENTER, CENTER);
  colorMode(HSB, 100);
  angle = -PI * 0.029;
  bg_color = 0;
}

function keyPressed() {
  if (dimension==3) {
    dimension = 4;
    angle_offsset = angle;
  } else if (rot_state==0) {
    if (keyCode === UP_ARROW) {
      if (datas[currentNode].selB_node!=-1) {
        rot_state = 2;
      }
    } else if (keyCode === DOWN_ARROW) {
      if (datas[currentNode].prevNode!=-1&&currentNode!=0) {
        rot_state = 1;
      }
    } else if (keyCode === LEFT_ARROW) {
      if (datas[currentNode].selA_node!=-1) {
        rot_state = 4;
      }
    } else if (keyCode === RIGHT_ARROW) {
      if (datas[currentNode].selC_node!=-1) {
        rot_state = 3;
      }
    }
  }
}

function draw() {
  background(bg_color);
  if(isStart==false) {
    landing();
  } else {
    main();
  }
}
function main() {
  let projected3d = [];
  if (transp>0) {
    textSize(min(width / 42, height / 42));
    fill(100, transp);
    text(datas[currentNode].currentText, 0, 0);
    push();
    rotateY(PI/3);
    text(datas[currentNode].selA_text, -min(width, height)/3, 0); //left
    pop();
    push();
    rotateY(-PI/3);
    text(datas[currentNode].selC_text, min(width, height)/3, 0); //right
    pop();
    push();
    rotateX(-PI/3);
    text(datas[currentNode].selB_text, 0, -min(width, height)/3); //up
    pop();
    if (currentNode!=0) {
      push();
      rotateX(PI/3);
      text('뒤로가기', 0, min(width, height)/3); //down
      pop();
    }
  }

  for (let i = 0; i < points.length; i++) {
    const v = points[i];
    const rotationYW = [
      [cos(angle), 0, -sin(angle), 0], 
      [0, 1, 0, 0], 
      [sin(angle), 0, cos(angle), 0], 
      [0, 0, 0, 1]
    ];
    const rotationYZ = [
      [cos(angle), 0, 0, -sin(angle)], 
      [0, 1, 0, 0], 
      [0, 0, 1, 0], 
      [sin(angle), 0, 0, cos(angle)]
    ];
    const rotationXW = [
      [1, 0, 0, 0], 
      [0, cos(angle), -sin(angle), 0], 
      [0, sin(angle), cos(angle), 0], 
      [0, 0, 0, 1]
    ];
    const rotationXZ = [
      [1, 0, 0, 0], 
      [0, cos(angle), 0, -sin(angle)], 
      [0, 0, 1, 0], 
      [0, sin(angle), 0, cos(angle)]
    ];
    let rotated = v;
    if (rot_state==1||rot_state==2) {
      rotated = matmul(rotationYW, v);
      rotated = matmul(rotationXZ, rotated); //to up down
    } else if (rot_state==3||rot_state==4) {
      rotated = matmul(rotationYZ, v);
      rotated = matmul(rotationXW, rotated); //to right left
    }
    let distance = 2;
    let w = 1 / (distance - rotated.w);

    const projection = [
      [w, 0, 0, 0], 
      [0, w, 0, 0], 
      [0, 0, w, 0], 
    ];

    let projected = matmul(projection, rotated);
    
    projected.mult(size);
    projected3d[i] = projected;

    stroke(100);
    strokeWeight(10);
    noFill();

    point(projected.x, projected.y, projected.z);
  }

  // Connecting
  for (let i = 0; i < 4; i++) {
    connect(0, i, (i + 1) % 4, projected3d);
    connect(0, i + 4, ((i + 1) % 4) + 4, projected3d);
    connect(0, i, i + 4, projected3d);
  }

  for (let i = 0; i < 4; i++) {
    connect(8, i, (i + 1) % 4, projected3d);
    connect(8, i + 4, ((i + 1) % 4) + 4, projected3d);
    connect(8, i, i + 4, projected3d);
  }

  for (let i = 0; i < 8; i++) {
    connect(0, i, i + 8, projected3d);
  }

  if (rot_state!=0) {
    angle_offset += 0.0002;
    transp -= 20;
    if (rot_state % 2 == 1) { 
      angle += angle_offset;
      if (angle-prev_angle>=HALF_PI) {
        prev_angle = angle;
        angle_offset = 0.02;
        transp = 0;
        up_transp = true;
        if (rot_state==1) {
          currentNode = datas[currentNode].prevNode;
        } else { //3
          currentNode = datas[currentNode].selC_node;
        }
        rot_state = 0;
      }
    } else { 
      angle -= angle_offset;
      if (angle - prev_angle<=-HALF_PI) {
        prev_angle = angle;
        angle_offset = 0.02;
        transp = 0;
        up_transp = true;
        if (rot_state==2) { //up
          currentNode = datas[currentNode].selB_node;
        } else { //4 left
          currentNode = datas[currentNode].selA_node;
        }
        rot_state = 0;
      }
    }
  }

  if (up_transp == true) {
    transp += 10;
    if (transp>=100) {
      transp = 100;
      up_transp = false;
    }
  }
  
  if(datas[currentNode].sel_cnt==0) {
    if(bg_color<100) {
      size +=10;
      bg_color++;
    } else {
      noLoop();
      window.location.href = datas[currentNode].url;
    }
  } else {
    size = min(width / 4, height / 4);
  }
}

function landing() {
  background(0);
  if (dimension==2) {
    fill(100, map(angle, -PI * 0.029, (-PI * 0.029)*0.7, 0, 100));
    textSize(min(width / 22, height / 22));
    text('ONSTAGE', 0, -min(width / 22, height / 22));
    fill(100, map(angle, (-PI * 0.029)*0.7, (-PI * 0.029)*0.3, 0, 100));
    textSize(min(width / 35, height / 35));
    text('ON THE MOOD', 0, 0);
    fill(100, map(angle, (-PI * 0.029)*0.3, 0, 0, 100));
    textSize(min(width / 57, height / 57));
    text('created by @skit_artwork', 0, min(width / 25, height / 25));
  } else if (dimension==3) {
    if (angle<(PI * 0.029)) {
      fill(100, map(angle, 0, (PI * 0.029), 100, 0));
      textSize(min(width / 22, height / 22));
      text('ONSTAGE', 0, -min(width / 22, height / 22));
      textSize(min(width / 35, height / 35));
      text('ON THE MOOD', 0, 0);
      textSize(min(width / 57, height / 57));
      text('created by @skit_artwork', 0, min(width / 25, height / 25));
    } else {
      fill(100, map(angle, PI * 0.029, (PI * 0.029)*2, 0, 100));
      textSize(min(width / 22, height / 22));
      text('Press Any Button to Start', 0, -min(width / 5, height / 5));
    }
  }
  let projected3d = [];
  for (let i = 0; i < points.length; i++) {
    const v = points[i];

    const rotationYW = [
      [cos((angle-angle_offsset)*10), 0, -sin((angle-angle_offsset)*10), 0], 
      [0, 1, 0, 0], 
      [sin((angle-angle_offsset)*10), 0, cos((angle-angle_offsset)*10), 0], 
      [0, 0, 0, 1]
    ];
    const rotationXZ = [
      [1, 0, 0, 0], 
      [0, cos((angle-angle_offsset)*10), 0, -sin((angle-angle_offsset)*10)], 
      [0, 0, 1, 0], 
      [0, sin((angle-angle_offsset)*10), 0, cos((angle-angle_offsset)*10)]
    ];
    let rotated = v;

    //CHANGED!!!!
    if (dimension==4) {
      rotated = matmul(rotationYW, v);
      rotated = matmul(rotationXZ, rotated); //to up down
    } else if (dimension == 3) {
      rotateY(-angle);
    } else if (dimension == 2) {
      rotateX(-angle);
    }
    //CHANGED!!!

    let distance = 2;
    let w = 1 / (distance - rotated.w);

    const projection = [
      [w, 0, 0, 0], 
      [0, w, 0, 0], 
      [0, 0, w, 0], 
    ];

    let projected = matmul(projection, rotated);
    projected.mult(min(width / 4, height / 4));
    projected3d[i] = projected;
  }
  if (dimension==2) {
    if (angle>0) {
      dimension = 3;
      angle = 0;
    } else {
      angle += PI * 0.00029;
    }
  } else if (dimension==3) {
    angle += PI * 0.00029;
  } else if (dimension==4&&isStart==false) {
    if(degrees(angle-angle_offsset)>9) {
      angle = 0;
      isStart = true;
    } else {
      angle += PI * 0.00029;
    }
  }
  //angle += angle_offset;
  // Connecting
  for (let i = 0; i < 4; i++) {
    connect(0, i, (i + 1) % 4, projected3d);
    connect(0, i + 4, ((i + 1) % 4) + 4, projected3d);
    connect(0, i, i + 4, projected3d);
  }

  for (let i = 0; i < 4; i++) {
    connect(8, i, (i + 1) % 4, projected3d);
    connect(8, i + 4, ((i + 1) % 4) + 4, projected3d);
    connect(8, i, i + 4, projected3d);
  }

  for (let i = 0; i < 8; i++) {
    connect(0, i, i + 8, projected3d);
  }

  if (dimension==4) {
    for (let i=0; i<points.length; i++) {
      if (i<8) {
        points[i].w += 0.01;
        if (points[i].w>1) {
          points[i].w = 1;
        }
      } else {
        points[i].w -= 0.01;
        if (points[i].w<-1) {
          points[i].w = -1;
        }
      }
    }
  } else if (dimension==3) {
    for (let i=0; i<points.length; i++) {
      if (i<=3||(i>=8&&i<12)) {
        points[i].z -= 0.01;
        if (points[i].z<-1) {
          points[i].z = -1;
        }
      } else if (i>=12||(i>=4&&i<8)) {
        points[i].z += 0.01;
        if (points[i].z>1) {
          points[i].z = 1;
        }
      }
    }
  }
}

function connect(offset, i, j, points) {
  strokeWeight(8);
  stroke(100);
  const a = points[i + offset];
  const b = points[j + offset];
  line(a.x, a.y, a.z, b.x, b.y, b.z);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  textSize(min(width / 40, height / 40));
}
