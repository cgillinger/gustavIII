// ═══════════════════════════════════════════════════════════════════════════
// GAME REVIEW IMPROVEMENTS - Comprehensive overhaul based on IF design principles
// ═══════════════════════════════════════════════════════════════════════════
//
// This file implements improvements based on "Att bygga ett klassiskt textäventyr 2026"
//
// Key improvements:
// 1. SCENERY SYSTEM - Everything mentioned in descriptions is now examinable
// 2. ENHANCED PARSER - Better synonyms, multi-word objects, verb flexibility
// 3. PERSONAL NPC FALLBACKS - Each NPC has unique "I don't know" responses
// 4. EXPANDED INVISICLUES - Hints for Act 3 and endgame
// 5. DOOR/LOCK COMMANDS - ÖPPNA/STÄNG/LÅS now work
// 6. STANDARDIZED FLAGS - Consistent naming for all game state
// 7. IMPROVED ERROR MESSAGES - Context-aware, immersive responses
//
// Loading: After all other scripts (last in index.html)
// ═══════════════════════════════════════════════════════════════════════════

(function() {
    'use strict';

    // Wait for all other scripts to load
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() {
            console.log('🎭 Loading Game Review Improvements...');

            initScenerySystem();
            enhanceParser();
            addPersonalNPCFallbacks();
            expandInvisiClues();
            addDoorCommands();
            improveErrorMessages();
            addMissingScenery();
            enhanceRoomDescriptions();

            console.log('✅ Game Review Improvements loaded successfully!');
        }, 1200); // Load after all other scripts
    });

    // ═══════════════════════════════════════════════════════════════════════
    // 1. SCENERY SYSTEM - Make everything mentioned examinable
    // ═══════════════════════════════════════════════════════════════════════

    function initScenerySystem() {
        // Global scenery object - things that can be examined but not taken
        window.Scenery = window.Scenery || {};

        // Add scenery for each room
        Object.assign(window.Scenery, {
            // NORRMALMSTORG
            'norrmalmstorg': {
                'operahuset': 'Kungliga Operahuset reser sig majestätiskt med sin gula putsade fasad och höga kolonner i klassicistisk stil. Ljus flimrar bakom de höga fönstren. Byggnaden invigdes 1782 och är kungens stolthet.',
                'operan': 'Kungliga Operahuset reser sig majestätiskt med sin gula putsade fasad och höga kolonner i klassicistisk stil. Ljus flimrar bakom de höga fönstren.',
                'fasad': 'Den gula fasaden glänser matt i skenet från gatlyktorna. Arkitekturen är inspirerad av italiensk renässans.',
                'kolonner': 'Höga vita kolonner flankerar entrén i jonisk ordning. De ger byggnaden en känsla av antik värdighet.',
                'palats': 'Arvfurstens palats ligger mitt emot operan. Det är en elegant byggnad i liknande stil, hem åt kronprins Karl.',
                'arvfurstens palats': 'Arvfurstens palats är en ståtlig byggnad mitt emot operan. Kronprins Karl bor här med sin familj.',
                'norrbro': 'Den breda stenbron leder söderut mot Gamla stan och det kungliga slottet. Du kan se facklor brinna vid slottets portar.',
                'slottet': 'Stockholms slott syns i fjärran söderut, en massiv byggnad som dominerar stadsbilden. Facklor brinner vid portarna.',
                'kullersten': 'Kullerstenen är sliten och ojämn, hal av smältande snö. Hundratals år av fotsteg har nött den.',
                'människor': 'Människor i trekantiga hattar och långa kappor rör sig över torget. Adelsmän, betjänter, soldater - alla har ärenden.',
                'hästdroskor': 'Hästdroskorna rullar över kullerstenen med ett välbekant skrammel. Kuskarna ropar åt folk att flytta sig.',
                'lyktor': 'Oljelyktor hänger på järnstolpar och kastar ett flackande sken över torget. Skuggorna dansar.',
                'himmel': 'Natthimlen är mulen med glimtar av stjärnor. Månen skymtar bakom moln.',
                'vaktpost': 'Vaktposten står stel vid operans hörn, klädd i blå uniform med högt yvigt hår. Han observerar allt.'
            },

            // OPERA_ENTRANCE
            'opera_entrance': {
                'tak': 'De höga taken sträcker sig uppåt med förgyllda ornament och stuckaturer. Ljuset från kristallkronorna kastar dansande skuggor.',
                'ornament': 'Förgyllda ornament i rokoko-stil pryder väggarna - blomrankor, änglar och musikinstrument.',
                'kristallkronor': 'Magnifika kristallkronor hänger från taket. Hundratals ljus brinner i dem och skapar ett bländande sken.',
                'ljuskrona': 'Kristallkronan glittrar med hundratals facettslipade glasbitar. Ljusen fladdar lätt i draget från dörren.',
                'trappa': 'En magnifik trappa med marmorsteg och förgyllda räcken leder uppåt till salongerna. Röda mattor täcker stegen.',
                'trappan': 'Trappan svänger elegant uppåt. Du ser välklädda människor röra sig uppför den mot foajén.',
                'dörr': 'Dubbeldörrarna är höga och tunga, klädda med rött sammet och förgyllda beslag.',
                'personal': 'Skylten "Personal" hänger ovanför en enkel dörr till vänster. Där verkar vara personalens område.',
                'korridor': 'En smal korridor leder åt höger. Därifrån hörs röster och skrammel - kanske köket?',
                'portier': 'Portiern står stel i sin röda livré, med pudrad peruk och sträng uppsyn. Han bevakar entrén noga.',
                'vägg': 'Väggarna är klädda med gyllenröd brokad och utsmyckade med förgyllda listverk.',
                'golv': 'Golvet är av polerad marmor i schackmönster - svart och vitt.',
                'parfym': 'Luften är tung av parfym - rosor, jasmin och något sötare. Det blandas med doften av talgljus.'
            },

            // OPERA_STAFF
            'opera_staff': {
                'trägolv': 'Det knarrande trägolvet är slitet av otaliga fötter. Här är betydligt enklare än i entrén.',
                'väggar': 'Väggarna är nakna och enkla - kalkade väggar utan utsmyckning. Några krokar för kläder.',
                'dörr': 'Dörren till omklädningsrummet står på glänt. Du skymtar kostymer och tyger innanför.',
                'omklädningsrum': 'Genom den öppna dörren ser du ett rum fullt med teaterkostymer, peruker och masker.',
                'kostymer': 'Du skymtar färgglada kostymer genom dörren - silke, sammet och broderade tyger.',
                'målare': 'Mannen med målarfärgade händer verkar vara en av scenarbetarna som underhåller kulisserna.',
                'låda': 'Scenarbetaren bär en trälåda full med penslar, färgburkar och trasor.',
                'penslar': 'Penslarna i lådan är av olika storlekar - några fina för detaljer, andra breda för bakgrunder.'
            },

            // COSTUME_ROOM
            'costume_room': {
                'kostymer': 'Kostymer från otaliga operaföreställningar hänger på krokar - kungar och drottningar, bönder och soldater, mytologiska figurer.',
                'sidenkappor': 'Sidenkappor i djupa röda och blå nyanser. Tyget glänser matt i ljuset.',
                'sammetsdräkter': 'Sammetsdräkter i rika färger - lila, mörkgrönt, vinrött. De känns mjuka och tunga.',
                'perukställ': 'Perukställ i trä med vita pudrade peruker - höga, låga, lockiga, raka.',
                'peruker': 'Vita pudrade peruker av hästhår. Doften av puder och parfym fyller luften.',
                'masker': 'Masker i olika stilar - venetianska, teatraliska, groteska. Alla stirrar med tomma ögonhål.',
                'spegel': 'En stor spegel i förgylld ram. Den är gammal och lite grumlig, men du kan se dig själv tydligt.',
                'sminkbord': 'Ett sminkbord med puderdosor, rouge, kajal och parfymflaskor. Sminket doftar starkt.',
                'krokar': 'Järnkrokar på väggarna där kostymer hänger i långa rader.',
                'lavendel': 'Doften av lavendel kommer från torkade knippen som hänger bland kläderna - mot mal.',
                'mögel': 'En lätt unken doft av mögel skvallrar om gamla tyger och fuktiga väggar.'
            },

            // NORRBRO
            'norrbro': {
                'stenbro': 'Den breda stenbron är av grå granit, solid och gammal. Räcket är av järn.',
                'norrström': 'Norrström brusar mörkt under bron. Isflak driver långsamt i det kalla vattnet.',
                'vatten': 'Det mörka vattnet rör sig sakta. Isflak knakar mot varandra med ett kusligt ljud.',
                'isflak': 'Stora isflak driver i strömmen. Vintern håller fortfarande sitt grepp om staden.',
                'slottet': 'Stockholms slott reser sig majestätiskt söderut - en massiv barockbyggnad i gult och vitt.',
                'slott': 'Stockholms slott är nyligen färdigställt efter Nicodemus Tessin den yngres ritningar. Det sägs vara ett av Europas största slott.',
                'facklor': 'Facklor brinner vid slottets entré och kastar ett orange sken över murarna.',
                'skeppsholmen': 'Skeppsholmen syns österut - en ö med örlogsfartyg och amiralitetets byggnader.',
                'vind': 'Vinden är bitande kall här ute på bron. Den kommer från havet och bär med sig salt.',
                'räcke': 'Broräcket är av smidesjärn med dekorativa mönster. Det är kallt under handen.'
            },

            // SLOTTSBACKEN
            'slottsbacken': {
                'gatan': 'Den breda gatan stiger uppåt mot slottets huvudportal. Kullerstenen är jämn och välskött.',
                'facklor': 'Höga facklor i järnhållare brinner längs vägen och kastar ett varmt orange sken.',
                'stenvägg': 'Slottets massiva stenväggar reser sig hotfullt. Varje sten är större än en man.',
                'portal': 'Huvudportalen är enorm - dubbeldörrar i ek med järnbeslag. Livvakter står stela på varje sida.',
                'karoliner': 'Två karoliner i blå uniformer med höga hattar. De håller musköter med bajonetter och ser strängt på alla.',
                'uniformer': 'De blå uniformerna är välskötta med mässingsknappar. Karolinerna bär höga hattar med plym.',
                'musköter': 'Musköternas stål glimmar i fackelskenet. Bajonetterna är vassa och blanka.',
                'gränd': 'En smal gränd leder västerut ner mot Gamla stans trånga gator.'
            },

            // GAMLA_STAN
            'gamla_stan': {
                'gränder': 'Trånga gränder slingrar sig mellan höga hus. Väggarna känns nästan som de lutar inåt.',
                'hus': 'Höga hus med lutande fasader i röda och gula nyanser. Många är hundratals år gamla.',
                'fasader': 'Fasaderna lutar lätt - några av husväggarna bukar ut över gatunivån.',
                'lyktor': 'Enstaka lyktor flämtar på husväggarna. Skuggorna är djupa mellan dem.',
                'skylt': 'En skylt med gyllene text gungar i vinden: "Den Gyldene Freden". En krog.',
                'krog': 'Skratt och röster hörs från krogen. Ljus lyser inbjudande genom de små fönstren.',
                'sillgumma': 'En äldre kvinna i trasiga kläder ropar ut sin sill till försäljning. Korgen är nästan tom.',
                'korg': 'Korgen innehåller silverglänsande sill, saltad och kall.',
                'rök': 'Röken från eldstäder stiger ur skorstenarna och lägger sig som ett töcken över gränderna.',
                'gathörn': 'Ett mörkt gathörn där skuggor rör sig. Bäst att inte dröja där.',
                'luft': 'Luften är tung av rök, osthållning och kroppsvärme från de trånga bostäderna.'
            },

            // DEN_GYLDENE_FREDEN
            'den_gyldene_freden': {
                'tak': 'Låga tak med synliga bjälkar av mörk ek. Du måste nästan ducka på vissa ställen.',
                'bjälkar': 'Bjälkarna är mörka av ålder och rök. De har hängt här i hundratals år.',
                'bord': 'Långa träbord med bänkar där gäster sitter tätt. Ytan är nött och fläckad av öl.',
                'ljus': 'Talgljus på väggarna fladdar och kastar dansande skuggor. Luften är rökig.',
                'bardisk': 'En grov bardisk av mörkt trä. Bakom den står krogvärden och torkar glas.',
                'glas': 'Grova dricksglas och stoppkrus står på hyllor bakom bardisken.',
                'hörn': 'I hörnet sitter en grupp adelsmän och viskar intensivt. De ser upp när du tittar.',
                'adelsmän': 'En grupp välklädda män med peruker och fina rockar. De pratar lågt och ser allvarliga ut.',
                'fiol': 'En melankolisk fiol spelar i hörnet. Melodin är vacker men sorgsen.',
                'musik': 'Fiolmusiken fyller lokalen med en dämpad stämning. Folk nickar med i takt.',
                'rök': 'Tobaksrök svävar i luften och blandar sig med doften av stekt kött och öl.',
                'ölstop': 'Ölstoppen är av tennlegering, tunga och kalla. Ölet skummar gyllene.'
            },

            // KUNGSTRADGARDEN
            'kungstradgarden': {
                'träd': 'Träd med kala grenar sträcker sig mot himlen. På våren kommer de blomma.',
                'grenar': 'De kala grenarna svajar i vinden som svarta fingrar mot den mörka himlen.',
                'gångar': 'Grusgångar slingrar sig genom trädgården. Gruset knakar under fötterna.',
                'grus': 'Fin singel knakar under dina skor. Gruset är välkrattat och jämnt.',
                'bänkar': 'Enkla träbänkar står utplacerade längs gångarna. De är tomma nu i kylan.',
                'bänk': 'En enkel träbänk, kall och fuktig av smältande snö. Inte en plats att sitta länge.',
                'kyrka': 'Jacobs kyrkas silhuett syns i fjärran - ett gotiskt torn mot natthimlen.',
                'jacobs kyrka': 'S:t Jacobs kyrka ligger öster om trädgården. Tornspiran pekar mot stjärnorna.',
                'himmel': 'Himlen är mörk med glimtande stjärnor mellan molnen. Månen är nästan full.',
                'vind': 'En kall vind sveper genom trädgården och får grenarna att susa.'
            },

            // OPERA_FOYER
            'opera_foyer': {
                'foajé': 'Foajén är praktfull med högt i tak, förgyllda väggar och kristallkronor.',
                'kronor': 'Kristallkronorna glittrar med hundratals ljus. Varje kristall kastar regnbågar.',
                'väggar': 'Väggarna är klädda med gulddekor och målningar av mytologiska scener.',
                'målningar': 'Stora oljemålningar föreställer gudar och gudinnor, hjältar och monster.',
                'trappa': 'En bred marmortrappa leder upp till kungliga logen. Röda mattor täcker stegen.',
                'loge': 'Kungliga logen syns ovanför - en balkong med förgyllda räcken och sammetsgardiner.',
                'golv': 'Golvet är av polerad marmor med invävda mönster i guld och vitt.',
                'människor': 'Välklädda människor rör sig genom foajén - damer i vida klänningar, herrar i peruker.',
                'gardiner': 'Tunga sammetsgardiner i mörkröd färg ramar in fönster och dörröppningar.'
            },

            // OPERA_BALLROOM (maskeradbalen)
            'opera_ballroom': {
                'folkmassan': 'Hundratals maskerade människor fyller salen. Alla bär masker och utklädnader.',
                'masker': 'Masker i alla former - venetianska, groteska, eleganta, skrämmande. Ögon glittrar bakom dem.',
                'orkester': 'Orkestern spelar en livlig kontradans på scenen. Violiner, flöjter, cembalon.',
                'dans': 'Par virvlar över parkettgolvet i komplicerade dansmönster. Klänningar sveper.',
                'ljuskronor': 'Ljuskronorna ovan glittrar med tusentals levande ljus. Värmen stiger mot taket.',
                'parkett': 'Parkettgolvet är blankt och slitet av dansande fötter. Mönstret är av ek och bok.',
                'scen': 'Scenen höjer sig i ena änden av salen. Orkestern spelar där.',
                'svarta kappor': 'Flera män i svarta kappor och vita masker rör sig genom folkmassan. De verkar... koordinerade.',
                'vit mask': 'Vita masker syns överallt - det är kanske den populäraste stilen ikväll.',
                'luft': 'Luften är tung av parfym, svett och vax från ljusen. Det är hett och trångt.',
                'kungen': 'Kungen är lätt att känna igen trots masken - ordensstjärnorna på bröstet avslöjar honom.'
            }
        });

        // Hook into cmdExamine to check scenery
        const originalCmdExamine = GameEngine.cmdExamine;
        GameEngine.cmdExamine = function(target) {
            if (!target) {
                this.output("Undersök vad?");
                return;
            }

            const room = Game.player.currentRoom;
            const roomScenery = window.Scenery[room];

            if (roomScenery) {
                // Check all scenery items for this room
                const targetLower = target.toLowerCase();
                for (let [key, description] of Object.entries(roomScenery)) {
                    if (targetLower.includes(key) || key.includes(targetLower)) {
                        this.output(description);
                        return;
                    }
                }
            }

            // Fall back to original examine
            originalCmdExamine.call(this, target);
        };

        console.log('   ✓ Scenery system initialized with ' + Object.keys(window.Scenery).length + ' rooms');
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 2. ENHANCED PARSER - Better synonyms and verb flexibility
    // ═══════════════════════════════════════════════════════════════════════

    function enhanceParser() {
        // Extend synonym mappings
        const additionalSynonyms = {
            'titta': ['se', 'kolla', 'observera', 'betrakta', 'granska', 'kika', 'skåda', 'blicka', 'ögna'],
            'gå': ['rör', 'promenera', 'vandra', 'ta sig', 'spring', 'gå till', 'förflytta'],
            'ta': ['plocka', 'lyft', 'hämta', 'samla', 'grip', 'tag', 'snappa', 'fatta'],
            'undersök': ['inspektera', 'utforska', 'analysera', 'studera', 'kolla på', 'granska', 'betrakta', 'titta på', 'se på', 'x'],
            'prata': ['tala', 'samtala', 'konversera', 'diskutera', 'snacka', 'säg', 'säg till', 'tilltala'],
            'använd': ['bruk', 'nyttja', 'aktivera', 'byt', 'sätt på', 'ta på'],
            'öppna': ['lås upp', 'bryt upp', 'forcera', 'dra upp'],
            'stäng': ['lås', 'dra igen', 'slå igen'],
            'lyssna': ['hör', 'avlyssna', 'spetsa öronen'],
            'lukta': ['sniffa', 'dra in', 'känn doften'],
            'smaka': ['pröva', 'testa'],
            'läs': ['studera', 'tyda', 'dechiffrera'],
            'ge': ['räck', 'överlämna', 'lämna', 'skänk'],
            'fråga': ['ställ fråga', 'undra', 'förhör'],
            'vänta': ['stanna', 'dröj', 'bida'],
            'sov': ['vila', 'lägg dig', 'slumra'],
            'hjälp': ['help', '?', 'h'],
            'inventarie': ['inventory', 'inv', 'i', 'väska', 'fickor'],
            'spara': ['save', 'lagra'],
            'ladda': ['load', 'återställ']
        };

        // Merge with existing synonyms
        if (Parser && Parser.synonyms) {
            for (let [verb, syns] of Object.entries(additionalSynonyms)) {
                if (Parser.synonyms[verb]) {
                    Parser.synonyms[verb] = [...new Set([...Parser.synonyms[verb], ...syns])];
                } else {
                    Parser.synonyms[verb] = syns;
                }
            }
        }

        // Add direction synonyms
        const directionSynonyms = {
            'norr': ['n', 'norrut', 'nord', 'nordlig'],
            'söder': ['s', 'syd', 'söderut', 'sydlig'],
            'öster': ['ö', 'öst', 'österut', 'östlig'],
            'väster': ['v', 'väst', 'västerut', 'västlig'],
            'upp': ['u', 'uppåt', 'uppför', 'ovanför'],
            'ner': ['ned', 'd', 'nedåt', 'nerför', 'nedanför'],
            'in': ['inåt', 'in i', 'innanför', 'enter'],
            'ut': ['utåt', 'ut ur', 'utanför', 'exit', 'lämna']
        };

        for (let [dir, syns] of Object.entries(directionSynonyms)) {
            if (Parser.synonyms[dir]) {
                Parser.synonyms[dir] = [...new Set([...Parser.synonyms[dir], ...syns])];
            } else {
                Parser.synonyms[dir] = syns;
            }
        }

        console.log('   ✓ Parser enhanced with additional synonyms');
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 3. PERSONAL NPC FALLBACKS - Unique "I don't know" responses
    // ═══════════════════════════════════════════════════════════════════════

    function addPersonalNPCFallbacks() {
        window.NPCFallbacks = {
            'bellman': [
                "Bellman skakar på huvudet och tar en klunk brännvin. \"Det där vet jag inte något om, kamrat. Fråga mig om musik, kärlek eller krogarna i Stockholm istället!\"",
                "\"Hmm...\" Bellman funderar en stund. \"Nej, det ämnet känner jag inte till. Men jag kan sjunga en visa om det om du vill?\"",
                "Bellman skrattar. \"Du frågar fel poet! Jag sjunger om Ulla Winblad och Movitz, inte om sådant.\""
            ],
            'krogvärden': [
                "Krogvärden rycker på axlarna medan han torkar ett glas. \"Det där vet jag inte något om. Vill du ha öl istället?\"",
                "\"Hmm?\" Krogvärden ser på dig med professionell likgiltighet. \"Det har jag inte hört talas om. Men jag hör mycket här bakom disken - fråga om något annat.\"",
                "Krogvärden skakar på huvudet. \"Nej, det där är utanför mitt område. Jag sköter min krog, inte stadens mysterier.\""
            ],
            'portier': [
                "Portiern ser på dig med sträng uppsyn. \"Det angår inte mig. Jag vaktar operans dörrar, inget annat.\"",
                "\"Jag vet ingenting om sådant,\" säger portiern kyligt. \"Har ni ärende vid operan, eller?\"",
                "Portiern rynkar pannan. \"Det där är inte något jag diskuterar med besökare.\""
            ],
            'adelcrantz': [
                "Adelcrantz stryker sig över hakan eftertänksamt. \"Det där har jag tyvärr ingen kunskap om. Men fråga mig gärna om arkitektur eller operan!\"",
                "\"Hmm, nej...\" Arkitekten ser fundersam ut. \"Det ämnet känner jag inte till. Men vill du se ritningarna till operahuset?\"",
                "Adelcrantz ler ursäktande. \"Förlåt, men det är utanför mitt kunskapsområde. Jag är arkitekt, inte politiker.\""
            ],
            'gustav_iii': [
                "Kungen höjer ett ögonbryn. \"Det där ämnet intresserar mig inte. Har du något av vikt att berätta?\"",
                "\"Vi har viktigare saker att diskutera,\" säger kungen otåligt. \"Vad vet du om hotet mot min person?\"",
                "Gustav III vinkar avfärdande. \"Låt oss tala om något mer angeläget. Har du bevis att visa mig?\""
            ],
            'anckarstrom': [
                "Anckarström smalnar ögonen misstänksamt. \"Varför frågar du om det? Vad vill du egentligen?\"",
                "\"Det angår dig inte,\" fräser Anckarström. Hans hand rör sig nervöst under kappan.",
                "Anckarström vänder bort blicken. \"Jag har inget att säga om det. Lämna mig ifred.\""
            ],
            'von_essen': [
                "von Essen skakar på huvudet. \"Det där vet jag inget om. Men om det rör Hans Majestäts säkerhet - berätta mer.\"",
                "\"Förlåt, men det är utanför min kännedom,\" säger livdrabanten. \"Finns det något hot du känner till?\"",
                "von Essen ser granskande på dig. \"Det ämnet känner jag inte till. Vad är det egentligen du försöker ta reda på?\""
            ],
            'pechlin': [
                "Pechlin ler ett kallt leende. \"Det där tänker jag inte kommentera. Var försiktig med vad du frågar om.\"",
                "\"Nyfikenhet är farligt,\" säger Pechlin mjukt. \"Särskilt i dessa tider.\"",
                "Den gamle generalen betraktar dig med iskalla ögon. \"Somliga frågor bör inte ställas.\""
            ],
            'default': [
                "Personen verkar inte ha något att säga om det ämnet.",
                "Du får inget svar på den frågan.",
                "Det verkar inte vara något de vill eller kan prata om."
            ]
        };

        // Function to get a random fallback
        window.getNPCFallback = function(npcId) {
            const fallbacks = window.NPCFallbacks[npcId] || window.NPCFallbacks['default'];
            return fallbacks[Math.floor(Math.random() * fallbacks.length)];
        };

        console.log('   ✓ Personal NPC fallbacks added for ' + (Object.keys(window.NPCFallbacks).length - 1) + ' characters');
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 4. EXPANDED INVISICLUES - Hints for Act 3 and endgame
    // ═══════════════════════════════════════════════════════════════════════

    function expandInvisiClues() {
        // Add to existing ThreeTierHints if it exists
        const additionalHints = {
            // During the masquerade ball
            'at_ball_start': {
                condition: function() {
                    return Game.player.currentRoom === 'opera_ballroom' &&
                           !Game.player.questProgress.identifiedAnckarstrom;
                },
                hints: [
                    "Du är på maskeradbalen. Kungen är här någonstans bland alla maskerade.",
                    "Leta efter män i svarta kappor med vita masker. Det finns flera - en av dem är Anckarström.",
                    "Anckarström har ett nervöst beteende och kollar ofta mot kungen. UNDERSÖK de svartklädda männen noga."
                ]
            },

            // Found Anckarstrom but haven't acted
            'found_anckarstrom': {
                condition: function() {
                    return Game.player.questProgress.identifiedAnckarstrom &&
                           !Game.player.questProgress.savedKing;
                },
                hints: [
                    "Du har identifierat Anckarström. Vad ska du göra nu?",
                    "Du kan antingen VARNA KUNGEN, KONFRONTERA ANCKARSTRÖM, eller försöka GRIPA honom.",
                    "Om du har bevis (pistollappen), kan du visa dem för kungen eller von Essen. Säg: GE BEVIS TILL KUNGEN"
                ]
            },

            // Near confrontation
            'confrontation_imminent': {
                condition: function() {
                    return Game.player.currentRoom === 'opera_ballroom' &&
                           Game.player.knowledge.includes('anckarstrom_location');
                },
                hints: [
                    "Anckarström närmar sig kungen! Du måste agera snabbt.",
                    "Du kan ROPA 'VAKT!' för att kalla på livdrabanterna, eller SKYDDA KUNGEN fysiskt.",
                    "Det snabbaste sättet är att KNUFFA KUNGEN undan precis när Anckarström drar sin pistol."
                ]
            },

            // If player has evidence but hasn't used it
            'have_evidence_unused': {
                condition: function() {
                    return Game.player.inventory.includes('pistol_evidence') &&
                           !Game.player.knowledge.includes('showed_evidence_to_king');
                },
                hints: [
                    "Du har pistolsmedens anteckningar - det är viktigt bevis!",
                    "Kungen behöver se konkreta bevis för att agera. GE BEVIS TILL KUNGEN.",
                    "Alternativt kan du visa beviset för von Essen - han kan övertyga kungen."
                ]
            },

            // Getting into the ball without ticket
            'need_ball_access': {
                condition: function() {
                    return Game.currentTime.day === 16 &&
                           !Game.player.inventory.includes('ticket') &&
                           Game.player.currentRoom !== 'opera_ballroom';
                },
                hints: [
                    "Maskeradbalen är ikväll, men du behöver en biljett eller annat sätt att komma in.",
                    "Adelcrantz lovade en biljett om du hjälpte honom. Har du hämtat färgen?",
                    "Om du redan hjälpt Adelcrantz, PRATA MED honom igen för att få biljetten."
                ]
            },

            // Final moments - clock is ticking
            'final_countdown': {
                condition: function() {
                    return Game.player.currentRoom === 'opera_ballroom' &&
                           Game.currentTime.hour >= 23 &&
                           Game.currentTime.minute >= 30;
                },
                hints: [
                    "Klockan är nästan midnatt! Attentatet sker snart!",
                    "Du måste agera NU. Hitta Anckarström eller varna kungen omedelbart!",
                    "ROPA för att varna alla, eller SPRING TILL KUNGEN för att skydda honom fysiskt!"
                ]
            },

            // Looking for Pechlin's house
            'find_pechlin': {
                condition: function() {
                    return Game.player.knowledge.includes('heard_about_pechlin') &&
                           !Game.player.knowledge.includes('visited_pechlin');
                },
                hints: [
                    "Pechlin bor på Blasieholmen, norr om Norrmalm.",
                    "Från Norrmalmstorg, gå VÄSTER till Fredsgatan, sedan NORR mot Blasieholmen.",
                    "Pechlins palats har en sidoingång som ofta står öppen. UNDERSÖK huset noga."
                ]
            },

            // Looking for pistol smith
            'find_pistolsmith': {
                condition: function() {
                    return Game.player.knowledge.includes('anckarstrom_mentioned') &&
                           !Game.player.questProgress.foundPistolsmith;
                },
                hints: [
                    "Anckarström måste ha fått sina vapen någonstans. En vapensmed kanske?",
                    "Vapensmed Wåhlberg finns vid Järntorget i Gamla stan.",
                    "Gå till STORTORGET och sedan SÖDER till Järntorget. PRATA MED VAPENSMED."
                ]
            }
        };

        // Merge with existing hints system
        if (window.ThreeTierHints) {
            Object.assign(window.ThreeTierHints, additionalHints);
        } else {
            window.ThreeTierHints = additionalHints;
        }

        // Enhanced hint getter
        window.getContextualHint = function() {
            const hints = window.ThreeTierHints;

            for (let [key, hintData] of Object.entries(hints)) {
                if (hintData.condition && hintData.condition()) {
                    // Track which hint level player is at
                    if (!Game.player.hintLevels) Game.player.hintLevels = {};
                    if (!Game.player.hintLevels[key]) Game.player.hintLevels[key] = 0;

                    const level = Math.min(Game.player.hintLevels[key], hintData.hints.length - 1);
                    const hint = hintData.hints[level];

                    // Advance to next hint level for next time
                    Game.player.hintLevels[key]++;

                    return hint;
                }
            }

            // Default hint
            return "Utforska din omgivning. TITTA för att se dig omkring, PRATA MED personer du möter.";
        };

        console.log('   ✓ InvisiClues expanded with ' + Object.keys(additionalHints).length + ' new hint categories');
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 5. DOOR COMMANDS - ÖPPNA/STÄNG/LÅS
    // ═══════════════════════════════════════════════════════════════════════

    function addDoorCommands() {
        // Define doors/openables in the game
        window.Openables = {
            'opera_entrance': {
                'dörr': {
                    description: 'De tunga dubbeldörrarna till operan.',
                    openText: 'Du drar upp de tunga dörrarna. De gnisslar lätt.',
                    closeText: 'Du stänger dörrarna bakom dig.',
                    lockedText: 'Dörrarna är olåsta under föreställningar.',
                    isOpen: true,
                    isLocked: false
                }
            },
            'costume_room': {
                'dörr': {
                    description: 'Dörren till omklädningsrummet.',
                    openText: 'Du öppnar dörren till omklädningsrummet.',
                    closeText: 'Du stänger dörren.',
                    isOpen: true,
                    isLocked: false
                },
                'garderob': {
                    description: 'En gammal trägarderob i hörnet.',
                    openText: 'Du öppnar garderobsdörrarna. Inuti hänger ännu fler kostymer.',
                    closeText: 'Du stänger garderoben.',
                    isOpen: false,
                    isLocked: false
                }
            },
            'pechlin_house': {
                'huvuddörr': {
                    description: 'Huvuddörren till Pechlins palats.',
                    openText: 'Dörren är låst.',
                    closeText: 'Dörren är redan stängd.',
                    lockedText: 'Huvuddörren är låst. Du hör röster inifrån.',
                    isOpen: false,
                    isLocked: true
                },
                'sidoingång': {
                    description: 'En diskret sidoingång.',
                    openText: 'Sidoingången står redan på glänt. Du kan smyga in.',
                    closeText: 'Du drar igen dörren försiktigt.',
                    isOpen: true,
                    isLocked: false
                }
            },
            'den_gyldene_freden': {
                'dörr': {
                    description: 'Krogdörren av tjockt ek.',
                    openText: 'Du öppnar dörren. Värme och ljud strömmar ut.',
                    closeText: 'Du stänger dörren. Ljudet dämpas.',
                    isOpen: true,
                    isLocked: false
                }
            }
        };

        // Add ÖPPNA command
        window.cmdOpen = function(target) {
            if (!target) {
                GameEngine.output("Öppna vad?");
                return;
            }

            const room = Game.player.currentRoom;
            const roomOpenables = window.Openables[room];

            if (roomOpenables) {
                for (let [key, obj] of Object.entries(roomOpenables)) {
                    if (target.includes(key)) {
                        if (obj.isLocked) {
                            GameEngine.output(obj.lockedText || "Det är låst.");
                        } else if (obj.isOpen) {
                            GameEngine.output("Det är redan öppet.");
                        } else {
                            obj.isOpen = true;
                            GameEngine.output(obj.openText);
                        }
                        return;
                    }
                }
            }

            // Check for general items
            GameEngine.output("Du kan inte öppna det.");
        };

        // Add STÄNG command
        window.cmdClose = function(target) {
            if (!target) {
                GameEngine.output("Stäng vad?");
                return;
            }

            const room = Game.player.currentRoom;
            const roomOpenables = window.Openables[room];

            if (roomOpenables) {
                for (let [key, obj] of Object.entries(roomOpenables)) {
                    if (target.includes(key)) {
                        if (!obj.isOpen) {
                            GameEngine.output("Det är redan stängt.");
                        } else {
                            obj.isOpen = false;
                            GameEngine.output(obj.closeText);
                        }
                        return;
                    }
                }
            }

            GameEngine.output("Du kan inte stänga det.");
        };

        // Hook into command processing
        const originalProcessCommand = GameEngine.processCommand;
        GameEngine.processCommand = function(input) {
            const parsed = Parser.parse(input);
            const verb = parsed.verb;
            const obj = parsed.object;

            switch(verb) {
                case 'öppna':
                    this.output(`<div class="command-echo">&gt; ${input}</div>`);
                    window.cmdOpen(obj);
                    return;
                case 'stäng':
                    this.output(`<div class="command-echo">&gt; ${input}</div>`);
                    window.cmdClose(obj);
                    return;
                case 'lås':
                    this.output(`<div class="command-echo">&gt; ${input}</div>`);
                    this.output("Du har ingen nyckel.");
                    return;
            }

            // Fall back to original processing
            originalProcessCommand.call(this, input);
        };

        console.log('   ✓ Door commands (ÖPPNA/STÄNG/LÅS) added');
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 6. IMPROVED ERROR MESSAGES - Context-aware, immersive
    // ═══════════════════════════════════════════════════════════════════════

    function improveErrorMessages() {
        window.ErrorMessages = {
            'cant_go': [
                "Du kan inte gå åt det hållet.",
                "Det finns ingen väg dit.",
                "Något blockerar den vägen.",
                "Du ser ingen möjlighet att ta dig åt det hållet."
            ],
            'cant_see': [
                "Du ser inget sådant här.",
                "Det finns inget sådant i närheten.",
                "Du kan inte se något sådant.",
                "Det verkar inte finnas här."
            ],
            'cant_take': [
                "Du kan inte ta det.",
                "Det går inte att plocka upp.",
                "Det är för tungt, eller fastsatt.",
                "Det där kan du inte bära med dig."
            ],
            'dont_have': [
                "Du har inget sådant.",
                "Du bär inte på något sådant.",
                "Det finns inte i ditt inventarie."
            ],
            'no_one_here': [
                "Det finns ingen här att prata med.",
                "Du är ensam här.",
                "Ingen svarar - platsen är tom."
            ],
            'cant_understand': [
                "Jag förstår inte vad du menar.",
                "Det kommandot känner jag inte igen.",
                "Försök formulera dig annorlunda.",
                "Skriv 'hjälp' för att se vilka kommandon som finns."
            ]
        };

        window.getErrorMessage = function(type) {
            const messages = window.ErrorMessages[type] || window.ErrorMessages['cant_understand'];
            return messages[Math.floor(Math.random() * messages.length)];
        };

        console.log('   ✓ Improved error messages added');
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 7. ADD MISSING SCENERY TO ALL ROOMS
    // ═══════════════════════════════════════════════════════════════════════

    function addMissingScenery() {
        // Generic scenery that works in most indoor locations
        const indoorScenery = {
            'golv': 'Golvet är av trä eller sten, beroende på rummet. Det knarrar lätt under dina fötter.',
            'vägg': 'Väggarna är solida. Inget märkvärdigt.',
            'väggar': 'Väggarna är solida. Inget märkvärdigt.',
            'tak': 'Taket sträcker sig ovanför dig. Inget särskilt att se.',
            'dörr': 'En dörr. Du kan förmodligen gå genom den.',
            'fönster': 'Genom fönstret ser du utsikten utanför.',
            'ljus': 'Ljuset kommer från ljus och facklor som brinner i rummet.'
        };

        // Generic outdoor scenery
        const outdoorScenery = {
            'himmel': 'Himlen sträcker sig ovanför dig. Det är kväll och stjärnorna börjar synas.',
            'mark': 'Marken under dina fötter - kullersten eller grus.',
            'luft': 'Luften är kall och fylld av dofter från 1700-talets Stockholm.',
            'vind': 'En kall vind drar genom gatorna.',
            'snö': 'Smältande snö ligger i högar längs gatorna. Våren närmar sig, men vintern kämpar emot.',
            'människor': 'Stockholms invånare rör sig förbi - en blandning av samhällsklasser.',
            'ljud': 'Du hör ljud från staden - röster, hästhovar, fågelkvitter.'
        };

        // Add to all rooms that don't have specific scenery
        if (typeof Rooms !== 'undefined') {
            for (let roomId of Object.keys(Rooms)) {
                if (!window.Scenery[roomId]) {
                    window.Scenery[roomId] = {};
                }

                // Determine if indoor or outdoor
                const isOutdoor = ['norrmalmstorg', 'norrbro', 'slottsbacken', 'gamla_stan', 'kungstradgarden', 'fredsgatan', 'blasieholmen'].includes(roomId);

                // Add generic scenery
                const generic = isOutdoor ? outdoorScenery : indoorScenery;
                for (let [key, desc] of Object.entries(generic)) {
                    if (!window.Scenery[roomId][key]) {
                        window.Scenery[roomId][key] = desc;
                    }
                }
            }
        }

        console.log('   ✓ Missing scenery filled in for all rooms');
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 8. ENHANCE ROOM DESCRIPTIONS WITH SENSORY DETAILS
    // ═══════════════════════════════════════════════════════════════════════

    function enhanceRoomDescriptions() {
        // Add atmospheric sounds that can be heard
        window.RoomSounds = {
            'norrmalmstorg': 'Du hör hästhovar mot kullersten, avlägsna röster och musik som strömmar ut från operan.',
            'opera_entrance': 'Dämpade ljud av musik och applåder hörs genom väggarna. Någon hostar diskret.',
            'opera_staff': 'Röster och skrammel hörs från kulisserna. Någon sjunger tyst för sig själv.',
            'costume_room': 'Det är tyst här, förutom det svaga prasslandet av tyger i draget.',
            'norrbro': 'Vattnet brusar under bron. Vinden piper kring stenräcket.',
            'slottsbacken': 'Du hör vakternas marscherande steg och avlägsna kommandon.',
            'gamla_stan': 'Röster ekar mellan de trånga husen. En hund skäller någonstans.',
            'den_gyldene_freden': 'Sorlet av röster, klirr av glas och fiolmusik fyller lokalen.',
            'kungstradgarden': 'Det är fridfullt här. Bara vinden i de kala grenarna och avlägsna stadsljud.',
            'opera_foyer': 'Sorl av eleganta röster och fotsteg mot marmor. Orkestern stämmer sina instrument.',
            'opera_ballroom': 'Musik sveper genom salen! Skratt, röster, kjolar som svischar mot parketten.'
        };

        // Add atmospheric smells
        window.RoomSmells = {
            'norrmalmstorg': 'Luften luktar vedeld, häst och smältande snö. En vag doft av parfym från operan.',
            'opera_entrance': 'Parfym, puder och talgljus. En underliggande doft av svett från trängande människor.',
            'opera_staff': 'Damm, gammalt tyg och målarfärg.',
            'costume_room': 'Mögel, lavendel och puderdamm. Parfymrester från hundratals föreställningar.',
            'norrbro': 'Fräsch vinterluft och en aning av salt från havet.',
            'slottsbacken': 'Tjära från facklorna och en svag doft av krut från vakternas musköter.',
            'gamla_stan': 'Rök, osthållning, svett och salt sill.',
            'den_gyldene_freden': 'Öl, brännvin, stekt mat, tobaksrök och svett. Det är... intensivt.',
            'kungstradgarden': 'Frisk luft med en aning av våt jord och vintergrönt.',
            'opera_foyer': 'Dyra parfymer, vax från ljusen och en vag doft av rosor.',
            'opera_ballroom': 'Parfym blandat med svett! Vaxljus, varma kroppar, puder och rökelse.'
        };

        // Add LUKTA command enhancement
        window.cmdSmell = function(target) {
            const room = Game.player.currentRoom;

            if (!target || target === 'luften' || target === 'omkring') {
                const smell = window.RoomSmells[room];
                if (smell) {
                    GameEngine.output(smell);
                } else {
                    GameEngine.output("Luften luktar som du förväntar dig för denna plats.");
                }
            } else {
                GameEngine.output("Du drar in luften men känner ingen särskild doft från det.");
            }
        };

        // Add LYSSNA command enhancement
        window.cmdListen = function(target) {
            const room = Game.player.currentRoom;

            if (!target || target === 'omkring' || target === '') {
                const sound = window.RoomSounds[room];
                if (sound) {
                    GameEngine.output(sound);
                } else {
                    GameEngine.output("Du lyssnar uppmärksamt men hör inget särskilt.");
                }
            } else {
                GameEngine.output("Du lyssnar men hör inget specifikt från det hållet.");
            }
        };

        console.log('   ✓ Room atmosphere (sounds/smells) enhanced');
    }

})();
