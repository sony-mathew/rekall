/*
  https://mycolor.space/gradient3?ori=to+right+top&hex=%23D16B6B&hex2=%23E7C586&hex3=%235FFB87&submit=submit
  https://colordesigner.io/gradient-generator

  # 15 Colors
  bases -> #e53935, #45bf55
  ['#e53935','#e24827','#dd5618','#d76301','#cf6f00','#c67900','#bd8400','#b28d00','#a79600','#9b9e00','#8ea500','#7fac18','#6fb32e','#5db942','#45bf55']
*/

const COLORS = {
  2: ['#e53935', '#45bf55'],
  4: ['#e53935', '#c67900', '#9b9e00', '#45bf55'],
  10: ['#e53935','#dd5618','#d76301','#c67900','#bd8400','#b28d00','#9b9e00','#7fac18','#6fb32e','#45bf55', '#45bf55'],
}

const colorForScaleValue = (scaleSize = 2, scaleValue = 0) => {
  let roundedScaleValue = Math.round(scaleValue);
  let defaultColor = COLORS[2][1];
  return COLORS[scaleSize][roundedScaleValue] || defaultColor;
}

const colorForBinaryRating = (rating = 0, scaleSize = 10) => {
  let roundedRating = Math.round(rating * 10);
  let defaultColor = COLORS[2][1];
  return COLORS[scaleSize][roundedRating] || defaultColor;
}

export { COLORS, colorForScaleValue, colorForBinaryRating };