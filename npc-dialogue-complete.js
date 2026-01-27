// ═══════════════════════════════════════════════════════════════════════════
// KOMPLETT NPC DIALOGUE SYSTEM - Alla NPCs, alla rum, alla principer
// ═══════════════════════════════════════════════════════════════════════════
//
// Systematisk implementering av handbokens ALLA principer för ALLA NPCs:
// 1. Självpositionering - varje NPC signalerar sin informationsdomän
// 2. Miljömarkörer - varje rum pekar mot relevant NPC-kunskap
// 3. Korsreferenser - komplett nätverk där NPCs nämner varandra
// 4. Nära-miss responser - intelligent vägledning vid "fel" fråga
// 5. Personliga fallbacks - inga generiska "vet inget"
// 6. Överhörda dialoger - planterar frågor i alla relevanta rum
//
// Loading: 2000ms - Efter npc-dialogue-guidance.js
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {

        console.log('🎭 Loading COMPLETE NPC Dialogue System...');

        // ═══════════════════════════════════════════════════════════════════
        // MASTER NPC REGISTRY - Alla NPCs med domäner och relationer
        // ═══════════════════════════════════════════════════════════════════

        const NPCRegistry = {
            // === OPERAN ===
            adelcrantz: {
                name: 'Carl Fredrik Adelcrantz',
                location: 'opera_workshop',
                role: 'Hovarkitekt',
                domains: ['tillträde', 'biljett', 'byggnaden', 'hovet', 'rykten', 'konspiration', 'hemliga ingångar'],
                knowsAbout: ['portier', 'kungen', 'pechlin'],
                leadsTo: ['konspirationen', 'biljett till balen'],
                personality: 'Försiktig men hjälpsam. Vet mer än han säger.'
            },
            portier: {
                name: 'Portiern',
                location: 'opera_entrance',
                role: 'Grindvakt',
                domains: ['klädkod', 'gäster', 'balen', 'regler', 'personal', 'vem som kommer och går'],
                knowsAbout: ['adelcrantz', 'scenarbetare', 'operagäster'],
                leadsTo: ['klädbyte', 'adelcrantz'],
                personality: 'Formell men pratglad. Älskar skvaller om gäster.'
            },
            scenarbetare: {
                name: 'Målaren',
                location: 'opera_staff',
                role: 'Kulissmålare',
                domains: ['kulisser', 'bakom scenen', 'kostymer', 'personal'],
                knowsAbout: ['adelcrantz', 'kostymer'],
                leadsTo: ['kläder', 'adelcrantz'],
                personality: 'Konstnärlig. Ser detaljer andra missar.'
            },

            // === STADEN ===
            bellman: {
                name: 'Carl Michael Bellman',
                location: 'den_gyldene_freden',
                role: 'Poet och observatör',
                domains: ['stockholm', 'visor', 'politik', 'pechlin', 'livet', 'kärlek', 'hovet'],
                knowsAbout: ['pechlin', 'krogvarden', 'kungen'],
                leadsTo: ['pechlin', 'konspirationen'],
                personality: 'Filosofisk, indirekt. Döljer skarp intelligens bakom rus.'
            },
            krogvarden: {
                name: 'Krogvärden',
                location: 'den_gyldene_freden',
                role: 'Informatör',
                domains: ['rykten', 'gäster', 'anckarström', 'adeln', 'viskningar', 'vem som träffas'],
                knowsAbout: ['bellman', 'anckarstrom', 'vahlberg', 'pechlin', 'adelsmannen'],
                leadsTo: ['anckarström', 'wåhlberg', 'konspirationen'],
                personality: 'Diskret men vet allt. Säljer information för rätt pris.'
            },
            vahlberg: {
                name: 'Anders Wåhlberg',
                location: 'vahlberg_gunsmith',
                role: 'Vapensmed',
                domains: ['vapen', 'pistoler', 'kunder', 'beställningar', 'anckarström'],
                knowsAbout: ['anckarstrom', 'livgardet'],
                leadsTo: ['bevis', 'anckarströms adress'],
                personality: 'Stolt yrkesman. Orolig över märkliga beställningar.'
            },
            kemisten: {
                name: 'Kemisten',
                location: 'kemisten',
                role: 'Apotekare',
                domains: ['färger', 'mediciner', 'gift', 'adelcrantz uppdrag'],
                knowsAbout: ['adelcrantz'],
                leadsTo: ['adelcrantz quest'],
                personality: 'Försiktig, misstänksam. Håller noggrann journal.'
            },
            siri_felice: {
                name: 'Siri Felice',
                location: 'stortorget',
                role: 'Gatumusiker',
                domains: ['musik', 'stockholm', 'balen', 'rykten', 'folket'],
                knowsAbout: ['mina_leonore', 'stadslivet'],
                leadsTo: ['stämningen i staden'],
                personality: 'Glad, observant. Hör vad vanligt folk säger.'
            },
            mina_leonore: {
                name: 'Mina Leonore',
                location: 'stortorget',
                role: 'Kohs-Pleyare',
                domains: ['historia', 'teater', 'kostymer', 'berättelser'],
                knowsAbout: ['siri_felice', 'historiska figurer'],
                leadsTo: ['perspektiv på historia'],
                personality: 'Entusiastisk, kreativ. Lever i berättelser.'
            },
            bagare: {
                name: 'Bagaren Lindqvist',
                location: 'kopmangatan',
                role: 'Hantverkare',
                domains: ['bröd', 'kunderna', 'stadsrykten', 'vardagen'],
                knowsAbout: ['vanligt folk', 'stämningen'],
                leadsTo: ['folkets syn på kungen'],
                personality: 'Vänlig, enkel. Hör mycket från kunderna.'
            },
            gatuförsäljare: {
                name: 'Gatuförsäljaren',
                location: 'drottninggatan',
                role: 'Försäljare',
                domains: ['mandlar', 'vad som händer på gatan', 'vem som passerar'],
                knowsAbout: ['vahlberg', 'kemisten', 'trafiken på gatan'],
                leadsTo: ['wåhlbergs smedja'],
                personality: 'Pratglad, nyfiken. Ser alla som passerar.'
            },
            sillgumma: {
                name: 'Sillgumman',
                location: 'gamla_stan',
                role: 'Fiskförsäljare',
                domains: ['fisk', 'gamla stan', 'krogarna', 'skvaller'],
                knowsAbout: ['gyldene freden', 'krogvarden'],
                leadsTo: ['krogen'],
                personality: 'Rå men hjärtlig. Känner alla i Gamla stan.'
            },

            // === SLOTTET ===
            karolin_1: {
                name: 'Veterankarolinen',
                location: 'slottsbacken',
                role: 'Gammal soldat',
                domains: ['militär', 'anckarström', 'pistoler', 'officerare', 'rykten'],
                knowsAbout: ['anckarstrom', 'militärt skvaller'],
                leadsTo: ['anckarströms bakgrund', 'misstankar'],
                personality: 'Stolt, misstänksam. Känner igen bitter officer.'
            },
            karolin_2: {
                name: 'Tiggande karolinen',
                location: 'slottsbacken',
                role: 'Fattig veteran',
                domains: ['nöd', 'gamla tider', 'orättvisa'],
                knowsAbout: ['karolin_1', 'hur det var förr'],
                leadsTo: ['perspektiv på samhället'],
                personality: 'Bitter, hungrig. Minns bättre tider.'
            },
            slottsvakt: {
                name: 'Slottsvakten',
                location: 'slott_courtyard',
                role: 'Vakt',
                domains: ['tillträde', 'slottet', 'säkerhet', 'vem som får komma in'],
                knowsAbout: ['hovmarskalken', 'kungen'],
                leadsTo: ['tillträde till slottet'],
                personality: 'Stel, plikttrogen. Följer order.'
            },
            hovmarskalk: {
                name: 'Hovmarskalken',
                location: 'slott_hall',
                role: 'Ceremonimästare',
                domains: ['hovet', 'ceremonier', 'kungen', 'etikett'],
                knowsAbout: ['kungen', 'von_essen', 'hovlivet'],
                leadsTo: ['kungens schema'],
                personality: 'Formell, arrogant. Väktare av etiketten.'
            },

            // === KONSPIRATIONEN ===
            pechlin: {
                name: 'General Pechlin',
                location: 'pechlin_salon',
                role: 'Konspirationsledare',
                domains: ['adeln', 'missnöje', 'konspiration', 'tyranni', 'revolution'],
                knowsAbout: ['anckarstrom', 'ribbing', 'horn', 'kungen'],
                leadsTo: ['hela konspirationen'],
                personality: 'Manipulativ, bitter. Hatar kungen.'
            },
            ribbing: {
                name: 'Greve Ribbing',
                location: 'pechlin_salon',
                role: 'Konspiratör',
                domains: ['adelns rättigheter', 'kungen', 'hat'],
                knowsAbout: ['pechlin', 'horn', 'anckarstrom'],
                leadsTo: ['konspiratörernas identitet'],
                personality: 'Intensiv, fanatisk. Brinner av hat.'
            },
            horn: {
                name: 'Greve Horn',
                location: 'pechlin_salon',
                role: 'Konspiratör',
                domains: ['strategi', 'planen', 'timing'],
                knowsAbout: ['pechlin', 'ribbing', 'balen'],
                leadsTo: ['detaljerna i planen'],
                personality: 'Kall, beräknande. Den strategiska hjärnan.'
            },
            anckarstrom: {
                name: 'Jakob Johan Anckarström',
                location: 'pechlin_salon',
                role: 'Lönnmördare',
                domains: ['hat', 'pistoler', 'planen', 'kungen'],
                knowsAbout: ['pechlin', 'vahlberg', 'balen'],
                leadsTo: ['mordet'],
                personality: 'Nervös, bitter. Förlorat allt, har inget kvar.'
            },

            // === HOVET ===
            gustav_iii: {
                name: 'Kung Gustav III',
                location: 'drabant_hall',
                role: 'Kungen',
                domains: ['riket', 'konst', 'hotet', 'framtiden'],
                knowsAbout: ['von_essen', 'faran', 'allt'],
                leadsTo: ['spelets mål - varna honom'],
                personality: 'Karismatisk, kulturälskande. Anar faran.'
            },
            vonEssen: {
                name: 'Hans Henrik von Essen',
                location: 'drabant_hall',
                role: 'Livdrabant',
                domains: ['kungens säkerhet', 'hot', 'lojalitet', 'beskydd'],
                knowsAbout: ['kungen', 'konspiratörerna', 'faran'],
                leadsTo: ['kungens öra'],
                personality: 'Lojal till döden. Misstänksam mot alla.'
            },

            // === OPERAGÄSTER ===
            operagäst1: {
                name: 'Damen i siden',
                location: 'opera_foyer',
                role: 'Adelsdam',
                domains: ['skvaller', 'modet', 'balen', 'hovlivet'],
                knowsAbout: ['vem som är vem', 'skandaler'],
                leadsTo: ['hovskvaller'],
                personality: 'Ytlig, skvallrig. Älskar drama.'
            },
            operagäst2: {
                name: 'Herren med käpp',
                location: 'opera_foyer',
                role: 'Adelsman',
                domains: ['politik', 'kungen', 'adeln', 'oro'],
                knowsAbout: ['missnöjet', 'stämningen'],
                leadsTo: ['adelns perspektiv'],
                personality: 'Bekymrad, tystlåten. Vet mer än han säger.'
            },

            // === ARBETARE ===
            snickare: {
                name: 'Snickaren',
                location: 'klarakvarter',
                role: 'Hantverkare',
                domains: ['arbete', 'kvarteret', 'kunderna'],
                knowsAbout: ['klarakvarteren', 'arbetarkrogen'],
                leadsTo: ['arbetarklassens syn'],
                personality: 'Flitig, rättfram. Respekterar ärlighet.'
            },
            arbetare: {
                name: 'Hamnarbetaren',
                location: 'arbetarkrog',
                role: 'Arbetare',
                domains: ['arbete', 'kungen', 'orättvisan', 'missnöjet'],
                knowsAbout: ['folkets syn', 'arbetarkrogen'],
                leadsTo: ['folkets perspektiv'],
                personality: 'Trött, bitter. Kämpas med vardagen.'
            },
            gammal_soldat: {
                name: 'Den gamla soldaten',
                location: 'arbetarkrog',
                role: 'Veteran',
                domains: ['krigen', 'anckarström', 'det militära', 'gamla tider'],
                knowsAbout: ['anckarstrom', 'militärt förflutet'],
                leadsTo: ['anckarströms historia'],
                personality: 'Trasig, skarp. Ser igenom fasader.'
            }
        };

        // ═══════════════════════════════════════════════════════════════════
        // KOMPLETT KORSREFERENSNÄTVERK
        // ═══════════════════════════════════════════════════════════════════

        const CrossReferences = {
            // Vem nämner vem och vad de säger
            portier: {
                adelcrantz: `"Herr Adelcrantz? Hovarkitekten. Han har sin <em>verkstad</em> längre in - förbi personalkorridoren, sedan framåt."

Han sänker rösten.

"En klok man som hör mycket vid <em>hovet</em>. Om ni behöver veta hur saker fungerar... eller hur man får <em>tillträde</em> till platser... han är rätt person."`,

                scenarbetare: `"Målaren? Han jobbar i korridoren till <em>vänster</em>. Konstnärlig typ - ser detaljer andra missar."`,

                personal: `"Personalen går genom dörren till <em>vänster</em>. Där finns målare, kostymörer... och ett <em>omklädningsrum</em> med massor av kostymer."`
            },

            scenarbetare: {
                adelcrantz: `Målaren torkar händerna på en trasa.

"Herr Adelcrantz? Han är i <em>verkstaden längre fram</em>. Ritade hela detta hus, han."

Han sänker rösten.

"Han vet saker om byggnaden som ingen annan vet. <em>Hemliga korridorer</em>, privata ingångar... Om ni behöver <em>komma in</em> någonstans, fråga honom."`,

                kostymer: `"Kostymer? Det finns massor i <em>omklädningsrummet</em> här bredvid." Han pekar åt vänster.

"Om ni behöver se mer... passande ut... kanske ni hittar något där?"`
            },

            adelcrantz: {
                portier: `"Portiern vid entrén? En noggrann man. Han ser allt som passerar genom de dörrarna."

Adelcrantz blinkar.

"Om ni behöver veta vem som besöker operan... eller få tips om <em>klädkoden</em>... han är er man."`,

                bellman: `Adelcrantz skrattar lågt.

"Bellman! Poeten. Han håller till på <em>Den Gyldene Freden</em> i Gamla stan."

Han blir allvarlig.

"Han verkar berusad, men missa inte hans skarpsinne. Han hör saker. Om <em>politik</em>, om <em>Pechlin</em>... Fråga honom, men var subtil."`,

                krogvarden: `"Krogvärden på Gyldene Freden? Han <em>hör allt</em>." Adelcrantz sänker rösten.

"Om ni vill veta vad <em>adeln viskar</em> om... vem som träffas i hemlighet... han vet. Han <em>säljer</em> information, om ni förstår."`,

                hovet: `Adelcrantz ser sig omkring försiktigt.

"Vid hovet... man hör saker. Om <em>missnöjda adelsmän</em>. Om <em>konspirationer</em>."

Han viskar: "Fråga mig om <em>kungen</em>. Eller om <em>rykten</em>. Jag kanske kan berätta mer."`
            },

            bellman: {
                krogvarden: `Bellman tar en klunk och pekar mot disken.

"<em>Krogvärden</em> där borta? Han hör allt. Serverar brännvin och samlar hemligheter."

Han blinkar.

"Fråga honom om <em>Anckarström</em>. Eller om vilka <em>adelsmän</em> som träffas här i mörkret..."`,

                pechlin: `Bellman sänker rösten dramatiskt.

"<em>General Pechlin</em>... en farlig man. Bitter sedan kungen tog makten."

Han dricker.

"Han samlar missnöjda omkring sig. <em>Ribbing</em>, <em>Horn</em>... De träffas på <em>Blasieholmen</em>, sägs det. I hans palats."`,

                vahlberg: `"Vapensmed? Det finns en på <em>Drottninggatan</em>. <em>Wåhlberg</em> heter han."

Bellman funderar.

"Jag har hört att han haft märkliga kunder på sistone. Nervösa män som vill ha pistoler som 'inte sviktar'..."`,

                adelcrantz: `"Adelcrantz vid operan?" Bellman nickar uppskattande.

"En kultiverad man. Och <em>välkontaktad vid hovet</em>. Om ni behöver veta vad som händer i maktens korridorer..."`
            },

            krogvarden: {
                bellman: `Krogvärden nickar mot poeten.

"<em>Bellman</em>? Han sitter där varje kväll. Dricker, sjunger... och <em>lyssnar</em>."

Han viskar: "Han vet mer om <em>politik</em> än han låter förstå. Fråga honom om <em>Pechlin</em>."`,

                anckarstrom: `Krogvärden ser sig omkring och sänker rösten.

"<em>Anckarström</em>. Jakob Johan. Före detta kapten. Bor på <em>Upplandsgatan 12</em>."

"Han var här igår. Drack för mycket. Pratade om att 'kungen måste stoppas'. Om 'tyranni'."

Han torkar nervöst ett glas.

"Och han har köpt <em>pistoler</em> av <em>Wåhlberg</em> på Drottninggatan. Det oroar mig..."`,

                vahlberg: `"<em>Wåhlberg</em>? Vapenssmeden på <em>Drottninggatan</em>. Gör fina pistoler."

Krogvärden rynkar pannan.

"Anckarström nämnde hans namn. Hade beställt vapen nyligen. Wåhlberg kanske vet mer... kanske har <em>bevis</em>."`,

                pechlin: `Krogvärden nickar mot ett mörkt hörn.

"Ser ni de herrarna? <em>Pechlin</em> sitter där ibland. Med <em>Ribbing</em>, <em>Horn</em>..."

Han viskar: "De planerar något. Jag hör fragment... 'kungen', 'balen', 'det måste ske'. Farligt."`
            },

            vahlberg: {
                anckarstrom: `Wåhlberg blir allvarlig.

"<em>Anckarström</em>? Ja, han var min kund nyligen. Två pistoler. Ville ha dem 'pålitliga'."

Han skakar på huvudet.

"Nervös man. Bor på <em>Upplandsgatan 12</em>. Jag har hans namn i min <em>kundlista</em>..."`,

                krogvarden: `"Jag har hört att man kan få information på <em>Gyldene Freden</em> i Gamla stan."

Wåhlberg funderar.

"<em>Krogvärden</em> där... han hör saker. Om mina kunder och deras ärenden."`,

                pistoler: `Wåhlberg tar fram sin anteckningsbok.

"Min <em>kundlista</em> visar alla beställningar. Anckarström - 10 mars - två pistoler..."

Han ser orolig ut. "Det är <em>bevis</em>, om ni behöver det."`
            },

            karolin_1: {
                anckarstrom: `Den gamle karolinen spetsar öronen.

"<em>Anckarström</em>? Jag känner till typen. Före detta kapten. Bitter."

Han fnissar torrt.

"Han gör <em>tofsar</em> nu, tänk! Men han har köpt <em>pistoler</em>. Konstigt för en tofsare..."

Han klappar dig på axeln. "Fråga <em>vapenssmeden på Drottninggatan</em>. Han sålde dem."`,

                vapensmed: `"Vapensmed? Det finns en bra på <em>Drottninggatan</em>. <em>Wåhlberg</em>."

Karolinen nickar.

"Om någon har köpt <em>pistoler</em> i den här stan, vet han om det. Han för noggranna anteckningar."`,

                krogarna: `"Om ni vill höra <em>rykten</em>... krogarna i Gamla stan."

Han pekar söderut.

"<em>Gyldene Freden</em>. Där samlas adeln för att... diskutera. Krogvärden hör allt."`
            },

            gatuförsäljare: {
                vahlberg: `"Vapenssmeden <em>Wåhlberg</em>? Hans smedja ligger längre ner på gatan."

Försäljaren pekar.

"Bra man. Gör fina pistoler. Fast han har haft nervösa kunder på sistone... en mörkhårig kapten."`,

                kemisten: `"<em>Kemisten</em>? Hans butik ligger också på denna gata. Han säljer allt möjligt."

Försäljaren sänker rösten. "Även... delikata saker, om ni förstår."`
            },

            sillgumma: {
                krogen: `"Bästa krogen? <em>Gyldene Freden</em> på Österlånggatan!"

Sillgumman ler med sina få tänder.

"<em>Krogvärden</em> är en gammal vän. Säg att Märta skickade er - ni får bättre pris på brännvinet."

Hon blinkar. "Och han <em>vet saker</em>. Om ni behöver höra rykten..."`,

                bellman: `"<em>Bellman</em>? Poeten?" Sillgumman skrattar.

"Han sitter på Freden varje kväll! Dricker och sjunger. Trevlig karl."

Hon blir allvarlig. "Men underskatta honom inte. Han har <em>skarpa ögon</em> bakom ruset."`
            },

            operagäst2: {
                oro: `Herren med käpp ser sig omkring försiktigt.

"Stämningen är... spänd." Han sänker rösten.

"<em>Adeln</em> är missnöjd. <em>Pechlin</em> och hans krets... de vill se förändring."

Han skakar på huvudet. "Jag hoppas kungen har bra <em>livvakter</em>. Han behöver dem."`,

                vonEssen: `"<em>von Essen</em>? Kungens livdrabant? Han är lojal som en hund."

Herren nickar.

"Om ni har information om ett <em>hot</em> mot kungen... von Essen är rätt person att berätta för."`
            },

            hovmarskalk: {
                kungen: `Hovmarskalken rättar till sin peruk.

"<em>Hans Majestät</em> är i <em>Drabantsalen</em>, förbereder sig inför balen."

Han ser strängt på dig.

"Om ni har ärende till kungen måste ni tala med <em>von Essen</em> först. Han avgör vem som får audiens."`,

                vonEssen: `"<em>von Essen</em>? Kungens närmaste man. Livdrabant."

Hovmarskalken nickar respektfullt.

"Han är i <em>Drabantsalen</em> med kungen. Inget passerar honom."`
            },

            vonEssen: {
                kungen: `von Essen korsarm armarna.

"<em>Hans Majestät</em> är medveten om riskerna. Men han vägrar ställa in balen."

Hans blick hårdnar.

"Om ni har <em>konkreta bevis</em> på ett hot... visa mig. Annars, störa inte kungen med rykten."`,

                pechlin: `von Essen morrar.

"<em>Pechlin</em>. Den gamle ansen. Ja, vi vet att han konspirerar."

Han skakar på huvudet.

"Men vi kan inte agera utan <em>bevis</em>. Kan ni ge mig namn? Planer? Något konkret?"`,

                anckarstrom: `von Essens ögon smalnar.

"<em>Anckarström</em>? Den avdankade kaptenen? Vad vet ni om honom?"

Han lutar sig fram intensivt.

"Om han planerar något mot kungen... jag behöver <em>bevis</em>. Pistoler, dokument, vittnen. Något."`
            }
        };

        // Applicera korsreferenser till alla NPCs
        function applyCrossReferences() {
            for (let [npcId, refs] of Object.entries(CrossReferences)) {
                const char = Characters[npcId] || (typeof NewCharacters !== 'undefined' ? NewCharacters[npcId] : null);
                if (char && char.dialogue) {
                    char.dialogue.topics = char.dialogue.topics || {};
                    for (let [topic, response] of Object.entries(refs)) {
                        char.dialogue.topics[topic] = response;
                    }
                }
            }
            console.log('   ✓ Cross-references applied to all NPCs');
        }

        if (typeof Characters !== 'undefined') {
            applyCrossReferences();
        }

        // ═══════════════════════════════════════════════════════════════════
        // MILJÖMARKÖRER - Rumbeskrivningar som pekar mot NPC-kunskap
        // ═══════════════════════════════════════════════════════════════════

        const EnvironmentalMarkers = {
            opera_entrance: `Operans magnifika entré välkomnar dig med högt i tak och kristallkronor.

<em>Portiern</em> vid dörren ser allt - varje gäst, varje klädsel, varje ansikte. Man säger att han vet mer om vem som besöker operan än någon annan.

Till <em>vänster</em> går en diskret dörr till personalens korridorer. Trappan uppåt leder till foajén.`,

            opera_staff: `En smal korridor med knarrande trägolv. Lukten av färg och terpentin hänger i luften.

<em>Målaren</em> vid sitt staffli ser upp när du passerar. Konstnärer ser saker andra missar - detaljer, ansikten, hemligheter.

En dörr till <em>vänster</em> leder till omklädningsrummet. Korridoren fortsätter <em>framåt</em> till verkstaden där <em>hovarkitekten Adelcrantz</em> arbetar.`,

            opera_workshop: `Verkstaden är full av ritningar, modeller och arkitektverktyg.

Bland papperen skymtar inte bara väggar och salar - utan även planer över <em>hemliga korridorer</em>, <em>privata ingångar</em> och platser där ingen egentligen borde kunna stå obemärkt.

<em>Adelcrantz</em> sitter vid sitt skrivbord. Han sägs veta allt om denna byggnad - inklusive saker som aldrig ritats på officiella kartor.`,

            opera_foyer: `Operans foajé glittrar av kristall och förgyllningar. Eleganta gäster minglar under de höga taken.

I ett hörn samtalar <em>en dam i siden</em> ivrigt med sin väninna - hovskvaller, onekligen.

En <em>äldre herre med käpp</em> står för sig själv och ser bekymrad ut. Hans blick söker ständigt utgångarna, som om han väntar på något.`,

            den_gyldene_freden: `En stämningsfull krog med lågt i tak. Levande ljus kastar dansande skuggor.

I de mörka hörnen sitter <em>adelsmän som viskar</em>. De tystnar när du passerar.

<em>Bellman</em> sitter vid sitt vanliga bord, cittra i famnen, bägare i hand. Bakom ruset döljer sig skarpa ögon som ser allt.

<em>Krogvärden</em> vid disken torkar ett glas. Han sägs veta varje hemlighet som någonsin viskats i dessa rum.`,

            stortorget: `Stockholms hjärta slår på detta historiska torg. Marknadsstånd, barn som leker, doften av färsk fisk.

<em>Siri Felice</em> spelar dragspel medan hennes syster <em>Mina Leonore</em> uppträder i fantasifull dräkt. Gatuartister - men de hör vad vanligt folk säger.

Härifrån leder gränder åt alla håll: till krogar, till hantverkare, till hemligeter.`,

            slottsbacken: `Slottet reser sig majestätiskt framför dig. Vakter står orörliga vid ingångarna.

<em>Gamla karoliner</em> - veteraner från kungens farfars krig - vaktar än. De har sett mycket, hört mer.

En av dem verkar vilja prata. Gamla soldater älskar att berätta historier.`,

            drottninggatan: `En livlig handelsgata. Försäljare ropar ut sina varor.

En <em>gatuförsäljare</em> med brända mandlar ser alla som passerar. Han vet vem som går vart.

Längre bort ligger <em>Wåhlbergs vapensmedja</em> - det sägs att han gör de bästa pistolerna i Stockholm. Och att han håller noggranna anteckningar över sina kunder.`,

            vahlberg_gunsmith: `Smedjan luktar av olja, metall och krut. Vapen i olika stadier av tillverkning pryder väggarna.

På väggen hänger en <em>kundlista</em> - varje beställning, varje namn, varje datum.

<em>Wåhlberg</em> tar sin yrkesära på allvar. Han verkar bekymrad över något - kanske en viss kunds ovanliga beställning?`,

            pechlin_salon: `Ett praktfullt rum fyllt av tobaksrök och spänning. Tunga gardiner döljer fönstren.

Män i fina kläder sitter samlade - <em>Pechlin</em>, <em>Ribbing</em>, <em>Horn</em>. Deras viskningar tystnar när de ser dig.

<em>Anckarström</em> sitter nervöst i ett hörn. Hans hand vilar på något under rocken.

<span class="warning">Du borde inte vara här.</span>`,

            drabant_hall: `Drabantsalen strålar av kunglig prakt. Porträtt av kungar och hjältar pryder väggarna.

<em>Gustav III</em> sitter vid bordet, omgiven av sina närmaste. <em>von Essen</em> - livdrabanten - vaktar vid kungens sida som en skugga.

Om du har något viktigt att säga till kungen... von Essen avgör om du får tala.`,

            arbetarkrog: `En enkel krog som luktar svett, öl och arbete. Här samlas stadens arbetare efter långa dagar.

En <em>gammal soldat</em> sitter ensam och stirrar in i sitt glas. Han ser ut att ha sett mycket i sina dagar.

<em>Hamnarbetare</em> diskuterar vid ett bord - kungen, skatterna, orättvisorna.`,

            klarakvarter: `Ett kvarter av hantverkare och arbetare. Sågspån och hammarslag fyller luften.

En <em>snickare</em> arbetar i sin verkstad med öppen dörr. Hantverkare hör mycket från sina kunder.

En <em>piga</em> skyndar förbi med en tvättkorg. Alla verkar ha bråttom här.`
        };

        // Applicera miljömarkörer
        function applyEnvironmentalMarkers() {
            if (typeof Rooms === 'undefined') return;

            for (let [roomId, description] of Object.entries(EnvironmentalMarkers)) {
                if (Rooms[roomId]) {
                    Rooms[roomId].description = description;
                }
            }
            console.log('   ✓ Environmental markers applied to all key rooms');
        }

        applyEnvironmentalMarkers();

        // ═══════════════════════════════════════════════════════════════════
        // NÄRA-MISS RESPONSER - Komplett system för alla NPCs
        // ═══════════════════════════════════════════════════════════════════

        const NearMissSystem = {
            adelcrantz: {
                patterns: {
                    'opera|föreställning|musik': `Adelcrantz ler artigt.

"Föreställningarna? Jag ritar bara kulisserna, tyvärr."

Han klappar på sina ritningar.

"Men <em>byggnaden</em> - den känner jag. Varje <em>ingång</em>, varje <em>hemlig korridor</em>. Och vid <em>hovet</em>... ja, där hör man saker."`,

                    'vapen|mord|döda': `Adelcrantz bleknar.

"Vapen? Det är inget för mig."

Han sänker rösten.

"Men jag har hört <em>rykten</em>. Om missnöjda adelsmän. Om <em>konspirationer</em>. Fråga mig om det istället..."`,

                    'pengar|betalning': `"Pengar? Jag är arkitekt, inte bankir."

Han funderar.

"Men om ni behöver <em>tillträde</em> till balen... kanske kan vi hjälpa varandra. Jag behöver färg från <em>kemisten</em>."`
                },
                fallback: `Adelcrantz rynkar pannan eftertänksamt.

"Det ligger utanför min expertis, tyvärr."

Han ser på sina ritningar.

"Men fråga mig om <em>hovet</em>, om <em>byggnaden</em>, om <em>tillträde</em>... eller om de <em>rykten</em> jag hört. Där kan jag hjälpa."`
            },

            portier: {
                patterns: {
                    'konspiration|mord|hot': `Portiern blir stel.

"Sådant vet jag inget om! Jag är bara grindvakt."

Han lugnar sig.

"Men <em>adelcrantz</em> i verkstaden... han hör saker vid hovet. Eller <em>krogarna</em> i Gamla stan - där viskas det."`,

                    'vapen|pistoler': `"Vapen? Det säljs inte här på operan!"

Portiern funderar.

"Men det finns en <em>vapensmed på Drottninggatan</em>. Wåhlberg. Han kanske kan hjälpa."`
                },
                fallback: `Portiern skakar på huvudet artigt.

"Det ligger utanför vad jag kan hjälpa med."

Han rättar till sin uniform.

"Men fråga om <em>gäster</em>, om <em>klädkoder</em>, om <em>personalen</em>... eller vem <em>Adelcrantz</em> är. Det vet jag om."`
            },

            bellman: {
                patterns: {
                    'vapen|pistoler|smed': `Bellman skakar på huvudet och dricker.

"Vapen? Det är inte min värld."

Han blinkar.

"Men jag har hört om en <em>vapensmed på Drottninggatan</em>. Och <em>krogvärden</em> här - han vet vilka som köpt vapen på sistone..."`,

                    'byggnaden|operan|arkitekt': `"Operan? Jag sjunger där ibland, men byggnaden..."

Han funderar.

"<em>Adelcrantz</em> - hovarkitekten - han ritade hela huset. Vet varje hemlig gång. Ni hittar honom i <em>verkstaden</em> vid operan."`,

                    'bevis|dokument': `Bellman blir allvarlig.

"Bevis är viktiga. Men poeter handlar i ord, inte papper."

Han sänker rösten.

"<em>Wåhlberg</em> - vapenssmeden - han för <em>anteckningar</em> över sina kunder. <em>Anckarströms lägenhet</em> kanske också gömmer hemligheter..."`
                },
                fallback: `Bellman tar en klunk och skrattar.

"Det inspirerar inte min lyra, tyvärr!"

Han blir skarpare.

"Men fråga mig om <em>Stockholm</em>, om <em>politik</em>, om <em>Pechlin</em>... eller vad <em>krogvärden</em> kanske vet. Där kan jag hjälpa."`
            },

            krogvarden: {
                patterns: {
                    'mat|öl|brännvin': `Krogvärden ler.

"Mat och dryck? Det har vi gott om!"

Han lutar sig fram.

"Men det <em>intressanta</em> är vad folk <em>säger</em> efter några glas... Om <em>Anckarström</em>. Om <em>missnöjda adelsmän</em>."`
                },
                fallback: `Krogvärden torkar ett glas och skakar på huvudet.

"Det vet jag inget om."

Han viskar:

"Men jag <em>hör</em> saker. Om <em>Anckarström</em>. Om <em>Pechlin</em>. Om vem som köpt <em>pistoler</em> av <em>Wåhlberg</em>... Fråga om det."`
            },

            vahlberg: {
                patterns: {
                    'politik|kungen|konspiration': `Wåhlberg skakar på huvudet.

"Politik? Jag är smed, inte politiker."

Han blir allvarlig.

"Men jag har haft <em>märkliga kunder</em>. Nervösa män. En viss <em>Anckarström</em>... Fråga mig om honom."`,

                    'krog|brännvin|rykten': `"Rykten? Jag hör inte mycket här i smedjan."

Wåhlberg funderar.

"Men <em>Gyldene Freden</em> i Gamla stan - där samlas folk och pratar. <em>Krogvärden</em> vet allt."`
                },
                fallback: `Wåhlberg skakar på huvudet.

"Det ligger utanför mitt område."

Han pekar på sina vapen.

"Men fråga om <em>pistoler</em>, om <em>beställningar</em>, om <em>Anckarström</em>... Det kan jag berätta om."`
            },

            karolin_1: {
                patterns: {
                    'hovet|adeln|politik': `Karolinen skrattar torrt.

"Hovet? Jag är bara gammal soldat."

Han blir allvarlig.

"Men jag <em>känner igen</em> typer. <em>Bittra officerare</em>. Som den där <em>Anckarström</em>... Fråga mig om honom."`
                },
                fallback: `Karolinen klappar på sin musköt.

"Det vet jag ingenting om, unge vän."

Han blinkar.

"Men <em>militärt skvaller</em>? <em>Anckarström</em>? <em>Vapenssmeden på Drottninggatan</em>? Det har jag hört om."`
            },

            vonEssen: {
                patterns: {
                    'opera|musik|föreställning': `von Essen ser uttråkad ut.

"Jag är livdrabant, inte musikälskare."

Hans blick hårdnar.

"Om ni har information om ett <em>hot mot kungen</em>... <em>Pechlin</em>? <em>Anckarström</em>? <em>Bevis</em>? Det vill jag höra."`
                },
                fallback: `von Essen korsarm armarna.

"Jag har inte tid för sådant."

Han ser dig rakt i ögonen.

"Om ni har <em>bevis</em> på ett hot mot kungen - namn, planer, dokument - visa mig. Annars, stör inte kungens förberedelser."`
            },

            gustav_iii: {
                patterns: {
                    'vapen|pistoler': `Kungen ler svagt.

"Vapen? Det överlåter jag åt von Essen."

Han blir allvarlig.

"Men om ni vet något om ett <em>hot</em>... om <em>Anckarström</em>? <em>Pechlin</em>? Berätta."`
                },
                fallback: `Kungen höjer ett ögonbryn.

"Det är inte vad jag önskar diskutera just nu."

Han lutar sig fram.

"Men om ni har <em>information</em> om konspirationen... om <em>bevisen</em>... Det intresserar mig."`
            }
        };

        // Implementera nära-miss systemet
        window.getNearMissResponse = function(npcId, topic) {
            const npcMiss = NearMissSystem[npcId];
            if (!npcMiss) return null;

            // Kolla patterns
            for (let [pattern, response] of Object.entries(npcMiss.patterns || {})) {
                const regex = new RegExp(pattern, 'i');
                if (regex.test(topic)) {
                    return response;
                }
            }

            // Returnera fallback
            return npcMiss.fallback || null;
        };

        console.log('   ✓ Near-miss response system configured for all key NPCs');

        // ═══════════════════════════════════════════════════════════════════
        // ÖVERHÖRDA DIALOGER - Alla relevanta rum
        // ═══════════════════════════════════════════════════════════════════

        const CompleteOverheardDialogues = {
            opera_entrance: [
                `<span class="overheard">Två hovdamer viskar:</span>
<em>"Adelcrantz i verkstaden... han vet mer än han säger. Man hör saker vid hovet, säger han."</em>`,

                `<span class="overheard">En herre säger till sin vän:</span>
<em>"Om man vill ha biljett utan att betala - fråga arkitekten. Han har sina kontakter."</em>`,

                `<span class="overheard">Personal viskar:</span>
<em>"Märkliga tider. Även portiern verkar orolig. Han frågar mer om gästerna nu..."</em>`
            ],

            opera_foyer: [
                `<span class="overheard">Damen i siden säger högt:</span>
<em>"Har du hört? Adeln är rasande på kungen. Det viskats om... ja, du vet."</em>`,

                `<span class="overheard">Herren med käpp muttrar:</span>
<em>"von Essen vaktar kungen som en hök. Men räcker det?"</em>`,

                `<span class="overheard">Två gäster:</span>
<em>"Pechlin var inte här ikväll. Han och hans krets träffas på Blasieholmen istället..."</em>`
            ],

            den_gyldene_freden: [
                `<span class="overheard">Viskningar från ett mörkt hörn:</span>
<em>"Anckarström var här igen. Drack för mycket. Pratade om 'tyranni' och 'rättvisa'..."</em>`,

                `<span class="overheard">En adelsman muttrar:</span>
<em>"Wåhlberg på Drottninggatan... han säljer pistoler till vem som helst. Till rätt pris."</em>`,

                `<span class="overheard">Bellman sjunger lågt:</span>
<em>"♪ Pechlin samlar sina vänner, i mörkret de sig döljer... ♪"</em>`,

                `<span class="overheard">Krogvärden säger till en servitris:</span>
<em>"Håll ögonen på bordet i hörnet. Ribbing och Horn är där igen..."</em>`
            ],

            stortorget: [
                `<span class="overheard">Två borgare diskuterar:</span>
<em>"Har du hört? Adeln träffas på krogarna. Pechlin, Ribbing... de planerar något."</em>`,

                `<span class="overheard">En fiskhandlare säger:</span>
<em>"Konstiga tider. Nervösa herrar köper pistoler. Vad ska det bli av?"</em>`,

                `<span class="overheard">En gumma viskar:</span>
<em>"På Gyldene Freden vet de allt. Krogvärden hör varje hemlighet..."</em>`
            ],

            slottsbacken: [
                `<span class="overheard">Karolinerna pratar:</span>
<em>"Den där Anckarström... konstigt att en tofsare köper pistoler. Vad ska han med dem till?"</em>`,

                `<span class="overheard">En vakt säger:</span>
<em>"Wåhlberg på Drottninggatan sålde vapnen. Han vet mer än han säger."</em>`,

                `<span class="overheard">En gammal soldat muttrar:</span>
<em>"Jag känner igen bittra officerare. Anckarström har den blicken..."</em>`
            ],

            norrmalmstorg: [
                `<span class="overheard">Förbipasserande gentlemen:</span>
<em>"Har du sett Pechlin på sistone? Han och hans krets håller sig undan..."</em>`,

                `<span class="overheard">Två damer viskar:</span>
<em>"Maskeradbalen på lördag! Kungen kommer vara där. Alla kommer vara där..."</em>`
            ],

            drottninggatan: [
                `<span class="overheard">En butiksägare säger:</span>
<em>"Wåhlbergs smedja har haft märkliga kunder. Nervösa typer som vill ha 'pålitliga' vapen."</em>`,

                `<span class="overheard">Två arbetare pratar:</span>
<em>"Kemisten säljer allt möjligt. Även saker man inte pratar högt om..."</em>`
            ],

            arbetarkrog: [
                `<span class="overheard">Arbetare vid bardisken:</span>
<em>"Jag har hört om den där Anckarström. Före detta kapten. Bitter som galla."</em>`,

                `<span class="overheard">Den gamla soldaten muttrar:</span>
<em>"Officerare som förlorat allt är farliga. De har inget kvar att förlora..."</em>`
            ],

            opera_staff: [
                `<span class="overheard">Målaren säger till en kollega:</span>
<em>"Adelcrantz vet allt om detta hus. Hemliga korridorer, dolda ingångar..."</em>`,

                `<span class="overheard">En kostymör viskar:</span>
<em>"Det är nervös stämning inför balen. Rykten om hot mot kungen..."</em>`
            ],

            pechlin_house: [
                `<span class="overheard">Tjänaren muttrar:</span>
<em>"Herr Pechlin har haft många besökare på sistone. Ribbing, Horn, den där Anckarström..."</em>`
            ]
        };

        // Uppdatera överhörda dialoger-systemet
        if (typeof GameEngine !== 'undefined' && GameEngine.showRoom) {
            const originalShowRoom = GameEngine.showRoom;

            GameEngine.showRoom = function(roomId) {
                const result = originalShowRoom.call(this, roomId);

                // Slumpmässigt visa överhörd dialog (25% chans)
                const overheard = CompleteOverheardDialogues[roomId];
                if (overheard && Math.random() < 0.25) {
                    Game.player._overheardCount = Game.player._overheardCount || {};
                    const timesHeard = Game.player._overheardCount[roomId] || 0;

                    if (timesHeard < overheard.length) {
                        setTimeout(() => {
                            this.output(`\n${overheard[timesHeard]}`);
                        }, 600);

                        Game.player._overheardCount[roomId] = timesHeard + 1;
                    }
                }

                return result;
            };

            console.log('   ✓ Overheard dialogues active in ' + Object.keys(CompleteOverheardDialogues).length + ' rooms');
        }

        // ═══════════════════════════════════════════════════════════════════
        // FÖRBÄTTRAD CMDASK MED KOMPLETT NEAR-MISS SYSTEM
        // ═══════════════════════════════════════════════════════════════════

        if (typeof GameEngine !== 'undefined') {
            const baseCmdAsk = GameEngine.cmdAsk;

            GameEngine.cmdAsk = function(targetAndTopic) {
                if (!targetAndTopic) {
                    this.output(`Vem vill du fråga? Och om vad?`);
                    return;
                }

                // Parsa input
                const match = targetAndTopic.match(/^(.+?)\s+om\s+(.+)$/i);
                if (!match) {
                    const room = Rooms[Game.player.currentRoom];
                    if (room && room.characters && room.characters.length > 0) {
                        const charId = room.characters[0];
                        const npcInfo = NPCRegistry[charId];
                        if (npcInfo) {
                            this.output(`<em>Du kan fråga ${npcInfo.name} om: ${npcInfo.domains.slice(0, 4).join(', ')}...</em>`);
                            return;
                        }
                    }
                    this.output(`Försök: FRÅGA [person] OM [ämne]`);
                    return;
                }

                const targetName = match[1].trim().toLowerCase();
                const topic = match[2].trim().toLowerCase();

                // Hitta NPC i rummet
                const room = Rooms[Game.player.currentRoom];
                if (!room || !room.characters || room.characters.length === 0) {
                    this.output("Det finns ingen här att fråga.");
                    return;
                }

                let foundChar = null;
                for (let charId of room.characters) {
                    const char = Characters[charId] || (typeof NewCharacters !== 'undefined' ? NewCharacters[charId] : null);
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
                const topics = dialogue ? dialogue.topics || {} : {};

                // 1. Exakt match
                if (topics[topic]) {
                    this.output(`<div class="dialogue">${topics[topic]}</div>`);
                    const key = `asked_${foundChar.id}_${topic}`;
                    if (!Game.player.knowledge.includes(key)) {
                        Game.player.knowledge.push(key);
                    }
                    return;
                }

                // 2. Fuzzy match
                for (let t of Object.keys(topics)) {
                    if (topic.includes(t) || t.includes(topic)) {
                        this.output(`<div class="dialogue">${topics[t]}</div>`);
                        return;
                    }
                }

                // 3. Nära-miss response
                const nearMiss = getNearMissResponse(foundChar.id, topic);
                if (nearMiss) {
                    this.output(`<div class="dialogue">${nearMiss}</div>`);
                    return;
                }

                // 4. Personlig fallback med domänförslag
                const npcInfo = NPCRegistry[foundChar.id];
                let domainHint = '';
                if (npcInfo) {
                    domainHint = `\n\n<em>Du kan fråga om: ${npcInfo.domains.slice(0, 4).join(', ')}...</em>`;
                }

                const personalFallbacks = {
                    adelcrantz: `Adelcrantz rynkar pannan eftertänksamt.

"${topic}? Nej, det ligger utanför min... kompetens."${domainHint}`,

                    portier: `Portiern skakar artigt på huvudet.

"Det vet jag tyvärr inget om, min herre."${domainHint}`,

                    bellman: `Bellman tar en klunk och skrattar.

"${topic}? Det inspirerar inte min lyra!"${domainHint}`,

                    krogvarden: `Krogvärden torkar ett glas och skakar på huvudet.

"Nej, det vet jag inget om."${domainHint}`,

                    vahlberg: `Wåhlberg skakar på huvudet.

"Det ligger utanför mitt område."${domainHint}`,

                    karolin_1: `Karolinen skrattar torrt.

"Det vet jag ingenting om, unge vän."${domainHint}`,

                    vonEssen: `von Essen ser otålig ut.

"Det har jag inte tid med."${domainHint}`,

                    gustav_iii: `Kungen höjer ett ögonbryn.

"Det är inte vad jag vill diskutera just nu."${domainHint}`,

                    scenarbetare: `Målaren torkar händerna.

"Det vet jag tyvärr inget om."${domainHint}`,

                    kemisten: `Kemisten rynkar pannan.

"Det ligger utanför mitt sortiment."${domainHint}`,

                    siri_felice: `Siri skakar på huvudet med ett leende.

"Det vet jag inget om, tyvärr!"${domainHint}`,

                    mina_leonore: `Mina ser fundersam ut.

"Det har jag inte läst om i mina historieböcker."${domainHint}`,

                    bagare: `Bagaren skrattar och borstar mjöl från förklädet.

"Det vet jag verkligen inget om!"${domainHint}`,

                    slottsvakt: `Vakten står stel.

"Det ingår inte i mina uppgifter."${domainHint}`,

                    hovmarskalk: `Hovmarskalken ser nedlåtande ut.

"Det är inte något jag diskuterar."${domainHint}`
                };

                const fallback = personalFallbacks[foundChar.id] ||
                    `${foundChar.char.name} funderar.

"Nej... det vet jag tyvärr inget om."${domainHint}`;

                this.output(`<div class="dialogue">${fallback}</div>`);
            };

            console.log('   ✓ Complete cmdAsk with near-miss and personalized fallbacks');
        }

        // ═══════════════════════════════════════════════════════════════════
        // KOMPLETT STATISTIK
        // ═══════════════════════════════════════════════════════════════════

        const stats = {
            npcsConfigured: Object.keys(NPCRegistry).length,
            crossReferences: Object.keys(CrossReferences).length,
            roomsWithMarkers: Object.keys(EnvironmentalMarkers).length,
            npcsWithNearMiss: Object.keys(NearMissSystem).length,
            roomsWithOverheard: Object.keys(CompleteOverheardDialogues).length
        };

        console.log('');
        console.log('═══════════════════════════════════════════════════════════════');
        console.log('✅ COMPLETE NPC DIALOGUE SYSTEM LOADED!');
        console.log('═══════════════════════════════════════════════════════════════');
        console.log(`   📋 NPCs konfigurerade: ${stats.npcsConfigured}`);
        console.log(`   🔗 NPCs med korsreferenser: ${stats.crossReferences}`);
        console.log(`   🏠 Rum med miljömarkörer: ${stats.roomsWithMarkers}`);
        console.log(`   🎯 NPCs med nära-miss system: ${stats.npcsWithNearMiss}`);
        console.log(`   👂 Rum med överhörda dialoger: ${stats.roomsWithOverheard}`);
        console.log('═══════════════════════════════════════════════════════════════');
        console.log('');

    }, 2000);
});
