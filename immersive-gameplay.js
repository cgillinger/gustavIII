// ==========================================
// IMMERSIVE GAMEPLAY ENHANCEMENTS
// ==========================================
// Removes visual hints, adds command synonyms, scenery examination, etc.

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {

        console.log('🎮 Loading immersive gameplay enhancements...');

        // ===== 1. REMOVE SUGGESTION BUTTONS =====
        // Make it a PURE text adventure without visual hints

        if (typeof GameEngine !== 'undefined' && GameEngine.updateSuggestions) {
            GameEngine.updateSuggestions = function() {
                // Override to do nothing - no suggestions shown
                const container = document.getElementById('suggestions');
                if (container) {
                    container.innerHTML = ''; // Clear all suggestions
                }
            };
        }

        // ===== 2. COMMAND SYNONYMS =====
        // Add more natural ways to say things

        if (typeof Parser !== 'undefined' && Parser.synonyms) {
            // Extend existing synonyms
            Object.assign(Parser.synonyms, {
                // Look synonyms
                'titta': ['se', 'kolla', 'observera', 'granska', 'betrakta'],
                'titta omkring': ['se dig omkring', 'titta dig omkring', 'se omkring', 'kolla omkring'],
                'undersök': ['inspektera', 'granska', 'studera', 'titta på', 'se på', 'kolla på'],

                // Movement synonyms
                'gå': ['rör', 'vandra', 'promenera', 'bege'],
                'spring': ['rusa', 'skynda'],

                // Interaction synonyms
                'ta': ['plocka upp', 'lyft', 'grip'],
                'använd': ['bruk', 'nyttja'],
                'prata': ['tala', 'konversera', 'samtala', 'snacka'],

                // Thinking/contemplation
                'tänk': ['fundera', 'begrunda', 'reflektera', 'meditera'],
                'sitt': ['sätt dig', 'ta plats'],
                'stå': ['res dig', 'stå upp'],
                'ligg': ['lägg dig'],

                // Special
                'hjälp': ['help', 'commands', 'kommandon']
            });
        }

        // ===== 3. COMMAND ECHO SYSTEM =====
        // Show what the system understood

        if (typeof GameEngine !== 'undefined') {
            const originalProcessCommand = GameEngine.processCommand;

            GameEngine.processCommand = function(input) {
                if (!input || !input.trim()) return;

                const trimmedInput = input.trim().toLowerCase();

                // Parse the command
                const parsed = Parser.parse(trimmedInput);

                // Show echo of what we understood (only for actual game commands, not meta)
                if (parsed.verb && !['hjälp', 'help', 'achievements', 'spara', 'ladda'].includes(parsed.verb)) {
                    let echoText = '';

                    // Map to canonical form
                    const verbMap = {
                        'se': 'tittar',
                        'titta': 'tittar',
                        'kolla': 'tittar',
                        'undersök': 'undersöker',
                        'inspektera': 'undersöker',
                        'gå': 'går',
                        'rör': 'går',
                        'ta': 'tar',
                        'plocka': 'tar',
                        'prata': 'pratar',
                        'tala': 'pratar',
                        'använd': 'använder',
                        'öppna': 'öppnar',
                        'stäng': 'stänger',
                        'tänk': 'tänker',
                        'sitt': 'sätter dig',
                        'fråga': 'frågar'
                    };

                    const canonicalVerb = verbMap[parsed.verb] || parsed.verb;

                    if (parsed.object) {
                        echoText = `<span style="opacity: 0.6; font-style: italic;">(${canonicalVerb} ${parsed.object})</span>`;
                    } else {
                        echoText = `<span style="opacity: 0.6; font-style: italic;">(${canonicalVerb})</span>`;
                    }

                    this.output(echoText);
                }

                // Call original processor
                return originalProcessCommand.call(this, input);
            };
        }

        // ===== 4. SCENERY EXAMINATION SYSTEM =====
        // Let players examine things mentioned in descriptions

        const SceneryDatabase = {
            // Universal scenery (exists in multiple rooms)
            'himmel': 'Himlen är grå och tung av marsmoln. Snön smälter långsamt.',
            'moln': 'Tjocka vintermoln hänger lågt över staden.',
            'sol': 'Solen är svag denna marsmånad, mer vit än gul.',
            'måne': 'Du kan inte se månen just nu.',
            'stjärnor': 'Det är dag, du kan inte se stjärnor.',
            'luft': 'Luften är kall och fuktig. Du känner doften av ved, hästspillning och något mer... karamelliserat socker från en försäljare?',

            // Norrmalmstorg
            'kullersten': 'Slitna runda stenar, blanka av tusentals fötter och hästhovar. Snö och smältvatten samlas i springorna.',
            'operahuset': 'Den gula fasaden är imponerande. Kolonner, ornament, fönster som glittrar. Kungens stolthet.',
            'operan': 'Den gula fasaden är imponerande. Kolonner, ornament, fönster som glittrar. Kungens stolthet.',
            'palats': 'Ett ståtligt stenhus med många fönster.',
            'slott': 'Kungliga slottet reser sig massivt över vattnet. Stenmurer, torn, flaggor.',

            // Kungsträdgården
            'träd': 'Kala grenar sträcker sig mot himlen. På våren blommar de vackert, men nu är de nakna.',
            'grenar': 'Tunna vinterkvistar utan löv. De knastrar i vinden.',
            'bänk': 'En enkel träbänk, sliten av väder och ålder. Perfekt för att vila fötterna en stund.',
            'gräs': 'Gräset är brunt och trasigt efter vintern. Här och var syns gröna skott som väntar på våren.',
            'blomster': 'Det är för tidigt på året för blommor.',
            'blommor': 'Det är för tidigt på året för blommor.',

            // Streets & buildings
            'hus': 'Höga stenhus med putsfasader. Många är från 1600-talet eller tidigare.',
            'fasad': 'Putsfasader i varma färger - ockra, rött, brunt.',
            'fönster': 'Små rutor med gamla glas. Inifrån flimrar ljussken.',
            'dörr': 'En kraftig trädörr med järnbeslag.',
            'tak': 'Tegeltak med skorstenar som spyr upp rök.',
            'skorsten': 'Rök stiger från skorstenen. Någon eldar för att hålla värmen.',
            'gata': 'En kullerstensgata, smal och krokig på medeltida vis.',
            'väg': 'En kullerstensgata, smal och krokig på medeltida vis.',

            // People (generic)
            'folk': 'Människor i tricornes, långa kappor, kjolar. De rör sig med ärenden du inte känner till.',
            'människor': 'Människor i tricornes, långa kappor, kjolar. De rör sig med ärenden du inte känner till.',
            'folkmassa': 'En blandning av adelsmän, borgare, tjänare, soldater. Stockholm 1792 i all sin ståt.',

            // Generic objects
            'ljus': 'Flimrande ljus från stearinljus eller oljelampor. Elden dansar.',
            'eld': 'Elden värmer och lyser. Den är liv i detta kalla klimat.',

            // Time period markers
            'klocka': 'Du har ingen klocka. Tiden flyter annorlunda här. Men du vet att det är mars 1792.',
            'tid': 'Tiden... du är här för att förändra den.',

            // Water/nature
            'vatten': 'Kallt, mörkt vatten. Det rör sig långsamt.',
            'is': 'Isen har börjat smälta, men det finns fortfarande fläckar av is längs kajerna.',
            'snö': 'Smältande snö ligger i högar längs väggarna. Gråbrun av smuts.'
        };

        // Override cmdExamine to include scenery
        if (typeof GameEngine !== 'undefined') {
            const originalCmdExamine = GameEngine.cmdExamine;

            GameEngine.cmdExamine = function(target) {
                if (!target) {
                    this.output("Undersöka vad?");
                    return;
                }

                // First try normal item examination
                let foundItem = false;
                for (let itemId of Game.player.inventory) {
                    const item = Items[itemId];
                    if (item && item.keywords.some(k => target.includes(k))) {
                        this.output(`<div class="item-desc"><strong>${item.name}</strong><br>${item.description}</div>`);
                        foundItem = true;
                        break;
                    }
                }

                if (foundItem) return;

                // Check room items
                const room = Rooms[Game.player.currentRoom];
                if (room && room.items) {
                    for (let itemId of room.items) {
                        const item = Items[itemId];
                        if (item && item.keywords.some(k => target.includes(k))) {
                            this.output(`<div class="item-desc"><strong>${item.name}</strong><br>${item.description}</div>`);
                            foundItem = true;
                            break;
                        }
                    }
                }

                if (foundItem) return;

                // Check scenery database
                const targetWords = target.split(' ');
                for (let word of targetWords) {
                    if (SceneryDatabase[word]) {
                        this.output(`<div class="narrator">${SceneryDatabase[word]}</div>`);
                        return;
                    }
                }

                // Fallback
                this.output("Du ser inget särskilt intressant.");
            };
        }

        // ===== 5. SUB-LOCATION SYSTEM =====
        // "gå till bänk" - examine without changing room

        if (typeof GameEngine !== 'undefined') {
            const originalCmdGo = GameEngine.cmdGo;

            GameEngine.cmdGo = function(direction) {
                // Check if it's "gå till X" pattern
                const input = direction.toLowerCase();

                // Sub-location keywords
                const subLocations = {
                    'bänk': 'Du går fram till bänken. Den ser sliten ut, men ändå inbjudande. Perfekt för att vila en stund och tänka.',
                    'brunn': 'Du går fram till brunnen och tittar ner. Vattnet är mörkt och djupt. Barn leker fortfarande runt dig.',
                    'träd': 'Du går fram till trädet. Barken är grov och full av sprickor. Grenarna är kala, men starka.',
                    'fönster': 'Du går närmare fönstret. Genom de små rutorna skymtar du aktivitet inuti.',
                    'dörr': 'Du går fram till dörren. Den är kraftig och väl byggd.'
                };

                // Check if direction contains "till"
                if (input.includes('till ')) {
                    const target = input.split('till ')[1];
                    if (subLocations[target]) {
                        this.output(`<div class="narrator">${subLocations[target]}</div>`);
                        return;
                    }
                }

                // Otherwise, normal movement
                return originalCmdGo.call(this, direction);
            };
        }

        // ===== 6. INTERACTION COMMANDS WITH GRACEFUL FALLBACKS =====
        // Handle things like "sitt på bänk", "klättra i träd", etc.

        if (typeof GameEngine !== 'undefined') {
            GameEngine.cmdSit = function() {
                const room = Rooms[Game.player.currentRoom];

                // Check if there's something to sit on in room
                if (room.items && (room.items.includes('bänk') || room.items.includes('stol') || room.items.includes('sofa'))) {
                    this.output('<div class="narrator">Du sätter dig ner en stund och vilar benen. Det känns skönt efter all vandring.</div>');
                } else {
                    this.output('<div class="narrator">Du hittar ingenstans bekvämt att sitta här.</div>');
                }
            };

            GameEngine.cmdStand = function() {
                this.output('<div class="narrator">Du står redan upp.</div>');
            };

            GameEngine.cmdLie = function() {
                this.output('<div class="narrator">Det här är knappast rätt plats att lägga sig.</div>');
            };

            GameEngine.cmdClimb = function(target) {
                if (!target) {
                    this.output("Klättra i vad?");
                    return;
                }

                this.output('<div class="narrator">Det verkar inte vara en bra idé att klättra där.</div>');
            };

            GameEngine.cmdJump = function() {
                this.output('<div class="narrator">Du hoppar på stället. Ingenting speciellt händer.</div>');
            };

            GameEngine.cmdSwim = function() {
                this.output('<div class="narrator">Det finns inget vatten att simma i här. Och i mars skulle det vara livsfarligt!</div>');
            };

            // Generic graceful fallback
            GameEngine.cmdGenericFallback = function(action) {
                const responses = [
                    'Det fungerar inte här.',
                    'Du kan inte göra det just nu.',
                    'Det är ingen bra idé.',
                    'Kanske en annan gång.',
                    'Du prövar, men det leder ingenvart.'
                ];
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                this.output(`<div class="narrator">${randomResponse}</div>`);
            };
        }

        // ===== 7. EASTER EGG COMMANDS =====
        // Special responses for natural actions mentioned in descriptions

        if (typeof GameEngine !== 'undefined') {
            GameEngine.cmdThink = function() {
                const thinkingResponses = [
                    'Du stannar upp och tänker efter. <em>Varför är du här? För att rädda kungen. Men också... för att se historien med egna ögon.</em>',
                    'Du funderar på situationen. <em>Mars 1792. Om två dagar kommer Gustaf III att skjutas. Kan du verkligen förändra historien?</em>',
                    'Du samlar dina tankar. <em>Vad skulle hända om kungen överlevde? Skulle Sverige bli annorlunda? Skulle DU kunna ta dig hem?</em>',
                    'En stund av eftertanke. <em>Bellman sjunger om vin och vänner. Men bakom kulisserna planerar män mord. Vilket Stockholm är detta egentligen?</em>'
                ];
                const randomThought = thinkingResponses[Math.floor(Math.random() * thinkingResponses.length)];
                this.output(`<div class="narrator">${randomThought}</div>`);
            };

            GameEngine.cmdPray = function() {
                this.output('<div class="narrator">Du ber en tyst bön. Kanske för kungen. Kanske för dig själv. <em>Gud, om du finns... hjälp mig göra rätt.</em></div>');
            };

            GameEngine.cmdSing = function() {
                this.output('<div class="narrator">Du nynnar lite för dig själv. Det ekar mellan husen. Några förbipasserande tittar förvånat på dig.</div>');
            };

            GameEngine.cmdDance = function() {
                this.output('<div class="narrator">Du gör några danssteg. En kvinna med korg skrattar. "För tidigt på dagen för dans, min herre!"</div>');
            };

            GameEngine.cmdScream = function() {
                this.output('<div class="narrator">Du öppnar munnen för att skrika... men hejdar dig. Det skulle bara väcka uppmärksamhet.</div>');
            };

            GameEngine.cmdSmell = function() {
                const room = Rooms[Game.player.currentRoom];
                const smells = {
                    'norrmalmstorg': 'Lukten av hästspillning, ved från spisar, och något söt¤ - karamelliserade nötter från en försäljare.',
                    'opera_entrance': 'Parfym, puder, och ljusvax. Operans signaturdoft.',
                    'den_gyldene_freden': 'Öl, brännvin, tobaksrök och stekt kött. Krogdofter.',
                    'kungstradgarden': 'Frisk luft, fuktigt gräs, och en antydan av vår på väg.'
                };

                const smell = smells[Game.player.currentRoom] || 'Du känner dofterna av 1700-talets Stockholm - ved, hästar, och människor.';
                this.output(`<div class="narrator">${smell}</div>`);
            };
        }

        // ===== 8. EXTEND COMMAND PROCESSOR =====
        // Hook in all the new commands

        if (typeof GameEngine !== 'undefined') {
            const originalProcessCommand = GameEngine.processCommand;

            GameEngine.processCommand = function(input) {
                if (!input || !input.trim()) return;

                const trimmedInput = input.trim().toLowerCase();
                const parsed = Parser.parse(trimmedInput);
                const verb = parsed.verb;
                const obj = parsed.object;

                // New commands
                if (verb === 'sitt' || verb === 'sätt') {
                    this.cmdSit();
                    return;
                }

                if (verb === 'stå' || verb === 'res') {
                    this.cmdStand();
                    return;
                }

                if (verb === 'ligg' || verb === 'lägg') {
                    this.cmdLie();
                    return;
                }

                if (verb === 'klättra') {
                    this.cmdClimb(obj);
                    return;
                }

                if (verb === 'hoppa' || verb === 'hopp') {
                    this.cmdJump();
                    return;
                }

                if (verb === 'simma' || verb === 'sim') {
                    this.cmdSwim();
                    return;
                }

                if (verb === 'tänk' || verb === 'fundera' || verb === 'begrunda') {
                    this.cmdThink();
                    return;
                }

                if (verb === 'be' || verb === 'bed') {
                    this.cmdPray();
                    return;
                }

                if (verb === 'sjung' || verb === 'nynna') {
                    this.cmdSing();
                    return;
                }

                if (verb === 'dansa') {
                    this.cmdDance();
                    return;
                }

                if (verb === 'skrik' || verb === 'ropa') {
                    // Special: ROPA is important in climax!
                    if (Game.player.currentRoom === 'opera_ballroom') {
                        // Let original handler deal with it
                        return originalProcessCommand.call(this, input);
                    }
                    this.cmdScream();
                    return;
                }

                if (verb === 'lukta' || verb === 'sniffa' || verb === 'dofta') {
                    this.cmdSmell();
                    return;
                }

                // Call original processor for everything else
                return originalProcessCommand.call(this, input);
            };
        }

        console.log('✨ Immersive gameplay enhancements loaded!');
        console.log('   - Suggestions hidden');
        console.log('   - Command synonyms expanded');
        console.log('   - Command echo active');
        console.log('   - Scenery examination enabled');
        console.log('   - Sub-locations enabled');
        console.log('   - Interaction commands enabled');
        console.log('   - Easter eggs enabled');

    }, 900); // Load after other systems
});
