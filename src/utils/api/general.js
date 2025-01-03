// Match the 'year' parameter seen in fetch.js for the Github API call without any html manipulation
const summarizeContributions = (contributions) => {
  const years = {}
  contributions.forEach(item => {
    const year = item.date.split("-")[0]
    if (!years[year]) {
      const range = {
        start: `${year}-01-01`,
        end: `${year}-12-31`
      }
      years[year] = { year: year, total: 0, range: range }
    }
    years[year].total += 1
  })
  return Object.values(years).sort((a, b) => b.year - a.year)
}

// Combine duplicate commits returned from VCS API and adjust color intensity accordingly
const combineDuplicates = (data) => {
  const combined = {}
  data.forEach(item => {
    const { date, intensity } = item
    if (combined[date]) {
      if (combined[date].intensity < 4) {
        //TODO: Change intensity calculation to be quartiles instead of just +1
        combined[date].intensity += 1;
      }
    } else {
      combined[date] = { date, intensity }
    }
  })
  return Object.values(combined);
}

module.exports = {
  summarizeContributions,
  combineDuplicates
}