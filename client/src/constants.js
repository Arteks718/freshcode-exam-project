const env = process.env.NODE_ENV || 'development';
const serverIP = 'localhost';
const serverPort = 5000;
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  CUSTOMER: 'customer',
  CREATOR: 'creator',
  MODERATOR: 'moderator',
  CONTEST_STATUS_ACTIVE: 'active',
  CONTEST_STATUS_FINISHED: 'finished',
  CONTEST_STATUS_PENDING: 'pending',
  NAME_CONTEST: 'name',
  LOGO_CONTEST: 'logo',
  TAGLINE_CONTEST: 'tagline',
  OFFER_STATUS_APPROVED: 'approved',
  OFFER_STATUS_DECLINED: 'declined',
  OFFER_STATUS_REJECTED: 'rejected',
  OFFER_STATUS_WON: 'won',
  OFFER_STATUS_REVIEW: 'review',
  STATIC_IMAGES_PATH: '/staticImages/',
  ANONYM_IMAGE_PATH: '/staticImages/anonym.png',
  BASE_URL: `http://${serverIP}:${serverPort}/`,
  ACCESS_TOKEN: 'accessToken',
  publicURL:
    env === 'production'
      ? `http://${serverIP}:80/images/`
      : `http://${serverIP}:${serverPort}/public/images/`,
  NORMAL_PREVIEW_CHAT_MODE: 'NORMAL_PREVIEW_CHAT_MODE',
  FAVORITE_PREVIEW_CHAT_MODE: 'FAVORITE_PREVIEW_CHAT_MODE',
  BLOCKED_PREVIEW_CHAT_MODE: 'BLOCKED_PREVIEW_CHAT_MODE',
  CATALOG_PREVIEW_CHAT_MODE: 'CATALOG_PREVIEW_CHAT_MODE',
  CHANGE_BLOCK_STATUS: 'CHANGE_BLOCK_STATUS',
  ADD_CHAT_TO_OLD_CATALOG: 'ADD_CHAT_TO_OLD_CATALOG',
  CREATE_NEW_CATALOG_AND_ADD_CHAT: 'CREATE_NEW_CATALOG_AND_ADD_CHAT',
  USER_INFO_MODE: 'USER_INFO_MODE',
  CASHOUT_MODE: 'CASHOUT_MODE',
  AUTH_MODE: {
    REGISTER: 'REGISTER',
    LOGIN: 'LOGIN',
  },
  UPLOAD_IMAGE_TYPES: ['png', 'gif', 'jpg', 'jpeg'],
  HEADER_ANIMATION_TEXT: [
    'a Company',
    'a Brand',
    'a Website',
    'a Service',
    'a Book',
    'a Business',
    'an App',
    'a Product',
    'a Startup',
  ],
  BUTTON_GROUP: [
    {
      answerId: 1,
      answer: 'Yes',
      description: 'But minor variations are allowed',
      recommended: true,
    },
    {
      answerId: 2,
      answer: 'Yes',
      description: 'The Domain should exactly match the name',
    },
    {
      answerId: 3,
      answer: 'No',
      description: 'I am only looking for a name, not a Domain',
    },
  ],
  HEADER_ITEMS: [
    {
      title: 'NAME IDEAS',
      items: [
        {
          title: 'Beauty',
          link: '',
        },
        {
          title: 'Consulting',
          link: '',
        },
        {
          title: 'E-Commerce',
          link: '',
        },
        {
          title: 'Fashion & Clothing',
          link: '',
        },
        {
          title: 'Finance',
          link: '',
        },
        {
          title: 'Real Estate',
          link: '',
        },
        {
          title: 'Tech',
          link: '',
        },
        {
          title: 'More Categories',
          link: '/categories',
        },
      ],
    },
    {
      title: 'CONTESTS',
      items: [
        {
          title: 'How It Works',
          link: '/how-it-works',
        },
        {
          title: 'Pricing',
          link: '/pricing',
        },
        {
          title: 'Agency Service',
          link: '/agency-service',
        },
        {
          title: 'Winners',
          link: '/winners',
        },
        {
          title: 'Leaderboard',
          link: '/leaderboard',
        },
        {
          title: 'Become a Creative',
          link: '/registration?mode=creator',
        },
      ],
    },
    {
      title: 'Our Works',
      items: [
        {
          title: 'NAMES',
          link: '',
        },
        {
          title: 'TAGLINES',
          link: '',
        },
        {
          title: 'LOGOS',
          link: '',
        },
        {
          title: 'TESTIMONIALS',
          link: '',
        },
      ],
    },
    {
      title: 'Names For Sale',
      items: [
        {
          title: 'POPULAR NAMES',
          link: '',
        },
        {
          title: 'SHORT NAMES',
          link: '',
        },
        {
          title: 'INTRIGUING NAMES',
          link: '',
        },
        {
          title: 'NAMES BY CATEGORY',
          link: '',
        },
        {
          title: 'VISUAL NAME SEARCH',
          link: '',
        },
        {
          title: 'SELL YOUR DOMAINS',
          link: '',
        },
      ],
    },

    {
      title: 'Blog',
      items: [
        {
          title: 'ULTIMATE NAMING GUIDE',
          link: '',
        },
        {
          title: 'POETIC DEVICES IN BUSINESS NAMING',
          link: '',
        },
        {
          title: 'CROWDED BAR THEORY',
          link: '',
        },
        {
          title: 'ALL ARTICLES',
          link: '',
        },
      ],
    },
  ],
  FOOTER_ITEMS: [
    {
      title: 'SQUADHELP',
      items: [
        { title: 'About', link: '' },
        { title: 'Contact', link: '' },
        { title: 'How It Works?', link: '' },
        { title: 'Testimonials', link: '' },
        { title: 'Our Work', link: '' },
      ],
    },
    {
      title: 'RESOURCES',
      items: [
        { title: 'How It Works', link: '/how-it-works' },
        { title: 'Become a Creative', link: '' },
        { title: 'Business Name Generator', link: '' },
        { title: 'Discussion Forum', link: '' },
        { title: 'Blog', link: '' },
        { title: 'Download eBook', link: '' },
        { title: 'Pricing', link: '' },
        { title: 'Help & FAQs', link: '' },
      ],
    },
    {
      title: 'OUR SERVICES',
      items: [
        { title: 'Naming', link: '' },
        { title: 'Logo Design', link: '' },
        { title: 'Taglines', link: '' },
        { title: 'Premium Names For Sale', link: '' },
        { title: 'Creative Owned Names For Sale', link: '' },
        { title: 'Audience Testing', link: '' },
        { title: 'Trademark Research & Filling', link: '' },
        { title: 'Managed Agency Service', link: '' },
      ],
    },
    {
      title: 'LEGAL',
      items: [
        { title: 'Terms of Service', link: '' },
        { title: 'Privacy Policy', link: '' },
        { title: 'Cookie Policy', link: '' },
      ],
    },
  ],
  PUBLIC_LOCATIONS: [
    '/',
    '/login',
    '/registration',
    '/how-it-works',
    '/events',
  ],
  LIMIT_GETTING_CONTESTS: 8,
};
