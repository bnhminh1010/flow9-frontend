import { Package, Utensils, ShoppingBag, Car, FileText, Film, DollarSign, PlusCircle, Wifi, CreditCard, Home, Heart, Book, Gamepad2 } from 'lucide-react';

interface SubscriptionBrand {
  url?: string;
  color: string;
  bgColor: string;
  label: string;
}

const SUBSCRIPTION_BRANDS: Record<string, SubscriptionBrand> = {
  // ============ STREAMING ============
  'netflix': {
    url: 'https://netflix.com',
    color: '#E50914',
    bgColor: 'rgba(229, 9, 20, 0.15)',
    label: 'NF'
  },
  'spotify': {
    url: 'https://spotify.com',
    color: '#1DB954',
    bgColor: 'rgba(29, 185, 84, 0.15)',
    label: 'SP'
  },
  'youtube': {
    url: 'https://youtube.com',
    color: '#FF0000',
    bgColor: 'rgba(255, 0, 0, 0.1)',
    label: 'YT'
  },
  'youtube premium': {
    url: 'https://youtube.com/premium',
    color: '#FF0000',
    bgColor: 'rgba(255, 0, 0, 0.1)',
    label: 'YTP'
  },
  'youtube music': {
    url: 'https://music.youtube.com',
    color: '#FF0000',
    bgColor: 'rgba(255, 0, 0, 0.1)',
    label: 'YTM'
  },
  'disney': {
    url: 'https://disneyplus.com',
    color: '#113CCF',
    bgColor: 'rgba(17, 60, 207, 0.15)',
    label: 'D+'
  },
  'disney+': {
    url: 'https://disneyplus.com',
    color: '#113CCF',
    bgColor: 'rgba(17, 60, 207, 0.15)',
    label: 'D+'
  },
  'hbo': {
    url: 'https://hbomax.com',
    color: '#B535F6',
    bgColor: 'rgba(181, 53, 246, 0.15)',
    label: 'HBO'
  },
  'hbo max': {
    url: 'https://hbomax.com',
    color: '#B535F6',
    bgColor: 'rgba(181, 53, 246, 0.15)',
    label: 'HBO'
  },
  'paramount': {
    url: 'https://paramountplus.com',
    color: '#0064FF',
    bgColor: 'rgba(0, 100, 255, 0.15)',
    label: 'P+'
  },
  'peacock': {
    url: 'https://peacocktv.com',
    color: '#000000',
    bgColor: 'rgba(0, 0, 0, 0.3)',
    label: 'PC'
  },
  'crunchyroll': {
    url: 'https://crunchyroll.com',
    color: '#F47521',
    bgColor: 'rgba(244, 117, 33, 0.15)',
    label: 'CR'
  },
  'viu': {
    url: 'https://viu.com',
    color: '#FF3E84',
    bgColor: 'rgba(255, 62, 132, 0.15)',
    label: 'VIU'
  },
  'wetv': {
    url: 'https://wetv.vip',
    color: '#00D9A3',
    bgColor: 'rgba(0, 217, 163, 0.15)',
    label: 'WE'
  },
  'iqiyi': {
    url: 'https://iq.com',
    color: '#00BE06',
    bgColor: 'rgba(0, 190, 6, 0.15)',
    label: 'IQ'
  },
  'prime video': {
    url: 'https://primevideo.com',
    color: '#00A8E1',
    bgColor: 'rgba(0, 168, 225, 0.15)',
    label: 'PR'
  },
  'apple tv': {
    url: 'https://tv.apple.com',
    color: '#000000',
    bgColor: 'rgba(0, 0, 0, 0.3)',
    label: 'ATV'
  },
  'apple music': {
    url: 'https://music.apple.com',
    color: '#FC3C44',
    bgColor: 'rgba(252, 60, 68, 0.15)',
    label: 'AM'
  },
  'tidal': {
    url: 'https://tidal.com',
    color: '#000000',
    bgColor: 'rgba(0, 0, 0, 0.3)',
    label: 'TD'
  },
  'deezer': {
    url: 'https://deezer.com',
    color: '#FEAA2D',
    bgColor: 'rgba(254, 170, 45, 0.15)',
    label: 'DZ'
  },
  'soundcloud': {
    url: 'https://soundcloud.com',
    color: '#FF5500',
    bgColor: 'rgba(255, 85, 0, 0.15)',
    label: 'SC'
  },

  // ============ GAMING ============
  'xbox': {
    url: 'https://xbox.com',
    color: '#107C10',
    bgColor: 'rgba(16, 124, 16, 0.15)',
    label: 'XB'
  },
  'xbox game pass': {
    url: 'https://xbox.com/game-pass',
    color: '#107C10',
    bgColor: 'rgba(16, 124, 16, 0.15)',
    label: 'XGP'
  },
  'playstation': {
    url: 'https://playstation.com',
    color: '#003791',
    bgColor: 'rgba(0, 55, 145, 0.15)',
    label: 'PS'
  },
  'psn': {
    url: 'https://playstation.com',
    color: '#003791',
    bgColor: 'rgba(0, 55, 145, 0.15)',
    label: 'PSN'
  },
  'ps plus': {
    url: 'https://playstation.com/ps-plus',
    color: '#003791',
    bgColor: 'rgba(0, 55, 145, 0.15)',
    label: 'PS+'
  },
  'nintendo switch': {
    url: 'https://nintendo.com',
    color: '#E60012',
    bgColor: 'rgba(230, 0, 18, 0.15)',
    label: 'NS'
  },
  'nintendo online': {
    url: 'https://nintendo.com/switch/online-service',
    color: '#E60012',
    bgColor: 'rgba(230, 0, 18, 0.15)',
    label: 'NSO'
  },
  'steam': {
    url: 'https://store.steampowered.com',
    color: '#171A21',
    bgColor: 'rgba(23, 26, 33, 0.4)',
    label: 'STM'
  },
  'steam deck': {
    url: 'https://store.steampowered.com/steamdeck',
    color: '#1A9FFF',
    bgColor: 'rgba(26, 159, 255, 0.15)',
    label: 'SD'
  },
  'ea play': {
    url: 'https://ea.com/ea-play',
    color: '#FF4747',
    bgColor: 'rgba(255, 71, 71, 0.15)',
    label: 'EAP'
  },
  'ubisoft': {
    url: 'https://ubisoft.com',
    color: '#0070FF',
    bgColor: 'rgba(0, 112, 255, 0.15)',
    label: 'UBI'
  },
  'ubisoft+': {
    url: 'https://ubisoft.com/ubisoft-plus',
    color: '#0070FF',
    bgColor: 'rgba(0, 112, 255, 0.15)',
    label: 'U+'
  },
  'epic games': {
    url: 'https://epicgames.com',
    color: '#2F2F2F',
    bgColor: 'rgba(47, 47, 47, 0.3)',
    label: 'EPIC'
  },
  'gog': {
    url: 'https://gog.com',
    color: '#86328A',
    bgColor: 'rgba(134, 50, 138, 0.15)',
    label: 'GOG'
  },
  'humble': {
    url: 'https://humblebundle.com',
    color: '#CC2928',
    bgColor: 'rgba(204, 41, 40, 0.15)',
    label: 'HB'
  },

  // ============ CLOUD & STORAGE ============
  'google drive': {
    url: 'https://drive.google.com',
    color: '#4285F4',
    bgColor: 'rgba(66, 133, 244, 0.15)',
    label: 'GD'
  },
  'google one': {
    url: 'https://one.google.com',
    color: '#4285F4',
    bgColor: 'rgba(66, 133, 244, 0.15)',
    label: 'G1'
  },
  'icloud': {
    url: 'https://icloud.com',
    color: '#3693F3',
    bgColor: 'rgba(54, 147, 243, 0.15)',
    label: 'iC'
  },
  'icloud+': {
    url: 'https://icloud.com',
    color: '#3693F3',
    bgColor: 'rgba(54, 147, 243, 0.15)',
    label: 'iC+'
  },
  'onedrive': {
    url: 'https://onedrive.com',
    color: '#094AB2',
    bgColor: 'rgba(9, 74, 178, 0.15)',
    label: 'OD'
  },
  'dropbox': {
    url: 'https://dropbox.com',
    color: '#0061FF',
    bgColor: 'rgba(0, 97, 255, 0.15)',
    label: 'DB'
  },
  'box': {
    url: 'https://box.com',
    color: '#0061D5',
    bgColor: 'rgba(0, 97, 213, 0.15)',
    label: 'BOX'
  },
  'mega': {
    url: 'https://mega.io',
    color: '#D9272E',
    bgColor: 'rgba(217, 39, 46, 0.15)',
    label: 'MG'
  },
  'pcloud': {
    url: 'https://pcloud.com',
    color: '#7B68EE',
    bgColor: 'rgba(123, 104, 238, 0.15)',
    label: 'PC'
  },
  'sync': {
    url: 'https://sync.com',
    color: '#4CAF50',
    bgColor: 'rgba(76, 175, 80, 0.15)',
    label: 'SYN'
  },
  'idrive': {
    url: 'https://idrive.com',
    color: '#2E77BC',
    bgColor: 'rgba(46, 119, 188, 0.15)',
    label: 'ID'
  },

  // ============ SOFTWARE & PRODUCTIVITY ============
  'microsoft': {
    url: 'https://microsoft.com',
    color: '#00A4EF',
    bgColor: 'rgba(0, 164, 239, 0.15)',
    label: 'MS'
  },
  'office': {
    url: 'https://office.com',
    color: '#D83B01',
    bgColor: 'rgba(216, 59, 1, 0.15)',
    label: 'O365'
  },
  'microsoft 365': {
    url: 'https://office.com',
    color: '#D83B01',
    bgColor: 'rgba(216, 59, 1, 0.15)',
    label: 'M365'
  },
  'adobe': {
    url: 'https://adobe.com',
    color: '#FF0000',
    bgColor: 'rgba(255, 0, 0, 0.15)',
    label: 'Ad'
  },
  'adobe creative cloud': {
    url: 'https://adobe.com/creativecloud',
    color: '#FF0000',
    bgColor: 'rgba(255, 0, 0, 0.15)',
    label: 'CC'
  },
  'photoshop': {
    url: 'https://adobe.com/photoshop',
    color: '#31A8FF',
    bgColor: 'rgba(49, 168, 255, 0.15)',
    label: 'PS'
  },
  'premiere': {
    url: 'https://adobe.com/premiere',
    color: '#9999FF',
    bgColor: 'rgba(153, 153, 255, 0.15)',
    label: 'Pr'
  },
  'figma': {
    url: 'https://figma.com',
    color: '#F24E1E',
    bgColor: 'rgba(245, 78, 30, 0.15)',
    label: 'Fi'
  },
  'sketch': {
    url: 'https://sketch.com',
    color: '#F7B500',
    bgColor: 'rgba(247, 181, 0, 0.15)',
    label: 'SK'
  },
  'canva': {
    url: 'https://canva.com',
    color: '#00C4CC',
    bgColor: 'rgba(0, 196, 204, 0.15)',
    label: 'Cv'
  },
  'notion': {
    url: 'https://notion.so',
    color: '#FFFFFF',
    bgColor: 'rgba(255, 255, 255, 0.1)',
    label: 'N'
  },
  'obsidian': {
    url: 'https://obsidian.md',
    color: '#7C3AED',
    bgColor: 'rgba(124, 58, 237, 0.15)',
    label: 'OB'
  },
  'evernote': {
    url: 'https://evernote.com',
    color: '#00A82D',
    bgColor: 'rgba(0, 168, 45, 0.15)',
    label: 'EN'
  },
  'notability': {
    url: 'https://notability.com',
    color: '#000000',
    bgColor: 'rgba(0, 0, 0, 0.3)',
    label: 'NB'
  },
  'goodnotes': {
    url: 'https://goodnotes.com',
    color: '#5C4EE5',
    bgColor: 'rgba(92, 78, 229, 0.15)',
    label: 'GN'
  },
  'slack': {
    url: 'https://slack.com',
    color: '#4A154B',
    bgColor: 'rgba(74, 21, 75, 0.15)',
    label: 'SL'
  },
  'zoom': {
    url: 'https://zoom.us',
    color: '#2D8CFF',
    bgColor: 'rgba(45, 140, 255, 0.15)',
    label: 'ZM'
  },
  'teams': {
    url: 'https://teams.microsoft.com',
    color: '#6264A7',
    bgColor: 'rgba(98, 100, 167, 0.15)',
    label: 'TM'
  },
  'discord': {
    url: 'https://discord.com',
    color: '#5865F2',
    bgColor: 'rgba(88, 101, 242, 0.15)',
    label: 'DC'
  },
  'telegram': {
    url: 'https://telegram.org',
    color: '#26A5E4',
    bgColor: 'rgba(38, 165, 228, 0.15)',
    label: 'TG'
  },
  'asana': {
    url: 'https://asana.com',
    color: '#F06A6A',
    bgColor: 'rgba(240, 106, 106, 0.15)',
    label: 'AS'
  },
  'trello': {
    url: 'https://trello.com',
    color: '#0079BF',
    bgColor: 'rgba(0, 121, 191, 0.15)',
    label: 'TR'
  },
  'monday': {
    url: 'https://monday.com',
    color: '#FF3D57',
    bgColor: 'rgba(255, 61, 87, 0.15)',
    label: 'MON'
  },
  'jira': {
    url: 'https://atlassian.com/software/jira',
    color: '#0052CC',
    bgColor: 'rgba(0, 82, 204, 0.15)',
    label: 'JR'
  },
  'github': {
    url: 'https://github.com',
    color: '#FFFFFF',
    bgColor: 'rgba(255, 255, 255, 0.1)',
    label: 'GH'
  },
  'gitlab': {
    url: 'https://gitlab.com',
    color: '#FC6D26',
    bgColor: 'rgba(252, 109, 38, 0.15)',
    label: 'GL'
  },
  'bitbucket': {
    url: 'https://bitbucket.org',
    color: '#0052CC',
    bgColor: 'rgba(0, 82, 204, 0.15)',
    label: 'BB'
  },
  '1password': {
    url: 'https://1password.com',
    color: '#0094F5',
    bgColor: 'rgba(0, 148, 245, 0.15)',
    label: '1P'
  },
  'lastpass': {
    url: 'https://lastpass.com',
    color: '#D32D27',
    bgColor: 'rgba(211, 45, 39, 0.15)',
    label: 'LP'
  },
  'dashlane': {
    url: 'https://dashlane.com',
    color: '#0E353D',
    bgColor: 'rgba(14, 53, 61, 0.3)',
    label: 'DL'
  },

  // ============ AI & TOOLS ============
  'chatgpt': {
    url: 'https://chat.openai.com',
    color: '#10A37F',
    bgColor: 'rgba(16, 163, 127, 0.15)',
    label: 'AI'
  },
  'openai': {
    url: 'https://openai.com',
    color: '#10A37F',
    bgColor: 'rgba(16, 163, 127, 0.15)',
    label: 'AI'
  },
  'claude': {
    url: 'https://claude.ai',
    color: '#CC785C',
    bgColor: 'rgba(204, 120, 92, 0.15)',
    label: 'CL'
  },
  'gemini': {
    url: 'https://gemini.google.com',
    color: '#4285F4',
    bgColor: 'rgba(66, 133, 244, 0.15)',
    label: 'GM'
  },
  'copilot': {
    url: 'https://copilot.microsoft.com',
    color: '#00A4EF',
    bgColor: 'rgba(0, 164, 239, 0.15)',
    label: 'CP'
  },
  'midjourney': {
    url: 'https://midjourney.com',
    color: '#5865F2',
    bgColor: 'rgba(88, 101, 242, 0.15)',
    label: 'MJ'
  },
  'dall-e': {
    url: 'https://openai.com/dall-e-3',
    color: '#10A37F',
    bgColor: 'rgba(16, 163, 127, 0.15)',
    label: 'DL'
  },
  'stable diffusion': {
    url: 'https://stability.ai',
    color: '#18A974',
    bgColor: 'rgba(24, 169, 116, 0.15)',
    label: 'SD'
  },
  'runway': {
    url: 'https://runwayml.com',
    color: '#00FFD1',
    bgColor: 'rgba(0, 255, 209, 0.15)',
    label: 'RW'
  },
  'leonardo': {
    url: 'https://leonardo.ai',
    color: '#9333EA',
    bgColor: 'rgba(147, 51, 234, 0.15)',
    label: 'LNAI'
  },

  // ============ EDUCATION ============
  'udemy': {
    url: 'https://udemy.com',
    color: '#A435F0',
    bgColor: 'rgba(164, 53, 240, 0.15)',
    label: 'UD'
  },
  'coursera': {
    url: 'https://coursera.org',
    color: '#0056D2',
    bgColor: 'rgba(0, 86, 210, 0.15)',
    label: 'CO'
  },
  'skillshare': {
    url: 'https://skillshare.com',
    color: '#00FF84',
    bgColor: 'rgba(0, 255, 132, 0.15)',
    label: 'SS'
  },
  'masterclass': {
    url: 'https://masterclass.com',
    color: '#000000',
    bgColor: 'rgba(0, 0, 0, 0.3)',
    label: 'MC'
  },
  'duolingo': {
    url: 'https://duolingo.com',
    color: '#58CC02',
    bgColor: 'rgba(88, 204, 2, 0.15)',
    label: 'DL'
  },
  'babbel': {
    url: 'https://babbel.com',
    color: '#FF7977',
    bgColor: 'rgba(255, 121, 119, 0.15)',
    label: 'BB'
  },
  'linkedin learning': {
    url: 'https://linkedin.com/learning',
    color: '#0A66C2',
    bgColor: 'rgba(10, 102, 194, 0.15)',
    label: 'LIL'
  },
  'pluralsight': {
    url: 'https://pluralsight.com',
    color: '#F05A28',
    bgColor: 'rgba(240, 90, 40, 0.15)',
    label: 'PS'
  },
  'treehouse': {
    url: 'https://teamtreehouse.com',
    color: '#5F8D32',
    bgColor: 'rgba(95, 141, 50, 0.15)',
    label: 'TH'
  },
  'khan academy': {
    url: 'https://khanacademy.org',
    color: '#14BF96',
    bgColor: 'rgba(20, 191, 150, 0.15)',
    label: 'KA'
  },

  // ============ CLOUD HOSTING ============
  'aws': {
    url: 'https://aws.amazon.com',
    color: '#FF9900',
    bgColor: 'rgba(255, 153, 0, 0.15)',
    label: 'AWS'
  },
  'vultr': {
    url: 'https://vultr.com',
    color: '#007BFC',
    bgColor: 'rgba(0, 123, 252, 0.15)',
    label: 'Vl'
  },
  'digitalocean': {
    url: 'https://digitalocean.com',
    color: '#0080FF',
    bgColor: 'rgba(0, 128, 255, 0.15)',
    label: 'DO'
  },
  'linode': {
    url: 'https://linode.com',
    color: '#00A95F',
    bgColor: 'rgba(0, 169, 95, 0.15)',
    label: 'LN'
  },
  'heroku': {
    url: 'https://heroku.com',
    color: '#430098',
    bgColor: 'rgba(67, 0, 152, 0.15)',
    label: 'HK'
  },
  'netlify': {
    url: 'https://netlify.com',
    color: '#00C7B7',
    bgColor: 'rgba(0, 199, 183, 0.15)',
    label: 'NL'
  },
  'vercel': {
    url: 'https://vercel.com',
    color: '#000000',
    bgColor: 'rgba(0, 0, 0, 0.3)',
    label: 'VC'
  },
  'render': {
    url: 'https://render.com',
    color: '#46E3B7',
    bgColor: 'rgba(70, 227, 183, 0.15)',
    label: 'RD'
  },
  'supabase': {
    url: 'https://supabase.com',
    color: '#3ECF8E',
    bgColor: 'rgba(62, 207, 142, 0.15)',
    label: 'SB'
  },
  'firebase': {
    url: 'https://firebase.google.com',
    color: '#FFCA28',
    bgColor: 'rgba(255, 202, 40, 0.15)',
    label: 'FB'
  },
  'planetscale': {
    url: 'https://planetscale.com',
    color: '#000000',
    bgColor: 'rgba(0, 0, 0, 0.3)',
    label: 'PS'
  },
  'mongodb': {
    url: 'https://mongodb.com',
    color: '#47A248',
    bgColor: 'rgba(71, 162, 72, 0.15)',
    label: 'MG'
  },

  // ============ UTILITIES ============
  'nordvpn': {
    url: 'https://nordvpn.com',
    color: '#4687FF',
    bgColor: 'rgba(70, 135, 255, 0.15)',
    label: 'NV'
  },
  'expressvpn': {
    url: 'https://expressvpn.com',
    color: '#DA3940',
    bgColor: 'rgba(218, 57, 64, 0.15)',
    label: 'EV'
  },
  'surfshark': {
    url: 'https://surfshark.com',
    color: '#1E90FF',
    bgColor: 'rgba(30, 144, 255, 0.15)',
    label: 'SS'
  },
  'mullvad': {
    url: 'https://mullvad.net',
    color: '#FF4136',
    bgColor: 'rgba(255, 65, 54, 0.15)',
    label: 'MV'
  },
  'protonvpn': {
    url: 'https://protonvpn.com',
    color: '#6D4AFF',
    bgColor: 'rgba(109, 74, 255, 0.15)',
    label: 'PV'
  },

  // ============ SHOPPING & LIFESTYLE ============
  'amazon': {
    url: 'https://amazon.com',
    color: '#FF9900',
    bgColor: 'rgba(255, 153, 0, 0.15)',
    label: 'AMZ'
  },
  'prime': {
    url: 'https://amazon.com/prime',
    color: '#00A8E1',
    bgColor: 'rgba(0, 168, 225, 0.15)',
    label: 'PR'
  },
  'shopify': {
    url: 'https://shopify.com',
    color: '#96BF48',
    bgColor: 'rgba(150, 191, 72, 0.15)',
    label: 'SH'
  },
  'ebay': {
    url: 'https://ebay.com',
    color: '#E53238',
    bgColor: 'rgba(229, 50, 56, 0.15)',
    label: 'EB'
  },
  'etsy': {
    url: 'https://etsy.com',
    color: '#F56400',
    bgColor: 'rgba(245, 100, 0, 0.15)',
    label: 'ET'
  },
  'alibaba': {
    url: 'https://alibaba.com',
    color: '#FF6A00',
    bgColor: 'rgba(255, 106, 0, 0.15)',
    label: 'ALI'
  },
  'lazada': {
    url: 'https://lazada.com',
    color: '#0F1472',
    bgColor: 'rgba(15, 20, 114, 0.3)',
    label: 'LZ'
  },
  'shopee': {
    url: 'https://shopee.vn',
    color: '#EE4D2D',
    bgColor: 'rgba(238, 77, 45, 0.15)',
    label: 'SHPE'
  },
  'tiki': {
    url: 'https://tiki.vn',
    color: '#1897D9',
    bgColor: 'rgba(24, 151, 217, 0.15)',
    label: 'TK'
  },

  // ============ HEALTH & FITNESS ============
  'peloton': {
    url: 'https://peloton.com',
    color: '#D80027',
    bgColor: 'rgba(216, 0, 39, 0.15)',
    label: 'PT'
  },
  ' Strava': {
    url: 'https://strava.com',
    color: '#FC4C02',
    bgColor: 'rgba(252, 76, 2, 0.15)',
    label: 'ST'
  },
  'fitbit': {
    url: 'https://fitbit.com',
    color: '#00B0B9',
    bgColor: 'rgba(0, 176, 185, 0.15)',
    label: 'FB'
  },
  'whoop': {
    url: 'https://whoop.com',
    color: '#E60012',
    bgColor: 'rgba(230, 0, 18, 0.15)',
    label: 'WH'
  },
  'myfitnesspal': {
    url: 'https://myfitnesspal.com',
    color: '#0066EE',
    bgColor: 'rgba(0, 102, 238, 0.15)',
    label: 'MFP'
  },
  'noom': {
    url: 'https://noom.com',
    color: '#FFC225',
    bgColor: 'rgba(255, 194, 37, 0.15)',
    label: 'NM'
  },
  'headspace': {
    url: 'https://headspace.com',
    color: '#F47D38',
    bgColor: 'rgba(244, 125, 56, 0.15)',
    label: 'HS'
  },
  'calm': {
    url: 'https://calm.com',
    color: '#6B9ACA',
    bgColor: 'rgba(107, 154, 202, 0.15)',
    label: 'CM'
  },

  // ============ NEWS & READING ============
  'medium': {
    url: 'https://medium.com',
    color: '#FFFFFF',
    bgColor: 'rgba(255, 255, 255, 0.1)',
    label: 'MD'
  },
  'new york times': {
    url: 'https://nytimes.com',
    color: '#000000',
    bgColor: 'rgba(0, 0, 0, 0.3)',
    label: 'NYT'
  },
  'wall street journal': {
    url: 'https://wsj.com',
    color: '#000000',
    bgColor: 'rgba(0, 0, 0, 0.3)',
    label: 'WSJ'
  },
  'the economist': {
    url: 'https://economist.com',
    color: '#E3120B',
    bgColor: 'rgba(227, 18, 11, 0.15)',
    label: 'ECO'
  },
  'kindle': {
    url: 'https://amazon.com/kindle',
    color: '#FF9900',
    bgColor: 'rgba(255, 153, 0, 0.15)',
    label: 'KD'
  },
  'kindle unlimited': {
    url: 'https://amazon.com/kindle-unlimited',
    color: '#FF9900',
    bgColor: 'rgba(255, 153, 0, 0.15)',
    label: 'KU'
  },
  'audible': {
    url: 'https://audible.com',
    color: '#F8991C',
    bgColor: 'rgba(248, 153, 28, 0.15)',
    label: 'AU'
  },
  'scribd': {
    url: 'https://scribd.com',
    color: '#1A7BBA',
    bgColor: 'rgba(26, 123, 186, 0.15)',
    label: 'SC'
  },

  // ============ FINANCE ============
  'coinbase': {
    url: 'https://coinbase.com',
    color: '#0052FF',
    bgColor: 'rgba(0, 82, 255, 0.15)',
    label: 'CB'
  },
  'binance': {
    url: 'https://binance.com',
    color: '#F0B90B',
    bgColor: 'rgba(240, 185, 11, 0.15)',
    label: 'BN'
  },
  'robinhood': {
    url: 'https://robinhood.com',
    color: '#00C805',
    bgColor: 'rgba(0, 200, 5, 0.15)',
    label: 'RH'
  },
  'paypal': {
    url: 'https://paypal.com',
    color: '#003087',
    bgColor: 'rgba(0, 48, 135, 0.15)',
    label: 'PP'
  },
  'venmo': {
    url: 'https://venmo.com',
    color: '#3D95CE',
    bgColor: 'rgba(61, 149, 206, 0.15)',
    label: 'VM'
  },
  'cash app': {
    url: 'https://cash.app',
    color: '#00D632',
    bgColor: 'rgba(0, 214, 50, 0.15)',
    label: 'CA'
  },

  // ============ FOOD & DELIVERY ============
  'grab': {
    url: 'https://grab.com',
    color: '#00B14F',
    bgColor: 'rgba(0, 177, 79, 0.15)',
    label: 'GR'
  },
  'gojek': {
    url: 'https://gojek.com',
    color: '#00Aed5',
    bgColor: 'rgba(0, 174, 213, 0.15)',
    label: 'GJ'
  },
  'baemin': {
    url: 'https://baemin.vn',
    color: '#D9AD00',
    bgColor: 'rgba(217, 173, 0, 0.15)',
    label: 'BM'
  },
  'shopee food': {
    url: 'https://shopee.vn',
    color: '#EE4D2D',
    bgColor: 'rgba(238, 77, 45, 0.15)',
    label: 'SF'
  },
  'grabfood': {
    url: 'https://grab.com',
    color: '#00B14F',
    bgColor: 'rgba(0, 177, 79, 0.15)',
    label: 'GF'
  },
  'doordash': {
    url: 'https://doordash.com',
    color: '#FF3008',
    bgColor: 'rgba(255, 48, 8, 0.15)',
    label: 'DD'
  },
  'uber eats': {
    url: 'https://ubereats.com',
    color: '#06C167',
    bgColor: 'rgba(6, 193, 103, 0.15)',
    label: 'UE'
  },

  // ============ DEFAULT CATEGORIES ============
  'streaming': {
    url: undefined,
    color: '#EF4444',
    bgColor: 'rgba(239, 68, 68, 0.15)',
    label: 'STR'
  },
  'software': {
    url: undefined,
    color: '#3B82F6',
    bgColor: 'rgba(59, 130, 246, 0.15)',
    label: 'SW'
  },
  'gaming': {
    url: undefined,
    color: '#8B5CF6',
    bgColor: 'rgba(139, 92, 246, 0.15)',
    label: 'GM'
  },
  'cloud': {
    url: undefined,
    color: '#3B82F6',
    bgColor: 'rgba(59, 130, 246, 0.15)',
    label: 'CL'
  },
  'fitness': {
    url: undefined,
    color: '#22C55E',
    bgColor: 'rgba(34, 197, 94, 0.15)',
    label: 'FT'
  },
  'education': {
    url: undefined,
    color: '#3B82F6',
    bgColor: 'rgba(59, 130, 246, 0.15)',
    label: 'ED'
  },
  'news': {
    url: undefined,
    color: '#6366F1',
    bgColor: 'rgba(99, 102, 241, 0.15)',
    label: 'NW'
  },
  'food': {
    url: undefined,
    color: '#F97316',
    bgColor: 'rgba(249, 115, 22, 0.15)',
    label: 'FD'
  },
  'vpn': {
    url: undefined,
    color: '#06B6D4',
    bgColor: 'rgba(6, 182, 212, 0.15)',
    label: 'VPN'
  },
  'hosting': {
    url: undefined,
    color: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.15)',
    label: 'HS'
  },
  'domain': {
    url: undefined,
    color: '#6366F1',
    bgColor: 'rgba(99, 102, 241, 0.15)',
    label: 'DM'
  },
  'storage': {
    url: undefined,
    color: '#8B5CF6',
    bgColor: 'rgba(139, 92, 246, 0.15)',
    label: 'ST'
  },
  'other': {
    url: undefined,
    color: '#71717A',
    bgColor: 'rgba(113, 113, 122, 0.15)',
    label: '?'
  },
};

export function getSubscriptionBrand(name: string): SubscriptionBrand | null {
  const nameLower = name.toLowerCase().trim();
  
  if (SUBSCRIPTION_BRANDS[nameLower]) {
    return SUBSCRIPTION_BRANDS[nameLower];
  }
  
  for (const key of Object.keys(SUBSCRIPTION_BRANDS)) {
    if (nameLower.includes(key) || key.includes(nameLower)) {
      return SUBSCRIPTION_BRANDS[key];
    }
  }
  
  return null;
}

export function getSubscriptionUrl(name: string): string | undefined {
  return getSubscriptionBrand(name)?.url;
}

export function SubscriptionBrandLogo({ name, className = "w-5 h-5" }: { name: string; className?: string }) {
  const brand = getSubscriptionBrand(name);
  if (brand) {
    return (
      <div 
        className={`flex items-center justify-center font-black text-[8px] leading-none border border-current rounded-[2px] ${className}`}
        style={{ 
          color: brand.color,
          backgroundColor: brand.bgColor,
          borderColor: brand.color + '50'
        }}
      >
        {brand.label}
      </div>
    );
  }
  return <Package className={className} strokeWidth={1.5} />;
}

export function CategoryIcon({ categoryName, className = "w-5 h-5" }: { categoryName: string; className?: string }) {
  const ICONS: Record<string, any> = {
    'Ăn uống': Utensils,
    'Food': Utensils,
    'Mua sắm': ShoppingBag,
    'Shopping': ShoppingBag,
    'Đi lại': Car,
    'Transport': Car,
    'Hoá đơn': FileText,
    'Bills': FileText,
    'Giải trí': Film,
    'Entertainment': Film,
    'Lương': DollarSign,
    'Salary': DollarSign,
    'Thưởng': PlusCircle,
    'Bonus': PlusCircle,
    'Wifi': Wifi,
    'Internet': Wifi,
    'Thuê bao': CreditCard,
    'Subscription': Package,
    'Nhà': Home,
    'Home': Home,
    'Sức khỏe': Heart,
    'Health': Heart,
    'Học': Book,
    'Learning': Book,
    'Game': Gamepad2,
  };

  const brand = getSubscriptionBrand(categoryName);
  if (brand) {
    return (
      <div 
        className={`flex items-center justify-center font-black text-[8px] leading-none border border-current rounded-[2px] ${className}`}
        style={{ 
          color: brand.color,
          backgroundColor: brand.bgColor,
          borderColor: brand.color + '30'
        }}
      >
        {brand.label}
      </div>
    );
  }

  const Icon = ICONS[categoryName] || Package;
  return <Icon className={className} strokeWidth={1.5} />;
}
