/** Keep the service stickers readable while adding a small scroll-driven rock. */
export function getCreativeOrbitLayout(width,height,turn=0){
  if(width<=800){
    return [0,1,2].map(i=>({
      x:0,
      y:Math.sin(turn*Math.PI/180+i*.9)*3,
      rotation:Math.sin(turn*Math.PI/180+i)*1.5,
    }));
  }
  const drift=Math.sin(turn*Math.PI/180);
  return [
    {x:-width*.31,y:-height*.02,rotation:-9+drift*2},
    {x:width*.31,y:height*.07,rotation:7-drift*2},
    {x:-width*.22,y:height*.29,rotation:-5+drift*2},
  ];
}
