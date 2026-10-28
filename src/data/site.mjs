import { deepFreeze, sanitizePhoneDigits, sanitizePlainText } from '../scripts/security.mjs';

const envPhone =
  typeof process !== 'undefined' && process.env?.WHATSAPP_NUMBER
    ? process.env.WHATSAPP_NUMBER
    : undefined;
const whatsappNumber = sanitizePhoneDigits(envPhone, '60178478597');

export const site = {
  name: 'CappyTheDev', location: 'Miri, Sarawak', phone: '017 847 8597',
  description: 'Websites, portfolios, ATS-friendly resumes, and food photo editing in Miri, Sarawak. Websites from RM129.'
};
export function enquiryUrl(name = '', price) {
  const safeName = sanitizePlainText(name, 80);
  const validPrice = typeof price === 'number' && Number.isFinite(price) && price >= 0;
  const message = safeName ? `Hi Cappy! I'm interested in ${safeName}${validPrice ? ` (RM${price})` : ''}. Can we chat about my project?` : "Hi Cappy! I have a project in mind. Let's make something good!";
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
export const services = [
  {
    id:'websites', title:'Websites', label:'Websites for local businesses.', short:'Fast, clean sites from RM129.',
    description:'Mobile-ready websites for shops, cafés, and small businesses.',
    from:129, color:'butter', icon:'code', artwork:'/artwork/websites.webp', sheet:'/artwork/web-price.webp',
    packages:[
      {name:'Kitty Starter',price:129,description:'Clean 1-page site to get online fast.',features:['1-page responsive website','Business details, services & contact','WhatsApp enquiry button','1 revision round','48-hour turnaround after materials received']},
      {name:'Mochi Business',price:299,description:'Multi-page site for growing businesses.',features:['Up to 4 responsive pages','Custom branding & layout','Service/product showcase + enquiry','Basic SEO setup','2 revision rounds']},
      {name:'Tora Pro',price:599,description:'Full custom site for established brands.',features:['Up to 6 responsive pages','Custom styling & motion','SEO, analytics & CMS setup','3 revision rounds']}
    ],
    addons:[['Extra page','RM40'],['Bilingual (BM / EN)','RM50'],['Extra revision','RM30'],['Domain setup help','RM40'],['Maintenance','RM30–RM80 / month']],
    note:'Domain and hosting billed separately. 48-hour turnaround on Kitty Starter once materials are ready.'
  },
  {
    id:'portfolios', title:'Portfolios', label:'Personal sites that show your work.', short:'For devs, designers & grads.',
    description:'Personal websites for developers, designers, and graduates.',
    from:149, color:'pink', icon:'star', artwork:'/artwork/portfolios.webp', sheet:'/artwork/portfolio-price.webp',
    packages:[
      {name:'Purr-folio Starter',price:149,description:'1-page portfolio for grads and juniors.',features:['1-page responsive site','Skills & tech stack section','Up to 3 featured projects','CV download & contact links','1 revision round']},
      {name:'Whisker Creator',price:249,description:'Multi-page portfolio for devs and designers.',features:['Up to 3 responsive pages','Up to 6 project showcases','Custom dark or light theme','Smooth motion & basic SEO','2 revision rounds']},
      {name:'Neko Signature',price:449,description:'Full custom portfolio for senior pros and freelancers.',features:['Up to 5 responsive pages','Custom animations & interactions','Detailed case study layouts','Custom domain setup included','3 revision rounds']}
    ],
    addons:[['Resume + Portfolio bundle','RM35'],['Extra project case study','RM35'],['Interactive motion upgrade','RM60'],['Custom domain setup','RM40'],['Content / project update','RM25 / update']],
    note:'Send your CV and project links (GitHub, Figma, or screenshots). Domain and hosting billed separately. Turnaround: 2–4 days.'
  },
  {
    id:'resumes',title:'Resumes / CVs',label:'Clean, ATS-friendly resumes.',short:'Clear, ATS-ready formatting.',
    description:'ATS-friendly resumes with clean layout and sharp wording.',
    from:19,color:'sky',icon:'document',artwork:'/artwork/resumes.webp',sheet:'/artwork/resume-price.webp',
    packages:[
      {name:'Kitten Fix',price:19,description:'Quick polish for your current CV.',features:['1-page ATS-friendly resume','Clean professional formatting','Wording improvements','1 revision round']},
      {name:'Paw Career',price:49,description:'Tailored for the role you want.',features:['Up to 2 pages','Tailored to your target role','Relevant keywords & phrasing','Optional cover letter','2 revision rounds']},
      {name:'Meow Pro',price:89,description:'Complete resume and cover letter rewrite.',features:['Up to 2 pages, full rewrite','Cover letter included','LinkedIn profile tips','3 revision rounds']}
    ],
    addons:[],note:'Send your current CV or work history and target role. Delivered as PDF and editable file. Turnaround: 1–3 days.'
  },
  {
    id:'food',title:'Food visuals',label:'Natural food photo editing.',short:'Bright, natural menu photos.',
    description:'Natural photo editing for menus, cafés, and food sellers.',
    from:15,color:'coral',icon:'camera',artwork:'/artwork/food.webp',sheet:'/artwork/food-price.webp',
    packages:[
      {name:'Kitten Touch-Up',price:15,description:'Single photo cleanup.',features:['1 food photo','Colour, lighting & contrast','Clean crop & natural finish']},
      {name:'Meow Makeover',price:39,description:'3 photos edited to match.',features:['3 food photos','Consistent natural colour','Menu & social ready']},
      {name:'Big Cat Bundle',price:79,description:'Full set for menus and socials.',features:['8 food photos','Detailed cleanup','Consistent look across set','Menu & social ready']}
    ],
    addons:[['Extra image','RM8 each'],['Simple menu layout','RM30'],['Text / logo','RM10'],['Multi-platform resize','RM10']],
    note:'Send your original food photos—real dishes only, no fake AI edits. Turnaround: 1–3 days.'
  }
];
export const faqs = [
  ['How do we get started?', 'Message me on WhatsApp with what you need. We’ll confirm the package, price, and timeline before starting.'],
  ['Do I need to be in Miri?', 'No. I’m based in Miri, Sarawak, and work with clients anywhere via WhatsApp.'],
  ['How fast is turnaround?', 'Kitty Starter takes 48 hours once materials are ready. Resumes and food photos take 1–3 days. Multi-page sites take 2–5 days.'],
  ['What do I need to send?', 'Websites: business info, text, and photos. Portfolios: CV and project links. Resumes: current CV and target role. Food visuals: original food photos.'],
  ['Are domain and hosting included?', 'They’re billed separately unless included in your quote. Domain setup is RM40, and monthly maintenance is RM30–RM80.'],
  ['Can I request changes?', 'Yes. Every package includes revision rounds, and extra website revisions are RM30 per round.']
];
deepFreeze(site);
deepFreeze(services);
deepFreeze(faqs);
