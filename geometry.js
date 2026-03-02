export function lineLength(a,b){
  return Math.hypot(b.x-a.x,b.y-a.y);
}

export function intersectSegmentPolygon(p1,p2,poly){
  let intersections=[];
  for(let i=0;i<poly.length;i++){
    const p3=poly[i];
    const p4=poly[(i+1)%poly.length];
    const hit=segmentIntersect(p1,p2,p3,p4);
    if(hit)intersections.push(hit);
  }
  return intersections;
}

export function segmentIntersect(p1,p2,p3,p4){
  const d=(p4.y-p3.y)*(p2.x-p1.x)-(p4.x-p3.x)*(p2.y-p1.y);
  if(d===0)return null;
  const ua=((p4.x-p3.x)*(p1.y-p3.y)-(p4.y-p3.y)*(p1.x-p3.x))/d;
  const ub=((p2.x-p1.x)*(p1.y-p3.y)-(p2.y-p1.y)*(p1.x-p3.x))/d;
  if(ua>=0&&ua<=1&&ub>=0&&ub<=1)
    return {x:p1.x+ua*(p2.x-p1.x),y:p1.y+ua*(p2.y-p1.y)};
  return null;
}
