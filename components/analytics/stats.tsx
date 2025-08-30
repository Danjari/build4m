"use client"

interface AnalyticsStatsProps {
  stats: {
    total: number
    today: number
    thisWeek: number
    completionRate: number
  }
}

export function AnalyticsStats({ stats }: AnalyticsStatsProps) {
  const statCards = [
    {
      title: "Total Responses",
      value: stats.total,
      description: "All time responses",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Today",
      value: stats.today,
      description: "Responses today",
      color: "from-green-500 to-green-600",
    },
    {
      title: "This Week",
      value: stats.thisWeek,
      description: "Responses this week",
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "Completion Rate",
      value: `${stats.completionRate}%`,
      description: "Form completion rate",
      color: "from-purple-500 to-purple-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
              <p className="text-sm text-gray-500 mt-1">{card.description}</p>
            </div>
            <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-lg`}></div>
          </div>
        </div>
      ))}
    </div>
  )
}
