const cds = require('@sap/cds');

async function similaritySearchWithFilter({
  table,
  embeddingCol,
  textCol,
  vector,
  filters = {},
  topK
}) {
  const vectorStr = `'[${vector.join(',')}]'`;

  const whereClause = Object.entries(filters)
    .map(([key, val]) => `"${key}" = '${val}'`)
    .join(' AND ');

    const dynWhere = whereClause ? ` WHERE ${whereClause}` : '';

  const sql = `
    SELECT TOP ${topK} ${textCol}, SUPPLIERMETADATA, COSINE_SIMILARITY(${embeddingCol}, TO_REAL_VECTOR(${vectorStr})) AS score
    FROM ${table}
    ${dynWhere}
    ORDER BY score DESC
  `;

  return await cds.run(sql);
}

module.exports = { similaritySearchWithFilter };