export function parseServiceRoute(hash){
  const match=/^#(playground|pricing)-(websites|resumes|food)$/.exec(hash);
  return match?{service:match[2],section:match[1]}:null;
}
export function serviceForShowcase(id){
  if(['websites','business','pro'].includes(id))return 'websites';
  return ['resumes','food'].includes(id)?id:null;
}
