type ServiceId='websites'|'resumes'|'food';
export function parseServiceRoute(hash:string):{service:ServiceId;section:'playground'|'pricing'}|null;
export function serviceForShowcase(id:string):ServiceId|null;
