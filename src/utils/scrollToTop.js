export const scrollToTop = (element = null, smooth = true) => {
  const behavior = smooth ? "smooth" : "auto";

  if (element && typeof element.scrollTo === "function") {
    element.scrollTo({
      top: 0,
      behavior,
    });
  } else {
    window.scrollTo({
      top: 0,
      behavior,
    });
  }
};
