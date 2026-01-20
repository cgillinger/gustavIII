# 1792: Mordet på Gustav III

Ett immersivt historiskt textäventyr där du är en tidsresenär som måste förhindra mordet på kung Gustav III.

## 🎮 Spela nu

Öppna `index.html` i en webbläsare - inga beroenden eller byggsystem behövs!

## 📦 Installation på server

### På Linux-server:
```bash
# Kopiera filerna till din webbkatalog
cp index.html style.css game.js /var/www/html/gustav/

# Eller kör med Python
python3 -m http.server 8000
# Besök sedan http://localhost:8000
```

### På Synology NAS:
1. Öppna **File Station**
2. Gå till **web** (eller skapa en ny mapp)
3. Ladda upp `index.html`, `style.css` och `game.js`
4. Aktivera **Web Station** i paketcentret
5. Besök `http://[din-synology-ip]/gustav/`

### Med Docker:
```bash
docker run -d -p 8080:80 -v $(pwd):/usr/share/nginx/html:ro nginx
```

## 🎯 Spelmekanik

### Grundläggande kommandon:
- **titta** / **se omkring** - Undersök rummet
- **gå [riktning]** - Förflytta dig (norr, söder, öster, väster, in, ut)
- **undersök [sak]** - Granska något närmare
- **ta [sak]** - Plocka upp ett föremål
- **prata med [person]** - Samtala med karaktärer
- **använd [sak]** - Använd ett föremål
- **inventarie** - Se vad du bär på
- **hjälp** - Visa hjälpmenyn

### Avancerade kommandon (NYA!):
- **fråga [person] om [ämne]** - Ställ specifika frågor (t.ex. "fråga bellman om konspiration")
- **ge [sak] till [person]** - Ge föremål till karaktärer (t.ex. "ge färg till adelcrantz")
- **sov** / **vila** - Sov till nästa dag (endast på kvällen)
- **vänta** - Låt 30 minuter passera
- **ropa** / **varna** - Varna kungen (i klimax-scenen)
- **gripa [person]** - Försök gripa någon fysiskt
- **skydda** - Kasta dig emellan (i klimax-scenen)
- **göm** / **gömma** - Försök gömma dig

### Funktioner:
- ✅ **Auto-sparning** - Spelet sparas automatiskt efter varje kommando
- 💡 **Hint-system** - Fastnat? Tryck på "Ledtråd"-knappen
- ⭐ **8 Achievements** - Lås upp prestationer när du framskrider
- 📊 **Progress tracking** - Se din framgång i progressbaren
- 💾 **Manuell sparning** - Spara och ladda när du vill
- ⏰ **Tidssystem** - Tiden förflyter från dag 14→15→16 mars
- 🎬 **3 Akter** - Komplett story över 3 dagar
- 🔚 **6 Alternativa slut** - Dina val avgör slutet

## 🗺️ Storyline

**14 mars 1792, 16:30** - Du materialiserar dig på Norrmalmstorg. Två dagar kvar till mordet.

### Akt 1: Ankomsten (14 mars)
1. Anpassa dig till 1792 - Hitta tidsenliga kläder
2. Utforska Stockholm - Norrmalmstorg, Gamla stan, Operan
3. Börja samla ledtrådar - Prata med folk, besök krogar
4. Lär känna nyckelpersoner - Adelcrantz, Bellman

### Akt 2: Utredningen (15 mars)
1. Spåra pistolsmeden Wåhlberg - Hitta bevis
2. Infiltrera Pechlins palats - Avlyssna konspirationen
3. Hitta Anckarströms bostad - Samla konkreta bevis
4. Skaffa biljett till balen - Hjälp Adelcrantz med färg

### Akt 3: Maskeradbalen (16 mars)
1. Klockan tickar - Mordet sker kl 23:45
2. Varna kungen - Men behöver du bevis?
3. Konfrontera Anckarström - I sista sekunden
4. Avgörandet - Rädda eller misslyckas?

**Dina val avgör slutet!**

## 🎭 Karaktärer

Möt historiska personer:
- **Gustav III** - Sveriges kung, 46 år
- **Carl Michael Bellman** - Den berömde skalden
- **Carl Fredrik Adelcrantz** - Operans arkitekt
- **Jacob Johan Anckarström** - Attentatsmannen
- **Adolph Ribbing & Claes Fredrik Horn** - Medsammansvurna
- **Hans Henric von Essen** - Kungens förtrogen
- ...och många fler!

## 🔚 6 Alternativa Endings

Dina val genom spelet avgör vilket slut du får:

### 👑 Perfect Victory
Räddade kungen med **övertygande bevis**. Du samlade pistollistan från Wåhlberg, Anckarströms anteckningar och konspirationsdokument. Kungen trodde dig och arresterade konspiratörerna innan mordet. Du återvänder hem som hjälte.

### ⚔️ Narrow Victory
Stoppade mordet **i sista sekund**. Du hade inte tillräckligt med bevis, men grep Anckarström eller kastade dig emellan när han skulle skjuta. Kungen lever, men det var nära!

### 💀 Failed - Historien upprepar sig
Du **misslyckades**. Mordet skedde som i historien. Gustav III dog 13 dagar senare. Din smartphone dog - du är **fastlåst i 1792 för evigt**.

### ⚫ Vigilante - Egna händer
Du **mördade Anckarström** innan han kunde agera. Kungen lever, men du har blod på händerna. Var det värt det?

### 🗡️ Conspiracy - Den nya ordningen
Du **gick med i konspirationen**. Hjälpte Pechlin och de andra. Mordet lyckades. Du blev rådgivare i nya regimen och förändrade Sveriges framtid - men kan aldrig återvända hem.

### 🎭 Kassandra - Ödets ironi
Du **varnade utan bevis**. Kungen lyssnade inte. Mordet skedde. Du såg det komma men kunde inte stoppa det - Kassandras förbannelse.

## 🏛️ 25+ Platser att utforska

**Norrmalm:**
- Norrmalmstorg - Torget framför Operan
- Kungliga Operan - Entré, foajé, loger, drabantsalen, salongen
- Drottninggatan - Huvudgata med butiker
- Wåhlbergs vapensmedja - Där Anckarströms pistoler spårdes
- Kemistens butik - Färger och tinkturer
- Kungsträdgården - Kunglig park
- Blasieholmen - Aristokratiska palatsen

**Gamla stan:**
- Stora Nygatan - Huvudgata
- Stortorget - Torget mitt i staden
- Österlånggatan - Smal gränd
- Västerlånggatan - Parallell gränd
- Den Gyldene Freden - Historisk krog (1722)

**Konspirationens platser:**
- Pechlins palats - Där planer smiddes
- Pechlin salong - Avlyssna mötet
- Anckarströms lägenhet - Hitta bevisen

**Kungliga platser:**
- Norrbro - Bron till slottet
- Slottsbacken - Vakt ade uppfart
- Slottsgården - Inre gård
- Stockholms slott - Kungens residens

**Arbetarkvarter:**
- Klarakvarteren - Enklare områden
- Järnkällan - Arbetarkrog
- Upplandsgatan - Där Anckarström bor

...och fler som låses upp!

## 📚 Historisk autenticitet

Spelet är baserat på verkliga händelser och omfattande forskning:

**Källor:**
- [SO-rummet: Gustav III:s sista maskerad](https://www.so-rummet.se/fakta-artiklar/gustav-iiis-sista-maskerad-mordet-som-gjorde-slut-pa-en-era)
- [Stockholmskällan: Krogar och restauranger](https://stockholmskallan.stockholm.se/teman/stockholm-ater/krogar-och-restauranger/)
- [Livrustkammaren: Gustav III:s maskeraddräkt](https://livrustkammaren.se/kunglig-historia/kungliga-berattelser/drakter-och-smycken/gustav-iiis-maskeraddrakt/)
- [Europeana: Anckarströms pistoler](https://www.europeana.eu/en/item/2064105/Museu_ProvidedCHO_Livrustkammaren_55140)
- [Historiska Media: Mordet](https://historiskamedia.se/artiklar/mordet-pa-gustav-iii-avslutar-en-era/)

**Autenticitet:**
- Alla karaktärer är historiska personer
- Wåhlbergs vapensmedja (verklig - gjorde Anckarströms pistoler)
- 700+ krogar i 1700-talets Stockholm (historiskt faktum)
- Den Gyldene Freden (öppnad 1722, finns fortfarande)
- Platsbeskrivningar från arkitekturhistoria
- Tidstypiska immersiva detaljer (dofter, ljud, miljö)
- Exakta tidslinjer från händelserna

## 🎨 Design

- **Retro-inspirerad** design med modern UX
- **Responsiv** - fungerar på desktop, tablet och mobil
- **Tillgänglig** - tydlig typografi och hög kontrast
- **Atmosfärisk** - guldtoner och 1700-talskänsla

## 🔧 Teknisk info

**Arkitektur:**
- **Modulär design** - 5 JavaScript-filer
  - `game.js` (42 KB) - Huvudmotor, parser, rum, karaktärer
  - `game-expansion.js` (35 KB) - 20+ nya rum, items, karaktärer, tidssystem
  - `endings.js` (15 KB) - 6 alternativa slut med conditions
  - `integration.js` (12 KB) - Kopplar ihop allt, nya kommandon
  - `style.css` (15 KB) - Komplett styling inkl endings
- **localStorage** - För sparade spel
- **Vanilla JS** - Ingen framework
- **~120 KB** total storlek (fortfarande superlättviktig!)

**Features:**
- Inga beroenden
- Fungerar offline
- Responsiv design
- Cross-browser kompatibel

## ⏱️ Speltid

**Första genomspelningen:** 2-4 timmar
- Komplett utforskning: ~3-4 timmar
- Snabbt genomspelande: ~1.5-2 timmar
- 100% completion (alla achievements, bästa slut): ~4-5 timmar

**Replay-värde:**
- 6 olika endings att upptäcka
- Multipla vägar till målet
- Olika strategier fungerar
- Nya dialoger och hemligheter vid omspel

## 📊 Innehållsstatistik

- **25+ spelplats** med unika beskrivningar
- **15+ karaktärer** med dialoger
- **30+ interaktiva objekt**
- **8 achievements** att låsa upp
- **6 alternativa slut**
- **3 kompletta akter**
- **100+ dialogutbyten**
- **~15,000 ord** totalt innehåll

## 🚀 Vidareutveckling

Möjliga framtida utökningar:
- 🔊 Ljud och musik från 1700-talet
- 🖼️ Illustrationer av karaktärer och platser
- 🌍 Flerspråkigt stöd (engelska, etc.)
- 📱 Mobil-app version
- 🎲 Procedurellt genererade sidouppdrag
- 👥 Fler NPC-relationer och djupare dialogträd
- 🗺️ Interaktiv karta
- 📖 Historieklexikon med verkliga fakta

## 📜 Licens

Detta är ett utbildningsprojekt baserat på historiska händelser i det offentliga rummet.

---

**Lycka till med din tidsresa till 1792!** 🕰️👑
