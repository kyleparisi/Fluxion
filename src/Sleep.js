async function Sleep(duration) {
  return new Promise(resolve => setTimeout(resolve, duration));
}

module.exports = Sleep;
