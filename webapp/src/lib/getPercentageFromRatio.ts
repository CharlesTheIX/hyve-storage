export default (numerator: number, denominator: number): number => {
  var percentage: number = numerator;
  percentage /= denominator;
  percentage *= 100;
  return Math.ceil(percentage);
};
