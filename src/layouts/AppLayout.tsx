import { Outlet } from 'react-router-dom'

export function AppLayout() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4
                 bg-[#f7f8fa]
                 bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2760%27%20height=%2760%27%20viewBox=%270%200%2060%2060%27%3E%3Cg%20fill=%27none%27%20fill-rule=%27evenodd%27%3E%3Cg%20fill=%27%23d1d5db%27%20fill-opacity=%270.25%27%3E%3Cpath%20d=%27M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%27/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]
                 bg-repeat"
    >
      <div className="w-full max-w-5xl h-[90vh] bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
        <Outlet />
      </div>
    </div>
  )
}