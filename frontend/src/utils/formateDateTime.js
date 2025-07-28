export const SimpleDateMonthDay = date => {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export const SimpleTime = time => {
  const d = new Date(time)
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

export const SimpleDateAndTime = dateTime => {
  const dateStr = new Date(dateTime).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
  const timeStr = SimpleTime(dateTime)
  return `${dateStr} ${timeStr}`
}
