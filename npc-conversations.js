// ═══════════════════════════════════════════════════════════════════════════
// NPC CONVERSATIONS - Overhear-dialoger och gruppdynamik
// ═══════════════════════════════════════════════════════════════════════════
//
// Lägger till:
// 1. "Overhear"-system där spelaren hör vad NPCs pratar om
// 2. Rykten om Anckarström och hans tofs-hobby (historiskt korrekt!)
// 3. Förbättrade dialoger för grupp-NPCs
//
// HISTORISK NOT: Jacob Johan Anckarström tillverkade faktiskt tofsar
// (passementeritillverkning) som hobby/sidoinkomst efter att han
// avsattes från sin militärtjänst. Detta är en autentisk detalj!
//
// Loading: 1150ms - Efter comprehensive-fixes
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {

        console.log('💬 Loading NPC conversations and overhear system...');

        // ═══════════════════════════════════════════════════════════════════
        // OVERHEAR SYSTEM
        // ═══════════════════════════════════════════════════════════════════
        // När spelaren kommer in i ett rum med flera NPCs, kan de höra
        // fragment av konversationer

        const OverhearConversations = {

            // DEN GYLDENE FREDEN - Adelsmän som viskar
            den_gyldene_freden: [
                {
                    chance: 0.6,
                    condition: () => !Game.player.knowledge.includes('heard_tassel_rumor'),
                    text: `<div class="narrator overhear">Du hör adelsmännen i hörnet viskas:</div>
<div class="dialogue whisper">"...har ni sett Anckarströms senaste tofsar? Utmärkt hantverk, måste jag säga..."</div>
<div class="dialogue whisper">"Ja, min hustru köpte flera till gardinerna. Vem hade trott att en före detta kapten skulle bli <em>passementerare</em>?"</div>
<div class="dialogue whisper">"Han behöver pengarna, stackarn. Efter att kungen avsatte honom..."</div>
<div class="narrator">De tystnar när de märker att du lyssnar.</div>`,
                    onHeard: () => {
                        Game.player.knowledge.push('heard_tassel_rumor');
                    }
                },
                {
                    chance: 0.4,
                    condition: () => Game.player.knowledge.includes('heard_tassel_rumor') &&
                                    !Game.player.knowledge.includes('heard_conspiracy_whisper'),
                    text: `<div class="narrator overhear">Du snappar upp fragment från adelsmännens samtal:</div>
<div class="dialogue whisper">"...Pechlin säger att tiden är inne..."</div>
<div class="dialogue whisper">"Tyst! Inte här. För många öron."</div>
<div class="narrator">De kastar en misstänksam blick mot dig och byter ämne.</div>`,
                    onHeard: () => {
                        Game.player.knowledge.push('heard_conspiracy_whisper');
                    }
                }
            ],

            // SLOTTSBACKEN - Karolinerna pratar
            slottsbacken: [
                {
                    chance: 0.5,
                    condition: () => !Game.player.knowledge.includes('heard_karolin_chat'),
                    text: `<div class="narrator overhear">Du hör de två gamla karolinerna prata:</div>
<div class="dialogue">"Minns du kapten Anckarström? Han som avsattes för tre år sedan?"</div>
<div class="dialogue">"Ja ja, han som slog soldaten. Bitter karl. Jag hörde att han säljer <em>tofsar</em> nu. Tygtofsar!"</div>
<div class="dialogue">"Tofsar! Från kapten till tofsare. Hur lågt kan en man falla?"</div>
<div class="dialogue">"Han bor på Upplandsgatan, har jag hört. Hustrun måste skämmas..."</div>`,
                    onHeard: () => {
                        Game.player.knowledge.push('heard_karolin_chat');
                    }
                }
            ],

            // STORTORGET - Fiskhandlaren och andra
            stortorget: [
                {
                    chance: 0.4,
                    condition: () => !Game.player.knowledge.includes('heard_market_gossip'),
                    text: `<div class="narrator overhear">Du hör fiskhandlaren ropa till en kund:</div>
<div class="dialogue">"Ja, fru Lindgren! Färsk abborre idag! ...Vad sa ni? Tofsar? Javisst, jag köpte några av den där Anckarström förra veckan. Fina saker, men mannen ser ut som om han inte sovit på en månad. Mörka ögon, darriga händer..."</div>
<div class="narrator">Hon skakar på huvudet bekymrat innan hon återgår till att ropa ut sina varor.</div>`,
                    onHeard: () => {
                        Game.player.knowledge.push('heard_market_gossip');
                    }
                }
            ],

            // OPERA_FOYER - Operagäster skvallrar
            opera_foyer: [
                {
                    chance: 0.5,
                    condition: () => !Game.player.knowledge.includes('heard_opera_gossip'),
                    text: `<div class="narrator overhear">Du hör de eleganta operagästerna samtala:</div>
<div class="dialogue">"Har du hört? Den där Anckarström som gör tofsar - han har tydligen köpt <em>pistoler</em>. Min kusin såg honom hos vapensmed Wåhlberg."</div>
<div class="dialogue">"Pistoler? Varför skulle en tofsare behöva pistoler?"</div>
<div class="dialogue">"Kanske för att skydda sina tofsar!" De skrattar.</div>
<div class="dialogue">"Skämt åsido... det oroar mig. Han är bitter mot kungen, vet du."</div>`,
                    onHeard: () => {
                        Game.player.knowledge.push('heard_opera_gossip');
                        if (!Game.player.knowledge.includes('anckarstrom_mentioned')) {
                            Game.player.knowledge.push('anckarstrom_mentioned');
                        }
                    }
                },
                {
                    chance: 0.3,
                    condition: () => Game.player.stats.chapter >= 3,
                    text: `<div class="narrator overhear">En nervös herre viskar till sin följeslagare:</div>
<div class="dialogue">"Jag fick ett anonymt brev igår... det stod att kungen är i fara ikväll. Vid maskeradbalen."</div>
<div class="dialogue">"Nonsens! Vem skulle våga?"</div>
<div class="dialogue">"Jag vet inte... men jag har sett män i svarta kappor. De verkar... organiserade."</div>`
                }
            ],

            // KLARAKVARTER - Snickare och piga
            klarakvarter: [
                {
                    chance: 0.5,
                    condition: () => !Game.player.knowledge.includes('heard_klara_chat'),
                    text: `<div class="narrator overhear">Snickaren ropar till pigan:</div>
<div class="dialogue">"Hörru, Maja! Såg du kapten Anckarström igår? Han gick förbi med en låda."</div>
<div class="dialogue">"Tofsar igen, antar jag. Stackars karl. Min moster köpte några - fint hantverk men mannen ger mig rysningar."</div>
<div class="dialogue">"Ja, han har något mörkt i blicken. Som om han planerar något..."</div>`,
                    onHeard: () => {
                        Game.player.knowledge.push('heard_klara_chat');
                    }
                }
            ],

            // ARBETARKROG - Soldaten och arbetaren
            arbetarkrog: [
                {
                    chance: 0.6,
                    condition: () => !Game.player.knowledge.includes('heard_tavern_talk'),
                    text: `<div class="narrator overhear">Den gamle soldaten mumlar till hamnarbetaren:</div>
<div class="dialogue">"...och nu sitter han hemma och gör tofsar. <em>Tofsar!</em> En man som en gång ledde soldater i strid!"</div>
<div class="dialogue">"Vem då?"</div>
<div class="dialogue">"Anckarström! Jacob Johan Anckarström! Jag tjänstgjorde under honom. Hård man, men rättvis - tills kungen tog ifrån honom allt."</div>
<div class="dialogue">"Jag har hört att han köpt fina pistoler..."</div>
<div class="dialogue">"<span class="warning">Tyst!</span> Sådant pratar man inte om."</div>`,
                    onHeard: () => {
                        Game.player.knowledge.push('heard_tavern_talk');
                        if (!Game.player.knowledge.includes('anckarstrom_mentioned')) {
                            Game.player.knowledge.push('anckarstrom_mentioned');
                        }
                    }
                }
            ]
        };

        // ═══════════════════════════════════════════════════════════════════
        // HOOK INTO SHOWROOM
        // ═══════════════════════════════════════════════════════════════════

        if (typeof GameEngine !== 'undefined' && GameEngine.showRoom) {
            const originalShowRoom = GameEngine.showRoom;

            GameEngine.showRoom = function(roomId) {
                // Anropa original först
                originalShowRoom.call(this, roomId);

                // Kolla om det finns overhear-konversationer för detta rum
                const conversations = OverhearConversations[roomId];
                if (conversations && conversations.length > 0) {
                    // Välj slumpmässigt om spelaren hör något
                    for (let conv of conversations) {
                        if (conv.condition && !conv.condition()) continue;
                        if (Math.random() < conv.chance) {
                            // Visa konversationen efter en kort fördröjning
                            setTimeout(() => {
                                this.output(conv.text);
                                if (conv.onHeard) conv.onHeard();
                            }, 1500);
                            break; // Bara en konversation per rumbesök
                        }
                    }
                }
            };

            console.log('   ✓ Overhear system hooked into showRoom');
        }

        // ═══════════════════════════════════════════════════════════════════
        // FÖRBÄTTRA GRUPP-NPCs MED DIALOGER
        // ═══════════════════════════════════════════════════════════════════

        if (typeof Characters !== 'undefined') {

            // ADELSMAN_1 - Förbättrad dialog med tofs-referens
            if (Characters.adelsman_1) {
                Characters.adelsman_1.dialogue = {
                    first: `En ung adelsman i dyr pelskappa höjer sitt vinglas.

"God afton! Vilken kväll för ett glas vin, eller hur?"

Han ser nyfiket på dig.

"Jag känner inte igen er... ny i staden?"`,
                    topics: {
                        'anckarström': `Adelsmannen sänker rösten.

"Anckarström? Åh, den stackars kansen. Förödmjukad av kungen, avsatt, och nu..."

Han fnissar.

"Nu tillverkar han <em>tofsar</em>. Tygtofsar! Min hustru köpte några faktiskt - utmärkt kvalitet. Men mannen själv... <span class="important">han är fylld av bitterhet</span>. Jag skulle inte vilja vara ensam med honom i ett mörkt rum."`,

                        'tofsar': `"Tofsar? Ja, den före detta kaptenen Anckarström gör dem. Passementerarbete, kallas det.

Han säljer dem från sin bostad på <span class="important">Upplandsgatan</span>. Min hustru säger att de är vackrare än vad man får i butikerna."

Han skrattar.

"Från militär till tofsare - vilken karriär!"`,

                        'konspiration': `Adelsmannen blir plötsligt försiktig.

"Konspiration? Det är ett farligt ord, min vän."

Han tittar sig omkring.

"Det finns... missnöje bland adeln. Kungen har tagit för mycket makt. Men jag säger inget mer. Fråga <span class="important">Bellman</span> - han hör allt i denna stad."`,

                        'kungen': `"Gustav III? En teaterkung! Han bryr sig mer om operor och maskerader än om rikets väl."

Han suckar.

"Men han är vår kung. Vad kan man göra?"`,

                        'balen': `"Maskeradbalen på lördag! Jag ser fram emot den. Hela Stockholm kommer vara där - bakom masker."

Han ler mystiskt.

"Det är det fina med maskerader. Man kan vara vem som helst. Eller... göra vad som helst."`
                    }
                };
                Characters.adelsman_1.keywords = Characters.adelsman_1.keywords || [];
                if (!Characters.adelsman_1.keywords.includes('adelsman')) {
                    Characters.adelsman_1.keywords.push('adelsman', 'adel', 'man', 'pelskappa', 'ung');
                }
            }

            // ADELSMAN_2 - Ny dialog
            if (Characters.adelsman_2) {
                Characters.adelsman_2.dialogue = {
                    first: `En äldre adelsman med monokel betraktar dig genom glaset.

"Hmm. Ni har ett ovanligt utseende. Utlänning?"

Han lutar sig tillbaka.

"Oroliga tider. Man vet inte längre vem man kan lita på."`,
                    topics: {
                        'anckarström': `"Anckarström..."

Den äldre mannen ser ut genom fönstret.

"Jag kände hans far. Fin familj. Men sonen... han föll i onåd hos kungen. Nu lever han på att sälja <em>tofsar</em>."

Han skakar på huvudet.

"Han var här förra veckan faktiskt. Sålde tofsar till Bellman! Kan ni tänka er? En poet som köper tofsar av en fallen kapten."

Han sänker rösten.

"Men det som oroar mig är hans ögon. <span class="important">Fulla av hat</span>. Jag har sett sådana ögon förut - hos män som planerar något förfärligt."`,

                        'tofsar': `"Ja, jag har sett hans arbete. Fina tofsar - silke, guld, silver. Passementerarkonst av hög kvalitet."

Han tar en klunk vin.

"Man skulle inte tro att en militär kunde ha sådana fingrar. Men han har tid nu, antar jag. <em>Alldeles för mycket tid</em>."`,

                        'pechlin': `Den äldre mannens ansikte blir stelt.

"General Pechlin? En gammal räv. Han håller möten på sitt palats på <span class="important">Blasieholmen</span>. Inbjuder... utvalda gäster."

Han tvekar.

"Jag var bjuden en gång. Tackade nej. Jag vill inte ha med sådant att göra."`,

                        'kungen': `"Gustav III är... komplicerad. Briljant, ja. Men han har gjort sig många fiender."

Han suckar.

"Jag hoppas han är försiktig vid maskeradbalen. Det finns de som önskar honom illa."`
                    }
                };
                Characters.adelsman_2.keywords = Characters.adelsman_2.keywords || [];
                if (!Characters.adelsman_2.keywords.includes('adelsman')) {
                    Characters.adelsman_2.keywords.push('adelsman', 'adel', 'man', 'monokel', 'äldre');
                }
            }

            // KAROLIN_1 - Förbättrad dialog
            if (Characters.karolin_1) {
                Characters.karolin_1.dialogue = {
                    first: `Den gamle karolinen sträcker på sig stolt.

"Ja, jag tjänade under Karl XII. Poltava, Fredrikshald... hemska tider, men vi var modiga!"

Han ser på dig med gamla, grumliga ögon.

"Vad vill du veta, unge vän?"`,
                    topics: {
                        'anckarström': `"Anckarström? Jag minns honom som ung officer. Hård men rättvis."

Han spottar.

"Men kungen förnedrade honom. Nu sitter han hemma och gör <em>tofsar</em> - ja, tygtofsar! Kan du tänka dig? En officer!"

Han skakar på huvudet.

"Jag skulle blivit galen av skam. Han bor på <span class="important">Upplandsgatan</span>, har jag hört. Säljer sina tofsar där."`,

                        'tofsar': `"Ja ja, Anckarströms tofsar. Min kamrat köpte en till sin hatt förra månaden."

Han skrattar bittert.

"Fint arbete, sa han. Men vem vill köpa hantverk av en man med sådana <span class="important">ögon</span>? Han ser ut som om han vill mörda någon."`,

                        'kungen': `"Kungen? Han är ingen Karl XII, det ska vara säkert."

Han suckar.

"Men han är vår kung. Vi lyder och skyddar honom. Det är en soldats plikt."`,

                        'kriget': `Den gamle mannens ögon får ett drömsk sken.

"Kriget... ja, jag minns. Snö och blod. Karl XII som red framför oss med draget svärd."

Han tystnar.

"Vi förlorade allt. Men vi kämpade som lejon."`
                    }
                };
            }

            // KAROLIN_2 - Ny dialog för tiggaren
            if (Characters.karolin_2) {
                Characters.karolin_2.dialogue = {
                    first: `Den trasiga veteranen sträcker fram en darrande hand.

"En skilling, god herre? För en gammal soldat som tjänat kungen?"

Hans ögon är fulla av hopplöshet.`,
                    topics: {
                        'anckarström': `"Anckarström? Hah!"

Tiggaren skrattar bittert.

"Jag är inte den enda fallna soldaten i denna stad. Han var kapten - jag var menig. Båda förnedrade."

Han hostar.

"Men han har det bättre. Han gör tofsar och säljer dem. Jag? Jag har ingenting."`,

                        'tofsar': `"Tofsar, ja. Jag såg honom gå förbi häromdagen med en låda full. Fina saker."

Han ser bittert på sina trasiga kläder.

"Jag bad om en skilling. Han tittade på mig som om jag vore osynlig."`,

                        'pengar': `"En skilling? Gud välsigne er!"

Om du ger honom pengar:
"Tack, tack! Ni är en god människa. Må Gud skydda er - och kungen."`
                    }
                };
            }

            // OPERAGÄST1 - Dame i siden
            if (Characters.operagäst1) {
                Characters.operagäst1.dialogue = {
                    first: `En elegant dam i blå sidenklänning viftar med sin solfjäder.

"Åh, godkväll! Vilken magnifik afton för opera, tycker ni inte?"

Hon studerar dig nyfiket.`,
                    topics: {
                        'anckarström': `"Anckarström? Åh, den stackars mannen."

Hon viftar med solfjädern.

"Min väninna köpte <em>tofsar</em> av honom förra veckan. Utmärkt hantverk! Men hon sa att han verkade... <span class="important">nervös</span>. Tittade sig omkring hela tiden."

Hon sänker rösten.

"Mellan oss sagt - han är bitter mot kungen. Mycket bitter. Jag skulle inte bli förvånad om..."

Hon tystnar och tittar sig omkring.

"Nåja. Skvaller är opassande."`,

                        'tofsar': `"Tofsar! Ja, de är på modet nu. Anckarströms tofsar är särskilt populära - silke och guldtråd."

Hon pekar på sin klänning.

"Jag har några på mina gardiner hemma. Fint arbete för en före detta militär."`,

                        'maskeradbalen': `"Åh, jag räknar dagarna! Alla i maskerad - man kan vara vem som helst!"

Hon fnissar.

"Fast jag har hört oroande rykten. Att det finns de som planerar... elakheter mot kungen. Men det är säkert bara skvaller."`,

                        'kungen': `"Hans Majestät är så kultiverad! En sann konstälskare."

Hon suckar förtjust.

"Jag hoppas han är försiktig. Det finns de som avundas honom."`
                    }
                };
            }

            // OPERAGÄST2 - Herre med käpp
            if (Characters.operagäst2) {
                Characters.operagäst2.dialogue = {
                    first: `En äldre herre lutar sig mot sin promenadkäpp.

"God afton. Jag har sett alla stora operor här. Mozart, Gluck... Mästerliga!"

Han ser nostalgisk ut.`,
                    topics: {
                        'anckarström': `"Anckarström... ja, jag känner igen namnet."

Den äldre herrn nickar långsamt.

"En bitter man. Jag köpte faktiskt en tofs av honom för min hatt."

Han pekar på sin hatt där en elegant tofs sitter.

"<span class="important">Utmärkt kvalitet</span>. Men mannen själv gav mig kalla kårar. Det är något... farligt över honom."`,

                        'tofsar': `"Denna tofs?"

Han pekar på sin hatt.

"Köpt av Anckarström själv. Han kom till mitt hem på <span class="important">Upplandsgatan</span> - ja, han bor i samma kvarter. Knackade på dörren med sin låda."

Han rynkar pannan.

"Fint hantverk, men... hans händer darrade. Och han frågade konstiga frågor om kungens vanor."`,

                        'kungen': `"Gustav III? En lysande monark! Han har gjort Sverige till ett kulturellt centrum."

Han suckar.

"Men han har fiender. För många fiender. Jag hoppas livdrabanterna är vaksamma vid maskeradbalen."`,

                        'opera': `"Denna opera är hans livsverk! Han ritade delar av den själv, vet du."

Herrn ser sig omkring beundrande.

"Om något händer här... i hans eget hus av konst... det vore tragiskt."`
                    }
                };
            }

            // SNICKARE - Förbättrad dialog
            if (Characters.snickare) {
                Characters.snickare.dialogue = {
                    first: `En snickare arbetar på en bänk utanför sin verkstad.

"God dag! Behöver ni något snickrat? Möbler, dörrar, fönster?"

Han håller upp en välgjord stol.`,
                    topics: {
                        'anckarström': `"Anckarström? Den före detta kaptenen?"

Snickaren lägger ner sin hyvel.

"Han gick förbi igår med en <em>stor låda</em>. Tofsar, antar jag - det är vad han säljer nu. Min hustru köpte några förra månaden."

Han sänker rösten.

"Men jag gillar honom inte. Han har något <span class="important">mörkt i blicken</span>. Som om han planerar något. Och han ställde frågor om slottet - när vakterna byts, sådant."`,

                        'tofsar': `"Ja, hans tofsar är populära. Fint arbete för en militär."

Han skrattar.

"Jag önskar jag kunde ta lika bra betalt för mitt hantverk!"`,

                        'arbete': `"Snickeri är ärligt arbete. Inte som..."

Han tystnar.

"Nåja. Folk får göra vad de vill."`,

                        'stockholm': `"Stockholm är en bra stad för hantverkare. Alltid behov av skickliga händer."

Han ser sig omkring.

"Fast det är oroliga tider. Folk viskar om politik och konspirationer. Jag håller mig till mitt trä."`
                    }
                };
            }

            // PIGA - Ny dialog
            if (Characters.piga) {
                Characters.piga.dialogue = {
                    first: `En ung piga bär en tung tvättkorg.

"Ursäkta, får jag komma förbi?"

Hon ser trött men vänlig ut.`,
                    topics: {
                        'anckarström': `Pigan stannar upp.

"Anckarström? <em>Honom</em>?"

Hon rynkar pannan.

"Min moster arbetar på Upplandsgatan. Hon säger att han är kuslig. Sitter uppe hela nätterna och..."

Hon sänker rösten.

"Och gör <em>tofsar</em>. Tygtofsar. Men det är inte normalt, säger moster. Han mumlar för sig själv. Om <span class="important">kungen</span>. Om <span class="important">hämnd</span>."`,

                        'tofsar': `"Min moster köpte en tofs av honom. Fin sak."

Hon ryser.

"Men hon sa att hans ögon var... kalla. Som en orm."`,

                        'arbete': `"Jag tvättar för familjen Lindström. Tungt arbete, men det betalar räkningarna."

Hon suckar.

"Bättre än att göra tofsar, antar jag."`,

                        'rykten': `"Man hör saker... om missnöjda adelsmän, om planer mot kungen..."

Hon tittar sig oroligt omkring.

"Men jag vill inte ha något med sådant att göra. Jag vill bara göra mitt arbete."`
                    }
                };
            }

            // GAMMAL_SOLDAT - Förbättrad med tofs-referens
            if (Characters.gammal_soldat) {
                if (!Characters.gammal_soldat.dialogue.topics) {
                    Characters.gammal_soldat.dialogue.topics = {};
                }

                Characters.gammal_soldat.dialogue.topics['tofsar'] = `Den gamle soldaten skrattar bittert.

"Tofsar! Ja, det är vad en stolt officer reduceras till."

Han tar en djup klunk brännvin.

"Jag såg Anckarström förra veckan. Han bar en låda med tofsar - silke, guld, silver. Fint hantverk."

Hans röst blir mörkare.

"Men hans ögon... de var inte en hantverkares ögon. De var en <span class="important">mördares ögon</span>."`;

                Characters.gammal_soldat.dialogue.topics['upplandsgatan'] = `"Upplandsgatan? Ja, där bor Anckarström. Nummer 12, tror jag."

Han pekar vagt norrut.

"En enkel bostad för en före detta kapten. Men vad ska man göra när kungen tar ens ära?"`;
            }

            // ARBETARE - Ny dialog
            if (Characters.arbetare) {
                Characters.arbetare.dialogue = {
                    first: `En robust hamnarbetare dricker brännvin.

"Hårt jobb vid hamnen. Men någon måste göra det."

Han skrattar bittert.

"Adeln vet inte hur vanligt folk lever."`,
                    topics: {
                        'anckarström': `"Anckarström? Den fina kansen som gör tofsar nu?"

Arbetaren skrattar.

"Jag har hört talas om honom. Min bror såg honom på Drottninggatan med en låda. Erbjöd tofsar till alla som gick förbi."

Han skakar på huvudet.

"Stackars jävel. Från officer till gatuförsäljare."`,

                        'kungen': `"Kungen?"

Arbetaren spottar.

"Vad har kungen gjort för oss? Vi sliter och han dansar på operan."

Han tystnar.

"Men jag säger inget mer. Sådant tal kan ge en i fängelse."`,

                        'tofsar': `"Tofsar är för rika folk. Jag har inte råd med sådant."

Han pekar på sina slitna kläder.

"Men jag har hört att Anckarströms är fina. Om man har pengar."`
                    }
                };
            }

            // FISKHANDLARE - Förbättrad dialog
            if (Characters.fiskhandlare) {
                Characters.fiskhandlare.dialogue = {
                    first: `"Färsk fisk! Gädda, abborre, strömming!"

Fiskhandlaren ropar över torget.

"Fångad i morse! Kan inte bli fräschare!"`,
                    topics: {
                        'anckarström': `Fiskhandlaren blir tyst för en sekund.

"Anckarström? Ja, jag känner till honom."

Hon sänker rösten.

"Han köpte fisk av mig förra veckan. Betalade med en <em>tofs</em> istället för pengar! Fin tofs, visserligen, men..."

Hon skakar på huvudet.

"Han sa att han snart skulle ha <span class="important">gott om pengar</span>. Att <em>allt skulle förändras</em> snart. Jag förstod inte vad han menade."`,

                        'tofsar': `"Tofsar? Ja, jag har en nu!"

Hon visar fram en elegant tofs på sin förkläde.

"Bytte mot tre abborrar. Anckarström var här och sålde dem."`,

                        'fisk': `"Färsk fisk! Abborre, gädda, sik! Bästa i Stockholm!"

Hon visar stolt upp sina varor.`,

                        'stockholm': `"Marknaden har funnits här i hundra år! Folk kommer från hela staden för att köpa."`
                    }
                };
            }

            console.log('   ✓ Enhanced group NPC dialogues with tassel references');
        }

        // ═══════════════════════════════════════════════════════════════════
        // LYSSNA-KOMMANDO FÖR OVERHEAR
        // ═══════════════════════════════════════════════════════════════════

        if (typeof GameEngine !== 'undefined') {
            const originalProcessCommand = GameEngine.processCommand;

            GameEngine.processCommand = function(input) {
                const lowerInput = input.toLowerCase().trim();

                // Specialhantering för "lyssna" i rum med flera NPCs
                if (lowerInput === 'lyssna' || lowerInput === 'hör' || lowerInput === 'avlyssna') {
                    const room = Rooms[Game.player.currentRoom];
                    const conversations = OverhearConversations[Game.player.currentRoom];

                    if (conversations && conversations.length > 0) {
                        for (let conv of conversations) {
                            if (conv.condition && !conv.condition()) continue;
                            this.output(conv.text);
                            if (conv.onHeard) conv.onHeard();
                            return;
                        }
                    }
                }

                // Anropa original
                return originalProcessCommand.call(this, input);
            };

            console.log('   ✓ LYSSNA command enhanced for overhearing');
        }

        // ═══════════════════════════════════════════════════════════════════
        // EXPORTERA OVERHEAR SYSTEM
        // ═══════════════════════════════════════════════════════════════════

        window.OverhearConversations = OverhearConversations;

        console.log('');
        console.log('✅ NPC CONVERSATIONS LOADED!');
        console.log('   - Overhear system active (random conversations in group rooms)');
        console.log('   - Tassel/tofs references added to multiple NPCs');
        console.log('   - Enhanced dialogues for: adelsman_1, adelsman_2, karolin_1, karolin_2,');
        console.log('     operagäst1, operagäst2, snickare, piga, gammal_soldat, arbetare, fiskhandlare');
        console.log('');

    }, 1150); // Load after comprehensive-fixes (1100ms)
});
