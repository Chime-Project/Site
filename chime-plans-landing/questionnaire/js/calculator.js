
function calculateResults(weight){
  return {
    month3: Math.round(weight * 0.92),
    year1:  Math.round(weight * 0.80)
  };
}
