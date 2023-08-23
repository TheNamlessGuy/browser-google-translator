const Opts = {
  _default: {
    actions: {
      translate: {
        active: true,
        languages: ['en'],
      },

      translatePage: {
        active: true,
        languages: ['en'],
      },

      tts: {
        active: true,
        languages: ['en-US'],
      },
    },
  },

  init: async function() {
    let {opts, changed} = await BookmarkOpts.init(Opts._default);

    if (changed) {
      await Opts.set(opts);
    }
  },

  get: async function() {
    const opts = await BookmarkOpts.get();
    if (opts != null && Object.keys(opts).length > 0) {
      return opts;
    }

    await Opts.init();
    return await Opts.get();
  },

  set: async function(opts, extras = {}) {
    await BookmarkOpts.set(opts, extras);
    await ContextMenus.init();
  },
}