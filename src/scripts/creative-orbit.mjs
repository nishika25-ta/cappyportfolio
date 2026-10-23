/** Elliptical desktop choreography; a separate, readable arrangement on phones. */
export function getCreativeOrbitLayout(width,height,turn=0){
  if(width<=800){
    return [0,1,2].map(i=>({
      x:0,
      y:Math.sin(turn*Math.PI/180+i*.9)*3,
      rotation:Math.sin(turn*Math.PI/180+i)*1.5,
    }));
  }
  const radiusX=Math.min(width*.34,480);
  const radiusY=Math.min(height*.31,250);
  return [-150,-30,90].map((start,i)=>{
    const angle=(start+turn)*Math.PI/180;
    return {x:Math.cos(angle)*radiusX,y:Math.sin(angle)*radiusY,rotation:Math.sin(angle)*7+(i-1)*3};
  });
}
