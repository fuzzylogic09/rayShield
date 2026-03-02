import { Scene } from './scene.js';
import { Renderer } from './renderer.js';
import { startMonteCarlo, stopMonteCarlo } from './raytracer.js';
import { saveLocal, loadLocal } from './storage.js';

const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth - 250;
canvas.height = window.innerHeight - 50;

const scene = new Scene();
const renderer = new Renderer(canvas, scene);

loadLocal(scene);

document.getElementById("fileInput").addEventListener("change", e=>{
  const reader = new FileReader();
  reader.onload = ()=> {
    scene.load(JSON.parse(reader.result));
    renderer.draw();
  };
  reader.readAsText(e.target.files[0]);
});

document.getElementById("runBtn").onclick = ()=>{
  scene.parameters.rayNumber = +document.getElementById("rayCount").value;
  scene.parameters.minThicknessToShow = +document.getElementById("threshold").value;
  startMonteCarlo(scene, renderer);
};

document.getElementById("stopBtn").onclick = stopMonteCarlo;

document.getElementById("exportBtn").onclick = ()=>{
  const blob = new Blob([JSON.stringify(scene.export(),null,2)]);
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download="scene_export.json";
  a.click();
};

document.getElementById("lockAllBtn").onclick=()=>{
  scene.toggleLockAll();
  renderer.draw();
};

setInterval(()=>saveLocal(scene),3000);
