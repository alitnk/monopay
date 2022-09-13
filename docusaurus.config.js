// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Monopay',
  tagline: 'A node.js package for making payment transactions with different Iranian IPGs',
  url: 'https://alitnk.github.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'alitnk', // Usually your GitHub org/user name.
  projectName: 'monopay', // Usually your repo name.

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fa'],
  },

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/alitnk/monopay/edit/documentation/',
        },
        // blog: {
        //   showReadingTime: true,
        //   editUrl:
        //     'https://github.com/alitnk/monopay/edit/documentation/blog/',
        // },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/thumbnail.jpeg',
      // Commenting since it's not translatable
      // announcementBar: {
      //   id: 'github_start_announcement',
      //   content:
      //     'If you like monopay, please <a target="_blank" rel="noopener noreferrer" href="https://github.com/alitnk/monopay">give it a star on GitHub.</a>',
      //   backgroundColor: '#fafbfc',
      //   textColor: '#091E42',
      //   isCloseable: false,
      // },
      navbar: {
        title: 'Monopay',
        logo: {
          alt: 'Monopay Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'introduction',
            position: 'left',
            label: 'Documentation',
          },
          {
            href: 'https://github.com/alitnk/monopay/issues/new',
            label: 'Submit An Issue',
            position: 'left',
          },
          {
            href: 'https://github.com/alitnk/monopay',
            label: 'GitHub',
            position: 'right',
          },
          // { to: '/blog', label: 'Blog', position: 'left' },
          {
            type: 'localeDropdown',
            position: 'right',
          },
        ],
      },
      // footer: {
      //   // style: 'dark',
      //   // links: [
      //   //   {
      //   //     items: [
      //   //       {
      //   //         label: 'Tutorial',
      //   //         to: '/docs/intro',
      //   //       },
      //   //       {
      //   //         label: 'Blog',
      //   //         to: '/blog',
      //   //       },
      //   //       {
      //   //         label: 'GitHub',
      //   //         href: 'https://github.com/alitnk/monopay',
      //   //       },
      //   //     ],
      //   //   },
      //   // ],
      //   copyright: `Copyright © ${new Date().getFullYear()} Monopay`,
      // },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
