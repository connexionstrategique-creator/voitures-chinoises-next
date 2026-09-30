/**
 * seed-spare-parts.mjs — Downloads images, uploads to Sanity, creates SparePart docs
 * Usage: node scripts/seed-spare-parts.mjs
 */
import https from "https";
import { URL } from "url";

const PROJECT_ID = "t3ow1rmc";
const DATASET    = "production";
const API_BASE   = `https://${PROJECT_ID}.api.sanity.io/v2021-06-07`;
const TOKEN      = process.env.SANITY_TOKEN || process.env.SANITY_TOKEN;

const IMG = {
  oil_filter:           ["https://ae-pic-a1.aliexpress-media.com/kf/Sd71ea78ad479407a8801c85cf6d94fca9.jpg","https://ae-pic-a1.aliexpress-media.com/kf/S3df757631562442b90dfada43e647b5bp.jpg"],
  brake_pads:           ["https://ae-pic-a1.aliexpress-media.com/kf/Sac30aa5735e24a23ac382372cae8be0ez.jpg","https://ae-pic-a1.aliexpress-media.com/kf/S8297a79483a24de49b03cf39292b4a5cT.jpg"],
  air_filter:           ["https://ae-pic-a1.aliexpress-media.com/kf/S3c5997a435574b20a3503d21451dfe3bZ.jpg","https://ae-pic-a1.aliexpress-media.com/kf/S84ad6660429d488598dba39791d493495.jpg"],
  oil_change_kit:       ["https://ae-pic-a1.aliexpress-media.com/kf/Sa5af9410e31c409bb2526d828136b600K.jpg","https://ae-pic-a1.aliexpress-media.com/kf/S39f50f7ac9314f64a459adf9e3dae1a3T.jpg"],
  brake_discs:          ["https://ae-pic-a1.aliexpress-media.com/kf/Sa22939ef61734ef4833b9b92c274d592c.jpg","https://ae-pic-a1.aliexpress-media.com/kf/S16d5e76bdf9443b39ccbbb393dbb2c5cv.jpg"],
  shock_absorbers:      ["https://ae-pic-a1.aliexpress-media.com/kf/Sdf0a722b150e46e0a1a3303257317f18p.png","https://ae-pic-a1.aliexpress-media.com/kf/S7e4684ad6da848969a6b439a639b1cd2O.jpg"],
  floor_mats:           ["https://ae-pic-a1.aliexpress-media.com/kf/S96e4cd003ddc40219bbc2cfc41c79c0fw.jpg","https://ae-pic-a1.aliexpress-media.com/kf/S874b0e70100c43338040f29b92f98752W.jpg"],
  steering_wheel_cover: ["https://ae-pic-a1.aliexpress-media.com/kf/S2317eefa818644d2a5754b98bed4c9e9C.jpg","https://ae-pic-a1.aliexpress-media.com/kf/S3a055a02a712418891e4677035d8bcd2E.jpg"],
  keychain:             ["https://ae-pic-a1.aliexpress-media.com/kf/S5499e7b4869c416eadb3f59f263a4ddbw.jpg","https://ae-pic-a1.aliexpress-media.com/kf/S3828fbc0ab954c8588abdddacbba761dh.jpg"],
  key_cover:            ["https://ae-pic-a1.aliexpress-media.com/kf/Sfac62ac6da3f482a8f19f5163e4bf7664.jpg","https://ae-pic-a1.aliexpress-media.com/kf/S04d0a21024524851af346645800df4b4F.jpg"],
};

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchBuffer(rawUrl) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(rawUrl);
    const options = { hostname: parsed.hostname, path: parsed.pathname + parsed.search,
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        "Accept": "image/*,*/*;q=0.8", "Referer": "https://www.aliexpress.com/" } };
    const req = https.get(options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location)
        return fetchBuffer(res.headers.location).then(resolve).catch(reject);
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
      const chunks = [];
      res.on("data", c => chunks.push(c));
      res.on("end", () => resolve({ buffer: Buffer.concat(chunks), contentType: res.headers["content-type"] || "image/jpeg" }));
    });
    req.on("error", reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error("Timeout")); });
  });
}

async function uploadAsset(buffer, contentType, filename) {
  return new Promise((resolve, reject) => {
    const ext = contentType.includes("png") ? "png" : "jpg";
    const parsed = new URL(`${API_BASE}/assets/images/${DATASET}?filename=${encodeURIComponent(filename)}.${ext}`);
    const req = https.request({ hostname: parsed.hostname, path: parsed.pathname + parsed.search, method: "POST",
      headers: { "Authorization": `Bearer ${TOKEN}`, "Content-Type": contentType, "Content-Length": buffer.length } }, (res) => {
      const chunks = [];
      res.on("data", c => chunks.push(c));
      res.on("end", () => {
        const text = Buffer.concat(chunks).toString();
        try { const j = JSON.parse(text); j.document?._id ? resolve(j.document._id) : reject(new Error("No _id: " + text.slice(0,150))); }
        catch { reject(new Error("JSON: " + text.slice(0,150))); }
      });
    });
    req.on("error", reject); req.write(buffer); req.end();
  });
}

async function sanityQuery(query) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(`${API_BASE}/data/query/${DATASET}?query=${encodeURIComponent(query)}`);
    https.get({ hostname: parsed.hostname, path: parsed.pathname + parsed.search,
      headers: { "Authorization": `Bearer ${TOKEN}` } }, (res) => {
      const chunks = [];
      res.on("data", c => chunks.push(c));
      res.on("end", () => { try { resolve(JSON.parse(Buffer.concat(chunks).toString()).result); } catch(e) { reject(e); } });
    }).on("error", reject);
  });
}

async function sanityMutate(mutations) {
  const body = JSON.stringify({ mutations });
  return new Promise((resolve, reject) => {
    const parsed = new URL(`${API_BASE}/data/mutate/${DATASET}?returnDocuments=false`);
    const req = https.request({ hostname: parsed.hostname, path: parsed.pathname + parsed.search, method: "POST",
      headers: { "Authorization": `Bearer ${TOKEN}`, "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) } }, (res) => {
      const chunks = [];
      res.on("data", c => chunks.push(c));
      res.on("end", () => { try { resolve(JSON.parse(Buffer.concat(chunks).toString())); } catch(e) { reject(e); } });
    });
    req.on("error", reject); req.write(body); req.end();
  });
}

async function uploadImages(key, urls) {
  const refs = [];
  for (let i = 0; i < urls.length; i++) {
    console.log(`  ↓ ${key}[${i}]…`);
    try {
      const { buffer, contentType } = await fetchBuffer(urls[i]);
      const assetId = await uploadAsset(buffer, contentType, `boutique-${key}-${i}`);
      refs.push({ _type: "image", _key: `${key}_${i}`, asset: { _type: "reference", _ref: assetId } });
      console.log(`  ✓ ${assetId} (${(buffer.length/1024).toFixed(0)}KB)`);
    } catch (err) { console.warn(`  ✗ ${err.message}`); }
    await sleep(400);
  }
  return refs;
}

async function main() {
  const existing = await sanityQuery(`*[_type == "sparePart"]{_id}`);
  if (existing.length > 0) {
    await sanityMutate(existing.map(p => ({ delete: { id: p._id } })));
    console.log(`✓ Deleted ${existing.length} existing spare parts.`);
  }

  const cars = await sanityQuery(`*[_type == "car"]{_id, brand, model}`);
  console.log(`\nFound ${cars.length} cars:`);
  cars.forEach(c => console.log(`  ${c._id} — ${c.brand} ${c.model}`));

  const find = pred => { const c = cars.find(pred); return c ? { _type:"reference", _ref:c._id } : null; };
  const T2_5    = find(c => c.brand==="Jetour" && c.model.includes("T2") && c.model.includes("5"));
  const T2_7    = find(c => c.brand==="Jetour" && c.model.includes("T2") && c.model.includes("7") && !c.model.toLowerCase().includes("premium"));
  const T2_7P   = find(c => c.brand==="Jetour" && c.model.includes("T2") && c.model.toLowerCase().includes("premium"));
  const UNIK    = find(c => c.brand==="Changan" && c.model.includes("UNI-K"));
  const CS75    = find(c => c.brand==="Changan" && c.model.includes("CS75"));
  const CS55    = find(c => c.brand==="Changan" && c.model.includes("CS55"));
  const GS3     = find(c => c.model && c.model.includes("GS3"));
  const mka     = (...refs) => refs.filter(Boolean).map((r,i)=>({...r,_key:`car_${i}`}));

  console.log("\n📸 Uploading images…");
  const A = {};
  for (const [k,urls] of Object.entries(IMG)) { console.log(`\n[${k}]`); A[k] = await uploadImages(k,urls); }

  const parts = [
    {_id:"sp-filtre-huile-jetour",_type:"sparePart",name:"Filtre à huile moteur — Jetour X70 / T2 (1.5T)",slug:{_type:"slug",current:"filtre-huile-moteur-jetour"},reference:"JT-1.5T-OFH",category:"filtration",description:"Filtre à huile compatible moteur 1.5T turbo. Remplacement recommandé tous les 5 000 km ou à chaque vidange.",compatibleCars:mka(T2_5,T2_7,T2_7P),photos:A.oil_filter,price:2000,inStock:true,featured:false},
    {_id:"sp-filtre-huile-changan",_type:"sparePart",name:"Filtre à huile moteur — Changan UNI-K (2.0T)",slug:{_type:"slug",current:"filtre-huile-moteur-changan-unik"},reference:"CA-2.0T-OFH",category:"filtration",description:"Filtre à huile pour moteur Changan 2.0T Blue Whale. Compatible UNI-K et CS75 Plus.",compatibleCars:mka(UNIK,CS75),photos:A.oil_filter,price:3500,inStock:true,featured:false},
    {_id:"sp-filtre-air-moteur",_type:"sparePart",name:"Filtre à air moteur",slug:{_type:"slug",current:"filtre-air-moteur"},reference:"CHN-AFH-STD",category:"filtration",description:"Filtre à air moteur haute filtration. Remplacement tous les 15 000–20 000 km.",compatibleCars:mka(T2_5,CS55,CS75),photos:A.air_filter,price:3000,inStock:true,featured:false},
    {_id:"sp-plaquettes-frein",_type:"sparePart",name:"Plaquettes de frein avant (paire) — Jetour",slug:{_type:"slug",current:"plaquettes-frein-avant-jetour"},reference:"JT-BPF-C01",category:"freinage",description:"Plaquettes semi-métalliques TianHe (天合). Bonne résistance thermique. Vendues par paire.",compatibleCars:mka(T2_5,T2_7,T2_7P),photos:A.brake_pads,price:20000,inStock:true,featured:true},
    {_id:"sp-kit-vidange",_type:"sparePart",name:"Kit vidange complet — Jetour (5W-30 + filtre)",slug:{_type:"slug",current:"kit-vidange-jetour"},reference:"JT-VID-KIT1",category:"entretien",description:"4L d'huile moteur 5W-30 + filtre à huile. Économique par rapport au passage en atelier.",compatibleCars:mka(T2_5,T2_7),photos:A.oil_change_kit,price:17000,inStock:true,featured:true},
    {_id:"sp-disques-frein",_type:"sparePart",name:"Disques de frein avant (paire) — Changan",slug:{_type:"slug",current:"disques-frein-avant-changan"},reference:"CA-DFV-001",category:"freinage",description:"Disques ventilés. À remplacer avec les plaquettes. Vendus par paire.",compatibleCars:mka(UNIK,CS75),photos:A.brake_discs,price:45000,inStock:true,featured:false},
    {_id:"sp-amortisseurs",_type:"sparePart",name:"Amortisseurs avant (paire) — Jetour",slug:{_type:"slug",current:"amortisseurs-avant-jetour"},reference:"JT-AMO-AVT",category:"suspension",description:"Amortisseurs avant d'origine. Remplacement tous les 80 000 km. Vendus par paire.",compatibleCars:mka(T2_5,T2_7,T2_7P),photos:A.shock_absorbers,price:185000,inStock:false,featured:false},
    {_id:"sp-batterie",_type:"sparePart",name:"Batterie 12V 70Ah AGM",slug:{_type:"slug",current:"batterie-12v-70ah"},reference:"CHN-BAT-70A",category:"electricite",description:"Batterie 12V 70Ah AGM. Haute performance en climat chaud. Durée de vie 4–5 ans.",compatibleCars:mka(CS55,CS75,GS3),photos:[],price:75000,inStock:true,featured:false},
    {_id:"sp-tapis-jetour",_type:"sparePart",name:"Tapis de sol TPE sur-mesure — Jetour T2 (jeu de 4)",slug:{_type:"slug",current:"tapis-sol-jetour-t2"},reference:"ACC-TPS-JT2-TPE",category:"accessoires",description:"Tapis TPE moulés sur-mesure Jetour T2. Bords relevés, lavable à grande eau.",compatibleCars:mka(T2_5,T2_7),photos:A.floor_mats,price:13000,inStock:true,featured:false},
    {_id:"sp-tapis-changan",_type:"sparePart",name:"Tapis de sol TPE sur-mesure — Changan UNI-K (jeu de 4)",slug:{_type:"slug",current:"tapis-sol-changan-unik"},reference:"ACC-TPS-CA-UNIK",category:"accessoires",description:"Tapis TPE sur-mesure Changan UNI-K. Bords surélevés, antidérapant.",compatibleCars:mka(UNIK),photos:A.floor_mats,price:12000,inStock:true,featured:false},
    {_id:"sp-couvre-volant",_type:"sparePart",name:"Couvre-volant cuir premium (universel)",slug:{_type:"slug",current:"couvre-volant-cuir"},reference:"ACC-VLT-CU38",category:"accessoires",description:"Cuir véritable, coutures contrastées. Diamètre 38 cm universel.",compatibleCars:[],photos:A.steering_wheel_cover,price:10000,inStock:true,featured:false},
    {_id:"sp-porte-cle-jetour",_type:"sparePart",name:"Porte-clé métal — Jetour",slug:{_type:"slug",current:"porte-cle-jetour"},reference:"ACC-PCL-JT-M",category:"accessoires",description:"Métal gravé logo Jetour (捷途). Finition chromée. Livré en boîte cadeau.",compatibleCars:mka(T2_5,T2_7,T2_7P),photos:A.keychain,price:4000,inStock:true,featured:false},
    {_id:"sp-porte-cle-changan",_type:"sparePart",name:"Porte-clé métal — Changan",slug:{_type:"slug",current:"porte-cle-changan"},reference:"ACC-PCL-CA-M",category:"accessoires",description:"Métal gravé logo Changan (长安). Finition chromée. Livré en boîte cadeau.",compatibleCars:mka(UNIK,CS75,CS55),photos:A.keychain,price:3500,inStock:true,featured:false},
    {_id:"sp-protege-cle-jetour",_type:"sparePart",name:"Protège-clé cuir — Jetour Traveler T2",slug:{_type:"slug",current:"protege-cle-jetour-t2"},reference:"ACC-PKC-JT2-L",category:"accessoires",description:"Housse cuir télécommande Jetour T2. Coupe pour clé 4 boutons.",compatibleCars:mka(T2_5,T2_7,T2_7P),photos:A.key_cover,price:4500,inStock:true,featured:false},
    {_id:"sp-protege-cle-changan",_type:"sparePart",name:"Protège-clé cuir — Changan (UNI-K / CS75)",slug:{_type:"slug",current:"protege-cle-changan"},reference:"ACC-PKC-CA-L",category:"accessoires",description:"Housse cuir télécommande Changan. Compatible clés 3 boutons.",compatibleCars:mka(UNIK,CS75,CS55),photos:A.key_cover,price:4500,inStock:true,featured:false},
  ];

  console.log(`\n📤 Creating ${parts.length} spare parts…`);
  for (let i=0;i<parts.length;i+=5) {
    const res = await sanityMutate(parts.slice(i,i+5).map(doc=>({createOrReplace:doc})));
    console.log(`  ✓ Batch ${Math.floor(i/5)+1}`);
    if (res.error) console.error("  Error:", res.error);
    await sleep(500);
  }
  console.log("\n✅ Publishing…");
  for (let i=0;i<parts.length;i+=5) {
    await sanityMutate(parts.slice(i,i+5).map(doc=>({publish:{id:doc._id}})));
    await sleep(300);
  }
  console.log(`\n🎉 Done — ${parts.length} spare parts seeded in Sanity.`);
}

main().catch(err=>{console.error("Fatal:",err);process.exit(1);});
