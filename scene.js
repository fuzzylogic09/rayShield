export class Scene {

  constructor(){
    this.objects = {};
    this.materials = {
      lead:{density:11.34}
    };
    this.parameters = {
      rayNumber:1000,
      minThicknessToShow:200,
      title:"Untitled"
    };
    this.rays=[];
    this.lockAll=false;
  }

  load(json){
    const s=json.scene;
    this.objects=s.objects;
    this.materials=s.materials || this.materials;
    this.parameters=s.parameters;
    this.rays=[];
  }

  export(){
    return {scene:{
      objects:this.objects,
      materials:this.materials,
      parameters:this.parameters
    }};
  }

  toggleLockAll(){
    this.lockAll=!this.lockAll;
    for(let k in this.objects)
      this.objects[k].parameters.locked=this.lockAll;
  }
}
