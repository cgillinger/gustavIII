// ==========================================
// EXPANSION PACK - ADDITIONAL ROOMS
// ==========================================
// Add these rooms to the existing Rooms object

const NewRooms = {
    // DAY 1 (March 14) - More exploration

    vahlberg_gunsmith: {
        name: 'Wåhlbergs Vapensmedja',
        chapter: 1,
        description: `En liten verkstad med dunkla väggar täckta av sot. Arbetsbänken är full av pistoldelar, filar och hammare.

Bakom disken står <span class="important">Anders Wåhlberg</span>, en äldre smed med kraftiga armar och läderf förkläde. Han sliper på en pistolkolv.

Lukten av metalldamm, olja och svavel fyller rummet. På väggen hänger färdiga pistoler - vackert graverade vapen.`,

        exits: {
            'ut': 'drottninggatan'
        },
        items: ['pistol_list', 'tools'],
        characters: ['vahlberg'],
        visited: false,
        unlockCondition: 'learned_about_pistols'
    },

    drottninggatan: {
        name: 'Drottninggatan',
        chapter: 1,
        description: `En av Stockholms huvudgator, kantad med butiker och verkstäder. Människor strömmar förbi - betjänter med korgar, borgare i pälskappor, soldater på patrull.

En skylt till vänster: <span class="important">"A. Wåhlberg - Vapensmed"</span>. Till höger: <span class="important">"Kemisten - Färger & Tinkturer"</span>.

Gatan fortsätter norrut mot okända kvarter. Söderut leder den tillbaka mot Norrmalmstorg.`,

        exits: {
            'syd': 'norrmalmstorg',
            'norr': 'klarakvarter',
            'vänster': 'vahlberg_gunsmith',
            'höger': 'kemisten'
        },
        items: ['gatlykta'],
        characters: ['gatuförsäljare'],
        visited: false
    },

    kemisten: {
        name: 'Kemistens butik',
        chapter: 1,
        description: `En liten butik med höga hyllor fulla av glasburkar med färgpigment, tinkturer och kemikalier. Doften är skarp - svavel, vitriol och eteriska oljor.

<span class="important">Kemisten</span>, en tunn man med glasögon, står vid sin mixbänk och blandar något blått.

"Välkommen! Vad kan jag hjälpa er med? Färg? Medicin? Gift?" Han skrattar nervöst vid det sista.`,

        exits: {
            'ut': 'drottninggatan'
        },
        items: ['färgburkar', 'recept'],
        characters: ['kemisten'],
        visited: false
    },

    stortorget: {
        name: 'Stortorget, Gamla stan',
        chapter: 1,
        description: `Hjärtat av Gamla stan - ett torg omgivet av höga hus med stafflade gavelröraden. Det är här den stora blodbad et ägde rum 1520, fast det minns ingen längre med skräck.

Nu är torget en livlig marknadsplats. Försäljare ropar ut sina varor - fisk, grönsaker, tyg, krukmakeri.

I mitten står en brunn. Barn leker runt den medan deras mödrar handlar.

Vid en stentrappa sitter två unga flickor omgivna av blomkorgar och ett dragspel. <span class="important">Den äldre spelar musik</span> medan <span class="important">den yngre</span> - klädd i ett märkligt, påkostat kostym - <span class="important">framför något slags teateruppsättning</span> för små barn som samlats runt henne. Deras skratt ekar över torget.`,

        exits: {
            'norr': 'köpmangatan',
            'syd': 'gamla_stan',
            'öster': 'österlånggatan',
            'väster': 'västerlånggatan'
        },
        items: ['brunn', 'marknadsstånd', 'blomkorgar'],
        characters: ['fiskhandlare', 'barn', 'siri_felice', 'mina_leonore'],
        visited: false
    },

    österlånggatan: {
        name: 'Österlånggatan',
        chapter: 1,
        description: `En smal gata som slingrar sig längs gamla stans östra sida. Hus från medeltiden lutar mot varandra över gatan.

Du känner igen adressen från Bellmans berättelser - här någonstans ligger <span class="important">Den Gyldene Freden</span> i en källare.`,

        exits: {
            'väster': 'stortorget',
            'in': 'den_gyldene_freden'
        },
        items: [],
        characters: [],
        visited: false
    },

    köpmangatan: {
        name: 'Köpmangatan',
        chapter: 1,
        description: `En smal medeltida gata som leder norrut från Stortorget. Höga hus med utskjutande övervåningar skapar en tunnel av träfasader.

Gatan är full av butiker - bagare, skomakare, skräddare. Skyltar hänger över dörrarna, knirkande i vinden.

Söderut ser du tillbaka mot <span class="important">Stortorget</span> och dess livliga marknad.`,

        exits: {
            'syd': 'stortorget'
        },
        items: [],
        characters: [],
        visited: false
    },

    västerlånggatan: {
        name: 'Västerlånggatan',
        chapter: 1,
        description: `Gamla stans längsta gata sträcker sig längs den gamla stadsmuren. Fasaderna är målade i varma färger - ockra, rött, brunt.

Här och var öppnar sig gränder mot Riddarfjärden. Du känner vattnets fuktiga luft och hör måsarnas skrik.

Österut leder en smal gränd tillbaka mot <span class="important">Stortorget</span>.`,

        exits: {
            'öster': 'stortorget'
        },
        items: [],
        characters: [],
        visited: false
    },

    // DAY 2 (March 15) - Investigation deepens

    pechlin_house: {
        name: 'Pechlins palats, Blasieholmen',
        chapter: 2,
        description: `Ett magnifikt palats på Blasieholmen. Fasaden är nyklassicistisk med doriska kolonner.

Du har lyckats ta dig in genom en sidoingång. Inuti är allt guld och marmor - tavlor på väggarna, persiska mattor.

Du hör röster från salongen på andra våningen. <span class="warning">Du måste vara försiktig här.</span>`,

        exits: {
            'ut': 'blasieholmen',
            'upp': 'pechlin_salon'
        },
        items: ['tavla', 'matta'],
        characters: ['tjänare_pechlin'],
        visited: false,
        unlockCondition: 'chapter2'
    },

    pechlin_salon: {
        name: 'Pechlins salong',
        chapter: 2,
        description: `En stor salong med högt i tak. Kristallkronor hänger ovan. Ett långt mahogny-bord dominerar rummet.

Runt bordet sitter fem män i djup diskussion:
- <span class="important">General Pechlin</span>, gammal och allvarlig
- <span class="important">Adolph Ribbing</span>, ung och intensiv
- <span class="important">Claes Fredrik Horn</span>, kylig och beräknande
- <span class="important">Jacob Johan Anckarström</span>, nervös och hatfylld
- <span class="important">Carl Pontus Lilliehorn</span>, synligt obekväm

De har inte upptäckt dig än. Du gömmer dig bakom en draperi...`,

        exits: {
            'ner': 'pechlin_house'
        },
        items: ['dokument', 'kartor'],
        characters: ['pechlin', 'ribbing', 'horn', 'anckarstrom_conspire', 'lilliehorn'],
        visited: false,
        specialEvent: 'conspiracy_meeting'
    },

    fredsgatan: {
        name: 'Fredsgatan',
        chapter: 1,
        description: `En bred gata som löper västerut från Norrmalmstorg. Höga stenhus kantar gatan, och du hör fjärran ljud av hamnen.

Västerut skymtar du <span class="important">Blasieholmen</span> - den exklusiva halvön där stadens rikaste adelsmän bor.

Österut leder gatan tillbaka mot <span class="important">Norrmalmstorg</span> och Operan.

Gatlykter kastar långa skuggor över kullerstenen.`,

        exits: {
            'öster': 'norrmalmstorg',
            'väster': 'blasieholmen'
        },
        items: [],
        characters: [],
        visited: false
    },

    blasieholmen: {
        name: 'Blasieholmen',
        chapter: 2,
        description: `En halvö som sträcker sig ut i vattnet. Här bor stadens rikaste - adelsmän och köpmän.

<span class="important">Pechlins palats</span> reser sig framför dig med sina vita kolonner.

Området är relativt ödsligt. Perfekt för hemliga möten.`,

        exits: {
            'öster': 'fredsgatan',
            'in': 'pechlin_house'
        },
        items: [],
        characters: ['vaktpatrull'],
        visited: false,
        unlockCondition: 'chapter2'
    },

    anckarstrom_residence: {
        name: 'Anckarströms bostad, Upplandsgatan',
        chapter: 2,
        description: `Ett enkelt stenhus på Upplandsgatan. Fönstren är mörka.

Du står utanför och funderar. <span class="important">Här inne bor mannen som ska mörda kungen.</span>

Om du kunde komma in... vad skulle du hitta? Vapnen? Bevis?

<span class="warning">Men det är farligt. Mycket farligt.</span>`,

        exits: {
            'ut': 'upplandsgatan',
            'in': 'anckarstrom_apartment'
        },
        items: [],
        characters: [],
        visited: false,
        unlockCondition: 'found_anckarstrom'
    },

    anckarstrom_apartment: {
        name: 'Anckarströms lägenhet',
        chapter: 2,
        description: `Du har brutit dig in. Rummet är spartanskt inrett - en säng, ett bord, en stol.

På bordet ligger <span class="important">två pistoler</span>, nyligen rengjorda. Bredvid dem en slipsten och en <span class="important">slaktarkniv</span> med vasst egg.

Ett papper med klottrade anteckningar: "16 mars... midnatt... svart kappa... håll dig nära..."

<span class="warning">Du hör fotsteg i trappan!</span>`,

        exits: {
            'ut': 'anckarstrom_residence',
            'fönster': 'upplandsgatan'
        },
        items: ['anckarstrom_pistols', 'anckarstrom_knife', 'anckarstrom_note'],
        characters: [],
        visited: false,
        specialEvent: 'anckarstrom_returns'
    },

    upplandsgatan: {
        name: 'Upplandsgatan',
        chapter: 2,
        description: `En gata i norra Stockholm. Enklare hus, inga palats här.

Anckarströms bostad ligger här någonstans - nummer 12.`,

        exits: {
            'syd': 'drottninggatan',
            'in': 'anckarstrom_residence'
        },
        items: [],
        characters: [],
        visited: false,
        unlockCondition: 'found_anckarstrom_address'
    },

    // DAY 3 (March 16) - The Day of the Ball

    opera_workshop: {
        name: 'Operans verkstad',
        chapter: 1,
        description: `En stor verkstad bakom scenen. Här bygger och målar man kulisser och rekvisita.

Stora målningar av slott och landskap lutar mot väggarna. Träkonstruktioner för kommande föreställningar.

<span class="important">Carl Fredrik Adelcrantz</span> sitter här med ritningar.`,

        exits: {
            'ut': 'opera_staff'
        },
        items: ['ritningar', 'färg'],
        characters: ['adelcrantz'],
        visited: false
    },

    opera_foyer: {
        name: 'Operans foajé',
        chapter: 1,
        description: `Den magnifika foajén med marmorgolv och höga kolonner. Speglar på väggarna multiplicerar ljuset från ljuskronorna.

Eleganta soffor i gustaviansk stil står längs väggarna. Tavlor föreställande operascener.

En bred trappa leder upp till logerna. Dörrar leder in till huvudsalongen.`,

        exits: {
            'ner': 'opera_entrance',
            'in': 'opera_main_hall',
            'upp': 'opera_loges'
        },
        items: ['spegel', 'sofa'],
        characters: ['operagäst1', 'operagäst2'],
        visited: false
    },

    opera_corridor: {
        name: 'Operans korridor',
        chapter: 1,
        description: `En smal korridor som löper längs operans södra sida. Väggarna är målade i varmt gult.

Härifrån hörs ljud från köket - skrammel av tallrikar, röster av kockar, doften av rostat kött och kryddor.

Till vänster leder korridoren tillbaka mot <span class="important">entrén</span>.`,

        exits: {
            'vänster': 'opera_entrance'
        },
        items: [],
        characters: [],
        visited: false
    },

    opera_main_hall: {
        name: 'Operans huvudsal',
        chapter: 1,
        description: `Du står i själva operasalen - en magnifik sal med balkongloger i flera våningar.

Scenen är enorm, med kulisser och rep som hänger från taket. På golvet ligger markeringar för dansare.

Ljuskronor hänger från taket, väntar på att tändas för kvällens föreställning.

Ut mot <span class="important">foajén</span> leder de stora dörrarna.`,

        exits: {
            'ut': 'opera_foyer'
        },
        items: [],
        characters: [],
        visited: false
    },

    opera_loges: {
        name: 'Operans loger',
        chapter: 1,
        description: `En korridor längs operasalongens sida. Små dörrar leder in till privata loger.

<span class="important">Kungens loge</span> ligger mitt emot scenen - den finaste av alla med förgyllda ornament.

Genom dörrarna hör du musik och röster från huvudsalen.`,

        exits: {
            'ner': 'opera_foyer',
            'in': 'king_loge'
        },
        items: [],
        characters: [],
        visited: false
    },

    king_loge: {
        name: 'Kungens loge',
        chapter: 3,
        description: `Du står i kungens egen loge. Sammetsklädda stolar, förgyllda väggar.

Härifrån har kungen perfekt utsikt över både scenen och publiken.

Men ikväll... ikväll kommer han ner på golvet. Bland masorna.

<span class="warning">Där mördaren väntar.</span>`,

        exits: {
            'ut': 'opera_loges'
        },
        items: ['kikare'],
        characters: [],
        visited: false,
        unlockCondition: 'chapter3'
    },

    drabant_hall: {
        name: 'Drabantsalen',
        chapter: 3,
        description: `Kungens privata matsal på operan. Ett långt bord med silverkärl och kristallglas.

Just nu - klockan är ${Game.currentTime.hour}:${String(Game.currentTime.minute).padStart(2, '0')} - äter <span class="important">kungen</span> supé här med sina närmaste:
- von Essen
- Löwenhielm
- Borgenstierna

De talar lågt. Kungen ser bekymrad ut. Han håller något i handen - <span class="important">ett brev</span>.`,

        exits: {
            'ut': 'opera_loges',
            'ner': 'opera_foyer'
        },
        items: ['supébord', 'silverkärl'],
        characters: ['gustav_iii_dining', 'von_essen_dining', 'lowenhielm_dining'],
        visited: false,
        unlockCondition: 'chapter3'
    },

    opera_ballroom: {
        name: 'Operasalongen - Maskeradbalen',
        chapter: 3,
        description: `Det är midnatt. Balen är i full gång.

Hundratals människor i masker och fantasikostymer dansar, skrattar, viskar. Orkestern spelar den sjätte kontradansen.

Ljuskronorna ovan glittrar. Luften är tjock av parfym, svett och ljusvax.

Du ser <span class="important">kungen</span> - lätt att känna igen trots masken. Ordensstjärnor na glittrar på bröstet. Han går arm i arm med <span class="important">von Essen</span> mot scenen.

Där... där ser du dem. <span class="warning">Män i svarta kappor och vita masker</span>. De rör sig genom folkmassan. Samordnade. Jakande.

En av dem - <span class="important">Anckarström</span> - har handen under kappan.

<span class="warning">Det händer NU!</span>`,

        exits: {
            'ut': 'opera_foyer'
        },
        items: [],
        characters: ['gustav_iii', 'von_essen', 'anckarstrom', 'ribbing', 'horn', 'lowenhielm', 'pollet'],
        visited: false,
        unlockCondition: 'chapter3',
        specialEvent: 'assassination_attempt'
    },

    slott_courtyard: {
        name: 'Slottsgården',
        chapter: 1,
        description: `Den stora innergården på Stockholms slott. Karoliner i blå uniformer står vakt.

Höga fasader reser sig åt alla håll. Fönster glittrar i ljuset från facklor.

Detta är maktens centrum - men även den är sårbar.`,

        exits: {
            'ut': 'slottsbacken',
            'in': 'slott_hall'
        },
        items: [],
        characters: ['slottsvakt'],
        visited: false
    },

    slott_hall: {
        name: 'Slottets entréhall',
        chapter: 1,
        description: `En magnifik hall med marmorgolv och höga kolonner. Trappor leder upp till statsvåningen.

Porträtt av kungar genom tiderna tittar ner på dig.

<span class="warning">Vakter övervakar noggrant. Du kan inte gå längre in utan tillstånd.</span>`,

        exits: {
            'ut': 'slott_courtyard'
        },
        items: ['porträtt'],
        characters: ['hovmarskalk'],
        visited: false
    },

    klarakvarter: {
        name: 'Klarakvarteren',
        chapter: 2,
        description: `Ett enklare område norr om centrum. Här bor hantverkare och arbetare.

Gator med snickarverkstäder, skräddare, krogar för folk med mindre i plånboken.

Luften luktar svett och arbete snarare än parfym.`,

        exits: {
            'syd': 'drottninggatan',
            'in': 'arbetarkrog'
        },
        items: [],
        characters: ['snickare', 'piga'],
        visited: false,
        unlockCondition: 'chapter2'
    },

    arbetarkrog: {
        name: 'Järnkällan',
        chapter: 2,
        description: `En enkel arbetarkrog. Inte lika fin som Den Gyldene Freden - här finns bara enkla träbord och bänkar.

Men brännvinet är billigare, och tung orna lösare.

En äldre <span class="important">soldat</span> i hörnet mumlar över sitt glas om "den där kapten Anckarström... bitter som galla..."`,

        exits: {
            'ut': 'klarakvarter'
        },
        items: ['brännvinskrus'],
        characters: ['gammal_soldat', 'arbetare'],
        visited: false,
        unlockCondition: 'chapter2'
    }
};

// Merge with existing rooms
Object.assign(Rooms, NewRooms);

// ==========================================
// EXPANSION - ADDITIONAL ITEMS
// ==========================================

const NewItems = {
    pistol_list: {
        name: 'pistolbok',
        description: 'Wåhlbergs anteckningar om reparationer. Du ser ett namn: "Kpt. J.J. Anckarström - 2 st pistoler - 10 mars 1792"',
        takeable: true,
        useable: false,
        keywords: ['bok', 'anteckningar', 'pistolbok', 'lista']
    },

    anckarstrom_pistols: {
        name: 'Anckarströms pistoler',
        description: 'Två vackert graverade pistoler med "WÅHLBERG STOCKHOLM" inristat. Nyligen rengjorda. Laddade.',
        takeable: true,
        useable: true,
        keywords: ['pistoler', 'vapen', 'pistol']
    },

    anckarstrom_knife: {
        name: 'slaktarkniv',
        description: 'En stor slaktarkniv, vasst slipat. Ett barb har satts på udden. Detta är inte för att slakta djur...',
        takeable: true,
        useable: false,
        keywords: ['kniv', 'slaktarkniv']
    },

    anckarstrom_note: {
        name: 'Anckarströms anteckningar',
        description: '"16 mars. Midnatt. Svart kappa. Vit mask. Håll dig nära scenen. När Horn ger tecken - SKJUT. För frihetens skull."',
        takeable: true,
        useable: true,
        keywords: ['anteckningar', 'papper', 'lapp', 'note']
    },

    dokument: {
        name: 'konspirationsdokument',
        description: 'Planer för ett nytt Sverige. Författningsförslag. Listor på regementsbefälhavare att kontakta. Och... datumvalskalender med 16 mars inringat.',
        takeable: true,
        useable: true,
        keywords: ['dokument', 'papper', 'planer']
    },

    färgburkar: {
        name: 'färgburkar',
        description: 'Burkar med pigment i alla färger. Adelcrantz behöver preussiskt blått för en kuliss.',
        takeable: true,
        useable: true,
        keywords: ['färg', 'burkar', 'pigment']
    },

    black_domino: {
        name: 'svart domino-kappa',
        description: 'En lång svart sidenkappa, typisk för maskeradbaler. Med denna kan du smälta in bland konspiratörerna.',
        takeable: true,
        useable: true,
        keywords: ['kappa', 'domino', 'svart']
    },

    warning_letter_blank: {
        name: 'tomt brevpapper',
        description: 'Fint brevpapper med vaxsigill. Du skulle kunna skriva ett övertygande varningsbrev till kungen...',
        takeable: true,
        useable: true,
        keywords: ['papper', 'brev']
    },

    blommor: {
        name: 'vilda blommor',
        description: 'En vacker bukett med vilda rosor, violer och tusenskönor från Siri och Minas trädgård. De doftar ljuvligt av vår.',
        takeable: true,
        useable: false,
        keywords: ['blomma', 'blommor', 'bukett', 'ros', 'rosor', 'viola', 'violer']
    },

    blomkorgar: {
        name: 'blomkorgar',
        description: 'Två vackra korgar fyllda med färska blommor. Siri och Mina säljer dem för två öre styck.',
        takeable: false,
        useable: false,
        keywords: ['korg', 'korgar', 'blomkorg']
    },

    // === MISSING ITEMS - SCENERY & ATMOSPHERE ===

    snö: {
        name: 'snö på marken',
        description: 'Smältande snö ligger på kullerstenen. Det är en kylig marskväll 1792.',
        takeable: false,
        useable: false,
        keywords: ['snö', 'is']
    },

    ljuskrona: {
        name: 'kristallkrona',
        description: 'En magnifik kristallkrona hänger från taket. Hundratals ljus flimrar i kristallerna.',
        takeable: false,
        useable: false,
        keywords: ['ljuskrona', 'krona', 'kristall', 'ljus']
    },

    peruk: {
        name: 'peruk',
        description: 'En vit pudrad peruk av det senaste modet. Typisk för 1700-talets adelsmän.',
        takeable: true,
        useable: true,
        keywords: ['peruk', 'hår']
    },

    spegel: {
        name: 'spegel',
        description: 'En stor spegel med förgylld ram. Du ser din egen reflektion - fortfarande lite främmande i 1700-talskläder.',
        takeable: false,
        useable: false,
        keywords: ['spegel', 'reflektion']
    },

    räcke: {
        name: 'brons räcke',
        description: 'Ett elegant räcke i brons längs bron. Det är slitet av tusentals händer genom åren.',
        takeable: false,
        useable: false,
        keywords: ['räcke', 'bro']
    },

    ölstop: {
        name: 'ölstop',
        description: 'Ett tjockt lerkrus fyllt med öl. Kondensen rinner längs sidorna.',
        takeable: false,
        useable: false,
        keywords: ['öl', 'ölstop', 'stop', 'krus']
    },

    meny: {
        name: 'matsedel',
        description: 'En trätavla med dagens rätter kritade: "Stekt gädda, kalvstek, ärtsoppa, brännvin".',
        takeable: false,
        useable: false,
        keywords: ['meny', 'matsedel', 'mat']
    },

    bänk: {
        name: 'parkbänk',
        description: 'En enkel träbänk bland träden. Perfekt för att vila fötterna.',
        takeable: false,
        useable: false,
        keywords: ['bänk', 'säte']
    },

    tavla: {
        name: 'oljemålning',
        description: 'En stor oljemålning föreställande ett slag. Soldater i röda uniformer stormar framåt.',
        takeable: false,
        useable: false,
        keywords: ['tavla', 'målning', 'konst']
    },

    matta: {
        name: 'persisk matta',
        description: 'En praktfull matta från Persien. Komplexa mönster i rött, blått och guld.',
        takeable: false,
        useable: false,
        keywords: ['matta', 'persisk']
    },

    tools: {
        name: 'verktyg',
        description: 'Hammare, tänger, filar och andra verktyg för vapensmide. Väl använda och omsorgsfullt underhållna.',
        takeable: false,
        useable: false,
        keywords: ['verktyg', 'hammare', 'tång', 'fil']
    },

    gatlykta: {
        name: 'gatlykta',
        description: 'En järnlykta med flimrande ljus från ett tjockt stearinljus. Den kastar långa skuggor.',
        takeable: false,
        useable: false,
        keywords: ['lykta', 'gatlykta', 'ljus', 'lampa']
    },

    recept: {
        name: 'receptbok',
        description: 'Kemistens anteckningsbok fylld med recept för tinkturer, salvor och färgämnen. Handskriften är prydlig.',
        takeable: false,
        useable: false,
        keywords: ['recept', 'bok', 'anteckningar']
    },

    brunn: {
        name: 'stenbrun',
        description: 'En gammal brunn mitt på torget. Barn leker runt den. Vattnet är klart och kallt.',
        takeable: false,
        useable: false,
        keywords: ['brunn', 'vatten']
    },

    marknadsstånd: {
        name: 'marknadsstånd',
        description: 'Enkla träbås med tyg över. Försäljare ropar ut sina varor - grönsaker, fisk, tyg, krukmakeri.',
        takeable: false,
        useable: false,
        keywords: ['stånd', 'marknadsstånd', 'bås']
    },

    kartor: {
        name: 'militärkartor',
        description: 'Kartor över Stockholm och omgivande landskap. Militära positioner är markerade.',
        takeable: false,
        useable: false,
        keywords: ['karta', 'kartor', 'map']
    },

    ritningar: {
        name: 'scenritningar',
        description: 'Tekniska ritningar för kulisser och scenografi. Detaljerade och noggrant uppmätta.',
        takeable: false,
        useable: false,
        keywords: ['ritning', 'ritningar', 'skiss']
    },

    färg: {
        name: 'färgtuber',
        description: 'Tuber och krukor med olika färger för scenografi. Blått, rött, gult, grönt.',
        takeable: false,
        useable: false,
        keywords: ['färg', 'målarfärg', 'tube']
    },

    sofa: {
        name: 'gustaviansk soffa',
        description: 'En elegant soffa i gustaviansk stil. Klädd i blå siden med vita detaljer.',
        takeable: false,
        useable: false,
        keywords: ['soffa', 'sofa', 'möbel']
    },

    kikare: {
        name: 'operakikare',
        description: 'En liten förgylld kikare för att se scenen närmare. Perfekt för operabesök.',
        takeable: false,
        useable: false,
        keywords: ['kikare', 'tubkikare']
    },

    supébord: {
        name: 'supébord',
        description: 'Ett långt bord täckt av vit linneduk. Kristallglas och silverbestick är prydligt uppdukat.',
        takeable: false,
        useable: false,
        keywords: ['bord', 'supébord', 'matbord']
    },

    silverkärl: {
        name: 'silverkärl',
        description: 'Praktfulla silverkärl med kungens monogram. Polerade till högglans.',
        takeable: false,
        useable: false,
        keywords: ['silver', 'silverkärl', 'skål']
    },

    porträtt: {
        name: 'kungaporträtt',
        description: 'Ett stort porträtt av Gustav III i kunglig skrud. Han ser majestätisk och självsäker ut.',
        takeable: false,
        useable: false,
        keywords: ['porträtt', 'målning', 'tavla']
    },

    brännvinskrus: {
        name: 'brännvinskrus',
        description: 'Grova lerkrus fyllda med brännvin. Lukten är skarp och stickande.',
        takeable: false,
        useable: false,
        keywords: ['krus', 'brännvinskrus', 'brännvin']
    }
};

Object.assign(Items, NewItems);

// ==========================================
// EXPANSION - ADDITIONAL CHARACTERS
// ==========================================

const NewCharacters = {
    vahlberg: {
        name: 'Anders Wåhlberg',
        description: 'Vapensmed, kraftigt byggd med sotiga händer',
        location: 'vahlberg_gunsmith',
        dialogue: {
            first: `Smeden tittar upp från sitt arbete.

"God dag! Intresserad av vapen? Jag gör Sveriges finaste pistoler - även för kungens livgarde!"

Han visar stolt upp en pistol han sliper.`,

            topics: {
                'pistoler': `"Jag reparerade nyligen två pistoler åt en kapten... Anckarström hette han. Underlig figur. Nervös. Han bad mig göra dem extra pålitliga. 'De måste inte svikta', sa han."

Wåhlberg ser bekymrad ut.

"Efteråt kände jag mig orolig. Vad ska han använda dem till?"`,

                'anckarström': `"Anckarström? Ja, han var här för några dagar sedan. Före detta officer, tror jag. Bitter man. Bor på Upplandsgatan, nummer 12."

<span class="important">Du har fått Anckarströms adress!</span>`,

                'lista': `Wåhlberg tar fram sin anteckningsbok.

"Här är min journal. Anckarström - 10 mars - två pistoler..."

Han låter dig se.`
            }
        },
        keywords: ['wåhlberg', 'vahlberg', 'smed', 'vapensmed']
    },

    kemisten: {
        name: 'Kemisten',
        description: 'En tunn man med glasögon och färgfläckade händer',
        location: 'kemisten',
        dialogue: {
            first: `"Välkommen! Jag har allt - från färger till mediciner. Vad behöver ni?"`,

            adelcrantz_quest: `"Adelcrantz från operan skickade er? Ah ja, han ville ha preussiskt blått! Här - ta denna burk och lämna till honom. Han kommer uppskatta det!"

<span class="important">Du fick färg till Adelcrantz!</span>`,

            topics: {
                'gift': `Kemisten sänker rösten.

"Ni frågar om gift? Jag säljer arsenikum för råttbekämpning... men jag håller noggrann journal. Myndigheterna, ni förstår."

Han tittar misstänksamt på dig.`
            }
        },
        keywords: ['kemist', 'kemisten', 'man']
    },

    siri_felice: {
        name: 'Siri Felice',
        description: 'En 16-årig flicka med dragspel och ett varmt leende',
        location: 'stortorget',
        dialogue: {
            first: `Den äldre flickan slutar spela dragspel och ler mot dig.

"God dag, god herre! Jag är <span class="important">Siri Felice</span>, och detta är min syster <span class="important">Mina Leonore</span>!"

Hon gör en liten bugning. Hennes dragspel glänser i solen.

"Vi uppträder här på torget! Jag spelar musik - dragspel, fiol, flöjt, vad som helst! - och min lilla syster... ja, hon är en <span class="important">Kohs-Pleyare</span>!" Hon säger ordet med stolthet.

"Hon utklär sig som <em>berömda gestalter från historien</em> och framför deras berättelser! Just nu är hon Diana, gudinna av jakten. Igår var hon Jeanne d'Arc!"

Mina, klädd i ett silverfärgat kostym med en leksakspilbåge, vinkar glatt mot dig.

Siri fortsätter: "Vi säljer också blommor om du vill ha? Våra föräldrar odlar dem i trädgården."`,

            repeat: `Siri spelar en glad melodi på sitt dragspel medan Mina gör teatraliska gester för barnen.

"Tack för att du stannade! Musik och berättelser gör världen bättre, tycker jag!"`,

            topics: {
                'musik': `Siris ögon lyser upp!

"Åh, jag älskar musik! Jag lärde mig dragspel av en gatumusikant när jag var liten, och sedan fortsatte jag själv. Fiol, flöjt, gitarr... jag provar allt!"

Hon spelar en vacker liten melodi.

"Musik kan lätta hjärtat även i mörka tider. Det är därför vi är här - för att sprida glädje!"`,

                'mina': `"Min syster Mina är så kreativ! Hon älskar att klä ut sig och berätta historier. Hon sydde sitt Diana-kostym själv - med min hjälp förstås."

Hon ler stolt.

"Folk kallar henne 'Kohs-Pleyare' - en som spelar/gestaltar kostymer och roller. Barnen älskar henne!"`,

                'kohs-pleyare': `Siri skrattar.

"Ja, 'Kohs-Pleyare'! Vi hittade på ordet tillsammans. Det betyder någon som <em>spelar en kostymerad roll</em> - som teater, fast på gatan!"

"Mina studerar gamla berättelser och historiska personer, sedan gör hon kostymer och uppträder som dem. Hon har varit Diana, Jeanne d'Arc, drottning Kristina, Esther från Bibeln..."

"Barnen tycker det är magiskt!"`,

                'blommor': `"Vi har vilda rosor, violer och tusenskönor! De växer i vår trädgård. Ta gärna några - de är bara två öre!"

<em>Du kan köpa blommor av Siri Felice.</em>`,

                'stockholm': `"Vi älskar Stockholm! Visst är det en härlig stad? Full av liv, musik, berättelser..."

Siri ser lite bekymrad ut.

"Fast det känns... oroligt på sistone. Folk viskar om mörkra ting. Jag hoppas kungen är säker på den där maskeradbalen alla pratar om..."`,

                'balen': `"Åh ja, maskeradbalen på Operan! Hela Stockholm pratar om den. Jag önskar jag kunde gå... men sådana evenemang är bara för adeln."

Hon spelar en drömsk vals på sitt dragspel.

"Men vi kommer spela utanför Operan den kvällen! Kanske hör kungen vår musik genom fönstren?"`,

                'anckarström': `Siri skakar på huvudet.

"Anckarström? Nej, jag känner inte till någon med det namnet. Är det en adelsman?"`,

                'konspiration': `Siri blir allvarlig.

"Konspiration? Det låter farligt... Vi håller oss borta från politik. Vi vill bara sprida glädje med musik och berättelser."

Hon sänker rösten.

"Men jag har hört folk viskas... om missnöjda adelsmän. Det oroar mig."`
            }
        },
        keywords: ['siri', 'felice', 'flicka', 'dragspel', 'musiker', 'syster']
    },

    mina_leonore: {
        name: 'Mina Leonore',
        description: 'En 13-årig flicka i ett självgjort Diana-kostym med leksakspilbåge',
        location: 'stortorget',
        dialogue: {
            first: `Den yngre flickan - klädd i silverfärgat tyg med ett blommigt diadem och en liten pilbåge - springer fram till dig!

"Välkommen, främling! Jag är <span class="important">Mina Leonore</span>, <span class="important">Kohs-Pleyare extraordinär</span>!"

Hon gör en djup teatralisk bugning.

"Just nu gestaltar jag <em>Diana, gudinnan av jakten och månen</em>! Men igår var jag Jeanne d'Arc med rustning och flagga! Och i förrgår var jag drottning Kristina som abdikerade tronen!"

Hennes entusiasm är smittsam. Barnen runt henne fnissar och applåderar.

"Vill du se en föreställning? Eller vill du höra om min <em>konst</em>?"`,

            repeat: `Mina uppträder dramatiskt och citerar från gamla legender medan barnen skrattar och klackar.

"Detta är vad jag lever för! Att berätta historiens stora berättelser!"`,

            topics: {
                'kohs-pleyare': `Minas ögon strålar!

"Åh, du vill veta! 'Kohs-Pleyare' betyder att jag <em>spelar kostymer</em>! Jag klär ut mig som berömda personer och framför deras berättelser!"

"Det är som teater - men jag är både skådespelare, kostymör och berättare! Jag studerar historiska personer och mytologiska figurer, gör kostymer, och sedan uppträder jag som dem här på torget!"

Hon hoppar upp och ner av entusiasm.

"Igår lärde jag tio barn om Jeanne d'Arc! Idag lär jag dem om Diana! Det är magin med Kohs-Pleyare - att göra historia levande!"`,

                'diana': `Mina pekar på sitt kostym.

"Diana! Romersk gudinna av jakten, månen och djuren! Hon är stolt, oberoende och modig!"

Hon tar upp sin leksakspilbåge och låtsas sikta.

"Hon skyddade oskyldiga djur och straffade grymma jägare. Jag sydde detta silverdiadem själv för att likna hennes måndiadem!"

Hon strålar av stolthet.`,

                'jeanne': `"Jeanne d'Arc! Hon är min favorit!" Mina gestikulerar vilt.

"En bondflicka som blev krigsledare! Hon hörde gudomliga röster och ledde Frankrikes armé till seger! Så modig!"

Hon ser drömsk ut.

"Jag gjorde en rustning av läderpapper och en flagga med liljor. Barnen älskade det!"`,

                'kristina': `"Drottning Kristina av Sverige! Hon regerade Sverige för femtio år sedan!"

Mina sätter sig på trappan och försöker se konungslig ut.

"Hon älskade filosofi och konst mer än att vara drottning, så hon abdikerade - gav upp tronen! Så modig att följa sitt hjärta!"

"Jag gjorde en krona av blommor och en sammetskapla för den rollen."`,

                'historier': `"Jag älskar alla gamla berättelser! Bibliska hjältinnor som Esther och Ruth, mytologiska gudinnor, historiska drottningar..."

Mina räknar på fingrarna.

"Jag har gestaltat Diana, Jeanne d'Arc, Kristina, Artemis, Venus, Ruth från Bibeln... och nästa vecka vill jag prova Kleopatra!"

"Historia är inte tråkigt när man GÖR den levande!"`,

                'siri': `"Min storasyster Siri är bäst! Hon spelar musik medan jag uppträder - det gör allt så mycket vackrare!"

Mina ler mot Siri.

"Hon hjälper mig sy kostymer också. Jag kan inte spela dragspel som hon, men hon kan inte berätta historier som jag - så vi kompletterar varandra perfekt!"`,

                'musik': `"Siri är den musikaliska! Hon kan spela allt - dragspel, fiol, flöjt, gitarr..."

Mina lyssnar en stund på Siris spelande.

"Jag önskar jag kunde det också, men jag är bättre på berättelser och kostymer!"`,

                'blommor': `"Vi säljer blommor som våra föräldrar odlar! De är vackra, eller hur?"

Mina plockar upp en vild ros och luktar på den.

"Bara två öre styck! Perfekt för att ge till någon du tycker om!"`,

                'stockholm': `"Stockholm är världens bästa stad för en Kohs-Pleyare! Så mycket historia, så många berättelser!"

Hon ser sig omkring på torget.

"Vet du att det var här - på detta torg - som Stockholms blodbad hände 1520? Åttiotvå personer avrättade! Så hemskt!"

"Men nu är det en glad plats med barn och blommor."`,

                'anckarström': `Mina skakar på huvudet.

"Anckarström? Nej, jag känner inte den personen. Är det en historisk figur?"`,

                'konspiration': `Mina blir ovanligt allvarlig.

"Konspiration låter kusligt... som något ur en mörk berättelse."

Hon tystnar.

"Jag hoppas ingenting hemskt händer. Stockholm behöver glädje, inte mörkra saker."`
            }
        },
        keywords: ['mina', 'leonore', 'flicka', 'diana', 'kostym', 'kohs-pleyare', 'kohs', 'pleyare', 'syster']
    },

    pechlin: {
        name: 'General Carl Fredrik Pechlin',
        description: 'En gammal man med kraftig peruk och kallna ögon',
        location: 'pechlin_salon',
        dialogue: {
            first: `<span class="warning">Du har blivit upptäckt!</span>

Pechlin reser sig från bordet.

"Vem i helvete är du? Hur kom du in här?"

De andra männen reser sig också. Anckarström lägger handen på en pistol...`,

            confrontation: `"En spion? Vem har skickat dig? Kungen?"

Pechlin går mot dig.

"Ni herrar - ta hand om inkräktaren."

<span class="warning">Du måste fly!</span>`
        },
        keywords: ['pechlin', 'general']
    },

    ribbing: {
        name: 'Greve Adolph Ribbing',
        description: 'Ung och intensiv med brinnande ögon',
        location: 'pechlin_salon',
        dialogue: {
            ballroom: `Ribbing ser dig genom masken.

"Du... du hör inte hit. Vad vill du?"

Hans hand vilar på något under kappan.`
        },
        keywords: ['ribbing', 'greve']
    },

    horn: {
        name: 'Greve Claes Fredrik Horn',
        description: 'Kallställd och beräknande',
        location: 'pechlin_salon',
        dialogue: {
            ballroom: `Horn studerar dig kyligt.

"Ni verkar... intresserad av kvällens händelser. Var försiktig. Nyfikenhet kan vara farligt."`
        },
        keywords: ['horn', 'greve']
    },

    anckarstrom_conspire: {
        name: 'Kapten Anckarström',
        description: 'Han sitter nervöst och vrider på händerna',
        location: 'pechlin_salon',
        dialogue: {
            overhear: `Du hör Anckarström säga: "Jag har vapnen. Jag har modet. Ge mig bara tecknet så ska den tyrannens liv ta slut!"

Ribbing svarar: "Vid midnatt. När han kommer ner till balen. Vi omringar honom - och du skjuter."`
        },
        keywords: ['anckarström', 'anckarstrom', 'kapten']
    },

    lilliehorn: {
        name: 'Carl Pontus Lilliehorn',
        description: 'Yngre officer som ser obekväm ut',
        location: 'pechlin_salon',
        dialogue: {
            overhear: `Lilliehorn säger med svag röst: "Är detta verkligen nödvändigt? Mord... det är inte vad jag gick med på..."

Pechlin svarar kallt: "Det är för sent för tvivel nu, överste."`
        },
        keywords: ['lilliehorn', 'överste']
    },

    gammal_soldat: {
        name: 'Gammal soldat',
        description: 'En veteran med ärrade händer och dimmiga ögon',
        location: 'arbetarkrog',
        dialogue: {
            first: `Den gamle soldaten tittar upp från sitt brännvin.

"Jaaa... en ny ansiktet. Sätt dig, sätt dig. Vill du höra en gammal mans historier?"`,

            topics: {
                'anckarström': `"Anckarström? Pfft! Jag tjänstgjorde med honom! Före detta kapten - avsatt för inkompetens och svek!"

Han spottade.

"Han hatade kungen. Alltid på humör han. 'En dag', sa han, 'en dag ska jag göra vad som måste göras.' Skrämde mig, det kan jag säga!"`,

                'konspiration': `"Konspiration? Hahahaha! Det svärmar av dem i denna stad! Pechlin, Ribbing... alla adliga unggossar vill störta kungen. Men bara en man har mage nog att göra det..."

Han sänker rösten.

"Anckarström. Han är farlig. Ge dig inte i kast med honom."`
            }
        },
        keywords: ['soldat', 'veteran', 'man']
    },

    gustav_iii_dining: {
        name: 'Gustav III',
        description: 'Kungen sitter vid bordet, ser trött ut',
        location: 'drabant_hall',
        dialogue: {
            first: `Kungen tittar upp när du närmar dig.

"Vem är du? Jag känner inte igen er från hovet..."

von Essen reser sig, beskyddande.`,

            warn_with_evidence: `Du lägger fram BEVISEN - pistolanteckningar, Anckarströms lapp, konspirationsdokument.

Kungens ansikte blir allvarligt. Han läser långsamt.

"Detta... detta är allvarligt. von Essen - kalla på Liljensparre omedelbart! Och ni, kära vän..."

Han ser på dig med respekt.

"Ni har kanske räddat mitt liv. Jag ska inte gå ner till balen ikväll. Låt dem vänta förgäves."

<span class="important">DU HAR RÄDDAT KUNGEN!</span>`
        },
        keywords: ['gustav', 'kung', 'kungen', 'majestät']
    },

    von_essen_dining: {
        name: 'Hans Henric von Essen',
        description: 'Kungens trogna följeslagare',
        location: 'drabant_hall',
        dialogue: {
            first: `"Stanna där! Vad är ert ärende?"

von Essen är beskyddande om kungen.`
        },
        keywords: ['essen', 'von essen', 'hovstallmästare']
    },

    lowenhielm_dining: {
        name: 'Gustaf Löwenhielm',
        description: 'Ung kapten vid kungens sida',
        location: 'drabant_hall',
        dialogue: {
            first: `"Ers Majestät, ska jag eskorteta ut denna person?"

Löwenhielm är redo att agera.`
        },
        keywords: ['löwenhielm', 'lowenhielm', 'kapten']
    },

    pollet: {
        name: 'Carl Fredrik Pollet',
        description: 'En kapten på väg att lämna balen',
        location: 'opera_ballroom',
        dialogue: {
            first: `"God kväll. Vilken storartad fest! Jag var just på väg att..."

Han tystnaden när han ser att du ser nervöst dig omkring.

"Är något fel?"`
        },
        keywords: ['pollet', 'kapten']
    },

    gatuförsäljare: {
        name: 'Gatuförsäljare',
        description: 'En kvinna som säljer brända mandlar',
        location: 'drottninggatan',
        dialogue: {
            first: `"Brända mandlar! Färska brända mandlar! Bara en skilling!"

Hon håller upp en strut.

"Vill ni smaka? Bästa i staden!"`,

            buy: `Du köper en strut med brända mandlar. De är söta, krispiga och doftar härligt av karamell.

<span class="narrator">Du äter mandlarna och känner en kort stund av ren lycka mitt i allt kaos.</span>`
        },
        keywords: ['försäljare', 'kvinna', 'mandlar']
    },

    // === MISSING CHARACTERS - AMBIENTE ===

    vaktpost: {
        name: 'Vaktpost',
        description: 'En soldat i kunglig uniform med musköt',
        location: 'norrmalmstorg',
        dialogue: {
            first: `Vaktposten ser strikt på dig.

"God kväll. Håll ordning här på torget. Inga uppror tack!"

Han går vidare på sin patrull.`
        },
        keywords: ['vakt', 'vaktpost', 'soldat', 'guard']
    },

    scenarbetare: {
        name: 'Scenarbetare',
        description: 'En man i arbetskläder med såg och hammare',
        location: 'opera_staff',
        dialogue: {
            first: `Scenarbetaren tittar upp från sitt arbete.

"Hej där! Vi bygger kulisser till nästa föreställning. Fantastiskt arbete, men tungt!"

Han torkar svetten från pannan.`
        },
        keywords: ['arbetare', 'scenarbetare', 'man']
    },

    karolin_1: {
        name: 'Karoliner (veteran)',
        description: 'Gammal soldat från Karl XII:s tid',
        location: 'slottsbacken',
        dialogue: {
            first: `En gammal man med stoltheten i hållningen, trots åren.

"Jag tjänade under Karl XII, vet du. Poltava... hemska tider. Men vi var modiga!"

Han ser ut i fjärran, minns.`
        },
        keywords: ['karoliner', 'veteran', 'soldat', 'karl']
    },

    karolin_2: {
        name: 'Karoliner (tiggare)',
        description: 'Gammal soldat som tigger på backen',
        location: 'slottsbacken',
        dialogue: {
            first: `En trasig veteran sträcker fram handen.

"En skilling, god herre? För en gammal soldat som tjänat kungen..."

Hans ögon är fulla av hopplöshet.`
        },
        keywords: ['karoliner', 'tiggare', 'veteran', 'karl']
    },

    sillgumma: {
        name: 'Sillgumma',
        description: 'Gammal kvinna som säljer inlagd sill',
        location: 'gamla_stan',
        dialogue: {
            first: `"Färsk sill! Inlagd sill! Bästa sillen i stan!"

Den gamla kvinnan ropar högt.

"Köp nu, köp nu! Bara två öre tunnan!"`
        },
        keywords: ['sillgumma', 'gumma', 'kvinna', 'försäljare']
    },

    adelsman_1: {
        name: 'Adelsman i pelskappa',
        description: 'En ung adelsman med peruk och pelskappa',
        location: 'den_gyldene_freden',
        dialogue: {
            first: `En ung adelsman i dyr pelskappa sitter vid bordet.

"God kväll! Vilken kveld för ett glas vin, eller hur?"

Han höjer sitt glas.`
        },
        keywords: ['adelsman', 'adel', 'man', 'pälskappa']
    },

    adelsman_2: {
        name: 'Adelsman vid fönstret',
        description: 'En äldre adelsman med monokel',
        location: 'den_gyldene_freden',
        dialogue: {
            first: `En äldre adelsman betraktar gatan genom sitt monokel.

"Hmm... oroliga tider. Man vet inte vem man kan lita på längre."

Han skakar på huvudet.`
        },
        keywords: ['adelsman', 'adel', 'man', 'monokel']
    },

    tjänare_pechlin: {
        name: 'Pechlins tjänare',
        description: 'En diskret man i svart livré',
        location: 'pechlin_house',
        dialogue: {
            first: `Tjänaren ser dig kallt.

"Vem är ni? Ni borde inte vara här. Generalen tar emot ingen just nu."

<span class="warning">Han ser misstänksam ut.</span>`
        },
        keywords: ['tjänare', 'betjänt', 'man']
    },

    von_essen: {
        name: 'Greve von Essen',
        description: 'Kungens närmaste vän och rådgivare',
        location: 'opera_ballroom',
        dialogue: {
            first: `Greve von Essen står vid kungens sida.

"En underbar kväll! Kungen är i strålande humör!"

Han ler brett.`
        },
        keywords: ['von essen', 'essen', 'greve']
    },

    lowenhielm: {
        name: 'Överste Löwenhielm',
        description: 'Militär och hovman',
        location: 'opera_ballroom',
        dialogue: {
            first: `Överste Löwenhielm står i sin paraduniform.

"En magnifik bal! Men jag håller ögonen öppna. Man kan aldrig vara för försiktig."

Hans hand vilar på sabelgreppet.`
        },
        keywords: ['löwenhielm', 'lowenhielm', 'överste']
    },

    fiskhandlare: {
        name: 'Fiskhandlare',
        description: 'En robust kvinna med fiskdisk',
        location: 'stortorget',
        dialogue: {
            first: `"Färsk fisk! Gädda, abborre, strömming!"

Fiskhandlaren ropar över torget.

"Fångad i morse! Kan inte bli fräschare!"`
        },
        keywords: ['fiskhandlare', 'kvinna', 'försäljare']
    },

    barn: {
        name: 'Barn som leker',
        description: 'En grupp barn som leker runt brunnen',
        location: 'stortorget',
        dialogue: {
            first: `Barnen springer runt brunnen och skrattar.

Ett barn stannar och tittar nyfiket på dig.

"Varför har du så konstiga kläder?"

Sedan springer hen vidare, skrattande.`
        },
        keywords: ['barn', 'unge']
    },

    vaktpatrull: {
        name: 'Vaktpatrull',
        description: 'Två soldater på patrull',
        location: 'blasieholmen',
        dialogue: {
            first: `Två soldater går förbi på patrull.

"God kväll. Håll er till publika områden tack."

De fortsätter sin runda, misstänksamma.`
        },
        keywords: ['vakt', 'patrull', 'soldater']
    },

    operagäst1: {
        name: 'Dame i siden',
        description: 'En elegant dam i blå sidenklänning',
        location: 'opera_foyer',
        dialogue: {
            first: `En elegant dam i sidenklänning viftar med sin solfjäder.

"Åh vilken magnifik kväll! Jag ser fram emot föreställningen!"

Hon pratar med sin följeslagare.`
        },
        keywords: ['dam', 'kvinna', 'gäst', 'operagäst']
    },

    operagäst2: {
        name: 'Herre med käpp',
        description: 'En äldre herre med promenadkäpp',
        location: 'opera_foyer',
        dialogue: {
            first: `En äldre herre lutar sig mot sin käpp.

"Jag har sett alla stora operor här. Mozart, Gluck... Mästerliga!"

Han ser nostalgisk ut.`
        },
        keywords: ['herre', 'man', 'gäst', 'operagäst']
    },

    slottsvakt: {
        name: 'Slottsvakt',
        description: 'Kunglig garde i paraduniform',
        location: 'slott_courtyard',
        dialogue: {
            first: `Vakten står stram i sin paraduniform.

"Halt! Vem går där? Vad är ert ärende vid slottet?"

Hans hand vilar på sabelgreppet.`
        },
        keywords: ['vakt', 'slottsvakt', 'garde', 'soldat']
    },

    hovmarskalk: {
        name: 'Hovmarskalk',
        description: 'Hovfunktionär i guldmedalj',
        location: 'slott_hall',
        dialogue: {
            first: `Hovmarskalken ser formellt på dig.

"God dag. Har ni audiens bokad? Nej? Då kan jag tyvärr inte släppa in er."

Han är högtravande men korrekt.`
        },
        keywords: ['hovmarskalk', 'marskalk', 'hovman']
    },

    snickare: {
        name: 'Snickare',
        description: 'Hantverkare med verktyg',
        location: 'klarakvarter',
        dialogue: {
            first: `En snickare arbetar på en bänk utanför sin verkstad.

"God dag! Behöver ni något snickrat? Möbler, dörrar, fönster?"

Han håller upp en välgjord stol.`
        },
        keywords: ['snickare', 'hantverkare', 'man']
    },

    piga: {
        name: 'Piga med tvättkorg',
        description: 'Ung tjänsteflicka med tvättkorg',
        location: 'klarakvarter',
        dialogue: {
            first: `En ung piga bär en tung tvättkorg.

"Ursäkta, får jag komma förbi?"

Hon ser trött men vänlig ut.`
        },
        keywords: ['piga', 'tjänsteflicka', 'flicka']
    },

    arbetare: {
        name: 'Hamnarbetare',
        description: 'Robust man med ärrade händer',
        location: 'arbetarkrog',
        dialogue: {
            first: `En robust hamnarbetare dricker brännvin.

"Hårt jobb vid hamnen. Men någon måste göra det."

Han skrattar bittert.

"Adeln vet inte hur vanligt folk lever."`
        },
        keywords: ['arbetare', 'hamnarbetare', 'man']
    }
};

Object.assign(Characters, NewCharacters);

// ==========================================
// TIME SYSTEM - EXPANSION
// ==========================================

const TimeSystem = {
    advanceTime: function(minutes) {
        Game.currentTime.minute += minutes;

        if (Game.currentTime.minute >= 60) {
            Game.currentTime.hour += Math.floor(Game.currentTime.minute / 60);
            Game.currentTime.minute = Game.currentTime.minute % 60;
        }

        if (Game.currentTime.hour >= 24) {
            Game.currentTime.day++;
            Game.currentTime.hour = Game.currentTime.hour % 24;

            // Check chapter progression
            this.checkChapterChange();
        }

        // Update display
        this.updateTimeDisplay();

        // Check for time-based events
        this.checkTimeEvents();
    },

    checkChapterChange: function() {
        if (Game.currentTime.day === 15 && Game.player.stats.chapter === 1) {
            // Move to Chapter 2
            Game.player.stats.chapter = 2;
            document.getElementById('chapter-title').textContent = 'KAPITEL 2: UTREDNINGEN';
            GameEngine.output(`<div class="important">─── KAPITEL 2: UTREDNINGEN ───</div>`);
            GameEngine.output(`<div class="narrator">En ny dag gryr. Du har samlat ledtrådar, men tid den rinner ut. Imorgon kväll sker mordet...</div>`);
            GameEngine.unlockAchievement('detective');
            GameEngine.updateProgress(15);
        }

        if (Game.currentTime.day === 16 && Game.player.stats.chapter === 2) {
            // Move to Chapter 3
            Game.player.stats.chapter = 3;
            document.getElementById('chapter-title').textContent = 'KAPITEL 3: MASKERADBALEN';
            GameEngine.output(`<div class="important">─── KAPITEL 3: MASKERADBALEN ───</div>`);
            GameEngine.output(`<div class="narrator">Det är den 16 mars 1792. Idag sker mordet. Du har en sista chans att rädda kungen - eller se historien upprepas...</div>`);
            GameEngine.updateProgress(20);
        }
    },

    updateTimeDisplay: function() {
        const days = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '14', '15', '16'];
        const dayName = days[Game.currentTime.day] || '??';
        const hour = String(Game.currentTime.hour).padStart(2, '0');
        const minute = String(Game.currentTime.minute).padStart(2, '0');

        document.getElementById('date-time').textContent = `${dayName} mars 1792, kl ${hour}:${minute}`;
    },

    checkTimeEvents: function() {
        // Assassination is at 23:45 on March 16
        if (Game.currentTime.day === 16 && Game.currentTime.hour === 23 && Game.currentTime.minute >= 30) {
            if (!Game.player.questProgress.savedKing) {
                // Move player to ballroom if not already there
                if (Game.player.currentRoom !== 'opera_ballroom') {
                    GameEngine.output(`<div class="warning">Du hör skrik från operasalongen! Det händer NU!</div>`);
                    setTimeout(() => {
                        Game.player.currentRoom = 'opera_ballroom';
                        GameEngine.showRoom('opera_ballroom');
                    }, 2000);
                }
            }
        }
    },

    getTimeDescription: function() {
        const hour = Game.currentTime.hour;

        if (hour >= 5 && hour < 9) return "tidigt på morgonen";
        if (hour >= 9 && hour < 12) return "på förmiddagen";
        if (hour >= 12 && hour < 14) return "mitt på dagen";
        if (hour >= 14 && hour < 17) return "på eftermiddagen";
        if (hour >= 17 && hour < 20) return "på kvällen";
        if (hour >= 20 && hour < 23) return "sent på kvällen";
        return "på natten";
    },

    sleep: function() {
        // Advance to next morning
        Game.currentTime.day++;
        Game.currentTime.hour = 8;
        Game.currentTime.minute = 0;

        this.updateTimeDisplay();
        this.checkChapterChange();

        return `Du hittar ett rum att sova i. Natten är lång och drömmar är oroliga - du ser masker och pistoler i sömnen.

När du vaknar är det morgon. En ny dag. En dag närmare katastrofen...`;
    }
};

// Export for use
window.TimeSystem = TimeSystem;
window.NewRooms = NewRooms;
window.NewItems = NewItems;
window.NewCharacters = NewCharacters;
