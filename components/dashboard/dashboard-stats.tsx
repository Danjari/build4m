"use client"

interface DashboardStatsProps {
  stats: {
    totalForms: number
    publishedForms: number
    totalResponses: number
    draftForms: number
  }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      title: "Total Forms",
      value: stats.totalForms,
      description: "All forms created",
      color: "bg-orange-600",
    },
    {
      title: "Published Forms",
      value: stats.publishedForms,
      description: "Live and collecting responses",
      color: "bg-green-600",
    },
    {
      title: "Total Responses",
      value: stats.totalResponses,
      description: "Across all forms",
      color: "bg-blue-600",
    },
    {
      title: "Draft Forms",
      value: stats.draftForms,
      description: "Not yet published",
      color: "bg-gray-500",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
      {statCards.map((card, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
              <p className="text-sm text-gray-500 mt-1">{card.description}</p>
            </div>
            <div className={`w-12 h-12 ${card.color} rounded-lg`}></div>
          </div>
        </div>
      ))}
    </div>
  )
}
