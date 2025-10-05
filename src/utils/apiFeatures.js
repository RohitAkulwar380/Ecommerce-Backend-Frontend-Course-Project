const buildSearchFilter = (query, searchableFields = ['name', 'title', 'description']) => {
    const search = query.search || query.keywords || '';
    if(!search) return {};
    const regex = new RegExp(search, 'i');
    return{
        $or : searchableFields.map((field)=> ({[field]:regex})),
    };
};

const buildCategoryFilter = (query) => {
  if (!query.category) return {};
  return { category: query.category };
};

const buildSort = (query, defaultSort = '-createdAt') => {
  const sort = query.sort || defaultSort;
  return String(sort).split(',').join(' ');
};

const buildPagination = (query) => {
  const page = Math.max(parseInt(query.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(query.limit || '12', 10), 10_000), 100);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

module.exports = { buildSearchFilter, buildCategoryFilter, buildSort, buildPagination };