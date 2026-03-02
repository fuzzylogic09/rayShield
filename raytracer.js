let worker=null;

export function startMonteCarlo(scene,renderer){
  if(worker)worker.terminate();
  scene.rays=[];

  worker=new Worker("worker.js");

  worker.postMessage(scene.export());

  worker.onmessage=e=>{
    if(e.data.done)return;
    scene.rays.push(e.data);
    renderer.draw();
  };
}

export function stopMonteCarlo(){
  if(worker)worker.terminate();
}
