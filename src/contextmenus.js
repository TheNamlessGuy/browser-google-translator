const ContextMenus = {
  _ids: {
    root: 'google-translator-root',

    translate: {
      singleLanguage: 'google-translator-translate-singlelanguage',
      multiLanguage: 'google-translator-translate',
      languagePrefix: 'google-translator-translate--',
      language: (lang) => `${ContextMenus._ids.translate.languagePrefix}${lang}`,
    },

    translatePage: {
      singleLanguage: 'google-translator-translate-page-singlelanguage',
      multiLanguage: 'google-translator-translate-page',
      languagePrefix: 'google-translator-translate-page--',
      language: (lang) => `${ContextMenus._ids.translatePage.languagePrefix}${lang}`,
    },

    tts: {
      singleLanguage: 'google-translator-tts-singlelanguage',
      multiLanguage: 'google-translator-ts',
      languagePrefix: 'google-translator-tts--',
      language: (lang) => `${ContextMenus._ids.tts.languagePrefix}${lang}`,
    },
  },

  init: async function() {
    browser.menus.removeAll();
    if (!browser.menus.onClicked.hasListener(ContextMenus._onClicked)) {
      browser.menus.onClicked.addListener(ContextMenus._onClicked);
    }

    const opts = await Opts.get();

    // If any given context has more than one option available, we should show the root element
    const shouldHaveRootElement = [
      [opts.actions.translatePage.active].filter(x => x).length, // 'page'
      [opts.actions.translate.active, opts.actions.tts.active].filter(x => x).length, // 'selection'
    ].some(x => x > 1);

    let parentID = null;
    if (shouldHaveRootElement) {
      parentID = ContextMenus._ids.root;

      browser.menus.create({
        id: ContextMenus._ids.root,
        title: 'To Google Translate',
        contexts: [/*'page', */'selection'], // Re-enable page if we get more actions for that context
        icons: {
          16: '/res/icons/plugin/16.png',
          32: '/res/icons/plugin/32.png',
        }
      });
    }

    if (opts.actions.translate.active    ) { ContextMenus._action(opts.actions.translate.languages,     parentID, ContextMenus._ids.translate    , ['selection'], 'Translate into',      Languages.translate); }
    if (opts.actions.translatePage.active) { ContextMenus._action(opts.actions.translatePage.languages, null,     ContextMenus._ids.translatePage, ['page'],      'Translate page into', Languages.translatePage); }
    if (opts.actions.tts.active          ) { ContextMenus._action(opts.actions.tts.languages,           parentID, ContextMenus._ids.tts,           ['selection'], 'Listen in',           Languages.tts); }
  },

  _action: function(languages, parentID, ids, contexts, titlePrefix, languageEntry) {
    const singleLanguage = languages.length === 1;

    browser.menus.create({
      id: singleLanguage ? ids.singleLanguage : ids.multiLanguage,
      parentId: parentID,
      title: singleLanguage ? `${titlePrefix} '${languageEntry.display(languages[0])}'` : `${titlePrefix}...`,
      contexts: contexts,
      icons: parentID != null ? null : {
        16: '/res/icons/plugin/16.png',
        32: '/res/icons/plugin/32.png',
      },
    });

    if (!singleLanguage) {
      for (const language of languages) {
        browser.menus.create({
          id: ids.language(language),
          parentId: ids.multiLanguage,
          title: languageEntry.display(language),
        });
      }
    }
  },

  _onClicked: async function(info, tab) {
    const opts = await Opts.get();

    if (ContextMenus._onActionClicked(info, tab, ContextMenus._translate,     ContextMenus._ids.translate,     opts.actions.translate.languages    )) { return; }
    if (ContextMenus._onActionClicked(info, tab, ContextMenus._translatePage, ContextMenus._ids.translatePage, opts.actions.translatePage.languages)) { return; }
    if (ContextMenus._onActionClicked(info, tab, ContextMenus._tts,           ContextMenus._ids.tts,           opts.actions.tts.languages          )) { return; }
  },

  _onActionClicked: function(info, tab, cb, ids, languages) {
    if (info.menuItemId === ids.singleLanguage) {
      cb(languages[0], info, tab);
      return true;
    } else if (info.menuItemId.startsWith(ids.languagePrefix)) {
      cb(info.menuItemId.substring(ids.languagePrefix.length), info, tab);
      return true;
    }

    return false;
  },

  _translate:     function(language, info, tab) { ContextMenus._openTab(tab, `https://translate.google.${Languages.translate.tld(language)}/?sl=auto&tl=${language}&text=${encodeURIComponent(info.selectionText)}`); },
  _translatePage: function(language, info, tab) { if (tab.url != null) { ContextMenus._openTab(tab, `https://translate.google.${Languages.translatePage.tld(language)}/translate?sl=auto&tl=${language}&u=${tab.url}`); } },
  _tts:           function(language, info, tab) { ContextMenus._openTab(tab, `https://translate.google.${Languages.tts.tld(language)}/translate_tts?ie=UTF-8&client=tw-ob&tl=${language}&q=${encodeURIComponent(info.selectionText)}`); },

  _openTab: async function(from, url) {
    await browser.tabs.create({
      active: true,
      openerTabId: from.id,
      windowId: from.windowId,
      url: url,
    });
  },
};