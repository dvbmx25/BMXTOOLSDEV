// resources-data.js
// Edit this file to add/remove resources.
//
// Item shapes:
//   Regular link:  { title: 'Name', url: 'https://...', note: 'optional one-line' }
//   Quote:         { quote: '...', who: 'Name' }
//
// Category shape:
//   { category: 'Name', items: [...] }                          ← simple
//   { category: 'Name', subcategories: [ { category, items } ] } ← nested
//
// Tab shape:
//   Array: [ {category,...}, ... ]
//   Object: { disclaimer: '...', categories: [ ... ] }

const RESOURCES = {
  motivation: [

    /* ───────────── VIDEOS / SOCIAL MEDIA ───────────── */
    {
      category: 'Videos / Social Media',
      subcategories: [

        {
          category: 'Racing',
          items: [
            { title: 'Connor Fields — YouTube',     url: 'https://www.youtube.com/@connorfields11', note: 'Olympic Gold Medalist — race vlogs, training, recovery' },
            { title: 'Connor Fields — Instagram',   url: 'https://www.instagram.com/connorfields11' },
            { title: 'Drew Polk — YouTube',         url: 'https://www.youtube.com/@drewpolkbmx', note: 'Pro racer — national title chase, mental side of racing' },
            { title: 'Drew Polk — Instagram',       url: 'https://www.instagram.com/DrewPolkBMX' },
            { title: 'Cam Bramer — Instagram',      url: 'https://www.instagram.com/cambramer', note: 'Pro racer — race recaps, track insights, road vlogs' },
            { title: 'Joris Daudet — Instagram',    url: 'https://www.instagram.com/jorisdaudet33', note: 'French Olympic Champion, multi-time World Champion' },
            { title: 'Niek Kimmann — YouTube',      url: 'https://www.youtube.com/user/NiekKimmann', note: 'Dutch World Champion — on-board laps, race breakdowns' },
            { title: 'Niek Kimmann — Instagram',    url: 'https://www.instagram.com/niekkimmann' },
            { title: 'Sam Willoughby — Instagram',  url: 'https://www.instagram.com/samwilloughby91_', note: 'World Champion and Olympic Silver Medalist — now a coach' }
          ]
        },

        {
          category: 'Freestyle',
          items: [
            { title: 'Scotty Cranmer — YouTube',    url: 'https://www.youtube.com/@ScottyCranmer', note: 'X-Games medalist — daily vlogs, recovery journey, riding with friends' },
            { title: 'Billy Perry — YouTube',       url: 'https://www.youtube.com/@BillyPerry',    note: 'Street-focused first-person adventures' },
            { title: 'Harry Main — YouTube',        url: 'https://www.youtube.com/@HarryMain',     note: 'World-class park rider — Harrymania edits and vlogs' },
            { title: 'Ryan Taylor — YouTube',       url: 'https://www.youtube.com/@RyanTaylor',    note: 'UK rider — park riding, challenges, daily vlogs' },
            { title: 'Dennis Enarson — YouTube',    url: 'https://www.youtube.com/@DennisEnarson', note: 'All-terrain legend — high-quality weekly videos' },
            { title: 'Nikita Ducarroz — Instagram', url: 'https://www.instagram.com/nikitaducarroz', note: 'Olympic Bronze Medalist — mental health advocacy, documentaries' }
          ]
        }

      ]
    },

    /* ───────────────────── PODCASTS ───────────────────── */
    {
      category: 'Podcasts',
      items: [
        { title: 'DIG BMX Podcasts',         url: 'https://www.youtube.com/playlist?list=PLlZCVX_Q551YNKbCLWJou6O5QtpBWCsqL', note: 'In-depth interviews with pros — Aaron Ross, Chase Hawk, Alex Donnachie' },
        { title: 'UNCLICKED PODCAST',        url: 'https://podcasts.apple.com/ie/podcast/unclicked-podcast/id1447198515',      note: 'Dennis Enarson & Ryan Fudger — deep conversations' },
        { title: 'Kanode Knows BMX Podcast', url: 'https://podcasts.apple.com/us/podcast/kanode-knows-bmx-podcast/id1473214377', note: 'Bobby Kanode — riders, videographers, industry stories' },
        { title: 'Coffee Chatter',           url: 'https://podscan.fm/podcasts/coffee-chatter',                                note: 'Tory Nyhaug — weekly racing news, insights, banter' },
        { title: 'Late To The Gate',         url: 'https://podcasts.apple.com/gb/podcast/late-to-the-gate-bmx-racing-podcast/id1808652528', note: 'Racing-focused nonsense, in the best way' }
      ]
    },

    /* ───────────────────── READING ────────────────────── */
    {
      category: 'Reading',
      items: [
        { title: 'Flow: The Psychology of Optimal Experience', url: 'https://www.goodreads.com/book/show/66354.Flow', note: 'Mihaly Csikszentmihalyi — the science of flow state' },
        { title: 'How Champions Think', url: 'https://www.goodreads.com/book/show/23019247-how-champions-think', note: 'Dr. Bob Rotella — building confidence' },
        { title: 'The Confident Mind',  url: 'https://www.goodreads.com/book/show/58440439-the-confident-mind',  note: 'Dr. Nate Zinsser — confidence under pressure' },
        { title: 'Atomic Habits',       url: 'https://www.goodreads.com/book/show/40121378-atomic-habits',       note: 'James Clear — tiny changes, remarkable results' },
        { title: 'Think Like a Monk',   url: 'https://www.goodreads.com/book/show/50478194-think-like-a-monk',   note: 'Jay Shetty — ancient wisdom for modern life' },
        { title: 'Feel the Fear and Do It Anyway', url: 'https://www.goodreads.com/book/show/348828.Feel_the_Fear_and_Do_It_Anyway', note: 'Susan Jeffers — acting despite fear' },
        { title: "Can't Hurt Me",       url: 'https://www.goodreads.com/book/show/41721428-can-t-hurt-me',       note: 'David Goggins — mastering your mind' },
        { title: 'Grit',                url: 'https://www.goodreads.com/book/show/27213329-grit',                note: 'Angela Duckworth — passion and perseverance' },
        { title: 'The Obstacle Is the Way', url: 'https://www.goodreads.com/book/show/18668059-the-obstacle-is-the-way', note: 'Ryan Holiday — turning trials into triumphs' },
        { title: 'Ego Is the Enemy',        url: 'https://www.goodreads.com/book/show/27036528-ego-is-the-enemy',        note: 'Ryan Holiday — humility as the path' },
        { title: 'Stillness Is the Key',    url: 'https://www.goodreads.com/book/show/43582733-stillness-is-the-key',    note: 'Ryan Holiday — clarity and focus' },
        { title: 'The Daily Stoic',         url: 'https://www.goodreads.com/book/show/29093292-the-daily-stoic',         note: 'Ryan Holiday & Stephen Hanselman — 366 meditations' },
        { title: '101 Essays That Will Change The Way You Think', url: 'https://www.goodreads.com/book/show/33130555-101-essays-that-will-change-the-way-you-think', note: 'Brianna Wiest — self-awareness, purpose' }
      ]
    },

    /* ─────────────────── BMX TRIBUTES ─────────────────── */
    {
      category: 'BMX Tributes',
      items: [
        { title: '"Why We Race" — Inspyre Factory Team', url: 'https://www.youtube.com/results?search_query=why+we+race+inspyre+bmx', note: 'Behind the scenes of UCI World Cup racing' },
        { title: '"Remembering Pat Casey"',              url: 'https://www.youtube.com/results?search_query=remembering+pat+casey+bmx', note: 'Tribute to the legendary Freestyle rider' },
        { title: '"The Fids — Legend Award" (NORA Cup 2024)', url: 'https://www.youtube.com/watch?v=usiGLEvdfXQ', note: 'Tribute to Mark "The Fids" Findlay' },
        { title: '"Saya Sakakibara: Ride to Redemption"', url: 'https://www.redbull.com/int-en/films/saya-sakakibara-ride-to-redemption', note: 'Red Bull TV documentary' }
      ]
    },

    /* ────────────────────── QUOTES ─────────────────────── */
    {
      category: 'Quotes',
      items: [
        { quote: 'Hard work beats talent when talent doesn\'t work hard.', who: 'Tim Notke' },
        { quote: 'I\'ve failed over and over and over again in my life. And that is why I succeed.', who: 'Michael Jordan' },
        { quote: 'It\'s not the will to win that matters — everyone has that. It\'s the will to prepare to win that matters.', who: 'Bear Bryant' },
        { quote: 'The more difficult the victory, the greater the happiness in winning.', who: 'Pelé' },
        { quote: 'You miss 100% of the shots you don\'t take.', who: 'Wayne Gretzky' },
        { quote: 'Whether you think you can or you think you can\'t, you\'re right.', who: 'Henry Ford' },
        { quote: 'The impediment to action advances action. What stands in the way becomes the way.', who: 'Marcus Aurelius' },
        { quote: 'You have power over your mind — not outside events. Realize this, and you will find strength.', who: 'Marcus Aurelius' },
        { quote: 'We suffer more in imagination than in reality.', who: 'Seneca' },
        { quote: 'Discipline equals freedom.', who: 'Jocko Willink' },
        { quote: 'Everything you\'ve ever wanted is on the other side of fear.', who: 'George Addair' },
        { quote: 'Courage is not the absence of fear, but the triumph over it.', who: 'Nelson Mandela' }
      ]
    }

  ],

  nutritional: {
    disclaimer: 'This page shares general information and links to outside resources. It isn\'t medical or dietary advice. For guidance specific to you, talk to a doctor or a registered dietitian — especially before making major changes to how you eat or drink around training and racing.',
    categories: [

      /* ─────────────────── HYDRATION ─────────────────── */
      {
        category: 'Hydration',
        items: [
          {
            title: 'USOPC Performance Nutrition',
            url: 'https://www.usopc.org/nutrition',
            note: 'Staying hydrated matters. When you lose too much water, your body can\'t perform at its best — both physically and mentally.'
          }
        ]
      },

      /* ──────────────────── FUELING ──────────────────── */
      {
        category: 'Fueling',
        items: [
          {
            title: 'USOPC Performance Nutrition',
            url: 'https://www.usopc.org/nutrition',
            note: 'What you eat before training affects how you feel and perform. Carbs are your body\'s main fuel source for hard efforts.'
          },
          {
            title: 'UCI BMX Nutrition Research',
            url: 'https://journals.humankinetics.com/view/journals/ijsnem/36/3/article-p259.xml',
            note: 'BMX races are short and explosive. The goal is to show up to the gate fueled and feeling good — not full or sluggish.'
          }
        ]
      },

      /* ─────────────────── RECOVERY ──────────────────── */
      {
        category: 'Recovery',
        items: [
          {
            title: 'USOPC Performance Nutrition',
            url: 'https://www.usopc.org/nutrition',
            note: 'Eating protein throughout the day helps your muscles recover. Spreading it across meals works better than getting it all at once.'
          }
        ]
      },

      /* ─────────────── SNACKS & MEALS ────────────────── */
      {
        category: 'Snacks & Meals',
        items: [
          {
            title: "USOPC Athlete's Plate",
            url: 'https://www.usopc.org/nutrition',
            note: 'Your food needs change based on how hard you\'re training. These guides show what a balanced plate looks like on easy, medium, and hard days.'
          },
          {
            title: 'ChooseMyPlate (USDA)',
            url: 'https://www.myplate.gov',
            note: 'Most added sugar comes from drinks like soda, sports drinks, and juice — plus desserts and sweets.'
          }
        ]
      },

      /* ────────────────── FREE APPS ──────────────────── */
      {
        category: 'Free Apps',
        items: [
          {
            title: 'MyFitnessPal',
            url: 'https://www.myfitnesspal.com',
            note: 'Free tier: log food, track macros, see your daily totals.'
          },
          {
            title: 'OpenNutriTracker',
            url: 'https://opennutritracker.com',
            note: 'Free and open source. No ads, no subscriptions, no accounts required.'
          },
          {
            title: 'MyNetDiary',
            url: 'https://www.mynetdiary.com',
            note: 'Free tier includes barcode scanning and basic macro tracking.'
          }
        ]
      },

      /* ────────────────── LEARN MORE ─────────────────── */
      {
        category: 'Learn More',
        items: [
          {
            title: 'USADA Supplement 411',
            url: 'https://www.supplement411.org',
            note: 'Before you take any supplement, do your homework. Knowing what\'s in it — and what\'s not — protects you.'
          },
          {
            title: 'UCI BMX Nutrition Research',
            url: 'https://journals.humankinetics.com/view/journals/ijsnem/36/3/article-p259.xml',
            note: 'BMX has been an Olympic sport since 2008, but there\'s still a lot to learn about the best way to fuel for it. This review gathers what we know so far.'
          }
        ]
      }

    ]
  },

  exercises: {
    disclaimer: 'Safety first in all training. This page links to outside training resources. It isn\'t medical or coaching advice. If you\'re new to strength training, working back from injury, or unsure whether an exercise is right for you, check with a doctor, physio, or qualified coach first.',
    categories: [

      /* ──────────────── GENERAL FITNESS ──────────────── */
      {
        category: 'General Fitness',
        items: [
          {
            title: 'USOPC — Strength & Conditioning',
            url: 'https://www.usopc.org/nutrition',
            note: 'General physical preparation is the base every athlete builds on. Cardio, strength, and mobility work together to keep you healthy and ready to train.'
          },
          {
            title: 'ChooseMyPlate — Physical Activity',
            url: 'https://www.myplate.gov',
            note: 'Regular movement matters at every age. Mix cardio, strength, and flexibility work across the week to support overall health.'
          },
          {
            title: 'Cycling New Zealand — Basic BMX Training',
            url: 'http://www.cyclingnewzealand.nz/assets/CNZ/Homepage/BMX/About-BMX/Guidelines-of-the-Sport/Basic-BMX-Training.pdf',
            note: 'Start with general skills and general fitness. Specialized training too early can cause damage — the base matters before the specifics.'
          }
        ]
      },

      /* ──────────────── GATE STARTS & SPRINTS ──────────────── */
      {
        category: 'Gate Starts & Sprints',
        items: [
          {
            title: 'BMX Training — Unleashed Gate Start Power',
            url: 'https://www.bmxtraining.com/unleashedgatestartpower',
            note: 'The first movement out of the gate is leading with the head and shoulders. Getting into the acceleration position fast is what sets up the rest of your start.'
          },
          {
            title: 'Cycling New Zealand — Basic BMX Training',
            url: 'http://www.cyclingnewzealand.nz/assets/CNZ/Homepage/BMX/About-BMX/Guidelines-of-the-Sport/Basic-BMX-Training.pdf',
            note: 'Power, speed, and strength are the three keys. The gate start is where power matters most — getting from stationary to the bottom of the ramp first.'
          }
        ]
      },

      /* ─────────────────── STRENGTH ──────────────────── */
      {
        category: 'Strength',
        items: [
          {
            title: 'NSCA — Strength Training for the BMX Athlete',
            url: 'https://www.ovid.com/jnls/nsca-scj/pdf/10.1519/ssc.0b013e31822f93b4~strength-training-considerations-for-the-bicycle-motocross',
            note: 'Exercises that match BMX demands: power snatch from the hang position, deadlifts, squats, and bench press with a grip that mirrors your handlebar width.'
          },
          {
            title: 'BMX Training — Sprint Workout for Power',
            url: 'https://www.bmxtraining.com/unleashedgatestartpower',
            note: 'Focus on three areas: technique, acceleration development, and off-the-bike power. Work on the first movement slowly, then build speed.'
          }
        ]
      },

      /* ────────────────── PLYOMETRICS ─────────────────── */
      {
        category: 'Plyometrics',
        items: [
          {
            title: 'ETH Zurich — BMX Start Biomechanics',
            url: 'https://www.research-collection.ethz.ch/bitstream/handle/20.500.11850/238942/312-1752-1-PB.pdf',
            note: 'Squat jumps with added load (around 50% of body weight) match the knee and hip speeds used in a BMX start better than unloaded jumps.'
          },
          {
            title: 'NSCA — Jumping and Bounding for BMX',
            url: 'https://www.ovid.com/jnls/nsca-scj/pdf/10.1519/ssc.0b013e31822f93b4~strength-training-considerations-for-the-bicycle-motocross',
            note: 'Concentric-only hops onto a box and running up stairs with minimal ground contact build the rate of force development you need for starts and rhythm sections.'
          }
        ]
      },

      /* ─────────────── BALANCE & COORDINATION ──────────────── */
      {
        category: 'Balance & Coordination',
        items: [
          {
            title: 'Swiss Cycling — BMX Balance Training',
            url: 'https://www.mobilesport.ch/assets/lbwp-cdn/mobilesport/files/1768901710/mobilesport-bmx--trainingsformen-zu-den-erscheinungsformen-situationsangepasst-und-variantenreich-das-gleichgewicht-halten.pdf',
            note: 'Balance is essential for all BMX disciplines. Kids learn to stay stable on uneven ground and after landings or contact with other riders.'
          },
          {
            title: 'Cycling New Zealand — Manualing Confidence',
            url: 'https://schools.cyclingnewzealand.nz/assets/Uploads/School-Toolkit/5492-Attachment-6_Example_BMX-Session-Plan-2.pdf',
            note: 'Session plan focused on developing manualing confidence and competence, plus negotiating rollers with speed.'
          }
        ]
      },

      /* ─────────────── MOBILITY & WARM-UP ──────────────── */
      {
        category: 'Mobility & Warm-Up',
        items: [
          {
            title: 'Cycling Vlaanderen — BMX Warm-Up Drills',
            url: 'https://cycling.vlaanderen/assets/uploads/downloads/BMX-opwarming.pdf',
            note: 'Cone-course warm-up with different tasks between cones: stepping, walking beside the bike, pumping arms, pushing the front wheel with your foot.'
          },
          {
            title: 'Cycling New Zealand — Basic BMX Training',
            url: 'http://www.cyclingnewzealand.nz/assets/CNZ/Homepage/BMX/About-BMX/Guidelines-of-the-Sport/Basic-BMX-Training.pdf',
            note: 'Young riders should focus on general skills first — balancing, turning, braking, and pedaling. Interval training before the body is ready can cause damage.'
          }
        ]
      },

      /* ─────────────────── RECOVERY ──────────────────── */
      {
        category: 'Recovery',
        items: [
          {
            title: 'Grinder Gym — Injury Prevention & Recovery',
            url: 'https://grindergym.com/bmx-racing-performance-coaches/',
            note: 'Strengthen key muscle groups, improve flexibility, and add mobility work to reduce injury risk and speed up recovery.'
          },
          {
            title: 'Charles University — Movement Compensation for BMX',
            url: 'https://dodo.is.cuni.cz/bitstream/handle/20.500.11956/77337/DPBE_2014_1_11510_0_422454_0_156678.pdf',
            note: 'A three-month movement compensation program improved flexibility and movement patterns in professional BMX riders.'
          }
        ]
      }

    ]
  },

  videos: {
    disclaimer: 'These are free training videos from outside sources. We don\'t own them and they aren\'t a substitute for a qualified coach. Safety first — always wear a helmet and ride within your limits.',
    categories: [

      /* ─────────────── SUPERCRES BMX SKILLS ─────────────── */
      {
        category: 'Supercross BMX Skills',
        items: [
          {
            title: 'Gate Starts, Jumping, Manuals & Racing Technique',
            url: 'https://www.supercrossbmx.com/pages/riding-skills',
            note: 'Official Supercross BMX channel — videos on jumping, manuals, gate starts, sprint technique, and training tips from pro racers.'
          },
          {
            title: 'Flat Pedal BMX Racing Training Plan',
            url: 'https://www.fatbmx.com/bmx-racing/item/61073-the-best-flat-pedal-bmx-racing-training-plan-by-supercrossbmx',
            note: 'Oli from Supercross BMX walks through a flat pedal training program for racers who want to build speed and control.'
          }
        ]
      },

      /* ──────────────── RIDING SKILL BASICS ──────────────── */
      {
        category: 'Riding Skill Basics',
        items: [
          {
            title: 'How to Pump a Ramp',
            url: 'https://rideukbmx.com/tag/how-to',
            note: 'Ride UK BMX — technique breakdowns for pumping, maintaining speed, and using ramps properly.'
          },
          {
            title: 'How to Flyout Tailwhip',
            url: 'https://rideukbmx.com/tag/how-to',
            note: 'Step-by-step guide to the flyout tailwhip from the Ride UK how-to archive.'
          },
          {
            title: 'BMX Wheelie Tutorial: Step-by-Step',
            url: 'https://www.snapchat.com/topic/bmx-bike-techniques',
            note: 'Snapchat topic page with wheelie tutorials — balancing, control, and finding the sweet spot.'
          }
        ]
      },

      /* ─────────────── GATE START & RACE SKILLS ─────────────── */
      {
        category: 'Gate Start & Race Skills',
        items: [
          {
            title: 'Holeshot Like a Pro with Justin Posey',
            url: 'https://int.mongoose.com/blogs/news/holeshot-like-a-pro-with-justin-posey',
            note: 'Mongoose pro Justin Posey breaks down gate start technique with 360BMX — the holeshot is where races are won.'
          },
          {
            title: 'JBMXF Home Work for BMX Racing (12 Chapters)',
            url: 'https://jbmxf.org/news/4028',
            note: 'All Japan BMX Federation video series covering start gate technique, corners, jumping, tactics, and pedaling — with English-subtitled chapters available.'
          }
        ]
      },

      /* ─────────────── PRO TRICK BREAKDOWNS ─────────────── */
      {
        category: 'Pro Trick Breakdowns',
        items: [
          {
            title: 'DD Airbags How-To Tutorials',
            url: 'https://ddairbags.com.au/dd-airbags-how-to-videos-on-youtube/',
            note: 'Olympic medalists Logan Martin and Daniel Dhers plus world champions break down tricks step-by-step — progression-focused tutorials.'
          }
        ]
      }

    ]
  }
};