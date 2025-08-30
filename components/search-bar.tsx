"use client"

interface SearchBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  filterStatus: "all" | "published" | "draft"
  onFilterChange: (status: "all" | "published" | "draft") => void
}

export function SearchBar({ searchQuery, onSearchChange, filterStatus, onFilterChange }: SearchBarProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search forms by title or description..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => onFilterChange(e.target.value as "all" | "published" | "draft")}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
          >
            <option value="all">All Forms</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>
    </div>
  )
}
