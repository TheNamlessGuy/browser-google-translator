const BackgroundPage = {
  _port: null,

  init: function() {
    BackgroundPage._port = browser.runtime.connect();
  },

  send: function(action, extras = {}) {
    return new Promise((resolve) => {
      const listener = (response) => {
        if (response.response === action) {
          BackgroundPage._port.onMessage.removeListener(listener);
          resolve(response);
        }
      };

      BackgroundPage._port.onMessage.addListener(listener);
      BackgroundPage._port.postMessage({action: action, ...JSON.parse(JSON.stringify(extras))});
    });
  },

  Opts: {
    get: async function() {
      return (await BackgroundPage.send('opts--get')).result;
    },

    set: async function(opts, extras = {}) {
      await BackgroundPage.send('opts--set', {opts, extras});
    },

    saveUsingBookmark: async function() {
      return (await BackgroundPage.send('opts--save-using-bookmark')).result;
    },
  },

  Languages: {
    translate: {
      choices: async function() {
        return (await BackgroundPage.send('languages--translate-choices')).result;
      },
    },

    translatePage: {
      choices: async function() {
        return (await BackgroundPage.send('languages--translate-page-choices')).result;
      },
    },

    tts: {
      choices: async function() {
        return (await BackgroundPage.send('languages--tts-choices')).result;
      },
    },
  },
};

async function load() {
  const opts = await BackgroundPage.Opts.get();

  document.getElementById('save-using-bookmark').value = await BackgroundPage.Opts.saveUsingBookmark();

  const actions = document.getElementById('action-container');

  const translate = document.createElement('action-element');
  translate.id = 'action--translate';
  translate.legend = 'Translate';
  translate.data = opts.actions.translate;
  translate.languages = await BackgroundPage.Languages.translate.choices();
  actions.appendChild(translate);

  const translatePage = document.createElement('action-element');
  translatePage.id = 'action--translate-page';
  translatePage.legend = 'Translate page';
  translatePage.data = opts.actions.translatePage;
  translatePage.languages = await BackgroundPage.Languages.translatePage.choices();
  actions.appendChild(translatePage);

  const tts = document.createElement('action-element');
  tts.id = 'action--tts';
  tts.legend = 'Text to Speech';
  tts.data = opts.actions.tts;
  tts.languages = await BackgroundPage.Languages.tts.choices();
  actions.appendChild(tts);
}

async function save() {
  const opts = await BackgroundPage.Opts.get();
  const extras = {
    saveUsingBookmarkOverride: document.getElementById('save-using-bookmark').value,
  };

  opts.actions.translate = document.getElementById('action--translate').data;
  opts.actions.translatePage = document.getElementById('action--translate-page').data;
  opts.actions.tts = document.getElementById('action--tts').data;

  if (opts.actions.translate.languages.length === 0) {
    console.error('Have to select at least one translation language');
    return;
  } else if (opts.actions.translatePage.languages.length === 0) {
    console.error('Have to select at least one page translation language');
    return;
  } else if (opts.actions.tts.languages.length === 0) {
    console.error('Have to select at least one TTS language');
    return;
  }

  await BackgroundPage.Opts.set(opts, extras);
}

window.addEventListener('DOMContentLoaded', () => {
  BackgroundPage.init();
  load();
  document.getElementById('save-btn').addEventListener('click', save);
});