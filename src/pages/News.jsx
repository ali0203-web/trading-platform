import React from 'react'

export default function News() {
  const newsItems = [
    { time: '14:32', headline: 'AAPL announces Q4 earnings beat', impact: '↑ +2.5%' },
    { time: '14:15', headline: 'Fed signals potential rate cut in Q1', impact: '↑ Market Wide' },
    { time: '13:47', headline: 'Tech sector rallies on AI chip demand', impact: '↑ +3.2%' },
    { time: '13:22', headline: 'Oil prices surge amid supply concerns', impact: '↑ +1.8%' },
    { time: '12:55', headline: 'Earnings season kicks off strong', impact: '↑ +1.2%' },
  ]

  return (
    <div className="page-container">
      <h1>📰 Market News</h1>
      <div className="news-list">
        {newsItems.map((item, idx) => (
          <div key={idx} className="news-item">
            <span className="time">{item.time}</span>
            <span className="headline">{item.headline}</span>
            <span className="impact">{item.impact}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
