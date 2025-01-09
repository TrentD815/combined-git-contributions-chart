const COLOR_MAP = {
  0: "#ebedf0",
  1: "#9be9a8",
  2: "#40c463",
  3: "#30a14e",
  4: "#216e39"
}

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
    const { date, count, color, intensity } = item
    if (combined[date]) {
      combined[date].count += 1
      let temp = parseInt(combined[date].intensity)
      if (temp < 4) {
        //TODO: Change intensity calculation to be quartiles instead of just +1
        temp += 1
        combined[date].intensity = temp.toString()
        combined[date].color = COLOR_MAP[temp]
      }
      else {
        combined[date].intensity = '4'
        combined[date].color = COLOR_MAP[4]
      }
    } else {
      combined[date] = { date, count, color, intensity }
    }
  })
  return Object.values(combined);
}

// Combine years across different VCS
const combineYears = (years) => {
  const combined = {};
  years.forEach(item => {
    const { year, total } = item
    if (combined[year]) {
      combined[year].total += total
    } else {
      combined[year] = {
        year,
        total,
        range: {
          start: `${year}-01-01`,
          end: `${year}-12-31`
        }
      }
    }
  })
  return Object.values(combined).sort((a, b) => b.year - a.year)
}

module.exports = {
  summarizeContributions,
  combineDuplicates,
  combineYears
}