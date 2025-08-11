// exporting clients images from public folder

export const clients = [...new Array(10)].map((client, index) => ({
  href: `/${index + 1}.png`,
}));
