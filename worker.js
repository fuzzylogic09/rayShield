self.onmessage = function(e){

const scene = e.data.scene;
const leadDensity = 11.34;

function rand(a,b){ return a + Math.random()*(b-a); }

function randomPointOnLine(points){
    const a=points[0], b=points[1];
    const t=Math.random();
    return {
        x:a[0] + t*(b[0]-a[0]),
        y:a[1] + t*(b[1]-a[1])
    };
}

function segmentLength(a,b){
    return Math.hypot(b.x-a.x, b.y-a.y);
}

// Intersection segment-segment
function segmentIntersect(p1,p2,p3,p4){
    const d=(p4.y-p3.y)*(p2.x-p1.x)-(p4.x-p3.x)*(p2.y-p1.y);
    if(d===0)return null;
    const ua=((p4.x-p3.x)*(p1.y-p3.y)-(p4.y-p3.y)*(p1.x-p3.x))/d;
    const ub=((p2.x-p1.x)*(p1.y-p3.y)-(p2.y-p1.y)*(p1.x-p3.x))/d;
    if(ua>=0&&ua<=1&&ub>=0&&ub<=1)
        return {
            x:p1.x+ua*(p2.x-p1.x),
            y:p1.y+ua*(p2.y-p1.y)
        };
    return null;
}

for(let i=0;i<scene.parameters.rayNumber;i++){

    const source = Object.values(scene.objects)
        .find(o=>o.parameters.type==="source");

    const receptor = Object.values(scene.objects)
        .find(o=>o.parameters.type==="receptor" && o.parameters.enabled==="True");

    const p1 = randomPointOnLine(source.points);
    const p2 = randomPointOnLine(receptor.points);

    let totalEq = 0;

    for(let name in scene.objects){

        const obj = scene.objects[name];
        if(obj.parameters.type !== "surface") continue;
        if(obj.parameters.enabled==="False") continue;

        const density = scene.materials[obj.parameters.material].density;
        const ratio = density / leadDensity;

        const poly = obj.points.map(p=>({x:p[0], y:p[1]}));

        let intersections = [];

        for(let j=0;j<poly.length;j++){
            const a=poly[j];
            const b=poly[(j+1)%poly.length];
            const hit = segmentIntersect(p1,p2,a,b);
            if(hit) intersections.push(hit);
        }

        if(intersections.length===2){
            const len = segmentLength(intersections[0], intersections[1]);
            totalEq += len * ratio;
        }
    }

    self.postMessage({
        ray:[p1,p2],
        eq:totalEq
    });
}

self.postMessage({done:true});
};
