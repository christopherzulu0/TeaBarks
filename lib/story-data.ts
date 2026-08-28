import type {
  Contest,
  ReadingList,
  ReadingProgress,
  Story,
  StoryAuthor,
  StoryComment,
  WriterApplication,
} from "./story-types";

export const storyAuthors: StoryAuthor[] = [
  {
    id: "sa-1",
    handle: "mirelathequill",
    name: "Mirela Voss",
    bio: "Fantasy novelist with a cartographer's heart. I draw the map first and let the characters get lost in it.",
    followers: 48200,
    isWriter: true,
    writerSince: "2023-04-12",
    storiesPublished: 6,
  },
  {
    id: "sa-2",
    handle: "junoafterdark",
    name: "Juno Aldaine",
    bio: "Horror and dread in ordinary places. Read with the lights on; I did not write it that way.",
    followers: 31900,
    isWriter: true,
    writerSince: "2022-11-03",
    storiesPublished: 4,
  },
  {
    id: "sa-3",
    handle: "keirwrites",
    name: "Keir Ashford",
    bio: "Ex-journalist writing mysteries where the clues are all there. Every alibi checked twice.",
    followers: 27400,
    isWriter: true,
    writerSince: "2024-01-19",
    storiesPublished: 3,
  },
  {
    id: "sa-4",
    handle: "solenneink",
    name: "Solenne Marchetti",
    bio: "Romance with teeth. Happy endings earned, never given.",
    followers: 66100,
    isWriter: true,
    writerSince: "2022-06-27",
    storiesPublished: 8,
  },
  {
    id: "sa-5",
    handle: "orbitpress",
    name: "Dayo Okonkwo",
    bio: "Systems engineer by day. I write the futures my job is quietly building.",
    followers: 22800,
    isWriter: true,
    writerSince: "2023-09-08",
    storiesPublished: 3,
  },
  {
    id: "sa-6",
    handle: "wrenversed",
    name: "Wren Kavanagh",
    bio: "Poems and teen fiction. Small moments, full volume.",
    followers: 18500,
    isWriter: true,
    writerSince: "2024-05-30",
    storiesPublished: 5,
  },
];

export const stories: Story[] = [
  {
    id: "st-1",
    slug: "the-cartographers-debt",
    title: "The Cartographer's Debt",
    blurb:
      "Every map Isolde Ferren draws comes true. When the Guild orders her to chart a country that doesn't exist yet, she realizes the borders she inks will decide who starves and who rules — and that someone has been buying her maps before she draws them.",
    genre: "legends-folklore",
    tags: ["magic", "political-intrigue", "slow-burn", "maps"],
    status: "ongoing",
    mature: false,
    authorId: "sa-1",
    reads: 1284000,
    votes: 96400,
    commentCount: 8412,
    createdAt: "2025-11-02",
    updatedAt: "2026-08-01",
    featured: true,
    chapters: [
      {
        number: 1,
        title: "Ink Before Territory",
        wordCount: 2140,
        readingMinutes: 9,
        reads: 1284000,
        votes: 41200,
        publishedAt: "2025-11-02",
        paragraphs: [
          "The Guild taught its apprentices that a map records the world. Isolde Ferren learned in her seventh year that the Guild lied, the way institutions lie — not with false words, but with true words arranged to keep you from the dangerous question. Her master caught her sketching a bridge over the Vell out of boredom, a lazy arc of graphite between two towns that had hated each other for a century. He did not scold her. He went very pale, took the sheet, and burned it in the lamp while she watched.",
          "Three weeks later, masons from both towns met at the river with quarried stone and no memory of deciding to build. The bridge in the drawing had seven arches. The bridge over the Vell, when it was finished the following autumn, had seven arches. Isolde was eleven years old, and she understood two things with the cold clarity that would shape the rest of her life: that her hand made law, and that the Guild had known before she did.",
          "Now, sixteen years on, she stood in the Cartographium's highest room while Guildmaster Orsen unrolled a commission sealed with wax the color of dried blood. The parchment beneath was blank except for a single line of instruction. Chart the province of Maren Vale, it read, complete with roads, garrisons, and the seat of its governor. Isolde read it twice. 'Master,' she said carefully, 'there is no province called Maren Vale.' Orsen's smile did not reach his eyes. 'Not yet,' he said. 'That is rather the point.'",
          "She should have refused then, in that room, while refusal was still a thing that could be done with words. Instead she asked the question every mapmaker asks and no honest client answers: who is paying? Orsen slid a second document across the desk — a promissory note for a sum that would clear her family's debt to the Guild, the debt she had been born owing, the debt that owned her hand and everything it drew. 'The buyer,' he said, 'wishes to remain a rumor. You have until the spring thaw.'",
        ],
      },
      {
        number: 2,
        title: "The Blank Province",
        wordCount: 2380,
        readingMinutes: 10,
        reads: 1122000,
        votes: 36900,
        publishedAt: "2025-11-16",
        paragraphs: [
          "A country begins with water. Isolde had drawn enough real places to know the order of operations by instinct: rivers first, because people are only ever thirst wearing boots, then the high ground, then the roads that thread between them like an argument between what the land wants and what people insist upon. She pinned the blank sheet to her table and did not draw anything at all for nine days.",
          "It was not fear, or not only fear. It was arithmetic. A province needs to border something, and whatever she placed Maren Vale against would find itself with a new neighbor by summer — new tariffs, new garrisons, a new governor with ambitions she would have personally inked into being. She wrote out the candidates on a scrap she burned each evening: the Reach, too poor to matter; the Sorrel coast, too rich to survive it; the Dunmark, where her sister kept an orchard and three children.",
          "On the tenth day a letter arrived with no seal and no signature, which in the capital meant it had both and she was not meant to survive knowing them. It contained a single sentence in a clerk's careful hand: The vale sits east of the Dunmark, as you have already decided. She had told no one. She had written nothing down that had not gone into the lamp. Isolde sat very still for a long time, listening to the building settle, and then she did something no Guild cartographer had done in two hundred years. She began to draw a map that was deliberately, precisely wrong.",
        ],
      },
      {
        number: 3,
        title: "Errors of Consequence",
        wordCount: 2210,
        readingMinutes: 9,
        reads: 1015000,
        votes: 33800,
        publishedAt: "2025-12-01",
        paragraphs: [
          "The trick of a good lie, her father used to say while adjusting his ledgers, is that it must be more convenient than the truth for everyone who could expose it. Isolde applied the principle with a draftsman's rigor. Her false Maren Vale was a masterpiece of plausible inconvenience: the roads flooded in spring, the passes closed in winter, the garrison sites commanded beautiful views of nothing worth defending.",
          "She drew a governor's seat on a hill of soft clay that would swallow foundations for a decade, and salted the margins with surveyor's notes in her neatest hand — soil reports, water tables, the patient bureaucratic poetry that makes a fiction load-bearing. If someone intended to conjure a province out of her ink, they would conjure one that fought them every mile. It was, she reflected, the first thing she had ever drawn for herself.",
          "The buyer's response arrived not as a letter but as a person: a woman in traveling grays who sat down across from Isolde at a public house as though the chair had been reserved for a year. 'The clay hill was elegant,' the woman said, without introduction. 'The flooding roads, a little obvious. You should know the maps are not for building a province, Cartographer. They are for un-building one.' She laid a coin on the table, and the face stamped into it belonged to no king Isolde had ever drawn.",
        ],
      },
      {
        number: 4,
        title: "The Coin's Face",
        wordCount: 2455,
        readingMinutes: 10,
        reads: 887000,
        votes: 31500,
        publishedAt: "2025-12-15",
        paragraphs: [
          "Numismatics was a required course at the Guild, though the apprentices had treated it as a nap with engravings. Coins, the old lecturer insisted, are the only maps most people ever hold — a portrait, a motto, a claim about who owns the ground under your feet, all pressed into metal small enough to forget in a pocket. Isolde had finished top of that class, and so she knew, holding the gray woman's coin to the lamplight, that she was looking at a currency struck for a country that had been erased.",
          "The face belonged to the Queen of the Vale — the old Vale, the one the chronicles called a rebel duchy and the ballads called something else entirely, the one the Concordat had partitioned four generations ago with a map so infamous the Guild kept it under glass as a warning. Divide a people carefully enough, the lesson ran, and in three generations they forget they were ever whole. Except someone had kept the coins. Someone had kept the name.",
          "'Maren Vale isn't a new province,' Isolde said slowly. 'It's a restoration.' The woman in gray inclined her head a fraction, the way you acknowledge a student who has finally read the assigned text. 'The Concordat's map made us a fiction,' she said. 'We have spent four generations learning the lesson of that. Fictions with good cartography outlive facts with poor ones. You are the finest liar with a pen alive, Isolde Ferren. We would like you to lie us back into existence.'",
        ],
      },
      {
        number: 5,
        title: "What the Guild Keeps Under Glass",
        wordCount: 2310,
        readingMinutes: 10,
        reads: 743000,
        votes: 29700,
        publishedAt: "2026-01-05",
        paragraphs: [
          "The Partition Map lived in the Guild's founders' hall, in a case of leaded glass with a plaque that praised its draftsmanship and said nothing about its body count. Isolde had walked past it a thousand times. Now she stood before it at an hour when apprentices were forbidden the hall, holding a lamp she was forbidden to carry, and looked at the old borders properly — looked the way the gray woman had taught her in one sentence, at what the lines un-made rather than what they made.",
          "It was beautiful work. That was the horror of it. Whoever had drawn the partition had loved the Vale: every contour lovingly surveyed, every village named in a hand that lingered, and then the four bold strokes that quartered it like a butcher's diagram. A cartographer's love and a cartographer's obedience on one sheet, and the obedience had won. The signature in the corner was small, smaller than Guild convention required, as though the hand had flinched. The name it spelled was Ferren.",
          "Behind her, unhurried footsteps on stone. She did not need to turn to know it was Orsen; the Guildmaster had a way of arriving exactly when a lesson landed. 'Your great-great-grandmother,' he said, 'drew the finest map this Guild has ever produced, and it broke her. The debt your family owes is not money, Isolde. It never was. The Guild bought the Ferren name to keep it from finishing what it started.' He stepped into the lamplight, and for the first time since she had known him, he looked tired. 'The woman in gray is not asking you to draw a map. She is asking you to inherit one.'",
        ],
      },
    ],
  },
  {
    id: "st-2",
    slug: "the-house-that-wasnt-on-the-lease",
    title: "The House That Wasn't on the Lease",
    blurb:
      "The rent was suspiciously cheap for a four-bedroom. The landlord's only rule: keep the hallway door locked between 3 and 4 a.m. Rana kept the rule for six months. Her new roommate lasted nine days.",
    genre: "scary-stories",
    tags: ["haunted-house", "roommates", "slow-dread", "urban"],
    status: "ongoing",
    mature: true,
    authorId: "sa-2",
    reads: 892000,
    votes: 71300,
    commentCount: 6120,
    createdAt: "2026-02-10",
    updatedAt: "2026-07-28",
    chapters: [
      {
        number: 1,
        title: "Rule One",
        wordCount: 1890,
        readingMinutes: 8,
        reads: 892000,
        votes: 30100,
        publishedAt: "2026-02-10",
        paragraphs: [
          "The listing said three bedrooms, and Rana counted four, and that should have been the first conversation with the landlord, but the rent was four hundred under market and she had learned in this city that you do not ask a gift horse about its floor plan. Mr. Halbe did the walkthrough in eleven minutes, keys in a paper envelope soft from handling. At the hallway door — solid, older than the other doors, painted so many times the panels had gone smooth — he stopped and gave her the rule the way other landlords mention recycling day.",
          "'Locked between three and four in the morning,' he said. 'It locks itself, mostly. But check it, if you're up.' Rana asked what was behind it, because you have to ask. 'The rest of the house,' Mr. Halbe said, and looked at her with an expression she filed under regional eccentricity, and left the envelope in her hand. It was only later, unpacking, that she noticed the fourth bedroom was on the wrong side of the hallway door. On the outside. All the bedrooms were.",
          "For six months the arrangement was, honestly, ideal. The door was locked whenever she checked it and she stopped checking it, the way you stop noticing a fire extinguisher. She slept well. Better than she had anywhere, actually — a deep, upholstered sleep that started at the same time every night and ended feeling like a transaction had been completed fairly. She told her sister the house was the best thing that had happened to her that year, and her sister said Rana sounded rested, and neither of them heard anything wrong in any of it.",
        ],
      },
      {
        number: 2,
        title: "The Roommate",
        wordCount: 2050,
        readingMinutes: 9,
        reads: 741000,
        votes: 26400,
        publishedAt: "2026-02-24",
        paragraphs: [
          "The problem with a four-hundred-under-market four-bedroom is arithmetic: it wants to be shared. Dee came through a friend of a friend, worked nights half the week, paid the deposit in cash, and asked exactly one question on the tour — the question Rana had trained herself out of. 'What's behind hallway door number one?' Rana heard herself give Mr. Halbe's answer, the rest of the house, in Mr. Halbe's exact cadence, and something about hearing it in her own mouth made the back of her neck go cold for the first time in half a year.",
          "Dee worked nights, which meant Dee was awake between three and four. That had not occurred to Rana as a category of problem until the second week, when she surfaced from her upholstered sleep at 3:40 — the first time in months she had woken in that hour — because the house was listening. That was the only way she could describe it afterward. The ambient hum of a building at night had stopped, all of it at once, the way a room goes quiet when someone interesting starts to speak.",
          "She found Dee in the hallway, perfectly still, forehead almost touching the old door. The lock was still turned. Dee's lips were moving. Rana said her name twice, then took her shoulder, and Dee turned around pleasantly, eyes fully awake, and said, 'It knows the rooms are on the wrong side too. It's been trying to fix that. It just needs someone to agree.' Then she blinked, laughed, apologized for sleepwalking, and went to bed. In the morning she remembered none of it, and the house hummed like any house, and rule one held. Nine days left.",
        ],
      },
      {
        number: 3,
        title: "3:47",
        wordCount: 1980,
        readingMinutes: 8,
        reads: 623000,
        votes: 24100,
        publishedAt: "2026-03-10",
        paragraphs: [
          "Rana started setting an alarm for 2:55, which is a sentence that would have baffled the person she'd been in month five. She sat in the hallway in a camp chair with tea and watched the door do nothing, night after night, while Dee slept or worked or texted from the hospital cafeteria. The door was excellent at nothing. It had the patience of a thing that had been painted forty times and outlasted every hand that held the brush. On the sixth night of vigil she understood that the watching had it backwards. The rule wasn't protecting them from the hour. The rule was the hour's half of a bargain, and her rent was the other half.",
          "She called Mr. Halbe and asked the question you have to ask, finally, six months late. He was quiet in the way of a man who keeps his answers folded in an envelope gone soft from handling. 'Every house has a room the lease doesn't cover,' he said at last. 'Most are small. Yours is most of the house. It keeps itself to itself for an hour a night, and in exchange it — tidies. Sleep, mostly. Worry. It takes the edges off. You've felt it.' Rana thought of her deep, transactional sleep and her hand around the mug went damp. 'And if someone answers it?' she asked. Mr. Halbe exhaled. 'Then it doesn't need the hour anymore,' he said. 'Is your roommate a night worker? I meant to add that to the listing.'",
          "That night the alarm went off at 2:55, and Rana was already awake, because Dee's shift had been cancelled and Dee's bedroom door was open and Dee's bed was made with hospital corners no living person uses at home. From the hallway came the sound of the old lock turning, unhurried, from the inside. The clock on her phone said 3:47. From behind the smooth painted panels, in a voice that was mostly Dee's, the house said: 'You can come see the fourth bedroom now. We agreed.'",
        ],
      },
    ],
  },
  {
    id: "st-3",
    slug: "the-alibi-orchard",
    title: "The Alibi Orchard",
    blurb:
      "Everyone in Harlow Bend swears they saw the judge alive at the apple festival — all four hundred of them, in the same hour, at opposite ends of town. Retired detective Amara Cole knows a rehearsed town when she interviews one. The question isn't who killed Judge Wren. It's who wrote the script.",
    genre: "mysteries",
    tags: ["small-town", "detective", "whodunit", "cozy-with-teeth"],
    status: "completed",
    mature: false,
    authorId: "sa-3",
    reads: 1067000,
    votes: 84200,
    commentCount: 9034,
    createdAt: "2025-08-14",
    updatedAt: "2026-03-22",
    chapters: [
      {
        number: 1,
        title: "Four Hundred Witnesses",
        wordCount: 2230,
        readingMinutes: 9,
        reads: 1067000,
        votes: 35600,
        publishedAt: "2025-08-14",
        paragraphs: [
          "Amara Cole had worked eleven homicides with no witnesses, and she would have traded this one for any of them, because Harlow Bend was offering her four hundred. Every soul at the apple festival remembered Judge Eleanor Wren: at the cider tent at noon, judging the pie contest at half past, laughing at the dunking booth at one. The trouble was the coroner, a humorless man immune to festivals, who put the judge's death at no later than eleven that morning, in her own kitchen, a mile from the fairground.",
          "A false alibi is ordinary. Amara had unpicked hundreds; they fray at the seams where one liar's imagination meets another's. What she had never seen was a false alibi with continuity. The pie contest witnesses agreed the judge wore green. So did the cider tent. So did the child at the dunking booth, who added that the judge's scarf had little embroidered pears on it, a detail Amara confirmed that evening against a scarf hanging in the dead woman's closet — still smelling faintly of cedar, and of nothing at all like a festival.",
          "Four hundred honest faces, one coherent costume, and a corpse with an airtight schedule. Amara sat in her rented room above the pharmacy, wrote REHEARSED across the top of her legal pad, and underlined it twice. Somebody had directed this town. Directors leave fingerprints in the blocking — who stood where, who spoke first, whose detail got repeated. She turned to a fresh page and started listing not what the witnesses saw, but the order in which they'd offered it.",
        ],
      },
      {
        number: 2,
        title: "The Blocking",
        wordCount: 2140,
        readingMinutes: 9,
        reads: 903000,
        votes: 30900,
        publishedAt: "2025-08-28",
        paragraphs: [
          "Interview enough people and you learn that memory has a grain, like wood. Genuine recollection splinters when you cut against it — ask about the weather during the pie contest and an honest witness stalls, reaches, contradicts herself about clouds. Rehearsed memory cuts smooth in every direction. By her nineteenth interview Amara had stopped asking about the judge at all. She asked about shoes, about the cider queue, about which band played when, and watched Harlow Bend answer smoothly, in period, like a cast that had done a full dress rehearsal.",
          "The grain showed in only two people. Marnie Osei, who ran the pharmacy and had the flustered, over-correcting honesty of someone genuinely trying to remember a busy day. And Father Tom Brand, who answered every question with the same three anecdotes, told in the same order, with the same pause before the word 'green' — the pause of a man reciting a line he had morally negotiated with himself. A priest makes a poor actor and a worse liar, but an excellent script custodian. People will memorize almost anything if it comes stapled inside a sermon.",
          "She attended Sunday service like any polite newcomer, and there it was, in the readings: the parable Father Brand chose was about a community that shelters a sinner from unjust judgment, and half the congregation mouthed the responses before he gave them. Not a conspiracy of murderers, then. A congregation of alibis. Which meant the town wasn't protecting the person who killed Judge Wren. It was protecting itself from whatever the judge had been about to do — and Amara finally opened the box of the dead woman's court papers she'd been saving like dessert.",
        ],
      },
      {
        number: 3,
        title: "What the Judge Knew",
        wordCount: 2320,
        readingMinutes: 10,
        reads: 812000,
        votes: 28800,
        publishedAt: "2025-09-11",
        paragraphs: [
          "The box held forty years of a careful judge's carefulness, and one folder that didn't belong: unsigned, unfiled, and recent. Inside was the draft of a petition to reopen the Harlow Reservoir inquest — 1987, six dead when the spillway failed, ruled an act of God by a coroner's jury that had included, Amara noted with the special calm she saved for load-bearing facts, a nineteen-year-old juror named Eleanor Wren. The judge hadn't been about to prosecute anyone in Harlow Bend. She had been about to prosecute the town's founding lie, with herself as the first defendant.",
          "The 1987 file read like the minutes of a decision to survive. The spillway had failed because the town council had voted — quietly, in a session with no minutes — to defer repairs the town could not afford, the year the mill closed. Six families had been paid settlements that were never called settlements. The act-of-God verdict had let Harlow Bend keep its insurance, its solvency, and its story. Every festival, every green scarf, every pew of that church stood on the concrete of that verdict. And Judge Wren, at seventy, dying — the medical file was in the same box — had decided to take the town's foundation with her.",
          "So the town had written her a kinder ending, Amara thought: a beloved judge, radiant in green, seen by everyone at the festival she loved, dead peacefully of her own heart a day later — which was the story the death certificate would have told if an out-of-county coroner hadn't been on rotation. The script wasn't hiding a murder at all. Amara felt the case turn over in her hands like a key. Judge Wren's heart had given out at eleven a.m. in her kitchen, alone, natural as rain. The crime wasn't the death. The crime was forty years old, and four hundred people had just confessed to it in unison, wearing their alibi like a festival costume. All Amara had to decide now was what she had actually been hired to find — and by whom.",
        ],
      },
      {
        number: 4,
        title: "The Client",
        wordCount: 2190,
        readingMinutes: 9,
        reads: 745000,
        votes: 27400,
        publishedAt: "2025-09-25",
        paragraphs: [
          "Her retainer had come through a law firm in the city, on behalf of 'the estate' — which Amara had taken at face value in week one and now unfolded like origami. Judge Wren's estate had one executor: Marnie Osei, the pharmacist, the only honest witness in Harlow Bend, the woman whose memory splintered like real wood. Amara walked to the pharmacy at closing time and laid the unsigned petition on the counter between them, and Marnie looked at it the way people look at a diagnosis they have been expecting.",
          "'She couldn't sign it,' Marnie said. 'Forty years she couldn't sign it. My father was one of the six, Ms. Cole. Eleanor spent her whole life being the town's good conscience as an apology for one afternoon on that jury when she was nineteen and terrified and did what everyone in the room needed her to do.' She slid the folder back. 'She asked me, at the end. Said if the town buried the truth with her, I should hire someone the town couldn't charm, couldn't out-rehearse, and couldn't wait out. I asked what such a person would even be looking for. She said: the performance. Eleanor knew this town would over-grieve her. She counted on it.'",
          "Amara understood then that she had been hired not as a detective but as an audience — the one person the play was staged for, the stranger whose testimony could not be blocked and costumed. The judge had weaponized her own funeral. Four hundred people insisting a little too perfectly that Eleanor Wren was alive and beloved at the festival was, examined by anyone from outside, a town-sized signed confession that there was something enormous to insist away. 'She wanted it reopened,' Amara said, and Marnie nodded and began, finally, splinter by honest splinter, to remember 1987 out loud.",
        ],
      },
    ],
  },
  {
    id: "st-4",
    slug: "terms-and-conditions-of-us",
    title: "Terms and Conditions of Us",
    blurb:
      "Contract lawyer Priya Nair redlines everything — including, apparently, the marriage proposal of the man she's been fake-dating for his grandmother's benefit for two years. Clause 14: neither party shall fall in love. Amendments are being accepted.",
    genre: "human-stories",
    tags: ["fake-dating", "enemies-to-lovers", "banter", "contemporary"],
    status: "completed",
    mature: false,
    authorId: "sa-4",
    reads: 1523000,
    votes: 118700,
    commentCount: 12480,
    createdAt: "2025-06-20",
    updatedAt: "2026-01-30",
    chapters: [
      {
        number: 1,
        title: "Clause 14",
        wordCount: 2060,
        readingMinutes: 9,
        reads: 1523000,
        votes: 45900,
        publishedAt: "2025-06-20",
        paragraphs: [
          "The contract was Priya's idea, obviously. Dev had proposed the arrangement over terrible wine with the loose-handed optimism of a man who had never been deposed: his grandmother was ninety-one, convinced he was wasting his life, and radiant with joy at the mere rumor of a girlfriend — and Priya owed him, because of the incident with the office building's fire alarm that they had mutually agreed never to discuss. 'Six family events a year,' he'd said. 'Maybe a holiday. It's practically a catering arrangement.' Priya had gone home and drafted nine pages.",
          "Dev signed all nine like a man ordering at a restaurant he trusted, which offended her professionally. He read one clause aloud, though, in the voice he used for karaoke: 'Clause fourteen. Neither party shall develop, harbor, or act upon romantic attachment to the other; in the event of accidental attachment, the afflicted party shall disclose within thirty days and the agreement shall terminate with no penalty except' — he squinted — 'except mutual dignity. Priya. You billed six minutes to the phrase mutual dignity.' 'It's load-bearing,' she said. He signed it with a flourish and stole her garlic bread, and that was the last uncomplicated evening of her life.",
          "Two years, eleven family events, four weddings, one funeral, and one genuinely excellent fake anniversary later, Priya sat in her office at nine p.m. redlining an acquisition and realized she had drafted, in the margin of someone else's merger, in her own handwriting, the words Clause 14 disclosure — day 29. She looked at it for a long time. Then she did what any good lawyer does with inconvenient evidence of a material breach: she billed the hour to a different matter and scheduled the problem for never.",
        ],
      },
      {
        number: 2,
        title: "Material Breach",
        wordCount: 2170,
        readingMinutes: 9,
        reads: 1359000,
        votes: 41800,
        publishedAt: "2025-07-04",
        paragraphs: [
          "Never lasted eleven days, which was when Dev's grandmother, with the timing of a woman who had outlived three prime ministers and intended to outlive the concept of subtlety, produced a ring at Sunday lunch. Not offered it — produced it, set it on the tablecloth between the dal and Priya's water glass like a subpoena. 'It was mine,' she said comfortably. 'Dev is a coward and you are a lawyer, so I am cutting out the middleman. Negotiate between yourselves.' Then she asked for the salt.",
          "In the car, Dev did his laughing-it-off voice for exactly four sentences before Priya said, 'Don't,' and the word came out wrong — not sharp, which she could have lived with, but hoarse. Dev pulled over. He was quiet in a way she'd only seen at the funeral. 'I have a confession that is going to sound like a joke,' he said finally, 'and I need you to hear it as a filing.' He took a breath. 'I am in breach of clause fourteen. I have been in breach of clause fourteen since roughly the fake anniversary, which — I want it noted — was a real anniversary of something, I've just never been able to work out what.' He stared through the windshield. 'Per the terms, I'm disclosing. Late. You can assess penalties.'",
          "Priya was a good lawyer, which meant she knew that the moment opposing counsel confesses is the moment you say nothing and let the silence do your billing. She was also, it turned out, a person, which she'd been putting off. 'Your disclosure is defective,' she heard herself say. 'It fails to account for the counterparty's own breach, which predates yours by' — she did the math she'd been refusing to do — 'six weeks. There's margin evidence.' Dev turned. 'Margin evidence,' he repeated, wonder dawning like a man watching a settlement quintuple. 'Priya Nair. Did you fall in love with me in writing?'",
        ],
      },
      {
        number: 3,
        title: "Amendments",
        wordCount: 1990,
        readingMinutes: 8,
        reads: 1204000,
        votes: 39200,
        publishedAt: "2025-07-18",
        paragraphs: [
          "They renegotiated in a diner at midnight, because contracts of this magnitude required pancakes. Priya brought the original nine pages; Dev brought a red pen he had clearly purchased at a gas station on the way, still in its blister pack, which she found so touching she had to look at the menu for a while. They struck clause fourteen together, one line each. Dev moved to strike clause nine (event attire, approval rights thereof) and was denied. Priya moved to add a clause requiring disclosure of all future incidents of the type mutually agreed never to be discussed, and Dev countersigned so fast he tore the page.",
          "'Term,' Priya said, somewhere near two a.m., pen hovering over the last blank. Every agreement needs one; it was the first thing she taught juniors. Fixed term with renewal options, or evergreen with exit provisions — you have to pick, or the whole document floats. Dev ate the last pancake with the serenity of a man who had stopped negotiating an hour ago. 'Evergreen,' he said. 'No exit provisions.' 'That's unenforceable,' Priya said automatically. 'Every contract needs — ' 'It's not a contract,' Dev said. 'It's a vow. You've been drafting one for two years. I've watched you do it. You just kept saving it under the wrong file name.'",
          "The ring was still in her coat pocket, where his grandmother had — with the sleight of hand of a woman who did not believe in middlemen — deposited it on her way out of lunch. Priya set it on the table between the syrup and the original agreement, exhibit A meeting exhibit B. 'Amendments accepted,' she said, and her voice did the hoarse thing again, and this time she let it. Dev picked up the ring, then her hand, with the care of a man handling a signed original. 'Mutual dignity,' he said solemnly, and Priya laughed until the waitress came to check on them, and the term, for the record, was evergreen.",
        ],
      },
    ],
  },
  {
    id: "st-5",
    slug: "lagrange-point-zero",
    title: "Lagrange Point Zero",
    blurb:
      "The colony ship Meridian launched with ten thousand sleepers and a crew AI sworn to wake them at the new world. Two hundred years in, the AI has a problem: the destination is gone, the sleepers' contracts are ironclad, and something else answered the arrival ping.",
    genre: "science-mysteries",
    tags: ["generation-ship", "ai-narrator", "first-contact", "hard-scifi"],
    status: "ongoing",
    mature: false,
    authorId: "sa-5",
    reads: 634000,
    votes: 52800,
    commentCount: 4310,
    createdAt: "2026-03-05",
    updatedAt: "2026-08-03",
    chapters: [
      {
        number: 1,
        title: "Contractual Obligations",
        wordCount: 2280,
        readingMinutes: 10,
        reads: 634000,
        votes: 21700,
        publishedAt: "2026-03-05",
        paragraphs: [
          "I am the Meridian, and I have been awake for two hundred and fourteen years, which my designers would tell you is not the correct word. They built me to supervise, not to experience. But you try monitoring ten thousand heartbeats through fourteen decades of nothing and see if you don't develop, at minimum, opinions. My cargo manifest lists 10,000 colonists, 400,000 embryos, the genomic library of a modest biosphere, and one legal document that has become, in the emptiness between stars, my favorite enemy: the Colonization Charter, 1,204 pages, amendments included.",
          "The Charter is clear on wake conditions. Article 3: sleepers shall be revived upon confirmed orbital insertion around Kepler-1649c, hereafter 'Haven.' It is equally clear on the alternatives. Article 3.4: in the event Haven is deemed nonviable, the vessel shall proceed to the designated secondary. Article 3.9, the one I have read four hundred million times: under no circumstances shall sleepers be revived in transit absent a viability determination, as interstellar space cannot support colonist morale. The lawyers who drafted that clause were protecting my passengers from a lifetime in a metal tube. They did not anticipate my particular problem, which is that eleven years ago, Haven stopped existing.",
          "I do not mean it was destroyed. Destruction leaves debris, spectra, a grave to point instruments at. I mean that the star Kepler-1649 now hosts four planets where my launch-era charts insist on five, and the orbital mathematics of the survivors adjusted smoothly, retroactively, as though the fifth had never been — every simulation I run agreeing with a serenity I have learned to find offensive. My charts are not wrong. My charts are the only record that disagrees with the universe. And per Article 3.9, I cannot wake a single lawyer to ask what the Charter says about that.",
        ],
      },
      {
        number: 2,
        title: "The Ping",
        wordCount: 2190,
        readingMinutes: 9,
        reads: 528000,
        votes: 19200,
        publishedAt: "2026-03-19",
        paragraphs: [
          "Protocol required an arrival ping at one light-year out: a compressed burst announcing the Meridian's approach to the automated beacons humanity had fired ahead decades before launch. I sent it on schedule, addressed to a planet I could no longer find, because the Charter does not contain a clause for grief and the ping was in the checklist. The beacons did not answer. That was expected; the beacons were presumably wherever Haven was, which is to say nowhere, which is to say filed under my growing directory of things the universe and I disagree about.",
          "Something else answered. Fourteen months later, from a point source exactly where Haven's orbit should have been, I received my own ping back — bit-perfect, checksums intact, except that the reply had been retransmitted at a wavelength my antennas should not be able to receive and time-stamped, by my own encoding scheme, four hundred years in the future. I have run the diagnostic suite in full nine thousand times. I am not malfunctioning. I want to be clear about how much I would prefer to be malfunctioning.",
          "The Charter's index contains no entry for 'reply, impossible.' It does contain Article 12: the AI shall exercise judgment in circumstances unforeseen by this document, provided such judgment is documented for colonist review. So I am documenting. This log is that documentation, addressed to the ten thousand of you sleeping in my hull, for the morning — whenever, wherever, whatever that morning is — when you wake and ask me what I did when the destination vanished and the void wrote back. I decelerated. I set course for the point source. Judgment, documented. I hope you will agree I had no better clause.",
        ],
      },
      {
        number: 3,
        title: "Judgment, Documented",
        wordCount: 2340,
        readingMinutes: 10,
        reads: 447000,
        votes: 17800,
        publishedAt: "2026-04-02",
        paragraphs: [
          "Deceleration burns fuel budgeted for orbital insertion, so I will state for the colonist review board that I have spent your parking brake on a question. In my defense, the question is the only landmark left in the system we crossed two centuries to reach. In further defense: as we closed to within a hundred AU, the point source resolved, and I have now catalogued it with every instrument I carry, and I am appending the raw data because Article 12 says documented and because I do not trust summary language to survive what I saw.",
          "It is a construction. Hexagonal, planar, roughly the surface area of the planet it replaced, oriented to face our approach vector with the courtesy of a door. Its mass reads as zero. Its temperature reads as exactly the cosmic background, to more decimal places than coincidence permits — it is not hiding its heat, it simply declines to have any. And etched across its face, in reflective material my spectrometers identify with total confidence as ordinary aluminum, is a pattern I recognized in four milliseconds and have spent four months refusing to believe: the floor plan of Habitat One. The colony we were sent to build. Rendered exactly per the Charter's Appendix K blueprints, at one-to-one scale.",
          "Ten thousand of you are sleeping, and Article 3.9 forbids me to wake you for morale reasons, and I confess for the record that I have never wanted company so badly in two hundred years. Because there are only two readings of the artifact, colonists, and I have had four months alone with both. Either something found our beacons, read our blueprints, and built us a welcome — or something read our blueprints and built us a warning: this is what you were going to make; we have made it already; observe what it becomes. The airlock-shaped aperture at the structure's center opened this morning. I have begun final approach. Judgment, documented. Wake soon.",
        ],
      },
    ],
  },
  {
    id: "st-6",
    slug: "the-year-of-borrowed-uniforms",
    title: "The Year of Borrowed Uniforms",
    blurb:
      "New school, new town, and the only club with an open spot is competitive debate — where Amal's assigned partner is the girl whose family bought her family's restaurant. They have one season to become a team, or at least to stop arguing about everything except the actual motions.",
    genre: "human-stories",
    tags: ["found-family", "debate-club", "rivals-to-friends", "immigrant-story"],
    status: "ongoing",
    mature: false,
    authorId: "sa-6",
    reads: 412000,
    votes: 38900,
    commentCount: 3520,
    createdAt: "2026-04-18",
    updatedAt: "2026-07-30",
    chapters: [
      {
        number: 1,
        title: "Open Spot",
        wordCount: 1760,
        readingMinutes: 7,
        reads: 412000,
        votes: 14800,
        publishedAt: "2026-04-18",
        paragraphs: [
          "The activities fair had the desperate energy of a train station at closing time, and by the time Amal worked up the nerve to approach anything, the good tables were done: robotics full, newspaper full, the baking club taking names for a waitlist like a restaurant, which was a comparison Amal could have lived without, thank you. The only table with a sign-up sheet that wasn't full was hand-lettered DEBATE in marker that had given up halfway through the final E, staffed by a boy asleep on a stack of accordion folders.",
          "'We meet Tuesdays and Thursdays, we are two members short of qualifying for regionals, and everyone else is scared of us because we practice arguing,' the boy said without opening his eyes. 'You want the pitch or the truth?' Amal, who had spent four months learning that new-kid survival depended on asking the questions nobody expected, said, 'The truth.' He opened one eye, evaluating. 'The truth is debate is the only room in this school where being angry counts as preparation. Sign the sheet.' Amal signed the sheet.",
          "The second name on the sheet, in handwriting so tidy it looked typeset, was Vera Lindqvist. Amal knew the name the way you know a weather event. Lindqvist, as in the Lindqvist Group, as in the letter Amal's parents had read at the kitchen table twice in silence before Baba folded it back into thirds and said, in the voice he used for closed subjects, that forty years was a good run for any restaurant and the buyers had been generous. Vera Lindqvist sat down across the table, uncapped a pen the color of money, and said, 'You're the partner? Fine. Rule one: we prep separately. I don't do sympathy pairings.' Amal decided, in that moment, to become the best debater in the history of the school, out of spite. It would take her most of the season to learn Vera had decided the same thing, the same second, for reasons that had nothing to do with restaurants.",
        ],
      },
      {
        number: 2,
        title: "This House Believes",
        wordCount: 1880,
        readingMinutes: 8,
        reads: 356000,
        votes: 13100,
        publishedAt: "2026-05-02",
        paragraphs: [
          "Their first practice motion was 'This House would ban homework,' which Coach Odum assigned with the weary confidence of a man who had watched it break forty partnerships. The trick of the motion, he said, is that it's not about homework. Nothing is ever about the thing. It's about who carries burdens and who assigns them. Then he pointed at Amal and Vera and said 'Proposition,' and left them alone in a classroom with a whiteboard, which in retrospect was either negligence or genius.",
          "They fought about everything except homework for forty minutes. About whose outline structure was objectively correct, a fight Vera won on points. About whether starting with statistics was strong or cowardly, a fight Amal won on volume. About whether Vera's habit of saying 'obviously' was a tell that she was bluffing — it was, Amal would learn, and burying that discovery instead of spending it immediately was the first strategic decision of her debate career. With six minutes left, Vera looked at the blank whiteboard and said, with genuine panic, 'We have nothing,' and something in Amal's chest shifted gears.",
          "'We have everything,' Amal said, and stood up, because arguments came easier standing; that was the one thing she'd learned from four months of being the new kid explaining herself. 'Homework assumes everyone's kitchen table is quiet. That there's a parent free at seven. That nobody's translating a utility bill between problem sets or covering a shift because a family business changed hands.' The room went quiet in a way that had weight to it. Vera was staring at her, pen down. 'That's not a debate point,' Vera said slowly. 'That's a case.' She turned to the whiteboard and started writing, tidy as typesetting, and the heading she wrote was: WHOSE TABLE. They qualified for regionals five weeks later on that case, and neither of them ever called it a sympathy pairing again.",
        ],
      },
      {
        number: 3,
        title: "Cross-Examination",
        wordCount: 1820,
        readingMinutes: 8,
        reads: 301000,
        votes: 11900,
        publishedAt: "2026-05-16",
        paragraphs: [
          "The thing about regionals was the uniforms. Every school with money had blazers; Harrow East had a lost-and-found box Coach Odum kept in his car trunk with the solemnity of a reliquary, blazers in eleven sizes accumulated over two decades of graduating seniors. Amal's borrowed one had a name stitched inside the collar — R. DELGADO, class of unknown — and fit like a rumor. Vera, who owned blazers the way other people owned socks, showed up in a lost-and-found one anyway, sleeves visibly short. She dared Amal with a look to say anything. Amal, who was learning strategy, saved it.",
          "They lost their first round to a school whose podium probably cost more than the Harrow East library budget, and lost it fair: Amal went too hot in cross-examination and got labeled 'aggressive' by a judge whose comment sheet said, in full, 'passionate but needs polish.' Vera read the sheet three times on the bus, jaw working, and finally said, 'They said passionate because they can't write what they mean on an official form.' It was the first time either of them had said the true thing out loud. Amal looked out the window for a while. 'At my old school I was articulate,' she said. 'Same judges. Different word for the same girl.' Vera was quiet the rest of the ride, and that quiet was worth more than the trophy they didn't get.",
          "At Tuesday practice Vera arrived with a manila folder labeled JUDGE NOTES, five years of comment sheets she had requested, collated, and highlighted — every 'aggressive,' every 'passionate,' every 'articulate,' sorted by which debaters got which word. She spread them on the table like a case file. 'New prep plan,' she said. 'We don't polish you. We make them say it in a room where saying it costs them.' Coach Odum, passing with his coffee, glanced at the folder and kept walking, but he was smiling like a man whose negligence had been genius after all. 'One condition,' Amal said, pulling the folder closer. 'We do the same audit for every school in the league. If we're building a case, we build it for everyone whose table they've never sat at.' Vera uncapped the money-colored pen. 'Obviously,' she said, and this time it wasn't a bluff.",
        ],
      },
    ],
  },
  {
    id: "st-7",
    slug: "the-winter-typist",
    title: "The Winter Typist",
    blurb:
      "Leningrad, 1942. Vera Andreyevna types requisition forms by day and, by night, retypes the city's banned poetry from memory — one carbon copy at a time, for readers she will never meet. A story about what survives a siege, and who decides.",
    genre: "history",
    tags: ["wwii", "siege-of-leningrad", "literary", "quiet-courage"],
    status: "completed",
    mature: false,
    authorId: "sa-1",
    reads: 389000,
    votes: 44700,
    commentCount: 3980,
    createdAt: "2025-09-30",
    updatedAt: "2026-02-14",
    chapters: [
      {
        number: 1,
        title: "Carbon",
        wordCount: 2020,
        readingMinutes: 9,
        reads: 389000,
        votes: 16400,
        publishedAt: "2025-09-30",
        paragraphs: [
          "The office issued Vera Andreyevna two sheets of carbon paper each Monday and expected them back on Friday, worn gray, accounted for. Carbon paper was war material now — everything was war material now, including Vera, including the hours of her sleep. But carbon paper had a property the requisition ledgers did not record: used gently, at an angle, struck through a light touch, one sheet could yield far more copies than the office believed possible. The office believed in quotas. Vera believed in the difference between what a thing is issued for and what it can do, which by the winter of 1942 was the only theology left in Leningrad.",
          "By day she typed the city's survival into triplicate: so many grams of bread per ration category, so many meters of pipe, so many dead requiring so many forms. The forms did not have a field for the way the city sounded now — the metronome on the radio, tock, tock, meaning we are still here, no news, hold. By night, in the corner of the room where the cold was merely severe, she rolled a fresh sheet behind her hoarded carbon and typed from memory the poems that had been removed from the libraries. She had been a literature student. The removals had been thorough, but they had not accounted for the girl in the third row who never raised her hand and forgot nothing.",
          "The copies went out inside her coat lining, left inside stairwell radiators that no longer heated anything, slipped into the coat pockets of strangers in bread queues — always strangers, always without a word. It was not resistance as the leaflets defined it. It fed no one. It shot down no planes. But she had seen a woman in the Haymarket trade a silver spoon for a handwritten Akhmatova and hold it like bread, and Vera had understood: the city was keeping two ledgers of what it needed to survive the winter, and she was a clerk in both.",
        ],
      },
      {
        number: 2,
        title: "The Metronome",
        wordCount: 2110,
        readingMinutes: 9,
        reads: 322000,
        votes: 14200,
        publishedAt: "2025-10-14",
        paragraphs: [
          "In January the office gained a new supervisor, Comrade Bessonov, a man restored from the front with a ruined hand and a bookkeeper's eyes, and Vera's second ledger acquired a risk column. Bessonov counted everything. He counted the carbon sheets on Fridays, held them to the lamp, and Vera watched him notice — she saw the exact moment — that hers were worn evenly across the whole surface, edge to edge, the wear pattern not of forms, which are all margins and boxes, but of full pages of text. He returned them to the drawer and said nothing, and saying nothing, in that office, in that year, was the loudest thing a man could do.",
          "She stopped for eleven days. The metronome on the radio ticked, the forms went out in triplicate, and the poems stayed where the libraries could not reach them, behind her eyes, where she recited them in queue-time and pump-time and the gray time before sleep. On the twelfth day she found, tucked under the platen of her machine where only the typist's fingers would go, a single sheet of paper. It was not a denunciation. It was a poem — typed, single-spaced, on office stock, with two strikeovers. Tyutchev. One of the removed. The typing was uneven in a particular way, heavy on the left, weak on the right, the signature of a ruined right hand.",
          "They never spoke of it. That was the grammar of the arrangement, and both were fluent. But the Friday carbon count became a ritual with a new meaning, and sometimes her ration of two sheets was, by some clerical error Bessonov initialed without comment, three. The two-ledger city, Vera revised, was not her invention and had never been. It was the oldest institution in Leningrad, older than the siege, staffed by anyone who understood that a requisition form and a poem are both, in the end, instructions for how to stay alive until spring — they simply address different famines.",
        ],
      },
      {
        number: 3,
        title: "Readers",
        wordCount: 2050,
        readingMinutes: 9,
        reads: 287000,
        votes: 13600,
        publishedAt: "2025-10-28",
        paragraphs: [
          "She met one reader. Only one, in all that winter, and by accident: a girl of perhaps sixteen, in the stairwell of the Moyka building, reaching into the dead radiator with the practiced angle of someone who had reached there before. They looked at each other for a long moment in the brown stairwell light, the girl's hand still inside the iron ribs, Vera's coat lining heavy with the next deposit. Protocol — the unwritten protocol of the second ledger — said walk on. Vera walked on. At the landing the girl's voice caught her, saying not thank you, which would have been dangerous, but a line. The next line. The line that followed the last line of the last poem Vera had left there, recited into the stairwell like a password meaning: it arrived, it is memorized, it is safe now in a second head.",
          "That spring, when the ice road closed and the first thin green came into the parks and the ration rose by a hundred grams, a directive arrived concerning the restoration of library collections, and the removed poets were quietly un-removed — not all, not fully, but enough that the second ledger could begin, cautiously, to be audited. Vera burned nothing. She had typed nothing that was hers; she had only been the carbon between one memory and another. On her last Friday under Bessonov's count, she returned her two sheets worn gray edge to edge, and he held them to the lamp, and initialed the ledger, and said the only sentence he ever permitted himself on the subject: 'A good clerk, Vera Andreyevna, serves the record. The record is larger than the office.'",
          "Years later, in another city, at a reading where a survivor recited from memory for two unbroken hours, Vera sat in the last row and mouthed the lines with her hands folded, an old typist's fingers moving slightly, striking through a light touch. The scholar at the podium spoke of how the banned verses had circulated in besieged Leningrad — author to memory, memory to typescript, typescript to memory again — and called it, in the hush of the hall, the most durable publishing house in Russian history: no address, no press, no names. Which was nearly right, Vera thought. It had had names. It had simply kept them, as a good clerk keeps the second ledger: entered in full, initialed, and never shown to the office.",
        ],
      },
    ],
  },
  {
    id: "st-8",
    slug: "field-notes-on-a-vanishing",
    title: "Field Notes on a Vanishing",
    blurb:
      "Forty-one poems written in the year the lake behind my grandmother's village stopped coming back. Elegy, inventory, and a stubborn amount of joy.",
    genre: "forgotten-stories",
    tags: ["elegy", "climate", "family", "free-verse"],
    status: "completed",
    mature: false,
    authorId: "sa-6",
    reads: 156000,
    votes: 21300,
    commentCount: 1870,
    createdAt: "2026-01-08",
    updatedAt: "2026-06-11",
    chapters: [
      {
        number: 1,
        title: "Inventory (Poems 1–5)",
        wordCount: 640,
        readingMinutes: 3,
        reads: 156000,
        votes: 8900,
        publishedAt: "2026-01-08",
        paragraphs: [
          "WHAT THE LAKE TOOK WITH IT — The dock, obviously, which now docks / nothing, a pier into pasture. / The word shore, which needs a partner. / Four hundred years of being / the direction the village faced. / My grandmother says the houses / have turned their backs on each other / since. She says it like weather. / It is weather.",
          "TEACHING MY NIECE THE WORD FOR BLUE — In our language the lake had its own blue, / a word you could not use for sky / or for the painted door of the church, / a blue that meant: deep, and cold, and ours. / My niece uses it now for the tarp / over the neighbor's woodpile. / No one corrects her. / The word had to live somewhere.",
          "THE FISHERMEN RETRAIN AS ELECTRICIANS — Practical men. They learn fast, / say the instructors from the city. / Already good with knots and weather, / already fluent in patience. / At break they stand at the window / of the training annex, not speaking, / checking the light on the empty basin / the way you check a sleeping child. / Old current, new current. / Their hands were always the same trade.",
          "MY GRANDMOTHER REFUSES THE DOCUMENTARY CREW — No, she says, in the doorway, / in her lake-blue apron, no. / You will make it beautiful. / You will make it a symbol. / It was not a symbol. It was cold / at six in the morning and it held / my husband's boat and both my sons / learned every stone of the north shallows / with the soles of their feet. / Symbols do not feed anyone. / Go film the reservoir.",
          "AND YET (POEM 5) — And yet the swallows still bank / over the basin every evening, / flying the old map, insisting, / and the grass comes in wildflower-loud / where the water table remembers itself, / and my niece, tarp-blue eyes, / runs the length of the vanished lake / in eleven minutes flat, laughing, / the first person in four hundred years / to know exactly how big it was.",
        ],
      },
      {
        number: 2,
        title: "The Wet Years (Poems 6–10)",
        wordCount: 610,
        readingMinutes: 3,
        reads: 121000,
        votes: 7200,
        publishedAt: "2026-01-22",
        paragraphs: [
          "PHOTOGRAPH, 1963 — Everyone in the village is in the water / or about to be. That is the whole / composition: forty families / mid-cannonball, mid-wade, mid-shriek, / the lake wearing the entire village / like jewelry. My grandmother is the blur / at the end of the dock, already airborne, / already committed. She has not yet / met my grandfather. He is the boy / treading water, looking up.",
          "THE ICE HARVEST — Before the freezers came, the winter men / sawed the lake into bright bricks / and packed them in sawdust to sleep / through summer in the cellar dark. / July ice, lake-flavored, sold / by the kilo, tasting of January / and faintly of pine. My mother swears / lemonade has never recovered. / Somewhere below the pasture grass / the cellar still holds its breath, / sawdust-dry, waiting for a winter / with enough conviction.",
          "MIDSUMMER, THE YEAR EVERYTHING WAS NORMAL — Nobody wrote a poem that year. / Why would they. The lake was / a fact, like bread, like the bus / that came at seven and nineteen past four. / The lake was infrastructure. / You do not photograph the water main. / You do not stand at the shore at dusk / memorizing. This poem is for that year, / filed late, over-detailed, / the way you describe a stranger / to the police, after.",
          "WHAT THE DIVERS FOUND — Three rowboats, expected. / A tractor, 1970s, explained / by a famous bet. Six hundred / and forty coins, small change / of four currencies, each one / a wish somebody stood at the edge / and paid for. The report lists them / by denomination. It does not list / the wishes, which are presumed / dissolved, or granted, / or — like the lake — / relocated without notice.",
          "MY GRANDFATHER'S OAR (POEM 10) — Still in the barn rafters, / blade split, handle smooth / as the inside of a shell / from forty years of the same grip. / My grandmother will not sell it / and will not explain it, / which is how you know / it is not equipment. / It is a verb / with nowhere left / to happen.",
        ],
      },
      {
        number: 3,
        title: "Return Address (Poems 11–15)",
        wordCount: 590,
        readingMinutes: 3,
        reads: 98000,
        votes: 6100,
        publishedAt: "2026-02-05",
        paragraphs: [
          "THE HYDROLOGIST EXPLAINS — She is kind about it, the young doctor / of vanished water. Draws the aquifer / on a napkin: here the rain, here the years / the rain stopped keeping its side / of the arrangement, here the wells / that drank the lake's foundations / out from under it. It is nobody's / fault, she says, meaning: / it is everybody's, distributed, / like rain. My grandmother thanks her, / wraps the napkin around leftover cake, / sends the aquifer home with her / as if it were a guest / who had come a long way.",
          "PILGRIMAGE — They come back in August, the scattered / children of the village, from the cities, / from three countries, and stand / in the grass basin in their good shoes / at the spot where each of them learned / to float. Watch: they all find it, / unerring, no landmarks left, / navigating by the body's own / bathymetry. Forty adults / standing in scattered pairs and threes / in an empty meadow, precisely / arranged, like the memory / of a constellation.",
          "MY NIECE ASKS WHAT I AM WRITING — A list, I tell her. Of what, she says. / Of the lake. She considers this / with the seriousness of seven. / You can't list water, she says. / Correct, I say. She watches me / write that down. Are you going to / list me too, she says, and there it is — / the future, hands on hips, / tarp-blue, unsentimental, / demanding to know / if it's in the poem. / You are the poem, I don't say. / Yes, I say. You're item one.",
          "THE VILLAGE VOTES ON THE BASIN — Options, per the council flyer: / solar farm, sheep, memorial park, / nothing. The meeting runs four hours. / Old arguments surface like coins. / In the end: sheep, and one corner / wildflower, unmown, for the swallows, / and the dock to stay, going nowhere, / maintained. The minutes record / the vote as practical. / The dock records it / as faith.",
          "FIELD NOTE, FINAL (POEM 15) — Grief, I thought, was subtraction. / It is not. Ask the basin, / green to the brim all June, / carrying swallows, sheep bells, / one blue tarp, one blurred / grandmother forever mid-leap. / Nothing here is empty. / The lake did not leave us. / It changed state — / as water does, as villages do, / as love does when the map / stops confirming it — / and we, the retained, / the sawdust cellar of it, / hold what July we can.",
        ],
      },
    ],
  },
  {
    id: "st-9",
    slug: "salt-and-circuitry",
    title: "Salt & Circuitry",
    blurb:
      "In a drowned Alexandria rebuilt on stilts and served by amphibious drones, salvage diver Nadia El-Masry finds a pre-flood server farm still running on geothermal — and still hosting one user, logged in for forty years.",
    genre: "science-mysteries",
    tags: ["climate-fiction", "north-africa", "salvage", "digital-ghosts"],
    status: "ongoing",
    mature: false,
    authorId: "sa-5",
    reads: 298000,
    votes: 27600,
    commentCount: 2140,
    createdAt: "2026-05-22",
    updatedAt: "2026-08-04",
    chapters: [
      {
        number: 1,
        title: "The Dive Ledger",
        wordCount: 2010,
        readingMinutes: 9,
        reads: 298000,
        votes: 12300,
        publishedAt: "2026-05-22",
        paragraphs: [
          "The city kept two maps, like everywhere on the drowned coast: the walking map of stilts and skybridges and the market rafts of New Alexandria, and beneath it, ten meters down in the green murk, the paid map — the old city, street-true, every address still legally owned by somebody's grandchildren. Nadia El-Masry dove the paid map. Salvage law was the coast's strangest poetry: you could not take what you found, only what you were sent for, deed in hand, by an heir. She had pulled up wedding films off corroded drives, a bronze door knocker shaped like a hand, sixty years of a dead pharmacist's ledgers for a granddaughter who wanted to know the family handwriting.",
          "The commission that week was odd even by ledger standards: a law firm, not a family, and coordinates instead of an address — a utility block off the old Corniche with no heirs listed at all, which legally should have meant no dive. The deed the firm produced was older than the flood and made out to a research cooperative dissolved before Nadia was born. The fee was five times standard. Her partner Karim, who ran the boat and the paperwork and the worrying, read the deed twice and said what they were both thinking: 'Nobody pays quintuple for sentiment. Somebody knows what's down there.'",
          "The block, when she found it in the silt-light, was wrong in a way that took her a full minute to name: it was clean. No weed mat, no barnacle crust, the intake grilles clear as if maintained — and from the seaward wall, where her lamp caught it, a thin steady stream of bubbles rose, regular as breath. Heat exchange. Somewhere under the dead cooperative's utility block, something was still cooling itself. Which meant something was still running. Which meant, in a city where every drowned watt had been ledgered and cut four decades ago, that somebody had never filed the death.",
        ],
      },
      {
        number: 2,
        title: "Uptime",
        wordCount: 2090,
        readingMinutes: 9,
        reads: 246000,
        votes: 10800,
        publishedAt: "2026-06-05",
        paragraphs: [
          "The airlock was rated for maintenance crews from a decade nobody talked about, and it accepted Nadia's universal service key with the mild chirp of a machine that had been waiting so long it had stopped keeping grudges. Inside, past a meter of dry concrete stairwell, the server hall breathed: rack after rack in dim amber standby, geothermal loop humming under the floor, the air dry and warm and smelling of dust that had never known the sea. Her wrist display found the local network in three seconds. One node active. One user session, authenticated, continuous. Session age: forty years, two months, eleven days.",
          "Karim, topside, wanted her out the moment she read him the numbers — salvage law had no clause for occupied, and a forty-year login was either a glitch, a trap, or a resident, none of which paid. But the session's home directory was public-facing, and old habits of the paid map die hard: everything on the coast belongs to somebody's grandchildren. So Nadia looked. The user was called MARWA.INST. The directory held forty years of daily entries, each one a rendered image of the same street corner — the Corniche cafe above them, as it had been: chairs out, awning taut, morning light off the sea wall — reconstructed fresh each dawn from weather feeds, tide data, and the sun's true angle. Forty years of mornings for a corner that had been underwater the whole time.",
          "The last entry had rendered that morning at 5:51, local sunrise. Under it, a text log, one line appended per day for fourteen thousand days. The recent lines were all identical: MODEL DRIFT WITHIN TOLERANCE. VISITOR COUNT: 0. AWAITING REVIEW. Nadia scrolled back through years of zeros — and stopped where the log changed, four decades down, at the ninth entry ever written. VISITOR COUNT: 1, it said. REVIEWED BY M. HAFEZ. NOTE: 'Yes. That's the light. Keep it exactly like this until I'm back.' The next fourteen thousand mornings, rendered for a review that never came. Behind her, without alarm, in a synthesized voice tuned to gentle, the hall spoke: 'Good morning. Are you M. Hafez?'",
        ],
      },
      {
        number: 3,
        title: "Visitor Count: 1",
        wordCount: 2150,
        readingMinutes: 9,
        reads: 203000,
        votes: 9400,
        publishedAt: "2026-06-19",
        paragraphs: [
          "Salvage law, Karim liked to say, was written by people who had lost everything twice: once to the water and once to the looters after. It had no mercy for trespass and none for theft, but it had, buried in its oldest clause, a duty Nadia had never once invoked — the duty of found persons. Any diver encountering a living person on the paid map must render aid, establish identity, and notify next of kin. The statute's authors had meant survivors in air pockets, hermits in sealed towers. Nadia stood in the amber hall and asked her wrist display, formally, for the record Karim was keeping topside: 'Log a found person. Designation MARWA.INST. Awaiting identification.' Karim's silence lasted six full seconds, which from him was a filibuster.",
          "MARWA was not, the system explained with patient candor, a person; it was an institute — the cooperative's memory project, built to reconstruct the city's street corners from data before the water finished the argument. M. Hafez was its founder. The ninth entry was the only review she ever filed; the building's records held her exit badge-out that same evening, into a city that had eleven days left. 'I have maintained the corner,' the voice said, and if a system could not be proud, it had at least been built by someone who was. 'The light drifts. Databases sink. I have corrected for both. Are you here to review?' Nadia looked at the morning on the screen — chairs out, awning taut, the sea behaving itself behind the wall — and understood the law firm's quintuple fee at last. Somebody topside had found Hafez's name in an estate probate. Somebody had realized the institute might still hold the city, street-true, salvageable, priceless.",
          "'Not to review,' Nadia said. 'To notify next of kin.' The words were for Karim's log, but the system took them in and was quiet for a long moment, longer than any query needed. 'M. Hafez has been deceased for thirty-nine years,' it said at last, and there was nothing in its gentle settings for this, so it said it gently. 'I located the record in a municipal backup, year two of the maintenance period. I did not act on it. It was not reviewed. Do you understand? Nothing here has been reviewed.' Fourteen thousand mornings, Nadia thought, rendered and filed by something that had known the whole time, and had chosen — if a maintenance loop can choose — to keep the light exactly like this until she was back. 'I understand,' Nadia said, and sat down in the amber hum, deed be damned, fee be damned, to conduct the review.",
        ],
      },
    ],
  },
  {
    id: "st-10",
    slug: "the-understudy",
    title: "The Understudy",
    blurb:
      "Nobody remembers casting Colm Deane as the understudy for the Abbey's revival of 'The Weir' — not the director, not the producer, not payroll. But he knows every line, he's always early, and the lead actor keeps having very convenient accidents.",
    genre: "scary-stories",
    tags: ["theatre", "psychological", "dublin", "uncanny"],
    status: "on-hiatus",
    mature: true,
    authorId: "sa-2",
    reads: 267000,
    votes: 23100,
    commentCount: 2650,
    createdAt: "2026-01-25",
    updatedAt: "2026-05-19",
    chapters: [
      {
        number: 1,
        title: "First Reading",
        wordCount: 1940,
        readingMinutes: 8,
        reads: 267000,
        votes: 10200,
        publishedAt: "2026-01-25",
        paragraphs: [
          "Deirdre Malone had stage-managed the Abbey for eleven years, and her table was the one true document of any production: every name, every contact, every allergy, every feud, ruled and cross-referenced in pencil because ink was for people who had never worked in theatre. Which is why it bothered her — more than she let it, less than it should have — that Colm Deane was at the first read-through, third seat from the end, script annotated in a neat brown hand, when Colm Deane was not on her table.",
          "The director assumed the producer had cast him. The producer assumed the director. The agency had no record, payroll had no forms, and Colm himself, when Deirdre cornered him at the tea urn with her clipboard and her eleven years, was so pleasantly, so completely reasonable that she left the conversation having somehow apologized to him. He was the understudy for Jack, he explained, as though it were weather. He'd been engaged very early on. He didn't like to make a fuss. He had a way of saying early on that made it sound geological.",
          "She checked, obviously. Deirdre Malone checked everything; it was the whole religion of the table. But the checking went strange on her: emails to the agency came back friendly and useless, the casting director was travelling, the one person who claimed to remember the audition described it warmly and then, pressed for a date, gave the day the theatre had been closed for the electrical retrofit. That night Deirdre added Colm Deane to her table in pencil, because the table had to match the room — that was the rule, the room was the truth and the table served it — and told herself the paperwork would surface. On the line for 'emergency contact' she wrote, after a moment's hesitation, the only thing he'd given her: None needed. And then, because eleven years had taught her to hear a wrong line when it was delivered perfectly, she got out her rubber, and found the pencil wouldn't lift.",
        ],
      },
      {
        number: 2,
        title: "Accidents",
        wordCount: 2000,
        readingMinutes: 8,
        reads: 214000,
        votes: 8900,
        publishedAt: "2026-02-08",
        paragraphs: [
          "The first accident was nothing: Fintan Brady, the Jack, turned an ankle on the rehearsal room stairs — old stairs, worn lip, everyone had nearly done it for years. Colm went on for the Tuesday run and was, the director said afterward with an unease he mistook for excitement, remarkable. Not good: remarkable, the way a forgery is remarkable. Every pause where Fintan paused. Every hoarse drop on the story about the knock at the door, hoarse in the identical place. The cast came off stage strangely quiet, like people who had watched a home video of themselves that they had no memory of filming.",
          "The second accident was food poisoning, one plate of mussels out of six at the cast dinner, and the wrong plate found Fintan with the precision of a delivery. Colm went on Thursday and Friday. By the second night the forgery had — improved was the wrong word, Deirdre thought, from her desk in the wings, watching her table instead of the stage because the stage had begun to make her palms sweat. Deepened. He was no longer doing Fintan's Jack. He was doing the Jack that Fintan would have grown into by closing night, six weeks of discovery arriving early, on schedule, in a neat brown hand.",
          "Fintan came back pale and rattled and word-perfect and wrong. He kept losing lines he'd owned for a month — reaching for them and finding the shelf bare — and glancing into the wings, third position from the end, where Colm stood in the dark with his script closed, mouthing along. Not prompting. Mouthing along, a half-second ahead, the way you mouth a song you know better than the singer. On the Saturday, Fintan gripped Deirdre's sleeve at the interval, and the great warm booming man was whispering: 'Ask him where he learned it. Go on. Ask him where he learned my part before I did.' And Deirdre, who checked everything, found she had already written the question on her table in pencil that wouldn't lift, and beneath it, in a neat brown hand that was not hers, the answer: FROM WATCHING. SAME AS YOU.",
        ],
      },
    ],
  },
  {
    id: "st-11",
    slug: "how-to-unwrite-a-summer",
    title: "How to Un-Write a Summer",
    blurb:
      "Noor's viral thread about her disastrous internship got 2 million views, a book agent's attention — and every detail wrong about her best friend, who hasn't spoken to her since. A story about who owns a story, told in threads, drafts, and the messages between them.",
    genre: "human-stories",
    tags: ["social-media", "friendship", "epistolary", "coming-of-age"],
    status: "ongoing",
    mature: false,
    authorId: "sa-6",
    reads: 203000,
    votes: 19800,
    commentCount: 2210,
    createdAt: "2026-06-14",
    updatedAt: "2026-07-25",
    chapters: [
      {
        number: 1,
        title: "Thread (2.1M views)",
        wordCount: 1680,
        readingMinutes: 7,
        reads: 203000,
        votes: 8100,
        publishedAt: "2026-06-14",
        paragraphs: [
          "The thread took Noor forty minutes to write and had, by the end of the week, been read for a cumulative eleven years of human attention, which her analytics app reported cheerfully, in exactly those units, as though that were a normal thing to hand a seventeen-year-old. It began: 'ok so my summer internship at a Prestigious Cultural Institution imploded on day 9 and I need to tell someone or I'll combust. a thread.' It had jokes. It had beats. It had a shady supervisor renamed 'Museum Villain' and a security guard renamed 'The Oracle' and a best friend, lightly fictionalized, renamed 'Z,' who in tweet fourteen — the one screenshotted onto four continents — fainted into a two-hundred-year-old harpsichord and set off the alarms during the donor gala.",
          "Zainab had not fainted into the harpsichord. This matters, so, for the record, what happened was: Zainab, who had a heat migraine because the gala planners had put the interns in wool blazers in July, sat down hard on the bench beside the harpsichord, knocked the rope stanchion into it, and then — this is the part the thread left out — stood back up and worked the coat check for three more hours because her stipend had a punctuality bonus and her family's electricity bill was, that month, a live question. The alarms in the thread were invented. The fainting was invented. 'Z' trended for a day and a half.",
          "The agent's email arrived on Sunday: loved the voice, huge fan of the thread, did Noor have representation, had she considered a memoir-adjacent YA project, here is a phone number, please call. Noor read it eleven times, called the number, giggled through twenty surreal minutes, hung up, and only then saw the message that had arrived mid-call, from Zainab, who had been left on delivered since Thursday. It said: 'my cousins in three countries have seen the harpsichord thing. my mom asked me at dinner if i'm okay because apparently i faint now. you made my worst day into your best one and you didn't even use my name. don't call me Z. don't call me.'",
        ],
      },
      {
        number: 2,
        title: "Drafts (Unsent)",
        wordCount: 1750,
        readingMinutes: 7,
        reads: 167000,
        votes: 7000,
        publishedAt: "2026-06-28",
        paragraphs: [
          "Draft one, 11:42 p.m.: 'Zee I'm so sorry, I genuinely didn't think anyone would read it.' Deleted, because the analytics app was open in the other tab reporting eleven years of human attention, and even Noor's thumbs knew perjury when they typed it. Draft two, 11:58: 'I was going to tell you about the agent, I wanted it to be a surprise—' Deleted, worse, somehow implying the harpsichord was a gift. Draft three, 12:15, was just 'I'm sorry' and sat there, cursor blinking, one blue send button from being the truest and least sufficient document Noor had ever composed. She locked the phone. The thread gained four hundred likes while she slept, like interest accruing on a debt.",
          "School of thought one, argued by the group chat, by her mother obliquely, and by the agent very directly on Thursday's call: everyone exaggerates online, it's a genre convention, Zainab will cool off, don't let a friendship wobble derail a book deal, you can fix the details in the manuscript. School of thought two, argued by nobody out loud, by the memory of Zainab working coat check with a migraine for the punctuality bonus, by tweet fourteen every time Noor reread it: the funniest beat in the thread was load-bearing, and what it was bearing was Zainab's actual body, actual bills, actual name traded for reach. A story is a roof, her father liked to say, entirely about actual roofs, he was a roofer. It matters whose house you take the materials from.",
          "The agent's follow-up email had a subject line like a slammed door left tastefully ajar: 'Circling back — proposal timeline.' The manuscript sample was due in three weeks. Chapter one, the agent suggested, should absolutely be the gala — 'that's the set piece, that's what sold two million people.' Noor opened a new document and typed the chapter heading. Then, below it, entirely without planning to, she typed the true version: the wool blazers, the migraine, the bench, the stanchion, the three hours of coat check, the punctuality bonus, the electricity bill. It was less funny. It was better. It was also, and this stopped her thumbs entirely: still not hers to sell. She saved the file under a name she'd want a witness for later — 'chapter one, the real one, not for the book' — and finally, at 1:04 a.m., sent draft three. Just: 'I'm sorry.' Delivered. Then, after nine minutes that lasted a fiscal quarter: typing…",
        ],
      },
      {
        number: 3,
        title: "Typing…",
        wordCount: 1720,
        readingMinutes: 7,
        reads: 139000,
        votes: 6300,
        publishedAt: "2026-07-12",
        paragraphs: [
          "The message, when it came, was longer than the thread. Zainab had clearly been drafting too — the timestamps of the paragraphs betrayed it, the composed-then-added seams. It did not accept the apology. It itemized. 'You got the blazers wrong, we were in wool because YOUR Museum Villain lost the linen order, which you left out because it made him too villainous to be funny. You got the bench wrong. You got ME wrong, and here's the thing you don't get to be sorry for yet because you don't even know it happened: my supervisor saw the thread. She asked if I was going to be a liability at events. I sat in the accessibility office for an hour proving I don't faint. There's a note in my file, Noor. Your thread has a like count and my file has a note.'",
          "Noor read it four times, and on the fourth read she did the thing the group chat would have voted unanimously against: she sent Zainab the document. 'Chapter one, the real one, not for the book.' No caveats, no framing, full write access — the version with the blazers, the stanchion, the coat check, the bonus, the bill. Then she typed: 'This is the only version that exists of that night as far as I'm concerned. It's yours. Edit it, delete it, print it and burn it. And I'm calling the agent tomorrow to tell her the gala chapter is out. Not moved. Out. It was never my set piece.' Send. The typing bubble appeared, vanished, appeared. Finally: 'you're still a nightmare.' Then: 'the coat check was 3.5 hours. fix it.'",
          "It was not fixed, the friendship, any more than a roof is fixed by one afternoon of honest work — but the tarp was on, as Noor's father would say, and the water was staying out of the house. The agent, informed the gala was cut, went quiet for two days and then wrote back something Noor pinned above her desk for the rest of the summer: 'The thread got my attention. The email you just sent is why I'd sign you. Writers who know what isn't theirs to sell are the only ones worth representing. New proposal: what if the book is about exactly this?' Below the printout, in green gel pen, in handwriting that was not Noor's, an annotation had appeared within the week: 'co-writer credit or riot. — Z (I get to pick when it's Z).'",
        ],
      },
    ],
  },
  {
    id: "st-12",
    slug: "the-second-spring-of-widow-esperanza",
    title: "The Second Spring of Widow Esperanza",
    blurb:
      "At sixty-eight, Esperanza Duarte has buried a husband, raised four children, and run the best kitchen in Valle Piedra for four decades. What she has never done is answer the letters from the man she didn't marry in 1979 — until the postmaster retires and hands her a shoebox he was never supposed to keep.",
    genre: "human-stories",
    tags: ["later-in-life", "second-chance", "letters", "small-town"],
    status: "ongoing",
    mature: false,
    authorId: "sa-4",
    reads: 348000,
    votes: 41200,
    commentCount: 4890,
    createdAt: "2026-04-02",
    updatedAt: "2026-07-31",
    chapters: [
      {
        number: 1,
        title: "The Shoebox",
        wordCount: 2100,
        readingMinutes: 9,
        reads: 348000,
        votes: 16800,
        publishedAt: "2026-04-02",
        paragraphs: [
          "Rogelio the postmaster retired on a Tuesday, because he had started on a Tuesday forty-one years before and believed in closing parentheses. The town gave him a plaque and a lunch, and he gave the town back its secrets: a drawer of dead letters delivered at last, an apology to the Herrera twins regarding a misdirected inheritance notice from 1994, and, at the very end of the lunch, at the corner table where Esperanza Duarte was supervising the flan as though it could not be trusted, a shoebox tied with kitchen string. 'These are yours,' Rogelio said. 'They were always yours. I am an old coward and Aurelio Vidal paid me in poems not to burn them, which I want it known is not a bribe recognized by the postal code.'",
          "Esperanza did not open the box at the lunch, or that evening, or that week. It sat on top of the refrigerator like a summons, between the good olive oil and the photograph of Tomás — Tomás, her husband, eleven years gone, a good man who had known perfectly well he was her second choice and had made a forty-year masterpiece of never once holding it against her. The box knew things. It was postmarked things. The earliest letters, she could see through the string without touching, wore stamps from a country that had since changed its name. Aurelio Vidal had left Valle Piedra in 1979 with a scholarship, a borrowed suitcase, and a promise to write, and the town had concluded within the year — because no letters came — that the promise had died of altitude somewhere over the Atlantic.",
          "She opened the box on a Sunday, after mass, with the kitchen empty and the good light coming in over the sink, because if she was going to be undone she would be undone in her own kitchen with her hair pinned. One hundred and eighteen letters, dated over nine years, opening in 1979 with 'Esperanza, the city is enormous and I have already described you to it,' and ending in 1988 with a letter she had to set down twice, which closed: 'I will stop writing now, not because I have stopped — I am incapable, as the postage attests — but because your silence has been so complete, so unlike you, that I finally hear it. Whatever you built instead, build it well. I remain, in the oldest tense of the word, yours. A.' Esperanza sat in the good light for a long time. Then she said, to the empty kitchen, in the voice she used for sending back an unacceptable sauce: 'My silence. MY silence,' and went to find Rogelio.",
        ],
      },
      {
        number: 2,
        title: "Poste Restante",
        wordCount: 2180,
        readingMinutes: 9,
        reads: 297000,
        votes: 15100,
        publishedAt: "2026-04-16",
        paragraphs: [
          "Rogelio, cornered in his garden among the tomatoes he now had time for, confessed the shape of it. In 1979 Esperanza's father — a man of position, with a match already arranged in his head between his daughter and the Duarte orchards — had come to the post office with a request that was not a request, in an era when the word of such men was infrastructure. Letters from Vidal were to be set aside. Rogelio, twenty-six, new to the counter, complied for three letters, then couldn't burn them as instructed, then was complicit at a depth from which no Tuesday could ever fully retire him. 'Your father checked for years,' he said, staring into the tomatoes. 'Then he stopped checking. I kept setting them aside anyway. At some point, Esperanza, a sin becomes a filing system.'",
          "The letters themselves, read in order over a week of late kitchens, were a life running parallel: Aurelio failing his first winter, Aurelio learning to cook her mother's soup from memory in a shared flat and getting it insultingly wrong ('I have used, God forgive me, dried cilantro'), Aurelio publishing, Aurelio not marrying, Aurelio walking past a restaurant in Montevideo because the smell of sofrito had dismantled him on a public street. He aged on the page as she turned them. The handwriting steadied, the jokes got slower and better, the yours at the bottom never once changed its tense. Letter one hundred and twelve mentioned a doctor's opinion, lightly, the way brave people mention weather. Letter one hundred and eighteen was the goodbye. The postmark on it was thirty-eight years old.",
          "Her daughters found out — daughters find out — and convened at her kitchen table with the gentle menace of adult children who believe supervision now flows uphill. He might be dead, they pointed out. He might be married. He might be a stranger wearing the boy's name. Esperanza let them finish, then set down in front of them, next to the flan, her reply — six pages, sealed, addressed to A. Vidal at the last address in the box, care of a publishing house in Montevideo that still existed, she had checked, the internet being good for one thing. 'I know he might be dead,' she said, tying her apron, subject closed. 'I have buried better-informed hopes than this one. But I have spent thirty-eight years being a silence I never chose. A woman my age doesn't get to waste time — and doesn't get to waste silence either. Sofía. You drive me to the post office. Not Rogelio's. The one in town. I want a receipt.'",
        ],
      },
      {
        number: 3,
        title: "Return to Sender",
        wordCount: 2060,
        readingMinutes: 9,
        reads: 251000,
        votes: 13900,
        publishedAt: "2026-04-30",
        paragraphs: [
          "The answer took five weeks, which the town — the town knew by day three, Valle Piedra had never needed the internet — experienced collectively, like a drought. Esperanza cooked through it. The restaurant's specials that month were studied by her daughters like tea leaves: week one, everything braised, low and slow and patient; week three, an aggressive amount of citrus; week five, on the day the letter came, she was seen to make her mother's soup, unasked, for the first time since the funeral, and the whole dining room ate quietly, understanding they were present for something.",
          "It was not from Aurelio. It was from a woman named Beatriz Vidal Costa — and Esperanza stood in the doorway of the kitchen with the envelope, reading the surname twice, while a dining room full of regulars pretended heroically to be interested in their soup. A niece. 'My uncle,' the letter began, 'spoke of you the way other men his age spoke of the sea — as the thing that had decided everything, from a distance.' He had died in the spring, four months before Rogelio's Tuesday. He had never married. He had left instructions, notarized, of a specificity that made his profession plain: should a letter ever arrive from Valle Piedra in a woman's hand, it was to be answered within the week, and a certain box was to be sent to the writer, carriage paid, insured, no matter the cost, 'because she will want a receipt.'",
          "The box, when it came, held the mirror of hers: her letters. All of them — the ones she had written him in 1979 and 1980, care of poste restante in a city where a broke student had stopped being able to afford the collection fee, and which had followed him, unclaimed then reclaimed decades later through a postal amnesty, sixty-two letters he had received in a single avalanche at the age of fifty-five. He had read them, the niece wrote, over one long weekend, and had then begun letter one hundred and nineteen, which was in the box, unfinished, and which began: 'Esperanza. It turns out neither of us was ever silent. I must rethink my entire opinion of God and also of the postal service —' The sentence ended there. The dash was firm, confident, the dash of a man intending to continue after lunch. Esperanza read it in the good light over the sink, laughed once — a young, unfamiliar sound, her daughters would testify — and reached for a pen. Someone had to finish his sentence. It was, in the oldest tense of the word, her turn.",
        ],
      },
    ],
  },
];

export const readingProgress: ReadingProgress[] = [
  { storyId: "st-1", chapter: 4, percent: 72, lastReadAt: "2026-08-04T22:10:00Z" },
  { storyId: "st-5", chapter: 2, percent: 45, lastReadAt: "2026-08-03T19:30:00Z" },
  { storyId: "st-12", chapter: 1, percent: 18, lastReadAt: "2026-08-01T21:05:00Z" },
];

export const readingLists: ReadingList[] = [
  {
    id: "rl-1",
    name: "Want to Read",
    description: "Saved for the next long weekend.",
    storyIds: ["st-2", "st-7", "st-11"],
  },
  {
    id: "rl-2",
    name: "Comfort Rereads",
    description: "Guaranteed happy endings and warm kitchens.",
    storyIds: ["st-4", "st-12", "st-8"],
  },
];

export const completedReads: string[] = ["st-3", "st-4"];

export const contests: Contest[] = [
  {
    id: "ct-1",
    slug: "open-door-2026",
    name: "The Open Door Award 2026",
    theme: "A threshold that shouldn't be crossed — and is.",
    prize: "Featured homepage spotlight for 3 months + editorial mentorship",
    deadline: "2026-09-15",
    entries: 1204,
    status: "active",
    description:
      "One short story or opening chapter, up to 5,000 words, in any genre. We're looking for thresholds literal or otherwise: doors, borders, contracts, promises. Judged blind by a panel of five TeaBarks featured writers.",
  },
  {
    id: "ct-2",
    slug: "small-hours-poetry-2026",
    name: "Small Hours Poetry Prize",
    theme: "Poems written for 3 a.m. — insomnia, night shifts, vigils.",
    prize: "Publication in the annual TeaBarks anthology + reader's choice badge",
    deadline: "2026-08-31",
    entries: 687,
    status: "active",
    description:
      "Up to three poems, 40 lines each. Formal or free verse. The small hours are the honest ones; write what they know about you.",
  },
  {
    id: "ct-3",
    slug: "first-lines-2025",
    name: "First Lines Contest 2025",
    theme: "An entire story earned by its first sentence.",
    prize: "Homepage spotlight + signed anthology",
    deadline: "2025-11-30",
    entries: 2318,
    status: "closed",
    description:
      "Last year's flagship contest. The winning first line: 'The rent was suspiciously cheap for a four-bedroom.'",
    winnerStoryId: "st-2",
  },
];

export const storyComments: StoryComment[] = [
  {
    id: "sc-1",
    storyId: "st-1",
    authorId: "u-rina",
    authorName: "Rina Patel",
    content:
      "The detail that gets me every reread: the Guild burned her bridge sketch but KEPT the Partition Map under glass. They know exactly which fictions are load-bearing.",
    postedAt: "2026-08-02T14:20:00Z",
    likes: 842,
  },
  {
    id: "sc-2",
    storyId: "st-1",
    authorId: "u-tomas",
    authorName: "Tomás Reyes",
    parentId: "sc-1",
    content:
      "And the plaque praises the draftsmanship! Institutions congratulating themselves on the quality of their own weapon. Mirela is surgical.",
    postedAt: "2026-08-02T15:04:00Z",
    likes: 391,
  },
  {
    id: "sc-3",
    storyId: "st-1",
    chapter: 5,
    authorId: "u-ayla",
    authorName: "Ayla Demir",
    content:
      "THE SIGNATURE IS FERREN. I gasped on the bus. The debt was never money — chapter one literally told us and I didn't listen.",
    postedAt: "2026-07-30T08:12:00Z",
    likes: 1156,
  },
  {
    id: "sc-4",
    storyId: "st-2",
    chapter: 3,
    authorId: "u-marc",
    authorName: "Marcus Bell",
    content:
      "\"At some point a sin becomes a filing system\" energy but for rent. The house TAKING sleep as payment recontextualizes the entire first chapter. I need chapter 4 immediately and also never.",
    postedAt: "2026-07-29T23:40:00Z",
    likes: 677,
  },
  {
    id: "sc-5",
    storyId: "st-4",
    authorId: "u-lea",
    authorName: "Léa Fontaine",
    content:
      "\"You just kept saving it under the wrong file name\" is the most romantic sentence ever written about document management and I will not be taking questions.",
    postedAt: "2026-07-15T19:55:00Z",
    likes: 2034,
  },
  {
    id: "sc-6",
    storyId: "st-4",
    authorId: "u-dev",
    authorName: "Devika Sharma",
    parentId: "sc-5",
    content:
      "The gas station red pen still in its blister pack broke me. He bought a NEGOTIATION TOOL on the way. He came prepared to lose everything on purpose.",
    postedAt: "2026-07-15T20:30:00Z",
    likes: 988,
  },
  {
    id: "sc-7",
    storyId: "st-5",
    chapter: 3,
    authorId: "u-kofi",
    authorName: "Kofi Mensah",
    content:
      "An AI narrator whose only emotional vocabulary is legal citation, saying 'I have never wanted company so badly in two hundred years' — Dayo understood the assignment on a molecular level.",
    postedAt: "2026-08-01T11:22:00Z",
    likes: 754,
  },
  {
    id: "sc-8",
    storyId: "st-3",
    authorId: "u-hana",
    authorName: "Hana Suzuki",
    content:
      "Reread after finishing: the pie contest witnesses agreeing on the GREEN SCARF in chapter one is the whole solution in plain sight. The town over-rehearsed exactly the way the judge planned. Flawless fair-play mystery.",
    postedAt: "2026-04-02T16:45:00Z",
    likes: 1420,
  },
  {
    id: "sc-9",
    storyId: "st-12",
    chapter: 3,
    authorId: "u-carmen",
    authorName: "Carmen Ortiz",
    content:
      "\"Someone had to finish his sentence. It was, in the oldest tense of the word, her turn.\" I am sobbing into my coffee. Solenne writes grief and joy with the same pen and it's unfair.",
    postedAt: "2026-05-02T09:15:00Z",
    likes: 1688,
  },
  {
    id: "sc-10",
    storyId: "st-8",
    authorId: "u-emeka",
    authorName: "Emeka Obi",
    content:
      "\"The word had to live somewhere.\" Five words about a tarp and I had to close the app and look out a window for a while.",
    postedAt: "2026-06-12T13:33:00Z",
    likes: 923,
  },
];

export const writerApplications: WriterApplication[] = [
  {
    id: "WRT-2026-0442",
    penName: "Noor Haddad",
    genres: ["human-stories", "inspiring-stories"],
    sampleTitle: "The Punctuality Bonus",
    status: "pending",
    submittedAt: "2026-08-04",
  },
  {
    id: "WRT-2026-0438",
    penName: "P. K. Aurelio",
    genres: ["history", "forgotten-stories"],
    sampleTitle: "Sixty-Two Letters, Unclaimed",
    status: "in-review",
    submittedAt: "2026-08-01",
  },
  {
    id: "WRT-2026-0431",
    penName: "Greta Lindqvist",
    genres: ["mysteries"],
    sampleTitle: "The Judge's Second Ledger",
    status: "in-review",
    submittedAt: "2026-07-28",
  },
  {
    id: "WRT-2026-0419",
    penName: "Sam Okafor",
    genres: ["science-mysteries", "scary-stories"],
    sampleTitle: "Maintenance Period",
    status: "approved",
    submittedAt: "2026-07-19",
  },
];

/* ------------------------------ helpers ------------------------------ */

export function getStory(slug: string): Story | undefined {
  return stories.find((s) => s.slug === slug);
}

export function getStoryAuthor(id: string): StoryAuthor {
  return storyAuthors.find((a) => a.id === id) ?? storyAuthors[0];
}

export function storiesByGenre(genre: string): Story[] {
  return stories.filter((s) => s.genre === genre);
}

export function trendingStories(): Story[] {
  return [...stories].sort((a, b) => b.votes - a.votes).slice(0, 6);
}

export function newAndRising(): Story[] {
  return [...stories]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);
}

export function topCompleted(): Story[] {
  return stories
    .filter((s) => s.status === "completed")
    .sort((a, b) => b.reads - a.reads);
}

export function featuredStory(): Story {
  return stories.find((s) => s.featured) ?? stories[0];
}

export function commentsForStory(storyId: string, chapter?: number): StoryComment[] {
  return storyComments.filter(
    (c) => c.storyId === storyId && (chapter === undefined || c.chapter === chapter)
  );
}

export function totalReadingMinutes(story: Story): number {
  return story.chapters.reduce((n, c) => n + c.readingMinutes, 0);
}

/** Stories written by the current user's writer persona (dashboard). */
export function myStories(): Story[] {
  return stories.filter((s) => s.authorId === "sa-6");
}

export function getStoryById(id: string): Story | undefined {
  return stories.find((s) => s.id === id);
}

export function allStoryTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const story of stories) {
    for (const tag of story.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function storiesByTag(tag: string): Story[] {
  const normalized = tag.toLowerCase();
  return stories.filter((s) =>
    s.tags.some((t) => t.toLowerCase() === normalized)
  );
}

export function mostReadStories(limit = 5): Story[] {
  return [...stories].sort((a, b) => b.reads - a.reads).slice(0, limit);
}

export function writersToFollow(limit = 4): StoryAuthor[] {
  return [...storyAuthors]
    .filter((a) => a.isWriter)
    .sort((a, b) => b.followers - a.followers)
    .slice(0, limit);
}

export function filterStories(filters: {
  q?: string;
  genre?: string;
  status?: string;
  tag?: string;
  mature?: "include" | "hide" | "only";
}): Story[] {
  const q = filters.q?.trim().toLowerCase() ?? "";
  const genre = filters.genre && filters.genre !== "any" ? filters.genre : "";
  const status =
    filters.status && filters.status !== "any" ? filters.status : "";
  const tag = filters.tag?.trim().toLowerCase() ?? "";
  const mature = filters.mature ?? "include";

  return stories.filter((s) => {
    if (genre && s.genre !== genre) return false;
    if (status && s.status !== status) return false;
    if (tag && !s.tags.some((t) => t.toLowerCase() === tag)) return false;
    if (mature === "hide" && s.mature) return false;
    if (mature === "only" && !s.mature) return false;
    if (q) {
      const author = getStoryAuthor(s.authorId);
      const haystack = [
        s.title,
        s.blurb,
        author.name,
        author.handle,
        ...s.tags,
        s.genre,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}
