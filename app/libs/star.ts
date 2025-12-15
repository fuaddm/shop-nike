export function starFillPercentage(totalStars: number, index: number): number {
  if (totalStars > index) {
    return 100;
  } else if (totalStars < index) {
    if (index - totalStars < 1) {
      return 100 - Math.floor((index - totalStars) * 100);
    }
    return 0;
  }
  return 100;
}
