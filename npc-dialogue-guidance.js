// ═══════════════════════════════════════════════════════════════════════════
// NPC DIALOGUE GUIDANCE SYSTEM
// ═══════════════════════════════════════════════════════════════════════════
//
// Implementerar handbokens principer för NPC-dialoger:
// 1. NPCs självpositionering - signalerar informationsdomän
// 2. Miljömarkörer - pekar mot NPCs kunskap
// 3. Korsreferenser - NPCs nämner andra NPCs
// 4. Nära-miss responser - vägleder när spelaren är "nära"
// 5. Inga generiska "Jag vet inget" - personliga omdirigeringar
//
// Loading: 1800ms - Efter bugfixes-batch6
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {

        console.log('🎭 Loading NPC Dialogue Guidance System...');

        // ═══════════════════════════════════════════════════════════════════
        // NPC INFORMATIONSDOMÄNER
        // ═══════════════════════════════════════════════════════════════════

        const NPCDomains = {
            adelcrantz: {
                name: 'Adelcrantz',
                domains: ['tillträde', 'biljett', 'operan', 'byggnaden', 'hovet', 'konspiration', 'kungen'],
                personality: 'försiktig men villig att hjälpa',
                redirect: 'arkitektur, tillträde eller hovets hemligheter'
            },
            portier: {
                name: 'Portiern',
                domains: ['biljett', 'kläder', 'balen', 'gäster', 'regler', 'personal'],
                personality: 'formell men pratglad om rätt saker',
                redirect: 'operans regler, gäster eller personal'
            },
            bellman: {
                name: 'Bellman',
                domains: ['stockholm', 'visor', 'politik', 'pechlin', 'livet', 'kärlek'],
                personality: 'filosofisk och indirekt',
                redirect: 'Stockholm, politik eller livets gåtor'
            },
            krogvarden: {
                name: 'Krogvärden',
                domains: ['rykten', 'gäster', 'anckarström', 'adeln', 'brännvin'],
                personality: 'diskret men vet allt',
                redirect: 'gäster, rykten eller vad som sägs i krogarna'
            },
            vahlberg: {
                name: 'Wåhlberg',
                domains: ['vapen', 'pistoler', 'anckarström', 'beställningar', 'kunder'],
                personality: 'stolt yrkesman, orolig över konstiga beställningar',
                redirect: 'vapen, pistoler eller märkliga kunder'
            },
            scenarbetare: {
                name: 'Målaren',
                domains: ['kulisser', 'operan', 'bakom scenen', 'kostymer'],
                personality: 'konstnärlig, ser saker andra missar',
                redirect: 'operans inre liv eller vad som händer bakom kulisserna'
            },
            vonEssen: {
                name: 'von Essen',
                domains: ['kungen', 'säkerhet', 'hot', 'livgardet', 'lojalitet'],
                personality: 'lojal, misstänksam mot främlingar',
                redirect: 'kungens säkerhet eller livgardets uppgifter'
            },
            karolin_1: {
                name: 'Karolinen',
                domains: ['anckarström', 'militär', 'historia', 'vapen', 'rykten'],
                personality: 'gammal soldat, hört mycket',
                redirect: 'gamla tider, militärt skvaller eller märkliga typer'
            }
        };

        // ═══════════════════════════════════════════════════════════════════
        // 1. OMSKRIVNA NPC-INTRODUKTIONER (självpositionering)
        // ═══════════════════════════════════════════════════════════════════

        if (typeof Characters !== 'undefined') {

            // ADELCRANTZ - arkitekt med hovkontakter
            if (Characters.adelcrantz) {
                Object.defineProperty(Characters.adelcrantz.dialogue, 'first', {
                    get: function() {
                        const hasModernClothes = Game.player.hasModernClothes !== false;

                        const clothingComment = hasModernClothes
                            ? `Han stannar upp och betraktar dina kläder med höjda ögonbryn.

"Nåväl... en ovanlig dräkt. Från utlandet, kanske?"

`
                            : `Han nickar godkännande åt din sidenrock.

`;

                        return `${clothingComment}Den äldre mannen reser sig från sina ritningar och gör en värdig bugning.

"Carl Fredrik Adelcrantz - hovarkitekt."

Han sveper med handen över rummet fullt av ritningar.

"Jag ritar hus. Men vid <em>hovet</em>..." han sänker rösten, "...hör man saker. Vare sig man vill eller inte."

Hans blick blir allvarlig.

"Denna opera är mitt livsverk. Men byggnader är sällan det farliga. Det är <em>människorna</em> inuti dem."

Han ser på dig med prövande blick.

"Ni verkar vara en människa med... ärenden. Kungen planerar en <em>maskeradbal</em> på lördag. Hela staden surrar av <em>rykten</em>."

Han lutar sig närmare.

"Om ni behöver <em>tillträde</em> till balen... eller vill veta vad som <em>viskas vid hovet</em>... kanske jag kan hjälpa. Men först - vad för er till operan?"`;
                    },
                    configurable: true
                });

                console.log('   ✓ Adelcrantz: intro signals hovet/tillträde/rykten');
            }

            // PORTIER - grindvakt med insyn
            if (Characters.portier) {
                // Portierens dialog hanteras redan i bugfixes-batch5/6
                // Lägg till korsreferenser i topics
                Characters.portier.dialogue = Characters.portier.dialogue || {};
                Characters.portier.dialogue.topics = Characters.portier.dialogue.topics || {};

                Characters.portier.dialogue.topics['adelcrantz'] = `Portiern nickar respektfullt.

"Herr Adelcrantz? Hovarkitekten. Han är ofta i sin <em>verkstad</em> - längre in i byggnaden, förbi personalkorridoren."

Han sänker rösten.

"En klok man. Hör mycket vid hovet, sägs det. Om ni behöver veta något om hur saker fungerar här... han är rätt person att fråga."`;

                Characters.portier.dialogue.topics['personal'] = `"Personalen? Vi har målare, snickare, kostymörer..."

Han pekar åt vänster.

"Personalkorridoren går dit. <em>Målaren</em> brukar vara där - en konstnärlig typ. Ser mer än han säger, om ni förstår."`;

                console.log('   ✓ Portier: added cross-references to Adelcrantz/personal');
            }

            // BELLMAN - poet med politisk insikt
            if (Characters.bellman) {
                Characters.bellman.dialogue = Characters.bellman.dialogue || {};

                Object.defineProperty(Characters.bellman.dialogue, 'first', {
                    get: function() {
                        return `En rundnätt man med vänliga ögon och en cittra i famnen ser upp från sin bägare.

"Åh! En ny bekantskap!"

Han reser sig vingligt och bockar teatraliskt.

"Carl Michael Bellman, till er tjänst. Poet, sångare, och... observatör av livets alla skiftningar."

Han tar en klunk och ler menande.

"Jag sjunger om <em>Stockholm</em> - om dess gränder och dess hemligheter. Om kärleken och döden. Om de mäktiga och de ödmjuka."

Hans blick blir skarpare än man väntat.

"Man lär sig saker när man sjunger på krogar. Folk <em>viskar</em> saker de aldrig skulle säga högt. Speciellt om... <em>politik</em>."

Han sänker rösten.

"Ni vet väl att det finns de som <em>avskyr</em> vår kung? En viss <em>general Pechlin</em> till exempel... men det hörde ni inte från mig."

Han blinkar och höjer sin bägare.

"Nåväl! Vad vill ni veta? Om Stockholm? Om livet? Eller kanske om... mörkare ting?"`;
                    },
                    configurable: true
                });

                Characters.bellman.dialogue.topics = Characters.bellman.dialogue.topics || {};

                Characters.bellman.dialogue.topics['pechlin'] = `Bellman ser sig omkring och sänker rösten.

"General Pechlin... en farlig man. Bitter sedan kungen tog makten från adeln."

Han dricker djupt.

"Han samlar likasinnade omkring sig. <em>Ribbing</em>, <em>Horn</em>... de träffas i hemlighet, sägs det."

"Om ni vill veta mer..." han pekar vagt, "...krogarna i Gamla stan. <em>Den Gyldene Freden</em>. Där löser brännvinet tungor."`;

                Characters.bellman.dialogue.topics['krogen'] = `"Gyldene Freden? En utmärkt krog!"

Bellman ler nostalgiskt.

"<em>Krogvärden</em> där - han hör allt. Serverar brännvin och samlar hemligheter. Om någon vet vad adeln egentligen planerar, så är det han."`;

                console.log('   ✓ Bellman: intro signals politik/Pechlin, cross-refs krogvärden');
            }

            // KROGVÄRDEN - ryktesspridare
            if (Characters.krogvarden) {
                Characters.krogvarden.dialogue = Characters.krogvarden.dialogue || {};

                Object.defineProperty(Characters.krogvarden.dialogue, 'first', {
                    get: function() {
                        return `En kraftig man med förkläde torkar ett glas bakom disken. Hans ögon är vänliga men vaksamma.

"Välkommen till Den Gyldene Freden, min herre!"

Han ställer ner glaset och lutar sig fram.

"Här serverar vi det bästa brännvinet i Stockholm. Och..." han blinkar, "...vi lyssnar mer än vi pratar."

Han ser sig omkring i krogen där adelsmän sitter i mörka hörn.

"Ni ser de herrarna där borta? De kommer hit för att prata <em>ostört</em>. Och jag... jag bara serverar."

Han sänker rösten till en viskning.

"Men mellan oss - jag <em>hör</em> saker. Om <em>missnöjda adelsmän</em>. Om en viss kapten <em>Anckarström</em> som dricker här ibland. Nervös typ. Pratar om 'rättvisa' och 'tyranni'."

Han rättar till sitt förkläde.

"Vad får det lov att vara? Brännvin? Eller kanske... <em>information</em>?"`;
                    },
                    configurable: true
                });

                Characters.krogvarden.dialogue.topics = Characters.krogvarden.dialogue.topics || {};

                Characters.krogvarden.dialogue.topics['anckarström'] = `Krogvärden sänker rösten ytterligare.

"Anckarström? Jakob Johan. Före detta kapten. Bor på <em>Upplandsgatan</em>, nummer 12."

Han torkar disken nervöst.

"Han var här igår. Drack för mycket. Pratade om att 'kungen måste stoppas'. Om 'tyranni'."

Han ser orolig ut.

"Jag gillar inte det jag hör. Han har köpt <em>pistoler</em> på sistone - det sägs att <em>vapenssmeden Wåhlberg</em> på Drottninggatan fixade dem åt honom."

<span class="important">Du har fått viktig information om Anckarström!</span>`;

                Characters.krogvarden.dialogue.topics['wåhlberg'] = `"Wåhlberg? Vapenssmeden på <em>Drottninggatan</em>. Gör fina pistoler."

Krogvärden rynkar pannan.

"Anckarström nämnde hans namn. Tydligen har han beställt vapen där nyligen. Wåhlberg kanske vet mer..."`;

                Characters.krogvarden.dialogue.topics['adeln'] = `Krogvärden ser sig omkring försiktigt.

"Adeln? De är missnöjda. Kungen har tagit deras privilegier."

Han nickar mot ett mörkt hörn.

"De träffas här ibland. <em>Pechlin</em>, <em>Ribbing</em>, <em>Horn</em>... de viskar om förändring. Om att 'något måste göras'."

Han skakar på huvudet.

"Jag serverar bara brännvin. Men jag har öron."`;

                console.log('   ✓ Krogvärden: intro signals Anckarström/rykten, cross-refs Wåhlberg');
            }

            // WÅHLBERG - vapensmed med bevis
            if (typeof NewCharacters !== 'undefined' && NewCharacters.vahlberg) {
                NewCharacters.vahlberg.dialogue = NewCharacters.vahlberg.dialogue || {};

                const originalFirst = NewCharacters.vahlberg.dialogue.first;
                NewCharacters.vahlberg.dialogue.first = `Smeden tittar upp från sitt arbete. Hans händer är sotiga men skickliga.

"God dag! Anders Wåhlberg, vapensmed."

Han visar stolt upp en pistol han sliper.

"Jag gör Sveriges finaste vapen - även för kungens livgarde!"

Hans ansikte mörknar lite.

"Fast... jag har haft en <em>märklig kund</em> på sistone. En kapten Anckarström. Nervös man. Ville ha två pistoler 'som inte sviktar'."

Han skakar på huvudet.

"Jag tänker på det ibland. Vad ska han med sådana vapen till? Han verkade inte som en jägare..."

Han ser på dig.

"Nåväl! Vad kan jag hjälpa er med? Vapen? Reparationer? Eller..." han sänker rösten, "...vill ni veta mer om mina <em>kunder</em>?"`;

                console.log('   ✓ Wåhlberg: intro signals Anckarström/pistoler naturligt');
            }

            // KAROLINEN - gammal soldat med rykten
            if (Characters.karolin_1) {
                Characters.karolin_1.dialogue = Characters.karolin_1.dialogue || {};

                Object.defineProperty(Characters.karolin_1.dialogue, 'first', {
                    get: function() {
                        return `Den gamle soldaten sträcker på sig stolt när du närmar dig. Hans uniform är sliten men välskött.

"God dag, unge herre! Ja, jag tjänade under Karl XII själv. Poltava, Fredrikshald..."

Han klappar på sin musköt.

"Nuförtiden vaktar vi slottet. Inte lika ärofullt, men man ser och hör saker."

Han lutar sig närmare med sammanknipna ögon.

"Ni vet... jag känner igen en viss typ av människa. <em>Officerare som blivit bittra.</em> Den där <em>Anckarström</em> till exempel - han som gör tofsar nu."

Han fnissar torrt.

"Före detta kapten. Brukar gå förbi här ibland. Muttrar för sig själv om 'orättvisor'. Och vet ni vad jag hört?"

Han viskar:

"Han har köpt <em>pistoler</em> på sistone. Konstigt för en tofsare, eller hur?"

Han klappar dig på axeln.

"Var försiktig i dessa tider, unge vän. Det viskas om <em>konspirationer</em>..."`;
                    },
                    configurable: true
                });

                console.log('   ✓ Karolin: intro signals Anckarström/pistoler/konspiration');
            }

            // MÅLAREN/SCENARBETARE - ser saker bakom kulisserna
            if (Characters.scenarbetare) {
                Characters.scenarbetare.dialogue = Characters.scenarbetare.dialogue || {};

                Characters.scenarbetare.dialogue.topics = Characters.scenarbetare.dialogue.topics || {};

                Characters.scenarbetare.dialogue.topics['adelcrantz'] = `Målaren nickar respektfullt.

"Herr Adelcrantz? Han är i <em>verkstaden</em> längre in. En fin herre."

Han sänker rösten.

"Han ritar mer än väggar, om ni förstår. <em>Hemliga ingångar</em>, privata loger... han känner varje vrå av detta hus."

"Om ni behöver veta något om hur man tar sig <em>in</em> eller <em>ut</em> - fråga honom."`;

                Characters.scenarbetare.dialogue.topics['kläder'] = `"Kläder? Det finns massor i <em>omklädningsrummet</em> här bredvid."

Målaren pekar åt vänster.

"Kostymer från alla föreställningar. Om ni behöver se mer... passande ut, kanske ni hittar något där?"`;

                console.log('   ✓ Scenarbetare: cross-refs Adelcrantz/kläder');
            }
        }

        // ═══════════════════════════════════════════════════════════════════
        // 2. MILJÖMARKÖRER - rum som pekar mot NPCs
        // ═══════════════════════════════════════════════════════════════════

        if (typeof Rooms !== 'undefined') {

            // Opera workshop - pekar mot Adelcrantz kunskap
            if (Rooms.opera_workshop) {
                const originalDesc = Rooms.opera_workshop.description;
                Rooms.opera_workshop.description = `En verkstad full av ritningar, modeller och arkitektverktyg. Papper ligger utspridda överallt.

Bland ritningarna skymtar inte bara väggar och salar, utan även anteckningar om <em>privata loger</em>, <em>hemliga korridorer</em> och platser där ingen egentligen ska kunna stå obemärkt.

En stor ritning av operahuset visar <em>alla ingångar</em> - inklusive de som inte syns från utsidan.

Adelcrantz själv sitter vid ett skrivbord, omgiven av sitt livsverk.`;
            }

            // Den Gyldene Freden - pekar mot krogvärdens kunskap
            if (Rooms.gyldene_freden) {
                const originalDesc = Rooms.gyldene_freden.description;
                Rooms.gyldene_freden.description = `En stämningsfull krog med lågt i tak och levande ljus. Lukten av brännvin och stekt fläsk fyller luften.

I de mörka hörnen sitter <em>adelsmän som viskar</em>. De tystnar när någon går förbi.

Bakom disken står krogvärden - en man som ser allt och hör mer. Hans ögon följer varje gäst, varje viskning, varje hemlighet som delas över brännvinsglasen.

<em>Det sägs att inget sker i Stockholm utan att krogvärden vet om det.</em>`;
            }

            // Wåhlbergs smedja - pekar mot bevis
            if (Rooms.vahlberg_gunsmith) {
                Rooms.vahlberg_gunsmith.description = `En smedja fylld av vapen i olika stadier av tillverkning. Lukten av olja och metall är stark.

På väggen hänger en <em>beställningslista</em> med kunders namn och datum.

Verktyg, pipor och kolvar ligger ordnade på arbetsbänkarna. Smeden tar uppenbarligen sin yrkesära på allvar - han verkar veta exakt vilka vapen han sålt till vem.`;
            }

            console.log('   ✓ Room descriptions now hint at NPC knowledge');
        }

        // ═══════════════════════════════════════════════════════════════════
        // 3. NÄRA-MISS RESPONSER - vägleda när spelaren frågar "fel"
        // ═══════════════════════════════════════════════════════════════════

        const NearMissResponses = {
            adelcrantz: {
                // När spelaren frågar om fel ämne
                'opera': 'redirect_building',
                'föreställning': 'redirect_building',
                'teater': 'redirect_building',
                'musik': 'redirect_hovet',
                'vapen': 'redirect_others',
                'mord': 'redirect_conspiracy',

                redirects: {
                    'redirect_building': `Adelcrantz ler svagt.

"Föreställningarna? Nej, jag ritar bara kulisserna."

Han klappar på sina ritningar.

"Men <em>byggnaden</em>... den känner jag utan och innan. Varje <em>ingång</em>, varje <em>hemlig korridor</em>. Om ni behöver veta hur man tar sig <em>in</em> någonstans..."`,

                    'redirect_hovet': `Adelcrantz skakar på huvudet.

"Musik förstår jag mig inte på."

Han lutar sig närmare.

"Men vid <em>hovet</em> hör man annat. Viskningar. <em>Rykten</em> om missnöje. Om ni vill veta vad som <em>sägs i korridorerna</em>..."`,

                    'redirect_conspiracy': `Adelcrantz bleknar och ser sig omkring.

"Tyst! Sådant pratar man inte om öppet."

Han viskar:

"Men om ni verkligen vill veta... fråga mig om <em>hovet</em>. Eller <em>rykten</em>. Jag kanske kan hjälpa."`,

                    'redirect_others': `Adelcrantz höjer ögonbrynen.

"Vapen? Nej, det ligger utanför min expertis."

Han funderar.

"Men <em>vapenssmeden på Drottninggatan</em> - Wåhlberg heter han. Han kanske vet något. Eller de gamla karolinerna vid slottet..."`
                }
            },

            krogvarden: {
                'mat': 'redirect_guests',
                'öl': 'redirect_guests',
                'brännvin': 'redirect_guests',
                'kungen': 'redirect_rumors',
                'politik': 'redirect_rumors',

                redirects: {
                    'redirect_guests': `Krogvärden ler.

"Mat och dryck? Det har vi gott om."

Han lutar sig fram.

"Men det intressanta är <em>gästerna</em>. Vad de <em>säger</em> efter några glas. Om ni förstår vad jag menar..."`,

                    'redirect_rumors': `Krogvärden ser sig omkring försiktigt.

"Politik? Det blandar jag mig inte i."

Han viskar:

"Men jag <em>hör</em> saker. Om <em>missnöjda adelsmän</em>. Om en viss <em>Anckarström</em>... Fråga mig om det istället."`
                }
            },

            bellman: {
                'vapen': 'redirect_poetry',
                'mord': 'redirect_poetry',
                'anckarström': 'redirect_pechlin',

                redirects: {
                    'redirect_poetry': `Bellman skakar på huvudet och dricker djupt.

"Vapen? Mord? Det är inte vad min lyra sjunger om."

Han ser dig rakt i ögonen.

"Men <em>politik</em>... <em>makten</em>... det är en annan sak. Fråga mig om <em>Pechlin</em>. Eller vad som <em>viskas i Stockholm</em>."`,

                    'redirect_pechlin': `Bellman höjer ögonbrynen.

"Anckarström? Jag känner inte mannen personligen."

Han lutar sig närmare.

"Men jag vet vem som <em>känner</em> sådana typer. <em>General Pechlin</em>. De missnöjda samlas kring honom. Fråga mig om <em>honom</em> istället..."`
                }
            }
        };

        // ═══════════════════════════════════════════════════════════════════
        // 4. FÖRBÄTTRAD CMDASK - ingen generisk "vet inget"
        // ═══════════════════════════════════════════════════════════════════

        if (typeof GameEngine !== 'undefined') {
            const existingCmdAsk = GameEngine.cmdAsk;

            GameEngine.cmdAsk = function(targetAndTopic) {
                if (!targetAndTopic) {
                    this.output(`Vem vill du fråga? Och om vad?`);
                    return;
                }

                // Parsa "person om ämne"
                const match = targetAndTopic.match(/^(.+?)\s+om\s+(.+)$/i);
                if (!match) {
                    // Ingen "om" - försök visa hjälp
                    const room = Rooms[Game.player.currentRoom];
                    if (room && room.characters && room.characters.length > 0) {
                        const charId = room.characters[0];
                        const npcInfo = NPCDomains[charId];
                        if (npcInfo) {
                            this.output(`<em>Du kan fråga ${npcInfo.name} om ${npcInfo.redirect}.</em>`);
                            return;
                        }
                    }
                    this.output(`Försök: FRÅGA [person] OM [ämne]`);
                    return;
                }

                const targetName = match[1].trim().toLowerCase();
                const topic = match[2].trim().toLowerCase();

                // Hitta NPC
                const room = Rooms[Game.player.currentRoom];
                if (!room || !room.characters || room.characters.length === 0) {
                    this.output("Det finns ingen här att fråga.");
                    return;
                }

                let foundChar = null;
                for (let charId of room.characters) {
                    const char = Characters[charId];
                    if (char && char.keywords) {
                        for (let keyword of char.keywords) {
                            if (targetName.includes(keyword.toLowerCase())) {
                                foundChar = { id: charId, char: char };
                                break;
                            }
                        }
                    }
                    if (foundChar) break;
                }

                if (!foundChar) {
                    this.output(`Jag ser ingen "${targetName}" här.`);
                    return;
                }

                const dialogue = foundChar.char.dialogue;
                if (!dialogue) {
                    this.output(`${foundChar.char.name} verkar inte vilja prata.`);
                    return;
                }

                // Sök efter topic
                const topics = dialogue.topics || {};

                // Exakt match
                if (topics[topic]) {
                    this.output(`<div class="dialogue">${topics[topic]}</div>`);

                    // Spara knowledge
                    const key = `asked_${foundChar.id}_${topic}`;
                    if (!Game.player.knowledge.includes(key)) {
                        Game.player.knowledge.push(key);
                    }
                    return;
                }

                // Fuzzy match
                for (let t of Object.keys(topics)) {
                    if (topic.includes(t) || t.includes(topic)) {
                        this.output(`<div class="dialogue">${topics[t]}</div>`);
                        return;
                    }
                }

                // NÄRA-MISS: Kolla om det finns en redirect
                const nearMiss = NearMissResponses[foundChar.id];
                if (nearMiss) {
                    for (let [keyword, redirectKey] of Object.entries(nearMiss)) {
                        if (keyword === 'redirects') continue;
                        if (topic.includes(keyword)) {
                            const redirect = nearMiss.redirects[redirectKey];
                            if (redirect) {
                                this.output(`<div class="dialogue">${redirect}</div>`);
                                return;
                            }
                        }
                    }
                }

                // PERSONLIG FALLBACK - ingen generisk "vet inget"
                const npcInfo = NPCDomains[foundChar.id];
                let fallback;

                if (npcInfo) {
                    const domainHints = npcInfo.domains.slice(0, 3).join(', ');

                    switch(foundChar.id) {
                        case 'adelcrantz':
                            fallback = `Adelcrantz rynkar pannan och funderar.

"${topic}? Nej, det ligger utanför min... kompetens."

Han ser på sina ritningar.

"Men om ni vill prata om <em>hovet</em>, <em>tillträde till balen</em>, eller vad jag hört om <em>konspirationer</em>... då är jag er man."`;
                            break;

                        case 'portier':
                            fallback = `Portiern skakar på huvudet artigt.

"Det vet jag tyvärr inget om."

Han rättar till sin uniform.

"Men fråga gärna om <em>balen</em>, <em>klädkoder</em> eller vilka som passerar genom dessa dörrar."`;
                            break;

                        case 'bellman':
                            fallback = `Bellman tar en klunk och skrattar hjärtligt.

"${topic}? Det inspirerar inte min lyra, tyvärr!"

Han klappar på sin cittra.

"Men <em>Stockholm</em>, <em>politik</em>, <em>Pechlin</em> och livets gåtor - fråga om det, så sjunger jag!"`;
                            break;

                        case 'krogvarden':
                            fallback = `Krogvärden torkar ett glas och skakar på huvudet.

"Nej, det vet jag inget om."

Han lutar sig fram och viskar:

"Men jag hör <em>rykten</em>. Om <em>Anckarström</em>. Om <em>missnöjda adelsmän</em>. Fråga om det istället..."`;
                            break;

                        case 'vahlberg':
                            fallback = `Wåhlberg skakar på huvudet.

"Nej, det ligger utanför mitt område."

Han pekar på sina vapen.

"Men <em>pistoler</em> och <em>beställningar</em>? <em>Märkliga kunder</em>? Det kan jag berätta om."`;
                            break;

                        case 'karolin_1':
                            fallback = `Karolinen skrattar torrt.

"Det vet jag ingenting om, unge vän."

Han klappar på sin musköt.

"Men <em>militärt skvaller</em>? <em>Anckarström</em> och hans <em>pistoler</em>? Det har jag hört en del om..."`;
                            break;

                        default:
                            fallback = `${foundChar.char.name} skakar på huvudet.

"Tyvärr, det vet jag inget om."`;
                    }
                } else {
                    fallback = `${foundChar.char.name} funderar en stund.

"Nej... det vet jag tyvärr inget om."`;
                }

                this.output(`<div class="dialogue">${fallback}</div>`);
            };

            console.log('   ✓ cmdAsk: personliga fallbacks, inga generiska "vet inget"');
        }

        // ═══════════════════════════════════════════════════════════════════
        // 5. ÖVERHÖRDA DIALOGER - plantera frågor i spelarens huvud
        // ═══════════════════════════════════════════════════════════════════

        const OverheardDialogues = {
            opera_entrance: [
                `<span class="overheard">Du hör två hovmän viska:</span>
<em>"Adelcrantz vet mer än han säger. Han hör allt vid hovet..."</em>`,

                `<span class="overheard">En dam säger till sin väninna:</span>
<em>"Om man vill ha biljett till balen utan att betala - fråga arkitekten. Han har sina kontakter."</em>`
            ],

            gyldene_freden: [
                `<span class="overheard">Du hör viskningar från ett mörkt hörn:</span>
<em>"Anckarström var här igen igår. Drack för mycket. Pratade om 'rättvisa'..."</em>`,

                `<span class="overheard">En adelsman muttrar för sig själv:</span>
<em>"Wåhlberg på Drottninggatan... han säljer de bästa pistolerna. Till rätt pris."</em>`
            ],

            slottsbacken: [
                `<span class="overheard">Du hör två karoliner prata:</span>
<em>"Den där Anckarström... konstigt att en tofsare köper pistoler. Vad ska han med dem till?"</em>`
            ],

            norrmalmstorg: [
                `<span class="overheard">Två borgare diskuterar:</span>
<em>"Har du hört? Adeln samlas på krogarna. Pechlin, Ribbing... de planerar något."</em>`
            ]
        };

        // Lägg till överhörda dialoger när man går in i rum
        if (typeof GameEngine !== 'undefined' && GameEngine.showRoom) {
            const originalShowRoom = GameEngine.showRoom;

            GameEngine.showRoom = function(roomId) {
                const result = originalShowRoom.call(this, roomId);

                // Slumpmässigt visa överhörd dialog (30% chans)
                const overheard = OverheardDialogues[roomId];
                if (overheard && Math.random() < 0.3) {
                    const key = `overheard_${roomId}`;
                    const timesHeard = (Game.player._overheardCount || {})[roomId] || 0;

                    if (timesHeard < overheard.length) {
                        setTimeout(() => {
                            this.output(`\n${overheard[timesHeard]}`);
                        }, 500);

                        Game.player._overheardCount = Game.player._overheardCount || {};
                        Game.player._overheardCount[roomId] = timesHeard + 1;
                    }
                }

                return result;
            };

            console.log('   ✓ Overheard dialogues system active');
        }

        // ═══════════════════════════════════════════════════════════════════
        // CSS FÖR ÖVERHÖRDA DIALOGER
        // ═══════════════════════════════════════════════════════════════════

        const overheardStyle = document.createElement('style');
        overheardStyle.textContent = `
            .overheard {
                color: #8a8a6a;
                font-style: italic;
                display: block;
                margin: 10px 0 5px 0;
            }
            .overheard + em {
                color: #a0a080;
                display: block;
                margin-left: 15px;
                border-left: 2px solid #555;
                padding-left: 10px;
            }
        `;
        document.head.appendChild(overheardStyle);

        console.log('');
        console.log('✅ NPC DIALOGUE GUIDANCE SYSTEM LOADED!');
        console.log('');
        console.log('📋 NPC-domäner konfigurerade:');
        for (let [id, info] of Object.entries(NPCDomains)) {
            console.log(`   ${info.name}: ${info.domains.join(', ')}`);
        }
        console.log('');
        console.log('🎯 Principer implementerade:');
        console.log('   1. NPC-intros signalerar informationsdomän');
        console.log('   2. Miljöbeskrivningar pekar mot NPC-kunskap');
        console.log('   3. Korsreferenser mellan NPCs');
        console.log('   4. Nära-miss responser vägleder spelaren');
        console.log('   5. Personliga fallbacks (ingen "vet inget")');
        console.log('   6. Överhörda dialoger planterar frågor');
        console.log('');

    }, 1800);
});
