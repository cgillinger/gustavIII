// ═══════════════════════════════════════════════════════════════════════════
// GAME REVIEW IMPROVEMENTS PART 2 - NPC Enhancements & System Integration
// ═══════════════════════════════════════════════════════════════════════════
//
// This file continues improvements from part 1:
// 1. COMPLETE NPC TOPIC COVERAGE - All NPCs can discuss all relevant topics
// 2. IMPROVED FRÅGA COMMAND - Uses personal fallbacks, better parsing
// 3. STANDARDIZED FLAGS - Consistent knowledge tracking
// 4. ADDITIONAL PARSER VERBS - More natural language support
// 5. CROSS-REFERENCES - NPCs mention each other appropriately
//
// Loading: After game-review-improvements.js
// ═══════════════════════════════════════════════════════════════════════════

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() {
            console.log('🎭 Loading Game Review Improvements Part 2...');

            completeNPCTopics();
            improveAskCommand();
            addAdditionalVerbs();
            standardizeKnowledgeFlags();
            addRoomSpecificResponses();

            console.log('✅ Game Review Improvements Part 2 loaded!');
        }, 1300); // Load after part 1
    });

    // ═══════════════════════════════════════════════════════════════════════
    // 1. COMPLETE NPC TOPIC COVERAGE
    // ═══════════════════════════════════════════════════════════════════════

    function completeNPCTopics() {
        // Universal topics that most NPCs should respond to
        const universalTopics = {
            'väder': {
                'default': "\"Kallt, eller hur? Denna mars är värre än vanligt.\"",
                'bellman': "Bellman rysser. \"Kallt som Fredmans själ efter en tom flaska! Men snart kommer våren, kamrat - och med den, varmare dagar och billigare brännvin!\"",
                'krogvärden': "\"Ja, det är kallt. Men värmen finns inomhus - ta en sup så blir du varm!\"",
                'portier': "\"Jag står ute i kylan hela dagen. Ja, det är kallt. Vad hade ni förväntat er?\"",
                'gustav_iii': "\"Mars i Stockholm - alltid oberäkneligt. Men snart kommer våren och med den, nya teatersäsonger!\""
            },
            'tid': {
                'default': "\"Det börjar bli sent. Kvällen drar sig fram.\"",
                'bellman': "\"Tiden? Vad är tid för en poet? Vi lever i ögonblicket, min vän! Carpe diem - grip dagen! Och natten!\"",
                'krogvärden': "\"Snart stänger jag för natten. Men det är tid kvar för ett glas till!\""
            },
            'pengar': {
                'default': "\"Pengar... alltid för lite av dem.\"",
                'bellman': "Bellman skrattar bittert. \"Pengar? Jag har inga! Men kungen ger mig pension - nog för brännvin och papper att skriva på. Vad mer behöver en poet?\"",
                'krogvärden': "\"Jag tar riksdaler, skilling, vad ni har. Bara det glimmar!\""
            },
            'kärlek': {
                'default': "\"Kärlek... ett komplicerat ämne.\"",
                'bellman': "Bellmans ögon blir fuktiga. \"Ah, kärlek! Min Ulla Winblad! Hon var som en ros - vacker men full av taggar. Jag älskade henne... älskar henne fortfarande, i mina sånger.\"",
                'gustav_iii': "\"Kärlek är för poeter och ungdomar. Jag har min plikt till Sverige.\""
            },
            'mat': {
                'default': "\"Mat? Fråga på en krog eller i ett kök.\"",
                'krogvärden': "\"Mat! Ja, vi har ärtsoppa, stekt sill, oxstek. Vad får det lov att vara?\"",
                'bellman': "\"Mat? Vem behöver mat när man har brännvin?\""
            },
            'musik': {
                'default': "\"Musik hörs ofta här i Stockholm - från operan, från krogarna.\"",
                'bellman': "Bellmans ansikte lyser upp! \"MUSIK! Det är mitt liv! Jag spelar cittra och sjunger mina visor - om Stockholm, om kärlek, om livets gränder och mörker. Vill du höra en?\"",
                'gustav_iii': "\"Musik är civilisationens krona! Jag älskar opera - Gluck, Mozart, mina egna kompositioner. Operan är mitt livsverk!\""
            },
            'stockholm': {
                'default': "\"Stockholm - Sveriges huvudstad. En vacker stad med mörka hemligheter.\"",
                'bellman': "\"Stockholm! Min stad! Jag känner varje gränd, varje krog, varje skugga. Det är här jag lever, andas, sjunger!\"",
                'krogvärden': "\"Stockholm är bra för affärer. Folk dricker, äter, pratar. Och jag lyssnar.\"",
                'gustav_iii': "\"Stockholm ska bli Nordens Paris! Jag bygger teatrar, akademier, monument. Min stad ska lysa!\""
            },
            'dig': {
                'default': "\"Vad vill du veta om mig?\"",
                'bellman': "\"Jag? Carl Michael Bellman - poet, musiker, drinkare! Sveriges störste skald, säger vissa. En utfattig drinkare, säger andra. Båda har rätt!\"",
                'krogvärden': "\"Jag är krogvärd här på Gyldene Freden. Tjänat öl och mat i tjugo år. Jag ser allt, hör allt.\"",
                'portier': "\"Jag är portier vid Kungliga Operan. Jag vaktar dörrarna och ser till att rätt folk kommer in.\"",
                'adelcrantz': "\"Jag är Carl Fredrik Adelcrantz, arkitekt. Jag ritade denna vackra opera!\""
            },
            'arbete': {
                'default': "\"Alla måste arbeta för sitt uppehälle.\"",
                'bellman': "\"Arbete? Mitt arbete är att sjunga och skriva! Att fånga Stockholms själ i vers!\"",
                'krogvärden': "\"Mitt arbete är att servera folk och hålla ordning. Det är hårt, men ärligt.\""
            }
        };

        // Add universal topics to all NPCs
        if (typeof Characters !== 'undefined') {
            for (let [charId, char] of Object.entries(Characters)) {
                if (char && char.dialogue) {
                    if (!char.dialogue.topics) {
                        char.dialogue.topics = {};
                    }

                    // Add universal topics if not already defined
                    for (let [topic, responses] of Object.entries(universalTopics)) {
                        if (!char.dialogue.topics[topic]) {
                            char.dialogue.topics[topic] = responses[charId] || responses['default'];
                        }
                    }
                }
            }
        }

        // Add specific missing topics for key NPCs
        addMissingNPCTopics();

        console.log('   ✓ Universal topics added to all NPCs');
    }

    function addMissingNPCTopics() {
        if (typeof Characters === 'undefined') return;

        // PORTIER - missing topics
        if (Characters.portier && Characters.portier.dialogue) {
            Object.assign(Characters.portier.dialogue.topics, {
                'biljett': "\"Biljetter köps vid kassan, eller så har ni fått en inbjudan. Utan biljett kommer ni inte in på föreställningarna.\"",
                'personal': "\"Personalen? De håller till i korridoren till vänster. Men besökare har inget där att göra - om ni inte har ärende.\"",
                'adelcrantz': "\"Herr Adelcrantz? Arkitekten. Han brukar vara i verkstaden, jobbar med sina dekorationer och ritningar.\"",
                'konspiratör': "\"Vad talar ni om? Jag vet ingenting om sådant. Jag vaktar bara dörren.\"",
                'bellman': "\"Poeten Bellman? Han har varit här ibland, på de offentliga föreställningarna. En... färgstark herre.\""
            });
        }

        // SCENARBETARE - Add dialogue if missing
        if (Characters.scenarbetare && Characters.scenarbetare.dialogue) {
            if (!Characters.scenarbetare.dialogue.topics) {
                Characters.scenarbetare.dialogue.topics = {};
            }
            Object.assign(Characters.scenarbetare.dialogue.topics, {
                'arbete': "\"Jag målar kulisser och bygger sceneri. Hårt jobb, men någon måste göra det.\"",
                'adelcrantz': "\"Herr Adelcrantz? Han är i verkstaden. Fin herre - behandlar oss arbetare med respekt, till skillnad från vissa.\"",
                'kläder': "\"Kostymer? Omklädningsrummet är där borta.\" Han pekar mot en dörr. \"Men rör inget om du inte har tillstånd.\"",
                'opera': "\"Operan är ett praktfullt ställe. Jag har arbetat här sedan den öppnade - 1782. Sett många föreställningar.\""
            });
        }

        // SILLGUMMA - Add complete dialogue
        if (Characters.sillgumma) {
            if (!Characters.sillgumma.dialogue) {
                Characters.sillgumma.dialogue = { first: '', topics: {} };
            }
            Characters.sillgumma.dialogue.first = Characters.sillgumma.dialogue.first ||
                "\"Sill! Färsk sill från Östersjön! Två öringar styck!\" ropar gumman. Hon ser trött ut men fortsätter ropa.";

            Object.assign(Characters.sillgumma.dialogue.topics, {
                'sill': "\"Bästa sillen i Stockholm! Saltad idag, färsk igår! Två öringar - en för dig, en för familjen!\"",
                'arbete': "\"Jag säljer sill. Varje dag, i ur och skur. Det är inte mycket, men det håller mig vid liv.\"",
                'pengar': "\"Pengar? Ha! Jag knappt får ihop till bröd. Men gud ger, gud tar.\"",
                'gamla stan': "\"Jag har bott här i femtio år. Sett stadsdelen förändras, sett kungar komma och gå.\"",
                'kungen': "\"Kungen? Han bryr sig inte om oss fattiga. Han leker i sin opera medan vi fryser.\""
            });
        }

        // KAROLINER (guards) - Add dialogue
        const karolinerKeys = ['karolin_1', 'karolin_2', 'karolin'];
        karolinerKeys.forEach(key => {
            if (Characters[key]) {
                if (!Characters[key].dialogue) {
                    Characters[key].dialogue = { first: '', topics: {} };
                }
                Characters[key].dialogue.first = Characters[key].dialogue.first ||
                    "Karolinen ser strängt på dig. \"Halt! Vad är ert ärende?\"";

                Object.assign(Characters[key].dialogue.topics, {
                    'slottet': "\"Hans Majestäts residens. Obehöriga äga ej tillträde.\"",
                    'kungen': "\"Vi tjänar Hans Majestät. Mer behöver ni inte veta.\"",
                    'vakt': "\"Vi vaktar slottet dag och natt. Ingen kommer förbi utan tillstånd.\"",
                    'arbete': "\"Vår plikt är att skydda kungen och slottet. Det är allt.\"",
                    'uniform': "\"Karolinska uniformen. Blå rock, höga hattar. Vi tjänar Sverige.\""
                });
            }
        });

        // VAKTPOST at Norrmalmstorg
        if (Characters.vaktpost) {
            if (!Characters.vaktpost.dialogue) {
                Characters.vaktpost.dialogue = { first: '', topics: {} };
            }
            Characters.vaktpost.dialogue.first = Characters.vaktpost.dialogue.first ||
                "Vaktposten ser på dig med professionell uppmärksamhet. \"God kväll.\"";

            Object.assign(Characters.vaktpost.dialogue.topics, {
                'operan': "\"Kungliga Operan. Föreställningar varje kväll. Biljetter vid kassan.\"",
                'kungen': "\"Hans Majestät besöker operan ofta. Han älskar musik, sägs det.\"",
                'ordning': "\"Jag ser till att ordningen upprätthålls här på torget.\"",
                'torget': "\"Norrmalmstorg - stadens hjärta. Operan, palatset, vägen till slottet.\"",
                'misstänkt': "\"Misstänkta personer? Jag ser många människor varje dag. Några ser skumma ut.\""
            });
        }

        console.log('   ✓ Missing NPC topics filled in');
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 2. IMPROVED FRÅGA COMMAND
    // ═══════════════════════════════════════════════════════════════════════

    function improveAskCommand() {
        // Override cmdAsk to use personal fallbacks
        if (typeof GameEngine !== 'undefined' && GameEngine.cmdAsk) {
            const originalCmdAsk = GameEngine.cmdAsk;

            GameEngine.cmdAsk = function(query) {
                // Parse "fråga [person] om [ämne]"
                const parts = query.split(' om ');
                if (parts.length < 2) {
                    this.output("Fråga vem om vad? (t.ex. 'fråga bellman om konspiration')");
                    return;
                }

                const personName = parts[0].trim().replace(/^med\s+/i, ''); // Remove "med" if present
                const topic = parts[1].trim().toLowerCase();

                const room = Rooms[Game.player.currentRoom];
                if (!room || !room.characters) {
                    this.output("Det finns ingen här att fråga.");
                    return;
                }

                // Find character
                let foundChar = null;
                for (let charId of room.characters) {
                    const char = Characters[charId];
                    if (char && char.keywords && char.keywords.some(k => personName.toLowerCase().includes(k.toLowerCase()))) {
                        foundChar = { id: charId, char: char };
                        break;
                    }
                }

                if (!foundChar) {
                    this.output(`Jag ser ingen "${personName}" här.`);
                    return;
                }

                // Check if character has that topic
                const dialogue = foundChar.char.dialogue;

                // Try exact match first
                if (dialogue.topics && dialogue.topics[topic]) {
                    this.output(`<div class="dialogue">${dialogue.topics[topic]}</div>`);
                    handleTopicKnowledge(topic, foundChar.id);
                    return;
                }

                // Try partial match
                if (dialogue.topics) {
                    for (let [key, response] of Object.entries(dialogue.topics)) {
                        if (key.includes(topic) || topic.includes(key)) {
                            this.output(`<div class="dialogue">${response}</div>`);
                            handleTopicKnowledge(key, foundChar.id);
                            return;
                        }
                    }
                }

                // Use personal fallback instead of generic message
                if (window.getNPCFallback) {
                    const fallback = window.getNPCFallback(foundChar.id);
                    this.output(`<div class="dialogue">${fallback}</div>`);
                } else {
                    this.output(`<div class="dialogue">${foundChar.char.name} verkar inte ha något att säga om "${topic}".</div>`);
                }
            };
        }

        // Helper function to track knowledge from conversations
        function handleTopicKnowledge(topic, charId) {
            const knowledgeMap = {
                'anckarström': ['anckarstrom_mentioned', 'heard_about_anckarstrom'],
                'anckarstrom': ['anckarstrom_mentioned', 'heard_about_anckarstrom'],
                'konspiration': ['heard_about_conspiracy'],
                'pechlin': ['heard_about_pechlin'],
                'pistoler': ['heard_about_pistols'],
                'maskeradbal': ['heard_about_ball'],
                'varning': ['heard_warning']
            };

            const flags = knowledgeMap[topic];
            if (flags && Array.isArray(flags)) {
                flags.forEach(flag => {
                    if (!Game.player.knowledge.includes(flag)) {
                        Game.player.knowledge.push(flag);
                    }
                });

                // Special: Update quest progress
                if (topic === 'anckarström' || topic === 'anckarstrom') {
                    Game.player.questProgress.learnedAboutConspiracy = true;
                }
            }

            // Track who player has talked to
            if (!Game.player.knowledge.includes(`talked_to_${charId}`)) {
                Game.player.knowledge.push(`talked_to_${charId}`);
            }
        }

        console.log('   ✓ FRÅGA command improved with fallbacks');
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 3. ADDITIONAL PARSER VERBS
    // ═══════════════════════════════════════════════════════════════════════

    function addAdditionalVerbs() {
        if (typeof GameEngine === 'undefined') return;

        // Store original processCommand
        const originalProcess = GameEngine.processCommand;

        GameEngine.processCommand = function(input) {
            const lowerInput = input.toLowerCase().trim();
            const parsed = Parser.parse(input);

            // Handle new verbs
            switch(parsed.verb) {
                case 'lukta':
                case 'sniffa':
                    this.output(`<div class="command-echo">&gt; ${input}</div>`);
                    if (window.cmdSmell) {
                        window.cmdSmell(parsed.object);
                    } else {
                        this.output("Du drar in luften. " + (window.RoomSmells && window.RoomSmells[Game.player.currentRoom] || "Inget särskilt att notera."));
                    }
                    return;

                case 'lyssna':
                case 'hör':
                    this.output(`<div class="command-echo">&gt; ${input}</div>`);
                    if (window.cmdListen) {
                        window.cmdListen(parsed.object);
                    } else {
                        this.output("Du lyssnar uppmärksamt. " + (window.RoomSounds && window.RoomSounds[Game.player.currentRoom] || "Du hör de vanliga ljuden."));
                    }
                    return;

                case 'läs':
                    this.output(`<div class="command-echo">&gt; ${input}</div>`);
                    // Treat "läs" as "undersök" for readable items
                    this.cmdExamine(parsed.object);
                    return;

                case 'knacka':
                    this.output(`<div class="command-echo">&gt; ${input}</div>`);
                    this.output("Du knackar. Inget händer.");
                    return;

                case 'sjung':
                case 'vissla':
                    this.output(`<div class="command-echo">&gt; ${input}</div>`);
                    if (Game.player.currentRoom === 'den_gyldene_freden') {
                        this.output("Bellman tittar upp med intresse. \"Jaså, en sångfågel! Vill du sjunga med mig?\"");
                    } else {
                        this.output("Du nynnar lite för dig själv. Några förbipasserande tittar konstigt på dig.");
                    }
                    return;

                case 'dansa':
                    this.output(`<div class="command-echo">&gt; ${input}</div>`);
                    if (Game.player.currentRoom === 'opera_ballroom') {
                        this.output("Du svingar dig in i dansen! Musiken bär dig och för ett ögonblick glömmer du ditt uppdrag...");
                    } else {
                        this.output("Det här är varken tid eller plats för dans.");
                    }
                    return;

                case 'tänk':
                case 'fundera':
                    this.output(`<div class="command-echo">&gt; ${input}</div>`);
                    // Give a hint based on current state
                    if (window.getContextualHint) {
                        this.output("Du funderar över din situation...");
                        this.output(`<div class="narrator">${window.getContextualHint()}</div>`);
                    } else {
                        this.output("Du funderar över din situation, men kommer inte på något nytt.");
                    }
                    return;

                case 'be':
                case 'bed':
                    this.output(`<div class="command-echo">&gt; ${input}</div>`);
                    this.output("Du sänker huvudet i en kort bön. Det ger dig en känsla av lugn.");
                    return;

                case 'skrik':
                case 'ropa':
                    this.output(`<div class="command-echo">&gt; ${input}</div>`);
                    if (Game.player.currentRoom === 'opera_ballroom') {
                        // Special case - handled elsewhere
                        return originalProcess.call(this, input);
                    }
                    this.output("Du ropar, men ingen verkar bry sig särskilt.");
                    return;

                case 'spring':
                    this.output(`<div class="command-echo">&gt; ${input}</div>`);
                    this.output("Du börjar springa, men inser att du inte vet vart. Kanske bättre att gå lugnt?");
                    return;

                case 'hoppa':
                    this.output(`<div class="command-echo">&gt; ${input}</div>`);
                    this.output("Du hoppar lite på stället. Känns bättre nu.");
                    return;

                case 'sitt':
                case 'sätt':
                    this.output(`<div class="command-echo">&gt; ${input}</div>`);
                    const room = Rooms[Game.player.currentRoom];
                    if (room && room.items && (room.items.includes('bänk') || room.items.includes('stol'))) {
                        this.output("Du sätter dig ner en stund och vilar benen.");
                    } else if (Game.player.currentRoom === 'den_gyldene_freden') {
                        this.output("Du sätter dig vid ett av de långa träborden. Bänken är hård men välkomnande.");
                    } else {
                        this.output("Det finns ingenstans lämpligt att sitta här.");
                    }
                    return;

                case 'sov':
                case 'vila':
                    // Let original handler deal with this
                    break;
            }

            // Fall back to original processing
            originalProcess.call(this, input);
        };

        console.log('   ✓ Additional verbs added (lukta, lyssna, läs, sjung, etc.)');
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 4. STANDARDIZED KNOWLEDGE FLAGS
    // ═══════════════════════════════════════════════════════════════════════

    function standardizeKnowledgeFlags() {
        // Define standard flag names
        window.KnowledgeFlags = {
            // Meeting NPCs
            MET_BELLMAN: 'met_bellman',
            MET_ADELCRANTZ: 'met_adelcrantz',
            MET_PORTIER: 'met_portier',
            MET_KROGVARDEN: 'met_krogvärden',
            MET_GUSTAV: 'met_gustav_iii',
            MET_VONESSEN: 'met_von_essen',
            MET_PECHLIN: 'met_pechlin',
            MET_ANCKARSTROM: 'met_anckarstrom',

            // Learning about conspiracy
            HEARD_ABOUT_CONSPIRACY: 'heard_about_conspiracy',
            HEARD_ABOUT_ANCKARSTROM: 'heard_about_anckarstrom',
            HEARD_ABOUT_PECHLIN: 'heard_about_pechlin',
            HEARD_ABOUT_PISTOLS: 'heard_about_pistols',
            OVERHEARD_CONSPIRACY: 'overheard_conspiracy',

            // Evidence
            HAS_PISTOL_EVIDENCE: 'has_pistol_evidence',
            HAS_WARNING_LETTER: 'has_warning_letter',
            SHOWED_EVIDENCE_TO_KING: 'showed_evidence_to_king',

            // Actions
            WARNED_KING: 'warned_king',
            CONFRONTED_ANCKARSTROM: 'confronted_anckarstrom',
            VISITED_PECHLIN: 'visited_pechlin'
        };

        // Helper function to add knowledge
        window.addKnowledge = function(flag) {
            if (!Game.player.knowledge.includes(flag)) {
                Game.player.knowledge.push(flag);
                console.log(`[Knowledge] Added: ${flag}`);
            }
        };

        // Helper function to check knowledge
        window.hasKnowledge = function(flag) {
            return Game.player.knowledge.includes(flag);
        };

        console.log('   ✓ Knowledge flags standardized');
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 5. ROOM-SPECIFIC RESPONSES
    // ═══════════════════════════════════════════════════════════════════════

    function addRoomSpecificResponses() {
        // Special responses for specific commands in specific rooms
        window.RoomSpecificResponses = {
            'norrmalmstorg': {
                'titta operan': 'Kungliga Operahuset reser sig majestätiskt framför dig. Ljus strömmar från fönstren och du hör dämpad musik.',
                'titta himmel': 'Natthimlen är mulen med glimtar av stjärnor. Månen skymtar bakom moln.',
                'titta folk': 'Människor i tidstypiska kläder rör sig över torget - adelsmän, betjänter, tjänstefolk.',
                'känna': 'Kylan biter i kinderna. Luften luktar rök och häst.'
            },
            'den_gyldene_freden': {
                'titta hörn': 'I hörnet sitter en grupp adelsmän och viskar intensivt. Bellman sitter vid ett annat bord.',
                'titta bellman': 'Bellman sitter med ett ölstop och ser tankfull ut. Hans ögon är rödsprängda men intelligenta.',
                'titta adelsmän': 'Gruppen adelsmän ser misstänksamma ut. De pratar lågt och tittar sig omkring.',
                'lyssna samtal': 'Du försöker höra vad adelsmännen säger, men de pratar för tyst. Du hör bara fragment: "...kungen..." "...måste göras..."'
            },
            'costume_room': {
                'titta spegel': 'Du ser dig själv i spegeln. I dessa kläder skulle du kunna vara vem som helst från 1792.',
                'titta kostymer': 'Kostymer från hundratals operor - kungar, drottningar, bönder, soldater, mytologiska figurer.',
                'prova kläder': 'Du tittar på kläderna. De ser ut att passa. Du kan TA dem och sedan ANVÄNDA dem.'
            },
            'opera_ballroom': {
                'titta kungen': 'Kungen är lätt att känna igen trots masken - ordensstjärnorna på bröstet avslöjar honom.',
                'titta masker': 'Hundratals masker - vita, svarta, groteska, vackra. Alla gömmer sina bärares identitet.',
                'titta svarta kappor': 'Flera män i svarta kappor och vita masker rör sig genom folkmassan. De verkar koordinerade...',
                'hitta anckarström': 'Du letar efter Anckarström bland de svartklädda männen. En av dem verkar nervösare än de andra...'
            }
        };

        // Hook into cmdLook for room-specific responses
        if (typeof GameEngine !== 'undefined') {
            const originalCmdLook = GameEngine.cmdLook;
            GameEngine.cmdLook = function(target) {
                const room = Game.player.currentRoom;
                const roomResponses = window.RoomSpecificResponses[room];

                if (roomResponses && target) {
                    const key = `titta ${target.toLowerCase()}`;
                    if (roomResponses[key]) {
                        this.output(roomResponses[key]);
                        return;
                    }
                }

                // Fall back to original
                originalCmdLook.call(this, target);
            };
        }

        console.log('   ✓ Room-specific responses added');
    }

})();
