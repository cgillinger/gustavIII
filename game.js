// ==========================================
// GAME STATE AND CONFIGURATION
// ==========================================

const Game = {
    player: {
        name: '',
        currentRoom: 'norrmalmstorg',
        inventory: [],
        hasModernClothes: true,
        hasPeriodClothes: false,
        knowledge: [], // Things the player has learned
        questProgress: {
            foundClothes: false,
            metAdelcrantz: false,
            learnedAboutConspiracy: false,
            foundPistolsmith: false,
            gotTicket: false,
            identifiedAnckarstrom: false,
            savedKing: false
        },
        stats: {
            chapter: 1,
            progress: 0, // 0-100
            achievements: [],
            hintsUsed: 0
        }
    },
    currentTime: {
        day: 14, // March 14, 1792
        hour: 16,
        minute: 30
    },
    flags: {
        gameStarted: false,
        firstMove: true,
        onboardingStep: 0,
        showedHelp: false
    }
};

// ==========================================
// ACHIEVEMENTS AND MILESTONES
// ==========================================

const Achievements = {
    'first_steps': {
        name: 'Första stegen',
        description: 'Du har anlänt till 1792',
        icon: '🚶'
    },
    'blend_in': {
        name: 'Kamouflage',
        description: 'Du smälter in i mängden',
        icon: '🎭'
    },
    'detective': {
        name: 'Detektiv',
        description: 'Du har börjat samla ledtrådar',
        icon: '🔍'
    },
    'conspirator_found': {
        name: 'Konspiratören',
        description: 'Du har identifierat en av sammansvurna',
        icon: '🎯'
    },
    'access_granted': {
        name: 'Inträde beviljat',
        description: 'Du har tillgång till maskeradbalen',
        icon: '🎫'
    },
    'king_saved': {
        name: 'Hjälten',
        description: 'Du räddade Gustav III',
        icon: '👑'
    }
};

// ==========================================
// ROOMS AND LOCATIONS
// ==========================================

const Rooms = {
    norrmalmstorg: {
        name: 'Norrmalmstorg',
        chapter: 1,
        firstVisit: `Du står mitt på Norrmalmstorg och världen snurrar fortfarande. Kylan biter hårt - en marsafton 1792 är kyligare än något du upplevt förut.

Framför dig reser sig <span class="important">Kungliga Operahuset</span> med sin gula fasad och höga kolonner. Ljus flimrar genom fönstren. Det är vackert, men... annorlunda. Mindre än du minns det.

Runt dig strömmar människor i trekantiga hattar och långa kappor. Två män i peruker stannar upp och stirrar på dig. En kvinna i vid kjol pekar och viskar till sin följeslagare.

Du tittar ner. Dina jeans. Din hoodie. Din smartphone (död men fortfarande futuristisk).

<span class="warning">Du sticker ut som en fackla i mörkret.</span>`,

        description: `Norrmalmstorg breder ut sig framför dig - en öppen plats med kullersten som glimmar av smältande snö.

Den <span class="important">Kungliga Operan</span> dominerar norra sidan av torget med sin ståtliga fasad. Varmt ljus strömmar från dess fönster, och du hör dova toner av musik inifrån.

Mitt emot operan står <span class="important">Arvfurstens palats</span> med sin speglade arkitektur. Söderut leder <span class="important">Norrbro</span> mot det Kungliga slottet som tronar massivt i kvällsljuset.

Människor rör sig över torget - betjänter, adelsmän, soldater. Hästdroskorna rullar över stenarna med ett välbekant skrammel. Luften är fylld av vedeldning, hästspillning och något mer... honung? Vax från ljusen.`,

        exits: {
            'in': 'opera_entrance',
            'syd': 'norrbro',
            'öster': 'kungstradgarden',
            'väster': 'fredsgatan'
        },
        items: ['affisch', 'snö'],
        characters: ['vaktpost'],
        visited: false
    },

    opera_entrance: {
        name: 'Operans entré',
        chapter: 1,
        description: `Du står i entrén till Kungliga Operan. Höga tak med förgyllda ornament sträcker sig ovanför dig. Ljus från kristallkronor kastar dansande skuggor.

En <span class="important">portier</span> i röd livré står vid dörrarna och ser misstänksamt på dig. Bakom honom skymtar du en magnifik trappa som leder uppåt till salongerna.

Till vänster finns en dörr med skylten "Personal". En smal korridor leder åt höger - därifrån hörs röster och skrammel från köket.

Lukten här är intensiv - parfym, puder och en underliggande doft av talg från ljusen.`,

        exits: {
            'ut': 'norrmalmstorg',
            'upp': 'opera_foyer',
            'höger': 'opera_corridor',
            'vänster': 'opera_staff'
        },
        items: ['affisch', 'ljuskrona'],
        characters: ['portier'],
        visited: false,
        locked: false // Can be locked if player looks too modern
    },

    opera_staff: {
        name: 'Personalkorridoren',
        chapter: 1,
        description: `En smal korridor med knarrande trägolv. Väggarna är nakna och enkla - en skarp kontrast mot prakten i huvudentrén.

Du hör röster från ett rum längre fram. En dörr till vänster står på glänt och du ser ett litet omklädningsrum där kostymer hänger.

En äldre man med målarfärgade händer kommer gående med en låda full av penslar. Han ser dig och nickar.`,

        exits: {
            'höger': 'opera_entrance',
            'fram': 'opera_workshop',
            'in': 'costume_room'
        },
        items: [],
        characters: ['scenarbetare'],
        visited: false
    },

    costume_room: {
        name: 'Omklädningsrummet',
        chapter: 1,
        description: `Ett litet rum fyllt med kostymer från otaliga operaföreställningar. Sidenkappor, sammetsdräkter, perukställ och masker hänger på krokar längs väggarna.

En stor spegel med förgylld ram står i hörnet. Bredvid den ligger en <span class="important">komplett mansklädsel</span> - en pastellblå sidenrock, broderad väst, knäbyxor, vita strumpor och en svart trekantig hatt.

Det luktar mögel och gammalt tyg här, men också något ljuvare - lavendel från pudret som står på sminkbordet.`,

        exits: {
            'ut': 'opera_staff'
        },
        items: ['period_clothes', 'peruk', 'mask', 'spegel'],
        characters: [],
        visited: false
    },

    norrbro: {
        name: 'Norrbro',
        chapter: 1,
        description: `Du står på den breda stenbron som förbinder Norrmalm med Gamla stan. Under dig brus Norrström med isflak som driver i det mörka vattnet.

<span class="important">Stockholms slott</span> reser sig framför dig söderut - en massiv byggnad i gult och vitt, nyligen färdigställd och praktfull. Du kan se facklor som brinner vid entrén.

Norr ut leder bron tillbaka till Norrmalmstorg och Operan. Östräcket är dekorerat med ornamentala stenar, och du ser ut över vattnet mot Skeppsholmen.

Vinden är bitande här. Du drar kappan (eller hoodien) tätare omkring dig.`,

        exits: {
            'norr': 'norrmalmstorg',
            'syd': 'slottsbacken'
        },
        items: ['räcke'],
        characters: [],
        visited: false
    },

    slottsbacken: {
        name: 'Slottsbacken',
        chapter: 1,
        description: `Den breda gatan som leder upp till slottets huvudportal. Höga facklor brinner längs vägen och kastar ett orange sken över de höga stenväggarna.

Två <span class="important">karoliner</span> i blå uniformer med höga hattar står vakt vid porten. De håller musköter med bajonetter och ser strängt på alla som närmar sig.

Väster ut leder en gränd ner mot Gamla stan. Norr ut ligger Norrbro och vägen tillbaka till Norrmalm.`,

        exits: {
            'norr': 'norrbro',
            'väster': 'gamla_stan',
            'in': 'slott_courtyard'
        },
        items: [],
        characters: ['karolin_1', 'karolin_2'],
        visited: false
    },

    gamla_stan: {
        name: 'Stora Nygatan, Gamla stan',
        chapter: 1,
        description: `Trånga gränder slingrar sig mellan höga hus med lutande fasader. Här är mörkare än på torgen - bara enstaka lyktor flämtar på husfasaderna.

Du hör röster och skratt från en krog längre fram. En skylt gungar i vinden: <span class="important">"Den Gyldene Freden"</span>.

Luften här är tung av rök, osthållning och människovärme. En kvinna med en korg ropar ut sin sill till försäljning vid ett gathörn.`,

        exits: {
            'öster': 'slottsbacken',
            'in': 'den_gyldene_freden',
            'norr': 'stortorget'
        },
        items: [],
        characters: ['sillgumma'],
        visited: false
    },

    den_gyldene_freden: {
        name: 'Den Gyldene Freden',
        chapter: 1,
        description: `Du kliver in i en rökig, varm kroglokal. Låga tak med synliga bjälkar. Långa träbord där män och kvinnor sitter tätt. Ljuset från talgljus på väggarna fladdrar över ansikten och ölstop.

En doft av öl, svett, tobaksrök och stekt kött. I hörnet spelar någon på en fiol - en melankolisk melodi.

Bakom den grova bardisken står <span class="important">krogvärden</span>, en kraftig man med uppsträmmade skjortärmar. Han torkar glas och observerar gästerna.

Vid ett bord i hörnet sitter en grupp adelsmän och viskar intensivt. En av dem - en äldre man med kraftig peruk - tittar upp när du kommer in.`,

        exits: {
            'ut': 'gamla_stan'
        },
        items: ['ölstop', 'meny'],
        characters: ['krogvärden', 'bellman', 'adelsman_1', 'adelsman_2'],
        visited: false
    },

    kungstradgarden: {
        name: 'Kungsträdgården',
        chapter: 1,
        description: `Den kungliga trädgården sträcker sig österut från torget. Träd med kala grenar svajar i vinden. Gångar av grus knakar under dina fötter.

Några bänkar står tomma i kvällskylan. I fjärran ser du Jacobs kyrkas silhuett.

Det är fridfullt här, nästan ödsligt. En plats att tänka.`,

        exits: {
            'väster': 'norrmalmstorg'
        },
        items: ['bänk'],
        characters: [],
        visited: false
    },

    // Day 2 & 3 locations (unlocked as story progresses)

    pechlin_house: {
        name: 'Pechlins hus på Blasieholmen',
        chapter: 2,
        description: `Ett praktfullt palats med hög portal. Du står utanför och ser ljus i fönstren på andra våningen.

Genom ett fönster skymtar du silhuetter av män som gestikulerar häftigt. Röster hörs dämpat genom glaset.

Huvuddörren är låst, men en sidoingång står på glänt...`,

        exits: {
            'söder': 'fredsgatan',
            'in': 'pechlin_hall'
        },
        items: [],
        characters: ['tjänare'],
        visited: false,
        locked: true,
        unlockCondition: 'chapter2'
    },

    opera_ballroom: {
        name: 'Operasalongen - Maskeradbalen',
        chapter: 3,
        description: `Hjärtat av händelsernas centrum. Operasalongen är fylld med hundratals människor i masker och utklädnader.

Orkestern spelar en livlig kontradans. Par virvlar över parkettgolvet. Ljuskronorna ovan glittrar med tusentals levande ljus som kastar ett magiskt sken.

Luften är tung - parfym, svett, vax. Det är hett. Det är trångt.

Du ser <span class="important">kungen</span> - lätt att känna igen trots masken på grund av ordensstjärnorna på bröstet. Han pratar med <span class="important">von Essen</span> vid scenen.

Flera män i <span class="important">svarta kappor och vita masker</span> rör sig genom folkmassan. De verkar... samordnade.`,

        exits: {
            'ut': 'opera_foyer'
        },
        items: [],
        characters: ['gustav_iii', 'von_essen', 'anckarstrom', 'ribbing', 'horn', 'lowenhielm'],
        visited: false,
        unlockCondition: 'chapter3'
    }
};

// ==========================================
// ITEMS
// ==========================================

const Items = {
    period_clothes: {
        name: 'tidsenliga kläder',
        description: 'En komplett mansklädsel från 1700-talet: pastellblå sidenrock med broderade ärmar, en randig väst i guld och vitt, knäbyxor av sammet, vita silkesstrumpor och en svart trekantig hatt. Kläderna luktar lavendel och lite mögel.',
        takeable: true,
        useable: true,
        use: function() {
            if (Game.player.hasModernClothes) {
                return `Du byter om med fumliga händer. Kläderna är åtsittande och obekväma - korsettliknande väst, tajta knäbyxor, strumpor som glider ner.

Men när du ser dig i spegeln... du skulle kunna vara en adelsman från 1792.

<span class="important">Nu kan du röra dig fritt utan att väcka uppmärksamhet.</span>`;
            }
        },
        keywords: ['kläder', 'klädsel', 'dräkt', 'kostym']
    },

    mask: {
        name: 'vit mask',
        description: 'En elegant venetiansk mask i vitt porslin. Den täcker ögon och näsa, hålls fast med svarta sidenband.',
        takeable: true,
        useable: true,
        keywords: ['mask', 'ansiktsmask']
    },

    ticket: {
        name: 'biljett till maskeradbalen',
        description: 'En präglad biljett med Gustav III:s monogram. "Maskeradbal, 16 mars 1792, kl 22:00"',
        takeable: true,
        useable: false,
        keywords: ['biljett', 'inträdesbiljett']
    },

    warning_letter: {
        name: 'varningsbrev',
        description: 'Ett brev på franskt papper. "Sire, Hotet är verkligt. Mörkrets maskerade mördare samlas ikväll..."',
        takeable: true,
        useable: true,
        keywords: ['brev', 'varning', 'varningsbrev']
    },

    pistol_evidence: {
        name: 'bevis om pistolerna',
        description: 'En lapp med pistolsmedens anteckningar: "Reparerat 2 st pistoler för Kapten J.J. Anckarström, Upplandsgatan 12"',
        takeable: true,
        useable: false,
        keywords: ['bevis', 'lapp', 'anteckning']
    },

    affisch: {
        name: 'affisch',
        description: 'En teatertryckt affisch: "Kungliga Operan presenterar MASKERADBAL - 16 mars 1792. Allmänheten välkommen."',
        takeable: false,
        useable: false,
        keywords: ['affisch', 'skylt']
    }
};

// ==========================================
// CHARACTERS
// ==========================================

const Characters = {
    adelcrantz: {
        name: 'Carl Fredrik Adelcrantz',
        description: 'Operans arkitekt, en äldre man med vänliga ögon och smink på fingrarna',
        location: 'opera_workshop',
        dialogue: {
            first: `Den äldre mannen tittar nyfiket på dig.

"Välkommen, unge vän. Du ser... lite vilsen ut. Och dina kläder... är de från något teater experiment?"

Han ler vänligt. "Jag är Carl Fredrik Adelcrantz, arkitekt. Jag ritade detta hus faktiskt. Vad kan jag hjälpa dig med?"`,

            after_clothes: `"Ah, mycket bättre! Nu ser du ut som en riktig hovman. Vad har du för ärende här vid operan?"`,

            topics: {
                'konspiration': `Adelcrantz sänker rösten. "Jag har hört rykten... Vissa adelsmän är mycket missnöjda med Hans Majestät. Men man pratar inte öppet om sådant. Försök krogar na i Gamla stan - där flyter tungor lättare med brännvin i blodet."`,

                'biljett': `"Du vill ha biljett till maskeradbalen? Den är öppen för allmänheten, men det kostar. Eller..." han blinkar, "...om du gör mig en tjänst kan jag ordna det. Jag behöver hjälp med att hämta färg från kemisten på Drottninggatan."`,

                'kungen': `"Gustav III är en märklig man. Briljant, ja, men han har gjort sig många fiender. Jag hoppas han är försiktig..."`,
            }
        },
        keywords: ['adelcrantz', 'arkitekt', 'man']
    },

    portier: {
        name: 'Portiern',
        description: 'En sträng man i röd livré som bevakar operans entré',
        location: 'opera_entrance',
        dialogue: {
            first_modern_clothes: `Portiern höjer handen.

"STOPP! Vad i herrens namn har ni för klädsel? Detta är Kungliga Operan, inte någon gatucirkus! Jag kan inte släppa in er så där."

<span class="warning">Du behöver tidsenliga kläder för att komma vidare.</span>`,

            first_period_clothes: `Portiern nickar godkännande.

"Goddag, min herre. Välkommen till Kungliga Operan. Har ni ärende här?"`,

            topics: {
                'maskeradbal': `"Maskeradbalen äger rum den 16:e mars. Det är öppet för alla som kan betala, men man måste ha biljett. Tala med administrationen."`,

                'kungen': `"Hans Majestät besöker ofta operan. Det är hans stolthet och glädje. Men mellan oss sagt... jag har sett skumma figurer smyga omkring på sistone."`
            }
        },
        keywords: ['portier', 'portvakt', 'dörrvakt']
    },

    bellman: {
        name: 'Carl Michael Bellman',
        description: 'Den berömde skalden och trubaduren, något berusad vid ett bord',
        location: 'den_gyldene_freden',
        dialogue: {
            first: `En man med rufsigt hår och rödsprängda ögon höjer sitt ölstop mot dig.

"En ny besökare i Freden! Sätt dig, sätt dig! Jag är Bellman, om du inte känner igen den störste skalden i riket!"

Han skrattar och tar en djup klunk.

"Vad för vin skall du dricka i afton? Eller kanske brännvin? Det är det enda som håller värmen här i detta förbannade mars."`,

            topics: {
                'konspiration': `Bellman lutar sig närmare och viskar, spottande lätt:

"Konspiratör? Kära du, detta stad SVÄMMAR av konspirationer. Men jag har hört att general Pechlin håller sammankomster... på Blasieholmen. Adliga herrar som talar för lågt och dricker för lite. Inget för mig!"

Han skrattar.`,

                'pechlin': `"Pechlin? En gammal gubbe med stora ambitioner. Han bor på Blasieholmen i ett fint palats. De säger att han vill störta kungen, men vem tror på gamla mäns drömmar?"`,

                'sång': `Bellman slår i bordet och börjar sjunga med skrovlig röst:

"Mandom, mod, bröder, så svinge glas,
upp från vårt lag det hastigt bedjas,
I alla rum, mot tak och vas,
hurra för kung...!"

Han tystnar plötsligt och ser allvarlig ut.

"Hurra för kungen... om han lever till påsk."`
            }
        },
        keywords: ['bellman', 'skald', 'man', 'sångare']
    },

    krogvärden: {
        name: 'Krogvärden',
        description: 'En robust man med uppsträmmade ärmar',
        location: 'den_gyldene_freden',
        dialogue: {
            first: `Krogvärden ser upp från sitt glas.

"Välkommen till Den Gyldene Freden! Vad får det lov att vara? Öl, brännvin, eller något att äta?"`,

            topics: {
                'mat': `"Vi har ärtsoppa med fläsk, stekt sill med rotfrukter, eller om ni vill vara fin - en liten stek. Allt serverat med mörkt bröd och smör. Två skilling."`,

                'dryck': `"Öl har vi alltid. Brännvin också - kryddat med kummin. Och för den ädle kunden har jag arrakspunsch från ostindien!"`,

                'adelsmän': `Krogvärden tittar mot hörnet där adelsmännen sitter.

"De där? De har varit här varje kväll den senaste veckan. Pratar lågt. Beställer lite. Jag gillar dem inte - de är dåliga för affärerna."

Han sänker rösten.

"Men jag hörde ett namn... Anckarström. En före detta kapten, bitter som malört."`
            }
        },
        keywords: ['krogvärd', 'värd', 'bartender']
    },

    gustav_iii: {
        name: 'Kung Gustav III',
        description: 'Sveriges kung, 46 år, klädd i svart domino med synliga ordensstjärnor',
        location: 'opera_ballroom',
        dialogue: {
            first: `Kungen vänder sig mot dig. Bakom den svarta masken ser du hans intelligenta ögon.

"God afton. En ny ansiktet på balen? Utmärkt - jag älskar mysterium."

Hans röst är kulturerad, nästan teatralisk.`,

            warn_danger: `Du samlar ditt mod och böjer dig ner.

"Ers Majestät... jag måste varna er. Det finns de som vill er illa ikväll. De svarta kapporna... Anckarström..."

Kungens ansikte mörknar.

"Tror du jag inte vet? Jag fick ett brev. Men jag är inte rädd för fega mördare."

Han vänder sig bort.

<span class="warning">Du måste hitta ett bättre sätt att övertyga honom - eller stoppa Anckarström själv.</span>`
        },
        keywords: ['kung', 'gustav', 'majestät', 'kungen']
    },

    anckarstrom: {
        name: 'Jacob Johan Anckarström',
        description: 'En man i svart kappa och vit mask, ögon fulla av hat',
        location: 'opera_ballroom',
        dialogue: {
            first: `Mannen i den svarta kappan vänder sig plötsligt mot dig. Hans ögon bakom masken är kalla.

"Vad vill du?"

Hans hand vilar på något under kappan. En pistol?`,

            confront: `"Du vet inte vad du talar om. Jag är en lojal svensk medborgare."

Men hans hand darrar. Han är nervös.

Om du har BEVIS kan du kanske stoppa honom...`
        },
        keywords: ['anckarström', 'anckarstrom', 'man', 'svart kappa']
    }
};

// ==========================================
// HINTS SYSTEM
// ==========================================

const Hints = {
    getHint: function() {
        const room = Game.player.currentRoom;
        const quest = Game.player.questProgress;

        // Context-sensitive hints based on progress
        if (!quest.foundClothes && room === 'norrmalmstorg') {
            return "💡 Du sticker ut i dina moderna kläder. Kanske finns det någonstans i Operan där du kan hitta tidsenliga kläder? Prova att gå IN i operan och UTFORSKA.";
        }

        if (!quest.foundClothes && room === 'opera_entrance') {
            return "💡 Portiern verkar inte vilja släppa in dig. Finns det en annan väg in? Kanske genom PERSONALEN?";
        }

        if (!quest.foundClothes && room === 'opera_staff') {
            return "💡 Ett omklädningsrum brukar ha kostymer. Prova att gå IN.";
        }

        if (!quest.foundClothes && room === 'costume_room') {
            return "💡 UNDERSÖK KLÄDERNA och sedan TA dem. Använd sedan ANVÄND KLÄDER eller BYT OM.";
        }

        if (quest.foundClothes && !quest.learnedAboutConspiracy) {
            return "💡 Nu när du smälter in kan du börja samla information. Krogar är bra platser för skvaller. Gå till GAMLA STAN och besök DEN GYLDENE FREDEN.";
        }

        if (quest.learnedAboutConspiracy && !quest.foundPistolsmith) {
            return "💡 Du vet att Anckarström finns, men inte var. Kanske kan du hitta honom genom hans vapen? Försök hitta en pistolsmed i staden.";
        }

        if (!quest.gotTicket) {
            return "💡 Du behöver en biljett till maskeradbalen. Prata med ADELCRANTZ på operan om hur du kan få en.";
        }

        if (room === 'opera_ballroom' && !quest.identifiedAnckarstrom) {
            return "💡 Leta efter en man i SVART KAPPA. Det finns flera, men Anckarström har nervösa, hatfyllda ögon. UNDERSÖK personerna noga.";
        }

        return "💡 TITTA för att undersöka rummet noga. PRATA MED människor för information. Använd INVENTARIE för att se vad du har.";
    }
};

// ==========================================
// GAME ENGINE - PARSER
// ==========================================

const Parser = {
    // Synonym mappings
    synonyms: {
        'titta': ['se', 'kolla', 'observera', 'betrakta', 'granska'],
        'gå': ['rör', 'promenera', 'vandra', 'ta sig'],
        'ta': ['plocka', 'lyft', 'hämta', 'samla'],
        'undersök': ['inspektera', 'utforska', 'analysera', 'studera', 'kolla på'],
        'prata': ['tala', 'samtala', 'konversera', 'diskutera', 'snacka'],
        'använd': ['bruk', 'nyttja', 'aktivera'],
        'öppna': ['lås upp', 'bryt upp'],
        'norr': ['n'],
        'söder': ['s', 'syd'],
        'öster': ['ö', 'öst'],
        'väster': ['v', 'väst']
    },

    normalize: function(word) {
        word = word.toLowerCase().trim();

        // Check synonyms
        for (let [key, syns] of Object.entries(this.synonyms)) {
            if (syns.includes(word)) return key;
        }

        return word;
    },

    parse: function(input) {
        input = input.toLowerCase().trim();

        // Remove filler words
        input = input.replace(/\b(ett|en|på|åt|mot|vid|till)\b/g, '').trim();

        const words = input.split(/\s+/).map(w => this.normalize(w));

        return {
            verb: words[0] || '',
            object: words.slice(1).join(' ') || '',
            raw: input,
            words: words
        };
    }
};

// ==========================================
// GAME ENGINE - CORE FUNCTIONS
// ==========================================

const GameEngine = {
    output: function(text, className = '') {
        const output = document.getElementById('output');
        const p = document.createElement('p');
        if (className) p.className = className;
        p.innerHTML = text;
        output.appendChild(p);
        output.scrollTop = output.scrollHeight;
    },

    clearOutput: function() {
        document.getElementById('output').innerHTML = '';
    },

    showRoom: function(roomId, isFirstVisit = false) {
        const room = Rooms[roomId];
        if (!room) return;

        // Update room state
        const wasFirstVisit = !room.visited;
        room.visited = true;

        this.clearOutput();

        // Show location name
        this.output(`<div class="location-name">${room.name}</div>`);

        // Show appropriate description
        if (wasFirstVisit && room.firstVisit) {
            this.output(`<div class="description">${room.firstVisit}</div>`);
        } else {
            this.output(`<div class="description">${room.description}</div>`);
        }

        // Show exits
        const exitList = Object.keys(room.exits).join(', ');
        this.output(`<div class="exits">Utgångar: ${exitList}</div>`);

        // Update suggestions
        this.updateSuggestions(room);

        // Check for onboarding
        if (Game.flags.firstMove) {
            Game.flags.firstMove = false;
            setTimeout(() => {
                this.output(`<div class="narrator"><em>Tips: Skriv "titta omkring" för att undersöka platsen noggrannare, eller "hjälp" för fler kommandon.</em></div>`);
            }, 2000);
        }
    },

    updateSuggestions: function(room) {
        const container = document.getElementById('command-suggestions');
        container.innerHTML = '';

        const suggestions = ['titta omkring'];

        // Add direction suggestions
        if (room.exits) {
            Object.keys(room.exits).forEach(dir => {
                suggestions.push(`gå ${dir}`);
            });
        }

        // Add character interaction
        if (room.characters && room.characters.length > 0) {
            const firstChar = Characters[room.characters[0]];
            if (firstChar && firstChar.name) {
                suggestions.push(`prata med ${firstChar.name.split(' ')[0].toLowerCase()}`);
            }
        }

        suggestions.forEach(sug => {
            const span = document.createElement('span');
            span.className = 'suggestion';
            span.textContent = sug;
            span.onclick = () => {
                document.getElementById('command-input').value = sug;
                GameEngine.processCommand(sug);
            };
            container.appendChild(span);
        });
    },

    processCommand: function(input) {
        if (!input.trim()) return;

        // Echo command
        this.output(`<div class="command-echo">&gt; ${input}</div>`);

        const parsed = Parser.parse(input);
        const verb = parsed.verb;
        const obj = parsed.object;

        // Command handlers
        switch(verb) {
            case 'titta':
                this.cmdLook(obj);
                break;
            case 'gå':
                this.cmdGo(obj);
                break;
            case 'ta':
                this.cmdTake(obj);
                break;
            case 'undersök':
                this.cmdExamine(obj);
                break;
            case 'prata':
                this.cmdTalk(obj);
                break;
            case 'använd':
                this.cmdUse(obj);
                break;
            case 'inventarie':
            case 'inventory':
            case 'i':
                this.cmdInventory();
                break;
            case 'hjälp':
            case 'help':
                this.showHelp();
                break;
            default:
                this.output("Jag förstår inte det kommandot. Skriv 'hjälp' för en lista över kommandon.");
        }

        // Auto-save after each command
        this.autoSave();
    },

    cmdLook: function(target) {
        const room = Rooms[Game.player.currentRoom];

        if (!target || target === 'omkring' || target === 'runt') {
            // Look around room
            this.showRoom(Game.player.currentRoom);
            return;
        }

        // Look at specific thing
        this.cmdExamine(target);
    },

    cmdGo: function(direction) {
        const room = Rooms[Game.player.currentRoom];

        if (!direction) {
            this.output("Gå vart? (t.ex. 'gå norr' eller 'gå in')");
            return;
        }

        // Check exits
        if (room.exits && room.exits[direction]) {
            const nextRoom = room.exits[direction];

            // Check if player can enter (clothing check)
            // NOTE: Better message now handled in bugfixes-batch5.js cmdMove hook
            if (nextRoom === 'opera_foyer' && Game.player.hasModernClothes !== false) {
                // Defer to bugfixes-batch5.js for better porter dialogue
                return;
            }

            // Move to new room
            Game.player.currentRoom = nextRoom;
            this.showRoom(nextRoom);

            // Check for achievements
            if (nextRoom === 'costume_room' && !Game.player.questProgress.foundClothes) {
                // Player found the costume room!
            }

        } else {
            this.output("Du kan inte gå åt det hållet.");
        }
    },

    cmdTake: function(itemName) {
        if (!itemName) {
            this.output("Ta vad?");
            return;
        }

        const room = Rooms[Game.player.currentRoom];

        // Find item in room
        let foundItem = null;
        if (room.items) {
            for (let itemId of room.items) {
                const item = Items[itemId];
                if (item && item.keywords.some(k => itemName.includes(k))) {
                    foundItem = { id: itemId, item: item };
                    break;
                }
            }
        }

        if (!foundItem) {
            this.output("Jag ser inget sådant här.");
            return;
        }

        if (!foundItem.item.takeable) {
            this.output(`Du kan inte ta ${foundItem.item.name}.`);
            return;
        }

        // Add to inventory
        Game.player.inventory.push(foundItem.id);

        // Remove from room
        room.items = room.items.filter(i => i !== foundItem.id);

        this.output(`Du tog ${foundItem.item.name}.`);

        // Special handling for clothes - subtle hint
        if (foundItem.id === 'period_clothes') {
            this.output(`<div class="narrator">Kläderna känns fina i handen - sidenrocken är mjuk och västen är vackert broderad. Du skulle kunna byta om här.</div>`);
        }
    },

    cmdExamine: function(target) {
        if (!target) {
            this.output("Undersök vad?");
            return;
        }

        // Check inventory first
        for (let itemId of Game.player.inventory) {
            const item = Items[itemId];
            if (item && item.keywords.some(k => target.includes(k))) {
                this.output(item.description);
                return;
            }
        }

        // Check room items
        const room = Rooms[Game.player.currentRoom];
        if (room.items) {
            for (let itemId of room.items) {
                const item = Items[itemId];
                if (item && item.keywords.some(k => target.includes(k))) {
                    this.output(item.description);
                    return;
                }
            }
        }

        // Check characters
        if (room.characters) {
            for (let charId of room.characters) {
                const char = Characters[charId];
                if (char && char.keywords.some(k => target.includes(k))) {
                    this.output(char.description);
                    return;
                }
            }
        }

        this.output("Jag ser inget sådant här.");
    },

    cmdTalk: function(target) {
        if (!target) {
            this.output("Prata med vem?");
            return;
        }

        const room = Rooms[Game.player.currentRoom];

        if (!room.characters || room.characters.length === 0) {
            this.output("Det finns ingen här att prata med.");
            return;
        }

        // Find character
        let foundChar = null;
        for (let charId of room.characters) {
            const char = Characters[charId];
            if (char && char.keywords.some(k => target.includes(k))) {
                foundChar = { id: charId, char: char };
                break;
            }
        }

        if (!foundChar) {
            this.output("Jag ser ingen sådan person här.");
            return;
        }

        // Show dialogue
        const dialogue = foundChar.char.dialogue;

        // Check which dialogue to show
        if (foundChar.id === 'portier' && Game.player.hasModernClothes) {
            this.output(`<div class="dialogue">${dialogue.first_modern_clothes}</div>`);
        } else if (foundChar.id === 'portier' && !Game.player.hasModernClothes) {
            this.output(`<div class="dialogue">${dialogue.first_period_clothes}</div>`);
        } else if (dialogue.first && !Game.player.knowledge.includes(`met_${foundChar.id}`)) {
            this.output(`<div class="dialogue">${dialogue.first}</div>`);
            Game.player.knowledge.push(`met_${foundChar.id}`);

            // Show topic suggestions
            if (dialogue.topics) {
                this.output(`<div class="narrator"><em>Du kan fråga om: ${Object.keys(dialogue.topics).join(', ')}</em></div>`);
            }
        } else {
            this.output(`<div class="dialogue">Vad vill du fråga ${foundChar.char.name} om?</div>`);
            if (dialogue.topics) {
                this.output(`<div class="narrator"><em>Ämnen: ${Object.keys(dialogue.topics).join(', ')}</em></div>`);
            }
        }
    },

    cmdUse: function(itemName) {
        if (!itemName) {
            this.output("Använd vad?");
            return;
        }

        // Special case for clothes
        if (itemName.includes('kläd') || itemName.includes('kostym') || itemName === 'byt om') {
            if (Game.player.inventory.includes('period_clothes')) {
                Game.player.hasModernClothes = false;
                Game.player.hasPeriodClothes = true;
                Game.player.questProgress.foundClothes = true;

                this.output(Items.period_clothes.use());

                // Achievement!
                this.unlockAchievement('blend_in');

                // Update progress
                this.updateProgress(15);

                return;
            } else {
                this.output("Du har inga kläder att byta till.");
                return;
            }
        }

        // Find item in inventory
        let foundItem = null;
        for (let itemId of Game.player.inventory) {
            const item = Items[itemId];
            if (item && item.keywords.some(k => itemName.includes(k))) {
                foundItem = { id: itemId, item: item };
                break;
            }
        }

        if (!foundItem) {
            this.output("Du har inget sådant.");
            return;
        }

        if (!foundItem.item.useable) {
            this.output(`Du kan inte använda ${foundItem.item.name} just nu.`);
            return;
        }

        if (foundItem.item.use) {
            const result = foundItem.item.use();
            if (result) this.output(result);
        }
    },

    cmdInventory: function() {
        if (Game.player.inventory.length === 0) {
            this.output("Du bär ingenting.");
            return;
        }

        this.output("<strong>Du bär:</strong>");
        Game.player.inventory.forEach(itemId => {
            const item = Items[itemId];
            if (item) {
                this.output(`  • ${item.name}`);
            }
        });
    },

    showHelp: function() {
        document.getElementById('help-overlay').classList.remove('hidden');
    },

    unlockAchievement: function(achievementId) {
        if (Game.player.stats.achievements.includes(achievementId)) return;

        Game.player.stats.achievements.push(achievementId);
        const achievement = Achievements[achievementId];

        // Show achievement banner
        const banner = document.getElementById('achievement-banner');
        const text = document.getElementById('achievement-text');
        text.innerHTML = `${achievement.icon} ${achievement.name}: ${achievement.description}`;
        banner.classList.remove('hidden');

        setTimeout(() => {
            banner.classList.add('hidden');
        }, 4000);
    },

    updateProgress: function(amount) {
        Game.player.stats.progress = Math.min(100, Game.player.stats.progress + amount);
        document.getElementById('progress-fill').style.width = Game.player.stats.progress + '%';
    },

    autoSave: function() {
        try {
            localStorage.setItem('gustavIII_save', JSON.stringify(Game));
        } catch (e) {
            console.error('Auto-save failed:', e);
        }
    },

    loadGame: function() {
        try {
            const saved = localStorage.getItem('gustavIII_save');
            if (saved) {
                const loadedGame = JSON.parse(saved);
                Object.assign(Game, loadedGame);
                return true;
            }
        } catch (e) {
            console.error('Load failed:', e);
        }
        return false;
    },

    saveGame: function() {
        try {
            localStorage.setItem('gustavIII_save', JSON.stringify(Game));
            alert('✅ Spelet sparat!');
        } catch (e) {
            alert('❌ Kunde inte spara spelet.');
        }
    }
};

// ==========================================
// UI INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    const introScreen = document.getElementById('intro-screen');
    const gameScreen = document.getElementById('game-screen');
    const startButton = document.getElementById('start-game');
    const playerNameInput = document.getElementById('player-name');
    const commandInput = document.getElementById('command-input');

    // Start game
    startButton.addEventListener('click', function() {
        const name = playerNameInput.value.trim();
        if (!name) {
            alert('Vänligen ange ditt namn!');
            return;
        }

        Game.player.name = name;
        Game.flags.gameStarted = true;

        // Switch screens
        introScreen.classList.remove('active');
        gameScreen.classList.add('active');

        // Update UI
        document.getElementById('player-name-display').textContent = name;

        // Start game
        GameEngine.showRoom(Game.player.currentRoom);
        GameEngine.unlockAchievement('first_steps');

        // Focus input
        commandInput.focus();
    });

    // Handle command input
    commandInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const command = this.value.trim();
            if (command) {
                GameEngine.processCommand(command);
                this.value = '';
            }
        }
    });

    // Control buttons
    document.getElementById('hint-btn').addEventListener('click', function() {
        const hint = Hints.getHint();
        GameEngine.output(`<div class="narrator">${hint}</div>`);
        Game.player.stats.hintsUsed++;
    });

    document.getElementById('inventory-btn').addEventListener('click', function() {
        GameEngine.cmdInventory();
    });

    document.getElementById('help-btn').addEventListener('click', function() {
        GameEngine.showHelp();
    });

    document.getElementById('save-btn').addEventListener('click', function() {
        GameEngine.saveGame();
    });

    document.getElementById('menu-btn').addEventListener('click', function() {
        document.getElementById('menu-overlay').classList.remove('hidden');
    });

    // Menu options
    document.getElementById('resume-btn').addEventListener('click', function() {
        document.getElementById('menu-overlay').classList.add('hidden');
    });

    document.getElementById('save-game-btn').addEventListener('click', function() {
        GameEngine.saveGame();
        document.getElementById('menu-overlay').classList.add('hidden');
    });

    document.getElementById('load-game-btn').addEventListener('click', function() {
        if (GameEngine.loadGame()) {
            alert('✅ Spel laddat!');
            gameScreen.classList.add('active');
            introScreen.classList.remove('active');
            GameEngine.showRoom(Game.player.currentRoom);
            document.getElementById('menu-overlay').classList.add('hidden');
        } else {
            alert('❌ Inget sparat spel hittades.');
        }
    });

    document.getElementById('restart-btn').addEventListener('click', function() {
        if (confirm('Är du säker på att du vill starta om? All progress går förlorad.')) {
            localStorage.removeItem('gustavIII_save');
            location.reload();
        }
    });

    document.getElementById('credits-btn').addEventListener('click', function() {
        alert('1792: Mordet på Gustav III\n\nEtt historiskt textäventyr baserat på verkliga händelser.\n\nSkapad 2026');
    });

    document.getElementById('close-help').addEventListener('click', function() {
        document.getElementById('help-overlay').classList.add('hidden');
    });

    // Check for saved game
    const hasSavedGame = localStorage.getItem('gustavIII_save');
    if (hasSavedGame) {
        // Could show a "Continue?" option here
    }
});
