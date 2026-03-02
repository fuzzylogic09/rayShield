self.onmessage=e=>{

const data=e.data.scene;
const leadDensity=11.34;

function rand(a,b){return a+Math.random()*(b-a);}

function randomPointOnLine(points){
  const a=points[0],b=points[1];
  const t=Math.random();
  return {x:a[0]+t*(b[0]-a[0]),y:a[1]+t*(b[1]-a[1])};
}

for(let i=0;i<data.parameters.rayNumber;i++){

  const source=Object.values(data.objects)
    .find(o=>o.parameters.type==="source");

  const receptor=Object.values(data.objects)
    .find(o=>o.parameters.type==="receptor" && o.parameters.enabled==="True");

  const p1=randomPointOnLine(source.points);
  const p2=randomPointOnLine(receptor.points);

  let totalEq=0;

  for(let name in data.objects){

    const obj=data.objects[name];
    if(obj.parameters.type!=="surface")continue;
    if(obj.parameters.enabled==="False")continue;

    const density=data.materials[obj.parameters.material].density;

    const poly=obj.points.map(pt=>({x:pt[0],y:pt[1]}));

    const len=Math.random()*10; // simplifié

    totalEq+=len*(density/leadDensity);
  }

  if(totalEq<data.parameters.minThicknessToShow)
    self.postMessage({ray:[p1,p2],eq:totalEq});
}

self.postMessage({done:true});
};
