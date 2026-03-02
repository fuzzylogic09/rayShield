export class Renderer {

  constructor(canvas,scene){
    this.canvas=canvas;
    this.ctx=canvas.getContext("2d");
    this.scene=scene;

    this.offsetX=0;
    this.offsetY=0;
    this.scale=1;

    this.initEvents();
    this.draw();
  }

  worldToScreen(p){
    return {
      x:(p.x+this.offsetX)*this.scale,
      y:(p.y+this.offsetY)*this.scale
    };
  }

  draw(){
    const ctx=this.ctx;
    ctx.clearRect(0,0,this.canvas.width,this.canvas.height);

    const ctx=this.ctx;
    const w=20;
    const h=200;
    const x=this.canvas.width-40;
    const y=20;
    
    for(let i=0;i<h;i++){
      const t=i/h;
      const r=Math.floor(255*t);
      const g=Math.floor(255*(1-t));
      ctx.fillStyle=`rgb(${r},${g},0)`;
      ctx.fillRect(x,y+i,w,1);
    }
    
    ctx.fillStyle="white";
    ctx.fillText("0",x-25,y+h);
    ctx.fillText(this.scene.parameters.minThicknessToShow,x-40,y);
        
  for(let name in this.scene.objects){
    const obj=this.scene.objects[name];
    if(obj.parameters.enabled==="False")continue;
  
    const pts=obj.points;
    if(pts.length < 2) continue;
  
    this.ctx.beginPath();
  
    const first = this.worldToScreen({x:pts[0][0], y:pts[0][1]});
    this.ctx.moveTo(first.x, first.y);
  
    for(let i=1;i<pts.length;i++){
      const p=this.worldToScreen({x:pts[i][0], y:pts[i][1]});
      this.ctx.lineTo(p.x, p.y);
    }
  
    // 🔥 IMPORTANT
    if(obj.parameters.type === "surface"){
      this.ctx.closePath();
    }
  
    this.ctx.strokeStyle="white";
    this.ctx.stroke();
  }

  this.scene.updateRays();
  
  this.scene.rays.forEach(r=>{
    this.ctx.globalAlpha = r.life;
  
    this.ctx.strokeStyle = this.getColor(r.eq);
  
    this.ctx.beginPath();
    const a=this.worldToScreen(r.ray[0]);
    const b=this.worldToScreen(r.ray[1]);
    this.ctx.moveTo(a.x,a.y);
    this.ctx.lineTo(b.x,b.y);
    this.ctx.stroke();
  });
  
  this.ctx.globalAlpha = 1.0;
  }

  initEvents(){
    let dragging=false,lastX,lastY;

    this.canvas.onmousedown=e=>{
      dragging=true;
      lastX=e.offsetX;
      lastY=e.offsetY;
    };

    this.canvas.onmousemove=e=>{
      if(dragging){
        this.offsetX+=(e.offsetX-lastX)/this.scale;
        this.offsetY+=(e.offsetY-lastY)/this.scale;
        lastX=e.offsetX;
        lastY=e.offsetY;
        this.draw();
      }
    };

    this.canvas.onmouseup=()=>dragging=false;

    this.canvas.onwheel=e=>{
      this.scale*=e.deltaY>0?0.9:1.1;
      this.draw();
    };
  }
}

getColor(eq){

  const max = this.scene.parameters.minThicknessToShow;
  const t = Math.min(eq/max,1);

  const r = Math.floor(255*t);
  const g = Math.floor(255*(1-t));
  const b = 0;

  return `rgb(${r},${g},${b})`;
}
