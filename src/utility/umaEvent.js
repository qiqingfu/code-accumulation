const camelizeRE = /[-,_](\w)/g;

const cacheStringFunction = (fn) => {
  const cache = Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};

const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ""));
});

const createEvent = (uma, UMA_EVENT_NAME_MAPS) => {
  const context = {};
  Object.keys(UMA_EVENT_NAME_MAPS).forEach((key) => {
    const eventId = UMA_EVENT_NAME_MAPS[key];
    const eventName = camelize(key);
    context[eventName] = (args) => {
      uma.trackEvent && uma.trackEvent(eventId, args);
    };
  });

  return context;
};

export default (app, nameMaps) => {
  const { uma } = app.globalData;
  const umaEventNameMaps = nameMaps || app.globalData.umaEventNameMaps;
  if (uma && umaEventNameMaps) {
    return createEvent(uma, umaEventNameMaps);
  }
};
