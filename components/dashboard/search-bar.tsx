import React from "react"

interface SearchBarProps {
  searchQuery: string
  filterStatus: "all" | "published" | "draft"
  onSearchChange: (query: string) => void
  onFilterChange: (status: "all" | "published" | "draft") => void
}

export default function SearchBar({ searchQuery, filterStatus, onSearchChange, onFilterChange }: SearchBarProps) {
  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search your forms..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all duration-200 placeholder:text-gray-400 text-gray-700"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => onFilterChange(e.target.value as "all" | "published" | "draft")}
            className="appearance-none w-full lg:w-auto px-6 py-3.5 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all duration-200 text-gray-700 cursor-pointer pr-12"
          >
            <option value="all" className="py-2">All Forms</option>
            <option value="published" className="py-2">Published</option>
            <option value="draft" className="py-2">Draft</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
