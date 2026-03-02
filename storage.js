export function saveLocal(scene){
  localStorage.setItem("rayScene",JSON.stringify(scene.export()));
}

export function loadLocal(scene){
  const d=localStorage.getItem("rayScene");
  if(d)scene.load(JSON.parse(d));
}
