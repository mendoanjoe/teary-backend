function pagination(Module = {}) {
  const { attachment, models } = Module;
  const { logger } = attachment;

  const ret = async (ctx, attributes = {}) => {
    const { model, customQuery = {}, customParams = {} } = attributes;
    let { currentPage, maxEntry } = attributes;

    const paginate = ({ pages, pageSize }) => {
      const offset = pages * pageSize;
      const limit = pageSize;

      return { offset, limit };
    };

    // eslint-disable-next-line no-restricted-globals
    if (typeof currentPage !== 'number' || isNaN(currentPage)) {
      try {
        // eslint-disable-next-line no-restricted-globals
        if (isNaN(currentPage)) {
          throw new Error('currentPage must not be NaN');
        }

        currentPage = Math.max(1, parseInt(currentPage, 10));
      } catch (err) {
        logger.warn(err.message);

        currentPage = 1;
      }
    }

    // eslint-disable-next-line no-restricted-globals
    if (typeof maxEntry !== 'number' || isNaN(maxEntry)) {
      try {
        // eslint-disable-next-line no-restricted-globals
        if (isNaN(maxEntry)) {
          throw new Error('maxEntry must not be NaN');
        }

        maxEntry = Math.max(1, parseInt(maxEntry, 10));
      } catch (err) {
        logger.warn(err);

        maxEntry = process.env.PAGINATION_MAX_RESULT || 5;
      }
    }

    let count = 0;
    let data = [];

    if (typeof model === 'string') {
      count = await models[model].count(customQuery);
      data = await models[model].findAll({
        ...customQuery,
        ...paginate({ pages: currentPage - 1, pageSize: maxEntry }),

        raw: true,
      });
    } else if (typeof model === 'object') {
      count = await model.count(customQuery);
      data = await model.findAll({
        ...customQuery,
        ...paginate({ pages: currentPage - 1, pageSize: maxEntry }),

        raw: true,
      });
    }

    const resp = {
      count,

      current_page: currentPage,
      max_entry: maxEntry,
      last_page: 0,

      first_page_url: '',
      last_page_url: '',
      prev_page_url: '',
      next_page_url: '',

      data,
    };

    const { URL } = ctx;
    const lastPage = Math.max(1, Math.ceil(count / maxEntry));
    const pageUrl = URL.origin + URL.pathname;

    resp.first_page_url = `${pageUrl}?current_page=1&max_entry=${maxEntry}`;
    resp.last_page_url = `${pageUrl}?current_page=${lastPage}&max_entry=${maxEntry}`;

    if (currentPage * maxEntry < count) {
      resp.last_page = count - (lastPage - 1) * maxEntry;
      resp.next_page_url = `${pageUrl}?current_page=${currentPage + 1}&max_entry=${maxEntry}`;
    } else {
      delete resp.next_page_url;
    }

    if (currentPage * maxEntry > maxEntry) {
      resp.prev_page_url = `${pageUrl}?current_page=${currentPage - 1}&max_entry=${maxEntry}`;
    } else {
      delete resp.prev_page_url;
    }

    Object.keys(customParams).forEach(key => {
      const param = `&${key}=${customParams[key]}`;

      resp.first_page_url += param;
      resp.last_page_url += param;

      if (resp.next_page_url) {
        resp.next_page_url += param;
      }

      if (resp.prev_page_url) {
        resp.prev_page_url += param;
      }
    });

    return resp;
  };

  return ret;
}

function attach(attachment = {}) {
  const { models } = attachment.db.postgres;
  const Module = { attachment, models };

  return pagination(Module);
}

module.exports = {
  attach,
};
