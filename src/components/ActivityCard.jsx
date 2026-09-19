import { Link } from 'react-router-dom'
import { IconBall, IconCalendar, IconClock, IconPin, IconUsers } from './Icons'
import { formatDate, formatRupiah, formatTimeRange } from '../utils/format'

// Palet aksen dirotasi per kartu biar grid-nya nggak monoton satu warna semua.
const ACCENTS = ['card--accent-orange', 'card--accent-lime', 'card--accent-ink']

export default function ActivityCard({ activity, index = 0 }) {
  const accent = ACCENTS[index % ACCENTS.length]
  const category = activity.sport_category?.name || activity.category?.name
  const city = activity.city?.name

  return (
    <Link to={`/aktivitas/${activity.id}`} className={`activity-card ${accent}`}>
      <div className="activity-card__top">
        <span className="activity-card__category">
          <IconBall width={16} height={16} /> {category || 'Olahraga'}
        </span>
        <span className="activity-card__price">{formatRupiah(activity.price)}</span>
      </div>

      <h3 className="activity-card__title">{activity.title}</h3>

      <div className="activity-card__meta">
        <span>
          <IconPin width={15} height={15} /> {city || activity.address || 'Lokasi belum diisi'}
        </span>
        <span>
          <IconCalendar width={15} height={15} /> {formatDate(activity.activity_date)}
        </span>
        <span>
          <IconClock width={15} height={15} /> {formatTimeRange(activity.start_time, activity.end_time)}
        </span>
      </div>

      <div className="activity-card__bottom">
        <span className="activity-card__slot">
          <IconUsers width={15} height={15} /> {activity.slot ?? '-'} slot
        </span>
        <span className="activity-card__cta">Gas Join →</span>
      </div>
    </Link>
  )
}
