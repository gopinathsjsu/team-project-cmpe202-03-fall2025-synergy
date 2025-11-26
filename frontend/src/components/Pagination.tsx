import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  pageSize: number
  onPageSizeChange: (size: number) => void
  totalElements: number
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  totalElements,
}: PaginationProps) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 7

    if (totalPages <= maxVisible) {
      // Show all pages if total pages is less than max visible
      for (let i = 0; i < totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(0)

      if (currentPage <= 3) {
        // Near the start
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages - 1)
      } else if (currentPage >= totalPages - 4) {
        // Near the end
        pages.push('ellipsis')
        for (let i = totalPages - 5; i < totalPages; i++) {
          pages.push(i)
        }
      } else {
        // In the middle
        pages.push('ellipsis')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages - 1)
      }
    }

    return pages
  }

  const startItem = currentPage * pageSize + 1
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements)

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Page size selector - Left side */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <label htmlFor="pageSize" className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Show:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all cursor-pointer min-w-[90px] shadow-sm"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm text-gray-600 whitespace-nowrap">
            per page
          </span>
        </div>

        {/* Page info - Center (hidden on small screens) */}
        <div className="hidden md:block text-sm text-gray-600 flex-shrink-0">
          <span className="font-medium text-gray-700">{startItem}</span> to{' '}
          <span className="font-medium text-gray-700">{endItem}</span> of{' '}
          <span className="font-medium text-gray-700">{totalElements}</span> products
        </div>

        {/* Pagination controls - Right side */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {/* Previous button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="p-2.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-all duration-200 flex items-center justify-center min-w-[44px] h-10 shadow-sm"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>

          {/* Page numbers */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            {getPageNumbers().map((page, index) => {
              if (page === 'ellipsis') {
                return (
                  <span 
                    key={`ellipsis-${index}`} 
                    className="px-2 py-1 text-gray-400 font-medium"
                  >
                    ...
                  </span>
                )
              }

              const pageNum = page as number
              const isActive = pageNum === currentPage

              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`min-w-[44px] h-10 px-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-md hover:bg-primary-700'
                      : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm'
                  }`}
                  aria-label={`Go to page ${pageNum + 1}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {pageNum + 1}
                </button>
              )
            })}
          </div>

          {/* Next button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            className="p-2.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-all duration-200 flex items-center justify-center min-w-[44px] h-10 shadow-sm"
            aria-label="Next page"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Mobile page info - shown only on small screens */}
      <div className="md:hidden text-center mt-4 text-sm text-gray-600">
        <span className="font-medium text-gray-700">{startItem}</span> to{' '}
        <span className="font-medium text-gray-700">{endItem}</span> of{' '}
        <span className="font-medium text-gray-700">{totalElements}</span> products
      </div>
    </div>
  )
}

export default Pagination

