/* eslint-disable no-useless-concat */
/* eslint-disable no-nested-ternary */
function getBanner(banner, pkg) {
  if (!banner || typeof banner === 'string') {
    return banner || '';
  }

  banner = { ...pkg, ...(banner === true ? {} : banner) };

  const author = typeof banner.author === 'string' ? banner.author : typeof banner.author === 'object' ? stringifyAuthor(banner.author) : '';

  const license = banner.license || '';

  return `${'/*!\n' + ' * Element-ProCrud 一键CRUD神器\n' + ` * ${banner.name} v${banner.version}\n` + ` * (c) ${author || ''}\n`}${license && ` * Released under the ${license} License.\n`} */`;
}

module.exports = getBanner;
