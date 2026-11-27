import FB from './fb.js';
import BANK,{CT_MAP} from './data/bank.js';
import GUIDE_DATA from './games/rules.js';
const {initializeApp,connectDatabaseEmulator,getAuth,GoogleAuthProvider,signInWithPopup,signOut,onAuthStateChanged,connectAuthEmulator,signInWithCredential,getDatabase,ref,onValue,set,update,get,onDisconnect,runTransaction,increment}=FB;
const GUIDE=GUIDE_DATA;





const firebaseConfig = {
  apiKey: "AIzaSyDr46xwrJawOfcWXDSpfzNq17OHL8KMpkg",
  authDomain: "game-c9a2c.firebaseapp.com",
  databaseURL: "https://game-c9a2c-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "game-c9a2c",
  storageBucket: "game-c9a2c.firebasestorage.app",
  messagingSenderId: "151299306315",
  appId: "1:151299306315:web:0ba9ea6b2fc566a8deaece"
};

const CATS=["حاجة بتتاكل","فيلم عربي","حاجة في المطبخ","ماركة عربيات","حاجة بتخوف","اسم ممثل","حاجة في الشنطة","حاجة بتتلبس","مسلسل مصري","حيوان","دولة","حاجة بتتشرب","مكان في القاهرة","حاجة بتتسرق","أكلة شعبية","حاجة بتتكسر","اسم بنت","اسم ولد","جماد","نبات","حاجة في المدرسة","مهنة","حاجة في الحمام","حاجة بتعملها وانت زهقان","حاجة ريحتها وحشة","حاجة بتتباع في السوبرماركت","مطرب أو مطربة","لاعب كورة","حاجة بتتشحن","حاجة بتقولها لما تتخض","تطبيق على الموبايل","حاجة في الشارع","حاجة بتتعلق","عذر للتأخير","حاجة بتتاكل في الفرح","حاجة مش لازم تقولها للمدير","حاجة في العربية","اسم قطة أو كلب","حاجة بتتحط في السندوتش","كلمة بتتقال في الخناقة","حاجة بتتلف","مكان مش عايز تروحه","حاجة غالية","ماركة موبايل","حاجة بتتغسل","لعبة أطفال","حاجة بتتحرق","حاجة جوه التلاجة","نوع مكرونة أو أرز","شخصية كرتون","حاجة بتلمع","حاجة بتتقفل","صوت حيوان أو حاجة بتصوت","حاجة بتتحلف بيها"];
const CLASSIC=["ولد","بنت","جماد","نبات","حيوان","بلاد"];
const LETTERS=[..."ابتجحخدرزسشصضطعغفقكلمنهوي"];
const GAMES={
  dev:{ico:'🚌',name:'أتوبيس كومبليت المطور',desc:'تصنيفات عشوائية ومضحكة في كل جولة',cls:'t1',ab:1},
  classic:{ico:'🚍',name:'أتوبيس كومبليت العادية',desc:'ولد، بنت، جماد، نبات، حيوان، بلاد',cls:'t2',ab:1},
  uno:{ico:'🟥🟨🟩🟦',name:'أونو',desc:'كروت ملونة، كروت خاصة، وصرخة UNO!',cls:'t3',min:2,max:10},
  c_old:{ico:'🃏',name:'الشايب',desc:'خلّص كروتك واهرب من ورقة الشايب',cls:'t5',min:2,max:6},
  c_war:{ico:'⚔️',name:'حرب الكروت',desc:'اقلب أعلى ورقة وخد الورق كله',cls:'t6',min:2,max:4},
  c_crazy:{ico:'8️⃣',name:'ثمانية المجنونة',desc:'اتخلص من كروتك قبل الكل، والـ8 جوكر',cls:'t7',min:2,max:6},
  dm:{ico:'🁣',name:'دومينو',desc:'الدومينو العادي: خلّص أحجارك الأول',cls:'t11',min:2,max:4},
  dma:{ico:'🁫',name:'دومينو أمريكاني (فايف)',desc:'خمسات: اجمع نقط لما الأطراف تبقى مضاعف 5',cls:'t12',min:2,max:4},
  qz:{ico:'🔔',name:'سؤال وجواب: الجرس',desc:'اضغط الأول وجاوب: +1 للصح و-1 للغلط',cls:'t9',min:2,max:4},
  qm:{ico:'🧠',name:'سؤال وجواب: اختيار من متعدد',desc:'الكل بيجاوب، واللي يسبق بـ5 نقط يكسب',cls:'t10',min:2,max:4},
  c_21:{ico:'🎰',name:'واحد وعشرين',desc:'قرّب من 21 ولا تعدّي، والموزّع قدامك',cls:'t8',min:1,max:6}
};
const CARDK=['c_old','c_war','c_crazy','c_21'];
const RULES={
  dev:['كل جولة بيتحدد حرف عشوائي (ومبيتكررش في نفس اللعبة) و5 تصنيفات عشوائية.','اكتب كلمة لكل تصنيف بتبدأ بالحرف.','أول واحد يخلص يدوس "أتوبيس كومبليت" وباقي اللاعبين عندهم 5 ثواني.','الإجابة المميزة 10 نقط، والمتكررة 5، والغلط أو الفاضية 0.','اللاعبين بيعترضوا 👎 على الإجابات الغريبة، والأدمن بيعدّل الدرجات ويعتمد النتيجة.'],
  classic:['التصنيفات ثابتة: ولد، بنت، جماد، نبات، حيوان، بلاد.','كل جولة حرف عشوائي، اكتب إجابة لكل تصنيف بتبدأ بالحرف.','أول واحد يخلص يدوس "أتوبيس كومبليت" وباقي اللاعبين عندهم 5 ثواني.','الإجابة المميزة 10 نقط، والمتكررة 5، والغلط أو الفاضية 0.','الأدمن بيراجع التصحيح ويعتمد النتيجة.'],
  uno:['كل لاعب بياخد 7 كروت، ومن 2 لـ10 لاعبين.','العب كارت بنفس لون أو رقم أو رمز الكارت اللي على الطاولة.','⦸ يخطّي دور اللي بعدك • 🔄 يعكس الاتجاه • +2 اللي بعدك يسحب 2 • 🌈 تغيّر اللون • +4 تغيّر اللون واللي بعدك يسحب 4.','مفيش كارت يناسب؟ اسحب كارت، لو ينفع العبه وإلا اضغط تخطّي.','لما يبقى معاك كارتين دوس UNO! قبل ما تلعب الكارت اللي قبل الأخير، ولو نسيت بتسحب 2 عقوبة.','التراكم (لو مفعّل): +2 على +2 و+4 على +4 بيتجمعوا على اللاعب اللي بعده.','أول واحد يخلّص كروته يكسب الجولة ويأخد نقاط كروت الباقيين (الأرقام بقيمتها، الخاصة 20، الجوكر 50).'],
  c_old:['الكروت كلها (52 + ورقة الشايب 🃏) بتتوزع على اللاعبين.','كل لاعب بيرمي أي ورقتين متشابهتين في الرقم من أول اللعبة (أوتوماتيك).','على دورك، اسحب ورقة مقلوبة من اللاعب اللي بعدك، ولو لقيت لها زوج بيترمي الزوج.','اللي يخلّص ورقه يطلع من اللعبة، واللي يفضل معاه الشايب هو الخسران.','كل اللي نجوا بياخدوا نقطة.'],
  c_war:['الكروت بتتقسم بالتساوي على اللاعبين (من 2 لـ4).','كل دور الكل بيقلب أول ورقة، وأعلى ورقة (الآس الأعلى) تاخد الورق كله.','لو اتساوت أعلى ورقتين أو أكتر الورق بيتجمع وبيتقلب تاني والفايز ياخد الكل.','بتنتهي لما حد ياخد كل الكروت أو بعد 60 دور، وصاحب أكتر كروت يكسب نقطة.'],
  c_crazy:['كل لاعب 5 كروت (7 لو اتنين بس).','العب ورقة بنفس النوع ♠♥♦♣ أو نفس الرقم للورقة اللي على الطاولة.','الـ8 جوكر: تلعبه في أي وقت وتختار النوع الجديد.','مفيش ورقة تنفع؟ اسحب واحدة، لو تنفع العبها وإلا اضغط تخطّي.','أول واحد يخلّص كروته يكسب الجولة وياخد نقاط كروت الباقيين (الـ8 = 50، الصور = 10، الآس = 1).'],
  c_21:['الهدف توصل لـ21 أو أقرب ليها من غير ما تعدّي.','الآس يتحسب 1 أو 11، والصور (J, Q, K) بـ10، والباقي بقيمته.','على دورك: اسحب (Hit) أو وقّف (Stand). لو عدّيت 21 بتخسر.','بعد ما الكل يخلص، الموزّع (الكمبيوتر) بيسحب لحد ما يوصل 17 أو أكتر.','اللي أقرب للـ21 من الموزّع يكسب نقطة، والتعادل مفيهوش نقط. بلاك جاك (21 من أول ورقتين) أقوى من أي 21 عادي.']
};
const EMO=[..."😂😍😎🔥👏😭🤔👍🎉🙈😡💔"];

const $=s=>document.querySelector(s),app=$('#app');
const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rnd=n=>crypto.getRandomValues(new Uint32Array(1))[0]%n;
const shuf=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]]}return a};
const norm=s=>(s||'').trim().replace(/[\u064B-\u0652\u0640]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/\s+/g,' ');
const key=s=>norm(s).replace(/^ال(?=.)/,'');
const hash=async(p,rid)=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(rid+':'+p)))].map(x=>x.toString(16).padStart(2,'0')).join('');
const toast=(m,ok)=>{const t=$('#toast');t.textContent=m;t.style.display='block';t.style.background=ok?'var(--good)':'var(--bad)';clearTimeout(toast.t);toast.t=setTimeout(()=>t.style.display='none',3000)};
const av=n=>{const e=AVM[n];return e?`<i class="av emo">${AVSVG(e)||e}</i>`:`<i class="av" style="background:hsl(${[...String(n)].reduce((a,c)=>a+c.charCodeAt(0),0)*47%360} 65% 48%)">${esc([...String(n)][0]||'?')}</i>`;};
const _IC={"wheel": "<circle cx=\"12\" cy=\"12\" r=\"2\" /> <path d=\"M12 2v4\" /> <path d=\"m6.8 15-3.5 2\" /> <path d=\"m20.7 7-3.5 2\" /> <path d=\"M6.8 9 3.3 7\" /> <path d=\"m20.7 17-3.5-2\" /> <path d=\"m9 22 3-8 3 8\" /> <path d=\"M8 22h8\" /> <path d=\"M18 18.7a9 9 0 1 0-12 0\" />", "book": "<path d=\"M12 7v14\" /> <path d=\"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z\" />", "close": "<path d=\"M18 6 6 18\" /> <path d=\"m6 6 12 12\" />", "coin": "<circle cx=\"8\" cy=\"8\" r=\"6\" /> <path d=\"M18.09 10.37A6 6 0 1 1 10.34 18\" /> <path d=\"M7 6h1v4\" /> <path d=\"m16.71 13.88.7.71-2.82 2.82\" />", "gear": "<path d=\"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z\" /> <circle cx=\"12\" cy=\"12\" r=\"3\" />", "gift": "<rect x=\"3\" y=\"8\" width=\"18\" height=\"4\" rx=\"1\" /> <path d=\"M12 8v13\" /> <path d=\"M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7\" /> <path d=\"M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5\" />", "grid": "<rect width=\"7\" height=\"7\" x=\"3\" y=\"3\" rx=\"1\" /> <rect width=\"7\" height=\"7\" x=\"14\" y=\"3\" rx=\"1\" /> <rect width=\"7\" height=\"7\" x=\"14\" y=\"14\" rx=\"1\" /> <rect width=\"7\" height=\"7\" x=\"3\" y=\"14\" rx=\"1\" />", "home": "<path d=\"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8\" /> <path d=\"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\" />", "music": "<circle cx=\"8\" cy=\"18\" r=\"4\" /> <path d=\"M12 18V2l7 4\" />", "pen": "<path d=\"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z\" /> <path d=\"m15 5 4 4\" />", "play": "<polygon points=\"6 3 20 12 6 21 6 3\" />", "search": "<circle cx=\"11\" cy=\"11\" r=\"8\" /> <path d=\"m21 21-4.3-4.3\" />", "sound": "<path d=\"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z\" /> <path d=\"M16 9a5 5 0 0 1 0 6\" /> <path d=\"M19.364 18.364a9 9 0 0 0 0-12.728\" />", "star": "<path d=\"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z\" />", "trophy": "<path d=\"M6 9H4.5a2.5 2.5 0 0 1 0-5H6\" /> <path d=\"M18 9h1.5a2.5 2.5 0 0 0 0-5H18\" /> <path d=\"M4 22h16\" /> <path d=\"M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22\" /> <path d=\"M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22\" /> <path d=\"M18 2H6v7a6 6 0 0 0 12 0V2Z\" />", "user": "<path d=\"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2\" /> <circle cx=\"12\" cy=\"7\" r=\"4\" />", "sun": "<circle cx=\"12\" cy=\"12\" r=\"4\" /> <path d=\"M12 2v2\" /> <path d=\"M12 20v2\" /> <path d=\"m4.93 4.93 1.41 1.41\" /> <path d=\"m17.66 17.66 1.41 1.41\" /> <path d=\"M2 12h2\" /> <path d=\"M20 12h2\" /> <path d=\"m6.34 17.66-1.41 1.41\" /> <path d=\"m19.07 4.93-1.41 1.41\" />", "moon": "<path d=\"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z\" />", "lock": "<rect width=\"18\" height=\"11\" x=\"3\" y=\"11\" rx=\"2\" ry=\"2\" /> <path d=\"M7 11V7a5 5 0 0 1 10 0v4\" />", "all": "<rect width=\"7\" height=\"7\" x=\"3\" y=\"3\" rx=\"1\" /> <rect width=\"7\" height=\"7\" x=\"14\" y=\"3\" rx=\"1\" /> <rect width=\"7\" height=\"7\" x=\"14\" y=\"14\" rx=\"1\" /> <rect width=\"7\" height=\"7\" x=\"3\" y=\"14\" rx=\"1\" />", "dice": "<rect width=\"12\" height=\"12\" x=\"2\" y=\"10\" rx=\"2\" ry=\"2\" /> <path d=\"m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6\" /> <path d=\"M6 18h.01\" /> <path d=\"M10 14h.01\" /> <path d=\"M15 6h.01\" /> <path d=\"M18 9h.01\" />", "bus": "<path d=\"M8 6v6\" /> <path d=\"M15 6v6\" /> <path d=\"M2 12h19.6\" /> <path d=\"M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3\" /> <circle cx=\"7\" cy=\"18\" r=\"2\" /> <path d=\"M9 18h5\" /> <circle cx=\"16\" cy=\"18\" r=\"2\" />", "joy": "<path d=\"M21 17a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2Z\" /> <path d=\"M6 15v-2\" /> <path d=\"M12 15V9\" /> <circle cx=\"12\" cy=\"6\" r=\"3\" />", "users": "<path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\" /> <circle cx=\"9\" cy=\"7\" r=\"4\" /> <path d=\"M22 21v-2a4 4 0 0 0-3-3.87\" /> <path d=\"M16 3.13a4 4 0 0 1 0 7.75\" />", "zap": "<path d=\"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z\" />", "crown": "<path d=\"M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z\" /> <path d=\"M5 21h14\" />", "check": "<path d=\"M20 6 9 17l-5-5\" />", "clock": "<circle cx=\"12\" cy=\"12\" r=\"10\" /> <polyline points=\"12 6 12 12 16 14\" />", "heart": "<path d=\"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z\" />", "share": "<circle cx=\"18\" cy=\"5\" r=\"3\" /> <circle cx=\"6\" cy=\"12\" r=\"3\" /> <circle cx=\"18\" cy=\"19\" r=\"3\" /> <line x1=\"8.59\" x2=\"15.42\" y1=\"13.51\" y2=\"17.49\" /> <line x1=\"15.41\" x2=\"8.59\" y1=\"6.51\" y2=\"10.49\" />", "copy": "<rect width=\"14\" height=\"14\" x=\"8\" y=\"8\" rx=\"2\" ry=\"2\" /> <path d=\"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2\" />", "plus": "<path d=\"M5 12h14\" /> <path d=\"M12 5v14\" />", "refresh": "<path d=\"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8\" /> <path d=\"M3 3v5h5\" />", "menu": "<line x1=\"4\" x2=\"20\" y1=\"12\" y2=\"12\" /> <line x1=\"4\" x2=\"20\" y1=\"6\" y2=\"6\" /> <line x1=\"4\" x2=\"20\" y1=\"18\" y2=\"18\" />", "chat": "<path d=\"M7.9 20A9 9 0 1 0 4 16.1L2 22Z\" />", "send": "<path d=\"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z\" /> <path d=\"m21.854 2.147-10.94 10.939\" />", "globe": "<circle cx=\"12\" cy=\"12\" r=\"10\" /> <path d=\"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20\" /> <path d=\"M2 12h20\" />", "shield": "<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\" />", "target": "<circle cx=\"12\" cy=\"12\" r=\"10\" /> <circle cx=\"12\" cy=\"12\" r=\"6\" /> <circle cx=\"12\" cy=\"12\" r=\"2\" />", "palette": "<circle cx=\"13.5\" cy=\"6.5\" r=\".5\" fill=\"currentColor\" /> <circle cx=\"17.5\" cy=\"10.5\" r=\".5\" fill=\"currentColor\" /> <circle cx=\"8.5\" cy=\"7.5\" r=\".5\" fill=\"currentColor\" /> <circle cx=\"6.5\" cy=\"12.5\" r=\".5\" fill=\"currentColor\" /> <path d=\"M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z\" />", "layers": "<path d=\"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z\" /> <path d=\"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12\" /> <path d=\"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17\" />", "gamepad": "<line x1=\"6\" x2=\"10\" y1=\"11\" y2=\"11\" /> <line x1=\"8\" x2=\"8\" y1=\"9\" y2=\"13\" /> <line x1=\"15\" x2=\"15.01\" y1=\"12\" y2=\"12\" /> <line x1=\"18\" x2=\"18.01\" y1=\"10\" y2=\"10\" /> <path d=\"M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z\" />", "bag": "<path d=\"M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z\" /> <path d=\"M3 6h18\" /> <path d=\"M16 10a4 4 0 0 1-8 0\" />", "ticket": "<path d=\"M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z\" /> <path d=\"M13 5v2\" /> <path d=\"M13 17v2\" /> <path d=\"M13 11v2\" />", "gem": "<path d=\"M6 3h12l4 6-10 13L2 9Z\" /> <path d=\"M11 3 8 9l4 13 4-13-3-6\" /> <path d=\"M2 9h20\" />", "help": "<circle cx=\"12\" cy=\"12\" r=\"10\" /> <path d=\"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3\" /> <path d=\"M12 17h.01\" />", "eye": "<path d=\"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0\" /> <circle cx=\"12\" cy=\"12\" r=\"3\" />", "trash": "<path d=\"M3 6h18\" /> <path d=\"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6\" /> <path d=\"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2\" /> <line x1=\"10\" x2=\"10\" y1=\"11\" y2=\"17\" /> <line x1=\"14\" x2=\"14\" y1=\"11\" y2=\"17\" />", "download": "<path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\" /> <polyline points=\"7 10 12 15 17 10\" /> <line x1=\"12\" x2=\"12\" y1=\"15\" y2=\"3\" />", "upload": "<path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\" /> <polyline points=\"17 8 12 3 7 8\" /> <line x1=\"12\" x2=\"12\" y1=\"3\" y2=\"15\" />", "wifi": "<path d=\"M12 20h.01\" /> <path d=\"M2 8.82a15 15 0 0 1 20 0\" /> <path d=\"M5 12.859a10 10 0 0 1 14 0\" /> <path d=\"M8.5 16.429a5 5 0 0 1 7 0\" />", "login": "<path d=\"M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4\" /> <polyline points=\"10 17 15 12 10 7\" /> <line x1=\"15\" x2=\"3\" y1=\"12\" y2=\"12\" />", "logout": "<path d=\"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4\" /> <polyline points=\"16 17 21 12 16 7\" /> <line x1=\"21\" x2=\"9\" y1=\"12\" y2=\"12\" />", "back": "<path d=\"m12 19-7-7 7-7\" /> <path d=\"M19 12H5\" />", "next": "<path d=\"M5 12h14\" /> <path d=\"m12 5 7 7-7 7\" />", "down": "<path d=\"m6 9 6 6 6-6\" />", "left": "<path d=\"m15 18-6-6 6-6\" />", "right": "<path d=\"m9 18 6-6-6-6\" />", "vibrate": "<path d=\"m2 8 2 2-2 2 2 2-2 2\" /> <path d=\"m22 8-2 2 2 2-2 2 2 2\" /> <rect width=\"8\" height=\"14\" x=\"8\" y=\"5\" rx=\"1\" />", "party": "<path d=\"M5.8 11.3 2 22l10.7-3.79\" /> <path d=\"M4 3h.01\" /> <path d=\"M22 8h.01\" /> <path d=\"M15 2h.01\" /> <path d=\"M22 20h.01\" /> <path d=\"m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10\" /> <path d=\"m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17\" /> <path d=\"m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7\" /> <path d=\"M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z\" />", "sparkle": "<path d=\"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z\" /> <path d=\"M20 3v4\" /> <path d=\"M22 5h-4\" /> <path d=\"M4 17v2\" /> <path d=\"M5 18H3\" />", "flag": "<path d=\"M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z\" /> <line x1=\"4\" x2=\"4\" y1=\"22\" y2=\"15\" />", "medal": "<path d=\"M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15\" /> <path d=\"M11 12 5.12 2.2\" /> <path d=\"m13 12 5.88-9.8\" /> <path d=\"M8 7h8\" /> <circle cx=\"12\" cy=\"17\" r=\"5\" /> <path d=\"M12 18v-2h-.5\" />", "flame": "<path d=\"M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z\" />", "info": "<circle cx=\"12\" cy=\"12\" r=\"10\" /> <path d=\"M12 16v-4\" /> <path d=\"M12 8h.01\" />", "bell": "<path d=\"M10.268 21a2 2 0 0 0 3.464 0\" /> <path d=\"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326\" />", "head": "<path d=\"M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3\" />", "image": "<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\" ry=\"2\" /> <circle cx=\"9\" cy=\"9\" r=\"2\" /> <path d=\"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21\" />", "smile": "<circle cx=\"12\" cy=\"12\" r=\"10\" /> <path d=\"M8 14s1.5 2 4 2 4-2 4-2\" /> <line x1=\"9\" x2=\"9.01\" y1=\"9\" y2=\"9\" /> <line x1=\"15\" x2=\"15.01\" y1=\"9\" y2=\"9\" />", "hourglass": "<path d=\"M5 22h14\" /> <path d=\"M5 2h14\" /> <path d=\"M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22\" /> <path d=\"M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2\" />", "sword": "<polyline points=\"14.5 17.5 3 6 3 3 6 3 17.5 14.5\" /> <line x1=\"13\" x2=\"19\" y1=\"19\" y2=\"13\" /> <line x1=\"16\" x2=\"20\" y1=\"16\" y2=\"20\" /> <line x1=\"19\" x2=\"21\" y1=\"21\" y2=\"19\" /> <polyline points=\"14.5 6.5 18 3 21 3 21 6 17.5 9.5\" /> <line x1=\"5\" x2=\"9\" y1=\"14\" y2=\"18\" /> <line x1=\"7\" x2=\"4\" y1=\"17\" y2=\"20\" /> <line x1=\"3\" x2=\"5\" y1=\"19\" y2=\"21\" />", "up": "<path d=\"m5 12 7-7 7 7\" /> <path d=\"M12 19V5\" />", "dnown": "<path d=\"M12 5v14\" /> <path d=\"m19 12-7 7-7-7\" />", "ok": "<circle cx=\"12\" cy=\"12\" r=\"10\" /> <path d=\"m9 12 2 2 4-4\" />", "no": "<circle cx=\"12\" cy=\"12\" r=\"10\" /> <path d=\"m15 9-6 6\" /> <path d=\"m9 9 6 6\" />", "pyr": "<path d=\"M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z\" />"};
const EGF='<svg class="egf" viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="7" fill="#ce1126"/><rect y="7" width="30" height="6" fill="#fff"/><rect y="13" width="30" height="7" fill="#111"/><circle cx="15" cy="10" r="2.2" fill="#c09300"/></svg>';
const IC=n=>`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${_IC[n]||''}</svg>`;
const isDark=()=>document.documentElement.dataset.theme==='dark';
const setTheme=t=>{document.documentElement.dataset.theme=t;localStorage.theme=t;document.querySelectorAll('[data-act="theme"]').forEach(b=>b.innerHTML=IC(isDark()?'sun':'moon'))};
setTheme(localStorage.theme||'dark');

const EMU=/[?&]emu=1/.test(location.search)&&(location.protocol==='file:'||location.hostname==='localhost');const APP=initializeApp(EMU?{...firebaseConfig,projectId:'demo-test',databaseURL:'https://demo-test-default-rtdb.firebaseio.com'}:firebaseConfig);const db=getDatabase(APP);if(EMU)connectDatabaseEmulator(db,'127.0.0.1',9000);
const pid=sessionStorage.pid||(sessionStorage.pid='p'+Math.random().toString(36).slice(2,9));
const S={cg:null,miss:{},pickWild:null,ck:'',prev:{h:[],top:-1,v:-1},sub:null,pl:{},ld:0,em:{},kind:null,chat:{},seen:0,chatOpen:false,me:localStorage.name||null,rid:null,meta:null,players:{},game:null,used:[],hist:{},r:{},idx:{},offset:0,round:0,view:'',unsub:{},sent:0,mv:'',mine:[],score:0,jit:Math.random()*1000,gone:0,ask:null,pending:null,creating:false,form:{priv:false,timed:false}};
const base=()=>`rooms/${S.rid}`;
const now=()=>Date.now()+S.offset;
const isAdmin=()=>S.meta?.adminId===pid;
const gameActive=()=>{const ph=S.game?.phase;return !!S.rid&&!!ph&&ph!=='lobby'&&ph!=='final'&&!(ph==='cards'&&S.cg?.over)};
const sub=(k,p,cb)=>{S.unsub[k]&&S.unsub[k]();S.unsub[k]=onValue(ref(db,p),x=>cb(x.val()))};
const unsubAll=p=>Object.keys(S.unsub).filter(k=>k.startsWith(p)).forEach(k=>{S.unsub[k]();delete S.unsub[k]});

/* ===== حساب جوجل + ليفل + كوينز ===== */
const AUTH=getAuth(APP);
if(EMU){connectAuthEmulator(AUTH,'http://127.0.0.1:9099',{disableWarnings:true});window.__acc={signIn:e=>signInWithCredential(AUTH,GoogleAuthProvider.credential(JSON.stringify({sub:e,email:e,email_verified:true}))),get:()=>ACC.p,uid:()=>ACC.u&&ACC.u.uid,db:()=>db}}
const ACC={u:null,p:null,ready:false,busy:false};
const lvOf=xp=>Math.min(30,1+Math.floor((+xp||0)/100));
const lvPct=xp=>{const l=lvOf(xp);return l>=30?100:(xp%100)};
const accChip=()=>ACC.u?`<button class="ghost sm accb" data-act="acc" aria-label="حسابي"><b>Lv ${lvOf(ACC.p&&ACC.p.xp)}</b> ${IC('coin')} ${(ACC.p&&ACC.p.coins)||0}</button>`:`<button class="ghost sm accb" data-act="gl" aria-label="دخول بحساب جوجل">${IC('user')} دخول</button>`;
async function accLoad(u){
  const r=ref(db,'users/'+u.uid);
  let s=await get(r);
  if(!s.exists()){await set(r,{name:String(S.me||u.displayName||'لاعب').slice(0,24),xp:0,coins:0});s=await get(r)}
  let p=s.val();
  ACC.p=p;
  const nowS=Date.now()+(S.offset||0);
  if(!p.lastDaily||nowS-p.lastDaily>=86400000){
    try{await update(r,{coins:(p.coins||0)+10,lastDaily:{'.sv':'timestamp'}});const s2=await get(r);ACC.p=s2.val();toast('🎁 جايزة اليوم: +10 كوينز',1);try{SND.play('win')}catch(e){}}catch(e){}
  }
  ACC.ready=true;render();
}
onAuthStateChanged(AUTH,u=>{ACC.u=u;ACC.p=null;ACC.ready=false;if(u)accLoad(u).catch(e=>{console.warn('acc',e)});else render()});
const GCID='151299306315-dr8lh64hntqmbu29bepkb0rfo0gjueeb.apps.googleusercontent.com';
function gisLoad(){return new Promise((res,rej)=>{if(window.google&&google.accounts&&google.accounts.id)return res();const s=document.createElement('script');s.src='https://accounts.google.com/gsi/client';s.async=true;s.onload=()=>res();s.onerror=()=>rej(new Error('gsi'));document.head.appendChild(s)})}
async function accSignIn(){
  let d=document.querySelector('#accd');if(!d){d=document.createElement('div');d.id='accd';document.body.appendChild(d)}
  d.innerHTML='<div class="ovl"><div class="card" style="text-align:center;width:min(100%,360px)"><h3>🔐 دخول بحساب جوجل</h3><p class="small">دوس الزرار واختار حسابك</p><div id="gbtn" style="display:flex;justify-content:center;min-height:44px"></div><p class="small" id="gerr"></p><button class="ghost sm" data-act="accclose">إغلاق</button></div></div>';
  try{
    await gisLoad();
    google.accounts.id.initialize({client_id:GCID,callback:async r=>{try{await signInWithCredential(AUTH,GoogleAuthProvider.credential(r.credential));d.innerHTML=''}catch(e){const g=document.querySelector('#gerr');if(g)g.textContent='معرفتش أدخل: '+(e.code||'خطأ')}},ux_mode:'popup',auto_select:false,use_fedcm_for_button:true});
    google.accounts.id.renderButton(document.querySelector('#gbtn'),{theme:'outline',size:'large',type:'standard',text:'signin_with',shape:'pill',locale:'ar'});
  }catch(e){const g=document.querySelector('#gerr');if(g)g.textContent='معرفتش أحمّل دخول جوجل، جرّب تاني'}
}
async function accAward(win){
  if(!ACC.u||!ACC.p)return;
  const add=win?25:8;
  try{const r=ref(db,'users/'+ACC.u.uid+'/xp');const nx=Math.min((ACC.p.xp||0)+add,(ACC.p.xp||0)+50);await set(r,nx);const was=lvOf(ACC.p.xp);ACC.p.xp=nx;if(lvOf(nx)>was)toast('🆙 ليفل جديد: '+lvOf(nx),1);render()}catch(e){}
}
function accCheck(st){
  if(!ACC.u||!st||!st.over||st.aborted||S.awarded===st.gid||!st.order||!st.order.includes(pid))return;
  S.awarded=st.gid;accAward(!!(st.pts&&st.pts[pid]));
}
function accDlg(open){
  let d=document.querySelector('#accd');if(!d){d=document.createElement('div');d.id='accd';document.body.appendChild(d)}
  if(!open){d.innerHTML='';return}
  const p=ACC.p||{xp:0,coins:0},l=lvOf(p.xp);
  d.innerHTML=`<div class="ovl"><div class="card" style="text-align:center;width:min(100%,380px)"><h3>👤 حسابي</h3><p class="small">${esc((ACC.u&&ACC.u.email)||'')}</p><div style="font-size:2rem;font-weight:900">Lv ${l}${l>=30?' (أعلى ليفل)':''}</div><div class="bar" style="margin:8px 0"><i style="width:${lvPct(p.xp||0)}%;animation:none"></i></div><p class="small">${p.xp||0} نقطة خبرة • كل 100 = ليفل جديد (الحد 30)</p><div style="font-size:1.6rem;margin:8px 0">🪙 ${p.coins||0} كوينز</div><p class="small">جايزة يومية 10 كوينز كل 24 ساعة لما تدخل. الكوينز هتتصرف في متجر اللعبة بعدين.</p><button class="big" data-act="accclose">تمام</button><button class="big ghost" data-act="accout">تسجيل خروج</button></div></div>`;
}

onValue(ref(db,'.info/serverTimeOffset'),s=>S.offset=s.val()||0);
onValue(ref(db,'.info/connected'),s=>{if(s.val()&&S.me&&S.rid)register()});
sub('idx','idx',v=>{S.idx=v||{};S.ld|=1;render()});
sub('pl','pl',v=>{S.pl=v||{};S.ld|=2;render()});
function sweep(){
  if(S.ld!==3||S.rid)return;
  Object.keys(S.idx).forEach(rid=>{
    if(Object.keys(S.pl[rid]||{}).length){delete S.em[rid];return}
    S.em[rid]=S.em[rid]||Date.now();
    if(Date.now()-S.em[rid]>120000){delete S.em[rid];set(ref(db,'rooms/'+rid),null);set(ref(db,'idx/'+rid),null)}
  });
}

/* ===== الدخول والاسم ===== */
function login(name){
  name=name.trim().slice(0,16);
  if(!name)return toast('اكتب اسمك الأول');
  S.me=name;localStorage.name=name;S.view='';render();
  if(sessionStorage.rid)enter(sessionStorage.rid);else if(S.target)joinRoom(S.target);
}
function dlg(open){
  const d=$('#dlg');d.hidden=!open;
  d.innerHTML=open?`<div class="ov"><div class="card"><h3>✏️ غيّر اسمك</h3><input id="nn" maxlength="16" value="${esc(S.me)}" autocomplete="off" style="margin-top:10px">${avPick(myAv())}<div class="rm" style="margin-top:12px"><button data-act="rnsave">حفظ</button><button class="ghost" data-act="rncancel">إلغاء</button></div></div></div>`:'';
  if(open)$('#nn').focus();
}
async function saveName(){
  if(gameActive())return toast('مينفعش تغيّر اسمك واللعب شغال 🎮');
  const n=$('#nn').value.trim().slice(0,16);
  if(!n)return toast('اكتب اسم');
  if(S.rid){
    if(Object.entries(S.players).some(([id,p])=>id!==pid&&p.name.toLowerCase()===n.toLowerCase()))return toast('الاسم ده واخده حد في الغرفة');
    const up={[`rooms/${S.rid}/players/${pid}/name`]:n,[`pl/${S.rid}/${pid}`]:n};
    if(isAdmin()){up[`rooms/${S.rid}/meta/adminName`]=n;up[`idx/${S.rid}/admin`]=n}
    await update(ref(db),up);
  }
  S.me=n;localStorage.name=n;dlg(false);S.view='';render();toast('اتغير الاسم ✅',1);
}

/* ===== الغرف ===== */
async function joinRoom(rid,pw){
  const [m,p,co,cv]=await Promise.all([get(ref(db,`rooms/${rid}/meta`)),get(ref(db,`rooms/${rid}/players`)),get(ref(db,`rooms/${rid}/cg/order`)),get(ref(db,`rooms/${rid}/cg/over`))]);
  const meta=m.val(),ps=p.val()||{},ord=co.val()||[];
  if(!meta){S.pending=null;render();return toast('الغرفة مش موجودة')}
  const G=GAMES[meta.kind||'dev']||GAMES.dev;
  const need=meta.ph&&meta.adminId!==pid;
  if(need&&pw===undefined){S.pending={rid,name:meta.name};return render()}
  if(need&&await hash(pw,rid)!==meta.ph)return toast('الباسورد غلط');
  if(G.max&&!ps[pid]&&Object.keys(ps).length>=G.max)return toast('الغرفة اتملت 🚫');
  if(!G.ab&&ord.length&&!cv.val()&&!ord.includes(pid))return toast('اللعب شغال في الغرفة دي، جرّب بعد ما الجولة تخلص ⏳');
  if(Object.entries(ps).some(([id,x])=>id!==pid&&x.name.toLowerCase()===S.me.toLowerCase()))return toast('في لاعب بنفس اسمك في الغرفة دي، غيّر اسمك');
  S.pending=null;enter(rid);
}
async function quickJoin(){
  const idx=(await get(ref(db,'idx'))).val()||{},c=[];
  await Promise.all(Object.entries(idx).filter(([,r])=>!r.priv&&(r.kind||'dev')===S.kind).map(async([rid,r])=>{
    const G=GAMES[r.kind||'dev'];
    const [p,ph]=await Promise.all([get(ref(db,`rooms/${rid}/players`)),get(ref(db,`rooms/${rid}/game/phase`))]);
    const ps=p.val()||{};
    if(!Object.keys(ps).length)return;
    if(G.max&&Object.keys(ps).length>=G.max)return;
    if(!G.ab&&ph.val()==='cards')return;
    if(Object.values(ps).some(x=>x.name.toLowerCase()===S.me.toLowerCase()))return;
    c.push({rid,lobby:!ph.val()||['lobby','final'].includes(ph.val())});
  }));
  const l=c.filter(x=>x.lobby),pool=l.length?l:c;
  if(!pool.length)return toast('مفيش غرف عامة شغالة دلوقتي، اعمل غرفة جديدة');
  joinRoom(pool[rnd(pool.length)].rid,'');
}
async function enter(rid){
  const m=(await get(ref(db,`rooms/${rid}/meta`))).val();
  if(!m){sessionStorage.removeItem('rid');return render()}
  Object.assign(S,{cg:null,miss:{},pickWild:null,ask:null,rid,kind:m.kind||'dev',round:0,game:null,meta:m,players:{},used:[],hist:{},r:{},chat:{},seen:0,chatOpen:false,gone:0,view:'',score:+sessionStorage['s_'+rid]||0});
  sessionStorage.rid=rid;
  sub('x:m',base()+'/meta',v=>{if(!v){leave(true);toast('الغرفة اتقفلت')}else{S.meta=v;render()}});
  sub('x:p',base()+'/players',v=>{S.players=v||{};Object.entries(S.players).forEach(([k,x])=>{if(x&&x.name)NMC[k]=x.name});AVM={};Object.values(S.players).forEach(p=>{if(p.av)AVM[p.name]=p.av});if(S.players[pid]){S.score=S.players[pid].score||0;sessionStorage['s_'+rid]=S.score}render()});
  sub('x:u',base()+'/used',v=>S.used=v||[]);
  sub('x:fx',base()+'/fx',v=>{if(v&&v.t&&Math.abs(now()-v.t)<4000&&S.fxs!==v.r){S.fxs=v.r;if(localStorage.sfx!=='0')FUN.play(v.k);toast((v.n||'')+': '+(FXL[v.k]||''),1)}});
  sub('x:h',base()+'/hist',v=>{S.hist=v||{};render()});
  sub('x:c',base()+'/chat',v=>{S.chat=v||{};chatMsgs()});
  sub('x:cg',base()+'/cg',v=>{S.cg=v;render()});
  sub('x:g',base()+'/game',v=>{
    S.game=v;const r=v?.round||0;
    if(r!==S.round){S.round=r;S.unsub['x:r']&&S.unsub['x:r']();S.r={};if(r)sub('x:r',`${base()}/r/${r}`,x=>{S.r=x||{};render()})}
    render();
  });
  register();chatShell();render();
}
function register(){
  const pr=ref(db,`${base()}/players/${pid}`),pp=ref(db,`pl/${S.rid}/${pid}`);
  set(pr,{name:S.me,score:S.score,t:Date.now(),av:myAv()});onDisconnect(pr).remove();
  set(pp,S.me);onDisconnect(pp).remove();
}
function leave(silent){
  if(S.rid){
    const rid=S.rid,pr=ref(db,`rooms/${rid}/players/${pid}`),pp=ref(db,`pl/${rid}`+'/'+pid);
    const last=!silent&&S.players[pid]&&Object.keys(S.players).length<=1;
    unsubAll('x:');onDisconnect(pr).cancel();onDisconnect(pp).cancel();
    if(!silent){set(pr,null);set(pp,null)}
    if(last){set(ref(db,'rooms/'+rid),null);set(ref(db,'idx/'+rid),null);set(ref(db,'pl/'+rid),null)}
  }
  sessionStorage.removeItem('rid');
  Object.assign(S,{rid:null,meta:null,game:null,cg:null,players:{},r:{},chat:{},chatOpen:false,view:''});
  chatShell();render();
}
async function mk(){
  const name=$('#rn').value.trim().slice(0,24),pw=$('#rp').value,f=S.form,kind=S.kind||'dev',ab=kind==='dev'||kind==='classic';
  if(!name)return toast('اكتب اسم الغرفة');
  if(f.priv&&!pw)return toast('اكتب باسورد الغرفة');
  let cats=CLASSIC,rounds=0,limit=0;
  if(ab){
    if(kind==='dev'){
      cats=[...document.querySelectorAll('.chip.on[data-i]')].map(c=>CATS[+c.dataset.i]);
      if(cats.length<5)return toast('اختار 5 تصنيفات على الأقل');
    }
    rounds=Math.min(20,Math.max(1,Math.round(+$('#rr').value||5)));
    limit=f.timed?Math.round(Math.max(.5,+$('#tm').value||2)*60):0;
  }
  const rid='r'+Math.random().toString(36).slice(2,8),ph=f.priv?await hash(pw,rid):'';
  const meta={name,kind,adminId:pid,adminName:S.me,ph,rounds,limit};
  if(ab)meta.cats=cats;
  else if(isQ(kind)){
    const qc=[...document.querySelectorAll('.chip.on[data-ck]')].map(c=>c.dataset.ck);
    if(!qc.length)return toast('اختار قسم واحد على الأقل');
    meta.opts={cats:qc,n:Math.min(60,Math.max(5,Math.round(+$('#qn').value||10))),on:kind==='qm'?true:f.on!==false,lead:kind==='qm'?Math.min(20,Math.max(2,Math.round(+$('#ql').value||5))):0};
  }else meta.opts={stack:!!f.stack};
  await set(ref(db,`rooms/${rid}/meta`),meta);
  await set(ref(db,'idx/'+rid),{name,kind,priv:f.priv,admin:S.me,t:Date.now(),st:'wait'});
  S.creating=false;enter(rid);
}

/* ===== محركات ألعاب الكروت ===== */
const A=x=>x||[];
const clone=o=>JSON.parse(JSON.stringify(o));
const H=(st,p)=>st.hands[p]||(st.hands[p]=[]);
function drawN(st,n){
  const out=[];st.deck=A(st.deck);st.disc=A(st.disc);
  for(let i=0;i<n;i++){
    if(!st.deck.length&&st.disc.length>1){const t=st.disc.pop();st.deck=shuf(st.disc);st.disc=[t]}
    if(!st.deck.length)break;
    out.push(st.deck.pop());
  }
  return out;
}
const give=(st,p,n)=>{const h=H(st,p);drawN(st,n).forEach(c=>h.push(c))};
const nxt=(st,k=1)=>{const n=st.order.length;st.turn=((st.turn+st.dir*k)%n+n)%n;st.drew=-1};
const UC=['#e63946','#ffb703','#2fb344','#2f6fed'],UCN=['أحمر','أصفر','أخضر','أزرق'];
const unoC=id=>{if(id>=100)return{c:-1,v:id<104?'W':'F'};const c=id/25|0,k=id%25;return{c,v:k===0?0:k<=9?k:k<=18?k-9:k<=20?'S':k<=22?'R':'D'}};
const unoPts=id=>{const v=unoC(id).v;return typeof v==='number'?v:v==='W'||v==='F'?50:20};
const unoOk=(st,id)=>{
  const c=unoC(id),d=A(st.disc),t=unoC(d[d.length-1]);
  if(st.pend>0)return !!st.stack&&((st.pt==='D'&&c.v==='D')||(st.pt==='F'&&c.v==='F'));
  return c.c<0||c.c===st.col||c.v===t.v;
};
const UNO={
  init(ids,o){
    const st={kind:'uno',v:0,order:ids,turn:0,dir:1,hands:{},deck:shuf([...Array(108).keys()]),disc:[],pend:0,pt:'',drew:-1,uc:{},stack:!!(o&&o.stack)};
    ids.forEach(p=>st.hands[p]=[]);
    for(let i=0;i<7;i++)ids.forEach(p=>st.hands[p].push(st.deck.pop()));
    let c;do{c=st.deck.pop();if(typeof unoC(c).v==='number')break;st.deck.unshift(c)}while(true);
    st.disc=[c];st.col=unoC(c).c;return st;
  },
  act(o,p,a){
    const st=clone(o),n=st.order.length;
    if(st.over||!st.order.includes(p))return null;
    const hand=H(st,p);st.uc=st.uc||{};
    if(a.t==='uno'){if(hand.length>2||hand.length<1)return null;st.uc[p]=1;st.ev={p,t:'uno'};st.v++;return st}
    if(p!==st.order[st.turn])return null;
    if(a.t==='draw'){
      if(st.drew>=0)return null;
      if(st.pend>0){give(st,p,st.pend);st.ev={p,t:'pen',n:st.pend};st.pend=0;st.pt='';nxt(st)}
      else{const c=drawN(st,1)[0];if(c==null)nxt(st);else{hand.push(c);st.ev={p,t:'draw'};if(unoOk(st,c))st.drew=c;else nxt(st)}}
      st.v++;return st;
    }
    if(a.t==='pass'){if(st.drew<0)return null;nxt(st);st.v++;return st}
    if(a.t!=='play')return null;
    const id=a.id;
    if(!hand.includes(id)||(st.drew>=0&&id!==st.drew)||!unoOk(st,id))return null;
    const c=unoC(id);
    hand.splice(hand.indexOf(id),1);st.disc=A(st.disc);st.disc.push(id);
    st.col=c.c<0?(a.col>=0&&a.col<4?a.col:0):c.c;
    st.last={p,id};st.ev={p,t:'play'};
    if(!hand.length){st.over=1;st.winner=p;let s=0;st.order.forEach(q=>{if(q!==p)H(st,q).forEach(x=>s+=unoPts(x))});st.pts={[p]:s};st.v++;return st}
    if(hand.length===1&&!st.uc[p]){give(st,p,2);st.ev={p,t:'pen',n:2}}
    st.uc[p]=0;
    const nq=st.order[((st.turn+st.dir)%n+n)%n];
    if(c.v==='S')nxt(st,2);
    else if(c.v==='R'){st.dir*=-1;if(n===2)nxt(st,2);else nxt(st)}
    else if(c.v==='D'){if(st.stack){st.pend+=2;st.pt='D';nxt(st)}else{give(st,nq,2);nxt(st,2)}}
    else if(c.v==='F'){if(st.stack){st.pend+=4;st.pt='F';nxt(st)}else{give(st,nq,4);nxt(st,2)}}
    else nxt(st);
    st.v++;return st;
  }
};
const ceR=id=>id%13,ceS=id=>id/13|0;
const cePts=id=>{const r=ceR(id);return r===7?50:r===0?1:r>=10?10:r+1};
const ceOk=(st,id)=>{const d=A(st.disc),t=d[d.length-1];return ceR(id)===7||ceS(id)===st.suit||ceR(id)===ceR(t)};
const CE={
  init(ids){
    const st={kind:'c_crazy',v:0,order:ids,turn:0,dir:1,hands:{},deck:shuf([...Array(52).keys()]),disc:[],drew:-1};
    ids.forEach(p=>st.hands[p]=[]);
    const k=ids.length===2?7:5;
    for(let i=0;i<k;i++)ids.forEach(p=>st.hands[p].push(st.deck.pop()));
    let c;do{c=st.deck.pop();if(ceR(c)!==7)break;st.deck.unshift(c)}while(true);
    st.disc=[c];st.suit=ceS(c);return st;
  },
  act(o,p,a){
    const st=clone(o);
    if(st.over||!st.order.includes(p)||p!==st.order[st.turn])return null;
    const hand=H(st,p);
    if(a.t==='draw'){
      if(st.drew>=0)return null;
      const c=drawN(st,1)[0];
      if(c==null)nxt(st);else{hand.push(c);st.ev={p,t:'draw'};if(ceOk(st,c))st.drew=c;else nxt(st)}
      st.v++;return st;
    }
    if(a.t==='pass'){if(st.drew<0)return null;nxt(st);st.v++;return st}
    if(a.t!=='play')return null;
    const id=a.id;
    if(!hand.includes(id)||(st.drew>=0&&id!==st.drew)||!ceOk(st,id))return null;
    hand.splice(hand.indexOf(id),1);st.disc=A(st.disc);st.disc.push(id);
    st.suit=ceR(id)===7?(a.col>=0&&a.col<4?a.col:0):ceS(id);
    st.last={p,id};st.ev={p,t:'play'};
    if(!hand.length){st.over=1;st.winner=p;let s=0;st.order.forEach(q=>{if(q!==p)H(st,q).forEach(x=>s+=cePts(x))});st.pts={[p]:s};st.v++;return st}
    nxt(st);st.v++;return st;
  }
};
const pairOff=h=>{const by={};h.forEach(c=>{const r=c===52?'j':c%13;(by[r]=by[r]||[]).push(c)});const out=[];Object.values(by).forEach(g=>{if(g.length%2)out.push(g[0])});return shuf(out)};
const oldActive=st=>st.order.filter(p=>A(st.hands[p]).length>0);
const oldTarget=(st,p)=>{const n=st.order.length,i=st.order.indexOf(p);for(let k=1;k<n;k++){const q=st.order[(i+k)%n];if(A(st.hands[q]).length)return q}return null};
const OLD={
  init(ids){
    const st={kind:'c_old',v:0,order:ids,turn:0,hands:{}};
    ids.forEach(p=>st.hands[p]=[]);
    shuf([...Array(53).keys()]).forEach((c,i)=>st.hands[ids[i%ids.length]].push(c));
    ids.forEach(p=>st.hands[p]=pairOff(st.hands[p]));
    const act=oldActive(st);st.turn=Math.max(0,st.order.indexOf(act[0]));
    return st;
  },
  act(o,p,a){
    const st=clone(o);
    if(st.over||a.t!=='pick'||p!==st.order[st.turn])return null;
    const q=oldTarget(st,p);if(q==null)return null;
    const th=H(st,q),mh=H(st,p);
    if(!(a.i>=0&&a.i<th.length))return null;
    const c=th.splice(a.i,1)[0];
    let paired=false;
    if(c!==52){const j=mh.findIndex(x=>x!==52&&x%13===c%13);if(j>=0){mh.splice(j,1);paired=true}}
    if(!paired)mh.push(c);
    st.hands[p]=shuf(mh);st.ev={p,q,t:paired?'pair':'take'};
    const act=oldActive(st);
    if(act.length<=1){st.over=1;st.loser=act[0]||null;st.pts={};st.order.forEach(x=>{if(x!==st.loser)st.pts[x]=1});st.v++;return st}
    const n=st.order.length,i=st.order.indexOf(p);
    for(let k=1;k<=n;k++){const r=st.order[(i+k)%n];if(A(st.hands[r]).length){st.turn=st.order.indexOf(r);break}}
    st.v++;return st;
  }
};
const warV=id=>{const r=id%13;return r===0?14:r+1};
const WAR={
  init(ids){
    const st={kind:'c_war',v:0,order:ids,turn:0,hands:{},rd:0,pot:[]};
    ids.forEach(p=>st.hands[p]=[]);
    shuf([...Array(52).keys()]).forEach((c,i)=>st.hands[ids[i%ids.length]].push(c));
    return st;
  },
  act(o,p,a){
    const st=clone(o);
    if(st.over||a.t!=='flip'||!st.order.includes(p))return null;
    const live=st.order.filter(q=>A(st.hands[q]).length);
    if(!live.length)return null;
    const tb={};live.forEach(q=>tb[q]=H(st,q).shift());
    st.pot=A(st.pot);Object.values(tb).forEach(c=>st.pot.push(c));
    const mx=Math.max(...live.map(q=>warV(tb[q]))),ws=live.filter(q=>warV(tb[q])===mx);
    st.rd=(st.rd||0)+1;st.tb=tb;
    if(ws.length===1){H(st,ws[0]).push(...shuf(st.pot));st.pot=[];st.w=ws[0];st.tie=0}
    else{st.w=null;st.tie=1}
    const alive=st.order.filter(q=>A(st.hands[q]).length);
    if(alive.length<=1||st.rd>=60){
      let best=-1,bw=[];
      st.order.forEach(q=>{const k=A(st.hands[q]).length;if(k>best){best=k;bw=[q]}else if(k===best)bw.push(q)});
      st.over=1;st.winner=bw[0];st.pts={[bw[0]]:1};
    }
    st.v++;return st;
  }
};
const bjVal=h=>{let s=0,a=0;h.forEach(c=>{const r=c%13;if(r===0){a++;s+=11}else s+=r>=9?10:r+1});while(s>21&&a){s-=10;a--}return s};
const BJ={
  init(ids){
    const st={kind:'c_21',v:0,order:ids,turn:0,hands:{},dealer:[],deck:shuf([...Array(52).keys()]),stat:{}};
    for(let i=0;i<2;i++){ids.forEach(p=>H(st,p).push(st.deck.pop()));st.dealer.push(st.deck.pop())}
    ids.forEach(p=>st.stat[p]=bjVal(st.hands[p])===21?'bj':'play');
    BJ.adv(st,-1);return st;
  },
  adv(st,from){
    for(let i=from+1;i<st.order.length;i++)if(st.stat[st.order[i]]==='play'){st.turn=i;return}
    st.turn=-1;
    if(st.order.some(p=>st.stat[p]==='stand'||st.stat[p]==='bj')){while(bjVal(st.dealer)<17)st.dealer.push(st.deck.pop())}
    const d=bjVal(st.dealer),dbj=st.dealer.length===2&&d===21;
    st.res={};st.pts={};
    st.order.forEach(p=>{
      const v=bjVal(H(st,p));let r;
      if(st.stat[p]==='bust')r='lose';else if(st.stat[p]==='bj')r=dbj?'push':'win';else if(dbj)r='lose';else if(d>21||v>d)r='win';else if(v===d)r='push';else r='lose';
      st.res[p]=r;if(r==='win')st.pts[p]=1;
    });
    st.over=1;
  },
  act(o,p,a){
    const st=clone(o);
    if(st.over||st.order[st.turn]!==p)return null;
    st.dealer=A(st.dealer);const h=H(st,p);
    if(a.t==='hit'){h.push(st.deck.pop());const v=bjVal(h);if(v>21)st.stat[p]='bust';else if(v===21)st.stat[p]='stand'}
    else if(a.t==='stand')st.stat[p]='stand';
    else return null;
    if(st.stat[p]!=='play')BJ.adv(st,st.turn);
    st.v++;return st;
  }
};
/* ===== بنك الأسئلة ===== */
const CT={song:'🎵 أغاني',film:'🎬 أفلام ومسلسلات',isl:'🕌 إسلامي',flag:'🚩 أعلام وبلاد',city:'🏙️ صور من مصر',gen:'💡 معلومات عامة'};
const QB=[];
const Q=(c,g,q,a,img,open,d)=>QB.push({c,g,q,a:Array.isArray(a)?a:[a],img,open:!!open,d});
const P=(c,g,q,a,w,l)=>Q(c,g,q,a,{w,l:l||'en'});
const AL={'عبد الحليم حافظ':['حليم','عبد الحليم'],'عمرو دياب':['الهضبة','عمرو'],'أم كلثوم':['ام كلثوم','كوكب الشرق'],'شيرين عبد الوهاب':['شيرين'],'محمد منير':['منير','الكينج'],'عادل إمام':['الزعيم','عادل امام'],'أحمد زكي':['احمد زكي','النمر الاسود'],'فايزة أحمد':['فايزة'],'نانسي عجرم':['نانسي'],'كاظم الساهر':['كاظم'],'إليسا':['اليسا']};
const al=a=>[a,...(AL[a]||[]),a.split(' ').slice(0,2).join(' ')];
/* --- أغاني --- */
[['قارئة الفنجان','عبد الحليم حافظ'],['سواح','عبد الحليم حافظ'],['زي الهوا','عبد الحليم حافظ'],['أهواك','عبد الحليم حافظ'],['على قد الشوق','عبد الحليم حافظ'],['موعود','عبد الحليم حافظ'],
['أنت عمري','أم كلثوم'],['الأطلال','أم كلثوم'],['ألف ليلة وليلة','أم كلثوم'],['أنا والعذاب وهواك','أم كلثوم'],['يا ليلة العيد','أم كلثوم'],
['ست الحبايب','فايزة أحمد'],['بتونس بيك','وردة'],['تملي معاك','عمرو دياب'],['نور العين','عمرو دياب'],['وغلاوتك','عمرو دياب'],
['الليلة يا سمرا','محمد منير'],['شبابيك','محمد منير'],['علي صوتك بالغنا','محمد منير'],['السلام عليكم','أحمد عدوية'],['زحمة يا دنيا زحمة','أحمد عدوية'],['أنا بكره إسرائيل','شعبان عبد الرحيم'],
['جرب تحبني','شيرين عبد الوهاب'],['مشاعر','شيرين عبد الوهاب'],['ديابلو','ويجز'],['عيشالك','تامر حسني'],['يا سلام','نانسي عجرم'],['آه ونص','نانسي عجرم'],['عايشالك','إليسا'],['أجمل إحساس','إليسا'],['زيديني عشقا','كاظم الساهر'],['كيفك إنت','فيروز'],['نسم علينا الهوا','فيروز']
].forEach(([s,a])=>Q('song','singer','مين بيغني أغنية «'+s+'»؟',al(a)));
[['كوكب الشرق','أم كلثوم'],['العندليب الأسمر','عبد الحليم حافظ'],['الهضبة','عمرو دياب'],['الكينج','محمد منير'],['سفيرتنا إلى النجوم','فيروز'],['القيصر','كاظم الساهر']].forEach(([t,a])=>Q('song','singer','مين الفنان اللي بيتلقب بـ «'+t+'»؟',al(a)));
[['إنت عمري اللي ابتدا بنورك','صباحه'],['يا فؤادي لا تسل أين الهوى','كان صرحا من خيال فهوى'],['بلادي بلادي بلادي لك حبي و','فؤادي'],['أهواك وأتمنى لو','أنساك'],['حبيبي يا نور العين يا ساكن','خيالي'],['يا ليلة العيد آنستينا و','جددت الأمل فينا'],['جلست والخوف بعينيها','تتأمل فنجاني المقلوب'],['على قد الشوق اللي في عيوني يا جميل','سلم']].forEach(([l,a])=>Q('song','lyric','كمّل الأغنية: «'+l+' ...»',[a]));
['قمر','ليل','حبيبي','عيون','قلبي','الشوق','بحبك','مصر','الدنيا','الحب'].forEach(w=>Q('song','open','اذكر أغنية فيها كلمة «'+w+'»',[],null,true));
/* --- أفلام ومسلسلات --- */
[['الكيت كات','محمود عبد العزيز'],['الإرهاب والكباب','عادل إمام'],['اللمبي','محمد سعد'],['الناظر','علاء ولي الدين'],['إسماعيلية رايح جاي','محمد فؤاد'],['صعيدي في الجامعة الأمريكية','محمد هنيدي'],['همام في أمستردام','محمد هنيدي'],['ولاد العم','كريم عبد العزيز'],['الأرض','محمود المليجي'],['البيه البواب','أحمد زكي'],['أمير الظلام','عادل إمام'],['الفيل الأزرق','كريم عبد العزيز'],['إبراهيم الأبيض','أحمد السقا'],['الجزيرة','أحمد السقا'],['تيته رهيبة','محمد سعد'],['ظرف طارق','أحمد حلمي'],['آسف على الإزعاج','أحمد حلمي'],['عسل أسود','أحمد حلمي'],['إكس لارج','أحمد حلمي'],['الأسطورة','محمد رمضان'],['قلب الأسد','محمد رمضان'],['هي فوضى','خالد صالح'],['عمارة يعقوبيان','عادل إمام'],['سلام يا صاحبي','عادل إمام'],['خلي بالك من زوزو','سعاد حسني'],['شفيقة ومتولي','سعاد حسني'],['بحب السيما','محمود حميدة'],['النمر الأسود','أحمد زكي'],['ضد الحكومة','أحمد زكي'],['زوجة رجل مهم','أحمد زكي'],['أيام السادات','أحمد زكي'],['ناصر 56','أحمد زكي'],['اللعب مع الكبار','عادل إمام'],['طيور الظلام','عادل إمام'],['الواد محروس بتاع الوزير','عادل إمام'],['شمس الزناتي','عادل إمام'],['طير إنت','أحمد مكي'],
['رأفت الهجان','محمود عبد العزيز'],['ليالي الحلمية','يحيى الفخراني'],['الكبير أوي','أحمد مكي'],['لن أعيش في جلباب أبي','نور الشريف'],['الاختيار','أمير كرارة'],['الحشاشين','كريم عبد العزيز'],['جعفر العمدة','محمد رمضان'],['نسر الصعيد','محمد رمضان'],['البرنس','محمد رمضان']
].forEach(([f,a])=>Q('film','actor','مين بطل «'+f+'»؟',al(a)));
[['عادل إمام ويسرا','اللعب مع الكبار','الإرهاب والكباب','طيور الظلام'],['عادل إمام وعمر الشريف','حسن ومرقص'],['أحمد زكي وسعاد حسني','شفيقة ومتولي'],['عبد الحليم حافظ وفاتن حمامة','موعد غرام','أيام وليالي'],['أحمد حلمي ومنى زكي','آسف على الإزعاج','ألف مبروك'],['كريم عبد العزيز ونيللي كريم','الفيل الأزرق'],['أحمد زكي ومنى زكي','اضحك الصورة تطلع حلوة']].forEach(([w,...a])=>Q('film','open','اذكر عمل اشترك فيه '+w,a,null,true));
[['الأرض','يوسف شاهين'],['الكيت كات','داود عبد السيد'],['عمارة يعقوبيان','مروان حامد'],['الفيل الأزرق','مروان حامد'],['ولاد العم','شريف عرفة'],['الإرهاب والكباب','شريف عرفة'],['اللمبي','وائل إحسان'],['إسماعيلية رايح جاي','كريم ضياء الدين']].forEach(([f,d])=>Q('film','dir','مين مخرج «'+f+'»؟',[d]));
Q('film','open','اذكر فيلم بطله «عادل إمام»',['الإرهاب والكباب','اللعب مع الكبار','طيور الظلام','سلام يا صاحبي','أمير الظلام','شمس الزناتي','عمارة يعقوبيان','الواد محروس بتاع الوزير','حسن ومرقص'],null,true);
Q('film','open','اذكر فيلم بطله «أحمد حلمي»',['ظرف طارق','آسف على الإزعاج','عسل أسود','إكس لارج','ألف مبروك'],null,true);
Q('film','open','اذكر فيلم بطله «محمد سعد»',['اللمبي','تيته رهيبة'],null,true);
/* صور ممثلين ومشاهير (بتتحمّل من ويكيبيديا، ولو الصورة مش متاحة بيظهر مكانها شكل بديل) */
[['Adel Emam','عادل إمام','film'],['Ahmed Zaki','أحمد زكي','film'],['Mahmoud Abdel Aziz','محمود عبد العزيز','film'],['Karim Abdel Aziz','كريم عبد العزيز','film'],['Ahmed Helmy','أحمد حلمي','film'],['Mohamed Henedy','محمد هنيدي','film'],['Ahmed El Sakka','أحمد السقا','film'],['Ahmed Mekky','أحمد مكي','film'],['Yousra','يسرا','film'],['Soad Hosny','سعاد حسني','film'],['Faten Hamama','فاتن حمامة','film'],['Omar Sharif','عمر الشريف','film'],['Ismail Yassin','إسماعيل ياسين','film'],['Mona Zaki','منى زكي','film'],['Yehia El Fakharany','يحيى الفخراني','film'],['Nelly Karim','نيللي كريم','film'],
['Amr Diab','عمرو دياب','song'],['Umm Kulthum','أم كلثوم','song'],['Abdel Halim Hafez','عبد الحليم حافظ','song'],['Mohamed Mounir','محمد منير','song'],['Nancy Ajram','نانسي عجرم','song'],['Sherine','شيرين عبد الوهاب','song'],['Fairuz','فيروز','song'],['Kadim Al Sahir','كاظم الساهر','song'],['Elissa','إليسا','song'],['Tamer Hosny','تامر حسني','song'],
['Mohamed Salah','محمد صلاح','gen'],['Naguib Mahfouz','نجيب محفوظ','gen'],['Ahmed Zewail','أحمد زويل','gen'],['Hassan Shehata','حسن شحاتة','gen'],['Essam El-Hadary','عصام الحضري','gen'],['Taha Hussein','طه حسين','gen'],['Gamal Abdel Nasser','جمال عبد الناصر','gen'],['Zahi Hawass','زاهي حواس','gen'],['Magdi Yacoub','مجدي يعقوب','gen']
].forEach(([w,n,c])=>P(c,'person','مين الشخص اللي في الصورة؟',al(n),w));
/* --- إسلامي --- */
[['أطول سورة في القرآن؟','البقرة'],['أقصر سورة في القرآن؟','الكوثر'],['السورة اللي بتتسمى «عروس القرآن»؟','الرحمن'],['السورة اللي بتتسمى «قلب القرآن»؟','يس'],['السورة اللي بتعدل ثلث القرآن؟','الإخلاص'],['أول سورة في ترتيب المصحف؟','الفاتحة'],['آخر سورة في المصحف؟','الناس'],['السورة الوحيدة اللي مبتبدأش بالبسملة؟','التوبة'],['أول سورة نزلت من القرآن (أول آياتها)؟','العلق'],['أعظم آية في القرآن؟','آية الكرسي'],['سورة فيها بسملتين؟','النمل'],
['مين أول مؤذن في الإسلام؟','بلال بن رباح'],['مين أول الخلفاء الراشدين؟','أبو بكر الصديق'],['مين الخليفة اللي لقبه «الفاروق»؟','عمر بن الخطاب'],['مين الصحابي اللي لقبه «ذو النورين»؟','عثمان بن عفان'],['مين الصحابي اللي لقبه «سيف الله المسلول»؟','خالد بن الوليد'],['مين الصحابي اللي لقبه «أمين الأمة»؟','أبو عبيدة بن الجراح'],['مين الخليفة اللي أمر بنسخ المصحف العثماني؟','عثمان بن عفان'],['مين أول زوجات النبي ﷺ؟','خديجة بنت خويلد'],['مين رابع الخلفاء الراشدين؟','علي بن أبي طالب'],
['أبو الأنبياء؟','إبراهيم'],['النبي اللي ابتلعه الحوت؟','يونس'],['النبي اللي اتحرق في النار فكانت بردًا وسلامًا؟','إبراهيم'],['النبي اللي سخّر الله له الريح والجن؟','سليمان'],['النبي صاحب الناقة؟','صالح'],['النبي اللي بنى السفينة؟','نوح'],['النبي اللي لقبه «كليم الله»؟','موسى'],['النبي اللي لقبه «خليل الله»؟','إبراهيم'],['النبي اللي اتحط في الجب؟','يوسف'],['النبي اللي اشتهر بالصبر على المرض؟','أيوب'],['النبي اللي أُرسل إلى قوم عاد؟','هود'],['النبي اللي لقبه «روح الله وكلمته»؟','عيسى'],
['الملك الموكل بالوحي؟','جبريل'],['الملك الموكل بالنفخ في الصور؟','إسرافيل'],['الملك الموكل بالمطر والنبات؟','ميكائيل'],
['مكان مولد النبي ﷺ؟','مكة المكرمة'],['المدينة اللي هاجر ليها النبي ﷺ؟','المدينة المنورة'],['أول مسجد اتبنى في الإسلام؟','مسجد قباء'],['القبلة الأولى للمسلمين؟','المسجد الأقصى'],['الغزوة اللي حصلت في رمضان في السنة الثانية للهجرة؟','بدر'],['الغزوة اللي اتكسرت فيها رباعية النبي ﷺ؟','أحد'],['عام ولادة النبي ﷺ بيتسمى عام...؟','الفيل'],
['أول ما يتحاسب عليه العبد يوم القيامة؟','الصلاة'],['ركن الإسلام الرابع؟','الصوم'],['الشهر اللي فيه فُرض الصيام؟','رمضان'],['الشهر اللي فيه الحج؟','ذو الحجة'],['اليوم اللي هو ركن الحج الأعظم؟','يوم عرفة'],['الليلة اللي هي خير من ألف شهر؟','ليلة القدر'],['الجبل اللي بيقف عليه الحجاج؟','جبل عرفات'],
['بئر المياه المشهور جنب الكعبة؟','زمزم'],['الحجر اللي بنبدأ منه الطواف؟','الحجر الأسود'],['أول جامع اتبنى في مصر؟','جامع عمرو بن العاص'],['الجامع اللي بناه الفاطميون وبقى جامعة؟','الأزهر'],['المسجد اللي على قلعة صلاح الدين في القاهرة؟','مسجد محمد علي']
].forEach(([q,a],i)=>Q('isl',i<=10?'is':i<=19?'ic':i<=31?'in':i<=34?'im':i<=41?'ip':i<=48?'if':'ix',q,[a,a.replace('مسجد ','').replace('جامع ','')]));
[['عدد سور القرآن؟','114'],['عدد أجزاء القرآن؟','30'],['عدد آيات سورة الفاتحة؟','7'],['عدد أركان الإسلام؟','5'],['عدد أركان الإيمان؟','6'],['عدد الصلوات المفروضة في اليوم؟','5'],['عدد ركعات صلاة المغرب؟','3'],['عدد ركعات صلاة الفجر؟','2'],['عدد أشواط الطواف حول الكعبة؟','7'],['عدد أشواط السعي بين الصفا والمروة؟','7'],['عدد الأنبياء المذكورين في القرآن؟','25'],['عدد أولي العزم من الرسل؟','5']].forEach(([q,a])=>Q('isl','num',q,[a]));
['اسم من أسماء الله الحسنى','اسم نبي من أنبياء القرآن','اسم سورة من القرآن','اسم صحابي جليل'].forEach(q=>Q('isl','open','اذكر '+q,[],null,true));
/* --- أعلام وبلاد --- */
const CO=[['مصر','eg','القاهرة'],['السعودية','sa','الرياض'],['الإمارات','ae','أبو ظبي'],['الكويت','kw','الكويت'],['قطر','qa','الدوحة'],['البحرين','bh','المنامة'],['عمان','om','مسقط'],['اليمن','ye','صنعاء'],['العراق','iq','بغداد'],['سوريا','sy','دمشق'],['لبنان','lb','بيروت'],['الأردن','jo','عمان'],['فلسطين','ps',''],['ليبيا','ly','طرابلس'],['تونس','tn','تونس'],['الجزائر','dz','الجزائر'],['المغرب','ma','الرباط'],['السودان','sd','الخرطوم'],['موريتانيا','mr','نواكشوط'],['الصومال','so','مقديشو'],['تركيا','tr','أنقرة'],['إيران','ir','طهران'],['فرنسا','fr','باريس'],['ألمانيا','de','برلين'],['إيطاليا','it','روما'],['إسبانيا','es','مدريد'],['بريطانيا','gb','لندن'],['أمريكا','us','واشنطن'],['كندا','ca','أوتاوا'],['البرازيل','br','برازيليا'],['الأرجنتين','ar','بوينس آيرس'],['المكسيك','mx','مكسيكو سيتي'],['اليابان','jp','طوكيو'],['الصين','cn','بكين'],['الهند','in','نيودلهي'],['روسيا','ru','موسكو'],['كوريا الجنوبية','kr','سيول'],['أستراليا','au','كانبرا'],['جنوب أفريقيا','za','بريتوريا'],['نيجيريا','ng','أبوجا'],['كينيا','ke','نيروبي'],['إثيوبيا','et','أديس أبابا'],['اليونان','gr','أثينا'],['البرتغال','pt','لشبونة'],['هولندا','nl','أمستردام'],['بلجيكا','be','بروكسل'],['سويسرا','ch','برن'],['السويد','se','ستوكهولم'],['النرويج','no','أوسلو'],['باكستان','pk','إسلام آباد'],['إندونيسيا','id','جاكرتا'],['ماليزيا','my','كوالالمبور'],['أفغانستان','af','كابول'],['أوكرانيا','ua','كييف'],['بولندا','pl','وارسو'],['كولومبيا','co','بوغوتا'],['تشيلي','cl','سانتياغو'],['كوبا','cu','هافانا'],['غانا','gh','أكرا'],['السنغال','sn','داكار'],['الكاميرون','cm','ياوندي'],['كرواتيا','hr','زغرب'],['الدنمارك','dk','كوبنهاجن'],['بيرو','pe','ليما']];
CO.forEach(([n,c,cap])=>{Q('flag','flag','ده علم أنهي دولة؟',[n],{f:c});if(cap)Q('flag','cap','إيه عاصمة '+n+'؟',[cap])});
/* --- صور من مصر --- */
[['Alexandria','الإسكندرية'],['Aswan','أسوان'],['Luxor','الأقصر'],['Hurghada','الغردقة'],['Sharm El Sheikh','شرم الشيخ'],['Port Said','بورسعيد'],['Suez','السويس'],['Ismailia','الإسماعيلية'],['Damietta','دمياط'],['Mansoura, Egypt','المنصورة'],['Tanta','طنطا'],['Faiyum','الفيوم'],['Siwa Oasis','سيوة'],['Marsa Matruh','مرسى مطروح'],['Dahab','دهب'],['Giza','الجيزة'],['Asyut','أسيوط'],['Minya, Egypt','المنيا'],['Sohag','سوهاج'],['Qena','قنا'],['Rosetta','رشيد'],['El Alamein','العلمين'],['Nuweiba','نويبع'],['Saint Catherine, Egypt','سانت كاترين'],
['Abu Simbel temples','أبو سمبل'],['Cairo Tower','برج القاهرة'],['Citadel of Qaitbay','قلعة قايتباي'],['Bibliotheca Alexandrina','مكتبة الإسكندرية'],['Karnak','معبد الكرنك'],['Valley of the Kings','وادي الملوك'],['Great Pyramid of Giza','هرم خوفو'],['Great Sphinx of Giza','أبو الهول'],['Aswan High Dam','السد العالي'],['Philae','معبد فيلة'],['Saladin Citadel of Cairo','قلعة صلاح الدين'],['Khan el-Khalili','خان الخليلي'],['Egyptian Museum','المتحف المصري'],['Colossi of Memnon','تمثالا ممنون'],['Mortuary Temple of Hatshepsut','معبد حتشبسوت'],['Cairo Opera House','دار الأوبرا'],['Al-Azhar Mosque','الأزهر'],['Suez Canal','قناة السويس'],['White Desert National Park','الصحراء البيضاء'],['Nile','نهر النيل'],['Tahrir Square','ميدان التحرير']
].forEach(([w,n],i)=>P('city','place',i<24?'الصورة دي لأنهي مدينة في مصر؟':'إيه المكان المشهور ده في مصر؟',al(n).concat(n.replace(/^(معبد|قلعة|مكتبة|جامع|دار|ميدان|نهر|برج|المتحف|وادي|هرم) ?/,'')),w));
/* --- معلومات عامة --- */
[['عاصمة مصر؟','القاهرة','الإسكندرية|الجيزة|أسوان'],['أطول نهر في مصر؟','النيل','الفرات|دجلة|الأمازون'],['المدينة اللي بتتلقب بـ «عروس البحر المتوسط»؟','الإسكندرية','بورسعيد|دمياط|مرسى مطروح'],['أكبر محافظة في مصر من حيث المساحة؟','الوادي الجديد','أسوان|جنوب سيناء|الأقصر'],['أعلى جبل في مصر؟','جبل كاترين','جبل عويناتي|جبل الجلالة|جبل سيناء'],['السد اللي في أسوان اسمه إيه؟','السد العالي','سد النهضة|سد الموصل|سد أتاتورك'],['الملك اللي بنى الهرم الأكبر؟','خوفو','خفرع|منكاورع|رمسيس الثاني'],['معبد أبو سمبل بناه الملك...؟','رمسيس الثاني','خوفو|توت عنخ آمون|تحتمس الثالث'],['الملكة الفرعونية صاحبة التمثال النصفي الشهير؟','نفرتيتي','كليوباترا|حتشبسوت|نفرتاري'],['اسم الكتابة الفرعونية القديمة؟','الهيروغليفية','المسمارية|الفينيقية|اللاتينية'],['الحجر اللي ساعد شامبليون على فك رموز الهيروغليفية؟','حجر رشيد','حجر الأقصر|حجر الأهرام|حجر السويس'],['اسم عملة مصر؟','الجنيه','الدينار|الريال|الدرهم'],['إيه الألوان في علم مصر؟','أحمر وأبيض وأسود','أخضر وأبيض وأحمر|أزرق وأبيض|أحمر وأسود وأخضر'],['أكلة مصرية من أرز ومكرونة وعدس وحمص وصلصة؟','كشري','فتة|ملوخية|محشي'],['مين حصل على جايزة نوبل في الأدب سنة 1988 من مصر؟','نجيب محفوظ','طه حسين|توفيق الحكيم|يوسف إدريس'],['مين العالم المصري اللي حصل على نوبل في الكيمياء سنة 1999؟','أحمد زويل','مجدي يعقوب|محمد البرادعي|فاروق الباز'],['اللاعب المصري المشهور في نادي ليفربول؟','محمد صلاح','محمد النني|محمود تريزيجيه|عمر مرموش'],['كام مرة مصر كسبت كأس الأمم الأفريقية؟','7','5|6|8'],['قناة السويس بتوصل بين البحر الأحمر وأي بحر؟','البحر المتوسط','بحر العرب|بحر قزوين|البحر الأسود'],['عدد محافظات مصر؟','27','25|26|29'],
['عاصمة فرنسا؟','باريس','لندن|روما|مدريد'],['أكبر كوكب في المجموعة الشمسية؟','المشتري','زحل|الأرض|نبتون'],['أقرب كوكب للشمس؟','عطارد','الزهرة|المريخ|الأرض'],['الكوكب الأحمر؟','المريخ','الزهرة|المشتري|زحل'],['عدد قارات العالم؟','7','5|6|8'],['أسرع حيوان بري؟','الفهد','الأسد|الحصان|الغزال'],['أكبر محيط في العالم؟','المحيط الهادي','المحيط الأطلسي|المحيط الهندي|المحيط المتجمد الشمالي'],['أكبر دولة في العالم من حيث المساحة؟','روسيا','الصين|كندا|أمريكا'],['مين أول إنسان وصل القمر؟','نيل أرمسترونغ','يوري غاغارين|باز ألدرين|جون غلين'],['مين مؤسس شركة مايكروسوفت؟','بيل جيتس','ستيف جوبز|إيلون ماسك|مارك زوكربيرغ'],['اسم الغاز اللي بنتنفسه عشان نعيش؟','الأكسجين','النيتروجين|ثاني أكسيد الكربون|الهيدروجين'],['أكبر عضو في جسم الإنسان؟','الجلد','الكبد|القلب|الرئة'],['عدد عظام جسم الإنسان البالغ؟','206','186|306|256'],['الرمز الكيميائي للماء؟','H2O','CO2|O2|NaCl'],['عدد ألوان قوس قزح؟','7','5|6|8'],['أكبر حيوان في العالم؟','الحوت الأزرق','الفيل الأفريقي|الزرافة|الدب القطبي'],['مين مخترع المصباح الكهربائي؟','إديسون','نيوتن|أينشتاين|جراهام بيل'],['الدولة اللي كسبت كأس العالم 2022؟','الأرجنتين','فرنسا|البرازيل|كرواتيا'],['عدد لاعبي فريق كرة القدم في الملعب؟','11','9|10|12'],['عدد لاعبي فريق كرة السلة في الملعب؟','5','6|7|11'],['أكبر قارة في العالم؟','آسيا','أفريقيا|أمريكا الشمالية|أوروبا'],['أصغر قارة في العالم؟','أستراليا','أوروبا|أمريكا الجنوبية|أفريقيا'],['الحيوان اللي بيتلقب بـ «سفينة الصحراء»؟','الجمل','الحصان|الحمار|الفيل'],['الطائر اللي مبيطيرش وبيعيش في القطب الجنوبي؟','البطريق','النعامة|البجع|الببغاء'],['لغة البرازيل الرسمية؟','البرتغالية','الإسبانية|الإنجليزية|الفرنسية'],['برج خليفة موجود في أنهي مدينة؟','دبي','أبو ظبي|الدوحة|الرياض']
].forEach(([q,a,d],i)=>Q('gen',i<20?'egy':'world',q,[a,a.replace(/^(ال|جبل )/,'')],null,false,d.split('|')));
['اسم أكلة مصرية','اسم مشروب بنشربه في رمضان','اسم لاعب كورة مصري','اسم شارع مشهور في القاهرة','اسم محافظة مصرية'].forEach(q=>Q('gen','open','اذكر '+q,[],null,true));

/* مراجعة: شيل الأسئلة اللي فيها لبس أو غموض */
(()=>{const bad=['سورة فيها بسملتين؟','عيشالك'];for(let i=QB.length-1;i>=0;i--){const q=QB[i];if(bad.some(b=>q.q.includes(b)&&(b!=='عيشالك'||(q.a[0]==='تامر حسني'))))QB.splice(i,1)}QB.forEach(q=>{q.a=q.a.map(x=>x==='الالأقصى'?'الأقصى':x)})})();
/* ===== بنك إضافي: مصدره Quran API وWikidata ===== */
Q('isl','isn',"سورة «البقرة» ترتيبها كام في المصحف؟","2",0,0,["4","3","5"]);
Q('isl','isn',"سورة «الماعون» ترتيبها كام في المصحف؟","107",0,0,["123","111","95"]);
Q('isl','isn',"سورة «الهمزة» ترتيبها كام في المصحف؟","104",0,0,["87","125","110"]);
Q('isl','isn',"سورة «مريم» ترتيبها كام في المصحف؟","19",0,0,["24","20","14"]);
Q('isl','isn',"سورة «الذاريات» ترتيبها كام في المصحف؟","51",0,0,["66","38","41"]);
Q('isl','isn',"سورة «الدخان» ترتيبها كام في المصحف؟","44",0,0,["38","33","32"]);
Q('isl','isn',"سورة «قريش» ترتيبها كام في المصحف؟","106",0,0,["96","105","87"]);
Q('isl','isn',"سورة «الطارق» ترتيبها كام في المصحف؟","86",0,0,["100","82","67"]);
Q('isl','isn',"سورة «الفجر» ترتيبها كام في المصحف؟","89",0,0,["72","95","112"]);
Q('isl','isn',"سورة «الانشقاق» ترتيبها كام في المصحف؟","84",0,0,["108","93","104"]);
Q('isl','isn',"سورة «النور» ترتيبها كام في المصحف؟","24",0,0,["29","26","19"]);
Q('isl','isn',"سورة «العلق» ترتيبها كام في المصحف؟","96",0,0,["121","100","71"]);
Q('isl','isn',"سورة «الضحى» ترتيبها كام في المصحف؟","93",0,0,["73","67","83"]);
Q('isl','isn',"سورة «يسٓ» ترتيبها كام في المصحف؟","36",0,0,["27","35","38"]);
Q('isl','isn',"سورة «الغاشية» ترتيبها كام في المصحف؟","88",0,0,["79","98","68"]);
Q('isl','isn',"سورة «الحديد» ترتيبها كام في المصحف؟","57",0,0,["45","68","66"]);
Q('isl','isn',"سورة «الحجرات» ترتيبها كام في المصحف؟","49",0,0,["53","55","42"]);
Q('isl','isn',"سورة «المائدة» ترتيبها كام في المصحف؟","5",0,0,["3","4","8"]);
Q('isl','isn',"سورة «الشمس» ترتيبها كام في المصحف؟","91",0,0,["109","65","95"]);
Q('isl','isn',"سورة «الكافرون» ترتيبها كام في المصحف؟","109",0,0,["133","114","106"]);
Q('isl','isn',"سورة «الطلاق» ترتيبها كام في المصحف؟","65",0,0,["60","70","46"]);
Q('isl','isn',"سورة «الفلق» ترتيبها كام في المصحف؟","113",0,0,["103","136","90"]);
Q('isl','isn',"سورة «الحجر» ترتيبها كام في المصحف؟","15",0,0,["14","18","16"]);
Q('isl','isn',"سورة «الفيل» ترتيبها كام في المصحف؟","105",0,0,["88","133","84"]);
Q('isl','isn',"سورة «المرسلات» ترتيبها كام في المصحف؟","77",0,0,["90","74","60"]);
Q('isl','isn',"سورة «الجاثية» ترتيبها كام في المصحف؟","45",0,0,["43","49","33"]);
Q('isl','isname',"إيه اسم السورة رقم 8 في المصحف؟","الأنفال");
Q('isl','isname',"إيه اسم السورة رقم 105 في المصحف؟","الفيل");
Q('isl','isname',"إيه اسم السورة رقم 12 في المصحف؟","يوسف");
Q('isl','isname',"إيه اسم السورة رقم 95 في المصحف؟","التين");
Q('isl','isname',"إيه اسم السورة رقم 79 في المصحف؟","النازعات");
Q('isl','isname',"إيه اسم السورة رقم 27 في المصحف؟","النمل");
Q('isl','isname',"إيه اسم السورة رقم 100 في المصحف؟","العاديات");
Q('isl','isname',"إيه اسم السورة رقم 33 في المصحف؟","الأحزاب");
Q('isl','isname',"إيه اسم السورة رقم 22 في المصحف؟","الحج");
Q('isl','isname',"إيه اسم السورة رقم 88 في المصحف؟","الغاشية");
Q('isl','isname',"إيه اسم السورة رقم 102 في المصحف؟","التكاثر");
Q('isl','isname',"إيه اسم السورة رقم 104 في المصحف؟","الهمزة");
Q('isl','isname',"إيه اسم السورة رقم 103 في المصحف؟","العصر");
Q('isl','isname',"إيه اسم السورة رقم 28 في المصحف؟","القصص");
Q('isl','isname',"إيه اسم السورة رقم 6 في المصحف؟","الأنعام");
Q('isl','isname',"إيه اسم السورة رقم 30 في المصحف؟","الروم");
Q('isl','isname',"إيه اسم السورة رقم 109 في المصحف؟","الكافرون");
Q('isl','isname',"إيه اسم السورة رقم 63 في المصحف؟","المنافقون");
Q('isl','isname',"إيه اسم السورة رقم 101 في المصحف؟","القارعة");
Q('isl','isname',"إيه اسم السورة رقم 71 في المصحف؟","نوح");
Q('isl','isa',"كام آية في سورة «الشرح»؟","8",0,0,["7","6","11"]);
Q('isl','isa',"كام آية في سورة «القصص»؟","88",0,0,["62","73","77"]);
Q('isl','isa',"كام آية في سورة «العنكبوت»؟","69",0,0,["77","71","87"]);
Q('isl','isa',"كام آية في سورة «المسد»؟","5",0,0,["2","3","6"]);
Q('isl','isa',"كام آية في سورة «القدر»؟","5",0,0,["3","6","4"]);
Q('isl','isa',"كام آية في سورة «الأنفال»؟","75",0,0,["66","69","77"]);
Q('isl','isa',"كام آية في سورة «الفرقان»؟","77",0,0,["79","87","91"]);
Q('isl','isa',"كام آية في سورة «مريم»؟","98",0,0,["83","92","106"]);
Q('isl','isa',"كام آية في سورة «الحشر»؟","24",0,0,["17","22","21"]);
Q('isl','isa',"كام آية في سورة «لقمان»؟","34",0,0,["24","39","38"]);
Q('isl','isa',"كام آية في سورة «الحاقة»؟","52",0,0,["42","45","41"]);
Q('isl','isa',"كام آية في سورة «الشمس»؟","15",0,0,["17","11","12"]);
Q('isl','isa',"كام آية في سورة «الماعون»؟","7",0,0,["6","5","10"]);
Q('isl','isa',"كام آية في سورة «الحجر»؟","99",0,0,["77","76","94"]);
Q('isl','isa',"كام آية في سورة «التين»؟","8",0,0,["11","9","5"]);
Q('isl','isa',"كام آية في سورة «يوسف»؟","111",0,0,["105","102","115"]);
Q('isl','isa',"كام آية في سورة «الكهف»؟","110",0,0,["79","105","134"]);
Q('isl','isa',"كام آية في سورة «العاديات»؟","11",0,0,["12","14","9"]);
Q('isl','isa',"كام آية في سورة «الفيل»؟","5",0,0,["3","6","4"]);
Q('isl','isa',"كام آية في سورة «المطففين»؟","36",0,0,["33","35","32"]);
Q('isl','isa',"كام آية في سورة «التحريم»؟","12",0,0,["8","11","9"]);
Q('isl','isa',"كام آية في سورة «النحل»؟","128",0,0,["92","125","123"]);
Q('isl','isa',"كام آية في سورة «القارعة»؟","11",0,0,["13","12","10"]);
Q('isl','isa',"كام آية في سورة «التوبة»؟","129",0,0,["163","167","93"]);
Q('isl','isa',"كام آية في سورة «البروج»؟","22",0,0,["19","17","25"]);
Q('isl','isa',"كام آية في سورة «السجدة»؟","30",0,0,["33","37","23"]);
Q('gen','cap',"إيه عاصمة محافظة البحيرة؟","دمنهور");
Q('gen','cap',"إيه عاصمة محافظة جنوب سيناء؟","الطور");
Q('gen','cap',"إيه عاصمة محافظة البحر الأحمر؟","الغردقة");
Q('gen','cap',"إيه عاصمة محافظة الوادي الجديد؟","الخارجة");
Q('gen','cap',"إيه عاصمة محافظة شمال سيناء؟","العريش");
Q('gen','cap',"إيه عاصمة محافظة الغربية؟","طنطا");
Q('gen','cap',"إيه عاصمة محافظة المنوفية؟","شبين الكوم");
Q('gen','cap',"إيه عاصمة محافظة مطروح؟","مرسى مطروح");
Q('gen','cap',"إيه عاصمة محافظة الدقهلية؟","المنصورة");
Q('gen','cap',"إيه عاصمة محافظة الشرقية؟","الزقازيق");
Q('gen','cap',"إيه عاصمة محافظة القليوبية؟","بنها");
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1949",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/%DA%86%D8%B1%D8%A7%D8%BA%20%D8%AC%D8%A7%D8%AF%D9%88%20%28%D9%BE%D9%88%D8%B3%D8%AA%D8%B1%29.jpg?width=400"},0,["1945","1947","1952"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["هنري بركات"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/%DA%86%D8%B1%D8%A7%D8%BA%20%D8%AC%D8%A7%D8%AF%D9%88%20%28%D9%BE%D9%88%D8%B3%D8%AA%D8%B1%29.jpg?width=400"},0,["جون واين","محمد الأخضر حمينة","الكسندر كوردا"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1953",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/%D9%85%D9%84%D8%B5%D9%82%20%D9%81%D9%8A%D9%84%D9%85%20%D8%AA%D8%A7%D9%83%D8%B3%D9%8A%20%D8%A7%D9%84%D8%BA%D8%B1%D8%A7%D9%85%201953.jpg?width=400"},0,["1949","1951","1956"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1953",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/%D9%85%D9%84%D8%B5%D9%82%20%D9%81%D9%8A%D9%84%D9%85%20%D9%81%D9%8A%20%D8%B4%D8%B1%D8%B9%20%D9%85%D9%8A%D9%86%201953.jpg?width=400"},0,["1949","1951","1956"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["حسن الإمام"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/%D9%85%D9%84%D8%B5%D9%82%20%D9%81%D9%8A%D9%84%D9%85%20%D9%81%D9%8A%20%D8%B4%D8%B1%D8%B9%20%D9%85%D9%8A%D9%86%201953.jpg?width=400"},0,["عباس كيارستمي","جون أفليدسن","جورج سيدني"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1941",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/%D9%85%D9%84%D8%B5%D9%82%20%D9%81%D9%8A%D9%84%D9%85%20%D9%84%D9%8A%D9%84%D9%89%20%D8%A8%D9%86%D8%AA%20%D8%A7%D9%84%D8%B1%D9%8A%D9%81%201941.jpg?width=400"},0,["1937","1939","1944"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["توجو مزراحي"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/%D9%85%D9%84%D8%B5%D9%82%20%D9%81%D9%8A%D9%84%D9%85%20%D9%84%D9%8A%D9%84%D9%89%20%D8%A8%D9%86%D8%AA%20%D8%A7%D9%84%D8%B1%D9%8A%D9%81%201941.jpg?width=400"},0,["وليام ديتيرلي","بانو جاكوت","باستر كيتون"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1948",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/%D9%85%D9%84%D8%B5%D9%82%20%D9%81%D9%8A%D9%84%D9%85%20%D9%86%D8%AD%D9%88%20%D8%A7%D9%84%D9%85%D8%AC%D8%AF%201948.jpg?width=400"},0,["1944","1946","1951"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["حسين صدقي"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/%D9%85%D9%84%D8%B5%D9%82%20%D9%81%D9%8A%D9%84%D9%85%20%D9%86%D8%AD%D9%88%20%D8%A7%D9%84%D9%85%D8%AC%D8%AF%201948.jpg?width=400"},0,["فرانك لويد","ميكيو ناروسي","جون موراي أندرسون"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1940",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/%D9%85%D9%84%D8%B5%D9%82%20%D9%81%D9%8A%D9%84%D9%85%20%D8%A7%D9%84%D9%88%D8%B1%D8%B4%D8%A9%201940.jpg?width=400"},0,["1936","1938","1943"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["إستفان روستي"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/%D9%85%D9%84%D8%B5%D9%82%20%D9%81%D9%8A%D9%84%D9%85%20%D8%A7%D9%84%D9%88%D8%B1%D8%B4%D8%A9%201940.jpg?width=400"},0,["ألفرد غرين","ريتشارد فليشر","فرانكلين شافنر"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1941",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/%D9%85%D9%84%D8%B5%D9%82%20%D9%81%D9%8A%D9%84%D9%85%20%D8%A3%D9%84%D9%81%20%D9%84%D9%8A%D9%84%D8%A9%20%D9%88%D9%84%D9%8A%D9%84%D8%A9%201941.jpg?width=400"},0,["1937","1939","1944"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["توجو مزراحي"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/%D9%85%D9%84%D8%B5%D9%82%20%D9%81%D9%8A%D9%84%D9%85%20%D8%A3%D9%84%D9%81%20%D9%84%D9%8A%D9%84%D8%A9%20%D9%88%D9%84%D9%8A%D9%84%D8%A9%201941.jpg?width=400"},0,["محسن مخملباف","آلان رينيه","ديلبرت مان"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1947",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/%D9%85%D9%84%D8%B5%D9%82%20%D9%81%D9%8A%D9%84%D9%85%20%D8%A7%D9%84%D9%82%D8%A7%D9%87%D8%B1%D8%A9%20%D8%A8%D8%BA%D8%AF%D8%A7%D8%AF%201947.jpg?width=400"},0,["1943","1945","1950"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["أحمد بدرخان"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/%D9%85%D9%84%D8%B5%D9%82%20%D9%81%D9%8A%D9%84%D9%85%20%D8%A7%D9%84%D9%82%D8%A7%D9%87%D8%B1%D8%A9%20%D8%A8%D8%BA%D8%AF%D8%A7%D8%AF%201947.jpg?width=400"},0,["روبرت ستيفنسون","فرانسوا تروفو","إدوارد فرنسيس كلاين"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1944",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/%D9%85%D9%84%D8%B5%D9%82%20%D9%81%D9%8A%D9%84%D9%85%20%D8%A7%D8%A8%D9%86%20%D8%A7%D9%84%D8%AD%D8%AF%D8%A7%D8%AF%201944.jpg?width=400"},0,["1940","1942","1947"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["يوسف وهبي"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/%D9%85%D9%84%D8%B5%D9%82%20%D9%81%D9%8A%D9%84%D9%85%20%D8%A7%D8%A8%D9%86%20%D8%A7%D9%84%D8%AD%D8%AF%D8%A7%D8%AF%201944.jpg?width=400"},0,["ريتشارد فليشر","نيكي كارو","ألان دوان"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1962",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/%D9%85%D9%84%D8%B5%D9%82%20%D9%81%D9%8A%D9%84%D9%85%20%D9%85%D8%B0%D9%83%D8%B1%D8%A7%D8%AA%20%D8%AA%D9%84%D9%85%D9%8A%D8%B0%D8%A9%201962.jpg?width=400"},0,["1958","1960","1965"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["أحمد ضياء الدين"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/%D9%85%D9%84%D8%B5%D9%82%20%D9%81%D9%8A%D9%84%D9%85%20%D9%85%D8%B0%D9%83%D8%B1%D8%A7%D8%AA%20%D8%AA%D9%84%D9%85%D9%8A%D8%B0%D8%A9%201962.jpg?width=400"},0,["أب أيوركس","بليك إدواردز","ديفيد غريفيث"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1952",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/%D9%85%D9%84%D8%B5%D9%82%20%D9%81%D9%8A%D9%84%D9%85%20%D9%85%D9%86%20%D8%A3%D9%8A%D9%86%20%D9%84%D9%83%20%D9%87%D8%B0%D8%A7%201952.jpg?width=400"},0,["1948","1950","1955"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["نيازي مصطفى"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/%D9%85%D9%84%D8%B5%D9%82%20%D9%81%D9%8A%D9%84%D9%85%20%D9%85%D9%86%20%D8%A3%D9%8A%D9%86%20%D9%84%D9%83%20%D9%87%D8%B0%D8%A7%201952.jpg?width=400"},0,["آلان رينيه","تشارلي تشابلن","إس. سيمون"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1947",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/%D9%85%D8%B5%D9%84%D9%82%20%D9%81%D9%8A%D9%84%D9%85%20%D9%87%D8%AF%D9%8A%D8%A9%201947.jpg?width=400"},0,["1943","1945","1950"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["محمود ذو الفقار"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/%D9%85%D8%B5%D9%84%D9%82%20%D9%81%D9%8A%D9%84%D9%85%20%D9%87%D8%AF%D9%8A%D8%A9%201947.jpg?width=400"},0,["جورج سيتون","غودفري راجيو","نيكي كارو"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1942",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/%D9%85%D9%84%D8%B5%D9%82%20%D9%81%D9%8A%D9%84%D9%85%20%D8%A7%D9%84%D8%B9%D8%B1%D9%8A%D8%B3%20%D8%A7%D9%84%D8%AE%D8%A7%D9%85%D8%B3%201942.jpg?width=400"},0,["1938","1940","1945"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["أحمد جلال"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/%D9%85%D9%84%D8%B5%D9%82%20%D9%81%D9%8A%D9%84%D9%85%20%D8%A7%D9%84%D8%B9%D8%B1%D9%8A%D8%B3%20%D8%A7%D9%84%D8%AE%D8%A7%D9%85%D8%B3%201942.jpg?width=400"},0,["تشارلي تشابلن","إسماعيل فروخي","سام تايلور"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1943",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/%D9%85%D9%84%D8%B5%D9%82%20%D9%81%D9%8A%D9%84%D9%85%20%D8%A7%D9%84%D8%B7%D8%B1%D9%8A%D9%82%20%D8%A7%D9%84%D9%85%D8%B3%D8%AA%D9%82%D9%8A%D9%85.jpg?width=400"},0,["1939","1941","1946"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["توجو مزراحي"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/%D9%85%D9%84%D8%B5%D9%82%20%D9%81%D9%8A%D9%84%D9%85%20%D8%A7%D9%84%D8%B7%D8%B1%D9%8A%D9%82%20%D8%A7%D9%84%D9%85%D8%B3%D8%AA%D9%82%D9%8A%D9%85.jpg?width=400"},0,["براد بيرد","ديفيد لينش","بي ريفيس إيسون"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1946",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/%D9%85%D9%84%D8%B5%D9%82%20%D9%81%D9%8A%D9%84%D9%85%20%D8%B4%D9%87%D8%B1%D8%B2%D8%A7%D8%AF%201946.jpg?width=400"},0,["1942","1944","1949"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["فؤاد الجزايرلي"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/%D9%85%D9%84%D8%B5%D9%82%20%D9%81%D9%8A%D9%84%D9%85%20%D8%B4%D9%87%D8%B1%D8%B2%D8%A7%D8%AF%201946.jpg?width=400"},0,["جورج فيتزموريس","تشارلز فيدور","راي إنرايت"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1949",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/%D9%85%D9%84%D8%B5%D9%82%20%D9%81%D9%8A%D9%84%D9%85%20%D8%A7%D9%84%D9%84%D9%8A%D9%84%20%D9%84%D9%86%D8%A7%201949.jpg?width=400"},0,["1945","1947","1952"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["محمود ذو الفقار"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/%D9%85%D9%84%D8%B5%D9%82%20%D9%81%D9%8A%D9%84%D9%85%20%D8%A7%D9%84%D9%84%D9%8A%D9%84%20%D9%84%D9%86%D8%A7%201949.jpg?width=400"},0,["مرزاق علواش","داريوش مهرجوئي","جون فرانسيس ديلون"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1959",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/%D9%85%D9%84%D8%B5%D9%82%20%D9%81%D9%8A%D9%84%D9%85%20%D8%A8%D9%81%D9%83%D8%B1%20%D9%81%D9%8A%20%D8%A7%D9%84%D9%84%D9%8A%20%D9%86%D8%A7%D8%B3%D9%8A%D9%86%D9%8A%201959.jpg?width=400"},0,["1955","1957","1962"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["حسام الدين مصطفى"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/%D9%85%D9%84%D8%B5%D9%82%20%D9%81%D9%8A%D9%84%D9%85%20%D8%A8%D9%81%D9%83%D8%B1%20%D9%81%D9%8A%20%D8%A7%D9%84%D9%84%D9%8A%20%D9%86%D8%A7%D8%B3%D9%8A%D9%86%D9%8A%201959.jpg?width=400"},0,["دايفيد كيلوغ","ديفيد لينش","مسعود كيميايي"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1935",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/%D9%85%D9%84%D8%B5%D9%82%20%D9%81%D9%8A%D9%84%D9%85%20%D8%B4%D8%AC%D8%B1%D8%A9%20%D8%A7%D9%84%D8%AF%D8%B1%201935.jpg?width=400"},0,["1931","1933","1938"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["أحمد جلال"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/%D9%85%D9%84%D8%B5%D9%82%20%D9%81%D9%8A%D9%84%D9%85%20%D8%B4%D8%AC%D8%B1%D8%A9%20%D8%A7%D9%84%D8%AF%D8%B1%201935.jpg?width=400"},0,["ديفيد غريفيث","ميكيو ناروسي","جورج هيل"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1958",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/%D9%85%D9%84%D8%B5%D9%82%20%D9%81%D9%8A%D9%84%D9%85%20%D8%A7%D9%84%D8%AD%D8%A8%20%D8%A7%D9%84%D8%B5%D8%A7%D9%85%D8%AA%201958.jpg?width=400"},0,["1954","1956","1961"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["سيف الدين شوكت"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/%D9%85%D9%84%D8%B5%D9%82%20%D9%81%D9%8A%D9%84%D9%85%20%D8%A7%D9%84%D8%AD%D8%A8%20%D8%A7%D9%84%D8%B5%D8%A7%D9%85%D8%AA%201958.jpg?width=400"},0,["هربرت برينون","ريتشارد روسون","فيليب فوكون"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1969",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/%D8%AE%D8%B7%D8%A7%DA%A9%D8%A7%D8%B1%D8%A7%D9%86%20%28%D9%BE%D9%88%D8%B3%D8%AA%D8%B1%29.jpg?width=400"},0,["1965","1967","1972"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["فاروق عجرمة"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/%D8%AE%D8%B7%D8%A7%DA%A9%D8%A7%D8%B1%D8%A7%D9%86%20%28%D9%BE%D9%88%D8%B3%D8%AA%D8%B1%29.jpg?width=400"},0,["موريس إلفي","ياسوجيرو أوزو","تشارلز ريزنر"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1942",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/CasablancaPoster-Gold.jpg?width=400"},0,["1938","1940","1945"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["مايكل كورتيز"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/CasablancaPoster-Gold.jpg?width=400"},0,["جيرارد داميانو","جون فرانكنهايمر","داميان ليون"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1939",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/Poster%20-%20Gone%20With%20the%20Wind%2001.jpg?width=400"},0,["1935","1937","1942"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["جورج كيوكور"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/Poster%20-%20Gone%20With%20the%20Wind%2001.jpg?width=400"},0,["جيمس باروت","تود براونينغ","ريجنالد باركر"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1940",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/The%20Great%20Dictator%20%281940%29%20poster.jpg?width=400"},0,["1936","1938","1943"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["تشارلي تشابلن"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/The%20Great%20Dictator%20%281940%29%20poster.jpg?width=400"},0,["جيه. لي تومسون","باستر كيتون","محسن مخملباف"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1959",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/Some%20Like%20It%20Hot%20%281959%20poster%29.png?width=400"},0,["1955","1957","1962"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["بيلي وايلدر"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/Some%20Like%20It%20Hot%20%281959%20poster%29.png?width=400"},0,["ميكيو ناروسي","هنري أوتو","جون كرومويل"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1960",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/Psycho%20%281960%29%20theatrical%20poster%20%28retouched%29.jpg?width=400"},0,["1956","1958","1963"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["ألفريد هتشكوك"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/Psycho%20%281960%29%20theatrical%20poster%20%28retouched%29.jpg?width=400"},0,["جوشوا لوغان","غودفري راجيو","جون بيري"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1959",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/Ben%20hur%201959%20poster.jpg?width=400"},0,["1955","1957","1962"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["ويليام وايلر"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/Ben%20hur%201959%20poster.jpg?width=400"},0,["روي وارد بيكر","سام تايلور","إد وود"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1962",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/Lawrence%20of%20arabia%20ver3%20xxlg.jpg?width=400"},0,["1958","1960","1965"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["ديفيد لين"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/Lawrence%20of%20arabia%20ver3%20xxlg.jpg?width=400"},0,["إدوارد فرنسيس كلاين","روبرت روسين","تشارلز ريزنر"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1953",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/Peter%20Pan%20%281953%20poster%29.jpg?width=400"},0,["1949","1951","1956"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["ويلفريد جاكسون"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/Peter%20Pan%20%281953%20poster%29.jpg?width=400"},0,["إيرفينغ رابر","جيمس فاندربلت","تود براونينغ"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1964",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/Dr.%20Strangelove%20poster.png?width=400"},0,["1960","1962","1967"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["ستانلي كوبريك"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/Dr.%20Strangelove%20poster.png?width=400"},0,["بريستون ستورجس","فريتز لانغ","جون باترسون ماغوان"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1976",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/Rocky-Ad-Santa-Ana-Orange-County-Register-Apr%2C01-1977-p-102.jpg?width=400"},0,["1972","1974","1979"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["جون أفليدسن"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/Rocky-Ad-Santa-Ana-Orange-County-Register-Apr%2C01-1977-p-102.jpg?width=400"},0,["دون سيغل","إسماعيل فروخي","محمد سليم رياض"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1957",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/The%20Bridge%20on%20the%20River%20Kwai%20%281958%20US%20poster%20-%20Style%20B%29.jpg?width=400"},0,["1953","1955","1960"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["ديفيد لين"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/The%20Bridge%20on%20the%20River%20Kwai%20%281958%20US%20poster%20-%20Style%20B%29.jpg?width=400"},0,["كلارنس بادجر","ستيفن سودربرغ","جون كرومويل"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1965",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/Sound%20of%20music.jpg?width=400"},0,["1961","1963","1968"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["روبرت وايز"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/Sound%20of%20music.jpg?width=400"},0,["نورمان تاورج","فريد زينمان","فرانسوا تروفو"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1953",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/Roman%20Holiday%20%281953%20poster%29.jpg?width=400"},0,["1949","1951","1956"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["ويليام وايلر"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/Roman%20Holiday%20%281953%20poster%29.jpg?width=400"},0,["ويل شيرمان","جيرارد داميانو","أحمد ضياء الدين"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1946",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/It%27s%20a%20Wonderful%20Life%20%281946%20poster%29.jpeg?width=400"},0,["1942","1944","1949"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["فرانك كابرا"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/It%27s%20a%20Wonderful%20Life%20%281946%20poster%29.jpeg?width=400"},0,["هنري كوستر","ريزارد بوليسلافسكي","يواكيم رونينغ"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1927",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/1927%20Boris%20Bilinski%20%281900-1948%29%20Plakat%20f%C3%BCr%20den%20Film%20Metropolis%2C%20Staatliche%20Museen%20zu%20Berlin.jpg?width=400"},0,["1923","1925","1930"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["فريتز لانغ"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/1927%20Boris%20Bilinski%20%281900-1948%29%20Plakat%20f%C3%BCr%20den%20Film%20Metropolis%2C%20Staatliche%20Museen%20zu%20Berlin.jpg?width=400"},0,["جورج كيوكور","لويس ويبر","روبرت ستيفنسون"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1950",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/All%20About%20Eve%20%281950%20poster%20-%20retouch%29.jpg?width=400"},0,["1946","1948","1953"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["جوزيف مانكيفيتس"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/All%20About%20Eve%20%281950%20poster%20-%20retouch%29.jpg?width=400"},0,["هاري أو. هويت","فرانك بورزيج","ريتشارد والاس"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1960",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/Spartacus%20-%201960%20-%20poster.png?width=400"},0,["1956","1958","1963"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["ستانلي كوبريك"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/Spartacus%20-%201960%20-%20poster.png?width=400"},0,["دانيال مان","ويسلي روغلز","ألفريد سانتيل"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1939",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/WIZARD%20OF%20OZ%20ORIGINAL%20POSTER%201939.jpg?width=400"},0,["1935","1937","1942"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["فكتور فليمنغ"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/WIZARD%20OF%20OZ%20ORIGINAL%20POSTER%201939.jpg?width=400"},0,["سيدني فرانكلين","ميرا ناير","راؤل والش"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1950",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/Rashomon%20%28US%20poster%29.jpg?width=400"},0,["1946","1948","1953"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["أكيرا كوروساوا"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/Rashomon%20%28US%20poster%29.jpg?width=400"},0,["ميغيل أرتيتا","روي وارد بيكر","سيدني فرانكلين"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1954",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/Rear%20Window%20film%20poster.jpg?width=400"},0,["1950","1952","1957"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["ألفريد هتشكوك"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/Rear%20Window%20film%20poster.jpg?width=400"},0,["الكسندر كوردا","لويس مايلستون","روبرت ز. ليونارد"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","2017",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/Ep8%20teaser%201-sht%20v2%20sm.jpg?width=400"},0,["2013","2015","2020"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["ريان جونسون"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/Ep8%20teaser%201-sht%20v2%20sm.jpg?width=400"},0,["جون ستورجس","هاري لانغدن","جون فافرو"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1960",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/The%20Magnificent%20Seven%20%281960%20poster%29.jpg?width=400"},0,["1956","1958","1963"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["جون ستورجس"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/The%20Magnificent%20Seven%20%281960%20poster%29.jpg?width=400"},0,["سام وود","هنري هاثاوي","ياسوجيرو أوزو"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1963",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/The%20Birds%20original%20poster.jpg?width=400"},0,["1959","1961","1966"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["ألفريد هتشكوك"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/The%20Birds%20original%20poster.jpg?width=400"},0,["ريتشارد فليشر","جيمس باروت","إيرفينغ كامينغز"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1959",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/Northbynorthwest1.jpg?width=400"},0,["1955","1957","1962"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["ألفريد هتشكوك"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/Northbynorthwest1.jpg?width=400"},0,["ستيفن سودربرغ","راي إنرايت","جورج كيوكور"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1967",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/1968%20-%20Colonial%20Theater%20-%2024%20Apr%20MC%20-%20Allentown%20PA.jpg?width=400"},0,["1963","1965","1970"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["مايك نيكولز"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/1968%20-%20Colonial%20Theater%20-%2024%20Apr%20MC%20-%20Allentown%20PA.jpg?width=400"},0,["هاورد هوكس","جورج روميرو","إد وود"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1959",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/Trans-Lux%20Playhouse%20Ad%20-%2025%20December%201959%2C%20NW%2C%20Washington%2C%20D.C.png?width=400"},0,["1955","1957","1962"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["فرانسوا تروفو"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/Trans-Lux%20Playhouse%20Ad%20-%2025%20December%201959%2C%20NW%2C%20Washington%2C%20D.C.png?width=400"},0,["سيرجي آيزنشتاين","لويس ويبر","إيتشيرو هوندا"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1925",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/Gold%20rush%20poster.jpg?width=400"},0,["1921","1923","1928"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["تشارلي تشابلن"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/Gold%20rush%20poster.jpg?width=400"},0,["ويسلي روغلز","لويس ويبر","راي هاري هاوزن"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1952",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/Singin%27%20in%20the%20Rain%20%281952%20poster%29.jpg?width=400"},0,["1948","1950","1955"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["ستانلي دونين"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/Singin%27%20in%20the%20Rain%20%281952%20poster%29.jpg?width=400"},0,["جون غريفيث راي","هنري بركات","إد وود"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1933",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/Kingkongposter.jpg?width=400"},0,["1929","1931","1936"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["ميرين كوبر"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/Kingkongposter.jpg?width=400"},0,["بهرام بيضائي","رون هاوارد","ستيوارت باتون"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1962",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/To%20Kill%20a%20Mockingbird%20%281963%20US%20theatrical%20poster%29.jpg?width=400"},0,["1958","1960","1965"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["روبرت موليغان"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/To%20Kill%20a%20Mockingbird%20%281963%20US%20theatrical%20poster%29.jpg?width=400"},0,["فراس خوري","مونتا يبل","دايفيد كيلوغ"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1967",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/Bonnie%20and%20Clyde%20%281967%20teaser%20poster%29.jpg?width=400"},0,["1963","1965","1970"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["آرثر بن"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/Bonnie%20and%20Clyde%20%281967%20teaser%20poster%29.jpg?width=400"},0,["ويليام هارت","مايكل باول","ميرفين لوروا"]);
Q('film','pyear',"الفيلم ده (من البوستر) طلع في أنهي سنة؟","1951",{u:"https://commons.wikimedia.org/wiki/Special:FilePath/The%20African%20Queen%20%281952%20US%20poster%29.jpg?width=400"},0,["1947","1949","1954"]);
Q('film','pdir',"مين مخرج الفيلم اللي في البوستر؟",["جون هيوستن"],{u:"https://commons.wikimedia.org/wiki/Special:FilePath/The%20African%20Queen%20%281952%20US%20poster%29.jpg?width=400"},0,["روي دل روث","جورج كيوكور","عباس كيارستمي"]);

const VOK=new Set([224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296, 297, 298, 299, 300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 320, 321, 322, 323, 324, 325, 326, 327, 328, 329, 330, 331, 332, 333, 334, 335, 336, 337, 338, 339, 340, 341, 342, 343, 344, 345, 346, 347, 348, 349, 350, 0, 5, 11, 13, 56, 57, 58, 59, 60, 61, 62, 63, 64, 66, 67, 68, 69, 71, 72, 73, 74, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 97, 98, 109, 110, 111, 112, 113, 114, 115, 116, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 351, 352, 353, 354, 355, 356, 357, 358, 359, 360, 361, 362, 363, 364, 365, 366, 367, 368, 369, 370, 371, 372, 373, 374, 375, 376, 377, 378, 379, 380, 382, 383, 384, 385, 386, 387, 388, 389, 390, 391, 392, 393, 394, 395, 1, 2, 3, 6, 7, 8, 10, 12, 14, 157, 158, 159, 164, 167, 168, 169, 174, 180, 181, 201, 155, 160, 161, 208, 209, 210, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 220, 221, 222, 223, 442, 443, 444, 445, 446, 381, 447, 448, 449, 450, 451, 452, 453, 454, 455, 456, 457, 458, 459, 460, 461, 462, 463, 464, 465, 466, 467, 468, 469, 470, 471, 472, 473, 474, 475, 476, 477, 478, 479, 480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493, 494, 495, 496, 497, 498, 499, 500, 501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511, 512, 513, 514, 515, 516, 517, 518, 519, 520, 521, 522, 523, 524, 525, 526, 527, 528, 529, 530, 531, 532, 533, 534, 535, 536, 537, 538, 539, 540, 541, 542, 543, 544, 545, 546, 547, 548, 549, 550, 551, 552, 553, 554, 555, 556, 557, 558, 559, 560, 561, 562, 563, 564, 565, 566, 567, 568, 569, 570, 571, 572, 573, 574, 575, 576, 577, 578, 579, 580, 581, 582, 583, 584, 585, 586, 587, 588, 589, 590, 591, 592, 593, 594, 595, 596, 597, 598, 599, 600, 601, 602, 603, 604, 605, 606, 607, 608, 609, 610, 611, 612, 613, 614, 615, 616, 617, 618, 619, 620, 621, 622, 623, 624, 625, 626, 627, 628, 629, 630, 631, 632]);const PIN={"120": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e2/Adel_Imam_2009.jpg/500px-Adel_Imam_2009.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "121": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f2/Ahmed_Zaki_%281979%29.jpg/500px-Ahmed_Zaki_%281979%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "122": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a5/Mahmoud_Abdel_Aziz_%D8%A7%D9%84%D8%B3%D8%A7%D8%AD%D8%B1_%D9%85%D8%AD%D9%85%D9%88%D8%AF_%D8%B9%D8%A8%D8%AF_%D8%A7%D9%84%D8%B9%D8%B2%D9%8A%D8%B2.jpg/500px-Mahmoud_Abdel_Aziz_%D8%A7%D9%84%D8%B3%D8%A7%D8%AD%D8%B1_%D9%85%D8%AD%D9%85%D9%88%D8%AF_%D8%B9%D8%A8%D8%AF_%D8%A7%D9%84%D8%B9%D8%B2%D9%8A%D8%B2.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "123": "https://upload.wikimedia.org/wikipedia/commons/4/4a/%D9%83%D8%B1%D9%8A%D9%85_%D8%B9%D8%A8%D8%AF_%D8%A7%D9%84%D8%B9%D8%B2%D9%8A%D8%B2.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled", "124": "https://upload.wikimedia.org/wikipedia/commons/7/78/Ahmed_Helmy_in_Sawiris_2018.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled", "125": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/68/Mohamed_Henedy.png/500px-Mohamed_Henedy.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "126": "https://upload.wikimedia.org/wikipedia/commons/1/1d/Ahmed_Elsaqa_in_Dubai_-_ElMaslaha_Premiere.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled", "127": "https://upload.wikimedia.org/wikipedia/commons/b/b8/Ahmed_Mekky_2017.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled", "128": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e4/Youssra_%28cropped%29.jpg/500px-Youssra_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "129": "https://upload.wikimedia.org/wikipedia/commons/b/b5/Suad_Husni.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled", "130": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dc/Faten_Hamama_actress.jpg/500px-Faten_Hamama_actress.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "131": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/91/Omar_Sharif_1963.JPG/500px-Omar_Sharif_1963.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "133": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/36/Mona_Zaki_2015.jpg/500px-Mona_Zaki_2015.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "134": "https://upload.wikimedia.org/wikipedia/commons/3/31/Yehia_Elfakharany.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled", "135": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a9/Nelly_Karim_%28cropped%29.jpg/500px-Nelly_Karim_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "136": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/66/Amr_Abdul_Baset_Diab.jpg/500px-Amr_Abdul_Baset_Diab.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "137": "https://upload.wikimedia.org/wikipedia/commons/9/96/Umm_Kulthum_as_Fatimah.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled", "138": "https://upload.wikimedia.org/wikipedia/commons/8/8d/Abdel_Halim_Hafez.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled", "139": "https://upload.wikimedia.org/wikipedia/commons/b/b6/Mounirim.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled", "140": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b0/Nancy_Ajram_signing_ceremony.jpg/500px-Nancy_Ajram_signing_ceremony.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "141": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/49/%D8%B4%D9%8A%D8%B1%D9%8A%D9%86.jpg/500px-%D8%B4%D9%8A%D8%B1%D9%8A%D9%86.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "142": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/14/Fairuz_1971.jpg/500px-Fairuz_1971.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "143": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e2/Kadim_Al_Sahir_-_Photo_Khalid_Al-Busaidi.jpg/500px-Kadim_Al_Sahir_-_Photo_Khalid_Al-Busaidi.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "144": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/97/Elissa_Slotkin_2026_Official_Portrait.jpg/500px-Elissa_Slotkin_2026_Official_Portrait.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "145": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/91/Tamer_Hosny%27s_NYE_Concert_%282025%29_%28cropped%29.png/500px-Tamer_Hosny%27s_NYE_Concert_%282025%29_%28cropped%29.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "146": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a6/Mohamed_Salah_Argentina_v_Egypt_7_July_2026-163_%28cropped%29.jpg/500px-Mohamed_Salah_Argentina_v_Egypt_7_July_2026-163_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "147": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/57/Naguib_Mahfouz_HR.jpg/500px-Naguib_Mahfouz_HR.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "148": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a7/Ahmed_Zewail_HD2009_Othmer_Gold_Medal_portrait.JPG/500px-Ahmed_Zewail_HD2009_Othmer_Gold_Medal_portrait.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "149": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/71/Hassan_Shehata.jpg/500px-Hassan_Shehata.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "150": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c1/Essam_El-Hadary.jpg/500px-Essam_El-Hadary.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "151": "https://upload.wikimedia.org/wikipedia/commons/9/9a/TahaHussein.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled", "152": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cf/Stevan_Kragujevic%2C_Gamal_Abdel_Naser_u_Beogradu%2C_1962_%28cropped%29.jpg/500px-Stevan_Kragujevic%2C_Gamal_Abdel_Naser_u_Beogradu%2C_1962_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "153": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/46/Hawass.jpg/500px-Hawass.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "154": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2f/M_Yacoub.JPG/500px-M_Yacoub.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "351": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/79/San_Stefano_Grand_Plaza.JPG/500px-San_Stefano_Grand_Plaza.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "352": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/06/Panoramic_view_of_Aswan%2C_Egypt.jpg/500px-Panoramic_view_of_Aswan%2C_Egypt.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "353": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/35/LuxorHotelsIbnWalidSt.jpg/500px-LuxorHotelsIbnWalidSt.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "354": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d6/Hurghada_Hotels_R03.jpg/500px-Hurghada_Hotels_R03.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "355": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ac/Sharm_El_Sheikh_-_panoramio_%2815%29.jpg/500px-Sharm_El_Sheikh_-_panoramio_%2815%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "356": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/01/Port_Said_aerial_%28cropped%29.jpg/500px-Port_Said_aerial_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "357": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c9/Iss016e019375.jpg/500px-Iss016e019375.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "358": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/76/EG-suez-13-bg-ismailia.jpg/500px-EG-suez-13-bg-ismailia.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "359": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/25/%D8%B7%D8%B1%D9%8A%D9%82_%D8%A5%D9%84%D9%89_%D9%85%D8%A8%D9%86%D9%89_%D9%85%D8%AD%D8%A7%D9%81%D8%B8%D8%A9_%D8%AF%D9%85%D9%8A%D8%A7%D8%B7.JPG/500px-%D8%B7%D8%B1%D9%8A%D9%82_%D8%A5%D9%84%D9%89_%D9%85%D8%A8%D9%86%D9%89_%D9%85%D8%AD%D8%A7%D9%81%D8%B8%D8%A9_%D8%AF%D9%85%D9%8A%D8%A7%D8%B7.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "360": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8c/Al_Mansourah%2C_Om_Kalthoum_Sq.jpg/500px-Al_Mansourah%2C_Om_Kalthoum_Sq.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "361": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ad/Tanta-1.jpg/500px-Tanta-1.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "362": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c7/MadinatFayyumWaterWheel.jpg/500px-MadinatFayyumWaterWheel.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "363": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/af/%D9%8A%D9%88%D9%85_%D8%AC%D8%AF%D9%8A%D8%AF.jpg/500px-%D9%8A%D9%88%D9%85_%D8%AC%D8%AF%D9%8A%D8%AF.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "364": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e5/20191112_165747jpg.jpg/500px-20191112_165747jpg.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "365": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/03/Dahab_-_Egypte_07-2012_%287614814042%29.jpg/500px-Dahab_-_Egypte_07-2012_%287614814042%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "366": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c5/Entrance_Grand_Egyptian_museum.jpg/500px-Entrance_Grand_Egyptian_museum.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "367": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/db/AsyutSalamTaggatLibrary.jpg/500px-AsyutSalamTaggatLibrary.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "368": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/99/Akhenaten_museum_in_Minya_-_Egypt.jpg/500px-Akhenaten_museum_in_Minya_-_Egypt.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "369": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a7/SohagNasrCity.jpg/500px-SohagNasrCity.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "370": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a5/%D9%82%D9%86%D8%A7_2013.jpg/500px-%D9%82%D9%86%D8%A7_2013.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "371": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/23/Rosetta_Stone.JPG/500px-Rosetta_Stone.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "372": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5c/Porto_marina_resort_and_spa.jpg/500px-Porto_marina_resort_and_spa.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "373": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f4/Rocks_and_Water.jpg/500px-Rocks_and_Water.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "374": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/83/Snow_in_St._Katherine%2C_Sinai_Egypt_-_March_1%2C_2009.jpg/500px-Snow_in_St._Katherine%2C_Sinai_Egypt_-_March_1%2C_2009.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "375": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b5/Ramsis%2C_Aswan_Governorate%2C_Egypt_-_panoramio.jpg/500px-Ramsis%2C_Aswan_Governorate%2C_Egypt_-_panoramio.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "376": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/83/Cairo_Tower_%2814795997855%29.jpg/500px-Cairo_Tower_%2814795997855%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "377": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f1/%D9%82%D9%84%D8%B9%D8%A9_%D9%82%D8%A7%D9%8A%D8%AA%D8%A8%D8%A7%D9%8A_%D9%85%D9%86_%D8%A7%D9%84%D8%AC%D9%88.jpg/500px-%D9%82%D9%84%D8%B9%D8%A9_%D9%82%D8%A7%D9%8A%D8%AA%D8%A8%D8%A7%D9%8A_%D9%85%D9%86_%D8%A7%D9%84%D8%AC%D9%88.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "378": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/45/Alexandria_library_%281%29.jpg/500px-Alexandria_library_%281%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "379": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/60/Temple_de_Louxor_68.jpg/500px-Temple_de_Louxor_68.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "380": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0c/Luxor%2C_Tal_der_K%C3%B6nige_%281995%2C_860x605%29.jpg/500px-Luxor%2C_Tal_der_K%C3%B6nige_%281995%2C_860x605%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "381": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e7/Great_Pyramid_of_Giza_-_Pyramid_of_Khufu.jpg/500px-Great_Pyramid_of_Giza_-_Pyramid_of_Khufu.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "382": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/42/Sphinx_with_the_third_pyramid.jpg/500px-Sphinx_with_the_third_pyramid.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "383": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2e/BarragemAssu%C3%A3o.jpg/500px-BarragemAssu%C3%A3o.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "384": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/67/1977_bis_1980_wurde_die_Tempel_auf_der_Insel_Philae_auf_die_h%C3%B6her_gelegene_Insel_Agilka_versetzt._01.jpg/500px-1977_bis_1980_wurde_die_Tempel_auf_der_Insel_Philae_auf_die_h%C3%B6her_gelegene_Insel_Agilka_versetzt._01.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "385": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/93/Flickr_-_HuTect_ShOts_-_Citadel_of_Salah_El.Din_and_Masjid_Muhammad_Ali_%D9%82%D9%84%D8%B9%D8%A9_%D8%B5%D9%84%D8%A7%D8%AD_%D8%A7%D9%84%D8%AF%D9%8A%D9%86_%D8%A7%D9%84%D8%A3%D9%8A%D9%88%D8%A8%D9%8A_%D9%88%D9%85%D8%B3%D8%AC%D8%AF_%D9%85%D8%AD%D9%85%D8%AF_%D8%B9%D9%84%D9%8A_-_Cairo_-_Egypt_-_17_04_2010_%284%29.jpg/500px-thumbnail.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "386": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/74/%D8%AE%D8%A7%D9%86_%D8%A7%D9%84%D8%AE%D9%84%D9%8A%D9%84%D9%8A_1.jpg/500px-%D8%AE%D8%A7%D9%86_%D8%A7%D9%84%D8%AE%D9%84%D9%8A%D9%84%D9%8A_1.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "387": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/33/1897_bis_1902_wurde_das_%C3%84gyptische_Museum_in_Kairo_gebaut._04.jpg/500px-1897_bis_1902_wurde_das_%C3%84gyptische_Museum_in_Kairo_gebaut._04.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "388": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ee/Colossi_of_Memnon_May_2015_2.JPG/500px-Colossi_of_Memnon_May_2015_2.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "389": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/74/Templo_funerario_de_Hatshepsut%2C_Luxor%2C_Egipto%2C_2022-04-03%2C_DD_13.jpg/500px-Templo_funerario_de_Hatshepsut%2C_Luxor%2C_Egipto%2C_2022-04-03%2C_DD_13.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "390": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c3/Cairo_opera_house.jpg/500px-Cairo_opera_house.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "391": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/47/Mosqu%C3%A9e_Al-Azhar.jpg/500px-Mosqu%C3%A9e_Al-Azhar.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "392": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c9/Iss016e019375.jpg/500px-Iss016e019375.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "393": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4a/Al_Farafrah%2C_New_Valley_Governorate%2C_Egypt_-_panoramio_%2821%29.jpg/500px-Al_Farafrah%2C_New_Valley_Governorate%2C_Egypt_-_panoramio_%2821%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "394": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4a/Beautiful_nature_along_Nile_River_01.jpg/500px-Beautiful_nature_along_Nile_River_01.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "395": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b5/TahrirSQ-2020%281%29.jpg/500px-TahrirSQ-2020%281%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"};Object.keys(PIN).forEach(i=>{if(QB[i]&&QB[i].img)QB[i].img.u=PIN[i]});
/* ===== شخصيات SVG (من غير ايموجي) ===== */
const AVSVG=(()=>{
const E=(x=14,y=18,r=3.4)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/><circle cx="${x+.6}" cy="${y+.4}" r="${r/2}" fill="#222"/><circle cx="${40-x}" cy="${y}" r="${r}" fill="#fff"/><circle cx="${40-x+.6}" cy="${y+.4}" r="${r/2}" fill="#222"/>`;
const S=(a,b)=>`<path d="M${a} Q20 ${b} ${40-a} ${(a===14?27:27)}" stroke="#222" stroke-width="2" fill="none" stroke-linecap="round"/>`;
const smile='<path d="M13 27 Q20 34 27 27" stroke="#222" stroke-width="2.2" fill="none" stroke-linecap="round"/>';
const D={
'🤡':['#ffe3ec',`<circle cx="20" cy="22" r="13" fill="#fff"/><circle cx="8" cy="12" r="6" fill="#ef4444"/><circle cx="32" cy="12" r="6" fill="#ef4444"/>${E(14,19)}<circle cx="20" cy="24" r="4" fill="#ef4444"/><path d="M12 29 Q20 36 28 29" stroke="#c026d3" stroke-width="2.5" fill="none" stroke-linecap="round"/>`],
'🐸':['#d9f99d',`<circle cx="12" cy="10" r="6" fill="#4ade80"/><circle cx="28" cy="10" r="6" fill="#4ade80"/><ellipse cx="20" cy="24" rx="15" ry="12" fill="#4ade80"/><circle cx="12" cy="10" r="3" fill="#fff"/><circle cx="28" cy="10" r="3" fill="#fff"/><circle cx="12.5" cy="10.5" r="1.5" fill="#222"/><circle cx="28.5" cy="10.5" r="1.5" fill="#222"/><path d="M10 26 Q20 34 30 26" stroke="#166534" stroke-width="2.2" fill="none" stroke-linecap="round"/>`],
'🐵':['#fde68a',`<circle cx="6" cy="20" r="5" fill="#a16207"/><circle cx="34" cy="20" r="5" fill="#a16207"/><circle cx="20" cy="21" r="14" fill="#a16207"/><ellipse cx="20" cy="26" rx="9" ry="7" fill="#fcd9a8"/>${E(14,18,3)}<circle cx="18" cy="25" r="1" fill="#7c2d12"/><circle cx="22" cy="25" r="1" fill="#7c2d12"/><path d="M16 29 Q20 32 24 29" stroke="#7c2d12" stroke-width="1.6" fill="none"/>`],
'🦆':['#bae6fd',`<circle cx="20" cy="21" r="14" fill="#fde047"/>${E(14,17,3)}<ellipse cx="20" cy="26" rx="8" ry="4.5" fill="#fb923c"/><path d="M13 26 H27" stroke="#c2410c" stroke-width="1.2"/>`],
'🐧':['#cbd5e1',`<ellipse cx="20" cy="22" rx="14" ry="15" fill="#1e293b"/><ellipse cx="20" cy="25" rx="9" ry="10" fill="#fff"/>${E(15,17,3)}<path d="M16 22 L20 27 L24 22 Z" fill="#f59e0b"/>`],
'🐷':['#fbcfe8',`<path d="M8 8 L15 12 L9 18Z M32 8 L25 12 L31 18Z" fill="#f472b6"/><circle cx="20" cy="22" r="14" fill="#f9a8d4"/>${E(14,18,3)}<ellipse cx="20" cy="27" rx="6.5" ry="5" fill="#f472b6"/><circle cx="18" cy="27" r="1.2" fill="#9d174d"/><circle cx="22" cy="27" r="1.2" fill="#9d174d"/>`],
'🐙':['#e9d5ff',`<path d="M7 24 Q6 36 11 34 Q13 30 14 34 Q16 38 18 33 Q20 38 22 33 Q24 38 26 34 Q27 30 29 34 Q34 36 33 24Z" fill="#a855f7"/><circle cx="20" cy="18" r="13" fill="#a855f7"/>${E(14,17,3.2)}<path d="M15 25 Q20 29 25 25" stroke="#4c1d95" stroke-width="2" fill="none" stroke-linecap="round"/>`],
'🦖':['#bbf7d0',`<path d="M8 8 L12 14 L16 7 L20 13 L24 7 L28 14 L32 8 L32 18 L8 18Z" fill="#15803d"/><rect x="6" y="12" width="28" height="22" rx="11" fill="#22c55e"/>${E(14,20,3)}<path d="M12 29 H28" stroke="#14532d" stroke-width="2"/><path d="M14 29 v3 M18 29 v3 M22 29 v3 M26 29 v3" stroke="#fff" stroke-width="1.6"/>`],
'🥸':['#fed7aa',`<circle cx="20" cy="21" r="14" fill="#fcd9a8"/><path d="M6 16 Q20 4 34 16 Z" fill="#78350f"/><circle cx="14" cy="19" r="4.2" fill="none" stroke="#222" stroke-width="1.6"/><circle cx="26" cy="19" r="4.2" fill="none" stroke="#222" stroke-width="1.6"/><path d="M18 19 H22" stroke="#222" stroke-width="1.6"/><circle cx="14" cy="19" r="1.4" fill="#222"/><circle cx="26" cy="19" r="1.4" fill="#222"/><path d="M8 27 Q14 22 20 26 Q26 22 32 27 Q26 31 20 28 Q14 31 8 27Z" fill="#3b1d0a"/>`],
'🤪':['#fef08a',`<circle cx="20" cy="21" r="14" fill="#fde047"/><circle cx="13" cy="17" r="4.5" fill="#fff"/><circle cx="13.5" cy="17" r="2" fill="#222"/><circle cx="27" cy="19" r="2.8" fill="#fff"/><circle cx="27" cy="19" r="1.3" fill="#222"/><path d="M11 27 Q20 35 29 27Z" fill="#7f1d1d"/><path d="M17 29 Q20 38 23 29Z" fill="#fb7185"/>`],
'🦜':['#a7f3d0',`<circle cx="20" cy="21" r="14" fill="#ef4444"/><circle cx="14" cy="17" r="5" fill="#fff"/><circle cx="14.5" cy="17" r="2" fill="#222"/><path d="M22 18 Q34 18 31 28 Q26 24 22 25Z" fill="#facc15"/><path d="M20 4 Q24 10 22 12 Q18 8 20 4Z" fill="#3b82f6"/>`],
'🐔':['#fee2e2',`<path d="M14 9 Q16 3 19 8 Q21 2 24 8 Q27 4 27 10Z" fill="#ef4444"/><circle cx="20" cy="22" r="14" fill="#fff"/>${E(14,19,3)}<path d="M16 24 L24 24 L20 30Z" fill="#f59e0b"/><path d="M19 30 Q20 36 22 30Z" fill="#ef4444"/>`],
'🦥':['#e7e5e4',`<circle cx="20" cy="21" r="14" fill="#a8896c"/><ellipse cx="14" cy="19" rx="4.5" ry="3.5" fill="#4b3621"/><ellipse cx="26" cy="19" rx="4.5" ry="3.5" fill="#4b3621"/><circle cx="14" cy="19" r="1.4" fill="#fff"/><circle cx="26" cy="19" r="1.4" fill="#fff"/><ellipse cx="20" cy="26" rx="4" ry="3" fill="#4b3621"/><path d="M16 30 Q20 33 24 30" stroke="#4b3621" stroke-width="1.6" fill="none"/>`],
'🐻':['#fed7aa',`<circle cx="9" cy="9" r="5.5" fill="#92400e"/><circle cx="31" cy="9" r="5.5" fill="#92400e"/><circle cx="20" cy="22" r="14" fill="#b45309"/><ellipse cx="20" cy="27" rx="7" ry="5.5" fill="#fcd9a8"/>${E(14,18,2.6)}<ellipse cx="20" cy="25" rx="2.4" ry="1.8" fill="#222"/>`],
'🐮':['#e0f2fe',`<path d="M6 12 L12 14 M34 12 L28 14" stroke="#a16207" stroke-width="3" stroke-linecap="round"/><circle cx="20" cy="22" r="14" fill="#fff"/><circle cx="12" cy="15" r="5" fill="#27272a"/>${E(15,19,2.8)}<ellipse cx="20" cy="28" rx="8" ry="5.5" fill="#f9a8d4"/><circle cx="17" cy="28" r="1.2" fill="#9d174d"/><circle cx="23" cy="28" r="1.2" fill="#9d174d"/>`],
'🦄':['#fae8ff',`<path d="M20 2 L24 14 L16 14Z" fill="#facc15"/><circle cx="20" cy="22" r="14" fill="#fff"/><path d="M6 12 Q10 24 8 30 Q4 22 6 12Z" fill="#f472b6"/><path d="M12 10 Q4 8 5 16" fill="#a78bfa"/>${E(14,20,3)}<ellipse cx="20" cy="29" rx="5" ry="3" fill="#fbcfe8"/>`],
'👻':['#e0e7ff',`<path d="M8 36 V19 Q8 5 20 5 Q32 5 32 19 V36 Q29 32 26 36 Q23 32 20 36 Q17 32 14 36 Q11 32 8 36Z" fill="#fff" stroke="#c7d2fe" stroke-width="1.5"/><circle cx="15" cy="19" r="2.6" fill="#222"/><circle cx="25" cy="19" r="2.6" fill="#222"/><ellipse cx="20" cy="27" rx="3" ry="3.6" fill="#222"/>`],
'🥒':['#dcfce7',`<rect x="9" y="3" width="22" height="35" rx="11" fill="#4ade80"/><circle cx="14" cy="9" r="1" fill="#16a34a"/><circle cx="27" cy="31" r="1" fill="#16a34a"/>${E(15,16,3)}<path d="M15 25 Q20 30 25 25" stroke="#14532d" stroke-width="2" fill="none" stroke-linecap="round"/>`],
'🍕':['#fef3c7',`<path d="M4 8 Q20 -2 36 8 L20 38Z" fill="#fbbf24"/><path d="M4 8 Q20 -2 36 8 L34 11 Q20 3 6 11Z" fill="#d97706"/><circle cx="14" cy="16" r="3" fill="#dc2626"/><circle cx="25" cy="15" r="3" fill="#dc2626"/><circle cx="20" cy="26" r="3" fill="#dc2626"/><circle cx="17" cy="20" r="1.1" fill="#222"/><circle cx="23" cy="20" r="1.1" fill="#222"/>`],
'🐢':['#d1fae5',`<ellipse cx="20" cy="24" rx="15" ry="11" fill="#16a34a"/><path d="M12 20 H28 M16 15 L14 30 M24 15 L26 30" stroke="#14532d" stroke-width="1.6"/><circle cx="33" cy="17" r="6" fill="#86efac"/><circle cx="35" cy="15.5" r="1.4" fill="#222"/>`],
'🦒':['#fef9c3',`<path d="M12 4 L12 10 M26 4 L26 10" stroke="#a16207" stroke-width="2.5" stroke-linecap="round"/><circle cx="12" cy="4" r="2" fill="#a16207"/><circle cx="26" cy="4" r="2" fill="#a16207"/><rect x="9" y="8" width="22" height="28" rx="11" fill="#fbbf24"/><circle cx="14" cy="14" r="2.4" fill="#b45309"/><circle cx="27" cy="24" r="2.4" fill="#b45309"/>${E(15,19,2.6)}<ellipse cx="20" cy="29" rx="6" ry="4" fill="#fde68a"/><circle cx="18" cy="29" r=".9" fill="#92400e"/><circle cx="22" cy="29" r=".9" fill="#92400e"/>`],
'🐊':['#dcfce7',`<circle cx="12" cy="11" r="5" fill="#16a34a"/><circle cx="28" cy="11" r="5" fill="#16a34a"/><rect x="5" y="12" width="30" height="24" rx="10" fill="#22c55e"/><circle cx="12" cy="11" r="2.4" fill="#fff"/><circle cx="28" cy="11" r="2.4" fill="#fff"/><circle cx="12.4" cy="11.4" r="1.2" fill="#222"/><circle cx="28.4" cy="11.4" r="1.2" fill="#222"/><path d="M9 27 H31" stroke="#14532d" stroke-width="2"/><path d="M12 27 v3 M17 27 v3 M23 27 v3 M28 27 v3" stroke="#fff" stroke-width="1.8"/>`]
};
return e=>{const d=D[e];if(!d)return null;return `<svg viewBox="0 0 40 40" width="100%" height="100%" aria-hidden="true"><circle cx="20" cy="20" r="20" fill="${d[0]}"/>${d[1]}</svg>`};
})();

/* ===== دومينو ===== */
const DK=['dm','dma'],isD=k=>DK.includes(k);
const dAll=()=>{const r=[];for(let a=0;a<=6;a++)for(let b=a;b<=6;b++)r.push(a+'-'+b);return r};
const dp=t=>String(t).split('-').map(Number);
const dSum=t=>{const[a,b]=dp(t);return a+b};
const dDbl=t=>{const[a,b]=dp(t);return a===b};
const dEnds=st=>{const bd=A(st.bd);if(!bd.length)return null;return [dp(bd[0])[0],dp(bd[bd.length-1])[1]]};
function dSides(st,t){
  const e=dEnds(st);
  if(!e)return (!st.first||t===st.first)?['R']:[];
  const[a,b]=dp(t),r=[];
  if(a===e[0]||b===e[0])r.push('L');
  if(a===e[1]||b===e[1])r.push('R');
  return r;
}
const dPlayable=(st,p)=>A(st.hands[p]).filter(t=>dSides(st,t).length);
function dEndVal(st){
  const bd=A(st.bd);if(!bd.length)return 0;
  if(bd.length===1)return dSum(bd[0]);
  const l=dp(bd[0])[0],r=dp(bd[bd.length-1])[1];
  return (dDbl(bd[0])?l*2:l)+(dDbl(bd[bd.length-1])?r*2:r);
}
function dDeal(st){
  const n=st.order.length,all=shuf(dAll());
  st.hands={};st.order.forEach((p,i)=>st.hands[p]=all.slice(i*7,i*7+7));
  st.yd=all.slice(n*7);st.bd=[];st.pass=0;st.last=null;st.ev=null;
  let best=null,bi=0,bd=-1;
  st.order.forEach((p,i)=>A(st.hands[p]).forEach(t=>{const d=dDbl(t)?100+dSum(t):dSum(t);if(d>bd){bd=d;best=t;bi=i}}));
  st.first=best;st.turn=bi;st.ph='play';
}
function dRound(st,w,reason){
  const others=st.order.filter(p=>p!==w);
  let pts=0;
  if(st.kind==='dma'){
    const hs={};st.order.forEach(p=>hs[p]=A(st.hands[p]).reduce((s,t)=>s+dSum(t),0));
    pts=reason==='out'?others.reduce((s,p)=>s+hs[p],0):others.reduce((s,p)=>s+hs[p],0)-hs[w];
    pts=Math.max(0,Math.round(pts/5)*5);
    st.sc[w]=(st.sc[w]||0)+pts;
  }
  st.rs={w,wn:nm(w),reason,pts};st.v++;
  if(st.kind==='dm'||st.sc[w]>=st.target){
    const top=Math.max(...st.order.map(p=>st.sc[p]||0));
    st.over=1;st.winner=st.kind==='dm'?w:(st.order.find(p=>(st.sc[p]||0)===top));st.pts={};st.pts[st.winner]=1;
  }else st.ph='rd';
  return st;
}
function dSettle(st){
  const n=st.order.length;
  for(let g=0;g<n+1;g++){
    const cur=st.order[st.turn];
    if(dPlayable(st,cur).length||A(st.yd).length)return st;
    st.pass=(st.pass||0)+1;st.ev={t:'skip',p:cur};
    if(st.pass>=n){
      let w=st.order[0],lo=1e9;
      st.order.forEach(p=>{const s=A(st.hands[p]).reduce((a,t)=>a+dSum(t),0);if(s<lo){lo=s;w=p}});
      return dRound(st,w,'block');
    }
    st.turn=(st.turn+1)%n;
  }
  return st;
}
const domEng=kind=>({
  init(ids,o,ts){
    const st={kind,v:0,order:ids,sc:{},target:kind==='dma'?50:0};
    ids.forEach(p=>st.sc[p]=0);dDeal(st);return st;
  },
  act(o,p,a){
    const st=clone(o);if(st.over)return null;
    st.sc=st.sc||{};
    const cur=st.order[st.turn];
    if(a.t==='nh'){if(st.ph!=='rd'||!a.adm)return null;dDeal(st);st.v++;return st}
    if(st.ph!=='play'||p!==cur)return null;
    const hand=A(st.hands[p]);
    if(a.t==='draw'){
      if(dPlayable(st,p).length||!A(st.yd).length)return null;
      const yd=A(st.yd),t=yd.pop();st.yd=yd;st.hands[p]=[...hand,t];st.pass=0;st.ev={t:'draw',p};st.last=null;
      st.v++;return dSettle(st);
    }
    if(a.t==='play'){
      const t=a.tile;if(!hand.includes(t))return null;
      const sides=dSides(st,t);if(!sides.includes(a.side))return null;
      const[x,y]=dp(t),bd=A(st.bd),e=dEnds(st);
      if(!e)bd.push(x+'-'+y);
      else if(a.side==='L'){bd.unshift(y===e[0]?x+'-'+y:y+'-'+x)}
      else{bd.push(x===e[1]?x+'-'+y:y+'-'+x)}
      st.bd=bd;st.first=null;
      const nh=hand.filter(h=>h!==t);st.hands[p]=nh;st.pass=0;
      st.last={t,i:a.side==='L'&&e?0:bd.length-1};st.ev={t:'play',p};
      if(st.kind==='dma'){const v=dEndVal(st);if(v>0&&v%5===0){st.sc[p]=(st.sc[p]||0)+v;st.ev={t:'five',p,n:v};if(st.sc[p]>=st.target){st.v++;return dRound(st,p,'out_score')}}}
      if(!nh.length){st.v++;return dRound(st,p,'out')}
      st.turn=(st.turn+1)%st.order.length;st.v++;return dSettle(st);
    }
    return null;
  }
});
/* ===== شاشة الدومينو ===== */
const DPIPS=[[],[4],[0,8],[0,4,8],[0,2,6,8],[0,2,4,6,8],[0,2,3,5,6,8]];
const dHalf=n=>`<i class="dh">${[0,1,2,3,4,5,6,7,8].map(i=>`<b${DPIPS[n].includes(i)?' class="p"':''}></b>`).join('')}</i>`;
const dSnake=(bd,st,anim)=>{const K=(window.innerWidth<420?4:6),rows=[];for(let i=0;i<bd.length;i+=K)rows.push(bd.slice(i,i+K).map((t,j)=>({t,i:i+j})));
return rows.map((r,ri)=>{const rev=ri%2===1;const it=rev?r.slice().reverse():r;
return `<div class="dbr ${rev?'rv':''}">${it.map(x=>{let t=x.t;if(rev&&!dDbl(t)){const[a,b]=dp(t);t=b+'-'+a}return dTile(t,dDbl(t),(st.last&&st.last.i===x.i&&anim?'drop ':'')+(st.last&&st.last.i===x.i?'lastp':''))}).join('')}</div>`+(ri<rows.length-1?`<div class="dcn ${rev?'l':'r'}">${rev?'↙':'↘'}</div>`:'')}).join('')};
const dTile=(t,vert,cls='')=>{const[a,b]=dp(t);return `<span class="dt ${vert?'v':'h'} ${cls}">${dHalf(a)}<u></u>${dHalf(b)}</span>`};
const dSay={play:['على مهلك 😎','خد دي!','ضربة معلم!','ياسلام 👌'],draw:['يا ساتر 😅','مفيش حظ!','هاتلي واحدة'],skip:['عدّيت 😴','مليش حجر!'],five:['خمسات! 🤑','قبضت!','نقطة بنقطة 💰']};
function domV(st){
  const me=pid,inG=st.order.includes(me),cur=st.order[st.turn],myTurn=inG&&cur===me&&st.ph==='play'&&!st.over;
  const n=st.order.length,mi=Math.max(0,st.order.indexOf(me)),rot=Array.from({length:n},(_,i)=>st.order[(mi+i)%n]);
  const others=rot.slice(1),pos=n===2?['top']:n===3?['left','right']:['left','top','right'];
  const bd=A(st.bd),anim=S.dAnim!==st.gid+'-'+st.v;S.dAnim=st.gid+'-'+st.v;
  const bubble=p=>{if(!st.ev||st.ev.p!==p||!anim&&false)return '';const L=dSay[st.ev.t]||[];return L.length?`<span class="dbub" key="${st.v}">${L[st.v%L.length]}</span>`:''};
  const seat=(p,cls)=>`<div class="dseat ${cls} ${p===cur&&!st.over&&st.ph==='play'?'act':''}">${bubble(p)}<div class="dav">${av(nm(p))}</div><div class="dnm">${esc(nm(p))}${p===me?' (أنت)':''}</div><div class="dcnt">${p===me?'':'🀫 '}${A(st.hands[p]).length}${st.kind==='dma'?` • <b>${st.sc[p]||0}</b>`:''}</div></div>`;
  const mine=A(st.hands[me]),pl=dPlayable(st,me),canDraw=myTurn&&!pl.length&&A(st.yd).length>0;
  const ends=dEnds(st);
  const felt=`<div class="dfelt"><div class="dbd">${bd.length?dSnake(bd,st,anim):'<span class="small" style="opacity:.8">الطاولة فاضية — '+(st.first?`ابدأ بالحجر ${dp(st.first).join('|')}`:'')+'</span>'}</div>`+
    `<div class="dyd">🀫 الكومة: <b>${A(st.yd).length}</b>${ends?` • الأطراف: <b>${ends[0]}</b> و <b>${ends[1]}</b>`:''}${st.kind==='dma'?` • الهدف ${st.target}`:''}</div></div>`;
  const leg='<div class="dlegs"><i></i><i></i></div>';
  let msg=st.over?'':st.ph==='rd'?'':myTurn?(canDraw?'مفيش حجر يتلعب معاك، اسحب من الكومة':'دورك! اختار حجر'):`دور ${esc(nm(cur))}...`;
  const hand=inG?`<div class="dhand">${mine.map(t=>{const ok=myTurn&&dSides(st,t).length;return `<button class="dhb ${ok?'ok':''} ${S.dsel===t?'sel':''}" data-act="dsel" data-t="${t}" ${myTurn?'':'disabled'} aria-label="${t}">${dTile(t,true)}</button>`}).join('')||'<span class="small">إيدك فاضية</span>'}</div>`:'<p class="small" style="text-align:center">متفرج 👀</p>';
  let ctl='';
  if(myTurn&&S.dsel&&mine.includes(S.dsel)){const sd=dSides(st,S.dsel);ctl=`<div class="rm" style="gap:8px;justify-content:center">${sd.includes('L')?'<button class="big" style="margin:0" data-act="dplay" data-s="L">⬅ على الشمال</button>':''}${sd.includes('R')?'<button class="big" style="margin:0" data-act="dplay" data-s="R">على اليمين ➡</button>':''}</div>`}
  if(canDraw)ctl+=`<button class="big" data-act="ddraw">🀫 اسحب من الكومة (${A(st.yd).length})</button>`;
  let rd='';
  if(st.ph==='rd'&&st.rs){rd=`<div class="ovl"><div class="card" style="text-align:center;width:min(100%,380px)"><div style="font-size:2.4rem">🎉</div><h2>${esc(nm(st.rs.w)==='؟'&&st.rs.wn?st.rs.wn:nm(st.rs.w))} ${st.rs.reason==='block'?'كسب الجولة (الطاولة اتقفلت)':'خلّص أحجاره'}</h2><p class="pts">+${st.rs.pts} نقطة</p>${st.order.map(p=>`<div class="lb"><span style="display:flex;align-items:center">${av(nm(p))}${esc(nm(p))}</span><b>${st.sc[p]||0}</b></div>`).join('')}${isAdmin()?'<button class="big" data-act="dnh">الجولة الجاية ▶</button>':'<p class="small">مستنيين الأدمن يبدأ الجولة الجاية...</p>'}</div></div>`}
  return `<div class="dtbl n${n}">${others.map((p,i)=>seat(p,pos[i])).join('')}<div class="dmid">${felt}${leg}</div></div><div class="dmsg ${myTurn?'my':''}">${msg}</div>${st.ev&&st.ev.t==='five'?`<div class="dfive">+${st.ev.n} لـ ${esc(nm(st.ev.p))}</div>`:''}${ctl}<div class="dme">${inG?seat(me,'me'):''}</div>${hand}${rd}`;
}
const DART=`<svg viewBox="0 0 120 90"><ellipse cx="60" cy="76" rx="44" ry="8" fill="rgba(0,0,0,.22)"/><g transform="rotate(-14 40 46)"><rect x="14" y="20" width="52" height="28" rx="6" fill="#fff"/><line x1="40" y1="22" x2="40" y2="46" stroke="#222" stroke-width="2"/><g fill="#222"><circle cx="24" cy="30" r="3"/><circle cx="32" cy="38" r="3"/><circle cx="48" cy="28" r="3"/><circle cx="58" cy="28" r="3"/><circle cx="48" cy="40" r="3"/><circle cx="58" cy="40" r="3"/></g></g><g transform="rotate(12 80 52)"><rect x="56" y="40" width="52" height="28" rx="6" fill="#fff"/><line x1="82" y1="42" x2="82" y2="66" stroke="#222" stroke-width="2"/><g fill="#222"><circle cx="69" cy="54" r="3.4" fill="#d33"/><circle cx="95" cy="48" r="3"/><circle cx="102" cy="60" r="3"/><circle cx="95" cy="60" r="3"/><circle cx="102" cy="48" r="3"/></g></g></svg>`;

/* ===== الصوت ===== */
const SND=(()=>{
  let ctx,mg,mt=0,step=0,nextT=0,sfxOn=localStorage.sfx!=='0',musOn=localStorage.mus!=='0';
  const ac=()=>{if(!ctx){const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;try{ctx=new C();mg=ctx.createGain();mg.gain.value=.9;mg.connect(ctx.destination)}catch(e){return null}}if(ctx.state==='suspended')ctx.resume();return ctx};
  const tone=(f,t,d,type,v,sl)=>{const c=ctx,o=c.createOscillator(),g=c.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,t);if(sl)o.frequency.exponentialRampToValueAtTime(sl,t+d);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(mg);o.start(t);o.stop(t+d+.03)};
  const nz=(t,d,v,hp)=>{const c=ctx,n=Math.max(1,c.sampleRate*d|0),b=c.createBuffer(1,n,c.sampleRate),x=b.getChannelData(0);for(let i=0;i<n;i++)x[i]=(Math.random()*2-1)*(1-i/n);const s=c.createBufferSource();s.buffer=b;const f=c.createBiquadFilter();f.type='highpass';f.frequency.value=hp||1800;const g=c.createGain();g.gain.value=v;s.connect(f);f.connect(g);g.connect(mg);s.start(t)};
  const fx={
    click:t=>tone(660,t,.06,'triangle',.12),
    card:t=>{nz(t,.09,.3,2500);tone(180,t,.07,'sine',.16,90)},
    deal:t=>[0,.07,.14].forEach((d,i)=>nz(t+d,.07,.22,2200+i*300)),
    buzz:t=>{tone(880,t,.12,'square',.1);tone(1320,t+.08,.18,'square',.08)},
    ok:t=>[523,659,784,1047].forEach((f,i)=>tone(f,t+i*.08,.2,'triangle',.18)),
    bad:t=>{tone(220,t,.28,'sawtooth',.12,110);tone(165,t+.12,.3,'sawtooth',.1,80)},
    tick:t=>tone(1000,t,.04,'square',.05),
    uno:t=>{tone(1318,t,.5,'sine',.2);tone(1760,t+.02,.4,'sine',.1)},
    win:t=>[523,659,784,659,784,1047].forEach((f,i)=>tone(f,t+i*.11,.25,'triangle',.2)),
    pop:t=>tone(500,t,.1,'sine',.15,900)
  };
  const SC=[262,294,330,392,440,524,588,660,784];
  const MEL=[0,2,4,2,5,4,2,0,1,3,4,3,6,5,4,1,0,2,4,5,7,5,4,2,3,4,5,4,2,1,0,-1];
  const BS=[0,0,3,2,0,0,3,4];
  function sched(){
    if(!musOn||!ctx||ctx.state!=='running')return;
    while(nextT<ctx.currentTime+.45){
      const i=step%MEL.length,d=.28;
      if(MEL[i]>=0)tone(SC[MEL[i]],nextT,.26,'triangle',.045);
      if(i%4===0)tone(SC[BS[(i/4)%8|0]]/2,nextT,.7,'sine',.06);
      if(i%2===1)nz(nextT,.03,.012,6000);
      nextT+=d;step++;
    }
  }
  const api={
    start(){if(!ac())return;if(musOn&&!mt){nextT=ctx.currentTime+.1;mt=setInterval(sched,150)}},
    play(n){if(!sfxOn||!ac())return;try{fx[n]&&fx[n](ctx.currentTime+.01)}catch(e){}},
    toggleMus(){musOn=!musOn;localStorage.mus=musOn?1:0;if(musOn){if(ac()){nextT=ctx.currentTime+.1;if(!mt)mt=setInterval(sched,150)}}else if(mt){clearInterval(mt);mt=0}return musOn},
    toggleSfx(){sfxOn=!sfxOn;localStorage.sfx=sfxOn?1:0;return sfxOn},
    get mus(){return musOn},get sfx(){return sfxOn}
  };
  document.addEventListener('visibilitychange',()=>{if(!ctx)return;if(document.hidden)ctx.suspend();else ctx.resume()});
  return api;
})();
['pointerdown','keydown'].forEach(e=>document.addEventListener(e,()=>SND.start(),{once:true}));

/* ===== شخصيات مضحكة ===== */
const AVS=[['🤡','المهرّج'],['🐸','الضفدع'],['🐵','القرد'],['🦆','البطة'],['🐧','البطريق'],['🐷','الخنزورة'],['🐙','الأخطبوط'],['🦖','الديناصور'],['🥸','أبو شنب'],['🤪','المجنون'],['🦜','الببغاء'],['🐔','الفرخة'],['🦥','الكسلان'],['🐻','الدبدوب'],['🐮','البقرة'],['🦄','اليونيكورن'],['👻','العفريت'],['🥒','الخيارة'],['🍕','البيتزا'],['🐢','السلحفاة'],['🦒','الزرافة'],['🐊','التمساح']];
let AVM={};
const avPick=sel=>`<div class="avgrid" id="avg">${AVS.map(a=>`<button type="button" class="avb ${sel===a[0]?'sel':''}" data-act="avsel" data-e="${a[0]}" aria-label="${a[1]}"><span class="avs">${AVSVG(a[0])||a[0]}</span><small>${a[1]}</small></button>`).join('')}</div>`;

/* ===== رسومات الألعاب ===== */
const ART={
  dev:`<svg viewBox="0 0 120 90"><rect x="6" y="20" width="108" height="46" rx="12" fill="#ffc933"/><rect x="6" y="48" width="108" height="8" fill="#ff8a3d"/><g fill="#dff6ff"><rect x="14" y="28" width="20" height="16" rx="3"/><rect x="40" y="28" width="20" height="16" rx="3"/><rect x="66" y="28" width="20" height="16" rx="3"/><rect x="92" y="28" width="16" height="20" rx="3"/></g><g fill="#2b2100"><circle cx="30" cy="68" r="10"/><circle cx="90" cy="68" r="10"/></g><g fill="#fff"><circle cx="30" cy="68" r="4"/><circle cx="90" cy="68" r="4"/></g><text x="60" y="15" text-anchor="middle" font-size="16" fill="#fff">? ?</text></svg>`,
  classic:`<svg viewBox="0 0 120 90"><rect x="6" y="20" width="108" height="46" rx="12" fill="#10b79f"/><rect x="6" y="48" width="108" height="8" fill="#0f766e"/><g fill="#e8fffb"><rect x="14" y="28" width="20" height="16" rx="3"/><rect x="40" y="28" width="20" height="16" rx="3"/><rect x="66" y="28" width="20" height="16" rx="3"/><rect x="92" y="28" width="16" height="20" rx="3"/></g><g fill="#12323a"><circle cx="30" cy="68" r="10"/><circle cx="90" cy="68" r="10"/></g><g fill="#fff"><circle cx="30" cy="68" r="4"/><circle cx="90" cy="68" r="4"/></g><text x="60" y="15" text-anchor="middle" font-size="14" font-weight="900" fill="#fff">أ ب ج</text></svg>`,
  uno:`<svg viewBox="0 0 120 90"><g transform="translate(60 48)"><g transform="rotate(-24) translate(-34 -30)"><rect width="38" height="56" rx="6" fill="#e63946" stroke="#fff" stroke-width="3"/><text x="19" y="36" text-anchor="middle" font-size="24" font-weight="900" fill="#fff">7</text></g><g transform="rotate(-4) translate(-19 -32)"><rect width="38" height="56" rx="6" fill="#ffb703" stroke="#fff" stroke-width="3"/><text x="19" y="36" text-anchor="middle" font-size="20" font-weight="900" fill="#2b2100">+2</text></g><g transform="rotate(18) translate(-2 -30)"><rect width="38" height="56" rx="6" fill="#2f6fed" stroke="#fff" stroke-width="3"/><text x="19" y="36" text-anchor="middle" font-size="22" font-weight="900" fill="#fff">⦸</text></g></g><text x="60" y="86" text-anchor="middle" font-size="14" font-weight="900" fill="#fff">UNO!</text></svg>`,
  dm:`${DART}`,
  dma:`${DART}`,
  qz:`<svg viewBox="0 0 120 90"><ellipse cx="60" cy="74" rx="40" ry="9" fill="rgba(0,0,0,.22)"/><circle cx="60" cy="48" r="34" fill="#a61b2b"/><circle cx="60" cy="42" r="32" fill="#e5484d" stroke="#fff" stroke-width="4"/><path d="M60 30c-9 0-14 7-14 16v8l-5 6h38l-5-6v-8c0-9-5-16-14-16z" fill="#ffd54a" stroke="#fff" stroke-width="2"/><circle cx="60" cy="66" r="4" fill="#ffd54a" stroke="#fff" stroke-width="2"/><text x="100" y="22" font-size="22" fill="#fff" font-weight="900">؟</text><text x="12" y="30" font-size="16" fill="#ffe9a8" font-weight="900">+1</text></svg>`,
  qm:`<svg viewBox="0 0 120 90"><g font-size="13" font-weight="900" fill="#fff"><rect x="8" y="10" width="50" height="30" rx="8" fill="#e63946"/><rect x="62" y="10" width="50" height="30" rx="8" fill="#2f6fed"/><rect x="8" y="46" width="50" height="30" rx="8" fill="#2fb344"/><rect x="62" y="46" width="50" height="30" rx="8" fill="#e08a00"/><text x="33" y="30" text-anchor="middle">أ</text><text x="87" y="30" text-anchor="middle">ب</text><text x="33" y="66" text-anchor="middle">ج</text><text x="87" y="66" text-anchor="middle">د</text></g><circle cx="60" cy="43" r="14" fill="#fff"/><text x="60" y="50" text-anchor="middle" font-size="20" font-weight="900" fill="#7c3aed">؟</text></svg>`,
  cards:`<svg viewBox="0 0 120 90"><g transform="translate(60 48)"><g transform="rotate(-20) translate(-38 -32)"><rect width="40" height="58" rx="6" fill="#fff" stroke="#ccc"/><text x="20" y="36" text-anchor="middle" font-size="28" fill="#222">♠</text></g><g transform="rotate(0) translate(-20 -34)"><rect width="40" height="58" rx="6" fill="#fff" stroke="#ccc"/><text x="20" y="38" text-anchor="middle" font-size="28" fill="#d62839">♥</text></g><g transform="rotate(20) translate(-2 -32)"><rect width="40" height="58" rx="6" fill="#fff" stroke="#ccc"/><text x="20" y="36" text-anchor="middle" font-size="28" fill="#222">♣</text></g></g></svg>`
};

/* ===== الصور (ويكيبيديا + أعلام) ===== */
const IMGC=new Map();
function wikiImg(w,l){
  const k=l+':'+w;if(IMGC.has(k))return IMGC.get(k);
  const p=(async()=>{try{const r=await fetch(`https://${l}.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(w)}&gsrlimit=1&prop=pageimages&piprop=thumbnail&pithumbsize=500&format=json&origin=*`);const j=await r.json();const pg=Object.values(j.query?.pages||{})[0];return pg?.thumbnail?.source||''}catch(e){return ''}})();
  IMGC.set(k,p);return p;
}
const imgUrl=async im=>!im?'':im.u?im.u:im.f?`https://flagcdn.com/w320/${im.f}.png`:await wikiImg(im.w,im.l||'en');
function preload(q){if(q&&q.img)imgUrl(q.img).then(u=>{if(u){const i=new Image();i.src=u}})}
function hydrateImgs(){
  document.querySelectorAll('.qimg:not([data-done])').forEach(el=>{
    el.dataset.done=1;
    const show=u=>{if(!u){el.classList.add('none');return}const im=new Image();im.alt='';im.referrerPolicy='no-referrer';im.onload=()=>{el.innerHTML='';el.appendChild(im);el.classList.add('ok')};im.onerror=()=>el.classList.add('none');im.src=u};
    imgUrl(el.dataset.f?{f:el.dataset.f}:el.dataset.u?{u:el.dataset.u}:{w:el.dataset.w,l:el.dataset.l}).then(show);
  });
}

/* ===== لعبتين الأسئلة ===== */
const QK=['qz','qm'],isQ=k=>QK.includes(k);
const normq=s=>String(s||'').replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).toLowerCase().replace(/[«»"'!؟?.,،:؛()\-]/g,' ');
const qkey=s=>key(normq(s)).replace(/\s+/g,'');
function lev(a,b){const m=a.length,n=b.length;if(!m)return n;if(!n)return m;let p=Array.from({length:n+1},(_,j)=>j);for(let i=1;i<=m;i++){const c=[i];for(let j=1;j<=n;j++)c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));p=c}return p[n]}
function qMatch(q,txt){
  const t=qkey(txt);if(!t)return false;
  return q.a.some(a=>{const k=qkey(a);if(!k)return false;if(t===k)return true;const tol=k.length>=9?2:k.length>=5?1:0;return tol>0&&lev(t,k)<=tol});
}
const qRank=st=>[...st.order].sort((a,b)=>((st.sc&&st.sc[b])||0)-((st.sc&&st.sc[a])||0));
function qFinish(st){
  const r=qRank(st),top=(st.sc&&st.sc[r[0]])||0;
  const w=r.filter(p=>((st.sc&&st.sc[p])||0)===top);
  st.over=1;st.winner=w[0]||null;st.winners=w;st.pts={};w.forEach(p=>st.pts[p]=1);
}
function qSet(st,ts){
  const q=QB[st.qs[st.qi]];
  st.tried={};st.by=null;st.lw=null;st.rv=null;st.typed='';st.an={};st.opt=null;st.ci=-1;
  if(st.kind==='qm'){
    st.ph='q';st.tot=10000;st.until=ts+10000;
    const cor=q.a[0];
    let d=(q.d||[]).slice();
    if(!d.length){
      const same=QB.filter(x=>x!==q&&x.g===q.g&&!x.open&&x.a[0]&&x.a[0]!==cor).map(x=>x.a[0]);
      d=shuf([...new Set(same)]).slice(0,3);
      if(d.length<3){const more=QB.filter(x=>x!==q&&x.c===q.c&&!x.open&&x.a[0]&&x.a[0]!==cor&&!d.includes(x.a[0])).map(x=>x.a[0]);d=d.concat(shuf([...new Set(more)]).slice(0,3-d.length))}
    }
    st.opt=shuf([cor,...d.slice(0,3)]);st.ci=st.opt.indexOf(cor);
  }else{st.ph='ask';st.until=0;st.tot=0}
}
function quizEng(kind){
  return {
    init(ids,o,ts){
      o=o||{};
      const cats=o.cats&&o.cats.length?o.cats:Object.keys(CT),need=Math.max(5,Math.min(60,+o.n||(kind==='qz'?10:30)));
      let pool=QB.map((q,i)=>i).filter(i=>VOK.has(i)&&cats.includes(QB[i].c)&&(kind==='qz'||!QB[i].open));
      let seen=[];try{seen=JSON.parse(localStorage.seenq||'[]')}catch(e){}
      const fresh=pool.filter(i=>!seen.includes(i));
      const use=fresh.length>=need?fresh:pool;
      const qs=mixCats(use).slice(0,need);
      try{localStorage.seenq=JSON.stringify([...seen.filter(i=>!qs.includes(i)),...qs].slice(-600))}catch(e){}
      const st={kind,v:0,order:ids,sc:{},qs,qi:0,on:!!o.on,lead:Math.max(2,Math.min(20,+o.lead||5))};
      ids.forEach(p=>st.sc[p]=0);
      qSet(st,ts||Date.now());
      return st;
    },
    act(o,p,a){
      const st=clone(o);
      if(st.over)return null;
      st.sc=st.sc||{};st.tried=st.tried||{};st.an=st.an||{};
      const q=QB[st.qs[st.qi]],ts=+a.ts||0,inG=st.order.includes(p);
      const rev=(ms,rv)=>{st.ph='rev';st.until=ts+ms;st.tot=ms;st.rv=rv;st.v++;return st};
      const next=()=>{
        const r=qRank(st);
        if(kind==='qm'&&r.length>=2&&((st.sc[r[0]]||0)-(st.sc[r[1]]||0))>=st.lead){qFinish(st);st.v++;return st}
        st.qi++;
        if(st.qi>=st.qs.length){qFinish(st);st.v++;return st}
        qSet(st,ts);st.v++;return st;
      };
      if(a.t==='adv'){if(st.ph!=='rev'||!a.adm)return null;return next()}
      if(kind==='qz'){
        const judge=ok=>{
          const b=st.by;if(!b)return null;
          if(ok){st.sc[b]=(st.sc[b]||0)+1;return rev(3800,{p:b,ok:1})}
          st.sc[b]=(st.sc[b]||0)-1;st.tried[b]=1;st.lw={p:b,txt:st.typed||''};st.by=null;st.typed='';
          if(st.order.every(x=>st.tried[x]))return rev(3800,{none:1});
          st.ph='ask';st.until=0;st.v++;return st;
        };
        if(a.t==='buzz'){if(st.ph!=='ask'||!inG||st.tried[p])return null;const ms=st.on?20000:30000;st.by=p;st.ph='ans';st.until=ts+ms;st.tot=ms;st.lw=null;st.v++;return st}
        if(a.t==='submit'){
          if(st.ph!=='ans'||st.by!==p||!st.on)return null;
          st.typed=String(a.txt||'').slice(0,60);
          if(q.open){st.ph='judge';st.auto=0;st.until=0;st.tot=0;st.v++;return st}
          if(qMatch(q,st.typed))return judge(true);
          st.ph='judge';st.auto=1;st.until=ts+5000;st.tot=5000;st.v++;return st;
        }
        if(a.t==='judge'){if(!a.adm||!(st.ph==='judge'||(st.ph==='ans'&&!st.on)))return null;return judge(!!a.ok)}
        if(a.t==='timeout'){if(st.ph!=='ans'||ts<st.until-500)return null;return judge(false)}
        if(a.t==='skip'){if(!a.adm||!['ask','ans','judge'].includes(st.ph))return null;return rev(3500,{skip:1})}
        return null;
      }
      if(a.t==='pick'){if(st.ph!=='q'||!inG||st.an[p]!=null||!(a.i>=0&&a.i<4))return null;st.an[p]=a.i;st.v++;return st}
      if(a.t==='resolve'){
        if(st.ph!=='q')return null;
        const all=st.order.every(x=>st.an[x]!=null);
        if(!all&&ts<st.until-300)return null;
        const ok=[];st.order.forEach(x=>{if(st.an[x]===st.ci){st.sc[x]=(st.sc[x]||0)+1;ok.push(x)}});
        return rev(4500,{ok});
      }
      return null;
    }
  };
}

function mixCats(ids){const by={};shuf(ids).forEach(i=>{(by[QB[i].c]=by[QB[i].c]||[]).push(i)});const out=[];let last=null;while(Object.values(by).some(a=>a.length)){const ks=Object.keys(by).filter(k=>by[k].length);let c=ks.filter(k=>k!==last);if(!c.length)c=ks;const w=c.flatMap(k=>Array(by[k].length).fill(k));const k=w[rnd(w.length)];out.push(by[k].pop());last=k}return out}

/* ===== شاشات لعبتين الأسئلة ===== */
const qImg=q=>q.img?`<div class="qimg" ${q.img.f?`data-f="${q.img.f}"`:q.img.u?`data-u="${esc(q.img.u)}"`:`data-w="${esc(q.img.w)}" data-l="${q.img.l||'en'}"`}></div>`:'';
const qCard=q=>`<div class="card qcard"><span class="tag">${CT[q.c]}</span>${qImg(q)}<h2 class="qt">${esc(q.q)}</h2></div>`;
function qScores(st,hot){
  return `<div class="scs">`+st.order.map(p=>`<span class="scp ${p===hot?'hot':''}">${av(nm(p))}<span>${esc(nm(p))}${p===pid?' (أنت)':''}</span><b>${(st.sc&&st.sc[p])||0}</b></span>`).join('')+`</div>`;
}
const qAns=q=>q.open&&!q.a.length?'أي إجابة صح':q.a[0];
function qzV(st){
  const q=QB[st.qs[st.qi]],me=pid,inG=st.order.includes(me),adm=isAdmin(),A_=x=>x||{};
  if(!q)return '';
  preload(QB[st.qs[st.qi+1]]);
  const jb=`<div class="rm" style="gap:10px;margin-top:8px"><button class="big" style="margin:0" data-act="qjok">صح ✅</button><button class="big ghost" style="margin:0" data-act="qjno">غلط ❌</button></div>`;
  const skip=adm&&st.ph!=='rev'?`<div style="text-align:center;margin-top:8px"><button class="ghost sm" data-act="qskip">⏭ تخطي السؤال (محدش عارف)</button></div>`:'';
  let mid='';
  if(st.ph==='ask'){
    const can=inG&&!A_(st.tried)[me];
    mid=(st.lw?`<div class="qmsg bad">❌ ${esc(nm(st.lw.p))} جاوب غلط${st.lw.txt?' ('+esc(st.lw.txt)+')':''} −1</div>`:'')+
      `<button class="buzz" data-act="qbuzz" ${can?'':'disabled'}><span>🔔</span>${inG?(can?'اضغط وجاوب!':'جاوبت غلط، استنى'):'متفرج'}</button>`+skip;
  }else if(st.ph==='ans'){
    const mine=st.by===me;
    mid=`<div class="qmsg">🔔 ${esc(nm(st.by))} هو اللي بيجاوب!</div><div class="bar"><i id="qbar"></i></div>`+
      (st.on?(mine?`<div class="rm"><input class="qin" id="qa" maxlength="60" placeholder="اكتب إجابتك..." autocomplete="off"><button data-act="qsub">إرسال</button></div>`:`<p class="small" style="text-align:center">مستنيين إجابته ⌛</p>`)
        :`<p class="small" style="text-align:center">🎤 ${mine?'جاوب بصوتك قدام الشلة!':'بيجاوب بصوته، والأدمن هو اللي يحكم'}</p>${adm?(S.peek===st.gid+'-'+st.v?`<div class="ansbox">الإجابة: <b>${esc(qAns(q))}</b></div>`:`<div style="text-align:center"><button class="ghost sm" data-act="qpeek">👁 اعرض الإجابة للحكم</button></div>`)+jb:''}`)+skip;
  }else if(st.ph==='judge'){
    mid=`<div class="qmsg">${esc(nm(st.by))} جاوب: <b>${esc(st.typed)}</b></div>`+
      (adm?`${q.open?'':`<p class="small" style="text-align:center">الإجابة الصح: <b>${esc(q.a[0])}</b> • هتتحسب غلط تلقائي لو مفيش حكم</p>`}${jb}`:`<p class="small" style="text-align:center">الأدمن بيحكم... ⚖️</p>`)+(st.auto?'<div class="bar"><i id="qbar"></i></div>':'')+skip;
  }else{
    const r=st.rv||{};
    mid=(r.skip?`<div class="qmsg">⏭ اتخطينا السؤال</div>`:r.none?`<div class="qmsg bad">محدش جاوب صح 😅</div>`:`<div class="qmsg ok">✅ ${esc(nm(r.p))} جاوب صح! +1</div>`)+
      `<div class="ansbox">الإجابة: <b>${esc(qAns(q))}</b></div>`+(adm?`<button class="big ghost" data-act="qnext">التالي ➡️</button>`:`<p class="small" style="text-align:center">مستنيين الأدمن يدوس التالي ⌛</p>`);
  }
  return `<div class="qtop"><span class="small">سؤال ${st.qi+1} من ${st.qs.length}</span><span class="small">${st.on?'🌐 أونلاين':'🎤 مع الشلة'}</span></div>`+qScores(st,st.by)+qCard(q)+mid;
}
function qmV(st){
  const q=QB[st.qs[st.qi]],me=pid,inG=st.order.includes(me),A_=x=>x||[];
  if(!q)return '';
  preload(QB[st.qs[st.qi+1]]);
  const an=st.an||{},mine=an[me],rv=st.ph==='rev'?(st.rv||{}):null,ok=A_(rv&&rv.ok);
  const r=qRank(st),gap=r.length>1?((st.sc[r[0]]||0)-(st.sc[r[1]]||0)):0;
  const opts=A_(st.opt).map((t,i)=>{
    const cls=['opt',`o${i}`];
    let dis='';
    if(st.ph==='rev'){dis='disabled';cls.push(i===st.ci?'right':'wrong');if(mine===i)cls.push('me')}
    else if(mine!=null||!inG){dis='disabled';if(mine===i)cls.push('me')}
    return `<button class="${cls.join(' ')}" ${dis} data-act="qpick" data-i="${i}" style="animation-delay:${i*60}ms">${esc(t)}</button>`;
  }).join('');
  const answered=Object.keys(an).filter(x=>st.order.includes(x)).length;
  const head=st.ph==='q'?`<div class="rm" style="justify-content:space-between"><span class="small">${mine!=null?'اتسجلت إجابتك ✅':'اختار إجابتك'} • جاوب ${answered}/${st.order.length}</span><span class="qnum" id="qcd">10</span></div><div class="bar"><i id="qbar"></i></div>`:
    `<div class="qmsg ${ok.includes(me)?'ok':mine==null||mine!==st.ci?'bad':'ok'}">${ok.length?'✅ جاوب صح: '+ok.map(p=>esc(nm(p))).join('، '):'محدش جاوب صح 😅'}</div><div class="ansbox">الإجابة: <b>${esc(q.a[0])}</b></div>`;
  return `<div class="qtop"><span class="small">سؤال ${st.qi+1}</span><span class="small">الفوز لما الفارق ${st.lead} نقط</span></div>`+qScores(st)+
    `<div class="small" style="display:flex;justify-content:space-between"><span>الفارق بين الأول والتاني</span><b>${Math.max(0,gap)} / ${st.lead}</b></div><div class="lead"><i style="width:${Math.min(100,Math.max(0,gap)/st.lead*100)}%"></i></div>`+
    qCard(q)+head+`<div class="opts">${opts}</div>`+(st.ph==='rev'?(isAdmin()?`<button class="big ghost" data-act="qnext">التالي ➡️</button>`:`<p class="small" style="text-align:center">مستنيين الأدمن يدوس التالي ⌛</p>`):'');
}
function quizTick(){
  const st=S.cg;if(!st||st.over||!isQ(st.kind))return;
  const t=now(),rem=st.until?st.until-t:0;
  const bar=$('#qbar');if(bar&&st.tot)bar.style.width=Math.max(0,Math.min(100,rem/st.tot*100))+'%';
  const cd=$('#qcd');if(cd){const n=Math.max(0,Math.ceil(rem/1000));if(cd.textContent!==String(n)){cd.textContent=n;if(n>0&&n<=3&&st.ph==='q')SND.play('tick')}}
  if(!isAdmin()||!S.players[pid])return;
  const k=st.gid+'-'+st.v,f=S.qf||{};
  if(f.k===k&&Date.now()-f.at<2500)return;
  let a=null;
  if(st.kind==='qz'){
    if(st.ph==='ans'&&rem<-300)a={t:'timeout'};
    else if(st.ph==='judge'&&st.auto&&rem<-300)a={t:'judge',ok:false,adm:true};
  }else{
    const all=st.order.every(x=>(st.an||{})[x]!=null);
    if(st.ph==='q'&&(rem<-200||all))a={t:'resolve'};
  }
  if(a){S.qf={k,at:Date.now()};cgAct({...a,ts:now(),adm:true})}
}
function quizSound(st){
  const k=st.gid+'-'+st.v;if(S.qsk===k)return;const first=S.qsk==null;S.qsk=k;if(first)return;
  if(st.over)return SND.play('win');
  if(st.kind==='qz'){
    if(st.ph==='ans')SND.play('buzz');
    else if(st.ph==='rev'&&st.rv&&st.rv.ok)SND.play('ok');
    else if(st.ph==='ask'&&st.lw)SND.play('bad');
    else if(st.ph==='rev'&&st.rv&&st.rv.none)SND.play('bad');
  }else{
    if(st.ph==='rev'){const mi=(st.an||{})[pid];SND.play(mi===st.ci?'ok':'bad')}
    else if(st.ph==='q')SND.play('pop');
  }
}
function submitAns(){
  const i=$('#qa');if(!i)return;const v=i.value.trim();if(!v)return toast('اكتب إجابتك الأول');
  i.disabled=true;cgAct({t:'submit',txt:v,ts:now()});
}

RULES.qz=['من 2 لـ4 لاعبين، والأسئلة كلها من الأغاني والأفلام والإسلاميات والأعلام والعواصم والمدن.','اللي يدوس الجرس 🔔 الأول هو اللي لازم يجاوب.','الإجابة الصح = +1 نقطة، والغلط = -1 نقطة.','لو جاوب غلط السؤال بيفضل مفتوح للباقي، واللي غلط مينفعش يجاوب نفس السؤال تاني.','لو محدش عارف الأدمن يدوس "تخطي".','أونلاين: بتكتب إجابتك ويتصحح تلقائي (والأدمن يقدر يعدّل الحكم). مع الشلة: بتجاوب بصوتك والأدمن يحكم صح أو غلط.','عدد الأسئلة بيحدده الأدمن وانت بتعمل الغرفة، واللي معاه نقط أكتر في الآخر يكسب.'];
RULES.qm=['من 2 لـ4 لاعبين، وكل سؤال ليه 4 اختيارات.','الكل بيجاوب في نفس الوقت، وعندكم 10 ثواني.','بعد الـ10 ثواني (أو لما الكل يجاوب) النتيجة بتظهر: الصح بياخد نقطة والغلط ما بياخدش حاجة.','بتكسب لما تسبق اللي ورا بـ5 نقط.','لو محدش سبق بـ5 نقط، اللي معاه نقط أكتر لما الأسئلة تخلص يكسب.'];
const FXL={dog:'🐶 كلب',cat:'🐱 قطة',duck:'🦆 بطة',donkey:'🐴 حمار',kiss:'😘 بوسة',laugh:'🤣 ضحكة',raz:'💨 بربرة'};
const fxk=()=>{try{const x=ACC.p&&ACC.p.fx;if(FXL[x])return x}catch(e){}return FXL[localStorage.fxk]?localStorage.fxk:'duck'};
const FUN={c:null,play(k){try{const C=this.c||(this.c=new (window.AudioContext||window.webkitAudioContext)());if(C.state==='suspended')C.resume();const T=(ty,f0,f1,t0,d,v=.25)=>{const o=C.createOscillator(),g=C.createGain();o.type=ty;const t=C.currentTime+t0;o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g).connect(C.destination);o.start(t);o.stop(t+d+.02)};
const N=(t0,d,v=.3)=>{const b=C.createBuffer(1,C.sampleRate*d,C.sampleRate),a=b.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=(Math.random()*2-1)*(1-i/a.length);const s=C.createBufferSource(),g=C.createGain();g.gain.value=v;s.buffer=b;s.connect(g).connect(C.destination);s.start(C.currentTime+t0)};
if(k==='dog'){T('sawtooth',620,240,0,.14);T('sawtooth',560,200,.2,.16)}
else if(k==='cat'){T('sine',500,950,0,.25);T('sine',950,420,.25,.4)}
else if(k==='duck'){[0,.17,.34].forEach(t=>{T('sawtooth',520,300,t,.12);T('square',260,150,t,.12,.1)})}
else if(k==='donkey'){[0,.5].forEach(t=>{T('sawtooth',300,900,t,.22);T('sawtooth',900,280,t+.22,.25)})}
else if(k==='kiss'){T('sine',1500,350,0,.09,.35);N(0,.06,.25)}
else if(k==='laugh'){for(let i=0;i<6;i++)T('square',420-i*25,330-i*25,i*.11,.09,.12)}
else if(k==='raz'){for(let i=0;i<8;i++)T('sawtooth',90+Math.random()*40,60,i*.045,.05,.3);N(0,.3,.12)}}catch(e){}}};
let _fxt=0;function sendFx(){if(!S.rid)return;const t=Date.now();if(t-_fxt<1200)return;_fxt=t;const k=fxk();FUN.play(k);set(ref(db,base()+'/fx'),{k,p:pid,n:S.me,t:now(),r:Math.random().toString(36).slice(2,8)})}
function fxDlg(open){let d=$('#fxd');if(!d){d=document.createElement('div');d.id='fxd';document.body.appendChild(d)}d.innerHTML=open?`<div class="ov"><div class="card"><h3>🔊 اختار صوتك المضحك</h3><p class="small">الزرار في الروم بيشغل الصوت ده عند كل اللاعبين.</p><div class="chips">${Object.entries(FXL).map(([k,t])=>`<button class="chip ${fxk()===k?'on':''}" data-act="fxsel" data-k="${k}">${t}</button>`).join('')}</div><button class="big" data-act="fxclose">تمام</button></div></div>`:''}
function switchGame(k){if(!isAdmin()||!GAMES[k])return;const G=GAMES[k],m=`rooms/${S.rid}/meta/`,up={[m+'kind']:k,[`idx/${S.rid}/kind`]:k};if(G.ab){up[m+'cats']=k==='dev'?shuf(CATS).slice(0,8):CLASSIC;up[m+'rounds']=5;up[m+'limit']=0;up[m+'opts']=null}else up[m+'opts']=isQ(k)?{cats:Object.keys(CT),n:k==='qz'?15:40,on:true,lead:5}:{stack:true};update(ref(db),up).then(()=>toast('اتغيرت اللعبة 🎮',1))}
function swSel(){if(!isAdmin())return '';const ph=(S.game&&S.game.phase)||'lobby';if(ph!=='lobby')return '';const cur=S.meta.kind||'dev';return `<details class="card rules"><summary>🔄 غيّر اللعبة في نفس الروم</summary><div class="chips" style="margin-top:8px">${Object.entries(GAMES).filter(([k,g])=>!g.hide&&!g.solo).map(([k,g])=>`<button class="chip ${k===cur?'on':''}" data-act="gsel" data-k="${k}">${g.name}</button>`).join('')}</div>${cur==='qz'?`<button class="ghost sm" data-act="qonroom" style="margin-top:8px">${S.meta.opts&&S.meta.opts.on?'🌐 أونلاين (دوس لتحويلها لمع الشلة)':'🎤 مع الشلة (دوس لتحويلها لأونلاين)'}</button>`:''}</details>`}
const CAROUSEL=`<div class="carousel" aria-hidden="true"><svg viewBox="0 0 320 200" width="100%"><defs><linearGradient id="cg" x1="0" x2="1"><stop offset="0" stop-color="#ff4f81"/><stop offset="1" stop-color="#ffc933"/></linearGradient></defs>
<g class="cl cl1"><circle cx="30" cy="30" r="5" fill="#ffc933"/><circle cx="290" cy="40" r="4" fill="#10b79f"/></g>
<g class="bal b1"><ellipse cx="40" cy="60" rx="12" ry="15" fill="#ff4f81"/><path d="M40 75 L40 110" stroke="#888" /></g><g class="bal b2"><ellipse cx="282" cy="70" rx="12" ry="15" fill="#10b79f"/><path d="M282 85 L282 120" stroke="#888"/></g><g class="bal b3"><ellipse cx="255" cy="40" rx="10" ry="13" fill="#7c3aed"/><path d="M255 53 L255 90" stroke="#888"/></g>
<path d="M60 70 L160 14 L260 70 Z" fill="url(#cg)"/><path d="M60 70 Q110 82 160 70 Q210 82 260 70" fill="#fff" opacity=".35"/><circle cx="160" cy="12" r="6" fill="#ffc933" class="star"/>
<rect x="72" y="70" width="176" height="8" rx="4" fill="#7c3aed"/><g stroke="#ffd" stroke-width="5"><line x1="100" y1="78" x2="100" y2="150"/><line x1="160" y1="78" x2="160" y2="150"/><line x1="220" y1="78" x2="220" y2="150"/></g>
<g class="an a1"><g class="bob"><circle cx="0" cy="0" r="17" fill="#ffb3c7"/><circle cx="-11" cy="-14" r="6" fill="#ff8fb0"/><circle cx="11" cy="-14" r="6" fill="#ff8fb0"/><ellipse cx="0" cy="4" rx="8" ry="6" fill="#ff8fb0"/><circle cx="-3" cy="4" r="1.6" fill="#7a2a45"/><circle cx="3" cy="4" r="1.6" fill="#7a2a45"/><circle cx="-6" cy="-4" r="2" fill="#222"/><circle cx="6" cy="-4" r="2" fill="#222"/></g></g>
<g class="an a2"><g class="bob"><circle cx="0" cy="0" r="17" fill="#ffe14d"/><path d="M14 2 L28 6 L14 10 Z" fill="#ff8a3d"/><circle cx="4" cy="-5" r="2.4" fill="#222"/><path d="M-6 -17 Q0 -26 6 -17" fill="#ffe14d" stroke="#ffe14d"/></g></g>
<g class="an a3"><g class="bob"><circle cx="0" cy="0" r="17" fill="#b9825a"/><circle cx="-12" cy="-14" r="7" fill="#b9825a"/><circle cx="12" cy="-14" r="7" fill="#b9825a"/><circle cx="-12" cy="-14" r="3" fill="#7a4e2c"/><circle cx="12" cy="-14" r="3" fill="#7a4e2c"/><ellipse cx="0" cy="5" rx="8" ry="6" fill="#e8c9a8"/><circle cx="0" cy="3" r="2.4" fill="#222"/><circle cx="-6" cy="-4" r="2" fill="#222"/><circle cx="6" cy="-4" r="2" fill="#222"/></g></g>
<g class="an a4"><g class="bob"><circle cx="0" cy="0" r="16" fill="#f4f4f4"/><ellipse cx="-7" cy="-24" rx="5" ry="13" fill="#f4f4f4"/><ellipse cx="7" cy="-24" rx="5" ry="13" fill="#f4f4f4"/><ellipse cx="-7" cy="-24" rx="2.5" ry="9" fill="#ffb3c7"/><ellipse cx="7" cy="-24" rx="2.5" ry="9" fill="#ffb3c7"/><circle cx="-5" cy="-3" r="2" fill="#222"/><circle cx="5" cy="-3" r="2" fill="#222"/><circle cx="0" cy="4" r="2.4" fill="#ff8fb0"/></g></g>
<rect x="64" y="150" width="192" height="14" rx="7" fill="#7c3aed"/><rect x="80" y="164" width="160" height="10" rx="5" fill="#5b21b6"/>
<g fill="#ffc933"><circle cx="86" cy="157" r="3"/><circle cx="116" cy="157" r="3"/><circle cx="146" cy="157" r="3"/><circle cx="176" cy="157" r="3"/><circle cx="206" cy="157" r="3"/><circle cx="236" cy="157" r="3"/></g></svg></div>`;
RULES.dm=['من 2 لـ4 لاعبين، وكل واحد بياخد 7 أحجار والباقي في الكومة.','اللي معاه أكبر دبل (أو أكبر حجر) يبدأ بيه.','على دورك نزّل حجر رقمه زي أي طرف من الطرفين (شمال أو يمين).','لو معكش حجر يتلعب، اسحب من الكومة لحد ما يطلعلك حجر. ولو الكومة خلصت دورك بيتخطّى.','أول واحد يخلّص أحجاره يكسب. ولو الطاولة اتقفلت يكسب اللي مجموع أحجاره أقل.'];
RULES.dma=['دومينو أمريكاني (فايف) من 2 لـ4 لاعبين. كل واحد 7 أحجار والباقي كومة.','القواعد نفس الدومينو العادي، بس فيه نقط: لما مجموع رقمي الطرفين (الدبل بيتحسب مرتين) يبقى من مضاعفات الـ5 تاخد المجموع ده نقط.','اللي يخلّص أحجاره (أو الطاولة تتقفل وهو أقل مجموع) ياخد مجموع أحجار الباقيين مقرّب لأقرب 5.','أول واحد يوصل لـ50 نقطة يكسب. الأدمن بيدوس "الجولة الجاية" بين الجولات.'];
const myAv=()=>localStorage.av||(localStorage.av=AVS[rnd(AVS.length)][0]);
function cardSound(st){const k=st.gid+'-'+st.v,first=S.csk==null||String(S.csk).split('-')[0]!==String(st.gid);S.csk=k;if(!first)SND.play(st.over?'win':'card')}
function quizOver(st){
  const r=qRank(st),w=st.winners||[];
  return `<div style="font-size:3rem">🏆</div><h2>${st.aborted?'اللعبة خلصت (لاعبين مشيوا)':w.length>1?'تعادل بين '+w.map(p=>esc(nm(p))).join(' و'):esc(nm(w[0]))+' كسب!'}</h2>`+r.map((p,i)=>`<div class="lb"><span style="display:flex;align-items:center"><i class="rk">${i+1}</i>${av(nm(p))}${esc(nm(p))}</span><b>${(st.sc&&st.sc[p])||0}</b></div>`).join('');
}
const quizForm=k=>`<p class="small">الغرفة دي من ${GAMES[k].min} لحد ${GAMES[k].max} لاعبين. الأسئلة من الأغاني والأفلام والجغرافيا 🇪🇬</p>`+
  (k==='qz'?`<label>طريقة اللعب</label><div class="seg"><button data-act="qon" data-v="1" class="sel">🌐 أونلاين (بتكتب الإجابة)</button><button data-act="qon" data-v="0">🎤 مع الشلة (صوت والأدمن يحكم)</button></div>`:'')+
  `<label>الأقسام</label><div class="chips">${Object.entries(CT).map(([c,t])=>`<button class="chip on" data-act="qcat" data-ck="${c}">${esc(t)}</button>`).join('')}</div>
  <label for="qn">${k==='qz'?'عدد الأسئلة (طول الجولة)':'أقصى عدد أسئلة'}</label><input id="qn" type="number" min="5" max="60" value="${k==='qz'?10:30}">`+(k==='qm'?`<label for="ql">الفارق اللي يكسب بيه اللاعب (نقط)</label><input id="ql" type="number" min="2" max="20" value="5">`:'');

const _n0=QB.length;
Object.keys(CT).forEach(k=>delete CT[k]);Object.assign(CT,CT_MAP);BANK.forEach(q=>QB.push(q));
for(let i=_n0;i<QB.length;i++)VOK.add(i);const _FS=new Set([25,26,27,28,29,30,31]);QB.forEach((q,i)=>{if(q.c==='flag'||(q.c==='gen'&&q.g==='world')||(q.c==='film'&&i>=569&&(q.g==='pyear'||q.g==='pdir'))||_FS.has(i))VOK.delete(i)});
/* ===== ألعاب الطاولة: XO / 4 في صف / داما / لودو / سلم وتعبان / ذاكرة ===== */
const BK=['xo','c4','dama','ludo','snl','mem'],isB=k=>BK.includes(k);
const bgWin=(st,w)=>{st.over=1;st.winner=w||null;st.pts=w?{[w]:1}:{};if(!w)st.draw=1;st.v++;return st};
const bgOth=(st,p)=>st.order.find(x=>x!==p);
/* ---------- XO ---------- */
const XL=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
const xoLine=b=>{for(const l of XL){const c=b[l[0]];if(c!=='.'&&c===b[l[1]]&&c===b[l[2]])return l}return null};
const xoEng={
  init(ids){const o=shuf(ids);return {kind:'xo',v:0,order:o,turn:0,bd:'.........'}},
  act(o,p,a){
    const st=clone(o);if(st.over||a.t!=='mv'||st.order[st.turn]!==p)return null;
    const i=+a.i;if(!(i>=0&&i<9)||st.bd[i]!=='.')return null;
    const m=st.order.indexOf(p)===0?'X':'O';st.bd=st.bd.slice(0,i)+m+st.bd.slice(i+1);st.last=i;
    const l=xoLine(st.bd);if(l){st.wl=l;return bgWin(st,p)}
    if(!st.bd.includes('.'))return bgWin(st,null);
    st.turn=1-st.turn;st.v++;return st;
  }
};
/* ---------- 4 في صف ---------- */
const C4R=6,C4C=7;
function c4Win(b,m){
  const g=(r,c)=>r>=0&&r<C4R&&c>=0&&c<C4C?b[r*C4C+c]:'';
  for(let r=0;r<C4R;r++)for(let c=0;c<C4C;c++){
    if(g(r,c)!==m)continue;
    for(const [dr,dc] of [[0,1],[1,0],[1,1],[1,-1]]){
      let k=1;while(k<4&&g(r+dr*k,c+dc*k)===m)k++;
      if(k===4)return [0,1,2,3].map(j=>(r+dr*j)*C4C+c+dc*j);
    }
  }
  return null;
}
const c4Eng={
  init(ids){const o=shuf(ids);return {kind:'c4',v:0,order:o,turn:0,bd:'.'.repeat(C4R*C4C)}},
  act(o,p,a){
    const st=clone(o);if(st.over||a.t!=='mv'||st.order[st.turn]!==p)return null;
    const c=+a.c;if(!(c>=0&&c<C4C))return null;
    let r=-1;for(let k=C4R-1;k>=0;k--)if(st.bd[k*C4C+c]==='.'){r=k;break}
    if(r<0)return null;
    const m=st.order.indexOf(p)===0?'X':'O',i=r*C4C+c;
    st.bd=st.bd.slice(0,i)+m+st.bd.slice(i+1);st.last=i;
    const w=c4Win(st.bd,m);if(w){st.wl=w;return bgWin(st,p)}
    if(!st.bd.includes('.'))return bgWin(st,null);
    st.turn=1-st.turn;st.v++;return st;
  }
};
/* ---------- داما (Checkers) ---------- */
// a/A = لاعب 0 (تحت)، b/B = لاعب 1 (فوق). a بيتحرك لفوق (صف أقل)
const dmSide=ch=>ch==='a'||ch==='A'?0:ch==='b'||ch==='B'?1:-1;
const dmKing=ch=>ch==='A'||ch==='B';
function dmInit(){
  let s='';
  for(let r=0;r<8;r++)for(let c=0;c<8;c++){
    s+=(r+c)%2===1?(r<3?'b':r>4?'a':'.'):'.';
  }
  return s;
}
function dmMoves(bd,side,mj){
  const caps=[],steps=[];
  const from=mj!=null&&mj>=0?[mj]:[...Array(64).keys()].filter(i=>dmSide(bd[i])===side);
  for(const f of from){
    const ch=bd[f],r=Math.floor(f/8),c=f%8,k=dmKing(ch);
    const dirs=k?[[-1,-1],[-1,1],[1,-1],[1,1]]:side===0?[[-1,-1],[-1,1]]:[[1,-1],[1,1]];
    for(const [dr,dc] of dirs){
      const r1=r+dr,c1=c+dc;if(r1<0||r1>7||c1<0||c1>7)continue;
      const t=bd[r1*8+c1];
      if(t==='.'){if(mj==null||mj<0)steps.push({f,t:r1*8+c1})}
      else if(dmSide(t)===1-side){
        const r2=r1+dr,c2=c1+dc;
        if(r2>=0&&r2<8&&c2>=0&&c2<8&&bd[r2*8+c2]==='.')caps.push({f,t:r2*8+c2,x:r1*8+c1});
      }
    }
  }
  return caps.length?caps:steps;
}
const dmEng={
  init(ids){const o=shuf(ids);return {kind:'dama',v:0,order:o,turn:0,bd:dmInit(),mj:-1}},
  act(o,p,a){
    const st=clone(o);if(st.over||a.t!=='mv'||st.order[st.turn]!==p)return null;
    const side=st.turn,mv=dmMoves(st.bd,side,st.mj).find(m=>m.f===+a.f&&m.t===+a.to);
    if(!mv)return null;
    const b=st.bd.split('');let ch=b[mv.f];b[mv.f]='.';
    if(mv.x!=null)b[mv.x]='.';
    let promo=false;const tr=Math.floor(mv.t/8);
    if(!dmKing(ch)&&((side===0&&tr===0)||(side===1&&tr===7))){ch=ch.toUpperCase();promo=true}
    b[mv.t]=ch;st.bd=b.join('');st.last=mv.t;st.lf=mv.f;
    if(mv.x!=null&&!promo){
      const more=dmMoves(st.bd,side,mv.t).filter(m=>m.x!=null);
      if(more.length){st.mj=mv.t;st.v++;return st}
    }
    st.mj=-1;st.turn=1-st.turn;
    if(!dmMoves(st.bd,st.turn,-1).length)return bgWin(st,p);
    st.v++;return st;
  }
};
/* ---------- لودو ---------- */
const LRING=[[1,6],[2,6],[3,6],[4,6],[5,6],[6,5],[6,4],[6,3],[6,2],[6,1],[6,0],[7,0],[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[9,6],[10,6],[11,6],[12,6],[13,6],[14,6],[14,7],[14,8],[13,8],[12,8],[11,8],[10,8],[9,8],[8,9],[8,10],[8,11],[8,12],[8,13],[8,14],[7,14],[6,14],[6,13],[6,12],[6,11],[6,10],[6,9],[5,8],[4,8],[3,8],[2,8],[1,8],[0,8],[0,7],[0,6]];
const LSAFE=[0,8,13,21,26,34,39,47];
const lSeat=(st,p)=>st.seats[st.order.indexOf(p)];
const lRing=(seat,pp)=>(13*seat+pp)%52;
function lMoves(st,p){
  const r=st.roll,tk=A(st.tk[p]),out=[];
  tk.forEach((pp,k)=>{
    if(pp===-1){if(r===6)out.push(k)}
    else if(pp+r<=57)out.push(k);
  });
  return out;
}
function lNext(st){st.turn=(st.turn+1)%st.order.length;st.ph='roll';st.roll=0}
const ludoEng={
  init(ids){
    const o=shuf(ids),seats=o.length===2?[0,2]:o.length===3?[0,1,2]:[0,1,2,3];
    const st={kind:'ludo',v:0,order:o,turn:0,seats,ph:'roll',roll:0,tk:{}};
    o.forEach(p=>st.tk[p]=[-1,-1,-1,-1]);return st;
  },
  act(o,p,a){
    const st=clone(o);if(st.over||st.order[st.turn]!==p)return null;
    if(a.t==='roll'){
      if(st.ph!=='roll')return null;
      st.roll=1+rnd(6);st.lr=st.roll;st.ev={t:'roll',p,n:st.roll};
      if(!lMoves(st,p).length){st.ev={t:'none',p,n:st.roll};lNext(st)}else st.ph='move';
      st.v++;return st;
    }
    if(a.t==='mv'){
      if(st.ph!=='move')return null;
      const k=+a.k;if(!lMoves(st,p).includes(k))return null;
      const tk=A(st.tk[p]).slice(),seat=lSeat(st,p),r=st.roll;
      let np=tk[k]===-1?0:tk[k]+r,cap=0;tk[k]=np;st.tk[p]=tk;
      if(np<=50){
        const ri=lRing(seat,np);
        if(!LSAFE.includes(ri)){
          st.order.forEach(q=>{if(q===p)return;const qs=lSeat(st,q),qt=A(st.tk[q]).slice();let ch=false;
            qt.forEach((qp,j)=>{if(qp>=0&&qp<=50&&lRing(qs,qp)===ri){qt[j]=-1;cap++;ch=true}});if(ch)st.tk[q]=qt});
        }
      }
      st.lm={p,k,cap};st.ev=cap?{t:'cap',p,n:cap}:np===57?{t:'home',p}:{t:'mv',p};
      if(tk.every(x=>x===57)){st.v++;return bgWin(st,p)}
      if(r===6||cap||np===57){st.ph='roll';st.roll=0}else lNext(st);
      st.v++;return st;
    }
    return null;
  }
};
/* ---------- سلم وتعبان ---------- */
const SNK={16:6,47:26,49:11,56:53,62:19,64:60,87:24,93:73,95:75,98:78};
const LAD={1:38,4:14,9:31,21:42,28:84,36:44,51:67,71:91,80:100};
const snlEng={
  init(ids){const o=shuf(ids),st={kind:'snl',v:0,order:o,turn:0,pos:{},roll:0};o.forEach(p=>st.pos[p]=0);return st},
  act(o,p,a){
    const st=clone(o);if(st.over||a.t!=='roll'||st.order[st.turn]!==p)return null;
    const r=1+rnd(6);let np=(st.pos[p]||0)+r,jump=0;
    if(np>100)np=st.pos[p]||0;
    const from=np;
    if(SNK[np]){np=SNK[np];jump=-1}else if(LAD[np]){np=LAD[np];jump=1}
    st.pos[p]=np;st.roll=r;st.ev={t:'roll',p,n:r,j:jump,f:from,to:np};
    if(np===100)return bgWin(st,p);
    if(r!==6)st.turn=(st.turn+1)%st.order.length;
    st.v++;return st;
  }
};
/* ---------- ذاكرة ---------- */
const MEMN=8;
const memEng={
  init(ids){
    const o=shuf(ids),cards=shuf([...Array(MEMN).keys(),...Array(MEMN).keys()]);
    const st={kind:'mem',v:0,order:o,turn:0,cards,mt:cards.map(()=>0),fl:[],ph:'play',sc:{}};
    o.forEach(p=>st.sc[p]=0);return st;
  },
  act(o,p,a){
    const st=clone(o);if(st.over)return null;
    if(a.t==='res'){
      if(st.ph!=='show')return null;
      const fl=A(st.fl);
      if(st.ok){fl.forEach(i=>st.mt[i]=1)}else st.turn=(st.turn+1)%st.order.length;
      st.fl=[];st.ph='play';st.ok=0;
      if(st.mt.every(x=>x)){
        const top=Math.max(...st.order.map(q=>st.sc[q]||0)),w=st.order.filter(q=>(st.sc[q]||0)===top);
        st.v++;return w.length===1?bgWin(st,w[0]):(()=>{st.over=1;st.winner=null;st.draw=1;st.pts={};w.forEach(q=>st.pts[q]=1);return st})();
      }
      st.v++;return st;
    }
    if(a.t==='flip'){
      if(st.ph!=='play'||st.order[st.turn]!==p)return null;
      const i=+a.i,fl=A(st.fl);
      if(!(i>=0&&i<st.cards.length)||st.mt[i]||fl.includes(i))return null;
      fl.push(i);st.fl=fl;
      if(fl.length===2){st.ph='show';st.ok=st.cards[fl[0]]===st.cards[fl[1]]?1:0;if(st.ok)st.sc[p]=(st.sc[p]||0)+1}
      st.v++;return st;
    }
    return null;
  }
};
function bgDrop(st,p,i){
  st.order.splice(i,1);
  if(st.pos)delete st.pos[p];if(st.tk)delete st.tk[p];if(st.sc)delete st.sc[p];
  if(st.kind==='ludo'&&st.seats)st.seats.splice(i,1);
  if(st.order.length<2){st.over=1;st.aborted=1;st.winner=st.order[0]||null;st.pts={};st.v++;return st}
  if(i<st.turn)st.turn--;else if(i===st.turn){st.turn%=st.order.length;if(st.kind==='ludo'){st.ph='roll';st.roll=0}if(st.kind==='mem'){st.fl=[];st.ph='play';st.ok=0}if(st.kind==='dama')st.mj=-1}
  st.turn%=st.order.length;
  st.v++;return st;
}
/* ====================== الشاشات ====================== */
const bgHead=(st,extra)=>`<div class="bgp">${st.order.map((p,i)=>`<div class="bgpl ${i===st.turn&&!st.over?'act':''}"><div class="bgav">${av(nm(p))}</div><b>${esc(nm(p))}${p===pid?' (أنت)':''}</b>${extra?extra(p,i):''}</div>`).join('')}</div>`;
const bgMsg=(st,mine,other)=>`<div id="ban">${st.over?'':mine?'دورك! 🎯':other}</div>`;
const XSVG='<svg viewBox="0 0 40 40"><path d="M8 8 L32 32 M32 8 L8 32" stroke="#ff4f81" stroke-width="7" stroke-linecap="round" fill="none"/></svg>';
const OSVG='<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="12" stroke="#2ad6bd" stroke-width="7" fill="none"/></svg>';
function xoV(st){
  const me=pid,my=st.order[st.turn]===me;
  const wl=st.wl||[];
  const cells=[...st.bd].map((c,i)=>`<button class="xoc ${wl.includes(i)?'wl':''} ${st.last===i&&S.bgA!==st.gid+'-'+st.v?'pop':''}" data-act="bmv" data-i="${i}" ${(!my||st.over||c!=='.')?'disabled':''} aria-label="خانة ${i+1}">${c==='X'?XSVG:c==='O'?OSVG:''}</button>`).join('');
  S.bgA=st.gid+'-'+st.v;
  return bgHead(st,(p,i)=>`<span class="bgm">${i===0?XSVG:OSVG}</span>`)+bgMsg(st,my,'دور '+esc(nm(st.order[st.turn]))+'...')+`<div class="xob">${cells}</div>`;
}
function c4V(st){
  const me=pid,my=st.order[st.turn]===me&&!st.over,wl=st.wl||[];
  let h='<div class="c4b">';
  for(let c=0;c<C4C;c++){
    h+=`<button class="c4col" data-act="bmv" data-c="${c}" ${(!my||st.bd[c]!=='.')?'disabled':''} aria-label="عمود ${c+1}">`;
    for(let r=0;r<C4R;r++){const i=r*C4C+c,ch=st.bd[i];h+=`<i class="c4d ${ch==='X'?'x':ch==='O'?'o':''} ${wl.includes(i)?'wl':''} ${st.last===i&&S.bgA!==st.gid+'-'+st.v?'drop':''}"></i>`}
    h+='</button>';
  }
  h+='</div>';S.bgA=st.gid+'-'+st.v;
  return bgHead(st,(p,i)=>`<i class="c4d ${i===0?'x':'o'} sm"></i>`)+bgMsg(st,my,'دور '+esc(nm(st.order[st.turn]))+'...')+h;
}
const DMP=(ch)=>ch==='.'?'':`<i class="dmp ${dmSide(ch)===0?'pa':'pb'} ${dmKing(ch)?'k':''}">${dmKing(ch)?'<svg viewBox="0 0 24 24"><path d="M4 17 L3 7 L8 11 L12 5 L16 11 L21 7 L20 17 Z" fill="#ffd54a" stroke="#7a5a00" stroke-width="1.4"/></svg>':''}</i>`;
function dmV(st){
  const me=pid,mi=st.order.indexOf(me),side=st.turn,cur=st.order[st.turn],my=cur===me&&!st.over;
  const flip=mi===1;  // اللاعب 1 يشوف اللوح مقلوب عشان قطعه تبقى تحت
  const mv=my?dmMoves(st.bd,side,st.mj):[];
  const sel=S.dmsel!=null&&mv.some(m=>m.f===S.dmsel)?S.dmsel:(st.mj>=0&&my?st.mj:null);
  const dests=sel!=null?mv.filter(m=>m.f===sel).map(m=>m.t):[];
  const movable=new Set(mv.map(m=>m.f));
  let h='<div class="dmb">';
  for(let rr=0;rr<8;rr++)for(let cc=0;cc<8;cc++){
    const r=flip?7-rr:rr,c=flip?7-cc:cc,i=r*8+c,dark=(r+c)%2===1,ch=st.bd[i];
    const act=dark&&my&&(dests.includes(i)?'dmgo':movable.has(i)?'dmpk':'');
    h+=`<button class="dmc ${dark?'dk':'lt'} ${sel===i?'sel':''} ${dests.includes(i)?'dest':''} ${st.last===i?'lst':''}" ${dark&&my&&(dests.includes(i)||movable.has(i))?`data-act="${dests.includes(i)?'dmgo':'dmpk'}" data-i="${i}"`:'disabled'} aria-label="خانة">${DMP(ch)}</button>`;
  }
  h+='</div>';
  const cnt=s=>[...st.bd].filter(x=>dmSide(x)===s).length;
  return bgHead(st,(p,i)=>`<span class="bgm"><i class="dmp ${i===0?'pa':'pb'} sm"></i> ${cnt(i)}</span>`)+bgMsg(st,my,'دور '+esc(nm(cur))+'...')+(st.mj>=0&&my?'<p class="small" style="text-align:center">كمّل الأكل بنفس القطعة 🍽️</p>':'')+h+`<p class="small" style="text-align:center">لازم تاكل لو قدرت • القطعة اللي توصل آخر اللوح بتبقى ملك 👑</p>`;
}
/* لودو */
const LCOL=['#ef476f','#2fbf71','#ffc933','#3a86ff'],LDK=['#a8264a','#1f8a4f','#b98f00','#2159b3'];
function lXY(st,p,k){
  const seat=lSeat(st,p),pp=A(st.tk[p])[k];
  if(pp===-1){const o=[[0,0],[9,0],[9,9],[0,9]][seat],s=[[1.5,1.5],[4.5,1.5],[1.5,4.5],[4.5,4.5]][k];return [o[0]+s[0]+.0,o[1]+s[1]+.0,0]}
  if(pp<=50){const q=LRING[lRing(seat,pp)];return [q[0]+.5,q[1]+.5,1]}
  if(pp===57)return [7.5+[-.9,.9,-.9,.9][k]*.6,7.5+[-.9,-.9,.9,.9][k]*.6,2];
  const i=pp-51;
  const c=[[1+i,7],[7,1+i],[13-i,7],[7,13-i]][seat];return [c[0]+.5,c[1]+.5,1];
}
function ludoV(st){
  const me=pid,cur=st.order[st.turn],my=cur===me&&!st.over,mvs=my&&st.ph==='move'?lMoves(st,me):[];
  let svg=`<svg class="lb" viewBox="0 0 150 150" role="img" aria-label="لوح لودو"><rect width="150" height="150" rx="8" fill="#fff8e7"/>`;
  [[0,0,0],[9,0,1],[9,9,2],[0,9,3]].forEach(([x,y,s])=>{svg+=`<rect x="${x*10}" y="${y*10}" width="60" height="60" rx="6" fill="${LCOL[s]}"/><rect x="${x*10+8}" y="${y*10+8}" width="44" height="44" rx="10" fill="#fff" opacity=".38"/>`;[[1.5,1.5],[4.5,1.5],[1.5,4.5],[4.5,4.5]].forEach(q=>svg+=`<circle cx="${(x+q[0])*10}" cy="${(y+q[1])*10}" r="5.2" fill="${LCOL[s]}" opacity=".35"/>`)});
  LRING.forEach((q,i)=>{const sd=LSAFE.includes(i),st0=i%13===0;svg+=`<rect x="${q[0]*10+.6}" y="${q[1]*10+.6}" width="8.8" height="8.8" rx="2" fill="${st0?LCOL[i/13]:'#fff'}" stroke="#d9cfb3" stroke-width=".6"/>${sd&&!st0?`<path d="M${q[0]*10+5} ${q[1]*10+2.4} l1.6 3.2 3.5.5 -2.5 2.4 .6 3.5 -3.2-1.7 -3.2 1.7 .6-3.5 -2.5-2.4 3.5-.5z" fill="#ffc933" stroke="#b98f00" stroke-width=".3"/>`:''}`});
  [0,1,2,3].forEach(s=>{for(let i=0;i<6;i++){const c=[[1+i,7],[7,1+i],[13-i,7],[7,13-i]][s];svg+=`<rect x="${c[0]*10+.6}" y="${c[1]*10+.6}" width="8.8" height="8.8" rx="2" fill="${LCOL[s]}" opacity=".85"/>`}});
  svg+=`<polygon points="60,60 90,60 75,75" fill="${LCOL[1]}"/><polygon points="90,60 90,90 75,75" fill="${LCOL[2]}"/><polygon points="90,90 60,90 75,75" fill="${LCOL[3]}"/><polygon points="60,90 60,60 75,75" fill="${LCOL[0]}"/>`;
  const stack={};
  st.order.forEach(p=>A(st.tk[p]).forEach((pp,k)=>{const xy=lXY(st,p,k),key=xy[0]+','+xy[1];(stack[key]=stack[key]||[]).push([p,k,xy])}));
  Object.values(stack).forEach(g=>g.forEach(([p,k,xy],j)=>{
    const seat=lSeat(st,p),ox=g.length>1&&xy[2]!==0?(j-(g.length-1)/2)*2.6:0,can=p===me&&mvs.includes(k),last=st.lm&&st.lm.p===p&&st.lm.k===k;
    svg+=`<g class="ltk ${can?'can':''} ${last?'lastm':''}" ${can?`data-act="lmv" data-k="${k}" role="button" tabindex="0" aria-label="حرّك البيدق"`:''} transform="translate(${xy[0]*10+ox} ${xy[1]*10})"><circle r="4.6" fill="${LDK[seat]}"/><circle r="4" cy="-.5" fill="${LCOL[seat]}" stroke="#fff" stroke-width=".9"/><circle r="1.5" cx="-1.3" cy="-2" fill="#fff" opacity=".7"/></g>`;
  }));
  svg+='</svg>';
  const dice=st.lr?`<div class="dice ${st.ph==='move'||(st.ev&&st.ev.t==='none')?'rolled':''}">${dicePips(st.lr)}</div>`:('<div class="dice idle">'+DICESVG+'</div>');
  const ev=st.ev&&st.ev.t==='none'?`<p class="small" style="text-align:center">${esc(nm(st.ev.p))} طلع ${st.ev.n} ومفيش حركة 😅</p>`:st.ev&&st.ev.t==='cap'?`<p class="small" style="text-align:center">💥 ${esc(nm(st.ev.p))} أكل ${st.ev.n>1?st.ev.n+' بيادق':'بيدق'}!</p>`:'';
  const btn=my&&st.ph==='roll'?`<button class="big" data-act="lroll">🎲 ارمي الزهر</button>`:'';
  const colors=p=>`<i class="dot" style="background:${LCOL[lSeat(st,p)]}"></i>`;
  return bgHead(st,p=>`<span class="bgm">${colors(p)} ${A(st.tk[p]).filter(x=>x===57).length}/4</span>`)+`<div id="ban">${st.over?'':my?(st.ph==='roll'?'دورك! ارمي الزهر 🎲':'اختار البيدق اللي تحركه 👆'):'دور '+esc(nm(cur))+'...'}</div><div class="lwrap">${svg}<div class="lside">${dice}</div></div>${ev}${btn}`;
}
function dicePips(n){const P={1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]}[n]||[];return `<div class="dpg">${[0,1,2,3,4,5,6,7,8].map(i=>`<b${P.includes(i)?' class="p"':''}></b>`).join('')}</div>`}
/* سلم وتعبان */
const snCell=n=>{const r=Math.floor((n-1)/10),c=r%2===0?(n-1)%10:9-(n-1)%10;return [c,9-r]};
function snlV(st){
  const me=pid,cur=st.order[st.turn],my=cur===me&&!st.over;
  let svg=`<svg class="snb" viewBox="0 0 100 100" role="img" aria-label="لوح سلم وتعبان">`;
  for(let n=1;n<=100;n++){const [c,r]=snCell(n);svg+=`<rect x="${c*10}" y="${r*10}" width="10" height="10" fill="${(c+r)%2?'#ffe9a8':'#fff7da'}" stroke="#e6cf8a" stroke-width=".3"/><text x="${c*10+1}" y="${r*10+3.6}" font-size="2.8" fill="#8a6d1a" font-family="Cairo">${n}</text>`}
  const ctr=n=>{const [c,r]=snCell(n);return [c*10+5,r*10+5]};
  Object.entries(LAD).forEach(([a,b])=>{const p=ctr(+a),q=ctr(b),dx=q[0]-p[0],dy=q[1]-p[1],L=Math.hypot(dx,dy),nx=-dy/L*1.6,ny=dx/L*1.6;
    svg+=`<g stroke="#8a5a2b" stroke-linecap="round"><line x1="${p[0]+nx}" y1="${p[1]+ny}" x2="${q[0]+nx}" y2="${q[1]+ny}" stroke-width="1"/><line x1="${p[0]-nx}" y1="${p[1]-ny}" x2="${q[0]-nx}" y2="${q[1]-ny}" stroke-width="1"/>${[...Array(Math.floor(L/5))].map((_,i)=>{const t=(i+.5)/Math.floor(L/5);return `<line x1="${p[0]+dx*t+nx}" y1="${p[1]+dy*t+ny}" x2="${p[0]+dx*t-nx}" y2="${p[1]+dy*t-ny}" stroke-width=".8"/>`}).join('')}</g>`});
  Object.entries(SNK).forEach(([a,b],i)=>{const p=ctr(+a),q=ctr(b),mx=(p[0]+q[0])/2,my2=(p[1]+q[1])/2,dx=q[0]-p[0],dy=q[1]-p[1],L=Math.hypot(dx,dy),nx=-dy/L*5,ny=dx/L*5,col=['#e5484d','#10b79f','#7c3aed','#ff8a3d','#2f9e44'][i%5];
    svg+=`<path d="M${p[0]} ${p[1]} Q${mx+nx} ${my2+ny} ${mx} ${my2} T${q[0]} ${q[1]}" stroke="${col}" stroke-width="2.2" fill="none" stroke-linecap="round"/><circle cx="${p[0]}" cy="${p[1]}" r="2.1" fill="${col}"/><circle cx="${p[0]-.7}" cy="${p[1]-.6}" r=".45" fill="#fff"/><circle cx="${p[0]+.7}" cy="${p[1]-.6}" r=".45" fill="#fff"/>`});
  const stack={};st.order.forEach((p,i)=>{const n=st.pos[p]||0;(stack[n]=stack[n]||[]).push([p,i])});
  Object.entries(stack).forEach(([n,g])=>g.forEach(([p,i],j)=>{const [x,y]=+n?ctr(+n):[-4,95],ox=(j-(g.length-1)/2)*2.8;svg+=`<g class="sntk" transform="translate(${x+ox} ${y+(+n?0:-j*3)})"><circle r="2.5" fill="${LDK[i]}"/><circle r="2.1" cy="-.3" fill="${LCOL[i]}" stroke="#fff" stroke-width=".5"/></g>`}));
  svg+='</svg>';
  const e=st.ev;
  const ev=e&&e.t==='roll'?`<p class="small" style="text-align:center">${esc(nm(e.p))} طلع ${e.n}${e.j>0?' 🪜 طلع سلم!':e.j<0?' 🐍 نزل تعبان!':e.n===6?' (يلعب تاني)':''}</p>`:'';
  const colors=(p,i)=>`<span class="bgm"><i class="dot" style="background:${LCOL[i]}"></i> ${st.pos[p]||0}</span>`;
  return bgHead(st,colors)+`<div id="ban">${st.over?'':my?'دورك! ارمي الزهر 🎲':'دور '+esc(nm(cur))+'...'}</div>${st.roll?`<div class="dice rolled" style="margin:4px auto">${dicePips(st.roll)}</div>`:''}${svg}${ev}${my?`<button class="big" data-act="sroll">🎲 ارمي الزهر</button>`:''}<p class="small" style="text-align:center">لازم توصل 100 بالظبط • 6 بتلعب تاني</p>`;
}
/* ذاكرة */
function memV(st){
  const me=pid,cur=st.order[st.turn],my=cur===me&&!st.over&&st.ph==='play',fl=A(st.fl);
  const key=st.gid+'-'+st.v;
  if(st.ph==='show'&&S.memT!==key){S.memT=key;setTimeout(()=>{if(S.cg&&S.cg.gid===st.gid&&S.cg.ph==='show')cgAct({t:'res',q:1})},1100+rnd(400))}
  const faces=AVS.slice(0,MEMN);
  const cells=st.cards.map((c,i)=>{const up=st.mt[i]||fl.includes(i);return `<button class="mcard ${up?'up':''} ${st.mt[i]?'done':''}" ${my&&!up?`data-act="mflip" data-i="${i}"`:'disabled'} aria-label="كارت"><span class="mf"><span class="mb"></span><span class="mfr">${up?(AVSVG(faces[c][0])||faces[c][0]):''}</span></span></button>`}).join('');
  return bgHead(st,p=>`<span class="bgm">⭐ ${st.sc[p]||0}</span>`)+bgMsg(st,my,st.ph==='show'?(st.ok?'🎉 زوج!':'مش زوج...'):'دور '+esc(nm(cur))+'...')+`<div class="mgrid">${cells}</div><p class="small" style="text-align:center">اللي يلاقي زوج بيلعب تاني</p>`;
}
let _bgS='';
const bgView=st=>{try{const sg=st.kind+'|'+(st.over?1:0)+'|'+JSON.stringify(st.bd||st.pos||st.pl||st.cards||st.turn||'').length+'|'+st.turn;if(_bgS&&sg!==_bgS&&typeof SND!=='undefined'){SND.play(st.over?'win':'ok')}_bgS=sg}catch(e){}return ({xo:xoV,c4:c4V,dama:dmV,ludo:ludoV,snl:snlV,mem:memV}[st.kind])(st)};

/* ===== ألعاب لوحدك ===== */
const SOLO={};
let _soloStop=null;
function soloStop(){if(_soloStop){try{_soloStop()}catch(e){}_soloStop=null}}
const bestOf=k=>+localStorage['best_'+k]||0;
const setBest=(k,v,low)=>{const b=bestOf(k);if(!b||(low?v<b:v>b)){localStorage['best_'+k]=v;return true}return false};
const swipe=(el,fn)=>{let x0,y0;el.addEventListener('touchstart',e=>{x0=e.touches[0].clientX;y0=e.touches[0].clientY},{passive:true});
  el.addEventListener('touchend',e=>{const t=e.changedTouches[0],dx=t.clientX-x0,dy=t.clientY-y0;if(Math.max(Math.abs(dx),Math.abs(dy))<24)return;fn(Math.abs(dx)>Math.abs(dy)?(dx>0?'R':'L'):(dy>0?'D':'U'))});
  el.addEventListener('touchmove',e=>{e.preventDefault()},{passive:false})};
/* ---------- 2048 ---------- */
SOLO.g2048={
  start(box){
    let g,score=0,over=false,won=false;
    const best0=bestOf('g2048');
    const reset=()=>{g=Array.from({length:4},()=>Array(4).fill(0));score=0;over=false;won=false;add();add();draw()};
    const add=()=>{const e=[];g.forEach((r,i)=>r.forEach((v,j)=>{if(!v)e.push([i,j])}));if(!e.length)return;const [i,j]=e[rnd(e.length)];g[i][j]=rnd(10)?2:4};
    const slide=row=>{let r=row.filter(x=>x),pts=0;for(let i=0;i<r.length-1;i++)if(r[i]===r[i+1]){r[i]*=2;pts+=r[i];r.splice(i+1,1)}while(r.length<4)r.push(0);return [r,pts]};
    const move=d=>{
      if(over)return;let moved=false,pts=0;const ng=g.map(r=>r.slice());
      const get=(i,k)=>d==='L'?ng[i][k]:d==='R'?ng[i][3-k]:d==='U'?ng[k][i]:ng[3-k][i];
      const set=(i,k,v)=>{if(d==='L')ng[i][k]=v;else if(d==='R')ng[i][3-k]=v;else if(d==='U')ng[k][i]=v;else ng[3-k][i]=v};
      for(let i=0;i<4;i++){const line=[0,1,2,3].map(k=>get(i,k)),[r,p]=slide(line);pts+=p;r.forEach((v,k)=>{if(v!==line[k])moved=true;set(i,k,v)})}
      if(!moved)return;g=ng;score+=pts;add();if(g.flat().includes(2048)&&!won){won=true}
      if(!can())over=true;SND&&SND.play&&SND.play(pts?'ok':'card');draw();
    };
    const can=()=>{for(let i=0;i<4;i++)for(let j=0;j<4;j++){if(!g[i][j])return true;if(j<3&&g[i][j]===g[i][j+1])return true;if(i<3&&g[i][j]===g[i+1][j])return true}return false};
    const col=v=>({2:['#eee4da','#776e65'],4:['#ede0c8','#776e65'],8:['#f2b179','#fff'],16:['#f59563','#fff'],32:['#f67c5f','#fff'],64:['#f65e3b','#fff'],128:['#edcf72','#fff'],256:['#edcc61','#fff'],512:['#edc850','#fff'],1024:['#edc53f','#fff'],2048:['#ffcf24','#fff']}[v]||['#3c3a32','#fff']);
    function draw(){
      if(over)setBest('g2048',score);
      box.innerHTML=`<div class="sh"><div class="sc"><small>النقط</small><b>${score}</b></div><div class="sc"><small>أعلى نقط</small><b>${Math.max(best0,bestOf('g2048'),score)}</b></div><button data-act="sreset">🔄 من الأول</button></div>
      <div class="g48" id="g48">${g.map(r=>r.map(v=>{const c=col(v);return `<i class="${v?'v':''}" style="${v?`background:${c[0]};color:${c[1]};font-size:${v>=1024?1.2:v>=128?1.6:2}rem`:''}">${v||''}</i>`}).join('')).join('')}</div>
      <p class="small" style="text-align:center">${over?'💀 خلصت الحركات!':won?'🎉 وصلت 2048! كمّل لو عايز':'اسحب بصباعك عشان تحرك الأرقام (أو الأسهم)'}</p>
      <div class="dpad"><button data-m="U">⬆️</button><div><button data-m="L">⬅️</button><button data-m="D">⬇️</button><button data-m="R">➡️</button></div></div>`;
      box.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>move(b.dataset.m));
      box.querySelector('[data-act=sreset]').onclick=reset;
      swipe(box.querySelector('#g48'),move);
    }
    const kd=e=>{const m={ArrowLeft:'L',ArrowRight:'R',ArrowUp:'U',ArrowDown:'D'}[e.key];if(m){e.preventDefault();move(m)}};
    document.addEventListener('keydown',kd);_soloStop=()=>document.removeEventListener('keydown',kd);
    reset();
  }
};
/* ---------- ثعبان ---------- */
SOLO.snake={
  start(box){
    const N=16,CS=20;let sn,dir,nd,food,score,over,timer,speed;
    box.innerHTML=`<div class="sh"><div class="sc"><small>النقط</small><b id="ss">0</b></div><div class="sc"><small>أعلى نقط</small><b id="sb">${bestOf('snake')}</b></div><button id="sr">🔄 من الأول</button></div><canvas id="sc" width="${N*CS}" height="${N*CS}" class="sncv"></canvas><p class="small" id="sm" style="text-align:center">اسحب أو استخدم الأسهم</p><div class="dpad"><button data-m="U">⬆️</button><div><button data-m="L">⬅️</button><button data-m="D">⬇️</button><button data-m="R">➡️</button></div></div>`;
    const cv=box.querySelector('#sc'),cx=cv.getContext('2d');
    const V={U:[0,-1],D:[0,1],L:[-1,0],R:[1,0]};
    const place=()=>{let p;do{p=[rnd(N),rnd(N)]}while(sn.some(s=>s[0]===p[0]&&s[1]===p[1]));return p};
    const reset=()=>{clearInterval(timer);sn=[[8,8],[7,8],[6,8]];dir='R';nd='R';score=0;over=false;speed=130;food=place();box.querySelector('#ss').textContent=0;box.querySelector('#sm').textContent='اسحب أو استخدم الأسهم';timer=setInterval(step,speed);draw()};
    const turn=d=>{const o={U:'D',D:'U',L:'R',R:'L'};if(d!==o[dir])nd=d};
    function step(){
      if(over)return;dir=nd;const h=[sn[0][0]+V[dir][0],sn[0][1]+V[dir][1]];
      if(h[0]<0||h[1]<0||h[0]>=N||h[1]>=N||sn.some(s=>s[0]===h[0]&&s[1]===h[1])){over=true;clearInterval(timer);setBest('snake',score);box.querySelector('#sb').textContent=bestOf('snake');box.querySelector('#sm').textContent='💥 خسرت! دوس "من الأول"';draw();return}
      sn.unshift(h);
      if(h[0]===food[0]&&h[1]===food[1]){score++;box.querySelector('#ss').textContent=score;food=place();if(score%4===0&&speed>70){speed-=10;clearInterval(timer);timer=setInterval(step,speed)}try{SND.play('ok')}catch(e){}}else sn.pop();
      draw();
    }
    function draw(){
      cx.fillStyle='#10321f';cx.fillRect(0,0,N*CS,N*CS);
      for(let i=0;i<N;i++)for(let j=0;j<N;j++)if((i+j)%2){cx.fillStyle='rgba(255,255,255,.04)';cx.fillRect(i*CS,j*CS,CS,CS)}
      cx.font=CS+'px serif';cx.textAlign='center';cx.textBaseline='middle';cx.fillStyle='#ff4f81';cx.beginPath();cx.arc(food[0]*CS+CS/2,food[1]*CS+CS/2,CS*.36,0,7);cx.fill();cx.fillStyle='#ffc933';cx.fillRect(food[0]*CS+CS/2-1,food[1]*CS+2,2,5);
      sn.forEach((s,i)=>{cx.fillStyle=i?`hsl(${150-i*3},65%,${52-Math.min(i,20)}%)`:'#b6ff6b';cx.beginPath();cx.roundRect(s[0]*CS+1,s[1]*CS+1,CS-2,CS-2,i?5:8);cx.fill()});
      const h=sn[0];cx.fillStyle='#123';cx.beginPath();cx.arc(h[0]*CS+CS*.33,h[1]*CS+CS*.4,2,0,7);cx.arc(h[0]*CS+CS*.67,h[1]*CS+CS*.4,2,0,7);cx.fill();
    }
    box.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>turn(b.dataset.m));
    box.querySelector('#sr').onclick=reset;swipe(cv,turn);
    const kd=e=>{const m={ArrowLeft:'L',ArrowRight:'R',ArrowUp:'U',ArrowDown:'D'}[e.key];if(m){e.preventDefault();turn(m)}};
    document.addEventListener('keydown',kd);_soloStop=()=>{clearInterval(timer);document.removeEventListener('keydown',kd)};
    reset();
  }
};
/* ---------- كاسحة الألغام ---------- */
SOLO.mines={
  start(box){
    const R=9,C=9,M=10;let cells,over,won,first,flagMode=false,t0,timer,left;
    const nb=(i)=>{const r=Math.floor(i/C),c=i%C,o=[];for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){if(!a&&!b)continue;const x=r+a,y=c+b;if(x>=0&&x<R&&y>=0&&y<C)o.push(x*C+y)}return o};
    const reset=()=>{clearInterval(timer);cells=Array.from({length:R*C},()=>({m:0,o:0,f:0,n:0}));over=false;won=false;first=true;left=M;t0=0;draw()};
    const seed=safe=>{let k=0;while(k<M){const i=rnd(R*C);if(i===safe||nb(safe).includes(i)||cells[i].m)continue;cells[i].m=1;k++}cells.forEach((c,i)=>c.n=nb(i).filter(j=>cells[j].m).length)};
    const open=i=>{const st=[i];while(st.length){const j=st.pop(),c=cells[j];if(c.o||c.f)continue;c.o=1;if(!c.n&&!c.m)nb(j).forEach(x=>st.push(x))}};
    const tap=i=>{
      if(over||won)return;const c=cells[i];
      if(flagMode){if(!c.o){c.f=c.f?0:1;left+=c.f?-1:1}draw();return}
      if(c.f||c.o)return;
      if(first){first=false;seed(i);t0=Date.now();timer=setInterval(()=>{const e=box.querySelector('#mt');if(e)e.textContent=Math.floor((Date.now()-t0)/1000)},500)}
      if(c.m){over=true;clearInterval(timer);cells.forEach(x=>{if(x.m)x.o=1});draw();return}
      open(i);
      if(cells.every(x=>x.m||x.o)){won=true;clearInterval(timer);const s=Math.floor((Date.now()-t0)/1000);setBest('mines',s,true);try{SND.play('win')}catch(e){}}
      draw();
    };
    function draw(){
      const col=['','#3a86ff','#2fbf71','#ef476f','#7c3aed','#ff8a3d','#10b79f','#222','#888'];
      box.innerHTML=`<div class="sh"><div class="sc"><small>ألغام</small><b>${left}</b></div><div class="sc"><small>الوقت</small><b id="mt">${t0?Math.floor((Date.now()-t0)/1000):0}</b></div><div class="sc"><small>أسرع وقت</small><b>${bestOf('mines')||'-'}</b></div></div>
      <div class="mnb">${cells.map((c,i)=>`<button class="mnc ${c.o?'o':''} ${c.o&&c.m?'bm':''}" data-i="${i}" aria-label="خانة">${c.o?(c.m?'💣':c.n?`<b style="color:${col[c.n]}">${c.n}</b>`:''):c.f?'🚩':''}</button>`).join('')}</div>
      <div class="seg" style="margin-top:10px"><button class="${flagMode?'':'sel'}" data-md="0">⛏️ احفر</button><button class="${flagMode?'sel':''}" data-md="1">🚩 علّم لغم</button></div>
      <p class="small" style="text-align:center">${won?'🎉 كسبت! كل الخانات الآمنة اتفتحت':over?'💥 دوست على لغم!':'افتح كل الخانات اللي مفيهاش ألغام'}</p><button class="big" id="mr">🔄 لعبة جديدة</button>`;
      box.querySelectorAll('.mnc').forEach(b=>{b.onclick=()=>tap(+b.dataset.i);let lp;b.addEventListener('touchstart',()=>{lp=setTimeout(()=>{lp=null;const i=+b.dataset.i;if(!over&&!won&&!cells[i].o){cells[i].f=cells[i].f?0:1;left+=cells[i].f?-1:1;draw()}},450)},{passive:true});b.addEventListener('touchend',e=>{if(lp===null){e.preventDefault();lp=undefined}else clearTimeout(lp)})});
      box.querySelectorAll('[data-md]').forEach(b=>b.onclick=()=>{flagMode=b.dataset.md==='1';draw()});
      box.querySelector('#mr').onclick=reset;
    }
    _soloStop=()=>clearInterval(timer);reset();
  }
};
/* ---------- اضرب الشخصية ---------- */
SOLO.whack={
  start(box){
    let score,time,timer,pop,run,spawn,miss;
    const ch=AVS.slice(0,10);
    const draw=()=>{
      box.querySelector('#wh').innerHTML=Array.from({length:9},(_,i)=>`<button class="hole ${pop&&pop.i===i?'up':''}" data-i="${i}" aria-label="حفرة"><span class="hh"></span><span class="hc">${pop&&pop.i===i?(AVSVG(pop.e)||pop.e):''}</span><span class="hf"></span></button>`).join('');
      box.querySelectorAll('.hole').forEach(b=>b.onpointerdown=e=>{e.preventDefault();hit(+b.dataset.i)});
    };
    const hit=i=>{if(!run||!pop||pop.i!==i)return;if(pop.bad){score=Math.max(0,score-3);try{SND.play('bad')}catch(e){}}else{score++;try{SND.play('ok')}catch(e){}}pop=null;box.querySelector('#ws').textContent=score;draw()};
    const next=()=>{if(!run)return;pop={i:rnd(9),e:ch[rnd(ch.length)][0],bad:!rnd(6)};draw();const stay=Math.max(450,900-(30-time)*14);spawn=setTimeout(()=>{pop=null;draw();spawn=setTimeout(next,200+rnd(250))},stay)};
    const startG=()=>{clearInterval(timer);clearTimeout(spawn);score=0;time=30;run=true;pop=null;box.querySelector('#ws').textContent=0;box.querySelector('#wt').textContent=30;box.querySelector('#wm').textContent='دوس على الشخصيات بسرعة! 🔨';timer=setInterval(()=>{time--;box.querySelector('#wt').textContent=time;if(time<=0){clearInterval(timer);clearTimeout(spawn);run=false;pop=null;draw();const nb=setBest('whack',score);box.querySelector('#wb').textContent=bestOf('whack');box.querySelector('#wm').textContent=`⏰ خلص الوقت! جبت ${score}${nb?' 🏆 رقم قياسي':''}`;try{SND.play('win')}catch(e){}}},1000);next()};
    box.innerHTML=`<div class="sh"><div class="sc"><small>النقط</small><b id="ws">0</b></div><div class="sc"><small>الوقت</small><b id="wt">30</b></div><div class="sc"><small>أعلى نقط</small><b id="wb">${bestOf('whack')}</b></div></div><div class="whg" id="wh"></div><p class="small" id="wm" style="text-align:center">اللي يظهر اضربه، بس خلي بالك من الشخصية الغضبانة 😡 (بتخصم 3)</p><button class="big" id="wg">▶️ ابدأ</button>`;
    run=false;score=0;pop=null;draw();box.querySelector('#wg').onclick=startG;
    _soloStop=()=>{clearInterval(timer);clearTimeout(spawn);run=false};
  }
};

/* ===== أغلفة الألعاب (رسم) ===== */
Object.assign(ART,{
 xo:`<svg viewBox="0 0 120 90"><g stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".85"><path d="M46 12 V78 M76 12 V78 M20 34 H102 M20 58 H102"/></g><path d="M23 15 L40 31 M40 15 L23 31" stroke="#ff4f81" stroke-width="7" stroke-linecap="round"/><circle cx="61" cy="46" r="9" stroke="#2ad6bd" stroke-width="6" fill="none"/><path d="M82 61 L99 77 M99 61 L82 77" stroke="#ff4f81" stroke-width="7" stroke-linecap="round"/><circle cx="29" cy="68" r="8" stroke="#2ad6bd" stroke-width="6" fill="none"/><path d="M84 15 L99 31 M99 15 L84 31" stroke="#ffc933" stroke-width="7" stroke-linecap="round"/></svg>`,
 c4:`<svg viewBox="0 0 120 90"><rect x="8" y="8" width="104" height="76" rx="10" fill="#2159b3" stroke="#12347a" stroke-width="3"/>${[0,1,2,3,4,5].map(c=>[0,1,2,3].map(r=>{const k=(c*3+r*5)%7,f=k<2?'#ef476f':k<4?'#ffc933':'#0e2a66';return `<circle cx="${20+c*16}" cy="${22+r*17}" r="6.6" fill="${f}"/>`}).join('')).join('')}</svg>`,
 dama:`<svg viewBox="0 0 120 90"><g transform="translate(14 6) skewX(0)">${[0,1,2,3,4,5].map(r=>[0,1,2,3,4,5].map(c=>`<rect x="${c*15}" y="${r*13}" width="15" height="13" fill="${(r+c)%2?'#6b3f1d':'#f3d9a4'}"/>`).join('')).join('')}</g><g stroke="#fff" stroke-width="1.5"><circle cx="36" cy="25" r="5.4" fill="#e63946"/><circle cx="66" cy="38" r="5.4" fill="#e63946"/><circle cx="51" cy="64" r="5.4" fill="#222"/><circle cx="81" cy="51" r="5.4" fill="#222"/><circle cx="96" cy="25" r="5.4" fill="#222"/></g><path d="M31 64 L30 56 L34 59 L36 54 L38 59 L42 56 L41 64Z" fill="#ffd54a" transform="translate(11 -4)"/></svg>`,
 ludo:`<svg viewBox="0 0 120 90"><rect x="22" y="4" width="76" height="82" rx="10" fill="#fff8e7"/><rect x="22" y="4" width="32" height="32" rx="8" fill="#ef476f"/><rect x="66" y="4" width="32" height="32" rx="8" fill="#2fbf71"/><rect x="66" y="54" width="32" height="32" rx="8" fill="#ffc933"/><rect x="22" y="54" width="32" height="32" rx="8" fill="#3a86ff"/><g fill="#fff" opacity=".85"><circle cx="31" cy="13" r="4"/><circle cx="45" cy="13" r="4"/><circle cx="31" cy="27" r="4"/><circle cx="45" cy="27" r="4"/></g><polygon points="54,36 66,36 60,45" fill="#2fbf71"/><polygon points="66,36 66,54 60,45" fill="#ffc933"/><polygon points="66,54 54,54 60,45" fill="#3a86ff"/><polygon points="54,54 54,36 60,45" fill="#ef476f"/><g transform="translate(8 40)"><rect width="26" height="26" rx="6" fill="#fff" stroke="#999" stroke-width="2" transform="rotate(-12 13 13)"/><g fill="#222" transform="rotate(-12 13 13)"><circle cx="7" cy="7" r="2.4"/><circle cx="19" cy="7" r="2.4"/><circle cx="13" cy="13" r="2.4"/><circle cx="7" cy="19" r="2.4"/><circle cx="19" cy="19" r="2.4"/></g></g><g><circle cx="92" cy="62" r="7" fill="#a67c00"/><circle cx="92" cy="60" r="6" fill="#ffc933" stroke="#fff" stroke-width="1.5"/></g></svg>`,
 snl:`<svg viewBox="0 0 120 90"><rect x="6" y="6" width="108" height="78" rx="10" fill="#ffe9a8"/><g stroke="#8a5a2b" stroke-width="3" stroke-linecap="round"><line x1="24" y1="78" x2="40" y2="14"/><line x1="36" y1="78" x2="52" y2="14"/></g><g stroke="#8a5a2b" stroke-width="2.4">${[0,1,2,3,4,5].map(i=>`<line x1="${26+i*3.3}" y1="${70-i*11}" x2="${38+i*3.3}" y2="${70-i*11}"/>`).join('')}</g><path d="M96 14 Q70 28 94 44 T78 76" stroke="#2f9e44" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M96 14 Q70 28 94 44 T78 76" stroke="#8fe388" stroke-width="3" stroke-dasharray="3 6" fill="none" stroke-linecap="round"/><circle cx="97" cy="13" r="8" fill="#2f9e44"/><circle cx="94" cy="11" r="2" fill="#fff"/><circle cx="100" cy="11" r="2" fill="#fff"/><path d="M97 19 v6" stroke="#e5484d" stroke-width="2"/></svg>`,
 mem:`<svg viewBox="0 0 120 90"><g transform="rotate(-8 30 45)"><rect x="12" y="18" width="34" height="48" rx="7" fill="#7c3aed" stroke="#fff" stroke-width="3"/><circle cx="29" cy="42" r="9" fill="#ffc933"/><path d="M24 40 h2 M32 40 h2 M25 46 q4 4 8 0" stroke="#222" stroke-width="1.6" fill="none"/></g><g transform="rotate(7 80 45)"><rect x="56" y="14" width="34" height="48" rx="7" fill="#fff" stroke="#ddd" stroke-width="3"/><circle cx="73" cy="38" r="12" fill="#ff8fb0"/><circle cx="67" cy="29" r="5" fill="#ff8fb0"/><circle cx="79" cy="29" r="5" fill="#ff8fb0"/><path d="M68 36 h2 M76 36 h2 M69 42 q4 4 8 0" stroke="#222" stroke-width="1.6" fill="none"/></g><g transform="rotate(14 100 50)"><rect x="84" y="30" width="30" height="44" rx="7" fill="#7c3aed" stroke="#fff" stroke-width="3"/><text x="99" y="60" text-anchor="middle" font-size="22" font-weight="900" fill="#ffc933" font-family="Cairo">?</text></g></svg>`,
 g2048:`<svg viewBox="0 0 120 90"><rect x="8" y="6" width="104" height="78" rx="10" fill="#bbada0"/>${[[0,0,2,'#eee4da','#776e65'],[1,0,4,'#ede0c8','#776e65'],[2,0,8,'#f2b179','#fff'],[3,0,16,'#f59563','#fff'],[0,1,32,'#f67c5f','#fff'],[1,1,64,'#f65e3b','#fff'],[2,1,128,'#edcf72','#fff'],[3,1,256,'#edcc61','#fff']].map(([c,r,v,f,t])=>`<rect x="${14+c*24}" y="${12+r*30}" width="22" height="26" rx="4" fill="${f}"/><text x="${25+c*24}" y="${30+r*30}" text-anchor="middle" font-size="${v>99?9:12}" font-weight="900" fill="${t}" font-family="Cairo">${v}</text>`).join('')}<rect x="14" y="72" width="92" height="8" rx="3" fill="#ffcf24"/></svg>`,
 snake:`<svg viewBox="0 0 120 90"><rect x="6" y="6" width="108" height="78" rx="12" fill="#10321f"/><path d="M20 70 H70 Q86 70 86 54 Q86 38 70 38 H40 Q26 38 26 24 Q26 18 36 18 H92" stroke="#7ee05b" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 70 H70 Q86 70 86 54 Q86 38 70 38 H40 Q26 38 26 24 Q26 18 36 18 H92" stroke="#3fae33" stroke-width="3" stroke-dasharray="2 9" fill="none" stroke-linecap="round"/><circle cx="98" cy="18" r="9" fill="#9bf06f"/><circle cx="96" cy="15" r="2.3" fill="#123"/><circle cx="101" cy="15" r="2.3" fill="#123"/><circle cx="108" cy="66" r="7" fill="#ff4f81"/><path d="M108 59 v-5" stroke="#8a5a2b" stroke-width="2"/></svg>`,
 mines:`<svg viewBox="0 0 120 90"><rect x="6" y="6" width="108" height="78" rx="10" fill="#1d2a4a"/>${[0,1,2,3,4,5].map(c=>[0,1,2].map(r=>`<rect x="${12+c*16}" y="${12+r*24}" width="14" height="22" rx="3" fill="${(c+r)%3===0?'#2b3a63':'#9fb4e6'}"/>`).join('')).join('')}<circle cx="60" cy="46" r="15" fill="#222" stroke="#fff" stroke-width="2"/><g stroke="#222" stroke-width="3" stroke-linecap="round"><path d="M60 24 V68 M38 46 H82 M44 30 L76 62 M76 30 L44 62"/></g><circle cx="55" cy="41" r="4" fill="#fff" opacity=".7"/><path d="M68 28 q8 -10 14 -2" stroke="#ffc933" stroke-width="3" fill="none"/><path d="M92 62 v18 M92 62 l14 5 -14 5z" stroke="#e5484d" fill="#e5484d" stroke-width="2"/></svg>`,
 whack:`<svg viewBox="0 0 120 90"><ellipse cx="60" cy="74" rx="44" ry="11" fill="#4a2a10"/><ellipse cx="60" cy="70" rx="40" ry="9" fill="#2a1507"/><g><circle cx="60" cy="44" r="22" fill="#ffb3c7"/><circle cx="46" cy="28" r="9" fill="#ff8fb0"/><circle cx="74" cy="28" r="9" fill="#ff8fb0"/><circle cx="52" cy="42" r="3.2" fill="#222"/><circle cx="68" cy="42" r="3.2" fill="#222"/><ellipse cx="60" cy="52" rx="9" ry="6" fill="#ff6f9c"/><path d="M52 58 q8 7 16 0" stroke="#7a1f3d" stroke-width="2" fill="none"/></g><path d="M0 70 H120 V90 H0z" fill="#4a2a10"/><ellipse cx="60" cy="72" rx="42" ry="9" fill="#2a1507"/><g transform="rotate(-35 96 30)"><rect x="92" y="2" width="8" height="46" rx="3" fill="#a96a2b"/><rect x="80" y="-2" width="32" height="20" rx="6" fill="#e63946" stroke="#fff" stroke-width="2"/></g><g fill="#ffc933"><path d="M30 18 l2 5 5 1 -4 3 1 5 -4 -3 -4 3 1 -5 -4 -3 5 -1z" transform="scale(.7) translate(10 6)"/></g></svg>`,
});
const COV={dev:['#ff4f81','#ff8a3d'],classic:['#6c4cff','#10b79f'],qz:['#e5484d','#7c3aed'],qm:['#3a86ff','#7c3aed'],dm:['#0f766e','#164e63'],dma:['#b45309','#7c2d12'],xo:['#7c3aed','#2563eb'],c4:['#2563eb','#0e7490'],dama:['#92400e','#7c2d12'],ludo:['#ef476f','#ffc933'],snl:['#16a34a','#ca8a04'],mem:['#a21caf','#7c3aed'],g2048:['#f59e0b','#ea580c'],snake:['#15803d','#064e3b'],mines:['#334155','#1e3a8a'],whack:['#92400e','#16a34a']};

/* ===== المنصة الجديدة ===== */
Object.assign(GAMES,{
 xo:{ico:'❌⭕',name:'إكس أو',desc:'3 في صف قبل خصمك',cls:'t1',min:2,max:2},
 c4:{ico:'🔴🟡',name:'٤ في صف',desc:'نزّل الأقراص وكوّن 4 ورا بعض',cls:'t1',min:2,max:2},
 dama:{ico:'⚫🔴',name:'الداما',desc:'كُل قطع خصمك وخلّي قطعك ملوك',cls:'t1',min:2,max:2},
 ludo:{ico:'🎲',name:'لودو',desc:'الزهر والبيادق: وصّل بيادقك الأول',cls:'t1',min:2,max:4},
 snl:{ico:'🐍',name:'سلم وتعبان',desc:'اطلع السلالم وإوعى التعابين',cls:'t1',min:2,max:4},
 mem:{ico:'🧠',name:'لعبة الذاكرة',desc:'اقلب الكروت ولاقي الأزواج',cls:'t1',min:2,max:4},
 g2048:{ico:'🔢',name:'2048',desc:'اجمع الأرقام لحد ما توصل 2048',cls:'t1',solo:1},
 snake:{ico:'🐍',name:'الثعبان',desc:'كُل التفاح وكبّر من غير ما تخبط',cls:'t1',solo:1},
 mines:{ico:'💣',name:'كاسحة الألغام',desc:'افتح الخانات الآمنة وتجنب الألغام',cls:'t1',solo:1},
 whack:{ico:'🔨',name:'اضرب الشخصية',desc:'اضرب اللي يطلع من الحفرة في 30 ثانية',cls:'t1',solo:1}
});
['uno','c_old','c_war','c_crazy','c_21'].forEach(k=>{if(GAMES[k])GAMES[k].hide=1});
GAMES.qz.name='الجرس: سؤال وجواب';GAMES.qm.name='اختيار من متعدد';
Object.assign(RULES,{
 xo:['لاعبين اتنين: واحد X والتاني O.','كل واحد بيحط علامته في خانة فاضية بالدور.','اللي يكوّن 3 علامات ورا بعض (أفقي أو رأسي أو قطري) يكسب.','لو اللوح امتلى من غير فايز يبقى تعادل.'],
 c4:['لاعبين اتنين، كل واحد ليه لون.','بالدور تختار عمود، والقرص بينزل لآخر خانة فاضية فيه.','اللي يكوّن 4 أقراص ورا بعض (أفقي أو رأسي أو قطري) يكسب.','لو اللوح امتلى من غير فايز يبقى تعادل.'],
 dama:['لاعبين اتنين، كل واحد معاه 12 قطعة على الخانات الغامقة.','القطعة العادية بتتحرك خانة قدّام بالقُطر.','لو قدّامك قطعة للخصم وراها خانة فاضية لازم تاكلها (الأكل إجباري) وتكمّل لو فيه أكل تاني.','القطعة اللي توصل آخر اللوح بتبقى ملك 👑 وتتحرك وتاكل لقدّام ولورا.','اللي يخلّص قطع خصمه أو يمنعه من الحركة يكسب.'],
 ludo:['من 2 لـ4 لاعبين، كل واحد معاه 4 بيادق في بيته.','بترمي الزهر بالدور. لازم تجيب 6 عشان تطلّع بيدق من البيت.','البيدق بيلف اللوح كله ويدخل الطريق الملوّن لحد الوسط. لازم الرقم يكون مظبوط عشان يوصل.','لو وقفت على بيدق خصم (برّه الخانات الآمنة ⭐) بتاكله وبيرجع بيته.','6 أو أكل بيدق أو وصول بيدق = ترمي تاني.','أول واحد يوصّل بيادقه الأربعة يكسب.'],
 snl:['من 2 لـ4 لاعبين، كلكم بتبدأوا قبل الخانة 1.','ارمي الزهر وامشي بالعدد اللي طلع.','لو وقفت على بداية سلم 🪜 بتطلع، ولو وقفت على راس تعبان 🐍 بتنزل.','6 بتلعب تاني.','لازم توصل 100 بالظبط. لو الرقم زاد مبتتحركش.'],
 mem:['من 2 لـ4 لاعبين، 16 كارت متقلبين (8 أزواج).','بالدور تقلب كارتين. لو زوج بتاخد نقطة وتلعب تاني.','لو مش زوج بيتقلبوا تاني والدور بيروح للي بعدك.','اللي معاه نقط أكتر لما الكروت تخلص يكسب.']
});
const CATS3=[['all','الكل','all'],['quiz','أسئلة وألغاز','pyr'],['board','الطاولة','dice'],['party','أتوبيس كومبليت','bus'],['arc','لوحدك','joy']];
const CAT_OF={dev:'party',classic:'party',qz:'quiz',qm:'quiz',dm:'board',dma:'board',xo:'board',c4:'board',dama:'board',ludo:'board',snl:'board',mem:'board',g2048:'arc',snake:'arc',mines:'arc',whack:'arc'};
const HUBORDER=['ludo','qz','dm','dev','c4','dama','qm','dma','classic','xo','snl','mem','g2048','snake','mines','whack'];
const BADGE={ludo:'الأشهر',dm:'مفضلة',dev:'مضحكة',snake:'كلاسيك',whack:'سريعة',c4:'تنافسية'};
const ARTIMG=k=>`<img src="assets/img/games/${k}.svg" alt="" loading="lazy" decoding="async" width="600" height="400">`;
const cover=(k,big)=>`<div class="gart ${big?'big':''}">${ARTIMG(k)}</div>`;
const heroBig=(cta)=>`<div class="hero"><div class="hslides"><div class="hslide"><img src="assets/img/hero.svg" alt=""><div class="hcopy"><span class="kick">${EGF} مصر بس</span><h1>ملاهي 15 مايو</h1><p>١٦ لعبة • العب مع صحابك من أي مكان</p>${cta||''}</div></div></div></div>`;
const NEWG=['ludo','snl','mem','dama','c4','whack'];
const HERO_K=['ludo','qz','c4'];
const HERO_T={ludo:['جديد في الملاهي','لودو بالمصري'],qz:['٤٠٠+ سؤال','الجرس: جاوب الأول'],c4:['تنافسية','٤ في صف']};
const gm_pl=g=>g.solo?'لوحدك':!g.min?'2-10 لاعبين':g.min===g.max?`${g.min} لاعبين`:`${g.min}-${g.max} لاعبين`;
function gcard(k,i,extra){
  const g=GAMES[k];if(!g)return '';
  const solo=!!g.solo;
  return `<div class="gc" role="button" tabindex="0" data-act="${solo?'solo':'game'}" data-k="${k}" data-nm="${esc(g.name)}" style="animation-delay:${Math.min(i*45,420)}ms">
    <div class="gart">${ARTIMG(k)}<div class="gbadges">${BADGE[k]?`<span class="hot">${BADGE[k]}</span>`:''}${NEWG.includes(k)?'<span class="new">جديد</span>':''}</div>
    <button class="gq" data-act="guide" data-k="${k}" aria-label="إزاي تلعب ${esc(g.name)}">؟</button>
    <div class="gt">${esc(g.name)}</div></div>
    <div class="gmeta">${IC(solo?'joy':'dice')}<span>${gm_pl(g)}</span>${extra||''}</div></div>`;
}
function hubV(){
  const rooms=k=>Object.entries(S.idx).filter(([id,r])=>(r.kind||'dev')===k);
  const live=k=>rooms(k).reduce((a,[id])=>a+Object.keys(S.pl[id]||{}).length,0);
  const tot=Object.values(S.pl||{}).reduce((a,p)=>a+Object.keys(p||{}).length,0);
  const cat=S.cat||'all';
  const multi=HUBORDER.filter(k=>GAMES[k]&&!GAMES[k].solo);
  const hot=[...multi].sort((x,y)=>live(y)-live(x)||HUBORDER.indexOf(x)-HUBORDER.indexOf(y)).slice(0,6);
  const newg=NEWG.filter(k=>GAMES[k]);
  const feat=HERO_K[(Math.floor(Date.now()/864e5))%HERO_K.length];
  const lv=typeof lvOf==='function'?lvOf(PROF.xp):1, pct=typeof lvPct==='function'?lvPct(PROF.xp):0;
  const slides=HERO_K.map((k,i)=>{
    const g=GAMES[k],solo=!!g.solo;
    return `<div class="hslide"><img src="assets/img/games/${k}.svg" alt=""><div class="hcopy">
      <span class="kick">${HERO_T[k][0]}</span>
      <h1>${esc(HERO_T[k][1])}</h1>
      <p>${esc(g.desc)} • ${gm_pl(g)}</p>
      <div class="hbtns"><button class="play" data-act="${solo?'solo':'game'}" data-k="${k}">${IC('play')} العب دلوقتي</button>
      <button class="alt" data-act="guide" data-k="${k}">إزاي تلعب</button></div></div></div>`;
  }).join('');
  const dots=HERO_K.map((k,i)=>`<i class="${i===0?'on':''}"></i>`).join('');
  const secs=(cat==='all'?CATS3.slice(1):CATS3.filter(c=>c[0]===cat)).map(([c,t,ic])=>{
    const ks=HUBORDER.filter(k=>GAMES[k]&&CAT_OF[k]===c);
    return ks.length?`<h2 class="rowh">${t}<small>${ks.length} ألعاب</small></h2><div class="grid">${ks.map((k,i)=>gcard(k,i)).join('')}</div>`:'';
  }).join('');
  const bonus=PROF.bonusLeft();
  return `<header class="htop">
    <button class="brand" data-act="hub"><img src="assets/img/logo.svg" alt=""><b>ملاهي 15 مايو</b></button>
    <div class="hacts">
      <button class="lvlpill" data-act="${ACC.u?'acc':'gl'}">${IC('star')} Lv ${lv}<i style="width:${pct}%"></i></button>
      <button class="coinpill" data-act="${ACC.u?'acc':'gl'}">${IC('coin')} ${PROF.coins}</button>
      <button class="icobtn" data-act="settings" aria-label="إعدادات">${IC('gear')}</button>
    </div></header>
  <section class="hero" id="hero"><div class="hslides" id="hslides">${slides}</div><div class="hdots" id="hdots">${dots}</div></section>
  <div class="strip">
    <div class="xpcard"><div class="row"><b>مستواك: ${lv}</b><span>${pct>=100?'أعلى ليفل':(PROF.xp%100)+'/100 XP'}</span></div><div class="xpbar"><i style="width:${pct}%"></i></div></div>
    <button class="daily ${bonus>0?'':'ready'}" data-act="daily">${IC('gift')}<b>${bonus>0?'بعد '+bonus+'س':'جايزة اليوم'}</b><small>${bonus>0?'استلمتها':'+10 كوينز'}</small></button>
  </div>
  <h2 class="rowh">الأكثر لعبًا<small>${tot} لاعب أونلاين</small></h2>
  <div class="hrow">${hot.map((k,i)=>gcard(k,i,`<span class="sep ${live(k)?'live':''}">${live(k)?'<i></i>'+live(k)+' بيلعبوا':'ابدأ غرفة'}</span>`)).join('')}</div>
  <h2 class="rowh">جديد في الملاهي<small>جرّبها الأول</small></h2>
  <div class="hrow">${newg.map((k,i)=>gcard(k,i)).join('')}</div>
  <h2 class="rowh">كل الألعاب<small>${HUBORDER.filter(k=>GAMES[k]).length} لعبة</small></h2>
  <div class="srch"><input id="gs" class="qin" placeholder="دوّر على لعبة..." autocomplete="off" aria-label="بحث">${IC('search')}</div>
  <div class="cats">${CATS3.map(([c,t,ic])=>`<button class="cat ${cat===c?'on':''}" data-act="cat" data-k="${c}">${IC(ic)} ${t}</button>`).join('')}</div>
  <div id="gsec">${secs}</div>
  <footer class="foot">ملاهي 15 مايو • العب مع صحابك من أي مكان ${EGF}</footer>
  <nav class="bnav">
    <button class="on" data-act="hub">${IC('home')}<span>الرئيسية</span></button>
    <button data-act="scroll" data-t="gsec">${IC('grid')}<span>الألعاب</span></button>
    <button data-act="guide">${IC('book')}<span>الدليل</span></button>
    <button data-act="${ACC.u?'acc':'gl'}">${IC('user')}<span>حسابي</span></button>
  </nav>`;
}
const soloShell=k=>`${topbar()}<button class="ghost sm" data-act="hub" style="margin-top:6px">← كل الألعاب</button><div class="solohd">${cover(k)}<div><h2 style="margin:0">${GAMES[k].name}</h2><span class="small">${GAMES[k].desc}</span></div></div><div id="sg" class="solog"></div>`;
const hero=()=>heroBig('');

/* =========================================================
   طبقة التحسين: أيقونات، أصوات، حركة، دليل اللعب، بروفايل
   ========================================================= */
Object.assign(_IC,{
  play:'<path d="M8 5l11 7-11 7z" fill="currentColor" stroke="none"/>',
  gear:'<path d="M4 7h9M19 7h1M4 17h1M11 17h9"/><circle cx="16" cy="7" r="2.6"/><circle cx="8" cy="17" r="2.6"/>',
  gift:'<rect x="3" y="9" width="18" height="12" rx="2.5"/><path d="M3 13.5h18M12 9v12"/><path d="M12 9S9.8 4 7.4 5.4 8.8 9 12 9s5-1.3 5-3.4S12 9 12 9z"/>',
  home:'<path d="M3 11l9-8 9 8"/><path d="M5.5 10v10h13V10"/>',
  grid:'<rect x="3" y="3" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2"/>',
  book:'<path d="M4 4.5h6.5A3.5 3.5 0 0114 8v12a2.6 2.6 0 00-2.6-2.4H4z"/><path d="M20 4.5h-6.5A3.5 3.5 0 0010 8v12a2.6 2.6 0 012.6-2.4H20z"/>',
  close:'<path d="M6 6l12 12M18 6L6 18"/>',
  trophy:'<path d="M8 4h8v5a4 4 0 01-8 0z"/><path d="M8 5H5v2a3 3 0 003 3M16 5h3v2a3 3 0 01-3 3"/><path d="M12 13v4M9 20h6M10 17h4"/>',
  chev:'<path d="M9 6l6 6-6 6"/>'
});

/* ---------- بروفايل (خبرة/كوينز/جايزة يومية) ---------- */
const PROF=(()=>{
  const K='mh_prof';
  const rd=()=>{try{return JSON.parse(localStorage[K]||'{}')||{}}catch(e){return{}}};
  const wr=o=>{try{localStorage[K]=JSON.stringify(o)}catch(e){}};
  return {
    get xp(){return ACC.u&&ACC.p?(ACC.p.xp||0):(rd().xp||0)},
    get coins(){return ACC.u&&ACC.p?(ACC.p.coins||0):(rd().coins||0)},
    add(xp,coins){
      const o=rd();o.xp=(o.xp||0)+xp;o.coins=(o.coins||0)+(coins||0);wr(o);
      if(ACC.u&&ACC.p){try{
        const nx=Math.min(3000,(ACC.p.xp||0)+xp);ACC.p.xp=nx;set(ref(db,'users/'+ACC.u.uid+'/xp'),nx);
        if(coins)update(ref(db,'users/'+ACC.u.uid),{coins:((ACC.p.coins||0)+coins)}),ACC.p.coins=(ACC.p.coins||0)+coins;
      }catch(e){}}
    },
    bonusLeft(){const t=rd().daily||0,l=864e5-(Date.now()-t);return l>0?Math.ceil(l/36e5):0},
    claim(){
      const o=rd();if(Date.now()-(o.daily||0)<864e5)return 0;
      o.daily=Date.now();wr(o);this.add(20,10);return 10;
    }
  };
})();

/* ---------- مؤثرات صوتية جديدة ---------- */
const FX2=(()=>{
  let c=null;
  const ac=()=>{if(!c){try{c=new (window.AudioContext||window.webkitAudioContext)()}catch(e){return null}}if(c.state==='suspended')c.resume();return c};
  const t=(f,d,type,v,sl,dt)=>{const o=c.createOscillator(),g=c.createGain(),tt=c.currentTime+(dt||0);
    o.type=type||'sine';o.frequency.setValueAtTime(f,tt);if(sl)o.frequency.exponentialRampToValueAtTime(Math.max(30,sl),tt+d);
    g.gain.setValueAtTime(.0001,tt);g.gain.exponentialRampToValueAtTime(v,tt+.012);g.gain.exponentialRampToValueAtTime(.0001,tt+d);
    o.connect(g);g.connect(c.destination);o.start(tt);o.stop(tt+d+.03)};
  const nz=(d,v,hp,dt)=>{const n=Math.max(1,c.sampleRate*d|0),b=c.createBuffer(1,n,c.sampleRate),x=b.getChannelData(0);
    for(let i=0;i<n;i++)x[i]=(Math.random()*2-1)*(1-i/n);const s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();
    f.type='highpass';f.frequency.value=hp||2000;g.gain.value=v;s.buffer=b;s.connect(f);f.connect(g);g.connect(c.destination);s.start(c.currentTime+(dt||0))};
  const M={
    tap:()=>t(620,.05,'triangle',.045),
    swoosh:()=>nz(.15,.07,900),
    coin:()=>{t(1046,.07,'triangle',.06);t(1568,.09,'triangle',.05,.05)},
    levelup:()=>[523,659,784,1046].forEach((f,i)=>t(f,.16,'triangle',.08,i*.07)),
    gift:()=>[784,988,1318].forEach((f,i)=>t(f,.13,'sine',.07,i*.05)),
    start:()=>[392,523,659].forEach((f,i)=>t(f,.11,'square',.045,i*.06)),
    flip:()=>{nz(.05,.1,3200);t(320,.06,'sine',.05,190)},
    match:()=>{t(659,.1,'sine',.07);t(988,.12,'sine',.06,.06)},
    dice:()=>[0,.05,.1,.15,.2].forEach(d=>nz(.035,.05,4200,d)),
    capture:()=>{t(320,.12,'sawtooth',.07,110);nz(.09,.08,1300)},
    correct:()=>{t(784,.11,'triangle',.07);t(1175,.13,'triangle',.06,.06)},
    wrong:()=>t(190,.2,'sawtooth',.07,110),
    whoosh:()=>nz(.22,.05,600)
  };
  return {play(k){if(SND.sfx===false)return;if(!ac())return;try{M[k]&&M[k]()}catch(e){}}};
})();

/* ---------- أصوات حيوانات حقيقية (تسجيلات) ---------- */
const AUDIO_SRC={duck:'assets/audio/duck.mp3',cat:'assets/audio/cat.mp3',dog:'assets/audio/dog.mp3',donkey:'assets/audio/donkey.mp3',laugh:'assets/audio/laugh.mp3'};
const _aud={};
function playAnimal(k){
  if(SND.sfx===false)return;
  try{
    let a=_aud[k];if(!a){a=new Audio(AUDIO_SRC[k]);a.preload='auto';a.volume=.9;_aud[k]=a}
    a.currentTime=0;const p=a.play();if(p&&p.catch)p.catch(()=>{});
  }catch(e){}
}
const _funPlay=FUN.play.bind(FUN);
FUN.play=k=>{if(AUDIO_SRC[k])playAnimal(k);else _funPlay(k)};

/* ---------- شيتات (دليل اللعب / الإعدادات) ---------- */
function _sheet(id,html){
  let d=document.getElementById(id);
  if(!d){d=document.createElement('div');d.id=id;document.body.appendChild(d)}
  d.innerHTML=html;
  document.body.style.overflow=html?'hidden':'';
}
function guideDlg(k){
  if(!k||k==='general'){
    _sheet('gd',`<div class="sheet" data-act="gclose"><div class="panel" data-act="gstop">
      <div class="bar"><div class="grab"></div><button class="x" data-act="gclose" aria-label="إغلاق">${IC('close')}</button></div>
      <div class="ghero"><img src="assets/img/hero.svg" alt=""><div><h2>دليل اللعب</h2><p>${GUIDE.general.desc}</p></div></div>
      <ol class="gsteps">${GUIDE.general.steps.map(s=>`<li>${s}</li>`).join('')}</ol>
      <div class="gtips"><b>نصيحة</b>${GUIDE.general.tips}</div>
      <div style="padding:14px 14px 0"><h3 style="font-size:1rem;margin-bottom:6px">إزاي تلعب كل لعبة</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:7px">${HUBORDER.filter(x=>GUIDE[x]).map(x=>`<button class="ghost sm" data-act="guide" data-k="${x}" style="text-align:start">${esc(GAMES[x].name)}</button>`).join('')}</div></div>
      <div class="acts"><button class="big" data-act="gclose">تمام، يلا نلعب</button></div></div></div>`);
    return;
  }
  const g=GAMES[k],G=GUIDE[k];if(!g||!G)return;
  const solo=!!g.solo;
  _sheet('gd',`<div class="sheet" data-act="gclose"><div class="panel" data-act="gstop">
    <div class="bar"><div class="grab"></div><button class="x" data-act="gclose" aria-label="إغلاق">${IC('close')}</button></div>
    <div class="ghero"><img src="assets/img/games/${k}.svg" alt=""><div><h2>${esc(g.name)}</h2><p>${esc(G.desc||g.desc)} • ${g.solo?'لوحدك':g.min===g.max?g.min+' لاعبين':(g.min||2)+'-'+(g.max||10)+' لاعبين'}</p></div></div>
    <ol class="gsteps">${G.steps.map(s=>`<li>${s}</li>`).join('')}</ol>
    ${G.tips?`<div class="gtips"><b>نصيحة</b>${G.tips}</div>`:''}
    <div class="acts"><button class="big" data-act="${solo?'solo':'game'}" data-k="${k}">${IC('play')} يلا نلعب</button><button class="big ghost" data-act="gclose">رجوع</button></div>
  </div></div>`);
}
function setDlg(open){
  if(!open){_sheet('st','');return}
  const on=(v)=>v?'on':'';
  _sheet('st',`<div class="sheet" data-act="sclose"><div class="panel" data-act="sstop">
    <div class="bar"><div class="grab"></div><button class="x" data-act="sclose" aria-label="إغلاق">${IC('close')}</button></div>
    <div class="ghero"><img src="assets/img/hero.svg" alt=""><div><h2>الإعدادات</h2><p>الصوت والشكل والحساب</p></div></div>
    <div style="padding:0 14px;display:grid;gap:8px">
      <button class="ghost" data-act="mus" style="text-align:start">${IC('music')} الموسيقى: ${localStorage.mus==='0'?'مقفولة':'شغالة'}</button>
      <button class="ghost" data-act="sfx" style="text-align:start">${IC('sound')} المؤثرات: ${localStorage.sfx==='0'?'مقفولة':'شغالة'}</button>
      <button class="ghost" data-act="theme" style="text-align:start">${IC(isDark()?'sun':'moon')} الوضع: ${isDark()?'ليلي':'نهاري'}</button>
      <button class="ghost" data-act="rn" style="text-align:start">${IC('pen')} غيّر اسمك</button>
    </div>
    <div style="padding:12px 14px 0"><h3 style="font-size:1rem;margin-bottom:4px">أصوات الحيوانات (تسجيلات حقيقية)</h3>
    <p class="small" style="margin:0 0 8px">دوس على أي زرار تسمع الصوت. دي نفس الأصوات اللي بتطلع في الغرفة.</p>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:7px">
      ${Object.entries(AUDIO_SRC).map(([k])=>`<button class="ghost sm" data-act="asnd" data-k="${k}">${IC('sound')} ${({duck:'بطة',cat:'قطة',dog:'كلب',donkey:'حمار',laugh:'ضحك'})[k]}</button>`).join('')}
    </div></div>
    <div class="acts"><button class="big" data-act="sclose">تمام</button></div></div></div>`);
}

/* ---------- انتقال المشاهد ---------- */
function animView(){
  const a=document.getElementById('app');if(!a)return;
  a.classList.remove('vx');void a.offsetWidth;a.classList.add('vx');
}
const _render=render;
render=function(){
  const before=S.view;
  _render.apply(this,arguments);
  if(S.view!==before){
    animView();
    if(S.view!=='hub'&&!String(S.view).startsWith('play')&&!S.rid)window.scrollTo(0,0);
    if(S.view==='hub')hubStart();else hubStop();
  }else if(S.view==='hub'&&!document.getElementById('hslides'))hubStart();
};

/* ---------- كروسل الهيرو ---------- */
let _hubT=0,_hubI=0;
function hubGo(i){
  const sl=document.getElementById('hslides'),dt=document.getElementById('hdots');
  if(!sl)return;
  const n=sl.children.length;if(!n)return;
  _hubI=((i%n)+n)%n;
  sl.style.transform=`translateX(${_hubI*100*(document.documentElement.dir==='rtl'?-1:1)}%)`;
  if(dt)[...dt.children].forEach((d,j)=>d.classList.toggle('on',j===_hubI));
}
function hubStart(){
  hubStop();
  const h=document.getElementById('hero');if(!h)return;
  hubGo(_hubI);
  _hubT=setInterval(()=>hubGo(_hubI+1),5600);
  let x0=null;
  h.addEventListener('pointerdown',e=>{x0=e.clientX},{passive:true});
  h.addEventListener('pointerup',e=>{
    if(x0==null)return;const dx=e.clientX-x0;x0=null;
    if(Math.abs(dx)>36)hubGo(_hubI+(dx<0?1:-1));
  },{passive:true});
}
function hubStop(){if(_hubT){clearInterval(_hubT);_hubT=0}}

/* ---------- مؤثرات الفوز ---------- */
const DICESVG='<svg viewBox="0 0 40 40" width="38" height="38"><rect x="4" y="4" width="32" height="32" rx="8" fill="#fffdf6" stroke="#c9bda6" stroke-width="2"/><g fill="#241a12"><circle cx="14" cy="14" r="3"/><circle cx="26" cy="14" r="3"/><circle cx="20" cy="20" r="3"/><circle cx="14" cy="26" r="3"/><circle cx="26" cy="26" r="3"/></g></svg>';
function rays(){
  const r=document.createElement('div');r.className='rays';document.body.appendChild(r);setTimeout(()=>r.remove(),1300);
}
const _conf=confetti;
confetti=function(){
  try{
    const cols=['#ff4f81','#ffd54a','#2ee6c8','#7ee0ff','#ff8a3d','#a78bfa','#fff'];
    for(let i=0;i<46;i++){
      const s=document.createElement('i');s.className='cf';
      s.style.cssText=`left:${rnd(100)}vw;width:${5+rnd(7)}px;height:${7+rnd(11)}px;background:${cols[i%cols.length]};border-radius:${i%3?'2px':'50%'};animation-delay:${rnd(650)}ms;animation-duration:${2300+rnd(1500)}ms`;
      document.body.appendChild(s);setTimeout(()=>s.remove(),4300);
    }
    rays();
    SND.play('win');
  }catch(e){}
};

/* ---------- أصوات اللمس ---------- */
let _lastTap=0;
document.addEventListener('pointerdown',e=>{
  const b=e.target.closest&&e.target.closest('[data-act]');
  if(!b)return;
  const now=Date.now();if(now-_lastTap<45)return;_lastTap=now;
  const a=b.dataset.act;
  if(a==='lroll'||a==='sroll')FX2.play('dice');
  else if(a==='mflip')FX2.play('flip');
  else if(a==='guide'||a==='settings'||a==='daily')FX2.play('swoosh');
  else FX2.play('tap');
  try{if(navigator.vibrate&&(a==='lroll'||a==='sroll'||a==='mflip'))navigator.vibrate(12)}catch(e){}
},{passive:true});

/* ---------- أكشنز جديدة ---------- */
document.addEventListener('input',e=>{if(e.target.id==='gs'){const q=e.target.value.trim();document.querySelectorAll('#gsec .gc').forEach(b=>{b.hidden=!!q&&!b.dataset.nm.includes(q)})}});
document.addEventListener('click',e=>{
  const b=e.target.closest&&e.target.closest('[data-act]');if(!b)return;
  const a=b.dataset.act,k=b.dataset.k;
  if(a==='guide'){guideDlg(k);FX2.play('swoosh')}
  else if(a==='gclose'){_sheet('gd','')}
  else if(a==='settings'){setDlg(true)}
  else if(a==='sclose'){_sheet('st','')}
  else if(a==='asnd'){playAnimal(k)}
  else if(a==='scroll'){const t=document.getElementById(b.dataset.t||'gsec');if(t)t.scrollIntoView({behavior:'smooth',block:'start'})}
  else if(a==='daily'){
    const got=PROF.claim();
    if(got>0){
      FX2.play('gift');FX2.play('levelup');
      const lv0=lvOf(PROF.xp);
      toast('🎁 جايزتك اليومية: +10 كوينز و +20 خبرة',1);
      render();
      if(lvOf(PROF.xp)>lv0)setTimeout(()=>toast('🆙 ليفل جديد: '+lvOf(PROF.xp),1),1400);
    }else toast('استلمت جايزة النهاردة، تعالى بكرة 🎁');
  }
});
/* أزرار بتشتغل بالكيبورد */
document.addEventListener('keydown',e=>{
  if((e.key==='Enter'||e.key===' ')&&document.activeElement&&document.activeElement.getAttribute('role')==='button'){e.preventDefault();document.activeElement.click()}
});

/* ---------- شاشة التحميل ---------- */
(function(){
  const hide=()=>{const b=document.getElementById('boot');if(b){b.classList.add('off');setTimeout(()=>b.remove(),600)}};
  if(document.readyState==='complete')setTimeout(hide,420);
  else window.addEventListener('load',()=>setTimeout(hide,420));
  setTimeout(hide,2600);
})();

/* ---------- شاشة اللعبة (قبل إنشاء الغرفة) ---------- */
homeV=function(){
  const G=GAMES[S.kind]||GAMES.dev;
  const rooms=Object.entries(S.idx).filter(([,r])=>(r.kind||'dev')===S.kind)
    .map(([id,r])=>[id,r,Object.keys(S.pl[id]||{}).length]).filter(x=>x[2]>0)
    .sort((a,b)=>b[2]-a[2]||b[1].t-a[1].t);
  const back=CARDK.includes(S.kind)?`<button class="ghost sm" data-act="grp" data-k="cards">← الكوتشينة</button>`:`<button class="ghost sm" data-act="hub">← كل الألعاب</button>`;
  const pl=G.solo?'لوحدك':!G.min?'2-10 لاعبين':G.min===G.max?`${G.min} لاعبين`:`${G.min}-${G.max} لاعبين`;
  const rl=(RULES[S.kind]||[]);
  return topbar()+
  `<div style="display:flex;gap:8px;margin:8px 0 0;align-items:center">${back}<button class="ghost sm" data-act="guide" data-k="${S.kind}" style="margin-inline-start:auto">${IC('book')} إزاي تلعب</button></div>
  <div class="hero" style="margin-top:8px"><div class="hslides"><div class="hslide">
    <img src="assets/img/games/${S.kind}.svg" alt=""><div class="hcopy">
    <span class="kick">${pl}</span><h1>${esc(G.name)}</h1><p>${esc(G.desc)}</p>
    <div class="hbtns"><button class="play" data-act="${G.solo?'solo':'newroom'}" ${G.solo?'':'data-k="'+S.kind+'"'}>${IC('play')} ${G.solo?'ابدأ اللعب':'اعمل غرفة'}</button></div>
    </div></div></div></div>
  <details class="card rules" style="margin-top:10px"><summary>${IC('book')} القواعد السريعة</summary>
    <ul style="margin:8px 0 0;padding-inline-start:18px;font-size:.88rem;line-height:1.7">${rl.map(x=>`<li>${x}</li>`).join('')}</ul></details>
  <h2 class="rowh">الغرف المفتوحة<small>${rooms.length?rooms.length+' غرفة':'مفيش'}</small></h2>`+
  (rooms.length?rooms.map(([id,r,n],i)=>`<div class="card" style="animation-delay:${i*60}ms;padding:10px 12px">
      <div class="rm"><div style="min-width:0"><h3 style="font-size:1.05rem">${esc(r.name)}</h3>
      <span class="small">الأدمن: ${esc(r.admin)}</span> <span class="tag">${r.priv?'🔒 بباسورد':'عامة'}</span> <span class="tag">${r.st==='play'?'اللعب شغال':'في الانتظار'}</span>
      <div class="pts">${n} متواجد دلوقتي</div></div>
      ${(r.priv&&S.ask!==id)?`<button data-act="ask" data-r="${id}">دخول</button>`:`<button data-act="enter" data-r="${id}">دخول</button>`}</div>
      ${(r.priv&&S.ask===id)?`<div class="rm" style="margin-top:10px"><input id="pw" type="password" placeholder="اكتب الباسورد" autocomplete="off"><button data-act="enter" data-r="${id}">ادخل</button></div>`:''}
    </div>`).join('')
   :`<div class="card small" style="text-align:center">مفيش غرف ${esc(G.name)} دلوقتي. اعمل غرفة وابعت اللينك لصحابك.</div>`)+
  `<button class="big" data-act="newroom" data-k="${S.kind}">${IC('play')} إنشاء غرفة</button>
   <button class="big ghost" data-act="quick">دخول سريع (غرفة عامة)</button>`;
};

/* =========================================================
   ألعاب مفتوحة المصدر (OSS) — تعمل داخل إطار مع صفحة اللعب
   ========================================================= */
const OSSG={
  hextris:{name:'هيكستريس',desc:'بلوكات سداسية سريعة: لف ورتّب قبل ما يخلص الوقت',ico:'hex',cat:'arcade',src:'oss/hextris/index.html',author:'Hextris team (Garrett Finucane, Logan Engstrom)',lic:'GPL-3.0',url:'https://github.com/Hextris/hextris'},
  tetris:{name:'تتريس',desc:'الكلاسيكية: نزّل الصفوف قبل ما تتراكم',ico:'tet',cat:'arcade',src:'oss/tetris/index.html',author:'Jake Gordon',lic:'MIT',url:'https://github.com/jakesgordon/javascript-tetris'},
  clumsy:{name:'العصفور',desc:'طيران بضغطة واحدة: عدّي الأنابيب من غير ما تخبط',ico:'bird',cat:'arcade',src:'oss/clumsy/index.html',author:'Ellison Leão',lic:'MIT',url:'https://github.com/ellisonleao/clumsy-bird'}
};
const OSS_LIVE=false; // يتفعّل بعد رفع مجلد oss/
Object.entries(OSSG).forEach(([k,g])=>{
  if(!OSS_LIVE)return;
  GAMES[k]={name:g.name,desc:g.desc,ico:g.ico,solo:1,ext:g.src,cls:'t4'};
  if(typeof HUBORDER!=='undefined'&&!HUBORDER.includes(k))HUBORDER.push(k);
  if(typeof CAT_OF!=='undefined')CAT_OF[k]=g.cat;
  if(typeof NEWG!=='undefined'&&!NEWG.includes(k))NEWG.unshift(k);
});

function extShell(k){
  const g=GAMES[k],o=OSSG[k];
  return `<div class="extwrap">
    <header class="extbar">
      <button class="icobtn" data-act="exback" aria-label="رجوع">${IC('back')}</button>
      <b class="extitle">${esc(g.name)}</b>
      <button class="icobtn" data-act="exfull" aria-label="ملء الشاشة">${IC('layers')}</button>
    </header>
    <div class="extframe" id="extbox">
      <iframe id="extf" src="${o.src}" title="${esc(g.name)}" allow="fullscreen; autoplay; gamepad" loading="eager"></iframe>
    </div>
    <div class="extinfo card">
      <div class="row" style="display:flex;align-items:center;gap:8px">
        <span class="tag">${o.lic}</span>
        <span class="small">${esc(o.author)}</span>
      </div>
      <p class="small" style="margin:6px 0 0">لعبة مفتوحة المصدر، منشورة بترخيصها الأصلي. <a href="${o.url}" target="_blank" rel="noopener">المصدر</a></p>
    </div>
    <button class="big" data-act="exfull">${IC('layers')} كبّر الشاشة</button>
    <button class="big ghost" data-act="exback">← رجوع للألعاب</button>
  </div>`;
}
const _render_base=render;
render=function(){
  if(S.ext){
    if(S.view!=='ext'){S.view='ext';app.innerHTML=extShell(S.ext);window.scrollTo(0,0);return}
    if(!document.getElementById('extf')){app.innerHTML=extShell(S.ext);return}
    return;
  }
  return _render_base();
};

/* اعتراض ضغطات ألعاب الإطار قبل معالج التطبيق */
document.addEventListener('click',e=>{
  const b=e.target.closest&&e.target.closest('[data-act="exback"],[data-act="exfull"],[data-act="solo"],[data-act="game"]');
  if(!b)return;
  const a=b.dataset.act;
  if(a==='exback'){e.stopPropagation();e.preventDefault();S.ext=null;S.view='';render();return}
  if(a==='exfull'){e.stopPropagation();e.preventDefault();
    const el=document.getElementById('extbox');
    if(el){if(document.fullscreenElement){document.exitFullscreen()}else if(el.requestFullscreen){el.requestFullscreen().catch(()=>{})}}
    return}
  const k=b.dataset.k;
  if((a==='solo'||a==='game')&&k&&GAMES[k]&&GAMES[k].ext){e.stopPropagation();e.preventDefault();S.ext=k;S.view='';render();}
},true);

/* ---------- شل الديسكتوب: سايدبار زي بورتالات الألعاب ---------- */
function sideHTML(){
  const cats=(typeof CATS3!=='undefined'?CATS3.slice(1):[]).map(([c,t,ic])=>`<button class="snav" data-act="cat" data-k="${c}">${IC(ic)}<span>${t}</span></button>`).join('');
  return `<div class="sbrand"><img src="assets/img/logo.svg" alt=""><b>ملاهي 15 مايو</b></div>
  <button class="snav on" data-act="hub">${IC('home')}<span>الرئيسية</span></button>
  <button class="snav" data-act="scroll" data-t="gsec">${IC('grid')}<span>كل الألعاب</span></button>
  <button class="snav" data-act="guide">${IC('book')}<span>دليل اللعب</span></button>
  <button class="snav" data-act="acc">${IC('user')}<span>حسابي</span></button>
  <div class="ssep"></div>
  <div class="stitle">التصنيفات</div>${cats}
  <div class="ssep"></div>
  <button class="snav" data-act="settings">${IC('gear')}<span>الإعدادات</span></button>
  <div class="sfoot">${EGF}<span>مصر بس 🇪🇬</span></div>`;
}
function ensureSide(){
  const wide=window.matchMedia('(min-width:980px)').matches;
  let el=document.querySelector('.side');
  const hubish=!S.ext&&!S.rid&&!S.kind&&S.me;
  if(wide&&hubish){
    if(!el){el=document.createElement('aside');el.className='side';document.body.appendChild(el)}
    if(!el.innerHTML||el.dataset.k!==(S.cat||'all')){el.innerHTML=sideHTML();el.dataset.k=S.cat||'all'}
    el.style.display='flex';
  }else if(el){el.style.display='none'}
}
const _r2=render;
render=function(){const o=_r2.apply(this,arguments);try{ensureSide()}catch(e){}return o};
window.addEventListener('resize',()=>{try{ensureSide()}catch(e){}});

const ENG={xo:xoEng,c4:c4Eng,dama:dmEng,ludo:ludoEng,snl:snlEng,mem:memEng,uno:UNO,c_old:OLD,c_war:WAR,c_crazy:CE,c_21:BJ,qz:quizEng('qz'),qm:quizEng('qm'),dm:domEng('dm'),dma:domEng('dma')};
function dropP(o,p){
  const st=clone(o),i=st.order.indexOf(p);
  if(i<0||st.over)return null;
  if(isB(st.kind))return bgDrop(st,p,i);
  if(isD(st.kind)){const hd=A(st.hands[p]);st.yd=[...A(st.yd),...hd];delete st.hands[p];st.order.splice(i,1);if(st.sc)delete st.sc[p];if(st.order.length<2){st.over=1;st.aborted=1;st.winner=null;st.pts={}}else{if(i<st.turn)st.turn--;st.turn%=st.order.length;if(st.ph==='play'){dSettle(st)}}st.v++;return st}
  if(isQ(st.kind)){st.order.splice(i,1);if(st.sc)delete st.sc[p];if(st.order.length<2){qFinish(st);st.aborted=1}else if(st.by===p){st.by=null;st.ph='ask'}st.v++;return st}
  const cur=st.order[st.turn],h=A(st.hands[p]);
  st.order.splice(i,1);delete st.hands[p];
  if(st.stat)delete st.stat[p];
  if(st.kind==='c_war')st.pot=[...A(st.pot),...h];else if(st.kind!=='c_21')st.deck=[...h,...A(st.deck)];
  const min=st.kind==='c_21'?1:2;
  if(st.order.length<min){st.over=1;st.aborted=1;st.winner=st.order[0]||null;st.pts=st.order[0]?{[st.order[0]]:1}:{};st.v++;return st}
  const ci=st.order.indexOf(cur);st.turn=ci>=0?ci:i%st.order.length;st.drew=-1;
  if(st.kind==='c_21'&&cur===p){BJ.adv(st,i-1)}
  if(st.kind==='c_old'){
    const act=oldActive(st);
    if(act.length<=1){st.over=1;st.loser=act[0]||null;st.pts={};st.order.forEach(x=>{if(x!==st.loser)st.pts[x]=1})}
    else if(!A(st.hands[st.order[st.turn]]).length){const n=st.order.length;for(let k=1;k<=n;k++){const r=st.order[(st.turn+k)%n];if(A(st.hands[r]).length){st.turn=st.order.indexOf(r);break}}}
  }
  st.v++;return st;
}
function cgStart(){
  if(!isAdmin())return;
  const G=GAMES[S.meta.kind];
  const ids=Object.entries(S.players).sort((a,b)=>(a[1].t-b[1].t)||(a[0]<b[0]?-1:1)).map(e=>e[0]);
  if(ids.length<G.min)return toast(`محتاجين ${G.min} لاعبين على الأقل`);
  if(ids.length>G.max)return toast(`الحد الأقصى ${G.max} لاعبين`);
  const st=ENG[S.meta.kind].init(ids,S.meta.opts,now());
  st.gid=Date.now()%1e9+rnd(1000);
  update(ref(db,base()),{cg:st,game:{phase:'cards',round:(S.game?.round||0)+1}});
  set(ref(db,`idx/${S.rid}/st`),'play');
}
function cgLobby(){
  if(!isAdmin())return;
  update(ref(db,base()),{cg:null,game:null});
  set(ref(db,`idx/${S.rid}/st`),'wait');
}
async function cgAct(a){
  let fin=null;
  const tx=await runTransaction(ref(db,base()+'/cg'),old=>{
    if(!old)return undefined;
    const nv=a.t==='drop'?dropP(old,a.p):ENG[old.kind].act(old,pid,{...a,adm:isAdmin()});
    if(!nv)return undefined;
    fin=nv.over&&!old.over?nv:null;
    return nv;
  });
  if(!tx.committed){if(a.t!=='uno'&&a.t!=='drop'&&!a.q&&!isQ(S.cg&&S.cg.kind))toast('الحركة دي مش مسموحة دلوقتي');return}
  if(fin&&fin.pts){
    const up={};
    Object.entries(fin.pts).forEach(([id,v])=>{if(S.players[id])up[`rooms/${S.rid}/players/${id}/score`]=increment(v)});
    if(Object.keys(up).length)update(ref(db),up);
  }
}

/* ===== منطق اللعبة ===== */
function startRound(){
  if(!isAdmin())return;
  const g=S.game||{},r=g.phase==='results'?g.round+1:1;
  let used=r===1?[]:[...S.used],pool=LETTERS.filter(l=>!used.includes(l));
  if(!pool.length){used=[];pool=[...LETTERS]}
  const letter=pool[rnd(pool.length)];
  const cats=S.meta.kind==='classic'?[...S.meta.cats]:shuf(S.meta.cats).slice(0,5);
  const up={game:{phase:'play',round:r,letter,cats,endAt:S.meta.limit?now()+S.meta.limit*1000:0},used:[...used,letter]};
  if(r===1){up.r=null;up.hist=null;Object.keys(S.players).forEach(id=>up['players/'+id+'/score']=0)}
  update(ref(db,base()),up);
  set(ref(db,`idx/${S.rid}/st`),'play');
}
function pushAns(){
  const g=S.game;if(!g||!S.me||!S.rid)return;
  set(ref(db,`${base()}/r/${g.round}/answers/${pid}`),{n:S.me,a:S.mine});
}
function done(){
  pushAns();
  runTransaction(ref(db,base()+'/game'),g=>g&&g.phase==='play'?{...g,phase:'countdown',endAt:now()+5000,by:S.me}:undefined);
}
function toReview(from){
  runTransaction(ref(db,base()+'/game'),g=>g&&g.phase===from?{...g,phase:'review'}:undefined);
}
function calc(R,letter,n){
  n=n||5;
  const A=R.answers||{},V=R.votes||{},O=R.ov||{},ids=Object.keys(A),L=key(letter),out={};
  ids.forEach(id=>out[id]={n:A[id].n,t:0,c:Array(n).fill(0),x:Array(n).fill(0),f:Array(n).fill(0)});
  for(let i=0;i<n;i++){
    const ok={},cnt={};
    ids.forEach(id=>{
      const w=key(A[id].a?.[i]),dis=ids.filter(v=>v!==id&&V[v]?.[`${id}_${i}`]).length;
      out[id].f[i]=dis;
      if(!w)out[id].x[i]=1;
      else if(w[0]!==L)out[id].x[i]=2;
      else if(dis>(ids.length-1)/2)out[id].x[i]=3;
      else{ok[id]=w;cnt[w]=(cnt[w]||0)+1}
    });
    Object.entries(ok).forEach(([id,w])=>out[id].c[i]=cnt[w]===1?10:5);
    ids.forEach(id=>{const o=O[`${id}_${i}`];if(o&&o.p!=null&&key(A[id].a?.[i]))out[id].c[i]=+o.p});
  }
  ids.forEach(id=>out[id].t=out[id].c.reduce((a,b)=>a+b,0));
  return out;
}
async function approve(){
  if(!isAdmin())return;
  const round=S.game.round;
  const tx=await runTransaction(ref(db,base()+'/game'),g=>g&&g.phase==='review'&&g.round===round?{...g,phase:'tally'}:undefined);
  if(!tx.committed)return;
  const [a,pl]=await Promise.all([get(ref(db,`${base()}/r/${round}`)),get(ref(db,base()+'/players'))]);
  const G=tx.snapshot.val(),P=pl.val()||{},scores=calc(a.val()||{},G.letter,G.cats.length),up={};
  Object.entries(scores).forEach(([id,s])=>{if(P[id])up[`players/${id}/score`]=increment(s.t);up[`hist/${round}/${id}`]=s.t});
  up['game/last']={round,scores};up['game/phase']='results';
  update(ref(db,base()),up);
}
function setOv(k,fn){
  const o=fn({...(S.r.ov?.[k]||{})});
  set(ref(db,`${base()}/r/${S.game.round}/ov/${k}`),o&&Object.keys(o).length?o:null);
}
function flag(k){
  if(S.game?.phase!=='review')return;
  set(ref(db,`${base()}/r/${S.game.round}/votes/${pid}/${k}`),S.r.votes?.[pid]?.[k]?null:true);
}

/* ===== الشات ===== */
function chatShell(){
  const c=$('#chat');
  if(!S.rid){c.innerHTML='';return}
  c.innerHTML=`<button class="fab" data-act="chat" aria-label="شات الغرفة">💬<b id="bd" hidden></b></button>`+(S.chatOpen?
    `<section class="cp" aria-label="شات الغرفة"><div class="cph"><b>💬 شات الغرفة</b><button class="ghost sm" data-act="chat" aria-label="اقفل الشات">✕</button></div><div id="msgs"></div><div class="emo">${EMO.map(e=>`<button data-act="emo" data-e="${e}">${e}</button>`).join('')}</div><div class="cin"><input id="ci" maxlength="200" placeholder="اكتب رسالة..." autocomplete="off"><button data-act="send">إرسال</button></div></section>`:'');
  chatMsgs();
  if(S.chatOpen)$('#ci').focus();
}
function chatMsgs(){
  const ents=Object.entries(S.chat).sort((a,b)=>a[0]<b[0]?-1:1),n=ents.length;
  if(S.chatOpen)S.seen=n;
  const m=$('#msgs');
  if(m){
    m.innerHTML=ents.slice(-80).map(([,x])=>`<div class="m ${x.p===pid?'me':''}"><small>${esc(x.n)}</small>${esc(x.m)}</div>`).join('')||'<p class="small" style="text-align:center">ابدأ الكلام 👋</p>';
    m.scrollTop=m.scrollHeight;
  }
  const bd=$('#bd');
  if(bd){const u=Math.max(0,n-S.seen);bd.hidden=!u||S.chatOpen;bd.textContent=u}
}
function sendChat(){
  const i=$('#ci'),m=(i.value||'').trim();
  if(!m||!S.rid)return;
  i.value='';
  set(ref(db,`${base()}/chat/${Date.now()}_${pid}`),{n:S.me,m:m.slice(0,200),p:pid});
}
function confetti(){
  const E=[..."🎉🎊✨⭐🎈"];
  for(let i=0;i<36;i++){
    const s=document.createElement('span');s.className='cf';s.textContent=E[i%E.length];
    s.style.cssText=`left:${rnd(100)}vw;animation-delay:${rnd(900)}ms;font-size:${16+rnd(18)}px`;
    document.body.appendChild(s);setTimeout(()=>s.remove(),4200);
  }
}

/* ===== الشاشات ===== */
const lb=()=>Object.entries(S.players).sort((a,b)=>(b[1].score||0)-(a[1].score||0)).map(([id,p],i)=>
  `<div class="lb"><span style="display:flex;align-items:center"><i class="rk">${i+1}</i>${av(p.name)}${esc(p.name)}${id===S.meta?.adminId?' 👑':''}</span><b>${p.score||0}</b></div>`).join('');
const topbar=room=>(S.me&&!AVM[S.me]&&(AVM[S.me]=myAv()),'')+`<header class="top">${room?`<span class="logo">${IC('wheel')} ملاهي 15 مايو</span>`:`<button class="logo ghost" data-act="hub">${IC('wheel')} ملاهي 15 مايو</button>`}<div class="tools">${accChip()}<button class="ghost sm" data-act="rn" aria-label="غيّر اسمك">${av(S.me)}${esc(S.me)} ${IC(gameActive()?'lock':'pen')}</button><button class="ghost sm" data-act="mus" aria-label="موسيقى" style="opacity:${localStorage.mus==='0'?.45:1}">${IC('music')}</button><button class="ghost sm" data-act="sfx" aria-label="مؤثرات" style="opacity:${localStorage.sfx==='0'?.45:1}">${IC('sound')}</button><button class="ghost sm" data-act="theme" aria-label="تبديل الوضع الفاتح والداكن">${IC(isDark()?'sun':'moon')}</button></div></header>`;
const hero_old=()=>`<div class="hero">${CAROUSEL}<h1>ملاهي 15 مايو</h1><p>اختار لعبتك وابدأ الفرفشة 🎉</p></div>`;
const hdr=()=>topbar(true)+`<div class="rinfo"><span><b>${(GAMES[S.meta.kind||'dev']||GAMES.dev).ico} ${esc(S.meta.name)}</b> <span class="small">الأدمن: ${esc(S.meta.adminName)}</span></span><span><button class="ghost sm" data-act="fx" aria-label="صوت مضحك">${FXL[fxk()]}</button><button class="ghost sm" data-act="fxset" aria-label="اختار صوتك">${IC('gear')}</button> <button class="ghost sm" data-act="guide" data-k="${S.meta.kind||'dev'}" aria-label="إزاي تلعب" style="font-weight:900">؟</button> <button class="ghost sm" data-act="leave">خروج</button></span></div>`;

function render(){
  let k;
  if(S.me&&!S.rid&&S.solo&&SOLO[S.solo]){if(S.view==='solo:'+S.solo)return;soloStop();S.view='solo:'+S.solo;app.innerHTML=soloShell(S.solo);SOLO[S.solo].start($('#sg'));return}
  if(!S.me)k='login';
  else if(!S.rid)k=S.creating?'create':S.pending?'join':S.kind?'home':S.sub?'sub':'hub';
  else{
    const g=S.game||{},ph=g.phase||'lobby';
    k=ph==='cards'?'cg':ph==='play'||ph==='countdown'?'play'+g.round:ph==='review'||ph==='tally'?'review'+g.round:ph==='results'?'res'+g.round:ph==='final'?'final':'lobby';
  }
  if(k==='cg'){
    const ck=JSON.stringify([S.cg&&S.cg.v,S.cg&&S.cg.over,S.cg&&S.cg.gid,Object.values(S.players).map(p=>p.name+p.score),S.pickWild,S.peek,S.dsel,S.dmsel,S.view]);
    if(ck===S.ck&&S.view==='cg'){tick();return}
    S.ck=ck;
  }
  const typing=document.activeElement?.tagName==='INPUT'&&app.contains(document.activeElement)&&!document.activeElement.classList.contains('qin');
  if(k===S.view&&(k==='login'||k==='create'||k.startsWith('play')||typing)){tick();return}
  const g=S.game||{};
  if(k.startsWith('play'))S.mine=Array((g.cats||[]).length).fill('');
  if((k.startsWith('res')||k==='final')&&k!==S.view)confetti();
  if(k==='cg'&&S.cg&&S.cg.over&&S.cgOver!==S.cg.gid+'-'+S.cg.v){S.cgOver=S.cg.gid+'-'+S.cg.v;confetti()}
  S.view=k;
  app.innerHTML=k==='login'?loginV():k==='hub'?hubV():k==='sub'?subV():k==='home'?homeV():k==='create'?createV():k==='join'?joinV():hdr()+(k==='lobby'?lobbyV():k==='cg'?cardsV():k.startsWith('play')?playV(g):k.startsWith('review')?reviewV(g):k.startsWith('res')?resV(g):finalV());
  if(k==='login'){const i=$('#nm');i.value=S.me||localStorage.name||'';i.focus()}
  if(k==='join')$('#pw').focus();
  if(k.startsWith('play'))$('#a0')?.focus();
  if(k==='cg'){hydrateImgs();$('#qa')?.focus()}
  tick();
}
const loginV=()=>`${hero()}<div class="card"><label for="nm">اختار اسمك عشان تدخل</label><input id="nm" maxlength="16" autocomplete="off"><label>واختار شخصيتك المضحكة 🤪</label>${avPick(myAv())}<button class="big" data-act="login">يلا ندخل 🎢</button><div style="text-align:center;margin-top:12px"><button class="ghost sm" data-act="theme" aria-label="تبديل الوضع">${isDark()?'☀️':'🌙'}</button></div></div>`;
function hubV_old(){
  const rs=ks=>Object.entries(S.idx).filter(([id,r])=>ks.includes(r.kind||'dev')&&Object.keys(S.pl[id]||{}).length);
  const tile=(act,k,ico,name,desc,cls,ks,i)=>{
    const r=rs(ks),pp=r.reduce((a,[id])=>a+Object.keys(S.pl[id]).length,0);
    return `<button class="tile ${cls}" data-act="${act}" data-k="${k}" style="animation-delay:${i*80}ms">${ART[k]?`<span class="art">${ART[k]}</span>`:`<span class="ti${[...ico].length>3?' sm':''}">${ico}</span>`}<b>${name}</b><small>${desc}</small><em>${r.length} غرفة • ${pp} لاعب</em></button>`;
  };
  return topbar()+hero()+`<div class="tiles">`+['dev','classic','uno','qz','qm','dm','dma'].map((k,i)=>{const g=GAMES[k];return tile('game',k,g.ico,g.name,g.desc,g.cls,[k],i)}).join('')+tile('grp','cards','♠️♥️♦️♣️','الكوتشينة','الشايب • حرب • 8 المجنونة • واحد وعشرين','t4',CARDK,5)+`</div>`;
}
function subV(){
  const rs=k=>Object.entries(S.idx).filter(([id,r])=>(r.kind||'dev')===k&&Object.keys(S.pl[id]||{}).length);
  return topbar()+`<button class="ghost sm" data-act="hub" style="margin-top:6px">← كل الألعاب</button><h2>🃏 الكوتشينة — اختار نوع اللعبة</h2><div class="tiles">`+CARDK.map((k,i)=>{
    const g=GAMES[k],r=rs(k),pp=r.reduce((a,[id])=>a+Object.keys(S.pl[id]).length,0);
    return `<button class="tile ${g.cls}" data-act="game" data-k="${k}" style="animation-delay:${i*80}ms"><span class="ti">${g.ico}</span><b>${g.name}</b><small>${g.desc}</small><em>${r.length} غرفة • ${pp} لاعب</em></button>`;
  }).join('')+`</div>`;
}
function homeV(){
  const G=GAMES[S.kind];
  const rooms=Object.entries(S.idx).filter(([,r])=>(r.kind||'dev')===S.kind).map(([id,r])=>[id,r,Object.keys(S.pl[id]||{}).length]).filter(x=>x[2]>0).sort((a,b)=>b[2]-a[2]||b[1].t-a[1].t);
  const back=CARDK.includes(S.kind)?`<button class="ghost sm" data-act="grp" data-k="cards" style="margin-top:6px">← الكوتشينة</button>`:`<button class="ghost sm" data-act="hub" style="margin-top:6px">← كل الألعاب</button>`;
  return topbar()+back+`<h2>${G.ico} ${G.name}</h2><details class="card rules"><summary>📜 القواعد وطريقة اللعب</summary><ul>${RULES[S.kind].map(x=>`<li>${x}</li>`).join('')}</ul></details>`+
    (rooms.length?rooms.map(([id,r,n],i)=>`<div class="card" style="animation-delay:${i*60}ms"><div class="rm"><div><h3>${esc(r.name)}</h3><span class="small">الأدمن: ${esc(r.admin)}</span> <span class="tag">${r.priv?'🔒 بباسورد':'عامة'}</span> <span class="tag">${r.st==='play'?'اللعب شغال':'في الانتظار'}</span><div class="pts">🟢 ${n} متواجد دلوقتي</div></div>`+
      (r.priv&&S.ask!==id?`<button data-act="ask" data-r="${id}">دخول</button>`:r.priv?'':`<button data-act="enter" data-r="${id}">دخول</button>`)+`</div>`+
      (r.priv&&S.ask===id?`<div class="rm" style="margin-top:10px"><input id="pw" type="password" placeholder="اكتب الباسورد" autocomplete="off"><button data-act="enter" data-r="${id}">ادخل</button></div>`:'')+`</div>`).join('')
    :`<div class="card small">مفيش غرف دلوقتي. اعمل غرفة جديدة وابعت لصحابك 🎈</div>`)+
    `<button class="big" data-act="quick">⚡ دخول سريع (غرفة عامة عشوائية)</button><button class="big ghost" data-act="newroom">➕ إنشاء غرفة</button>`;
}
const joinV=()=>`${hero()}<div class="card"><h3>${esc(S.pending.name)}</h3><label for="pw">الغرفة دي بباسورد 🔒</label><input id="pw" type="password" autocomplete="off"><button class="big" data-act="enter">ادخل</button><button class="big ghost" data-act="cancel">رجوع</button></div>`;
function createV(){
  S.form={priv:false,timed:false,stack:true,on:true};
  const k=S.kind,dev=k==='dev',ab=dev||k==='classic';
  return topbar()+`<h2>➕ غرفة جديدة — ${GAMES[k].name}</h2>
  <label for="rn">اسم الغرفة</label><input id="rn" maxlength="24" autocomplete="off">
  <label>نوع الغرفة</label><div class="seg"><button data-act="vis" data-v="0" class="sel">عامة (أي حد يدخل)</button><button data-act="vis" data-v="1">🔒 بباسورد</button></div>
  <div id="pwbox" hidden><label for="rp">باسورد الغرفة</label><input id="rp" autocomplete="off"></div>`+
  (ab?`<label for="rr">عدد الجولات</label><input id="rr" type="number" min="1" max="20" value="5">
  <label>وقت الجولة</label><div class="seg"><button data-act="tl" data-v="0" class="sel">بدون وقت</button><button data-act="tl" data-v="1">⏱ بوقت محدد</button></div>
  <div id="tmbox" hidden><label for="tm">الوقت بالدقايق</label><input id="tm" type="number" min="0.5" step="0.5" value="2"></div>`+
  (dev?`<label>التصنيفات اللي هتتلعب (<span id="cc">${CATS.length}</span>) <button class="ghost sm" data-act="catall">الكل</button> <button class="ghost sm" data-act="catnone">ولا واحد</button></label>
  <div class="chips">${CATS.map((c,i)=>`<button class="chip on" data-act="cat" data-i="${i}">${esc(c)}</button>`).join('')}</div>`:`<p class="small">التصنيفات ثابتة: ${CLASSIC.join('، ')}</p>`)
  :isQ(k)?quizForm(k)
  :k==='uno'?`<label>تراكم كروت السحب (+2 على +2 و+4 على +4)</label><div class="seg"><button data-act="stk" data-v="1" class="sel">شغال</button><button data-act="stk" data-v="0">مقفول</button></div>`
  :`<p class="small">الغرفة دي من ${GAMES[k].min} لحد ${GAMES[k].max} لاعبين.</p>`)+
  `<button class="big" data-act="mk">إنشاء الغرفة 🚀</button><button class="big ghost" data-act="cancel">رجوع</button>`;
}
const lobbyV=()=>{
  const k=S.meta.kind||'dev',G=GAMES[k],ab=!!G.ab,cnt=Object.keys(S.players).length;
  return `<h2>غرفة الانتظار ⏳</h2><div class="card"><h3>اللاعبين (${cnt})</h3><div class="pgrid" style="margin-top:8px">${Object.entries(S.players).map(([id,p])=>`<span class="pc">${av(p.name)}${esc(p.name)}${id===S.meta.adminId?' 👑':''}</span>`).join('')}</div></div>`+
  (ab?`<div class="card small">${S.meta.rounds} جولات • ${S.meta.limit?'وقت الجولة '+S.meta.limit/60+' دقيقة':'بدون وقت'} • ${S.meta.cats.length} تصنيف • ${S.meta.ph?'🔒 بباسورد':'عامة'}</div>`
  :`<div class="card small">من ${G.min} لـ ${G.max} لاعبين${k==='uno'?' • التراكم '+(S.meta.opts&&S.meta.opts.stack?'شغال':'مقفول'):isQ(k)&&S.meta.opts?' • '+(k==='qm'?'اختيار من متعدد':S.meta.opts.on?'أونلاين':'مع الشلة (صوت)')+' • '+S.meta.opts.n+' سؤال'+(k==='qm'?' • الفوز بفارق '+(S.meta.opts.lead||5)+' نقط':'')+' • '+S.meta.opts.cats.map(c=>CT[c]).join('، '):''} • ${S.meta.ph?'🔒 بباسورد':'عامة'}</div><details class="card rules"><summary>📜 القواعد</summary><ul>${RULES[k].map(x=>`<li>${x}</li>`).join('')}</ul></details>`)+
  swSel()+`<button class="big ghost" data-act="copy">🔗 انسخ لينك الغرفة</button>`+
  (isAdmin()?`<button class="big" data-act="${ab?'start':'cstart'}" ${!ab&&cnt<G.min?'disabled':''}>ابدأ اللعبة 🎮</button>`:`<p class="small" style="text-align:center">مستنيين الأدمن يبدأ اللعبة...</p>`);
};
const playV=g=>`<p class="small" style="text-align:center">جولة ${g.round} من ${S.meta.rounds}</p><div class="letter">${esc(g.letter)}</div>${g.endAt?'<div class="bar"><i id="bar"></i></div>':''}<div id="ban"></div>`+
  g.cats.map((c,i)=>`<label for="a${i}">${esc(c)}</label><input class="ans" id="a${i}" data-i="${i}" autocomplete="off">`).join('')+
  `<button class="big" data-act="done">أتوبيس كومبليت! 🚌</button>`;
function reviewV(g){
  const R=S.r,A=R.answers||{},V=R.votes||{},O=R.ov||{},ids=Object.keys(A),res=calc(R,g.letter,g.cats.length),adm=isAdmin();
  const why=['','فاضية','مش بالحرف','اعتراض الأغلبية'];
  const cards=g.cats.map((c,i)=>`<section class="card"><h3>${esc(c)}</h3>`+ids.map(id=>{
    const w=A[id].a?.[i]||'',s=res[id],k=`${id}_${i}`,o=O[k],p=s.c[i],fl=s.f[i];
    const pts=adm&&w?`<span class="pp">${[10,5,0].map(v=>`<button data-act="pt" data-k="${k}" data-v="${v}" class="${p===v?(o?'sel':'auto'):''}">${v}</button>`).join('')}${o?`<button data-act="rs" data-k="${k}" aria-label="رجوع للتلقائي">↺</button>`:''}</span>`:'';
    return `<div class="row"><span class="n">${av(A[id].n)}${esc(A[id].n)}</span><span class="a ${p?'':'bad'}">${w?esc(w):'—'}</span><span class="pts ${p?'':'z'}">${p?'+'+p:why[s.x[i]]||'0'}</span>${fl?`<span class="small">${fl}👎</span>`:''}`+
      (adm?pts:(id!==pid&&w?`<button class="sm ${V[pid]?.[k]?'on':'ghost'}" data-act="flag" data-k="${k}" aria-label="اعتراض">👎</button>`:''))+`</div>`;
  }).join('')+`</section>`).join('');
  return `<h2>التصحيح ✍️</h2><p class="small">التصحيح تلقائي (الحرف + التكرار + اعتراض الأغلبية). ${adm?'تقدر تغيّر درجة أي إجابة بضغطة: 10 أو 5 أو 0.':'تقدر تعترض 👎 على الإجابات الغلط، والأدمن هو اللي يعتمد النتيجة.'}</p>`+
    `<div class="letter">${esc(g.letter)}</div>${cards}`+
    (adm?`<button class="big" data-act="approve">اعتمد النتيجة ✅</button>`:`<p class="small" style="text-align:center">مستنيين الأدمن يعتمد النتيجة...</p>`);
}
function resV(g){
  const sc=g.last?.scores||{},A=S.r.answers||{},why=['','فاضية','مش بالحرف','اعتراض الأغلبية'];
  const cards=Object.entries(sc).sort((a,b)=>b[1].t-a[1].t).map(([id,s])=>
    `<section class="card"><div class="rm"><h3 style="display:flex;align-items:center">${av(s.n)}${esc(s.n)}</h3><span class="pts">+${s.t}</span></div>`+
    g.cats.map((c,i)=>`<div class="row"><span class="n small">${esc(c)}</span><span class="a">${esc(A[id]?.a?.[i]||'—')}</span>${s.c[i]?`<span class="pts">+${s.c[i]}</span>`:`<span class="pts z">${why[s.x[i]]||'0'}</span>`}</div>`).join('')+`</section>`).join('');
  const last=g.round>=S.meta.rounds;
  return `<h2>نتيجة الجولة ${g.round} 🎯</h2><div class="letter">${esc(g.letter)}</div>${cards}<div class="card"><h3>الترتيب الحالي</h3>${lb()}</div>`+
    (isAdmin()?`<button class="big" data-act="${last?'fin':'start'}">${last?'عرض النتيجة النهائية 🏆':'الجولة الجاية ➡️'}</button>`:`<p class="small" style="text-align:center">مستنيين الأدمن...</p>`);
}
function finalV(){
  const ps=Object.entries(S.players).sort((a,b)=>(b[1].score||0)-(a[1].score||0)),medals=['🥇','🥈','🥉'];
  const rs=[...Array(S.meta.rounds)].map((_,i)=>i+1);
  return `<h2 style="text-align:center">النتيجة النهائية 🏆</h2>`+
    `<div class="card">${ps.slice(0,3).map(([id,p],i)=>`<div class="lb"><span style="font-size:1.3rem;display:flex;align-items:center">${medals[i]} ${av(p.name)}${esc(p.name)}</span><b style="font-size:1.3rem">${p.score||0}</b></div>`).join('')}</div>`+
    `<div class="card wrap"><table><tr><th>اللاعب</th>${rs.map(r=>`<th>${r}</th>`).join('')}<th>المجموع</th></tr>`+
    ps.map(([id,p])=>`<tr><td>${esc(p.name)}</td>${rs.map(r=>`<td>${S.hist[r]?.[id]??'-'}</td>`).join('')}<td><b>${p.score||0}</b></td></tr>`).join('')+`</table></div>`+
    (isAdmin()?`<button class="big" data-act="again">لعبة جديدة في نفس الغرفة 🔁</button>`:'')+`<button class="big ghost" data-act="leave">خروج من الغرفة</button>`;
}

/* ===== شاشات الكروت ===== */
const SU=['♠','♥','♦','♣'],RK=['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
const NMC={};const nm=p=>(S.players[p]&&S.players[p].name)||NMC[p]||'؟';
const stdHtml=(id,cls='',attrs='')=>{
  if(id===52)return `<div class="crd ${cls}" ${attrs}><span class="cm">🃏</span></div>`;
  const s=id/13|0,r=id%13,t=`${RK[r]}<br>${SU[s]}`;
  return `<div class="crd ${s===1||s===2?'rd':''} ${cls}" ${attrs}><span class="q1">${t}</span><span class="cm">${SU[s]}</span><span class="q2">${t}</span></div>`;
};
const uSym=v=>v==='S'?'⦸':v==='R'?'🔄':v==='D'?'+2':v==='W'?'🌈':v==='F'?'+4':v;
const unoHtml=(id,cls='',attrs='')=>{const c=unoC(id),y=uSym(c.v);return `<div class="crd u ${c.c<0?'kw':'k'+c.c} ${cls}" ${attrs}><span class="q1">${y}</span><span class="cm">${y}</span><span class="q2">${y}</span></div>`};
const opp=(p,st,cur)=>{const n=A(st.hands[p]).length;return `<div class="op ${p===cur&&!st.over?'turn':''}">${av(nm(p))}<b>${esc(nm(p))}</b><span class="fan">${Array.from({length:Math.min(n,8)},()=>'<i class="crd back"></i>').join('')}</span><span class="small">${n} كارت</span></div>`};
const lbBox=()=>`<details class="card rules"><summary>${IC('trophy')} الترتيب</summary>${lb()}</details>`;
function banner(st){
  if(!st.ev||S.seenEv===st.gid+'-'+st.v)return '';
  S.seenEv=st.gid+'-'+st.v;const e=st.ev;
  return e.t==='uno'?`<div class="ubn">UNO! 🔔<small>${esc(nm(e.p))}</small></div>`:e.t==='pen'&&e.n>=2?`<div class="ubn sm">😬 ${esc(nm(e.p))} سحب ${e.n}</div>`:e.t==='pair'?`<div class="ubn sm">🎉 زوج!</div>`:'';
}
function cardsV(){
  const st=S.cg;
  if(!st)return '<p class="small" style="text-align:center">⏳ بيتحمّل...</p>';
  if(S.prev.g!==st.gid){S.prev={h:[],top:-1,v:-1,g:st.gid};S.seen=[]}
  accCheck(st);const k=st.kind;(isQ(k)?quizSound(st):cardSound(st));const body=isB(k)?bgView(st):isD(k)?domV(st):k==='qz'?qzV(st):k==='qm'?qmV(st):k==='uno'||k==='c_crazy'?shedV(st):k==='c_old'?oldV(st):k==='c_war'?warView(st):bjView(st);
  return banner(st)+body+lbBox()+(S.pickWild!=null?pickerV(st):'')+(st.over?overV(st):'');
}
function shedV(st){
  const uno=st.kind==='uno',me=pid,cur=st.order[st.turn],inG=st.order.includes(me),mine=[...A(st.hands[me])];
  const myTurn=inG&&cur===me&&!st.over,disc=A(st.disc),top=disc[disc.length-1];
  const vv=x=>typeof x==='number'?x:10+'SRDWF'.indexOf(x);
  mine.sort((a,b)=>uno?(unoC(a).c-unoC(b).c)||(vv(unoC(a).v)-vv(unoC(b).v)):(ceS(a)-ceS(b))||(ceR(a)-ceR(b)));
  const ok=id=>uno?unoOk(st,id):ceOk(st,id),R=uno?unoHtml:stdHtml;
  const prev=new Set(S.prev.h);let d=0;
  const hand=mine.map(id=>{
    const nw=!prev.has(id),can=myTurn&&ok(id)&&(st.drew<0||id===st.drew);
    return R(id,(nw?'deal ':'')+(myTurn?(can?'ok':'no'):''),`${nw?`style="animation-delay:${d++*70}ms" `:''}${can?`data-act="uplay" data-id="${id}" role="button" tabindex="0" aria-label="العب الكارت"`:''}`);
  }).join('');
  const flyc=st.last&&top!==S.prev.top?(st.last.p===me?'flyme':'flyop'):'';
  const canDraw=myTurn&&st.drew<0;
  const msg=st.over?'':myTurn?(st.pend>0?`⚠️ اسحب ${st.pend} كروت أو كمّل التراكم`:st.drew>=0?'العب الكارت اللي سحبته أو تخطّى':'دورك! 🎯'):`دور ${esc(nm(cur))}`;
  const center=`<div class="tbl"><div class="pile ${canDraw?'ok':''}" ${canDraw?'data-act="udraw" role="button" tabindex="0" aria-label="اسحب كارت"':''}><i class="crd back"></i><i class="crd back"></i><i class="crd back"></i></div><div class="ring" style="--rc:${uno?UC[st.col]:'transparent'}">${R(top,flyc,`style="transform:rotate(${(top*37)%14-7}deg)"`)}</div>${uno?`<span class="dir" style="animation-direction:${st.dir<0?'reverse':'normal'}">🔄</span>`:`<span class="tag" style="font-size:1.5rem">${SU[st.suit]}</span>`}</div>`;
  const acts=`<div class="rm" style="justify-content:center;gap:10px;flex-wrap:wrap">${myTurn&&st.drew>=0?`<button data-act="upass">تخطّي ⏭</button>`:''}${myTurn&&st.pend>0?`<button data-act="udraw">اسحب ${st.pend}</button>`:''}${uno&&inG&&mine.length<=2&&mine.length>0&&!st.over?`<button class="yel" data-act="uuno">UNO! 🔔</button>`:''}</div>`;
  S.prev={h:mine,top,v:st.v,g:st.gid};
  return `<div id="ban">${msg}</div><div class="opps">${st.order.filter(p=>p!==me).map(p=>opp(p,st,cur)).join('')}</div>${center}${acts}<div class="hand my">${hand}</div>`;
}
function oldV(st){
  const me=pid,cur=st.order[st.turn],myTurn=cur===me&&!st.over,tg=st.over?null:oldTarget(st,cur),mine=A(st.hands[me]);
  const seen=new Set(S.seen||[]),vis=[];
  const panel=p=>{
    const h=A(st.hands[p]),click=myTurn&&p===tg;
    return `<div class="op ${p===cur&&!st.over?'turn':''} ${p===tg&&!st.over?'tg':''}">${av(nm(p))}<b>${esc(nm(p))}</b>`+(h.length?`<span class="fan">${h.map((c,i)=>`<i class="crd back ${click?'pk':''}" ${click?`data-act="opick" data-i="${i}" role="button" tabindex="0" aria-label="اسحب كارت"`:''}></i>`).join('')}</span><span class="small">${h.length} كارت</span>`:`<span class="small">✅ خلّص</span>`)+`</div>`;
  };
  const hand=mine.map(c=>{vis.push(c);return stdHtml(c,seen.has(c)?'':'deal')}).join('');
  S.seen=vis;
  const msg=st.over?'':myTurn?`اختار كارت من ${esc(nm(tg))} 👆`:`دور ${esc(nm(cur))} يسحب من ${esc(nm(tg))}`;
  return `<div id="ban">${msg}</div><div class="opps">${st.order.filter(p=>p!==me).map(panel).join('')}</div><div class="tbl"><span class="small">${mine.includes(52)?'😬 معاك الشايب!':mine.length?'':'✅ خلّصت كروتك'}</span></div><div class="hand my">${hand}</div>`;
}
function warView(st){
  const tb=st.tb||{},wn=st.w;
  const ops=st.order.map(p=>`<div class="op ${wn===p?'turn':''}">${av(nm(p))}<b>${esc(nm(p))}${p===pid?' (أنت)':''}</b><span class="small">${A(st.hands[p]).length} كارت</span></div>`).join('');
  const flips=Object.entries(tb).map(([p,c])=>`<div style="text-align:center"><div class="${wn===p?'ring':''}" style="--rc:var(--good);display:inline-block">${stdHtml(c,p===pid?'flyme':'flyop')}</div><div class="small">${esc(nm(p))}</div></div>`).join('');
  const msg=!st.rd?'اضغط اقلب عشان نبدأ':st.tie?`🔥 تعادل! الورق اتجمع (${A(st.pot).length} كارت)`:`🏆 ${esc(nm(wn))} أخد الورق • دور ${st.rd}/60`;
  return `<div id="ban">${msg}</div><div class="opps">${ops}</div><div class="tbl" style="min-height:140px">${flips||'<span class="small">🃏 الورق جاهز</span>'}</div>${st.over?'':'<button class="big" data-act="wflip">اقلب 🃏</button>'}`;
}
function bjView(st){
  const me=pid,cur=st.order[st.turn],myTurn=cur===me&&!st.over,dl=A(st.dealer);
  const seen=new Set(S.seen||[]),vis=[],ac=c=>{vis.push(c);return seen.has(c)?'':'deal'};
  const tag={bust:'💥 عدّى',bj:'🌟 بلاك جاك',stand:'✋ وقف',play:''};
  const dealer=`<div class="card" style="text-align:center"><h3>🎩 الموزّع ${st.over?`(${bjVal(dl)})`:''}</h3><div class="hand" style="min-height:0;padding-top:10px">${dl.map((c,i)=>!st.over&&i===1?'<i class="crd back"></i>':stdHtml(c,ac(c))).join('')}</div></div>`;
  const rows=st.order.map(p=>{
    const h=A(st.hands[p]),res=st.res&&st.res[p];
    return `<div class="card ${p===cur&&!st.over?'turncard':''}"><div class="rm"><b style="display:flex;align-items:center">${av(nm(p))}${esc(nm(p))}${p===me?' (أنت)':''}</b><span>${bjVal(h)} ${res?{win:'🏆',lose:'❌',push:'🤝'}[res]:tag[(st.stat&&st.stat[p])||'play']}</span></div><div class="hand" style="min-height:0;justify-content:flex-start;padding-top:10px">${h.map(c=>stdHtml(c,ac(c))).join('')}</div></div>`;
  }).join('');
  S.seen=vis;
  return `<div id="ban">${st.over?'':myTurn?'دورك! اسحب ولا وقّف؟':`دور ${esc(nm(cur))}`}</div>${dealer}${rows}`+(myTurn?`<div class="rm" style="gap:10px"><button class="big" data-act="bhit">اسحب 🃏</button><button class="big ghost" data-act="bstand">وقّف ✋</button></div>`:'');
}
const pickerV=st=>{
  const uno=st.kind==='uno';
  return `<div class="ovl"><div class="card" style="width:min(100%,360px)"><h3 style="text-align:center">${uno?'اختار اللون 🎨':'اختار النوع'}</h3><div class="picker" style="margin-top:12px">${[0,1,2,3].map(i=>uno?`<button data-act="ucol" data-c="${i}" style="background:${UC[i]};color:${i===1?'#2b2100':'#fff'}">${UCN[i]}</button>`:`<button class="ghost" data-act="ucol" data-c="${i}" style="font-size:2rem;color:${i===1||i===2?'#d62839':'inherit'}">${SU[i]}</button>`).join('')}</div><button class="big ghost" data-act="ucancel">إلغاء</button></div></div>`;
};
function overV(st){
  const adm=isAdmin(),k=st.kind;let body='';
  if(isQ(k))body=quizOver(st);else if(k==='c_old')body=st.loser?`<div style="font-size:3rem">😂</div><h2>${esc(nm(st.loser))} معاه الشايب!</h2><p class="small">باقي اللاعبين خدوا نقطة</p>`:`<h2>انتهت الجولة</h2>`;
  else if(k==='c_21')body=`<h2>نتيجة الجولة</h2>`+st.order.map(p=>`<div class="lb"><span style="display:flex;align-items:center">${av(nm(p))}${esc(nm(p))}</span><b>${{win:'🏆 كسب',lose:'❌ خسر',push:'🤝 تعادل'}[st.res&&st.res[p]]||''}</b></div>`).join('');
  else body=`<div style="font-size:3rem">🏆</div><h2>${st.winner?esc(nm(st.winner))+(k==='c_war'?' كسب الحرب!':' كسب الجولة!'):(st.draw?'تعادل 🤝':'اتلغت الجولة')}</h2>`+(st.winner&&st.pts&&st.pts[st.winner]?`<p class="pts">+${st.pts[st.winner]} نقطة</p>`:'');
  return `<div class="ovl"><div class="card" style="text-align:center;width:min(100%,400px)">${body}${adm?`<button class="big" data-act="cnew">جولة جديدة 🔁</button><button class="big ghost" data-act="clobby">رجوع لغرفة الانتظار</button>`:`<p class="small">مستنيين الأدمن...</p>`}<button class="big ghost" data-act="leave">خروج</button></div></div>`;
}

/* ===== تايمر ===== */
function tick(){
  sweep();quizTick();
  if(!S.rid||!S.meta)return;
  const g=S.game,ban=$('#ban');
  if(Object.keys(S.players).length&&S.players[pid]){
    if(S.players[S.meta.adminId])S.gone=0;
    else{
      S.gone=S.gone||Date.now();
      if(Date.now()-S.gone>15000){
        const f=Object.entries(S.players).sort((a,b)=>(a[1].t-b[1].t)||(a[0]<b[0]?-1:1))[0];
        if(f[0]===pid){update(ref(db),{[`rooms/${S.rid}/meta/adminId`]:pid,[`rooms/${S.rid}/meta/adminName`]:S.me,[`idx/${S.rid}/admin`]:S.me});S.gone=0}
      }
    }
  }
  if(S.cg&&S.cg.order&&!S.cg.over&&isAdmin()&&S.players[pid]){
    S.cg.order.forEach(p=>{
      if(S.players[p]){delete S.miss[p];return}
      S.miss[p]=S.miss[p]||Date.now();
      if(Date.now()-S.miss[p]>8000){delete S.miss[p];cgAct({t:'drop',p})}
    });
  }
  if(!g)return;
  if(g.phase==='countdown'){
    const rem=g.endAt-now(),n=Math.max(0,Math.ceil(rem/1000));
    if(ban&&ban.dataset.n!==String(n)){ban.dataset.n=n;ban.innerHTML=rem>0?`<small>${esc(g.by)} داس أتوبيس كومبليت!</small><span class="cd">${n}</span>`:'الوقت خلص ⏹'}
    if(rem<=0)endPlay(g,'countdown',rem);
  }else if(g.phase==='play'){
    if(g.endAt){
      const rem=g.endAt-now(),m=Math.max(0,Math.ceil(rem/1000)),b=$('#bar');
      if(b)b.style.width=Math.max(0,Math.min(100,rem/(S.meta.limit*10)))+'%';
      if(ban)ban.textContent=rem>0?`⏱ ${Math.floor(m/60)}:${String(m%60).padStart(2,'0')}`:'الوقت خلص';
      if(rem<=0)endPlay(g,'play',rem);
    }else if(ban)ban.textContent='اكتب إجابات تبدأ بالحرف ده، وأول واحد يخلص يدوس الزرار';
  }
}
function endPlay(g,from,rem){
  document.querySelectorAll('.ans').forEach(i=>i.disabled=true);
  if(S.sent!==g.round){S.sent=g.round;pushAns()}
  if(rem<-1500-S.jit&&S.mv!==from+g.round){S.mv=from+g.round;toReview(from)}
}
setInterval(tick,250);

/* ===== أحداث ===== */
let t;
document.addEventListener('input',e=>{
  if(!e.target.classList?.contains('ans'))return;
  S.mine[+e.target.dataset.i]=e.target.value;
  clearTimeout(t);t=setTimeout(pushAns,300);
});
document.addEventListener('keydown',e=>{
  if(e.key!=='Enter')return;
  if(e.target.getAttribute&&e.target.getAttribute('role')==='button'){e.target.click();return}
  const id=e.target.id;
  if(id==='nm')login(e.target.value);
  else if(id==='pw'){const r=S.pending?.rid||S.ask;if(r)joinRoom(r,e.target.value)}
  else if(id==='ci')sendChat();
  else if(id==='nn')saveName();
  else if(id==='qa')submitAns();
});
const seg=(b)=>{b.parentElement.querySelectorAll('button').forEach(x=>x.classList.toggle('sel',x===b))};
const setAll=v=>{document.querySelectorAll('.chip[data-i]').forEach(c=>c.classList.toggle('on',v));$('#cc').textContent=v?CATS.length:0};
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-act]');if(!b)return;
  const a=b.dataset.act,k=b.dataset.k;
  if(a==='login')login($('#nm').value);
  else if(a==='theme')setTheme(isDark()?'light':'dark');
  else if(a==='rn'){if(gameActive())return toast('مينفعش تغيّر اسمك واللعب شغال 🎮');dlg(true)}
  else if(a==='rncancel')dlg(false);
  else if(a==='rnsave')saveName();
  else if(a==='hub'){soloStop();S.solo=null;S.kind=null;S.sub=null;S.creating=false;S.pending=null;S.view='';render()}
  else if(a==='grp'){S.sub=k;S.kind=null;S.view='';render()}
  else if(a==='game'){S.kind=k;S.view='';render()}
  else if(a==='quick')quickJoin();
  else if(a==='ask'){S.ask=b.dataset.r;render()}
  else if(a==='enter')joinRoom(b.dataset.r||S.pending.rid,$('#pw')?.value);
  else if(a==='copy')navigator.clipboard.writeText(location.origin+location.pathname+'?r='+S.rid).then(()=>toast('اتنسخ لينك الغرفة 🔗',1));
  else if(a==='newroom'){S.creating=true;render()}
  else if(a==='cancel'){S.creating=false;S.pending=null;S.view='';render()}
  else if(a==='vis'){S.form.priv=b.dataset.v==='1';seg(b);$('#pwbox').hidden=!S.form.priv}
  else if(a==='tl'){S.form.timed=b.dataset.v==='1';seg(b);$('#tmbox').hidden=!S.form.timed}
  else if(a==='cat'){b.classList.toggle('on');$('#cc').textContent=document.querySelectorAll('.chip.on[data-i]').length}
  else if(a==='catall')setAll(true);
  else if(a==='catnone')setAll(false);
  else if(a==='mk')mk();
  else if(a==='start')startRound();
  else if(a==='done')done();
  else if(a==='flag')flag(k);
  else if(a==='pt')setOv(k,()=>({p:+b.dataset.v}));
  else if(a==='rs')setOv(k,()=>null);
  else if(a==='approve')approve();
  else if(a==='fin'){update(ref(db,base()+'/game'),{phase:'final'});set(ref(db,`idx/${S.rid}/st`),'wait')}
  else if(a==='again'){update(ref(db,base()),{game:{phase:'lobby'},used:null,hist:null,r:null});set(ref(db,`idx/${S.rid}/st`),'wait')}
  else if(a==='leave')leave();
  else if(a==='chat'){S.chatOpen=!S.chatOpen;chatShell()}
  else if(a==='emo'){const i=$('#ci');i.value+=b.dataset.e;i.focus()}
  else if(a==='send')sendChat();
  else if(a==='stk'){S.form.stack=b.dataset.v==='1';seg(b)}
  else if(a==='cstart'||a==='cnew')cgStart();
  else if(a==='clobby')cgLobby();
  else if(a==='uplay'){const id=+b.dataset.id;if(S.cg.kind==='uno'?unoC(id).c<0:ceR(id)===7){S.pickWild=id;render()}else cgAct({t:'play',id})}
  else if(a==='ucol'){const id=S.pickWild;S.pickWild=null;cgAct({t:'play',id,col:+b.dataset.c})}
  else if(a==='ucancel'){S.pickWild=null;render()}
  else if(a==='udraw')cgAct({t:'draw'});
  else if(a==='upass')cgAct({t:'pass'});
  else if(a==='uuno')cgAct({t:'uno'});
  else if(a==='opick')cgAct({t:'pick',i:+b.dataset.i});
  else if(a==='wflip')cgAct({t:'flip'});
  else if(a==='bhit')cgAct({t:'hit'});
  else if(a==='bstand')cgAct({t:'stand'});
  else if(a==='qbuzz')cgAct({t:'buzz',ts:now()});
  else if(a==='qsub')submitAns();
  else if(a==='qjok')cgAct({t:'judge',ok:true,ts:now()});
  else if(a==='qjno')cgAct({t:'judge',ok:false,ts:now()});
  else if(a==='qskip')cgAct({t:'skip',ts:now()});
  else if(a==='qpeek'){S.peek=S.cg.gid+'-'+S.cg.v;render()}
  else if(a==='gsel')switchGame(k)
  else if(a==='qonroom'){update(ref(db),{[`rooms/${S.rid}/meta/opts/on`]:!(S.meta.opts&&S.meta.opts.on)})}
  else if(a==='fx')sendFx()
  else if(a==='fxset')fxDlg(true)
  else if(a==='fxclose')fxDlg(false)
  else if(a==='fxsel'){localStorage.fxk=k;try{if(ACC.u&&ACC.p){ACC.p.fx=k;set(ref(db,'users/'+ACC.u.uid+'/fx'),k)}}catch(e){}FUN.play(k);fxDlg(true)}
  else if(a==='dsel'){const t=b.dataset.t,sd=dSides(S.cg,t);if(!sd.length)return toast('الحجر ده مينفعش هنا');if(sd.length===1){S.dsel=null;cgAct({t:'play',tile:t,side:sd[0],ts:now()})}else{S.dsel=t;render()}}
  else if(a==='dplay'){const t=S.dsel;S.dsel=null;if(t)cgAct({t:'play',tile:t,side:b.dataset.s,ts:now()})}
  else if(a==='ddraw')cgAct({t:'draw',ts:now()})
  else if(a==='dnh')cgAct({t:'nh',ts:now()})
  else if(a==='bmv')cgAct({t:'mv',i:+b.dataset.i,c:+b.dataset.c})
  else if(a==='dmpk'){S.dmsel=+b.dataset.i;render()}
  else if(a==='dmgo'){const f=S.dmsel;S.dmsel=null;cgAct({t:'mv',f,to:+b.dataset.i})}
  else if(a==='lroll'||a==='sroll')cgAct({t:'roll'})
  else if(a==='lmv')cgAct({t:'mv',k:+b.dataset.k})
  else if(a==='mflip')cgAct({t:'flip',i:+b.dataset.i})
  else if(a==='cat'){S.cat=k;S.view='';render()}
  else if(a==='solo'){S.solo=k;S.view='';render()}
  else if(a==='gl')accSignIn()
  else if(a==='acc')accDlg(true)
  else if(a==='accclose')accDlg(false)
  else if(a==='accout'){accDlg(false);signOut(AUTH)}
  else if(a==='qnext')cgAct({t:'adv',ts:now()});
  else if(a==='qpick')cgAct({t:'pick',i:+b.dataset.i,ts:now()});
  else if(a==='qon'){S.form.on=b.dataset.v==='1';seg(b)}
  else if(a==='qcat')b.classList.toggle('on');
  else if(a==='mus'){const on=SND.toggleMus();document.querySelectorAll('[data-act="mus"]').forEach(x=>x.style.opacity=on?1:.45)}
  else if(a==='sfx'){const on=SND.toggleSfx();document.querySelectorAll('[data-act="sfx"]').forEach(x=>x.style.opacity=on?1:.45)}
  else if(a==='avsel'){localStorage.av=b.dataset.e;AVM[S.me]=b.dataset.e;document.querySelectorAll('.avb').forEach(x=>x.classList.toggle('sel',x===b));if(S.rid&&S.players[pid])update(ref(db),{[`rooms/${S.rid}/players/${pid}/av`]:b.dataset.e})}
});
S.target=new URLSearchParams(location.search).get('r');
render();
if(S.me&&sessionStorage.rid)enter(sessionStorage.rid);else if(S.me&&S.target)joinRoom(S.target);
