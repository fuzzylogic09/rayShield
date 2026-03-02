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

    this.scene.rays.forEach(r=>{
      ctx.strokeStyle="red";
      ctx.beginPath();
      const a=this.worldToScreen(r.ray[0]);
      const b=this.worldToScreen(r.ray[1]);
      ctx.moveTo(a.x,a.y);
      ctx.lineTo(b.x,b.y);
      ctx.stroke();
    });
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
