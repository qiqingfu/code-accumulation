const ReactiveQuery = {
  _subscribes: [], // 订阅的列表
  _query: null,
  _matchHandlers: [],
  _screens: {}, // 响应式变化更新的值
  _subUid: -1,
  /*
    订阅
  */
  subscribe(query, callback) {
    if (this._subscribes.length < 1) {
      this._query = query;
      this.register();
    }

    const token = (++this._subUid).toString();
    this._subscribes.push({
      token,
      callback,
    });

    callback(this._screens, null);
    return token;
  },
  /**
   * 注册响应式查询
   */
  register() {
    if (this._query) {
      Object.keys(this._query).forEach((key) => {
        const mediaQueryString = this._query[key];
        if (!mediaQueryString) return;

        const mediaQueryListListener = (mql) => {
          this.dispatch(
            {
              ...this._screens,
              [key]: mql.matches,
            },
            key
          );
        };

        const mql = window.matchMedia(mediaQueryString);
        mql.addEventListener(mediaQueryListListener);

        this._matchHandlers[mediaQueryString] = {
          mql,
          key,
          mediaQueryListListener,
        };

        mediaQueryListListener(mql);
      });
    }
  },
  /**
   * 将最新的 screens 通知给 callback 函数
   */
  dispatch(screens, screenDescribed) {
    this._screens = screens;
    if (this._subscribes.length === 0) {
      return false;
    }

    this._subscribes.forEach((subscribe) => {
      subscribe.callback(screens, screenDescribed);
    });
  },

  /*
    取消对应的响应式订阅
  */
  unsubscribe(token) {
    this._subscribes = this._subscribes.filter(
      (subscribe) => subscribe.token !== token
    );
    /**
      在订阅为空时，清除所有事件监听器的绑定
    */
    if (this._subscribes) {
      this.unregister();
    }
  },

  /*
    清空所有的 mql.addListener 事件绑定
  */
  unregister() {
    Object.keys(this._query).forEach((key) => {
      const mediaQueryString = this._query[key];
      if (!mediaQueryString) return;

      const matchHandle = this._matchHandlers[mediaQueryString];
      if (
        matchHandle &&
        matchHandle.mql &&
        matchHandle.mediaQueryListListener
      ) {
        matchHandle.mql.removeEventListener(matchHandle.mediaQueryListListener);
      }
    });
  },
};
