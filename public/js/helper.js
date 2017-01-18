$.fn.serializeObject = function() {
  let result = {};
  $.each(this.serializeArray(), (index, item) => {
    result[item.name] = item.value;
  });
  return result;
}