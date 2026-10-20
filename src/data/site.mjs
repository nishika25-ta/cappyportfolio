export const site = {
  name: 'CappyTheDev', location: 'Miri, Sarawak', phone: '017 847 8597',
  description: 'Small business websites, ATS-friendly resumes and food photo editing. A friendly independent creative studio in Miri, Sarawak. Websites from RM129.'
};
export function enquiryUrl(name = '', price) {
  const message = name ? `Hi Cappy! I'm interested in ${name}${price !== undefined ? ` (RM${price})` : ''}. Can we chat about my project?` : "Hi Cappy! I have a project in mind. Let's make something good!";
  return `https://wa.me/60178478597?text=${encodeURIComponent(message)}`;
}
export const services = [
  {
    id:'websites', title:'Websites', label:'A home for your business.', short:'Small business. Big internet energy.',
    description:'Your shop deserves more than a link in a bio. Let’s give it a little corner of the internet that feels like you.',
    from:129, color:'butter', icon:'code', artwork:'/artwork/websites.webp', sheet:'/artwork/web-price.webp',
    packages:[
      {name:'Kitty Starter',price:129,description:'Your first little corner of the internet.',features:['1-page responsive website','Business details, services & contact','WhatsApp enquiry button','1 revision round','48-hour target after complete materials, subject to availability']},
      {name:'Mochi Business',price:299,description:'A little more room to do your thing.',features:['Up to 4 responsive pages','Tailored branding and layout','Service/product showcase + enquiry','Basic SEO setup','2 revision rounds']},
      {name:'Tora Pro',price:599,description:'The full personality. The whole package.',features:['Up to 6 responsive pages','Premium custom styling','Basic SEO, analytics and CMS where agreed','3 revision rounds']}
    ],
    addons:[['Extra page','RM40'],['Bilingual (BM / EN)','RM50'],['Extra revision','RM30'],['Domain setup help','RM40'],['Maintenance','RM30–RM80 / month, quoted']],
    note:'Domain, hosting and renewals billed separately unless quoted. Complex features priced separately. The 48-hour target applies to Kitty Starter after complete materials, subject to availability.'
  },
  {
    id:'resumes',title:'Resumes / CVs',label:'Your next chapter starts here.',short:'Good people deserve good opportunities.',
    description:'Clean, ATS-friendly resumes with the right words in the right places. Still you, just a little sharper.',
    from:19,color:'sky',icon:'document',artwork:'/artwork/resumes.webp',sheet:'/artwork/resume-price.webp',
    packages:[
      {name:'Kitten Fix',price:19,description:'A tidy-up for your next big step.',features:['1-page ATS-friendly resume','Clean professional formatting','Basic wording improvements','1 revision round']},
      {name:'Paw Career',price:49,description:'A resume with your next role in mind.',features:['Up to 2 pages','Tailored to your target role','Relevant keywords and phrasing','Cover-letter option by request (confirm scope)','2 revision rounds']},
      {name:'Meow Pro',price:89,description:'Tell your story with a little more impact.',features:['Up to 2 pages, deeper customisation','Cover letter included','Basic LinkedIn wording tips','3 revision rounds']}
    ],
    addons:[],note:'Send your existing CV or education/work details and target role. Final PDF and editable copy where agreed. Typical turnaround: 1–3 days, confirmed after reviewing your materials. No job or interview guarantees.'
  },
  {
    id:'food',title:'Food visuals',label:'Good food. Great first impressions.',short:'Make them stop scrolling. Then hungry.',
    description:'Your real food, looking its very best. Natural photo editing for menus, social feeds, cafés and home bakers.',
    from:15,color:'coral',icon:'camera',artwork:'/artwork/food.webp',sheet:'/artwork/food-price.webp',
    packages:[
      {name:'Kitten Touch-Up',price:15,description:'One delicious first impression.',features:['1 food photo','Colour, lighting and contrast','Clean crop and natural finish']},
      {name:'Meow Makeover',price:39,description:'A small set with a consistent look.',features:['3 food photos','Natural, consistent enhancements','Ready for menu and social use']},
      {name:'Big Cat Bundle',price:79,description:'A whole menu’s worth of good looks.',features:['8 food photos','Detailed clean-up','Consistent look across the set','Social/menu-ready delivery']}
    ],
    addons:[['Extra image','RM8 each'],['Simple menu layout','RM30'],['Text / logo','RM10'],['Multi-platform resize','RM10']],
    note:'Customer supplies real product photos. No misleading edits to ingredients, portions or food claims. Typical turnaround: 1–3 days, confirmed after reviewing your images. Simple menu design is an optional RM30 add-on.'
  }
];
export const faqs = [
  ['How do we get started?', 'Just send me a WhatsApp with what you need. We’ll talk through your idea, pick a package and confirm the scope, price and timeline before any work begins. No complicated brief required.'],
  ['Do I need to be based in Miri?', 'I’m based in Miri, Sarawak, but we can work together remotely. Share your materials online and we’ll keep in touch through WhatsApp.'],
  ['How fast can you turn things around?', 'Kitty Starter has a 48-hour target once all materials are complete, subject to availability. Resume and food visual work typically takes 1–3 days. Larger websites and extra features get an agreed timeline before we start.'],
  ['What do I need to send you?', 'For a website: your business details, text, images and branding. For a resume: your current CV or education and work details, plus your target role. For food visuals: your original, real product photos. I’ll guide you through it.'],
  ['Are domain and hosting included?', 'Domain registration, hosting and renewals are billed separately unless they are explicitly included in your quote. Domain setup help is RM40; website maintenance is RM30–RM80 per month, quoted to suit your needs.'],
  ['Can I ask for changes?', 'Absolutely. Each website and resume package lists its included revision rounds. Extra website revisions are RM30 per round. We’ll agree on the scope of any other changes before going ahead.']
];
